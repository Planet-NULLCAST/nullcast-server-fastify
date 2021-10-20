export interface UserChapter {
    course_id: number;
    user_id: number;
    chapter_id: number;
    created_by?: number;
    completed_at?: string;
}

export interface UpdateUserChapter {
    chapter_id?: number;
    completed_at?: string;
    updated_at?: string;
    updated_by?: number;
}

export interface UserChapterProgress {
    course_id: number;
    user_id: number;
}

export interface UserChapterProgressCount{
    total: number;
    completed: number;
}
