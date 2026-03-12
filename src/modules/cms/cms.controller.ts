import { Response, Request } from 'express';
import { CMSService } from './cms.service';

const cmsService = new CMSService();

export class CMSController {
    async get(req: Request, res: Response) {
        try {
            const result = await cmsService.getContent(req.params.key as string);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { content } = req.body;
            const result = await cmsService.updateContent(req.params.key as string, content);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
}

export const cmsController = new CMSController();
