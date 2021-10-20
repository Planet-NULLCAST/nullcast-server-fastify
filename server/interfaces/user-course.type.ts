export interface UserCourse {
    id?: number;
    user_id?: number;
    course_id: string;
    created_by?: number;
    status?: string;
    created_at?: string;
    updated_by?: number;
    updated_at?: string;
}

export interface UpdateUserCourse {
    status?: string;
    updated_at?: string;
    updated_by?: number;
}
