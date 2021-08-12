
export type UserStatus = 
'Active' | 
'Inactive'

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
    primary_badge: string;
    cover_image?: string
}

export interface CreateUserQuery extends User {
    // password: String;
}

export interface ValidateUser  {
    user_name: string;
    password: string;
}