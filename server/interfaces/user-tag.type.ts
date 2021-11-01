export interface UserTag {
    user_id?: number;
    tag_id: number;
    created_at?: string;
    created_by?: number;
}

export interface UpdateUserTag {
    tag_id?: number;
}
