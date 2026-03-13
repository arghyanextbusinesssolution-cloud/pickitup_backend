"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repository_1 = require("./user.repository");
class UserService {
    async findById(id) {
        return user_repository_1.userRepository.findById(id);
    }
    async updateProfile(id, data) {
        return user_repository_1.userRepository.update(id, data);
    }
}
exports.UserService = UserService;
