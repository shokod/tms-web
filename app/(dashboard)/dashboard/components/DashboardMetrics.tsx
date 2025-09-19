import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, DollarSign, CheckCircle, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { DashboardStats } from "../types";


interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  subtitle?: React.ReactNode;
  iconBgColor: string;
  iconTextColor: string;
  hoverTextColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  iconBgColor,
  iconTextColor,
  hoverTextColor,
}) => (
  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold text-gray-900 group-hover:${hoverTextColor} transition-colors`}>
            {value}
          </p>
          {subtitle && (
            <div className="flex items-center mt-2 text-sm">
              {trend !== undefined && (
                <>
                  {trend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={trend > 0 ? 'text-emerald-600' : 'text-red-600'}>
                    {Math.abs(trend)}%
                  </span>
                </>
              )}
              {subtitle}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${iconBgColor} rounded-xl flex items-center justify-center group-hover:${iconBgColor.replace('100', '200')} transition-colors`}>
          <div className={`h-6 w-6 ${iconTextColor}`}>{icon}</div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const DashboardMetrics: React.FC<{ stats: DashboardStats; topEmployeesOnline: number }> = ({ stats, topEmployeesOnline }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Hours"
        value={stats.totalHours.toLocaleString()}
        icon={<Clock />}
        trend={stats.trends.hours.change}
        subtitle={<span className="text-gray-500 ml-1">vs last week</span>}
        iconBgColor="bg-blue-100"
        iconTextColor="text-blue-600"
        hoverTextColor="text-blue-600"
      />
      
      <StatCard
        title="Active Employees"
        value={stats.totalEmployees}
        icon={<Users />}
        subtitle={
          <>
            <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
            <span className="text-emerald-600">{topEmployeesOnline} online</span>
          </>
        }
        iconBgColor="bg-purple-100"
        iconTextColor="text-purple-600"
        hoverTextColor="text-purple-600"
      />
      
      <StatCard
        title="Weekly Earnings"
        value={formatCurrency(stats.weeklyEarnings)}
        icon={<DollarSign />}
        trend={stats.trends.earnings.change}
        subtitle={<span className="text-gray-500 ml-1">vs last week</span>}
        iconBgColor="bg-emerald-100"
        iconTextColor="text-emerald-600"
        hoverTextColor="text-emerald-600"
      />
      
      <StatCard
        title="Pending Approvals"
        value={stats.pendingApprovals}
        icon={<CheckCircle />}
        subtitle={
          <>
            <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
            <span className="text-amber-600">Needs attention</span>
          </>
        }
        iconBgColor="bg-amber-100"
        iconTextColor="text-amber-600"
        hoverTextColor="text-amber-600"
      />
    </div>
  );
};