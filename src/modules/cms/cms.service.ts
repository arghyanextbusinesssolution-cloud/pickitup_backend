import { cmsRepository } from './cms.repository';
import { CreateBlogDto, UpdateBlogDto } from './cms.types';

export class CMSService {
    async getContent(key: string) {
        return cmsRepository.getContent(key);
    }

    async updateContent(key: string, content: string) {
        return cmsRepository.updateContent(key, content);
    }

    // Blog Methods
    async createBlog(data: CreateBlogDto, authorId: string) {
        const slug = this.generateSlug(data.title);
        return cmsRepository.createBlogPost({ ...data, slug, authorId });
    }

    async getAllBlogs(publishedOnly = true) {
        return cmsRepository.getBlogPosts(publishedOnly);
    }

    async getBlogBySlug(slug: string) {
        const blog = await cmsRepository.getBlogPostBySlug(slug);
        if (!blog) throw new Error('Blog post not found');
        return blog;
    }

    async getBlogById(id: string) {
        const blog = await cmsRepository.getBlogPostById(id);
        if (!blog) throw new Error('Blog post not found');
        return blog;
    }

    async updateBlog(id: string, data: UpdateBlogDto) {
        let slug = undefined;
        if (data.title) {
            slug = this.generateSlug(data.title);
        }
        return cmsRepository.updateBlogPost(id, { ...data, slug });
    }

    async deleteBlog(id: string) {
        return cmsRepository.deleteBlogPost(id);
    }

    private generateSlug(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }
}
