import { ImageRadiusStyle } from '../../lib/global-theme';
import { SelectControl } from './SelectControl';

interface ImageRadiusControlProps {
  value: ImageRadiusStyle | undefined;
  onChange: (value: ImageRadiusStyle) => void;
  label?: string;
}

export function ImageRadiusControl({ 
  value, 
  onChange, 
  label = 'Corner Radius' 
}: ImageRadiusControlProps) {
  return (
    <SelectControl
      label={label}
      value={value || 'rounded'}
      onChange={(v) => onChange(v as ImageRadiusStyle)}
      options={[
        { value: 'square', label: 'Square' },
        { value: 'rounded', label: 'Rounded' },
        { value: 'pill', label: 'Pill' },
      ]}
    />
  );
}
