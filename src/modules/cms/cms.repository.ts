import prisma from '../../config/db';

export class CMSRepository {
    async getContent(key: string) {
        console.log('Fetching CMS content for key', key);
        return { key, content: 'Placeholder content' };
    }

    async updateContent(key: string, content: string) {
        console.log('Updating CMS content', { key, content });
        return { key, content };
    }
}

export const cmsRepository = new CMSRepository();
