import { Response, Request } from 'express';
import { CMSService } from './cms.service';

const cmsService = new CMSService();

export class CMSController {
    async getContent(req: Request, res: Response) {
        try {
            const key = req.params.key as string;
            const content = await cmsService.getContent(key);
            res.json(content);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateContent(req: Request, res: Response) {
        try {
            const key = req.params.key as string;
            const { content } = req.body;
            const result = await cmsService.updateContent(key, content);
            res.json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    // Blog Methods
    async createBlog(req: Request, res: Response) {
        try {
            const authorId = (req as any).user.id;
            const blog = await cmsService.createBlog(req.body, authorId);
            res.status(201).json(blog);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllBlogs(req: Request, res: Response) {
        try {
            // Admin can see all, public sees only published
            const publishedOnly = req.query.all !== 'true';
            const blogs = await cmsService.getAllBlogs(publishedOnly);
            res.json(blogs);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getBlogBySlug(req: Request, res: Response) {
        try {
            const slug = req.params.slug as string;
            const blog = await cmsService.getBlogBySlug(slug);
            res.json(blog);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async getBlogById(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const blog = await cmsService.getBlogById(id);
            res.json(blog);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async updateBlog(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const blog = await cmsService.updateBlog(id, req.body);
            res.json(blog);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteBlog(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await cmsService.deleteBlog(id);
            res.status(204).end();
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export const cmsController = new CMSController();
