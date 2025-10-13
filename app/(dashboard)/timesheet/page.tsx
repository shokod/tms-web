"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  generateReadableId, 
  generateInvoiceNumber, 
  generateAvatar 
} from "@/lib/utils/invoice-generator";
import AddEntryDialog from "@/components/add-entry-button";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  MoreHorizontal,
  Edit2,
  Trash2,
  Copy,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Building2,
  User,
  Home,
  BarChart3,
  Settings,
} from "lucide-react";

const TimesheetPage = () => {
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const [loaded, setLoaded] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [entries, setEntries] = useState<any[]>([]);


  // Debounce search term to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchEntries() {
      try {
        const params = new URLSearchParams({
          limit: String(itemsPerPage),
          offset: String((currentPage - 1) * itemsPerPage),
          order: sortOrder,
          sort: sortField,
          status: filterStatus,
          q: debouncedSearchTerm || "",
        });
        const res = await fetch(`/api/time-entries?${params.toString()}`, {
          signal: controller.signal,
        });
        const json = await res.json();
        if (res.ok) {
          // Transform entries to include readable IDs and auto-generated invoice numbers
          const transformedEntries = (json.data || []).map((entry: any) => {
            const readableId = generateReadableId(entry.id);
            return {
              ...entry,
              id: readableId, // Display ID
              originalId: entry.id, // Keep original UUID for API calls
              invoice: generateInvoiceNumber(entry.contact, readableId),
              avatar: generateAvatar(entry.contact)
            };
          });
          setEntries(transformedEntries);
          setTotalCount(json.count || 0);
        }
        setLoaded(true);
      } catch (error) {
        // Only set loaded to true if the request wasn't aborted
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Failed to fetch entries:', error);
          setLoaded(true);
        }
      }
    }

    fetchEntries();

    const onCreated = () => {
      fetchEntries();
    };
    window.addEventListener("time-entries:created", onCreated);
    return () => {
      controller.abort();
      window.removeEventListener("time-entries:created", onCreated);
    };
  }, [
    itemsPerPage,
    currentPage,
    sortOrder,
    sortField,
    filterStatus,
    debouncedSearchTerm,
  ]);

  const navItems = [
    { icon: Home, label: "Dashboard", active: false },
    { icon: Clock, label: "Timesheet", active: true },
    { icon: BarChart3, label: "Reports", active: false },
    { icon: Building2, label: "Projects", active: false },
    { icon: User, label: "People", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  // Filter and sort entries
  const filteredEntries = useMemo(
    () =>
      entries
        .filter((entry) => {
          // Handle object values in search
          const contactValue = typeof entry.contact === 'string' ? entry.contact : entry.contact?.name || '';
          const projectValue = typeof entry.project === 'string' ? entry.project : entry.project?.name || '';
          
          const matchesSearch =
            (entry.activity || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            contactValue
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            (entry.invoice || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            projectValue
              .toLowerCase()
              .includes(searchTerm.toLowerCase());
          // Handle both string and object status values
          let entryStatusValue: string;
          if (typeof entry.status === 'string') {
            entryStatusValue = entry.status;
          } else if (entry.status && typeof entry.status === 'object') {
            entryStatusValue = entry.status.name || entry.status.status || '';
          } else {
            entryStatusValue = '';
          }
          
          const matchesFilter =
            filterStatus === "all" ||
            entryStatusValue === filterStatus ||
            !entryStatusValue;
          return matchesSearch && matchesFilter;
        })
        .sort((a, b) => {
          let aVal = a[sortField as keyof typeof a];
          let bVal = b[sortField as keyof typeof b];

          if (sortField === "date") {
            aVal = new Date(a.date).getTime();
            bVal = new Date(b.date).getTime();
          }

          if (sortOrder === "asc") {
            return aVal < bVal ? -1 : 1;
          } else {
            return aVal > bVal ? -1 : 1;
          }
        }),
    [entries, sortField, sortOrder, filterStatus, searchTerm]
  );

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil((totalCount || filteredEntries.length) / itemsPerPage)
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntries = filteredEntries.slice(startIndex, endIndex);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEntries(currentEntries.map((entry) => entry.id));
    } else {
      setSelectedEntries([]);
    }
  };

  const handleSelectEntry = (entryId: string, checked: boolean) => {
    if (checked) {
      setSelectedEntries([...selectedEntries, entryId]);
    } else {
      setSelectedEntries(selectedEntries.filter((id) => id !== entryId));
    }
  };

  const getStatusBadge = (status: string | any) => {
    // Handle both string and object status values
    let statusValue: string;
    if (typeof status === 'string') {
      statusValue = status;
    } else if (status && typeof status === 'object') {
      statusValue = status.name || status.status || 'unknown';
    } else {
      statusValue = 'unknown';
    }

    const statusConfig = {
      approved: {
        variant: "default" as const,
        color: "bg-green-100 text-green-800",
        label: "Approved",
      },
      pending: {
        variant: "secondary" as const,
        color: "bg-yellow-100 text-yellow-800",
        label: "Pending",
      },
      draft: {
        variant: "outline" as const,
        color: "bg-gray-100 text-gray-800",
        label: "Draft",
      },
    };

    const config = statusConfig[statusValue as keyof typeof statusConfig] || {
      variant: "outline" as const,
      color: "bg-gray-100 text-gray-800",
      label: "Unknown",
    };
    return <Badge className={`${config.color} border-0`}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalHours = currentEntries.reduce(
    (sum, entry) => sum + entry.hours,
    0
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Timesheet Entries
                </h1>
                <p className="text-sm text-gray-500">
                  Manage your work hours and activities
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <AddEntryDialog />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <Card className="border-0 shadow-sm bg-white">
            {/* Filters and Actions */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">December 2024</span>
                  </div>
                </div>

                {selectedEntries.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {selectedEntries.length} selected
                    </span>
                    <Button variant="outline" size="sm">
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Total Hours</div>
                  <div className="text-lg font-semibold">
                    {totalHours.toFixed(1)}h
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Entries</div>
                  <div className="text-lg font-semibold">
                    {filteredEntries.length}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Approved</div>
                  <div className="text-lg font-semibold text-green-600">
                    {
                      filteredEntries.filter((e) => e.status === "approved")
                        .length
                    }
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm text-gray-600">Pending</div>
                  <div className="text-lg font-semibold text-yellow-600">
                    {
                      filteredEntries.filter((e) => e.status === "pending")
                        .length
                    }
                  </div>
                </div>
              </div>
            </div>

            <CardContent className="p-0">
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4 w-12">
                        <Checkbox
                          checked={
                            selectedEntries.length === currentEntries.length &&
                            currentEntries.length > 0
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto items-center  font-medium hover:bg-transparent"
                        >
                          ID
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Invoice No.
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Contact
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 h-auto font-medium hover:bg-transparent"
                        >
                          Date
                          <ArrowUpDown className="ml-1 h-3 w-3" />
                        </Button>
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Hours
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Project
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Activity
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {currentEntries.map((entry) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() =>
                          (window.location.href = `/time-entries/${entry.originalId}`)
                        }
                      >
                        <td className="p-4">
                          <Checkbox
                            checked={selectedEntries.includes(entry.originalId)}
                            onCheckedChange={(checked) =>
                              handleSelectEntry(entry.originalId, checked as boolean)
                            }
                          />
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium text-gray-900">
                            {entry.id}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600">
                            {entry.invoice}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                {typeof entry.avatar === 'string' ? entry.avatar : 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {typeof entry.contact === 'string' ? entry.contact : entry.contact?.name || 'Unknown'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {typeof entry.email === 'string' ? entry.email : entry.email?.email || ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600">
                            {formatDate(entry.date)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium text-gray-900">
                            {entry.hours}h
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-gray-600">
                            {typeof entry.project === 'string' ? entry.project : entry.project?.name || 'Unknown'}
                          </span>
                        </td>
                        <td className="p-4">{getStatusBadge(entry.status)}</td>
                        <td className="p-4 max-w-xs">
                          <span className="text-sm text-gray-600 truncate block">
                            {entry.activity}
                          </span>
                        </td>
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-400" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Rows per page:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => setItemsPerPage(Number(value))}
                  >
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    {startIndex + 1}-
                    {Math.min(endIndex, filteredEntries.length)} of{" "}
                    {filteredEntries.length}
                  </span>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TimesheetPage;
