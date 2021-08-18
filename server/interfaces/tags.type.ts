
export type TagsStatus = 'active' | 'inactive'
export type TagsVisibility = 'public' | 'private'

export interface Tag {
    id: number;
    name: string;
    description?: string;
    meta_title?: string;
    meta_description?: string;
    feature_image?: string;
    slug: string;
    visibility: TagsVisibility;
    status: TagsStatus;
    created_at: string;
    updated_at: string;
    created_by: number;
    updated_by?: number;
}
