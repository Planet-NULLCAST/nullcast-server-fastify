
export type UserStatus = 
'Active' | 
'Inactive'

export interface User {
    id?: string;
    entity_id?: string;
    user_name: string;
    full_name: string;
    email: string;
    password: string;
    salt: string;
    created_at: string;
    updated_at: string;
    cover_image?: string;
    bio?: string;
    status?: UserStatus,
    slug?: string;
    primary_badge?: number;
}

export interface getUserQuery {
    entity_id: string;
    primary_badge: string;
    slug: string,
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
    user_name: string;
    password: string;
}