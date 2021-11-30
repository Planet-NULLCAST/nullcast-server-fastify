export type UserStatus = 'active' | 'inactive';

export interface User {
  id?: number;
  entity_id?: number;
  password?: string;
  user_name: string;
  full_name: string;
  avatar?:string;
  banner_image?: string;
  email: string;
  created_at?: string;
  updated_at?: string;
  bio?: string;
  status?: UserStatus;
  slug: string;
  primary_badge: number;
  cover_image?: string;
  roles?: Record<string, unknown>;
  skills?: Record<string, unknown>;
}

export type CreateUserQuery = User;

export interface ValidateUser  {
    email?: string;
    user_name?: string;
    password: string
}

export interface ValidateResponse {
    user_name: string;
    password: string;
    email: string;
    id: string;
    full_name: string;
    avatar: string;
}

export interface UpdateUser {
  user_name?: string;
  full_name: string;
  banner_image?: string;
  email?: string;
  updated_at?: string;
  updated_by?:number;
  bio?: string;
  status?: UserStatus;
  slug: string;
  cover_image?: string;
}

export interface DeleteUser {
  id: number;
}

export interface SignIn {
  email: string;
  password: string;
}
export interface TokenUser {
  user_name: string;
  id: number;
}

export interface cookieData {
    token: string;
    user: any
}

export interface ValidateResetPassword {
  token: string;
  password: string;
}

export interface ResetPasswordPayload {
  hashData: string;
  email: { key: string, value: string };
}

export interface ValidateUpdatePassword {
  email?: string;
  user_name?: string;
  current_password: string;
  new_password: string;
}
