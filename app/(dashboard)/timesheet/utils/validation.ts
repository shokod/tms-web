import { TimeEntry, TimesheetSettings, TimesheetValidation } from '../types';
import { differenceInMinutes, parse, isFuture, isWeekend } from 'date-fns';

export interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning';
}

export const validateTimeEntry = (
  entry: Partial<TimeEntry>,
  existingEntries: TimeEntry[],
  settings: TimesheetSettings
): ValidationError[] => {
  const errors: ValidationError[] = [];

  // Required Fields Validation
  if (!entry.date) {
    errors.push({
      field: 'date',
      message: 'Date is required',
      type: 'error'
    });
  }

  if (!entry.startTime) {
    errors.push({
      field: 'startTime',
      message: 'Start time is required',
      type: 'error'
    });
  }

  if (!entry.endTime) {
    errors.push({
      field: 'endTime',
      message: 'End time is required',
      type: 'error'
    });
  }

  if (!entry.projectId) {
    errors.push({
      field: 'projectId',
      message: 'Project selection is required',
      type: 'error'
    });
  }

  // Time Format and Range Validation
  if (entry.date && entry.startTime && entry.endTime) {
    const startDateTime = parse(
      `${entry.date} ${entry.startTime}`,
      'yyyy-MM-dd HH:mm',
      new Date()
    );
    const endDateTime = parse(
      `${entry.date} ${entry.endTime}`,
      'yyyy-MM-dd HH:mm',
      new Date()
    );

    // Check if date is in future
    if (!settings.allowFutureEntries && isFuture(startDateTime)) {
      errors.push({
        field: 'date',
        message: 'Future dates are not allowed',
        type: 'error'
      });
    }

    // Validate time range
    if (endDateTime <= startDateTime) {
      errors.push({
        field: 'endTime',
        message: 'End time must be after start time',
        type: 'error'
      });
    }

    // Check working hours
    const duration = differenceInMinutes(endDateTime, startDateTime);
    if (duration > settings.maxDailyHours * 60) {
      errors.push({
        field: 'duration',
        message: `Duration exceeds maximum allowed hours (${settings.maxDailyHours} hours)`,
        type: 'error'
      });
    }

    // Check for overlapping entries
    const hasOverlap = existingEntries.some(existingEntry => {
      if (existingEntry.id === entry.id) return false; // Skip current entry when editing
      
      const existingStart = parse(
        `${existingEntry.date} ${existingEntry.startTime}`,
        'yyyy-MM-dd HH:mm',
        new Date()
      );
      const existingEnd = parse(
        `${existingEntry.date} ${existingEntry.endTime}`,
        'yyyy-MM-dd HH:mm',
        new Date()
      );

      return (
        startDateTime < existingEnd && endDateTime > existingStart
      );
    });

    if (hasOverlap && !settings.allowTimeOverlap) {
      errors.push({
        field: 'time',
        message: 'Time entry overlaps with existing entries',
        type: 'error'
      });
    }

    // Break time validation
    if (settings.breakRequired && duration > 360) { // 6 hours
      const hasBreak = existingEntries.some(existingEntry => 
        existingEntry.date === entry.date &&
        existingEntry.entryType === 'break' &&
        existingEntry.duration >= settings.minBreakDuration
      );

      if (!hasBreak) {
        errors.push({
          field: 'break',
          message: `A break of at least ${settings.minBreakDuration} minutes is required for shifts over 6 hours`,
          type: 'warning'
        });
      }
    }

    // Weekend warning
    if (isWeekend(startDateTime)) {
      errors.push({
        field: 'date',
        message: 'Entry is logged for a weekend',
        type: 'warning'
      });
    }
  }

  // Description validation
  if (settings.requireDescription && !entry.description?.trim()) {
    errors.push({
      field: 'description',
      message: 'Description is required',
      type: 'error'
    });
  }

  return errors;
};

export const calculateDuration = (
  startTime: string,
  endTime: string
): number => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);
  
  let duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
  if (duration < 0) duration += 24 * 60; // Handle overnight shifts
  
  return duration;
};

export const isOvertimeRequired = (
  existingEntries: TimeEntry[],
  newEntry: Partial<TimeEntry>,
  settings: TimesheetSettings
): boolean => {
  const date = newEntry.date;
  if (!date) return false;

  // Calculate total minutes worked on this date
  const totalMinutes = existingEntries
    .filter(entry => entry.date === date && entry.entryType === 'regular')
    .reduce((total, entry) => total + entry.duration, 0);

  const newDuration = newEntry.startTime && newEntry.endTime
    ? calculateDuration(newEntry.startTime, newEntry.endTime)
    : 0;

  return (totalMinutes + newDuration) > settings.overtimeThreshold;
};