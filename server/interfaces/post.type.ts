enum status { published, drafted }
enum order { ASC, DESC }
export interface Post {
    id?: number;
    title?: string;
    primary_tag?: number;
    meta_title?: string;
    slug?: string;
    created_by?: number;
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
    preview_url?: string;
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

export interface SearchQuery {
    limit_fields?: string;
    search?: string;
    page?: number;
    limit?: number;
    status?: status,
    order?: order,
    sort_field?: string,
    with_table?: string,
    by_slug?: boolean
}

export interface GetResponse {
    primary_tag?: number,
    slug?: string,
    created_by?: string,
    published_by?: string,
    html?: string,
    mobiledoc?: mobiledoc
}
