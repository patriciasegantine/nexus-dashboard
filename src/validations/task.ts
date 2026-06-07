import { z } from "zod"

export const taskStatusSchema = z.enum(["TODO", "IN_PROGRESS", "DONE"])
export const taskPrioritySchema = z.enum(["LOW", "MEDIUM", "HIGH"])

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),
  description: z
    .string()
    .max(1000, "Description must be at most 1000 characters")
    .optional(),
  priority: taskPrioritySchema.default("MEDIUM"),
  status: taskStatusSchema.default("TODO"),
  tags: z
    .array(z.string().min(1).max(30))
    .max(10, "Maximum 10 tags allowed")
    .optional()
    .default([]),
  projectId: z.string().min(1, "Project is required"),
  dueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
})

export const updateTaskSchema = createTaskSchema
  .omit({ projectId: true })
  .partial()
  .extend({
    projectId: z.string().min(1).optional(),
    tags: z
      .array(z.string().min(1).max(30))
      .max(10, "Maximum 10 tags allowed")
      .optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided" }
  )

export const updateTaskStatusSchema = z.object({
  status: taskStatusSchema,
})

export type CreateTaskInput = z.infer<typeof createTaskSchema>
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>
export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>
