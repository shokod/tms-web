// import React, { useState, useEffect } from 'react';
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { 
//   ArrowLeft, 
//   Edit2, 
//   Copy, 
//   
//    
//    
//   Building2,
//   DollarSign,
//   
//   Calendar,
//   FileText,
//   
//   
//   
//   Save,
//   Download,
//   Star,
//   MessageSquare,
//   
//   
//   
//   Mail,
//   
//   
//   BarChart3
// } from "lucide-react";

// interface TimesheetEntry {
//   id: string;
//   invoice: string;
//   contact: string;
//   email: string;
//   date: string;
//   hours: number;
//   activity: string;
//   project: string;
//   status: 'approved' | 'pending' | 'rejected';
//   avatar: string;
//   client: string;
//   rate: number;
//   total: number;
//   category: string;
//   tags: string[];
//   startTime: string;
//   endTime: string;
//   breakTime: number;
//   notes: string;
// }

// const TimesheetEntryDetail: React.FC = () => {
//   const [entry] = useState<TimesheetEntry>({
//     id: "01",
//     invoice: "RSLITE-TN 001 BTA",
//     contact: "Delvin Shoko",
//     email: "john@company.com",
//     date: "2024-12-15",
//     hours: 8.0,
//     activity: "User authentication system development - implementing OAuth integration with detailed security protocols and comprehensive testing for production deployment.",
//     project: "Authentication System",
//     status: "approved",
//     avatar: "JS",
//     client: "TechCorp Solutions",
//     rate: 85.00,
//     total: 680.00,
//     category: "Development",
//     tags: ["OAuth", "Security", "Backend"],
//     startTime: "09:00",
//     endTime: "17:00",
//     breakTime: 30,
//     notes: "Completed OAuth 2.0 integration with Google and Microsoft providers. Implemented token refresh logic and comprehensive error handling. All security tests passed successfully."
//   });

//   const [isEditing, setIsEditing] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const formatDate = (dateString: string): string => {
//     return new Date(dateString).toLocaleDateString('en-US', { 
//       weekday: 'short',
//       month: 'short', 
//       day: 'numeric',
//       year: 'numeric'
//     });
//   };

//   const handleEdit = () => setIsEditing(!isEditing);
  
//   const handleSave = async () => {
//     setIsLoading(true);
//     await new Promise(resolve => setTimeout(resolve, 1000));
//     setIsLoading(false);
//     setIsEditing(false);
//   };

//   const getStatusConfig = (status: string) => {
//     switch (status) {
//       case 'approved': 
//         return { 
//           bg: 'bg-emerald-50', 
//           text: 'text-emerald-700', 
//           border: 'border-emerald-200',
//           dot: 'bg-emerald-500'
//         };
//       case 'pending': 
//         return { 
//           bg: 'bg-amber-50', 
//           text: 'text-amber-700', 
//           border: 'border-amber-200',
//           dot: 'bg-amber-500'
//         };
//       case 'rejected': 
//         return { 
//           bg: 'bg-red-50', 
//           text: 'text-red-700', 
//           border: 'border-red-200',
//           dot: 'bg-red-500'
//         };
//       default: 
//         return { 
//           bg: 'bg-gray-50', 
//           text: 'text-gray-700', 
//           border: 'border-gray-200',
//           dot: 'bg-gray-500'
//         };
//     }
//   };

//   const statusConfig = getStatusConfig(entry.status);
//   const productivity = Math.round((entry.hours / 8) * 100);
//   const efficiency = Math.round(85 + Math.random() * 15);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Compact Header */}
//       <div className="bg-white border-b border-gray-100 px-6 py-4">
//         <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
//               <ArrowLeft className="h-4 w-4 mr-2" />
//               Back
//             </Button>
//             <div className="h-4 w-px bg-gray-200"></div>
//             <div>
//               <h1 className="text-lg font-semibold text-gray-900">Entry #{entry.id}</h1>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <Button variant="ghost" size="sm">
//               <Copy className="h-4 w-4 mr-2" />
//               Duplicate
//             </Button>
//             <Button 
//               onClick={isEditing ? handleSave : handleEdit}
//               disabled={isLoading}
//               size="sm" 
//               className="bg-gray-900 hover:bg-gray-800"
//             >
//               {isLoading ? (
//                 <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
//               ) : (
//                 <>
//                   {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
//                 </>
//               )}
//               {isLoading ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
//             </Button>
//             <Button variant="ghost" size="sm">
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content Grid */}
//       <div className="max-w-screen-2xl mx-auto p-6">
//         <div className={`grid grid-cols-12 gap-6 h-[calc(100vh-120px)] transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          
//           {/* Left Panel - Project Overview */}
//           <div className="col-span-5 space-y-6">
            
