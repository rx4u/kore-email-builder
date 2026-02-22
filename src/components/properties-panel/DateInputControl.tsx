/**
 * DateInputControl
 * 
 * Specialized input control for date selection
 * Converts between date input and formatted string
 * Enhanced with calendar popover for better UX
 */

import React, { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';

interface DateInputControlProps {
  label?: string;
  value: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}

export const DateInputControl = React.memo(({ 
  label = 'Date',
  value,
  onChange,
  className = ''
}: DateInputControlProps) => {
  const [open, setOpen] = useState(false);
  
  // Convert formatted date string to Date object
  const getDateObject = (): Date | undefined => {
    if (!value) return undefined;
    try {
      return new Date(value);
    } catch {
      return undefined;
    }
  };
  
  // Convert formatted date string to YYYY-MM-DD for input
  const getInputValue = () => {
    if (!value) return '';
    try {
      const date = new Date(value);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };
  
  // Convert input value to formatted string
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!inputValue) {
      onChange('');
      return;
    }
    
    try {
      const date = new Date(inputValue);
      const formatted = date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
      onChange(formatted);
    } catch {
      onChange(inputValue);
    }
  };
  
  // Handle calendar selection
  const handleCalendarSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      onChange('');
      setOpen(false);
      return;
    }
    
    const formatted = selectedDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    onChange(formatted);
    setOpen(false);
  };
  
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      <Label className="text-sm">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Input
              type="text"
              value={value || ''}
              readOnly
              placeholder="Select date"
              className="h-9 pr-10 cursor-pointer w-full"
            />
            <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-3 bg-white shadow-lg border" align="start">
          <Calendar
            mode="single"
            selected={getDateObject()}
            onSelect={handleCalendarSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
});
DateInputControl.displayName = 'DateInputControl';