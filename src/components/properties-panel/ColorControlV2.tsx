/**
 * ColorControlV2 - Token-Based Color Picker
 * 
 * Shows semantic color names instead of hex codes
 * Stores color token IDs instead of raw hex values
 */

import React from 'react';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { 
  getColorGroups, 
  getColorDisplayName, 
  getColorShortName,
  colorValueToHex,
  hexToColorValue,
  isValidColorId,
  type ColorValue,
  type ColorId,
  type ColorGroup
} from '../../lib/color-token-system';
import { getThemeTokenPalette } from '../../lib/color-palette-v2';
import { Check } from 'lucide-react';

interface ColorControlV2Props {
  value: ColorValue | ColorId | string | undefined;  // Accepts token ID, ColorValue, or undefined
  onChange: (value: ColorValue) => void;
  label?: string;
  purpose?: 'text' | 'background' | 'all';
  showOpacity?: boolean;  // Show opacity slider
  currentThemeId?: string;  // Current theme ID for showing theme tokens
  themeZone?: 'header' | 'body' | 'footer';  // Zone for theme tokens
}

export const ColorControlV2 = React.memo(({ 
  value, 
  onChange, 
  label = "Color",
  purpose = 'all',
  showOpacity = false,
  currentThemeId,
  themeZone
}: ColorControlV2Props) => {
  // Normalize value to ColorValue (handle undefined)
  const normalizedValue: ColorValue = value === undefined || value === null
    ? { id: 'neutral-500' }  // Default to neutral-500 for undefined values
    : typeof value === 'string'
    ? (isValidColorId(value) ? { id: value } : hexToColorValue(value))
    : value;

  const [isOpen, setIsOpen] = React.useState(false);
  
  // Get the display hex value for rendering
  const displayHex = colorValueToHex(normalizedValue);
  
  // Get theme tokens if a theme is active
  const themeTokens = currentThemeId && themeZone 
    ? getThemeTokenPalette(currentThemeId, themeZone)
    : [];
  
  // Check if current color matches a theme token
  const matchedThemeToken = themeTokens.find(token => 
    token.hex.toUpperCase() === displayHex.toUpperCase()
  );
  
  // Get display name - use theme token name if matched, otherwise use standard name
  const displayName = matchedThemeToken 
    ? matchedThemeToken.displayName 
    : getColorDisplayName(normalizedValue);
  
  const shortName = matchedThemeToken
    ? matchedThemeToken.displayName
    : getColorShortName(normalizedValue, purpose);
  
  // Get color groups
  const colorGroups = getColorGroups(purpose);
  
  // Handle color selection
  const handleColorSelect = (colorId: ColorId) => {
    onChange({
      id: colorId,
      opacity: normalizedValue.opacity
    });
    setIsOpen(false);
  };
  
  // Handle hex color selection (from theme tokens)
  const handleHexColorSelect = (hex: string) => {
    const colorValue = hexToColorValue(hex);
    onChange({
      ...colorValue,
      opacity: normalizedValue.opacity
    });
    setIsOpen(false);
  };
  
  // Handle opacity change
  const handleOpacityChange = (opacity: number) => {
    onChange({
      ...normalizedValue,
      opacity
    });
  };
  
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-auto justify-start gap-3 px-3 py-2"
          >
            {/* Color Preview */}
            <div
              className="w-6 h-6 rounded-md border-2 border-border flex-shrink-0"
              style={{ backgroundColor: displayHex }}
            />
            
            {/* Color Name */}
            <div className="flex-1 text-left overflow-hidden">
              <div className="text-sm font-medium truncate font-mono">
                {displayHex}
              </div>
              {normalizedValue.opacity && normalizedValue.opacity < 1.0 && (
                <div className="text-xs text-muted-foreground">
                  {Math.round(normalizedValue.opacity * 100)}% opacity
                </div>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        
        <PopoverContent className="w-72 p-4" align="start" side="left">
          <div className="space-y-4">
            {/* Theme Tokens - Show ONLY theme colors when theme is active */}
            {themeTokens.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-foreground">
                  Theme Colors
                </div>
                <div className="grid grid-cols-8 gap-0.5 w-full">
                  {themeTokens.map((token) => {
                    const isSelected = displayHex.toUpperCase() === token.hex.toUpperCase();
                    return (
                      <button
                        key={token.id}
                        onClick={() => handleHexColorSelect(token.hex)}
                        className={`
                          relative w-8 h-8 rounded-md border-2 transition-all
                          hover:scale-110 hover:z-10
                          ${isSelected
                            ? 'border-foreground ring-2 ring-offset-2 ring-foreground' 
                            : 'border-border hover:border-foreground'
                          }
                        `}
                        style={{ backgroundColor: token.hex }}
                        title={token.hex}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check 
                              className="w-4 h-4" 
                              style={{ 
                                color: token.textSafe ? '#fff' : '#000',
                                filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))'
                              }} 
                            />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Color Groups - Only show when NO theme is active */}
            {themeTokens.length === 0 && colorGroups.map((group: ColorGroup) => (
              <div key={group.id} className="space-y-2">
                <div>
                  <div className="text-xs font-medium text-foreground">
                    {group.label}
                  </div>
                  {group.description && (
                    <div className="text-xs text-muted-foreground">
                      {group.description}
                    </div>
                  )}
                </div>
                
                {/* Color Swatches */}
                <div className="grid grid-cols-6 gap-1.5 w-full">
                  {group.colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => handleColorSelect(color.id as ColorId)}
                      className={`
                        relative w-8 h-8 rounded-md border-2 transition-all
                        hover:scale-110 hover:z-10
                        ${normalizedValue.id === color.id 
                          ? 'border-foreground ring-2 ring-offset-2 ring-foreground' 
                          : 'border-border hover:border-foreground'
                        }
                      `}
                      style={{ backgroundColor: color.hex }}
                      title={color.hex}
                    >
                      {/* Check mark for selected color */}
                      {normalizedValue.id === color.id && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Check 
                            className="w-4 h-4" 
                            style={{ 
                              color: color.textSafe ? '#000' : '#fff',
                              filter: 'drop-shadow(0 0 2px rgba(0,0,0,0.5))'
                            }} 
                          />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            
            {/* Opacity Slider */}
            {showOpacity && (
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Opacity</Label>
                  <span className="text-xs text-muted-foreground font-mono">
                    {Math.round((normalizedValue.opacity ?? 1.0) * 100)}%
                  </span>
                </div>
                <Slider
                  value={[(normalizedValue.opacity ?? 1.0) * 100]}
                  onValueChange={([val]) => handleOpacityChange(val / 100)}
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            )}
            
            {/* Selected Color Info */}
            <div className="pt-2 border-t space-y-1">
              <div className="text-xs font-medium">{displayName}</div>
              <div className="flex items-center gap-2">
                {normalizedValue.id !== 'custom' && (
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                    {normalizedValue.id}
                  </code>
                )}
                <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                  {displayHex}
                </code>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});
ColorControlV2.displayName = 'ColorControlV2';