import { z } from "zod";

export const timeEntryCreateSchema = z.object({
  invoice: z.string().min(1),
  contact: z.string().min(1),
  email: z.string().email(),
  date: z.string().min(1),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
  break_minutes: z.number().int().min(0).optional(),
  hours: z.number().min(0),
  activity: z.string().min(1),
  description: z.string().optional(),
  project: z.string().min(1),
  project_id: z.string().optional(),
  status: z.enum(["draft", "pending", "approved"]).default("draft"),
});

export const timeEntryUpdateSchema = timeEntryCreateSchema.partial();

export type TimeEntryCreateInput = z.infer<typeof timeEntryCreateSchema>;
export type TimeEntryUpdateInput = z.infer<typeof timeEntryUpdateSchema>;


