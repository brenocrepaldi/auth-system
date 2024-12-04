import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
	URI: z.string(),
	PORT: z.coerce.number().default(3333),
	SECRET_ACCESS_TOKEN: z.string(),
});

export const env = envSchema.parse(process.env);
