/**
 * PropertyPanelContainer
 *
 * Standardized outer container for ALL property panel types
 * (Header, Footer, Content Blocks, Theme Settings)
 *
 * Provides consistent:
 * - Width (w-96 - 384px for ALL panels)
 * - Height (h-screen)
 * - Border and background
 * - PanelHeader with close button
 * - ScrollArea with proper padding
 * - Smart slide-in from right via Framer Motion (respects prefers-reduced-motion)
 */

import React from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { PanelHeader } from '../ui/PanelHeader';
import { X } from 'lucide-react';
import { iconSizes, panelStandards } from '../../lib/design-tokens';
import { panelVariants, springs, prefersReducedMotion } from '../../lib/motion-config';

interface PropertyPanelContainerProps {
  title: string;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

const reducedMotionPanel = {
  initial: { x: 0, opacity: 1 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 0, opacity: 1 },
};

export const PropertyPanelContainer = React.memo(({
  title,
  onClose,
  children,
  className = '',
}: PropertyPanelContainerProps) => {
  const variants = prefersReducedMotion() ? reducedMotionPanel : panelVariants.slideRight;
  return (
    <motion.aside
      className={`w-96 h-screen border-l bg-card flex flex-col ${className}`}
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={springs.gentle}
    >
      <PanelHeader
        title={title}
        className="border-b"
        action={onClose ? (
          <Button
            variant="ghost"
            onClick={onClose}
            className={`${panelStandards.actionButtonSize} p-0`}
            title="Close properties panel"
          >
            <X className={iconSizes.sm} />
          </Button>
        ) : undefined}
      />

      <ScrollArea className="flex-1 min-h-0">
        <div className={`${panelStandards.contentPadding} pb-32`}>
          {children}
        </div>
      </ScrollArea>
    </motion.aside>
  );
});
PropertyPanelContainer.displayName = 'PropertyPanelContainer';