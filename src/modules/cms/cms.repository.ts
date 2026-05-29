import prisma from '../../config/db';
import { CreateBlogDto, UpdateBlogDto } from './cms.types';

export class CMSRepository {
    async getContent(key: string) {
        console.log('Fetching CMS content for key', key);
        return { key, content: 'Placeholder content' };
    }

    async updateContent(key: string, content: string) {
        console.log('Updating CMS content', { key, content });
        return { key, content };
    }

    // Blog Methods
    async createBlogPost(data: CreateBlogDto & { slug: string; authorId: string }) {
        return (prisma as any).blogPost.create({
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
    }

    async getBlogPosts(publishedOnly = true) {
        return (prisma as any).blogPost.findMany({
            where: publishedOnly ? { published: true } : {},
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async getBlogPostBySlug(slug: string) {
        return (prisma as any).blogPost.findUnique({
            where: { slug },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
    }

    async getBlogPostById(id: string) {
        return (prisma as any).blogPost.findUnique({
            where: { id },
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
    }

    async updateBlogPost(id: string, data: UpdateBlogDto & { slug?: string }) {
        return (prisma as any).blogPost.update({
            where: { id },
            data,
            include: {
                author: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true
                    }
                }
            }
        });
    }

    async deleteBlogPost(id: string) {
        return (prisma as any).blogPost.delete({
            where: { id }
        });
    }
}

export const cmsRepository = new CMSRepository();
