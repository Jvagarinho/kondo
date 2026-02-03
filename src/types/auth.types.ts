export interface User {
  id: string;
  email?: string;
  user_metadata: {
    name?: string;
    full_name?: string;
    [key: string]: any;
  };
}

 export interface AuthContextType {
   currentUser: User | null;
   session: any;
   isAdmin: boolean;
   condominiumId: string | null;
   emailVerified: boolean;
   signUp: (email: string, password: string, name: string) => Promise<User>;
   login: (email: string, password: string) => Promise<User>;
   logout: () => Promise<void>;
   sendVerificationEmail: () => Promise<void>;
   changePassword: (newPassword: string) => Promise<void>;
   updateProfile: (updates: Partial<User>) => Promise<User>;
 }

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
  code?: string;
}
