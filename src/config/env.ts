import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

// console.log("DEBUG: Maps API Key (Backend):", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

const envSchema = z.object({
    PORT: z.string().default('5000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string(),
    REDIS_URL: z.string().url().default('redis://localhost:6379'),
    JWT_SECRET: z.string(),
    S3_BUCKET_NAME: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_REGION: z.string().default('us-east-1'),
    STRIPE_SECRET_KEY: z.string(),
    STRIPE_PUBLIC_KEY: z.string(),
    STRIPE_WEBHOOK_SECRET: z.string(),
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    process.exit(1);
}

export const env = _env.data;
