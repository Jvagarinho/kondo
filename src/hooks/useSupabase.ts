import { supabase } from '../supabase';
import { Row, Insert, Update, Database } from '../types/supabase.types';

type TableName = keyof Database['public']['Tables'];

export const useSupabase = () => {
  const fetchAll = async <T extends TableName>(
    table: T,
    options?: {
      column?: string;
      value?: any;
      orderBy?: { column: string; ascending?: boolean };
      limit?: number;
      offset?: number;
    }
  ): Promise<Row<T>[] | null> => {
    let query = supabase.from(table).select('*');

    if (options?.column && options?.value !== undefined) {
      query = query.eq(options.column, options.value);
    }

    if (options?.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? false
      });
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit ?? 10) - 1);
    }

    const { data, error } = await query;

    if (error) {
      console.error(`Error fetching from ${table}:`, error);
      return null;
    }

    return data as Row<T>[];
  };

  const fetchOne = async <T extends keyof typeof supabase.from>(
    table: T,
    column: string,
    value: any
  ): Promise<Row<T> | null> => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq(column, value)
      .single();

    if (error) {
      console.error(`Error fetching one from ${table}:`, error);
      return null;
    }

    return data as Row<T>;
  };

  const insert = async <T extends keyof typeof supabase.from>(
    table: T,
    record: Insert<T>
  ): Promise<Row<T> | null> => {
    const { data, error } = await supabase
      .from(table)
      .insert([record])
      .select()
      .single();

    if (error) {
      console.error(`Error inserting into ${table}:`, error);
      throw error;
    }

    return data as Row<T>;
  };

  const update = async <T extends keyof typeof supabase.from>(
    table: T,
    record: Update<T>,
    column: string,
    value: any
  ): Promise<Row<T> | null> => {
    const { data, error } = await supabase
      .from(table)
      .update(record)
      .eq(column, value)
      .select()
      .single();

    if (error) {
      console.error(`Error updating ${table}:`, error);
      throw error;
    }

    return data as Row<T>;
  };

  const remove = async <T extends keyof typeof supabase.from>(
    table: T,
    column: string,
    value: any
  ): Promise<boolean> => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq(column, value);

    if (error) {
      console.error(`Error deleting from ${table}:`, error);
      throw error;
    }

    return true;
  };

  const uploadFile = async (
    bucket: string,
    path: string,
    file: File
  ): Promise<{ path: string; error?: string }> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) {
      console.error('Error uploading file:', error);
      return { path: '', error: error.message };
    }

    return { path: data.path };
  };

  const getSignedUrl = async (
    bucket: string,
    path: string,
    expiresIn: number = 60
  ): Promise<{ url: string; error?: string }> => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Error getting signed URL:', error);
      return { url: '', error: error.message };
    }

    return { url: data.signedUrl };
  };

  const deleteFile = async (
    bucket: string,
    paths: string[]
  ): Promise<{ error?: string }> => {
    const { error } = await supabase.storage
      .from(bucket)
      .remove(paths);

    if (error) {
      console.error('Error deleting file:', error);
      return { error: error.message };
    }

    return {};
  };

  return {
    fetchAll,
    fetchOne,
    insert,
    update,
    remove,
    uploadFile,
    getSignedUrl,
    deleteFile
  };
};
