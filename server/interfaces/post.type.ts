export interface Post {
    id?: number;
    primary_tag?: number;
    slug?: string;
    created_by: string;
    published_by: string;
}

export interface UpdatePost {
    id?: number;
    slug?: string;
}

export interface DeletePost {
    id: number;
}
