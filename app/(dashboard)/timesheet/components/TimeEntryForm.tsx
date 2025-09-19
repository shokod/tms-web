import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Briefcase, FileText, Tags } from "lucide-react";
import { TimeEntry, EntryType, TimesheetProject, TimesheetTask, TimesheetSettings } from '../types';
import { validateTimeEntry, ValidationError, isOvertimeRequired } from '../utils/validation';

interface TimeEntryFormProps {
  projects: TimesheetProject[];
  tasks: TimesheetTask[];
  existingEntries: TimeEntry[];
  settings: TimesheetSettings;
  onSubmit: (entry: Partial<TimeEntry>) => void;
  onSaveDraft: (entry: Partial<TimeEntry>) => void;
  initialValues?: Partial<TimeEntry>;
}

export const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  projects,
  tasks,
  existingEntries,
  settings,
  onSubmit,
  onSaveDraft,
  initialValues
}) => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date | undefined>(
    initialValues?.date ? new Date(initialValues.date) : new Date()
  );
  const [selectedProject, setSelectedProject] = useState<string | undefined>(
    initialValues?.projectId
  );
  const [selectedTask, setSelectedTask] = useState<string | undefined>(
    initialValues?.taskId
  );
  const [startTime, setStartTime] = useState(initialValues?.startTime || '09:00');
  const [endTime, setEndTime] = useState(initialValues?.endTime || '17:00');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [entryType, setEntryType] = useState<EntryType>(
    initialValues?.entryType || 'regular'
  );
  const [billable, setBillable] = useState(
    initialValues?.billable ?? true
  );

  const projectTasks = tasks.filter(task => task.projectId === selectedProject);
  const selectedProjectData = projects.find(p => p.id === selectedProject);

  const validateForm = (): boolean => {
    if (!date || !selectedProject) return false;

    const entry: Partial<TimeEntry> = {
      date: date ? format(date, 'yyyy-MM-dd') : undefined,
      projectId: selectedProject,
      taskId: selectedTask,
      startTime,
      endTime,
      description,
      entryType,
      billable
    };

    const errors = validateTimeEntry(entry, existingEntries, settings);
    setValidationErrors(errors);

    // Check if entry should be overtime
    if (isOvertimeRequired(existingEntries, entry, settings) && entryType === 'regular') {
      errors.push({
        field: 'entryType',
        message: 'This entry should be marked as overtime',
        type: 'warning'
      });
    }

    return errors.filter(error => error.type === 'error').length === 0;
  };

  const handleSubmit = (asDraft: boolean = false) => {
    setIsSubmitting(true);
    
    if (!asDraft && !validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const entry: Partial<TimeEntry> = {
      date: date ? format(date, 'yyyy-MM-dd') : undefined,
      projectId: selectedProject,
      taskId: selectedTask,
      startTime,
      endTime,
      description,
      entryType,
      billable,
      status: asDraft ? 'draft' : 'submitted',
      lastModified: new Date().toISOString()
    };

    if (asDraft) {
      onSaveDraft(entry);
    } else {
      onSubmit(entry);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Time Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div className="space-y-2">
          <Label>Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Project Selection */}
        <div className="space-y-2">
          <Label>Project</Label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Task Selection */}
        {selectedProjectData?.requireTask && (
          <div className="space-y-2">
            <Label>Task</Label>
            <Select value={selectedTask} onValueChange={setSelectedTask}>
              <SelectTrigger>
                <SelectValue placeholder="Select a task" />
              </SelectTrigger>
              <SelectContent>
                {projectTasks.map((task) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Time</Label>
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>End Time</Label>
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>

        {/* Entry Type */}
        <div className="space-y-2">
          <Label>Entry Type</Label>
          <Select value={entryType} onValueChange={(value) => setEntryType(value as EntryType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select entry type" />
            </SelectTrigger>
            <SelectContent>
              {selectedProjectData?.allowedEntryTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you work on?"
            required={selectedProjectData?.requireDescription}
          />
        </div>

        {/* Billable Toggle */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="billable"
            checked={billable}
            onChange={(e) => setBillable(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <Label htmlFor="billable">Billable Time</Label>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            onClick={() => handleSubmit(true)}
          >
            Save as Draft
          </Button>
          <Button
            onClick={() => handleSubmit(false)}
          >
            Submit Entry
          </Button>
        </div>
        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="space-y-2">
            {validationErrors.map((error, index) => (
              <Alert key={index} variant={error.type === 'error' ? 'destructive' : 'default'}>
                <AlertDescription>
                  {error.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

      </CardContent>
    </Card>
  );
};