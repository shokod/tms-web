import { z } from 'zod';

export const timeEntryFormSchema = z.object({
  invoiceNo: z
    .string()
    .optional() // Invoice number is auto-generated, so it's optional in validation
    .refine(
      (val) => !val || /^[A-Z]+-[A-Z]{2}\s\d{3}$/.test(val),
      'Invoice format must be COMPANY-INITIALS NUMBER (e.g., RSLITE-JS 001)'
    ),
  
  contact: z
    .string()
    .min(1, 'Contact name is required')
    .refine(
      (name) => name.trim().split(' ').filter(part => part.length > 0).length >= 2,
      'Please provide both first and last name'
    ),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  
  hours: z
    .string()
    .min(1, 'Hours are required')
    .refine(
      (hours) => {
        const numHours = Number(hours);
        return !isNaN(numHours) && numHours > 0 && numHours <= 24;
      },
      'Hours must be a positive number between 0 and 24'
    ),
  
  activity: z
    .string()
    .min(1, 'Activity description is required')
    .min(10, 'Activity description must be at least 10 characters'),
  
  project: z
    .string()
    .min(1, 'Project selection is required')
    .refine(
      (project) => project !== 'Unknown',
      'Please select a valid project'
    ),
  
  date: z
    .date({
      required_error: 'Date is required',
    })
    .refine(
      (date) => date <= new Date(),
      'Date cannot be in the future'
    ),
});

export type TimeEntryFormData = z.infer<typeof timeEntryFormSchema>;

export type TimeEntryFormErrors = Partial<Record<keyof TimeEntryFormData, string>>;
