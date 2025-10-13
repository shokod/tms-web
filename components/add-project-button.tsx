"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FolderPlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

type StatusOption = "on-track" | "behind" | "at-risk";

export default function AddProjectDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [budget, setBudget] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<StatusOption>("on-track");
  const [errors, setErrors] = useState<{ name?: string; client?: string } | null>(null);

  useEffect(() => {
    if (!open) {
      setErrors(null);
    }
  }, [open]);

  const validate = () => {
    const e: { name?: string; client?: string } = {};
    if (!name.trim()) e.name = "Project name is required";
    if (!client.trim()) e.client = "Client is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload: any = {
        name,
        client,
        status,
      };
      if (budget) payload.budget = Number(budget);
      if (dueDate) payload.due_date = dueDate;

      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error?.message || "Failed to create project");

      setName("");
      setClient("");
      setBudget("");
      setDueDate("");
      setStatus("on-track");
      setOpen(false);
      toast.success("Project created");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("projects:created"));
      }
    } catch (err) {
      // Silently fail to console; could wire toast later
      console.error(err);
      toast.error("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
          <FolderPlus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px] bg-white">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">Add Project</DialogTitle>
              <DialogDescription className="text-sm text-gray-500">Create a project to organize time entries</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Project Name</Label>
            <Input id="name" placeholder="e.g., Authentication System" value={name} onChange={(e) => setName(e.target.value)} className={errors?.name ? "border-red-500" : "border-gray-200"} />
            {errors?.name && <p className="text-xs text-red-600">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="client" className="text-sm font-medium text-gray-700">Client</Label>
            <Input id="client" placeholder="e.g., TechCorp Solutions" value={client} onChange={(e) => setClient(e.target.value)} className={errors?.client ? "border-red-500" : "border-gray-200"} />
            {errors?.client && <p className="text-xs text-red-600">{errors.client}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium text-gray-700">Budget</Label>
              <Input id="budget" type="number" min="0" placeholder="45000" value={budget} onChange={(e) => setBudget(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium text-gray-700">Due Date</Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Status</Label>
            <Select value={status} onValueChange={(v: StatusOption) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="on-track">On track</SelectItem>
                <SelectItem value="behind">Behind</SelectItem>
                <SelectItem value="at-risk">At risk</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={loading}>Cancel</Button>
            <Button onClick={handleSubmit} className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}


