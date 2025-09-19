'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Link from 'next/link';
import { 
  Search, 
  Plus, 
  MoreHorizontal,
  Filter,
  Users
} from "lucide-react";

const employees = [
  {
    id: "1",
    name: "John Smith",
    email: "john@company.com",
    role: "Senior Developer",
    department: "Engineering",
    status: "Active",
    avatar: "JS"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "Product Manager",
    department: "Product",
    status: "Active",
    avatar: "SJ"
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@company.com",
    role: "UI Designer",
    department: "Design",
    status: "Active",
    avatar: "MB"
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma@company.com",
    role: "QA Engineer",
    department: "Engineering",
    status: "Active",
    avatar: "EW"
  }
];

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Employees</h1>
              <p className="text-sm text-gray-500">Manage team members</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Employee Directory</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search employees..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Table Header */}
            <div className="grid grid-cols-6 gap-4 px-6 py-3 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wide">
              <div>Employee</div>
              <div>Role</div>
              <div>Department</div>
              <div>Email</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {filteredEmployees.map((employee) => (
                <Link
                  key={employee.id}
                  href={`/employees/${employee.id}`}
                  className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {employee.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 flex items-center">{employee.role}</div>
                  <div className="text-sm text-gray-600 flex items-center">{employee.department}</div>
                  <div className="text-sm text-gray-600 flex items-center">{employee.email}</div>
                  <div className="flex items-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {employee.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-end">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </Button>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}