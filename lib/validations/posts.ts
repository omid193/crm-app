import z from "zod";

export const PostSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.enum(
    ["frontend", "backend", "fullstack", "devops", "mobile", "data"],
    { required_error: "category required" },
  ),
  location: z.string().optional(),
  salary: z.string().optional(),
});

export type PostInput = z.infer<typeof PostSchema>;
