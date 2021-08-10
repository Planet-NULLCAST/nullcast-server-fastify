
export type UserStatus = 
'Active' | 
'Inactive'

export interface User {
    id?: string;
    entityId?: string;
    userName: string;
    fullName: string;
    email: string;
    password: string;
    salt: string;
    createdAt: string;
    updatedAt: string;
    coverImage?: string;
    bio?: string;
    status?: UserStatus,
    slug?: string;
    primaryBadge?: number;
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