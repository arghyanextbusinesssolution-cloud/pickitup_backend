import { userRepository } from './user.repository';

export class UserService {
    async findById(id: string) {
        return userRepository.findById(id);
    }

    async updateProfile(id: string, data: any) {
        return userRepository.update(id, data);
    }
}
