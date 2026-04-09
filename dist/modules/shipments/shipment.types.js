"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateShipmentSchema = exports.CreateShipmentSchema = exports.LocationTypeSchema = void 0;
const zod_1 = require("zod");
exports.LocationTypeSchema = zod_1.z.enum(['RESIDENTIAL', 'BUSINESS', 'WAREHOUSE', 'PORT']);
// 1. BASE SCHEMA (No validation logic)
const shipmentBaseSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().optional(),
    // Origin
    originAddress: zod_1.z.string(),
    originLatitude: zod_1.z.number(),
    originLongitude: zod_1.z.number(),
    originPlaceId: zod_1.z.string().optional(),
    originCity: zod_1.z.string().optional(),
    originState: zod_1.z.string().optional(),
    originCountry: zod_1.z.string().optional(),
    originPostalCode: zod_1.z.string().optional(),
    // Destination
    destinationAddress: zod_1.z.string(),
    destinationLatitude: zod_1.z.number(),
    destinationLongitude: zod_1.z.number(),
    destinationPlaceId: zod_1.z.string().optional(),
    destinationCity: zod_1.z.string().optional(),
    destinationState: zod_1.z.string().optional(),
    destinationCountry: zod_1.z.string().optional(),
    destinationPostalCode: zod_1.z.string().optional(),
    // Logistics
    distanceKm: zod_1.z.number().optional(),
    estimatedTimeMin: zod_1.z.number().optional(),
    category: zod_1.z.string().optional(),
    weight: zod_1.z.number().optional(),
    weightUnit: zod_1.z.string().default('kg'),
    length: zod_1.z.number().optional(),
    width: zod_1.z.number().optional(),
    height: zod_1.z.number().optional(),
    dimensionUnit: zod_1.z.string().default('cm'),
    pickupDate: zod_1.z.string().or(zod_1.z.date()).optional(),
    deliveryDate: zod_1.z.string().or(zod_1.z.date()).optional(),
    isFlexiblePickup: zod_1.z.boolean().default(false),
    isFlexibleDelivery: zod_1.z.boolean().default(false),
    // Pricing
    budgetMin: zod_1.z.number().nullable().optional(),
    budgetMax: zod_1.z.number().nullable().optional(),
    // Logistics Detail
    pickupType: exports.LocationTypeSchema.default('RESIDENTIAL'),
    deliveryType: exports.LocationTypeSchema.default('RESIDENTIAL'),
    pickupNotes: zod_1.z.string().optional(),
    deliveryNotes: zod_1.z.string().optional(),
    hasElevatorPickup: zod_1.z.boolean().optional(),
    hasElevatorDelivery: zod_1.z.boolean().optional(),
    pickupFloor: zod_1.z.number().optional(),
    deliveryFloor: zod_1.z.number().optional(),
    specialRequirements: zod_1.z.string().optional(),
    isPalletized: zod_1.z.boolean().default(false),
    isCrated: zod_1.z.boolean().default(false),
});
// 2. CREATE SCHEMA (With strict refinement)
exports.CreateShipmentSchema = shipmentBaseSchema.refine((data) => {
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
// 3. UPDATE SCHEMA (Safe partial with superRefine)
exports.UpdateShipmentSchema = shipmentBaseSchema.partial().extend({
    status: zod_1.z.enum(['OPEN', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED']).optional(),
}).superRefine((data, ctx) => {
    // Business Rule: Budget Min <= Budget Max (if both are present in the update)
    if (data.budgetMin !== undefined && data.budgetMax !== undefined && data.budgetMin !== null && data.budgetMax !== null) {
        if (data.budgetMin > data.budgetMax) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                message: "Budget minimum cannot be greater than maximum",
                path: ["budgetMin"]
            });
        }
    }
});
