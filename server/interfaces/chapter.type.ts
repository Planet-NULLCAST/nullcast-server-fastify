export interface Chapter {
    name: string;
    course_id?: number;
    slug?: string;
    course_name?: string;
    chapter_no: number;
    created_by?: number;
}

export interface ChapterStructure {
    chapterName?: string;
    chapterUrl?: string;
    chapterId?: number;

    name?: string;
    course_id?: number;
    slug?: string;
    course_name?: string;
    chapter_no?: number;
    created_by?: number;
}

export interface UpdateChapter {
    name: string;
    slug?: string;
    chapter_no: number;
    updated_at: string;
    updated_by: number;
}
