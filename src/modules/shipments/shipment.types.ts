import { z } from 'zod';

export const LocationTypeSchema = z.enum(['RESIDENTIAL', 'BUSINESS', 'WAREHOUSE', 'PORT']);

// 1. BASE SCHEMA (No validation logic)
const shipmentBaseSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    
    // Origin
    originAddress: z.string(),
    originLatitude: z.number(),
    originLongitude: z.number(),
    originPlaceId: z.string().optional(),
    originCity: z.string().optional(),
    originState: z.string().optional(),
    originCountry: z.string().optional(),
    originPostalCode: z.string().optional(),

    // Destination
    destinationAddress: z.string(),
    destinationLatitude: z.number(),
    destinationLongitude: z.number(),
    destinationPlaceId: z.string().optional(),
    destinationCity: z.string().optional(),
    destinationState: z.string().optional(),
    destinationCountry: z.string().optional(),
    destinationPostalCode: z.string().optional(),

    // Logistics
    distanceKm: z.number().optional(),
    estimatedTimeMin: z.number().optional(),
    
    category: z.string().optional(),
    weight: z.number().optional(),
    weightUnit: z.string().default('kg'),
    
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    dimensionUnit: z.string().default('cm'),

    pickupDate: z.string().or(z.date()).optional(),
    deliveryDate: z.string().or(z.date()).optional(),
    isFlexiblePickup: z.boolean().default(false),
    isFlexibleDelivery: z.boolean().default(false),

    // Pricing
    budgetMin: z.number().nullable().optional(),
    budgetMax: z.number().nullable().optional(),

    // Logistics Detail
    pickupType: LocationTypeSchema.default('RESIDENTIAL'),
    deliveryType: LocationTypeSchema.default('RESIDENTIAL'),
    pickupNotes: z.string().optional(),
    deliveryNotes: z.string().optional(),
    hasElevatorPickup: z.boolean().optional(),
    hasElevatorDelivery: z.boolean().optional(),
    pickupFloor: z.number().optional(),
    deliveryFloor: z.number().optional(),
    
    specialRequirements: z.string().optional(),
    isPalletized: z.boolean().default(false),
    isCrated: z.boolean().default(false),
});

// 2. CREATE SCHEMA (With strict refinement)
export const CreateShipmentSchema = shipmentBaseSchema.refine((data) => {
    // Business Rule: Budget Min must be <= Budget Max
    if (data.budgetMin && data.budgetMax) {
        return data.budgetMin <= data.budgetMax;
    }
    return true;
}, {
    message: "Budget minimum cannot be greater than maximum",
    path: ["budgetMin"]
}).refine((data) => {
    // Business Rule: Origin cannot be same as Destination
    return data.originAddress !== data.destinationAddress;
}, {
    message: "Origin and Destination must be different",
    path: ["destinationAddress"]
});

export type CreateShipmentDto = z.infer<typeof CreateShipmentSchema>;

// 3. UPDATE SCHEMA (Safe partial with superRefine)
export const UpdateShipmentSchema = shipmentBaseSchema.partial().extend({
    status: z.enum(['OPEN', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']).optional(),
}).superRefine((data, ctx) => {
    // Business Rule: Budget Min <= Budget Max (if both are present in the update)
    if (data.budgetMin !== undefined && data.budgetMax !== undefined && data.budgetMin !== null && data.budgetMax !== null) {
        if (data.budgetMin > data.budgetMax) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Budget minimum cannot be greater than maximum",
                path: ["budgetMin"]
            });
        }
    }
});

export type UpdateShipmentDto = z.infer<typeof UpdateShipmentSchema>;


