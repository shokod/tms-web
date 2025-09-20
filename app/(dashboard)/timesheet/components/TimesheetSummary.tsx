import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimeEntry, TimesheetProject } from '../types';
import { Clock, DollarSign, Briefcase, AlertCircle } from 'lucide-react';

interface TimesheetSummaryProps {
  entries: TimeEntry[];
  projects: TimesheetProject[];
  dateRange: {
    start: string;
    end: string;
  };
}

export const TimesheetSummary: React.FC<TimesheetSummaryProps> = ({
  entries,
  projects,
  dateRange
}) => {
  // Calculate summary statistics
  const totalHours = entries.reduce((total, entry) => {
    const duration = entry.duration / 60; // Convert minutes to hours
    return total + duration;
  }, 0);

  const billableHours = entries.reduce((total, entry) => {
    if (entry.billable) {
      const duration = entry.duration / 60;
      return total + duration;
    }
    return total;
  }, 0);

  const projectHours = entries.reduce((acc, entry) => {
    const project = projects.find(p => p.id === entry.projectId);
    if (project) {
      acc[project.id] = (acc[project.id] || 0) + entry.duration / 60;
    }
    return acc;
  }, {} as Record<string, number>);

  const overtimeHours = entries.reduce((total, entry) => {
    if (entry.entryType === 'overtime') {
      return total + (entry.duration / 60);
    }
    return total;
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Hours</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalHours.toFixed(1)}</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Billable Hours</p>
              <h3 className="text-2xl font-bold text-gray-900">{billableHours.toFixed(1)}</h3>
              <p className="text-sm text-gray-500">
                ({((billableHours / totalHours) * 100).toFixed(0)}% billable)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Briefcase className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Projects</p>
              <h3 className="text-2xl font-bold text-gray-900">
                {Object.keys(projectHours).length}
              </h3>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {Object.entries(projectHours)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 2)
              .map(([projectId, hours]) => {
                const project = projects.find(p => p.id === projectId);
                return (
                  <div key={projectId} className="flex justify-between text-sm">
                    <span className="text-gray-500 truncate">
                      {project?.name || 'Unknown'}
                    </span>
                    <span className="text-gray-900 font-medium">{hours.toFixed(1)}h</span>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertCircle className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Overtime</p>
              <h3 className="text-2xl font-bold text-gray-900">{overtimeHours.toFixed(1)}</h3>
              <p className="text-sm text-gray-500">
                ({((overtimeHours / totalHours) * 100).toFixed(0)}% of total)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};