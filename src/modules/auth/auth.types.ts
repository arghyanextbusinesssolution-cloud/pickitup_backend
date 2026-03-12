export interface RegisterDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: 'USER' | 'CARRIER' | 'ADMIN';
    companyName?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}
