import React, { useState, useCallback, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Plus, Clock, Loader2 } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { generateInvoiceNumber } from '@/lib/utils/invoice-generator';
import { timeEntryFormSchema, type TimeEntryFormData, type TimeEntryFormErrors } from '@/lib/validators/time-entry-form';

type ProjectOption = { id: string; name: string };

const AddEntryDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [formData, setFormData] = useState<Omit<TimeEntryFormData, 'date'>>({
    invoiceNo: '',
    contact: '',
    email: '',
    hours: '',
    activity: '',
    project: ''
  });
  const [errors, setErrors] = useState<TimeEntryFormErrors>({});
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // Reset form data
      setFormData({
        invoiceNo: '',
        contact: '',
        email: '',
        hours: '',
        activity: '',
        project: ''
      });
      setErrors({});
      setDate(undefined);
      setSelectedProjectId('');
    }
  };

  // Check if form is complete and valid using Zod
  const isFormValid = useMemo(() => {
    if (!date) return false;
    
    try {
      const dataToValidate = { ...formData, date };
      timeEntryFormSchema.parse(dataToValidate);
      return true;
    } catch {
      return false;
    }
  }, [formData, date]);

  // Validate form using Zod schema
  const validateForm = useCallback((): boolean => {
    if (!date) {
      setErrors({ date: 'Date is required' });
      return false;
    }

    try {
      const dataToValidate = { ...formData, date };
      timeEntryFormSchema.parse(dataToValidate);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as any;
        const newErrors: TimeEntryFormErrors = {};
        
        zodError.issues.forEach((issue: any) => {
          const field = issue.path[0] as keyof TimeEntryFormData;
          newErrors[field] = issue.message;
        });
        
        setErrors(newErrors);
      }
      return false;
    }
  }, [formData, date]);

  React.useEffect(() => {
    const controller = new AbortController();
    async function loadProjects() {
      try {
        const res = await fetch('/api/projects?limit=100&offset=0&order=desc&sort=due_date', { signal: controller.signal });
        const json = await res.json();
        if (res.ok) {
          setProjects((json.data || []).map((p: any) => ({ id: p.id, name: p.name })));
        }
      } catch {}
    }
    loadProjects();
    const onCreated = () => loadProjects();
    window.addEventListener('projects:created', onCreated);
    return () => controller.abort();
  }, []);


  const handleInputChange = (field: keyof Omit<TimeEntryFormData, 'date'>, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-generate invoice number when contact changes
      if (field === 'contact' && value.trim()) {
        // Generate a unique temporary ID based on timestamp and contact
        const tempId = `temp-${Date.now()}-${value.trim().replace(/\s+/g, '-').toLowerCase()}`;
        newData.invoiceNo = generateInvoiceNumber(value, tempId);
      }
      
      return newData;
    });
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    if (errors.date) {
      setErrors(prev => ({ ...prev, date: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Scroll to first error field
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setLoading(true);

    try {
      const payload = {
        invoice: formData.invoiceNo,
        contact: formData.contact,
        email: formData.email,
        date: date ? date.toISOString().split('T')[0] : '',
        hours: Number(formData.hours),
        activity: formData.activity,
        project: formData.project,
        project_id: selectedProjectId || undefined,
        status: 'draft' as const
      };

      const res = await fetch('/api/time-entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json?.error?.message || 'Failed to create entry');
      }

      setFormData({
        invoiceNo: '',
        contact: '',
        email: '',
        hours: '',
        activity: '',
        project: ''
      });
      setSelectedProjectId('');
      setDate(undefined);
      setOpen(false);
      // Optionally trigger a refresh for pages using next/navigation
      if (typeof window !== 'undefined') {
        // Soft reload current page to reflect new data
        window.dispatchEvent(new Event('time-entries:created'));
      }

    } catch (error) {
      console.error('Error creating entry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-red-600 hover:bg-red-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Add Timesheet Entry
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-500">
                Record your work hours and activity details
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNo" className="text-sm font-medium text-gray-700">
                Invoice Number
              </Label>
              <Input
                id="invoiceNo"
                placeholder="RSLITE-JS 001"
                value={formData.invoiceNo}
                readOnly
                className={`${errors.invoiceNo ? 'border-red-500' : 'border-gray-200'} bg-gray-50 cursor-not-allowed`}
              />
              {errors.invoiceNo && (
                <p className="text-xs text-red-600">{errors.invoiceNo}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !date ? 'text-gray-500' : ''
                    } ${errors.date ? 'border-red-500' : 'border-gray-200'}`}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    className="calendar-base"
                  />
                </PopoverContent>
              </Popover>
              {errors.date && (
                <p className="text-xs text-red-600">{errors.date}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact" className="text-sm font-medium text-gray-700">
                Contact Name
              </Label>
              <Input
                id="contact"
                placeholder="Delvin Shoko"
                value={formData.contact}
                onChange={(e) => handleInputChange('contact', e.target.value)}
                className={errors.contact ? 'border-red-500' : 'border-gray-200'}
              />
              {errors.contact && (
                <p className="text-xs text-red-600">{errors.contact}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : 'border-gray-200'}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="hours" className="text-sm font-medium text-gray-700">
                Hours
              </Label>
              <Input
                id="hours"
                type="number"
                step="0.5"
                min="0"
                placeholder="8.0"
                value={formData.hours}
                onChange={(e) => handleInputChange('hours', e.target.value)}
                className={errors.hours ? 'border-red-500' : 'border-gray-200'}
              />
              {errors.hours && (
                <p className="text-xs text-red-600">{errors.hours}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="project" className="text-sm font-medium text-gray-700">
                Project
              </Label>
                <Select
                value={selectedProjectId}
                onValueChange={(value) => {
                  setSelectedProjectId(value);
                  const found = projects.find(p => p.id === value);
                  if (found) {
                    handleInputChange('project', found.name);
                  }
                }}
              >
                <SelectTrigger className={errors.project ? 'border-red-500' : 'border-gray-200'}>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.project && (
                <p className="text-xs text-red-600">{errors.project}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity" className="text-sm font-medium text-gray-700">
              Activity Description
            </Label>
            <Textarea
              id="activity"
              placeholder="Describe what you worked on..."
              rows={3}
              value={formData.activity}
              onChange={(e) => handleInputChange('activity', e.target.value)}
              className={`resize-none ${errors.activity ? 'border-red-500' : 'border-gray-200'}`}
            />
            {errors.activity && (
              <p className="text-xs text-red-600">{errors.activity}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Entry
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryDialog;