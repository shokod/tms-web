import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Plus, Clock, Loader2 } from 'lucide-react';
import { Calendar } from './ui/calendar';

interface FormData {
  invoiceNo: string;
  contact: string;
  email: string;
  hours: string;
  activity: string;
  project: string;
}

interface FormErrors {
  invoiceNo?: string;
  contact?: string;
  email?: string;
  hours?: string;
  activity?: string;
  project?: string;
  date?: string;
}

const AddEntryDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | undefined>();
  const [formData, setFormData] = useState<FormData>({
    invoiceNo: '',
    contact: '',
    email: '',
    hours: '',
    activity: '',
    project: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const projects = [
    'Authentication System',
    'Dashboard Development',
    'API Integration',
    'Bug Fixes & Testing',
    'Client Consultation'
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.invoiceNo.trim()) newErrors.invoiceNo = 'Invoice number is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.hours) {
      newErrors.hours = 'Hours are required';
    } else if (isNaN(Number(formData.hours)) || Number(formData.hours) <= 0) {
      newErrors.hours = 'Hours must be a positive number';
    }
    if (!formData.activity.trim()) newErrors.activity = 'Activity description is required';
    if (!formData.project) newErrors.project = 'Project selection is required';
    if (!date) newErrors.date = 'Date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    if (!validateForm()) return;

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const entryData = {
        ...formData,
        date: date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
        id: String(Math.floor(Math.random() * 1000)).padStart(2, '0')
      };

      console.log('New entry:', entryData);

      setFormData({
        invoiceNo: '',
        contact: '',
        email: '',
        hours: '',
        activity: '',
        project: ''
      });
      setDate(undefined);
      setOpen(false);

    } catch (error) {
      console.error('Error creating entry:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                placeholder="RSLITE-TN 001"
                value={formData.invoiceNo}
                onChange={(e) => handleInputChange('invoiceNo', e.target.value)}
                className={errors.invoiceNo ? 'border-red-500' : 'border-gray-200'}
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
                placeholder="John Smith"
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
                value={formData.project}
                onValueChange={(value) => handleInputChange('project', value)}
              >
                <SelectTrigger className={errors.project ? 'border-red-500' : 'border-gray-200'}>
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
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
              disabled={loading}
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