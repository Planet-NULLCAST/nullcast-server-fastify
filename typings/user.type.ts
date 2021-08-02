
export type UserStatus = 
'Active' | 
'Inactive'

export interface User {
    id?: number;
    userName: string;
    fullName: string;
    email: string;
    password?: string;
    createdAt: string;
    updatedAt: string;
    coverImage?: string;
    bio?: string;
    status?: UserStatus
}

export interface getUserQuery {
    user_name: string;
    full_name: string;
    email: string;
    created_at: string;
    updated_at: string;
    bio: string;
    status: UserStatus;
}

export interface CreateUserQuery extends getUserQuery {
    password: String;
}

export interface ValidateUser  {
    userName: string;
    password: string;
}