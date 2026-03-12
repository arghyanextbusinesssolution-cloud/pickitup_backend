import { cmsRepository } from './cms.repository';

export class CMSService {
    async getContent(key: string) {
        return cmsRepository.getContent(key);
    }

    async updateContent(key: string, content: string) {
        return cmsRepository.updateContent(key, content);
    }
}
