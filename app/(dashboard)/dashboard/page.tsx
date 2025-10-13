'use client';

import React, { useEffect, useState } from 'react';
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
import AddProjectDialog from "@/components/add-project-button";

const DashboardPage = () => {
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState("this_week");

  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalHours: 0,
    totalEmployees: 0,
    activeProjects: 0,
    pendingApprovals: 0,
    weeklyEarnings: 0,
    productivity: 0,
    trends: {
      hours: { value: 0, change: 0 },
      earnings: { value: 0, change: 0 },
      productivity: { value: 0, change: 0 }
    }
  });

  const [topEmployees] = useState<Employee[]>([
    {
      id: "emp001",
      name: "Ushindi Chikwasha",
      avatar: "SC",
      role: "Senior Developer",
      hoursThisWeek: 42.5,
      status: "active",
      productivity: 96
    },
    {
      id: "emp002", 
      name: "Kudzai Chikwasha",
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
      name: "Tamuka Chikwasha",
      avatar: "ED",
      role: "Backend Developer", 
      hoursThisWeek: 40.0,
      status: "active",
      productivity: 93
    }
  ]);

  const [activeProjects, setActiveProjects] = useState<Project[]>([]);

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    async function loadDashboard() {
      try {
        const [projRes, empRes, teRes] = await Promise.all([
          fetch('/api/projects?limit=8&offset=0&order=desc&sort=due_date', { signal: controller.signal }),
          fetch('/api/employees?limit=100&offset=0', { signal: controller.signal }),
          fetch('/api/time-entries?limit=20&offset=0&order=desc&sort=date&status=all', { signal: controller.signal })
        ]);
        const [projJson, empJson, teJson] = await Promise.all([projRes.json(), empRes.json(), teRes.json()]);
        if (projRes.ok) {
          setActiveProjects((projJson.data || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            client: p.client,
            progress: 0,
            hoursLogged: 0,
            budget: Number(p.budget || 0),
            status: p.status,
            dueDate: p.due_date || ''
          })));
        }
        const totalEmployees = Array.isArray(empJson.data) ? empJson.data.length : 0;
        const totalHours = Array.isArray(teJson.data) ? teJson.data.reduce((s: number, e: any) => s + (e.hours || 0), 0) : 0;
        const pendingApprovals = Array.isArray(teJson.data) ? teJson.data.filter((e: any) => e.status === 'pending').length : 0;
        setDashboardStats((prev) => ({
          ...prev,
          totalEmployees,
          activeProjects: Array.isArray(projJson.data) ? projJson.data.length : 0,
          totalHours,
          pendingApprovals,
          trends: { ...prev.trends, hours: { value: totalHours, change: 0 } }
        }));
        setRecentActivity((teJson.data || []).slice(0, 4).map((e: any, idx: number) => {
          // Handle both string and object contact values
          const contactValue = typeof e.contact === 'string' ? e.contact : e.contact?.name || 'User';
          const statusValue = typeof e.status === 'string' ? e.status : e.status?.name || e.status?.status || '';
          
          return {
            id: String(e.id || idx),
            type: statusValue === 'approved' ? 'entry_approved' : 'entry_submitted',
            message: e.activity || 'Timesheet entry',
            timestamp: '',
            user: contactValue,
            avatar: (contactValue ? contactValue.split(' ').map((s: string) => s[0]).join('').slice(0,2).toUpperCase() : 'U')
          };
        }));
      } catch {}
    }
    loadDashboard();
    return () => controller.abort();
  }, []);

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
              <AddProjectDialog />
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