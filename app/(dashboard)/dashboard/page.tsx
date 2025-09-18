'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Clock, 
  FileText, 
  TrendingUp, 
  Calendar, 
  Users, 
  Home,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  ArrowRight,
  Building2,
  User
} from "lucide-react";
import AddEntryDialog from "@/components/add-entry-button";

export default function DashboardPage() {
  const stats = [
    { title: "This Month", value: "168", unit: "hrs", change: "+12%", color: "text-blue-600" },
    { title: "This Week", value: "40", unit: "hrs", change: "+8%", color: "text-green-600" },
    { title: "Active Projects", value: "5", unit: "", change: "2 new", color: "text-purple-600" },
    { title: "Avg Daily", value: "8.2", unit: "hrs", change: "Standard", color: "text-orange-600" }
  ];

  const entries = [
    { 
      id: "01", 
      invoice: "RSLITE-TN 001 BTA", 
      contact: "John Smith",
      email: "john@company.com",
      date: "Dec 15", 
      hours: "8.0", 
      activity: "User authentication system development",
      avatar: "JS"
    },
    { 
      id: "02", 
      invoice: "RSLITE-TN 002 BTA", 
      contact: "John Smith",
      email: "john@company.com", 
      date: "Dec 14", 
      hours: "7.5", 
      activity: "Dashboard UI and API integration",
      avatar: "JS"
    },
    { 
      id: "03", 
      invoice: "RSLITE-TN 003 BTA", 
      contact: "John Smith",
      email: "john@company.com",
      date: "Dec 13", 
      hours: "8.0", 
      activity: "Code review and bug fixes",
      avatar: "JS"
    },
    { 
      id: "04", 
      invoice: "RSLITE-TN 004 BTA", 
      contact: "John Smith",
      email: "john@company.com",
      date: "Dec 12", 
      hours: "6.0", 
      activity: "Client meeting and planning session",
      avatar: "JS"
    }
  ];

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500">Track your daily work hours</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <div>
              <AddEntryDialog />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg ">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                      <span className="text-sm text-gray-500">{stat.unit}</span>
                    </div>
                    <p className={`text-xs mt-1 ${stat.color}`}>
                      {stat.change.startsWith('+') ? '↗' : ''} {stat.change}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Entries Table */}
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Timesheet Entries</CardTitle>
              <Button variant="ghost" size="sm" className="text-gray-500">
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <div>ID</div>
              <div>Invoice No.</div>
              <div>Contact</div>
              <div>Date</div>
              <div>Hours</div>
              <div>Activity</div>
            </div>
            
            {/* Table Rows */}
            <div className="divide-y divide-gray-100">
              {entries.map((entry) => (
                <div key={entry.id} className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="text-sm font-medium text-gray-900">{entry.id}</div>
                  <div className="text-sm text-gray-600">{entry.invoice}</div>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                        {entry.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{entry.contact}</div>
                      <div className="text-xs text-gray-500">{entry.email}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{entry.date}</div>
                  <div className="text-sm font-medium text-gray-900">{entry.hours}h</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 truncate pr-2">{entry.activity}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}