export interface CreateShipmentDto {
    title: string;
    description?: string;
    origin: string;
    destination: string;
    weight?: number;
    dimensions?: string;
}

export interface UpdateShipmentDto {
    title?: string;
    description?: string;
    origin?: string;
    destination?: string;
    weight?: number;
    dimensions?: string;
    status?: 'PENDING' | 'BOOKED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
}
