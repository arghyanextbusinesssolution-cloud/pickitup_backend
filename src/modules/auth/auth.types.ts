export interface RegisterDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    role: 'SHIPPER' | 'CARRIER' | 'ADMIN' | 'USER';
    companyName?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}
