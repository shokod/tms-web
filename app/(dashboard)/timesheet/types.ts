import { Project } from "../dashboard/types";

export type TimesheetStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'needs_revision';

export type EntryType = 'regular' | 'overtime' | 'break' | 'leave' | 'holiday';

export interface TimeEntry {
  id: string;
  userId: string;
  projectId: string;
  taskId?: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  description: string;
  entryType: EntryType;
  status: TimesheetStatus;
  lastModified: string;
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  billable: boolean;
  tags?: string[];
}

export interface TimesheetTask {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  estimatedHours?: number;
  actualHours?: number;
  status: 'active' | 'completed' | 'on-hold';
  billable: boolean;
}

export interface TimesheetValidation {
  overlappingEntries: boolean;
  exceedsWorkday: boolean;
  missingRequired: boolean;
  invalidTimes: boolean;
  futureDate: boolean;
}

export interface TimesheetSummary {
  totalHours: number;
  billableHours: number;
  nonBillableHours: number;
  overtimeHours: number;
  projectBreakdown: {
    projectId: string;
    projectName: string;
    hours: number;
    billableHours: number;
  }[];
  status: TimesheetStatus;
  submissionDeadline?: string;
  warnings: string[];
}

export interface TimesheetFilters {
  dateRange: {
    start: string;
    end: string;
  };
  projects?: string[];
  status?: TimesheetStatus[];
  entryTypes?: EntryType[];
  billableOnly?: boolean;
}

export interface TimesheetSettings {
  workdayStart: string; // "HH:mm"
  workdayEnd: string; // "HH:mm"
  defaultWorkHours: number;
  maxDailyHours: number;
  breakRequired: boolean;
  minBreakDuration: number; // in minutes
  overtimeThreshold: number; // in minutes
  requireProjectSelection: boolean;
  requireTaskSelection: boolean;
  requireDescription: boolean;
  allowFutureEntries: boolean;
  allowTimeOverlap: boolean;
}

// Extend existing Project interface for timesheet specific fields
export interface TimesheetProject extends Project {
  allowedEntryTypes: EntryType[];
  defaultBillable: boolean;
  requireTask: boolean;
  requireDescription: boolean;
  budgetedHours?: number;
  rateCard?: {
    default: number;
    overtime?: number;
    weekend?: number;
    holiday?: number;
  };
}