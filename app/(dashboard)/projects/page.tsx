"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus, Trash2, Filter, Building2 } from "lucide-react";
import AddProjectDialog from "@/components/add-project-button";
import { toast } from "sonner";

type ProjectRow = {
  id: string;
  name: string;
  client: string;
  budget?: number;
  status: "on-track" | "behind" | "at-risk" | { name: string } | { status: string };
  due_date?: string;
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<string>("all");

  // Debounce search term to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        const params = new URLSearchParams({ limit: "100", offset: "0", order: "desc", sort: "due_date" });
        if (debouncedSearch) params.set("q", debouncedSearch);
        const res = await fetch(`/api/projects?${params.toString()}`, { signal: controller.signal });
        const json = await res.json();
        if (res.ok) {
          setProjects(json.data || []);
        }
      } catch (error) {
        // Only set loading to false if the request wasn't aborted
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Failed to fetch projects:', error);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    const onCreated = () => load();
    window.addEventListener("projects:created", onCreated);
    return () => {
      controller.abort();
      window.removeEventListener("projects:created", onCreated);
    };
  }, [debouncedSearch]);

  const filtered = useMemo(() => {
    return projects.filter(p => {
      // Handle both string and object status values
      let statusValue: string;
      if (typeof p.status === 'string') {
        statusValue = p.status;
      } else if (p.status && typeof p.status === 'object') {
        statusValue = (p.status as any).name || (p.status as any).status || 'unknown';
      } else {
        statusValue = 'unknown';
      }
      
      const matchesStatus = status === "all" || statusValue === status;
      
      const matchesSearch = !search || 
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.client.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [projects, status, search]);

  const onDelete = async (id: string) => {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (res.ok) {
      toast.success("Project deleted");
      setProjects(prev => prev.filter(p => p.id !== id));
    } else {
      toast.error(json?.error?.message || "Failed to delete");
    }
  };

  const statusBadge = (s: ProjectRow["status"]) => {
    // Handle both string and object status values
    let statusValue: string;
    if (typeof s === 'string') {
      statusValue = s;
    } else if (s && typeof s === 'object') {
      statusValue = (s as any).name || (s as any).status || 'unknown';
    } else {
      statusValue = 'unknown';
    }
    
    const map: Record<string, string> = {
      "on-track": "bg-green-100 text-green-800",
      "behind": "bg-amber-100 text-amber-800",
      "at-risk": "bg-red-100 text-red-800",
    };
    
    const className = map[statusValue] || "bg-gray-100 text-gray-800";
    const displayText = statusValue.replace("-", " ");
    
    return <Badge className={`${className} border-0`}>{displayText}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Projects</h1>
              <p className="text-sm text-gray-500">Create and manage your projects</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <AddProjectDialog />
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card className="border-0 shadow-sm bg-white">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold">All Projects</CardTitle>
              <div className="flex items-center gap-3">
                <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    <SelectItem value="on-track">On track</SelectItem>
                    <SelectItem value="behind">Behind</SelectItem>
                    <SelectItem value="at-risk">At risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {(loading ? [] : filtered).map((p) => (
                <div key={p.id} className="border rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-base font-semibold text-gray-900">{p.name}</div>
                      <div className="text-sm text-gray-500">{p.client}</div>
                    </div>
                    {statusBadge(p.status)}
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-gray-500">Budget</div>
                      <div className="text-gray-900">{p.budget ? `$${Number(p.budget).toLocaleString()}` : '—'}</div>
                    </div>
                    <div>
                      <div className="text-gray-500">Due</div>
                      <div className="text-gray-900">{p.due_date || '—'}</div>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => onDelete(p.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}