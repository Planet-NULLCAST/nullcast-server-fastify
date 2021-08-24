enum status { published=1, draft=2 }
enum order { ASC, DESC }
export interface Post {
    id?: number;
    primary_tag?: number;
    slug?: string;
    created_by?: string;
    published_by?: string;
    html: string,
    mobiledoc: mobiledoc
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
    sort_field?: string
}

export interface GetResponse {
    primary_tag?: number,
    slug?: string,
    created_by?: string,
    published_by?: string,
    html?: string,
    mobiledoc?: mobiledoc
}
