import React from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface AlignmentControlProps {
  value: 'left' | 'center' | 'right';
  onChange: (value: 'left' | 'center' | 'right') => void;
  label?: string;
}

export const AlignmentControl = React.memo(({ value, onChange, label = "Alignment" }: AlignmentControlProps) => {
  return (
    <div className="space-y-1.5 w-full">
      <Label className="text-sm">{label}</Label>
      <div className="flex gap-1 w-full">
        <Button
          type="button"
          variant={value === 'left' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange('left')}
          className="flex-1"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={value === 'center' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange('center')}
          className="flex-1"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant={value === 'right' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange('right')}
          className="flex-1"
        >
          <AlignRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
});
AlignmentControl.displayName = 'AlignmentControl';