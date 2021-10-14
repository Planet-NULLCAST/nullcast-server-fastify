import { Chapter } from "./chapter.type";

export interface Course {
    id?: number;
    name: string;
    certificate_id: number;
    created_by?: number;
}

export interface UpdateCourse {
    name?: string;
    certificate_id?: number;
    updated_at: string;
    updated_by: number;
}

export interface CourseChapter extends Course {
    chapters: Chapter[]
}