//             {/* Project Header Card */}
//             <Card className="border-0 shadow-sm h-fit">
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between mb-4">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-3">
//                       <Badge className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} px-3 py-1`}>
//                         <div className={`w-2 h-2 ${statusConfig.dot} rounded-full mr-2 animate-pulse`}></div>
//                         {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
//                       </Badge>
//                       <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
//                     </div>
                    
//                     <h2 className="text-2xl font-bold text-gray-900 mb-2">{entry.project}</h2>
                    
//                     <div className="flex items-center gap-2 text-gray-600 mb-4">
//                       <Building2 className="h-4 w-4" />
//                       <span className="font-medium">{entry.client}</span>
//                       <span className="text-gray-400">•</span>
//                       <span>{entry.category}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <p className="text-gray-700 leading-relaxed mb-4">{entry.activity}</p>
                
//                 <div className="flex flex-wrap gap-2">
//                   {entry.tags.map((tag, index) => (
//                     <Badge 
//                       key={index} 
//                       variant="secondary" 
//                       className="bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
//                     >
//                       {tag}
//                     </Badge>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Work Notes */}
//             <Card className="border-0 shadow-sm flex-1">
//               <CardContent className="p-6 h-full">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
//                     <FileText className="h-4 w-4 text-blue-600" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-gray-900">Session Notes</h3>
//                 </div>
                
//                 <div className="bg-gray-50 rounded-lg p-4 h-[calc(100%-60px)] overflow-y-auto">
//                   <p className="text-gray-700 leading-relaxed">{entry.notes}</p>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Center Panel - Time & Performance */}
//           <div className="col-span-4 space-y-6">
            
//             {/* Time Overview */}
//             <Card className="border-0 shadow-sm">
//               <CardContent className="p-6">
//                 <div className="text-center mb-6">
//                   <div className="text-4xl font-bold text-gray-900 mb-2">{entry.hours}</div>
//                   <div className="text-sm text-gray-500 uppercase tracking-wide">Total Hours</div>
//                 </div>

//                 <div className="grid grid-cols-3 gap-4 mb-6">
//                   <div className="text-center p-3 bg-green-50 rounded-lg">
//                     <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
//                       <Play className="h-4 w-4 text-green-600" />
//                     </div>
//                     <div className="font-semibold text-gray-900">{entry.startTime}</div>
//                     <div className="text-xs text-gray-500">Start</div>
//                   </div>

//                   <div className="text-center p-3 bg-blue-50 rounded-lg">
//                     <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2">
//                       <Clock className="h-4 w-4 text-blue-600" />
//                     </div>
//                     <div className="font-semibold text-gray-900">{entry.breakTime}m</div>
//                     <div className="text-xs text-gray-500">Break</div>
//                   </div>

//                   <div className="text-center p-3 bg-red-50 rounded-lg">
//                     <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mx-auto mb-2">
//                       <Pause className="h-4 w-4 text-red-600" />
//                     </div>
//                     <div className="font-semibold text-gray-900">{entry.endTime}</div>
//                     <div className="text-xs text-gray-500">End</div>
//                   </div>
//                 </div>

//                 <div className="text-center text-sm text-gray-600">
//                   <span className="font-medium">{productivity}%</span> of standard workday
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Performance Metrics */}
//             <Card className="border-0 shadow-sm">
//               <CardContent className="p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
//                   <BarChart3 className="h-5 w-5" />
//                   Performance
//                 </h3>

//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
//                     <div className="flex items-center gap-2">
//                       <TrendingUp className="h-4 w-4 text-blue-600" />
//                       <span className="text-sm font-medium text-gray-700">Productivity</span>
//                     </div>
//                     <span className="text-sm font-bold text-blue-600">{productivity}%</span>
//                   </div>

//                   <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
//                     <div className="flex items-center gap-2">
//                       <Zap className="h-4 w-4 text-purple-600" />
//                       <span className="text-sm font-medium text-gray-700">Efficiency</span>
//                     </div>
//                     <span className="text-sm font-bold text-purple-600">{efficiency}%</span>
//                   </div>

