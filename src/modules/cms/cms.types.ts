export interface CreateBlogDto {
    title: string;
    content: string;
    excerpt?: string;
    coverImage?: string;
    published?: boolean;
}

export interface UpdateBlogDto {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    published?: boolean;
}

export interface BlogPostResponse {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    coverImage: string | null;
    published: boolean;
    authorId: string;
    author?: {
        id: string;
        firstName: string | null;
        lastName: string | null;
    };
    createdAt: Date;
    updatedAt: Date;
}
