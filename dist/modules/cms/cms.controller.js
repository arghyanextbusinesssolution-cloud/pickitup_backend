"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmsController = exports.CMSController = void 0;
const cms_service_1 = require("./cms.service");
const cmsService = new cms_service_1.CMSService();
class CMSController {
    async get(req, res) {
        try {
            const result = await cmsService.getContent(req.params.key);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async update(req, res) {
        try {
            const { content } = req.body;
            const result = await cmsService.updateContent(req.params.key, content);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
exports.CMSController = CMSController;
exports.cmsController = new CMSController();
