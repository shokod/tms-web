import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimeEntry, TimesheetProject } from '../types';
import { format, parse, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Edit2, Trash2 } from 'lucide-react';
import { TimesheetSummary } from './TimesheetSummary';

interface DailyViewProps {
  entries: TimeEntry[];
  projects: TimesheetProject[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onEditEntry: (entry: TimeEntry) => void;
  onDeleteEntry: (entry: TimeEntry) => void;
}

const HOUR_LABELS = Array.from({ length: 24 }, (_, i) => 
  format(new Date().setHours(i, 0), 'ha')
);

const getEntryStyle = (entry: TimeEntry) => {
  const startMinutes = getMinutesFromTime(entry.startTime);
  const endMinutes = getMinutesFromTime(entry.endTime);
  const duration = endMinutes - startMinutes;
  
  return {
    top: `${(startMinutes / (24 * 60)) * 100}%`,
    height: `${(duration / (24 * 60)) * 100}%`,
    left: '25%',
    width: '70%',
  };
};

const getMinutesFromTime = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const getEntryColor = (entry: TimeEntry) => {
  switch (entry.entryType) {
    case 'regular':
      return 'bg-blue-100 border-blue-300 text-blue-700';
    case 'overtime':
      return 'bg-purple-100 border-purple-300 text-purple-700';
    case 'break':
      return 'bg-gray-100 border-gray-300 text-gray-700';
    case 'leave':
      return 'bg-green-100 border-green-300 text-green-700';
    default:
      return 'bg-gray-100 border-gray-300 text-gray-700';
  }
};

export const DailyView: React.FC<DailyViewProps> = ({
  entries,
  projects,
  selectedDate,
  onDateChange,
  onEditEntry,
  onDeleteEntry,
}) => {
  const dateString = format(selectedDate, 'yyyy-MM-dd');
  const dayEntries = entries.filter(entry => entry.date === dateString);

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <TimesheetSummary
        entries={dayEntries}
        projects={projects}
        dateRange={{ start: dateString, end: dateString }}
      />

      {/* Date Navigation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(subDays(selectedDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(addDays(selectedDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="relative h-[600px] border rounded-lg">
            {/* Time labels */}
            <div className="absolute top-0 left-0 w-[20%] h-full border-r">
              {HOUR_LABELS.map((hour, index) => (
                <div
                  key={hour}
                  className="absolute text-xs text-gray-500"
                  style={{ top: `${(index / 24) * 100}%` }}
                >
                  {hour}
                </div>
              ))}
            </div>

            {/* Timeline grid */}
            <div className="absolute left-[20%] right-0 h-full">
              {HOUR_LABELS.map((_, index) => (
                <div
                  key={index}
                  className="absolute w-full border-t border-gray-100"
                  style={{ top: `${(index / 24) * 100}%` }}
                />
              ))}
            </div>

            {/* Time entries */}
            {dayEntries.map((entry) => {
              const project = projects.find(p => p.id === entry.projectId);
              const style = getEntryStyle(entry);
              const colorClass = getEntryColor(entry);

              return (
                <div
                  key={entry.id}
                  className={`absolute p-2 rounded border ${colorClass} hover:shadow-md transition-shadow`}
                  style={style}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {entry.startTime} - {entry.endTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => onEditEntry(entry)}
                      >
                        <Edit2 className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => onDeleteEntry(entry)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-1">
                    <div className="text-sm font-medium truncate">
                      {project?.name}
                    </div>
                    <div className="text-xs truncate">
                      {entry.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};