/**
 * PresetStylesSection
 * 
 * Quick style presets for content blocks
 * Extracted from PropertiesPanel for reusability
 */

import React from 'react';
import { Button } from '../ui/button';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { applyPreset, detectPreset, type PresetStyle, PRESET_METADATA } from '../../lib/block-presets';
import { panelStandards } from '../../lib/design-tokens';

interface PresetStylesSectionProps {
  currentPreset: PresetStyle | null;
  onApplyPreset: (preset: PresetStyle) => void;
  className?: string;
}

export const PresetStylesSection = React.memo(({ 
  currentPreset, 
  onApplyPreset,
  className = ''
}: PresetStylesSectionProps) => {
  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary" />
        <h4 className="text-sm font-semibold">Quick Styles</h4>
      </div>
      
      {/* Content */}
      <div className="grid grid-cols-3 gap-2">
        {(['compact', 'standard', 'spacious'] as PresetStyle[]).map((presetStyle) => {
          const isActive = currentPreset === presetStyle;
          const metadata = PRESET_METADATA[presetStyle];
          
          return (
            <motion.div
              key={presetStyle}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => onApplyPreset(presetStyle)}
                className="w-full"
                title={metadata.description}
              >
                {metadata.label}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});
PresetStylesSection.displayName = 'PresetStylesSection';