
'use client';

import React, { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';


interface SimpleDateRangePickerProps {
  date?: DateRange;
  onDateChange: (date?: DateRange) => void;
}

export const SimpleDateRangePicker = ({ date, onDateChange }: SimpleDateRangePickerProps) => {
  const [fromString, setFromString] = useState(date?.from ? date.from.toISOString().split('T')[0] : '');
  const [toString, setToString] = useState(date?.to ? date.to.toISOString().split('T')[0] : '');
  const { toast } = useToast();

  const handleApply = () => {
    const from = fromString ? new Date(fromString) : undefined;
    const to = toString ? new Date(toString) : undefined;

    if (from && to && from > to) {
      toast({
        title: "Invalid Date Range",
        description: "Start date cannot be after end date.",
        variant: "destructive",
      });
      return;
    }
    onDateChange({ from, to });
  };
  
  // Update internal state if prop changes (e.g. clear filters)
  React.useEffect(() => {
    setFromString(date?.from ? date.from.toISOString().split('T')[0] : '');
    setToString(date?.to ? date.to.toISOString().split('T')[0] : '');
  }, [date]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 items-end">
      <div className="flex-grow">
        <Label htmlFor="date-from" className="text-xs font-medium text-muted-foreground">From</Label>
        <Input type="date" id="date-from" value={fromString} onChange={e => setFromString(e.target.value)} className="h-9"/>
      </div>
      <div className="flex-grow">
        <Label htmlFor="date-to" className="text-xs font-medium text-muted-foreground">To</Label>
        <Input type="date" id="date-to" value={toString} onChange={e => setToString(e.target.value)} className="h-9"/>
      </div>
      <Button onClick={handleApply} variant="outline" size="sm" className="w-full sm:w-auto">Apply</Button>
    </div>
  );
};
