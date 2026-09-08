import { z } from 'zod';

export const newApiKeySchema = z.object({
  environment: z
    .string()
    .min(1, { message: "API key environment is required" }),
  name: z
    .string()
    .min(1, { message: "API key name is required" })
});
export type NewApiKeyFormData = z.infer<typeof newApiKeySchema>;

