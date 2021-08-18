
export type UserStatus =
'active' |
'inactive'

// export interface User {
//     id?: number;
//     entityId?: number;
//     userName: string;
//     fullName: string;
//     email: string;
//     password: string;
//     salt: string;
//     createdAt: string;
//     updatedAt: string;
//     coverImage?: string;
//     bio?: string;
//     status?: UserStatus,
//     slug?: string;
//     primaryBadge?: number;
// }

export interface User {
    id?: number,
    entity_id?: number;
    password?: string;
    user_name: string;
    full_name: string;
    email: string;
    salt?:string;
    created_at?: string;
    updated_at?: string;
    bio?: string;
    status?: UserStatus;
    slug: string;
    primary_badge: number;
    cover_image?: string
}

export type CreateUserQuery = User

export interface ValidateUser  {
    user_name: string;
}

export interface UpdateUser {
    user_name: string;
    full_name: string;
    email: string;
    updated_at?: string;
    bio?: string;
    status?: UserStatus;
    slug: string;
    cover_image?: string
}

export interface DeleteUser {
    id: number;
}
