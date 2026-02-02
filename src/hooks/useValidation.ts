import { useState, useCallback } from 'react';
import { z } from 'zod';

interface UseValidationOptions<T> {
  schema: z.ZodSchema<T>;
  initialData: T;
}

interface ValidationErrors {
  [key: string]: string;
}

export function useValidation<T>({ schema, initialData }: UseValidationOptions<T>) {
  const [data, setData] = useState<T>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateField = useCallback((name: keyof T, value: any) => {
    if (!(schema instanceof z.ZodObject)) return false;

    try {
      schema.shape[name as string].parse(value);
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name as string];
        return newErrors;
      });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({
          ...prev,
          [name as string]: error.issues[0].message
        }));
        return false;
      }
      return false;
    }
  }, [schema]);

  const validateAll = useCallback(() => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: ValidationErrors = {};
        error.issues.forEach((err) => {
          if (err.path.length > 0) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [schema, data]);

  const updateField = useCallback((name: keyof T, value: any) => {
    setData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  }, [validateField]);

  const reset = useCallback(() => {
    setData(initialData);
    setErrors({});
  }, [initialData]);

  const isValid = Object.keys(errors).length === 0;

  return {
    data,
    errors,
    updateField,
    validateAll,
    reset,
    isValid,
    setData
  };
}
