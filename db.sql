CREATE TABLE IF NOT EXISTS badges (
    id INTEGER GENERATED ALWAYS AS IDENTITY (MINVALUE 10000000 START WITH 10000000 CACHE 200) PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    avatar VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by INTEGER,
    created_by INTEGER
);
CREATE TABLE IF NOT EXISTS entity (
    id INTEGER GENERATED ALWAYS AS IDENTITY (MINVALUE 10000000 START WITH 10000000 CACHE 200) PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by INTEGER,
    created_by INTEGER
);
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER GENERATED ALWAYS AS IDENTITY (MINVALUE 10000000 START WITH 10000000 CACHE 200) PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    description TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    feature_image VARCHAR(512),
    slug VARCHAR(255) NOT NULL,
    visibility VARCHAR(10) DEFAULT 'public',
    status VARCHAR(10) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by INTEGER,
    created_by INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS users (
    id INTEGER GENERATED ALWAYS AS IDENTITY (MINVALUE 10000000 START WITH 10000000 CACHE 200) PRIMARY KEY,
    entity_id INTEGER NOT NULL REFERENCES entity (id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_name VARCHAR(64) NOT NULL UNIQUE,
    full_name VARCHAR(64) NOT NULL,
    email VARCHAR(64) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    cover_image VARCHAR(512),
    avatar VARCHAR(512),
    bio TEXT,
    status VARCHAR(10) DEFAULT 'active',
    visibility VARCHAR(10) DEFAULT 'public',
    last_active TIMESTAMP WITH TIME ZONE,
    dob DATE,
    primary_badge INTEGER NOT NULL REFERENCES badges (id) ON DELETE CASCADE ON UPDATE CASCADE,
    meta_title VARCHAR(255),
    meta_description TEXT,
    twitter VARCHAR(255),
    facebook VARCHAR(255),
    github VARCHAR(255),
    discord VARCHAR(255),
    linkedin VARCHAR(255),
    location TEXT,
    slug VARCHAR(255) NOT NULL,
    locale VARCHAR(10),
    website VARCHAR(255),
    followers_count integer DEFAULT 0,
    following_count integer DEFAULT 0,
    blog_count integer DEFAULT 0,
    points jsonb,
    styled_classes jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by INTEGER,
    created_by INTEGER
);
CREATE TABLE IF NOT EXISTS roles (
    id INTEGER GENERATED ALWAYS AS IDENTITY (MINVALUE 10000000 START WITH 10000000 CACHE 200) PRIMARY KEY,
    name VARCHAR(64) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_by INTEGER,
    created_by INTEGER
);
CREATE TABLE IF NOT EXISTS user_roles (
    role_id INTEGER NOT NULL REFERENCES roles (id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by INTEGER,
    PRIMARY KEY(user_id, role_id)
);
CREATE TABLE IF NOT EXISTS user_badges (
    badge_id INTEGER NOT NULL REFERENCES badges (id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by INTEGER,
    PRIMARY KEY(user_id, badge_id)
);
CREATE TABLE IF NOT EXISTS user_tags (
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags (id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by INTEGER,
    PRIMARY KEY(user_id, tag_id)
);
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER GENERATED ALWAYS AS IDENTITY (MINVALUE 10000000 START WITH 10000000 CACHE 200) PRIMARY KEY,
    mobiledoc jsonb,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(10) DEFAULT 'drafted',
    visibility VARCHAR(10) DEFAULT 'public',
    featured boolean DEFAULT FALSE,
    locale VARCHAR(10),
    canonical_url VARCHAR(255),
    preview_url VARCHAR(255),
    banner_image VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description TEXT,
    og_image VARCHAR(255),
    og_title VARCHAR(255),
    og_description TEXT,
    html TEXT,
    type VARCHAR(255) DEFAULT 'blog',
    slug VARCHAR(255) UNIQUE,
    custom_excerpt VARCHAR(255),
    viewers jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    published_at TIMESTAMP WITH TIME ZONE,
    updated_by INTEGER,
    created_by INTEGER REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    published_by INTEGER
);
CREATE TABLE IF NOT EXISTS post_votes (
    post_id INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    value SMALLINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY(post_id, user_id)
);
CREATE TABLE IF NOT EXISTS post_tags (
    post_id INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags (id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by INTEGER,
    PRIMARY KEY(post_id, tag_id)
);
CREATE TABLE IF NOT EXISTS post_authors (
    post_id INTEGER NOT NULL REFERENCES posts (id) ON DELETE CASCADE ON UPDATE CASCADE,
    author_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY(post_id, author_id)
);
CREATE TABLE IF NOT EXISTS certificates (
    id INTEGER GENERATED ALWAYS AS IDENTITY (MINVALUE 10000000 START WITH 10000000 CACHE 200) PRIMARY KEY,
    name VARCHAR(255),
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by INTEGER,
    updated_by INTEGER
);
CREATE TABLE IF NOT EXISTS courses (
    id INTEGER GENERATED ALWAYS AS IDENTITY (MINVALUE 10000000 START WITH 10000000 CACHE 200) PRIMARY KEY,
    certificate_id INTEGER REFERENCES certificates (id) NOT NULL,
    name VARCHAR(255) NOT NULL UNIQUE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by INTEGER,
    updated_by INTEGER
);
CREATE TABLE IF NOT EXISTS course_chapters (
    id INTEGER GENERATED ALWAYS AS IDENTITY (MINVALUE 10000000 START WITH 10000000 CACHE 200) PRIMARY KEY,
    chapter_no INTEGER NOT NULL,
    course_id INTEGER REFERENCES courses (id) ON DELETE CASCADE ON UPDATE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by INTEGER,
    updated_by INTEGER,
    CONSTRAINT course_chapter UNIQUE(course_id, name)
);
CREATE TABLE IF NOT EXISTS user_chapters(
    course_id INTEGER NOT NULL REFERENCES courses (id) ON DELETE CASCADE ON UPDATE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    chapter_id INTEGER NOT NULL REFERENCES course_chapters (id) ON DELETE CASCADE ON UPDATE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by INTEGER,
    updated_by INTEGER,
    PRIMARY KEY(user_id,chapter_id)
);
CREATE TABLE IF NOT EXISTS user_courses(
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses (id) ON DELETE CASCADE ON UPDATE CASCADE,
    status VARCHAR(255) DEFAULT 'in_progress',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by INTEGER,
    updated_by INTEGER,
    PRIMARY KEY(user_id, course_id)
);
CREATE TABLE IF NOT EXISTS followers(
    follower_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    following_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by INTEGER,
    updated_by INTEGER,
    PRIMARY KEY(follower_id, following_id)
);
CREATE TABLE IF NOT EXISTS events (
    id INTEGER GENERATED ALWAYS AS IDENTITY (MINVALUE 10000000 START WITH 10000000 CACHE 200) PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    title VARCHAR(255) NOT NULL,
    guest_name VARCHAR(255),
    guest_designation VARCHAR(255),
    guest_image TEXT,
    registration_link TEXT,
    guest_bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by INTEGER REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE,
    updated_by INTEGER,
    published_at TIMESTAMP WITH TIME ZONE,
    published_by INTEGER,
    event_time TIMESTAMP WITH TIME ZONE,
    location TEXT,
    status VARCHAR(10) DEFAULT 'drafted',
    visibility VARCHAR(10) DEFAULT 'public',
    featured boolean DEFAULT FALSE,
    locale VARCHAR(10),
    canonical_url VARCHAR(255),
    primary_tag INTEGER,
    preview_url VARCHAR(255),
    banner_image VARCHAR(255),
    meta_title VARCHAR(255),
    meta_description VARCHAR(1234),
    og_image VARCHAR(255),
    og_title VARCHAR(255),
    og_description VARCHAR(1234),
    description TEXT,
    type VARCHAR(255),
    custom_excerpt VARCHAR(2000),
    slug VARCHAR(255),
    viewers jsonb
);
CREATE TABLE IF NOT EXISTS subscribers(
    id INTEGER GENERATED ALWAYS AS IDENTITY (MINVALUE 10000000 START WITH 10000000 CACHE 200) PRIMARY KEY,
    email VARCHAR(64) NOT NULL UNIQUE,
    last_notified TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
INSERT INTO entity (name, description)
VALUES ('nullcast', 'Nullcast is an open-source tech community');
INSERT INTO tags (name, description, meta_title, slug, created_by)
VALUES ('primary', 'some description', 'primary', 'primary', 12343);
INSERT INTO badges (name, description)
VALUES ('noob', 'Just getting started!');
INSERT INTO roles (name, description)
VALUES ('admin', 'Admin access'), ('user', 'No admin access');