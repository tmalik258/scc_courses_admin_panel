import z from "zod";

export const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Category name must be at least 2 characters.",
    })
    .max(100, {
      message: "Category name must not exceed 100 characters.",
    }),
  isActive: z.boolean({
    required_error: "Please specify if the category is active.",
  }),
  icon: z.string().optional(),
});
