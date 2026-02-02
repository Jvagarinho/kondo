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
  isAdmin: boolean;
  condominiumId: string | null;
  signUp: (email: string, password: string, name: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
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
