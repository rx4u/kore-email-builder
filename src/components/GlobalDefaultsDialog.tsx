/**
 * Global Defaults Dialog
 * 
 * Allows users to set default values for all blocks at once.
 * Opens from Properties Panel header.
 */

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { 
  GlobalBlockDefaults, 
  getGlobalDefaults, 
  saveGlobalDefaults, 
  resetGlobalDefaults,
  DEFAULT_GLOBAL_DEFAULTS
} from '../lib/global-defaults';
import { COLORS } from './email-blocks/email-styles';
import { Settings, RotateCcw, Type, Ruler, Target, Circle } from 'lucide-react';

interface GlobalDefaultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyToAll?: () => void;
}

export function GlobalDefaultsDialog({ 
  open, 
  onOpenChange,
  onApplyToAll 
}: GlobalDefaultsDialogProps) {
  const [defaults, setDefaults] = useState<GlobalBlockDefaults>(getGlobalDefaults());

  const handleSave = () => {
    saveGlobalDefaults(defaults);
    onOpenChange(false);
  };

  const handleReset = () => {
    const reset = resetGlobalDefaults();
    setDefaults(reset);
  };

  const handleApplyToAll = () => {
    saveGlobalDefaults(defaults);
    if (onApplyToAll) {
      onApplyToAll();
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            Global Block Defaults
          </DialogTitle>
          <DialogDescription>
            Set default values that apply to all blocks. Changes only affect styling, not content.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          
          {/* Typography Defaults */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-primary" />
              <Label className="font-semibold text-sm">Typography Defaults</Label>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Title Size</Label>
                <Select 
                  value={defaults.typography.titleSize}
                  onValueChange={(v: any) => setDefaults(prev => ({
                    ...prev,
                    typography: { ...prev.typography, titleSize: v }
                  }))}
                >
                  <SelectTrigger className="h-9 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">XL</SelectItem>
                    <SelectItem value="2xl">2XL</SelectItem>
                    <SelectItem value="3xl">3XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Title Weight</Label>
                <Select 
                  value={defaults.typography.titleWeight}
                  onValueChange={(v: any) => setDefaults(prev => ({
                    ...prev,
                    typography: { ...prev.typography, titleWeight: v }
                  }))}
                >
                  <SelectTrigger className="h-9 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="semibold">Semibold</SelectItem>
                    <SelectItem value="bold">Bold</SelectItem>
                    <SelectItem value="extrabold">Extra Bold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">Title Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={defaults.typography.titleColor}
                  onChange={(e) => setDefaults(prev => ({
                    ...prev,
                    typography: { ...prev.typography, titleColor: e.target.value }
                  }))}
                  className="h-9 w-16 p-1 cursor-pointer"
                />
                <Input
                  value={defaults.typography.titleColor}
                  onChange={(e) => setDefaults(prev => ({
                    ...prev,
                    typography: { ...prev.typography, titleColor: e.target.value }
                  }))}
                  className="h-9 flex-1 font-mono text-sm"
                />
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Description Size</Label>
                <Select 
                  value={defaults.typography.descriptionSize}
                  onValueChange={(v: any) => setDefaults(prev => ({
                    ...prev,
                    typography: { ...prev.typography, descriptionSize: v }
                  }))}
                >
                  <SelectTrigger className="h-9 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="xs">XS</SelectItem>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="base">Base</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Description Weight</Label>
                <Select 
                  value={defaults.typography.descriptionWeight}
                  onValueChange={(v: any) => setDefaults(prev => ({
                    ...prev,
                    typography: { ...prev.typography, descriptionWeight: v }
                  }))}
                >
                  <SelectTrigger className="h-9 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="semibold">Semibold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">Description Color</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={defaults.typography.descriptionColor}
                  onChange={(e) => setDefaults(prev => ({
                    ...prev,
                    typography: { ...prev.typography, descriptionColor: e.target.value }
                  }))}
                  className="h-9 w-16 p-1 cursor-pointer"
                />
                <Input
                  value={defaults.typography.descriptionColor}
                  onChange={(e) => setDefaults(prev => ({
                    ...prev,
                    typography: { ...prev.typography, descriptionColor: e.target.value }
                  }))}
                  className="h-9 flex-1 font-mono text-sm"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Spacing Defaults */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-primary" />
              <Label className="font-semibold text-sm">Spacing Defaults</Label>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">Block Padding</Label>
              <Select 
                value={defaults.spacing.padding}
                onValueChange={(v: any) => setDefaults(prev => ({
                  ...prev,
                  spacing: { ...prev.spacing, padding: v }
                }))}
              >
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (0px)</SelectItem>
                  <SelectItem value="sm">Small (16px)</SelectItem>
                  <SelectItem value="md">Medium (24px)</SelectItem>
                  <SelectItem value="lg">Large (32px)</SelectItem>
                  <SelectItem value="xl">XL (40px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">Title ↔ Description Gap</Label>
              <Select 
                value={defaults.spacing.titleDescriptionGap}
                onValueChange={(v: any) => setDefaults(prev => ({
                  ...prev,
                  spacing: { ...prev.spacing, titleDescriptionGap: v }
                }))}
              >
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">Tiny (4px)</SelectItem>
                  <SelectItem value="sm">Small (8px)</SelectItem>
                  <SelectItem value="md">Medium (12px)</SelectItem>
                  <SelectItem value="lg">Large (16px)</SelectItem>
                  <SelectItem value="xl">XL (24px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">Description ↔ Button Gap</Label>
              <Select 
                value={defaults.spacing.descriptionCtaGap}
                onValueChange={(v: any) => setDefaults(prev => ({
                  ...prev,
                  spacing: { ...prev.spacing, descriptionCtaGap: v }
                }))}
              >
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sm">Small (8px)</SelectItem>
                  <SelectItem value="md">Medium (12px)</SelectItem>
                  <SelectItem value="lg">Large (16px)</SelectItem>
                  <SelectItem value="xl">XL (24px)</SelectItem>
                  <SelectItem value="xxl">XXL (32px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">Item Spacing</Label>
              <Select 
                value={defaults.spacing.itemSpacing}
                onValueChange={(v: any) => setDefaults(prev => ({
                  ...prev,
                  spacing: { ...prev.spacing, itemSpacing: v }
                }))}
              >
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xs">Tiny (4px)</SelectItem>
                  <SelectItem value="sm">Small (8px)</SelectItem>
                  <SelectItem value="md">Medium (12px)</SelectItem>
                  <SelectItem value="lg">Large (16px)</SelectItem>
                  <SelectItem value="xl">XL (24px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Alignment Defaults */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              <Label className="font-semibold text-sm">Alignment Defaults</Label>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">Content Alignment</Label>
              <Select 
                value={defaults.alignment.contentAlign}
                onValueChange={(v: any) => setDefaults(prev => ({
                  ...prev,
                  alignment: { ...prev.alignment, contentAlign: v }
                }))}
              >
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">Title Alignment</Label>
              <Select 
                value={defaults.alignment.titleAlign}
                onValueChange={(v: any) => setDefaults(prev => ({
                  ...prev,
                  alignment: { ...prev.alignment, titleAlign: v }
                }))}
              >
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Button Defaults */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Circle className="w-4 h-4 text-primary" />
              <Label className="font-semibold text-sm">Button Defaults</Label>
            </div>
            
            <div>
              <Label className="text-xs text-muted-foreground">Button Style</Label>
              <Select 
                value={defaults.button.ctaStyle}
                onValueChange={(v: any) => setDefaults(prev => ({
                  ...prev,
                  button: { ...prev.button, ctaStyle: v }
                }))}
              >
                <SelectTrigger className="h-9 mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary (Blue Gradient)</SelectItem>
                  <SelectItem value="secondary">Secondary (Outlined)</SelectItem>
                  <SelectItem value="tertiary">Tertiary (Ghost)</SelectItem>
                  <SelectItem value="link">Link (Text Only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Button Size</Label>
                <Select 
                  value={defaults.button.ctaSize}
                  onValueChange={(v: any) => setDefaults(prev => ({
                    ...prev,
                    button: { ...prev.button, ctaSize: v }
                  }))}
                >
                  <SelectTrigger className="h-9 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Button Width</Label>
                <Select 
                  value={defaults.button.ctaWidth}
                  onValueChange={(v: any) => setDefaults(prev => ({
                    ...prev,
                    button: { ...prev.button, ctaWidth: v }
                  }))}
                >
                  <SelectTrigger className="h-9 mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

        </div>

        <Separator />

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-2">
          <Button
            variant="outline"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="secondary" onClick={handleSave}>
              Save
            </Button>
            <Button onClick={handleApplyToAll}>
              Apply to All Blocks
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
