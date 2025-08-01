import z from "zod";

export const moduleSchema = z.object({
  modules: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().min(1, "Module title is required"),
        lessons: z
          .array(
            z.object({
              title: z.string().min(1, "Lesson name is required"),
              content: z
                .string()
                .min(100, "Content must be at least 100 characters")
                .max(1000, "Content must be less than 1000 characters"),
              video_url: z.string().url("Invalid URL").optional(),
              is_free: z.boolean(),
            })
          )
          .min(1, "At least one lesson is required"),
      })
    )
    .min(1, "At least one module is required"),
});

export type CourseLessonsFormValues = z.infer<typeof moduleSchema>;
