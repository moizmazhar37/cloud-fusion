"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email!" };
  }

  const { email } = validatedFields.data;

  // TODO: Add your password reset logic here
  // This is a placeholder implementation

  return { success: "Reset email sent!" };
};