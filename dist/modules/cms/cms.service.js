"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CMSService = void 0;
const cms_repository_1 = require("./cms.repository");
class CMSService {
    async getContent(key) {
        return cms_repository_1.cmsRepository.getContent(key);
    }
    async updateContent(key, content) {
        return cms_repository_1.cmsRepository.updateContent(key, content);
    }
}
exports.CMSService = CMSService;
