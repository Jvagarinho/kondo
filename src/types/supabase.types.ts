export interface Database {
  public: {
    Tables: {
      kondo_users: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          address: string | null;
          role: 'admin' | 'user';
          condominium_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['kondo_users']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['kondo_users']['Insert']>;
      };
      kondo_condominiums: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['kondo_condominiums']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['kondo_condominiums']['Insert']>;
      };
      kondo_notices: {
        Row: {
          id: string;
          title: string;
          content: string;
          urgent: boolean;
          author_id: string;
          condominium_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['kondo_notices']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['kondo_notices']['Insert']>;
      };
      kondo_documents: {
        Row: {
          id: string;
          name: string;
          file_path: string;
          uploaded_by: string;
          condominium_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['kondo_documents']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['kondo_documents']['Insert']>;
      };
      kondo_payments: {
        Row: {
          id: string;
          owner_id: string;
          owner_name: string;
          unit: string;
          month: string;
          amount: number;
          status: 'Pending' | 'Paid';
          condominium_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['kondo_payments']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['kondo_payments']['Insert']>;
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T];
export type Row<T extends keyof Database['public']['Tables']> = Tables<T>['Row'];
export type Insert<T extends keyof Database['public']['Tables']> = Tables<T>['Insert'];
export type Update<T extends keyof Database['public']['Tables']> = Tables<T>['Update'];
