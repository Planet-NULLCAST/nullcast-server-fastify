export interface Event {
    id?: number;
    primary_tag?: number;
    meta_title?: string;
    title: string;
    guest_name: string;
    guest_designation: string;
    guest_image: string;
    guest_bio: string;
    registration_link: string;
    slug?: string;
    created_by?: number;
    published_by?: string;
    status?: string;
    visibilty?: string;
    featured?: string;
    banner_image?: string;
    type?: string;
    updated_at?: string;
    published_at?: string;
    updated_by?: number;
    event_time?: string;
    location?: string;
    description?: string;
    meta_description?: string,
    user_id?: number;
}
