CREATE TABLE IF NOT EXISTS badges (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar(64) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    avatar varchar(512),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by UUID,
    created_by UUID
);
CREATE TABLE IF NOT EXISTS entity (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar(64) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_by UUID,
    created_by UUID
);
CREATE TABLE IF NOT EXISTS tags (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar(64) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    meta_title varchar(255),
    meta_description TEXT,
    feature_image varchar(512),
    slug varchar(255),
    visibilty varchar(10) NOT NULL DEFAULT 'public',
    status varchar(10) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by UUID ,
    created_by UUID NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_id UUID NOT NULL REFERENCES entity (id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_name varchar(64) NOT NULL UNIQUE,
    full_name varchar(64) NOT NULL,
    email varchar(64) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    cover_image varchar(512),
    avatar varchar(512),
    bio TEXT,
    status varchar(10) NOT NULL DEFAULT 'active',
    visibilty varchar(10) NOT NULL DEFAULT 'public',
    last_active TIMESTAMP WITH TIME ZONE,
    dob TIMESTAMP WITH TIME ZONE,
    primary_badge UUID NOT NULL REFERENCES badges (id) ON DELETE CASCADE ON UPDATE CASCADE,
    meta_title varchar(255),
    meta_description TEXT,
    twitter varchar(255),
    facebook varchar(255),
    discord varchar(255),
    location TEXT,
    slug varchar(255) NOT NULL,
    locale varchar(10),
    website varchar(255),
    followers_count integer NOT NULL DEFAULT 0,
    following_count integer NOT NULL DEFAULT 0,
    blog_count integer NOT NULL DEFAULT 0,
    points jsonb,
    styled_classes jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by UUID,
    created_by UUID
);
CREATE TABLE IF NOT EXISTS roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name varchar(64) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by UUID,
    created_by UUID
);
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    role_id UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID
);
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    badge_id UUID NOT NULL REFERENCES badges (id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID
);
CREATE TABLE IF NOT EXISTS posts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    mobiledoc jsonb,
    status varchar(10) NOT NULL DEFAULT 'drafted',
    visibilty varchar(10) NOT NULL DEFAULT 'public',
    featured boolean NOT NULL DEFAULT FALSE,
    locale varchar(10),
    canonical_url varchar(255),
    preview_url varchar(255),
    banner_image varchar(255),
    primary_tag UUID NOT NULL REFERENCES tags (id) ON DELETE CASCADE ON UPDATE CASCADE,
    meta_title varchar(255),
    meta_description TEXT,
    og_image varchar(255),
    og_title varchar(255),
    og_description TEXT,
    html TEXT,
    type varchar(255) NOT NULL DEFAULT 'blog',
    slug varchar(255) NOT NULL,
    custom_excerpt varchar(255),
    viewers jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    published_at TIMESTAMP WITH TIME ZONE,
    updated_by UUID REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_by UUID REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    published_by UUID REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS post_votes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    value smallint, 
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE TABLE IF NOT EXISTS post_tags (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE,
    tag_id UUID NOT NULL REFERENCES tags (id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    created_by UUID
);
CREATE TABLE IF NOT EXISTS post_authors (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE,
    author_id UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);