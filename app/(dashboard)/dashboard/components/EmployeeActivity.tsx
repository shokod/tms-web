import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import { Employee, RecentActivity } from "../types";

const getEmployeeStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'bg-emerald-500';
    case 'away': return 'bg-amber-500';
    case 'offline': return 'bg-gray-400';
    default: return 'bg-gray-400';
  }
};

export const TopPerformers: React.FC<{ employees: Employee[] }> = ({ employees }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900">Top Performers</h2>
      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
        View All <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>

    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4">
          {employees.map((employee) => (
            <div key={employee.id} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-semibold">
                      {employee.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getEmployeeStatusColor(employee.status)} rounded-full border-2 border-white`}></div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {employee.name}
                  </div>
                  <div className="text-sm text-gray-500">{employee.role}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">{employee.hoursThisWeek}h</div>
                <div className="text-sm text-emerald-600">{employee.productivity}%</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export const RecentActivities: React.FC<{ activities: RecentActivity[] }> = ({ activities }) => (
  <div>
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
        View All <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>

    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 text-xs font-semibold">
                  {activity.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 leading-relaxed">{activity.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs text-gray-500">{activity.user}</p>
                  <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);