//                   <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
//                     <div className="flex items-center gap-2">
//                       <Target className="h-4 w-4 text-emerald-600" />
//                       <span className="text-sm font-medium text-gray-700">Quality</span>
//                     </div>
//                     <span className="text-sm font-bold text-emerald-600">Excellent</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Financial Summary */}
//             <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-green-50">
//               <CardContent className="p-6">
//                 <div className="flex items-center gap-3 mb-4">
//                   <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
//                     <DollarSign className="h-4 w-4 text-emerald-600" />
//                   </div>
//                   <h3 className="text-lg font-semibold text-emerald-900">Earnings</h3>
//                 </div>

//                 <div className="text-center mb-4">
//                   <div className="text-3xl font-bold text-emerald-900">${entry.total}</div>
//                   <div className="text-sm text-emerald-700">Total Amount</div>
//                 </div>

//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-emerald-700">Rate per hour</span>
//                     <span className="font-semibold text-emerald-900">${entry.rate}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-emerald-700">Hours worked</span>
//                     <span className="font-semibold text-emerald-900">{entry.hours}h</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Right Panel - Contact & Actions */}
//           <div className="col-span-3 space-y-6">
            
//             {/* Contact Card */}
//             <Card className="border-0 shadow-sm">
//               <CardContent className="p-6">
//                 <div className="text-center mb-6">
//                   <div className="relative inline-block mb-4">
//                     <Avatar className="h-16 w-16 ring-2 ring-gray-100">
//                       <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold text-lg">
//                         {entry.avatar}
//                       </AvatarFallback>
//                     </Avatar>
//                     <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
//                   </div>
//                   <h4 className="font-semibold text-gray-900 mb-1">{entry.contact}</h4>
//                   <p className="text-sm text-gray-500">{entry.email}</p>
//                 </div>

//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between py-2 border-b border-gray-50">
//                     <span className="text-gray-600">Invoice</span>
//                     <span className="font-medium text-xs">{entry.invoice}</span>
//                   </div>
//                   <div className="flex justify-between py-2 border-b border-gray-50">
//                     <span className="text-gray-600">Client</span>
//                     <span className="font-medium">{entry.client}</span>
//                   </div>
//                   <div className="flex justify-between py-2 border-b border-gray-50">
//                     <span className="text-gray-600">Category</span>
//                     <span className="font-medium">{entry.category}</span>
//                   </div>
//                   <div className="flex justify-between py-2">
//                     <span className="text-gray-600">Date</span>
//                     <span className="font-medium">{formatDate(entry.date)}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Quick Stats */}
//             <Card className="border-0 shadow-sm">
//               <CardContent className="p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="text-center p-3 bg-gray-50 rounded-lg">
//                     <div className="text-lg font-bold text-gray-900">8h</div>
//                     <div className="text-xs text-gray-500">Duration</div>
//                   </div>
//                   <div className="text-center p-3 bg-gray-50 rounded-lg">
//                     <div className="text-lg font-bold text-gray-900">{productivity}%</div>
//                     <div className="text-xs text-gray-500">Progress</div>
//                   </div>
//                 </div>

//                 <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-center">
//                   <div className="text-lg font-bold text-emerald-700">${entry.total}</div>
//                   <div className="text-xs text-emerald-600">Total Earned</div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Actions */}
//             <Card className="border-0 shadow-sm">
//               <CardContent className="p-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                
//                 <div className="space-y-3">
//                   <Button 
//                     variant="outline" 
//                     className="w-full justify-start hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
//                   >
//                     <Download className="mr-2 h-4 w-4" />
//                     Export PDF
//                   </Button>
//                   <Button 
//                     variant="outline" 
//                     className="w-full justify-start hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700"
//                   >
//                     <MessageSquare className="mr-2 h-4 w-4" />
//                     Add Comment
//                   </Button>
//                   <Button 
//                     variant="outline" 
//                     className="w-full justify-start hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700"
//                   >
//                     <Star className="mr-2 h-4 w-4" />
//                     Add to Favorites
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Delete Action */}
//             <Button 
//               variant="outline" 
//               className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
//             >
//               <FileText className="mr-2 h-4 w-4" />
//               Delete Entry
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TimesheetEntryDetail;
"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  ArrowLeft,
  Calendar,
     Building2,
  DollarSign,
    FileText,
  Plus,
  Edit2,
  Download,
  Search,
  Eye,
  Trash2,
  Copy,
  Mail,
  Zap
} from "lucide-react";

