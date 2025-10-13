"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  generateReadableId, 
  generateInvoiceNumber, 
  generateAvatar 
} from "@/lib/utils/invoice-generator";
import { getProjectCategory } from "@/lib/utils/category-mapper";
import { 
  ArrowLeft, 
  Edit2, 
  Copy, 
  MoreHorizontal,
  Clock, 
  User, 
  Building2,
  DollarSign,
  CheckCircle,
  Calendar,
  FileText,
  Timer,
  Play,
  Pause,
  Save,
  Download,
  Star,
  MessageSquare,
  TrendingUp,
  Zap,
  MapPin,
  Mail,
  Phone,
  Target,
  BarChart3
} from "lucide-react";

interface TimesheetEntry {
  id: string;
  originalId?: string;
  invoice: string;
  contact: string;
  email: string;
  date: string;
  hours: number;
  activity: string;
  project: string;
  status: 'approved' | 'pending' | 'rejected' | 'draft';
  avatar: string;
  client: string;
  rate: number;
  total: number;
  category: string;
  tags: string[];
  startTime: string;
  endTime: string;
  breakTime: number;
  notes: string;
}

const TimesheetEntryDetail: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [entry, setEntry] = useState<TimesheetEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : undefined;
        if (!id) return;
        const res = await fetch(`/api/time-entries/${id}`, { signal: controller.signal });
        const json = await res.json();
        if (!res.ok) throw new Error(json?.error?.message || 'Failed to load entry');
        
        // Transform API data to include mock/placeholder fields
        const apiEntry = json.data;
        const readableId = generateReadableId(apiEntry.id);
        const contactName = typeof apiEntry.contact === 'string' ? apiEntry.contact : apiEntry.contact?.name || 'John Smith';
        
        const timeDetails = calculateTimeDetails(apiEntry.hours || 8.0);
        const projectData = typeof apiEntry.project === 'object' ? apiEntry.project : null;
        const clientName = projectData?.client || 'TechCorp Solutions'; // Use project client or fallback
        const projectName = typeof apiEntry.project === 'string' ? apiEntry.project : apiEntry.project?.name || 'Authentication System';
        const category = getProjectCategory(projectName); // Dynamic category based on project name
        
        const transformedEntry: TimesheetEntry = {
          id: readableId, // Display ID
          originalId: apiEntry.id, // Keep original UUID
          invoice: generateInvoiceNumber(apiEntry.contact, readableId),
          contact: contactName,
          email: typeof apiEntry.email === 'string' ? apiEntry.email : apiEntry.email?.email || 'john@company.com',
          date: apiEntry.date || '2024-12-15',
          hours: apiEntry.hours || 8.0,
          activity: apiEntry.activity || 'User authentication system development - implementing OAuth integration with detailed security protocols and comprehensive testing for production deployment.',
          project: typeof apiEntry.project === 'string' ? apiEntry.project : apiEntry.project?.name || 'Authentication System',
          status: typeof apiEntry.status === 'string' ? apiEntry.status : apiEntry.status?.name || apiEntry.status?.status || 'approved',
          avatar: generateAvatar(apiEntry.contact),
          client: clientName, // Dynamic from project data
          rate: 85.00, // Mock data
          total: (apiEntry.hours || 8.0) * 85.00, // Calculated
          category: category, // Dynamic category based on project name
          tags: ['OAuth', 'Security', 'Backend'], // Mock data
          startTime: timeDetails.startTime,
          endTime: timeDetails.endTime,
          breakTime: timeDetails.breakDuration * 60, // Convert to minutes
          notes: apiEntry.activity || 'Completed OAuth 2.0 integration with Google and Microsoft providers. Implemented token refresh logic and comprehensive error handling. All security tests passed successfully.'
        };
        
        setEntry(transformedEntry);
      } catch (e: any) {
        if (e instanceof Error && e.name !== 'AbortError') {
          setError(e.message);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);


  const calculateTimeDetails = (hours: number) => {
    const startTime = '07:00';
    const breakStart = '12:30';
    const breakEnd = '13:30';
    const breakDuration = 1; // 1 hour break
    
    // Calculate end time: start + work hours + break duration
    const startHour = 7; // 07:00
    const totalTime = startHour + hours + breakDuration;
    const endTime = `${totalTime.toString().padStart(2, '0')}:30`; // 16:30
    
    return {
      startTime,
      breakStart,
      breakEnd,
      endTime,
      breakDuration
    };
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleEdit = () => setIsEditing(!isEditing);
  
  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsEditing(false);
  };

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
      case 'draft':
        return { 
          bg: 'bg-gray-50', 
          text: 'text-gray-700', 
          border: 'border-gray-200',
          dot: 'bg-gray-500'
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

  if (loading) return <div className="min-h-screen bg-gray-50" />;
  if (error || !entry) return <div className="min-h-screen bg-gray-50" />;

  const statusConfig = getStatusConfig(entry.status);
  const productivity = Math.round((entry.hours / 8) * 100);
  const efficiency = Math.round(85 + Math.random() * 15);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500 hover:text-gray-900"
              onClick={() => router.push('/timesheet')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="h-4 w-px bg-gray-200"></div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Entry #{entry.id}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button 
              onClick={isEditing ? handleSave : handleEdit}
              disabled={isLoading}
              size="sm" 
              className="bg-gray-900 hover:bg-gray-800"
            >
              {isLoading ? (
                <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white/20 border-t-white"></div>
              ) : (
                <>
                  {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
                </>
              )}
              {isLoading ? 'Saving...' : isEditing ? 'Save' : 'Edit'}
            </Button>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-screen-2xl mx-auto p-6">
        <div className={`grid grid-cols-12 gap-6 h-[calc(100vh-120px)] transition-all duration-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* Left Panel - Project Overview */}
          <div className="col-span-5 space-y-6">
            
            {/* Project Header Card */}
            <Card className="border-0 shadow-sm h-fit">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={`${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} px-3 py-1`}>
                        <div className={`w-2 h-2 ${statusConfig.dot} rounded-full mr-2 animate-pulse`}></div>
                        {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-500">{formatDate(entry.date)}</span>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{entry.project}</h2>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <Building2 className="h-4 w-4" />
                      <span className="font-medium">{entry.client}</span>
                      <span className="text-gray-400">•</span>
                      <span>{entry.category}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-4">{entry.activity}</p>
                
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work Notes */}
            <Card className="border-0 shadow-sm flex-1">
              <CardContent className="p-6 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Session Notes</h3>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4 h-[calc(100%-60px)] overflow-y-auto">
                  <p className="text-gray-700 leading-relaxed">{entry.notes}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Time & Performance */}
          <div className="col-span-4 space-y-6">
            
            {/* Time Overview */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{entry.hours}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Total Hours</div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-2">
                      <Play className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="font-semibold text-gray-900">{entry.startTime}</div>
                    <div className="text-xs text-gray-500">Start</div>
                  </div>

                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="font-semibold text-gray-900">12:30-13:30</div>
                    <div className="text-xs text-gray-500">Break</div>
                  </div>

                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full mx-auto mb-2">
                      <Pause className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="font-semibold text-gray-900">{entry.endTime}</div>
                    <div className="text-xs text-gray-500">End</div>
                  </div>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <span className="font-medium">{productivity}%</span> of standard workday
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Productivity</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{productivity}%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">Efficiency</span>
                    </div>
                    <span className="text-sm font-bold text-purple-600">{efficiency}%</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium text-gray-700">Quality</span>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">Excellent</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Summary */}
            <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-green-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-emerald-900">Earnings</h3>
                </div>

                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-emerald-900">${entry.total}</div>
                  <div className="text-sm text-emerald-700">Total Amount</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Rate per hour</span>
                    <span className="font-semibold text-emerald-900">${entry.rate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-700">Hours worked</span>
                    <span className="font-semibold text-emerald-900">{entry.hours}h</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Contact & Actions */}
          <div className="col-span-3 space-y-6">
            
            {/* Contact Card */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-16 w-16 ring-2 ring-gray-100">
                      <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-bold text-lg">
                        {entry.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{entry.contact}</h4>
                  <p className="text-sm text-gray-500">{entry.email}</p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-600">Invoice</span>
                    <span className="font-medium text-xs">{entry.invoice}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-600">Client</span>
                    <span className="font-medium">{entry.client}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-50">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{entry.category}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Date</span>
                    <span className="font-medium">{formatDate(entry.date)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{entry.hours}h</div>
                    <div className="text-xs text-gray-500">Duration</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-bold text-gray-900">{productivity}%</div>
                    <div className="text-xs text-gray-500">Progress</div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-emerald-50 rounded-lg text-center">
                  <div className="text-lg font-bold text-emerald-700">${entry.total}</div>
                  <div className="text-xs text-emerald-600">Total Earned</div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
                
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700"
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Comment
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700"
                  >
                    <Star className="mr-2 h-4 w-4" />
                    Add to Favorites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimesheetEntryDetail;