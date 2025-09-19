'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Calendar,
  BarChart3,
  CheckCircle,
  Download,
  Filter,
  Clock,
  MoreHorizontal,
  ArrowRight
} from "lucide-react";
import { DashboardStats, Employee, Project, RecentActivity } from './types';
import { DashboardMetrics } from './components/DashboardMetrics';
import { ActiveProjects } from './components/ProjectCards';
import { TopPerformers, RecentActivities } from './components/EmployeeActivity';
import AddEntryDialog from "@/components/add-entry-button";

const DashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("this_week");

  const [dashboardStats] = useState<DashboardStats>({
    totalHours: 1247,
    totalEmployees: 24,
    activeProjects: 8,
    pendingApprovals: 15,
    weeklyEarnings: 89750,
    productivity: 87,
    trends: {
      hours: { value: 1247, change: 8.2 },
      earnings: { value: 89750, change: 12.5 },
      productivity: { value: 87, change: -2.1 }
    }
  });

  const [topEmployees] = useState<Employee[]>([
    {
      id: "emp001",
      name: "Sarah Chen",
      avatar: "SC",
      role: "Senior Developer",
      hoursThisWeek: 42.5,
      status: "active",
      productivity: 96
    },
    {
      id: "emp002", 
      name: "John Smith",
      avatar: "JS",
      role: "UI/UX Designer",
      hoursThisWeek: 38.0,
      status: "active",
      productivity: 91
    },
    {
      id: "emp003",
      name: "Mike Johnson",
      avatar: "MJ", 
      role: "Project Manager",
      hoursThisWeek: 35.5,
      status: "away",
      productivity: 88
    },
    {
      id: "emp004",
      name: "Emma Davis",
      avatar: "ED",
      role: "Backend Developer", 
      hoursThisWeek: 40.0,
      status: "active",
      productivity: 93
    }
  ]);

  const [activeProjects] = useState<Project[]>([
    {
      id: "proj001",
      name: "Authentication System",
      client: "TechCorp Solutions",
      progress: 85,
      hoursLogged: 156,
      budget: 45000,
      status: "on-track",
      dueDate: "2024-12-30"
    },
    {
      id: "proj002",
      name: "Dashboard Redesign", 
      client: "StartupXYZ",
      progress: 62,
      hoursLogged: 89,
      budget: 28000,
      status: "behind",
      dueDate: "2024-12-25"
    },
    {
      id: "proj003",
      name: "API Integration",
      client: "Enterprise Co",
      progress: 94,
      hoursLogged: 201,
      budget: 52000,
      status: "on-track", 
      dueDate: "2024-12-22"
    },
    {
      id: "proj004",
      name: "Mobile App",
      client: "InnovateNow",
      progress: 38,
      hoursLogged: 124,
      budget: 67000,
      status: "at-risk",
      dueDate: "2025-01-15"
    }
  ]);

  const [recentActivity] = useState<RecentActivity[]>([
    {
      id: "act001",
      type: "entry_approved",
      message: "Timesheet entry approved for Authentication System",
      timestamp: "2 hours ago",
      user: "Sarah Chen",
      avatar: "SC"
    },
    {
      id: "act002", 
      type: "entry_submitted",
      message: "New timesheet entry submitted for Dashboard Redesign",
      timestamp: "4 hours ago", 
      user: "John Smith",
      avatar: "JS"
    },
    {
      id: "act003",
      type: "project_updated",
      message: "Project milestone completed for API Integration",
      timestamp: "6 hours ago",
      user: "Mike Johnson", 
      avatar: "MJ"
    },
    {
      id: "act004",
      type: "entry_submitted",
      message: "Overtime entry submitted for Mobile App project",
      timestamp: "8 hours ago",
      user: "Emma Davis",
      avatar: "ED"
    }
  ]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-screen-2xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your team.</p>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
                <option value="this_quarter">This Quarter</option>
              </select>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <AddEntryDialog />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-6">
        {/* Key Metrics */}
        <div className={`mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <DashboardMetrics 
            stats={dashboardStats} 
            topEmployeesOnline={topEmployees.filter(e => e.status === 'active').length} 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Active Projects */}
            <div className={`transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <ActiveProjects projects={activeProjects} />
            </div>

            {/* Team Performance Chart */}
            <div className={`transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Team Performance</h2>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Last 7 days
                      </Button>
                    </div>
                  </div>
                  
                  {/* Chart Placeholder */}
                  <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-blue-600 font-medium">Performance Chart</p>
                      <p className="text-blue-500 text-sm">Hours logged vs productivity metrics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Top Performers */}
            <div className={`transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <TopPerformers employees={topEmployees} />
            </div>

            {/* Recent Activity */}
            <div className={`transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <RecentActivities activities={recentActivity} />
            </div>

            {/* Quick Actions */}
            <div className={`transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700">
                  <Plus className="h-5 w-5 mb-2" />
                  <span className="text-sm">New Entry</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700">
                  <CheckCircle className="h-5 w-5 mb-2" />
                  <span className="text-sm">Approve</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700">
                  <Download className="h-5 w-5 mb-2" />
                  <span className="text-sm">Export</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700">
                  <BarChart3 className="h-5 w-5 mb-2" />
                  <span className="text-sm">Reports</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;