interface Employee {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  startDate: string;
  hourlyRate: number;
}

interface TimesheetEntry {
  id: string;
  date: string;
  project: string;
  client: string;
  category: string;
  description: string;
  startTime: string;
  endTime: string;
  breakTime: number;
  totalHours: number;
  status: 'approved' | 'pending' | 'rejected';
  tags: string[];
  notes?: string;
}

interface WeeklyData {
  weekOf: string;
  totalHours: number;
  targetHours: number;
  totalEarnings: number;
  entries: TimesheetEntry[];
  productivity: number;
  efficiency: number;
}

const DetailedTimesheetPage: React.FC = () => {
  const [employee] = useState<Employee>({
    id: "emp001",
    name: "Delvin Shoko",
    email: "john.smith@company.com",
    avatar: "JS",
    role: "Senior Developer",
    department: "Engineering",
    startDate: "2023-01-15",
    hourlyRate: 85
  });

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);

  const [weeklyData, setWeeklyData] = useState<WeeklyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function loadWeekly() {
      try {
        setLoading(true);
        const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : undefined;
        if (!id) return;
        const res = await fetch(`/api/timesheets/${id}`, { signal: controller.signal });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message || 'Failed to load timesheet');

        const data = json.data;
        const entries = (data.entries || []).map((e: any) => ({
          id: e.id,
          date: e.date,
          project: e.project,
          client: '',
          category: '',
          description: e.activity || '',
          startTime: e.start_time || '',
          endTime: e.end_time || '',
          breakTime: e.break_minutes || 0,
          totalHours: e.hours || 0,
          status: e.status || 'draft',
          tags: [] as string[],
          notes: ''
        }));

        setWeeklyData({
          weekOf: new Date(data.weekStart).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          totalHours: data.totalHours || 0,
          targetHours: data.targetHours || 40,
          totalEarnings: 0,
          productivity: data.productivity || 0,
          efficiency: data.efficiency || 0,
          entries
        });
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadWeekly();
    return () => controller.abort();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-gray-50" />;
  }
  if (error || !weeklyData) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { 
          bg: 'bg-emerald-50', 
          text: 'text-emerald-700', 
          border: 'border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'pending':
        return { 
          bg: 'bg-amber-50', 
          text: 'text-amber-700', 
          border: 'border-amber-200',
          dot: 'bg-amber-500'
        };
      case 'rejected':
        return { 
          bg: 'bg-red-50', 
          text: 'text-red-700', 
          border: 'border-red-200',
          dot: 'bg-red-500'
        };
      default:
        return { 
          bg: 'bg-gray-50', 
          text: 'text-gray-700', 
          border: 'border-gray-200',
          dot: 'bg-gray-500'
        };
    }
  };

  const filteredEntries = weeklyData.entries.filter(entry => {
    const matchesStatus = filterStatus === "all" || entry.status === filterStatus;
    const matchesSearch = searchTerm === "" || 
      entry.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const progressPercentage = (weeklyData.totalHours / weeklyData.targetHours) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-5 w-px bg-gray-200"></div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Employee Timesheet</h1>
                <p className="text-sm text-gray-500">Week of {weeklyData.weekOf}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button size="sm" className="bg-gray-900 hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                New Entry
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto p-6">
        <div className={`grid grid-cols-12 gap-6 transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* Left Sidebar - Employee Info */}
          <div className="col-span-3 space-y-6">
            
            {/* Employee Profile */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-20 w-20 ring-4 ring-white shadow-lg">
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold text-xl">
                        {employee.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{employee.name}</h2>
                  <p className="text-sm text-gray-500 mb-1">{employee.role}</p>
                  <p className="text-xs text-gray-400">{employee.department}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span>${employee.hourlyRate}/hour</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>Since {new Date(employee.startDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Week Summary */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Week Summary</h3>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">{weeklyData.totalHours}h worked</span>
                    <span className="text-gray-500">{weeklyData.targetHours}h target</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        progressPercentage >= 100 ? 'bg-emerald-500' : 
                        progressPercentage >= 75 ? 'bg-blue-500' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-center text-xs text-gray-500 mt-1">
                    {progressPercentage.toFixed(0)}% of target
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-700">{weeklyData.productivity}%</div>
                    <div className="text-xs text-blue-600">Productivity</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-lg font-bold text-purple-700">{weeklyData.efficiency}%</div>
                    <div className="text-xs text-purple-600">Efficiency</div>
                  </div>
                </div>

                <div className="text-center p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-700">${weeklyData.totalEarnings}</div>
                  <div className="text-sm text-emerald-600">Total Earnings</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Entries this week</span>
                    <span className="font-semibold">{weeklyData.entries.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Avg hours/day</span>
                    <span className="font-semibold">{(weeklyData.totalHours / 5).toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Approved entries</span>
                    <span className="font-semibold text-emerald-600">
                      {weeklyData.entries.filter(e => e.status === 'approved').length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending approval</span>
                    <span className="font-semibold text-amber-600">
                      {weeklyData.entries.filter(e => e.status === 'pending').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Timesheet Entries */}
          <div className="col-span-9 space-y-6">
            
            {/* Filters and Search */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search entries..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {filteredEntries.length} of {weeklyData.entries.length} entries
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Entries List */}
            <div className="space-y-4">
              {filteredEntries.map((entry, index) => {
                const statusConfig = getStatusConfig(entry.status);
                
                return (
                  <Card 
                    key={entry.id} 
                    className={`border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.01] ${
                      mounted ? 'animate-in slide-in-from-left duration-500' : ''
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6">
                      <div className="grid grid-cols-12 gap-4 items-start">
                        
                        {/* Date & Status */}
                        <div className="col-span-2">
                          <div className="text-lg font-bold text-gray-900 mb-1">{entry.date}</div>
                          <Badge className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} text-xs px-2 py-1`}>
                            <div className={`w-2 h-2 ${statusConfig.dot} rounded-full mr-1 animate-pulse`}></div>
                            {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                          </Badge>
                        </div>

                        {/* Project & Client */}
                        <div className="col-span-3">
                          <h4 className="font-semibold text-gray-900 mb-1">{entry.project}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            <Building2 className="h-4 w-4" />
                            <span>{entry.client}</span>
                          </div>
                          <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {entry.category}
                          </div>
                        </div>

                        {/* Description */}
                        <div className="col-span-4">
                          <p className="text-gray-700 text-sm leading-relaxed mb-2">{entry.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {entry.tags.map((tag, tagIndex) => (
                              <Badge 
                                key={tagIndex} 
                                variant="secondary" 
                                className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Time Details */}
                        <div className="col-span-2">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Start:</span>
                              <span className="font-medium">{entry.startTime}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">End:</span>
                              <span className="font-medium">{entry.endTime}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Break:</span>
                              <span className="font-medium">{entry.breakTime}m</span>
                            </div>
                            <div className="border-t pt-2 mt-2">
                              <div className="text-center">
                                <div className="text-xl font-bold text-gray-900">{entry.totalHours}h</div>
                                <div className="text-xs text-gray-500">Total</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="col-span-1 flex flex-col gap-2">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-600">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-600">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Notes Section (if exists) */}
                      {entry.notes && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                            <div>
                              <div className="text-sm font-medium text-gray-900 mb-1">Notes</div>
                              <p className="text-sm text-gray-600">{entry.notes}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredEntries.length === 0 && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No entries found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || filterStatus !== 'all' 
                      ? "Try adjusting your search criteria or filters"
                      : "No timesheet entries for this week yet"
                    }
                  </p>
                  <Button className="bg-gray-900 hover:bg-gray-800">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Entry
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Weekly Summary Footer */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-gray-50 to-blue-50">
              <CardContent className="p-6">
                <div className="grid grid-cols-5 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{weeklyData.totalHours}</div>
                    <div className="text-sm text-gray-500">Total Hours</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-600 mb-1">${weeklyData.totalEarnings}</div>
                    <div className="text-sm text-gray-500">Total Earnings</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 mb-1">{weeklyData.productivity}%</div>
                    <div className="text-sm text-gray-500">Productivity</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600 mb-1">{weeklyData.efficiency}%</div>
                    <div className="text-sm text-gray-500">Efficiency</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {weeklyData.entries.filter(e => e.status === 'approved').length}/{weeklyData.entries.length}
                    </div>
                    <div className="text-sm text-gray-500">Approved</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedTimesheetPage;