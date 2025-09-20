import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimeEntry, TimesheetProject } from '../types';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  isSameDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { TimesheetSummary } from './TimesheetSummary';

interface WeeklyViewProps {
  entries: TimeEntry[];
  projects: TimesheetProject[];
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onDayClick: (date: Date) => void;
}

const WORK_DAY_START = 9; // 9 AM
const WORK_DAY_END = 17; // 5 PM
const HOUR_HEIGHT = 60; // pixels per hour

export const WeeklyView: React.FC<WeeklyViewProps> = ({
  entries,
  projects,
  selectedDate,
  onDateChange,
  onDayClick,
}) => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Start on Monday
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const weekEntries = entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= weekStart && entryDate <= weekEnd;
  });

  const getEntriesForDay = (date: Date) => {
    return weekEntries.filter(entry => 
      isSameDay(new Date(entry.date), date)
    );
  };

  const calculateEntryPosition = (entry: TimeEntry) => {
    const [startHour, startMinute] = entry.startTime.split(':').map(Number);
    const [endHour, endMinute] = entry.endTime.split(':').map(Number);

    const startFromTop = (startHour - WORK_DAY_START + startMinute / 60) * HOUR_HEIGHT;
    const height = (endHour - startHour + (endMinute - startMinute) / 60) * HOUR_HEIGHT;

    return {
      top: startFromTop,
      height,
    };
  };

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <TimesheetSummary
        entries={weekEntries}
        projects={projects}
        dateRange={{
          start: format(weekStart, 'yyyy-MM-dd'),
          end: format(weekEnd, 'yyyy-MM-dd'),
        }}
      />

      {/* Week Navigation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-xl font-bold">
            Week of {format(weekStart, 'MMMM d, yyyy')}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(subWeeks(selectedDate, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(new Date())}
            >
              This Week
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDateChange(addWeeks(selectedDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-8 gap-2 min-h-[600px]">
            {/* Time labels */}
            <div className="col-span-1">
              <div className="h-10"></div> {/* Header spacer */}
              {Array.from(
                { length: WORK_DAY_END - WORK_DAY_START },
                (_, i) => WORK_DAY_START + i
              ).map((hour) => (
                <div
                  key={hour}
                  className="h-[60px] text-xs text-gray-500 relative"
                >
                  <span className="absolute -top-3">
                    {format(new Date().setHours(hour, 0), 'ha')}
                  </span>
                </div>
              ))}
            </div>

            {/* Days */}
            {daysInWeek.map((date) => {
              const dayEntries = getEntriesForDay(date);
              const isToday = isSameDay(date, new Date());

              return (
                <div
                  key={date.toString()}
                  className="col-span-1 relative"
                  onClick={() => onDayClick(date)}
                >
                  {/* Day header */}
                  <div
                    className={`h-10 text-center border-b sticky top-0 bg-white
                      ${isToday ? 'text-blue-600 font-bold' : 'text-gray-600'}`}
                  >
                    <div className="text-sm">{format(date, 'EEE')}</div>
                    <div className="text-xs">{format(date, 'MMM d')}</div>
                  </div>

                  {/* Time slots */}
                  <div className="relative">
                    {Array.from(
                      { length: WORK_DAY_END - WORK_DAY_START },
                      (_, i) => i
                    ).map((hour) => (
                      <div
                        key={hour}
                        className="h-[60px] border-b border-gray-100"
                      />
                    ))}

                    {/* Entries */}
                    {dayEntries.map((entry) => {
                      const project = projects.find(p => p.id === entry.projectId);
                      const { top, height } = calculateEntryPosition(entry);

                      return (
                        <div
                          key={entry.id}
                          className={`absolute left-1 right-1 rounded px-1 py-0.5 text-xs
                            ${entry.entryType === 'overtime' 
                              ? 'bg-purple-100 border-purple-300 text-purple-700'
                              : 'bg-blue-100 border-blue-300 text-blue-700'
                            } border overflow-hidden cursor-pointer hover:shadow-md transition-shadow`}
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <div className="font-medium truncate">
                            {project?.name}
                          </div>
                          {height >= 50 && (
                            <div className="text-xs truncate">
                              {entry.description}
                            </div>
                          )}
                        </div>
                      );
                    })}
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