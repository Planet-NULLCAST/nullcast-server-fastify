import { Chapter, ChapterStructure } from './chapter.type';

export interface Course {
    id?: number;
    name: string;
    certificate_id: number;
    created_by?: number;
    slug?: string;
}

export interface CourseStructure {
    courseId?: number;
    courseName?: string;
    courseUrl?: string;

    id?: number;
    name?: string;
    certificate_id?: number;
    created_by?: number;
    slug?: string;
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

export interface CourseChapterStructure extends CourseStructure {
    chapters: ChapterStructure[];
}
