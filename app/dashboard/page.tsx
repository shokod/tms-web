// // app/dashboard/page.tsx
// 'use client';

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { 
//   Plus, 
//   Clock, 
//   FileText, 
//   TrendingUp, 
//   Calendar, 
//   Users, 
//   Home,
//   BarChart3,
//   Settings,
//   Bell,
//   Menu,
//   LogOut
// } from "lucide-react";

// export default function DashboardPage() {
//   const user = { name: "John Smith", position: "Senior Developer", avatar: "JS" };
  
//   const stats = [
//     { title: "This Month", value: "168h", change: "+12%", icon: Calendar, trend: "up" },
//     { title: "This Week", value: "40h", change: "5 days", icon: Clock, trend: "neutral" },
//     { title: "Projects", value: "5", change: "2 completed", icon: Users, trend: "neutral" },
//     { title: "Avg/Day", value: "8h", change: "Standard", icon: TrendingUp, trend: "neutral" }
//   ];

//   const entries = [
//     { id: 1, invoice: "RSLITE-TN 001 BTA", date: "Dec 15", hours: 8, activity: "User authentication system development" },
//     { id: 2, invoice: "RSLITE-TN 002 BTA", date: "Dec 14", hours: 7.5, activity: "Dashboard UI and API integration" },
//     { id: 3, invoice: "RSLITE-TN 003 BTA", date: "Dec 13", hours: 8, activity: "Code review and bug fixes" },
//     { id: 4, invoice: "RSLITE-TN 004 BTA", date: "Dec 12", hours: 6, activity: "Client meeting and planning" }
//   ];

//   const navItems = [
//     { icon: Home, label: "Dashboard", active: true },
//     { icon: Clock, label: "Timesheet" },
//     { icon: BarChart3, label: "Reports" },
//     { icon: Settings, label: "Settings" }
//   ];

//   const Sidebar = () => (
//     <div className="pb-12 w-64">
//       <div className="space-y-4 py-4">
//         <div className="px-3 py-2">
//           <h2 className="mb-2 px-4 text-lg font-semibold">Timesheet</h2>
//           <div className="space-y-1">
//             {navItems.map((item) => {
//               const Icon = item.icon;
//               return (
//                 <Button
//                   key={item.label}
//                   variant={item.active ? "secondary" : "ghost"}
//                   className="w-full justify-start"
//                 >
//                   <Icon className="mr-2 h-4 w-4" />
//                   {item.label}
//                 </Button>
//               );
//             })}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   return (
//     <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
//       {/* Desktop Sidebar */}
//       <div className="hidden border-r bg-muted/40 md:block">
//         <Sidebar />
//       </div>

//       <div className="flex flex-col">
//         {/* Top Navigation */}
//         <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
//           {/* Mobile Menu */}
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="outline" size="icon" className="shrink-0 md:hidden">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left" className="flex flex-col">
//               <Sidebar />
//             </SheetContent>
//           </Sheet>

//           <div className="w-full flex-1">
//             <h1 className="text-lg font-semibold md:text-xl">Dashboard</h1>
//           </div>

//           {/* Top Nav Actions */}
//           <Button variant="outline" size="icon">
//             <Bell className="h-4 w-4" />
//           </Button>
          
//           <div className="flex items-center gap-2">
//             <Avatar className="h-8 w-8">
//               <AvatarImage src="/placeholder-user.jpg" alt="Avatar" />
//               <AvatarFallback>{user.avatar}</AvatarFallback>
//             </Avatar>
//             <div className="hidden lg:block">
//               <p className="text-sm font-medium">{user.name}</p>
//               <p className="text-xs text-muted-foreground">{user.position}</p>
//             </div>
//           </div>

//           <Button variant="outline" size="icon">
//             <LogOut className="h-4 w-4" />
//           </Button>
//         </header>

//         {/* Main Content */}
//         <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//           {/* Quick Actions */}
//           <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
//             <Card className="hover:shadow-md transition-shadow cursor-pointer">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-base">New Entry</CardTitle>
//                 <CardDescription>Log today's work hours</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button className="w-full">
//                   <Plus className="mr-2 h-4 w-4" />
//                   Add Entry
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card className="hover:shadow-md transition-shadow cursor-pointer">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-base">Reports</CardTitle>
//                 <CardDescription>Export monthly reports</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button variant="outline" className="w-full">
//                   <FileText className="mr-2 h-4 w-4" />
//                   View Reports
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card className="hover:shadow-md transition-shadow cursor-pointer">
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-base">Quick Log</CardTitle>
//                 <CardDescription>Duplicate recent entry</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <Button variant="outline" className="w-full">
//                   <Clock className="mr-2 h-4 w-4" />
//                   Quick Add
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Stats */}
//           <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
//             {stats.map((stat) => {
//               const Icon = stat.icon;
//               return (
//                 <Card key={stat.title}>
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium">
//                       {stat.title}
//                     </CardTitle>
//                     <Icon className="h-4 w-4 text-muted-foreground" />
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-bold">{stat.value}</div>
//                     <p className="text-xs text-muted-foreground">
//                       {stat.trend === 'up' && '↗ '}{stat.change}
//                     </p>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>

//           {/* Recent Entries */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle>Recent Entries</CardTitle>
//                 <Button variant="ghost" size="sm">View All</Button>
//               </div>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-3">
//                 {entries.map((entry) => (
//                   <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors">
//                     <div className="flex-1 space-y-1">
//                       <div className="flex items-center gap-2">
//                         <Badge variant="outline" className="text-xs">
//                           {entry.invoice}
//                         </Badge>
//                         <span className="text-sm text-muted-foreground">{entry.date}</span>
//                       </div>
//                       <p className="text-sm">{entry.activity}</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <Badge>{entry.hours}h</Badge>
//                       <Button variant="ghost" size="icon" className="h-8 w-8">
//                         <span className="text-muted-foreground">⋯</span>
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </CardContent>
//           </Card>
//         </main>
//       </div>
//     </div>
//   );
// }

// app/dashboard/page.tsx
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
  const user = { name: "John Smith", position: "Senior Developer", avatar: "JS" };
  
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

  const navItems = [
    { icon: Home, label: "Dashboard", active: true },
    { icon: Clock, label: "Timesheet" },
    { icon: BarChart3, label: "Reports" },
    { icon: Building2, label: "Projects" },
    { icon: User, label: "People" },
    { icon: Settings, label: "Settings" }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-60 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">T</span>
            </div>
            <span className="font-semibold text-lg">Timesheet</span>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search..." 
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.label}
                  variant={item.active ? "secondary" : "ghost"}
                  className={`w-full justify-start text-sm ${
                    item.active 
                      ? "bg-gray-100 text-gray-900" 
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  size="sm"
                >
                  <Icon className="mr-3 h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Bottom User */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gray-200 text-gray-600">{user.avatar}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.position}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
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
              <Card key={index} className="border-0 shadow-sm bg-white">
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
      </div>
    </div>
  );
}