"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateMiddleware = void 0;
const zod_1 = require("zod");
const validateMiddleware = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    message: 'Validation failed',
                    errors: error.issues,
                });
            }
            next(error);
        }
    };
};
exports.validateMiddleware = validateMiddleware;
