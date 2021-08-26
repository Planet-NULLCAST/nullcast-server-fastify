export interface Post {
    id?: number;
    primary_tag?: number;
    slug?: string;
    created_by?: string;
    published_by?: string;
    html?: string,
    mobiledoc?: mobiledoc,
    status?: string;
    visibilty?: string;
    featured?: string;
    banner_image?: string;
    type?: string;
    updated_at?: string;
    published_at?: string;
    updated_by?: number;
}

export interface mobiledoc {
    version: string,
    ghostVersion: string,
    markups: any[],
    atoms: any [],
    sections: any []
}

export interface UpdatePost {
    id?: number;
    slug?: string;
}

export interface DeletePost {
    id: number;
}
