/**
 * Alert Type Control
 * 
 * Dropdown selector for alert/warning block style
 * Options: Warning, Success, Info, Error, Tip
 */

import React from 'react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export type AlertType = 'warning' | 'success' | 'info' | 'error' | 'tip';

interface AlertTypeControlProps {
  label?: string;
  value: AlertType;
  onChange: (value: AlertType) => void;
  disabled?: boolean;
}

interface AlertOption {
  value: AlertType;
  label: string;
  icon: string;
}

const ALERT_OPTIONS: AlertOption[] = [
  { value: 'warning', label: 'Warning', icon: '⚠️' },
  { value: 'success', label: 'Success', icon: '✓' },
  { value: 'info', label: 'Info', icon: 'ℹ' },
  { value: 'error', label: 'Error', icon: '✕' },
  { value: 'tip', label: 'Tip', icon: '💡' },
];

export const AlertTypeControl = React.memo(({
  label = 'Alert Type',
  value,
  onChange,
  disabled = false,
}: AlertTypeControlProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ALERT_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span className="flex items-center gap-2">
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});

AlertTypeControl.displayName = 'AlertTypeControl';
