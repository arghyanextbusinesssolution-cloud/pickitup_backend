export interface RegisterDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: 'SHIPPER' | 'CARRIER' | 'ADMIN' | 'USER';
    companyName?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}
