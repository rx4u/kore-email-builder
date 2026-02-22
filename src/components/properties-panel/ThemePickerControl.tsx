/**
 * Theme Picker Control - Grouped by category
 *
 * Visual selector for themes from THEME_CATALOG.
 * Themes are grouped: Brand → Neutral → Colorful (see THEME_AND_COLOR_AUDIT.md).
 */

import { Label } from '../ui/label';
import {
  THEME_CATALOG,
  getThemeById,
  type ThemeCategory,
  type ThemeDefinition,
} from '../../lib/theme-catalog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const CATEGORY_ORDER: ThemeCategory[] = ['brand', 'neutral', 'colorful'];
const CATEGORY_LABELS: Record<ThemeCategory, string> = {
  brand: 'Brand',
  neutral: 'Neutral',
  colorful: 'Colorful',
};

function groupThemesByCategory(themes: ThemeDefinition[]): Map<ThemeCategory, ThemeDefinition[]> {
  const map = new Map<ThemeCategory, ThemeDefinition[]>();
  for (const cat of CATEGORY_ORDER) {
    map.set(cat, []);
  }
  for (const theme of themes) {
    const list = map.get(theme.category);
    if (list) list.push(theme);
  }
  return map;
}

interface ThemePickerControlProps {
  value?: string;
  onChange: (themeId: string | undefined) => void;
  label?: string;
  showNone?: boolean;
  globalDefaultTheme?: string;
  hidePreview?: boolean;
}

export function ThemePickerControl({
  value,
  onChange,
  label = 'Theme',
  showNone = true,
  globalDefaultTheme,
  hidePreview = false,
}: ThemePickerControlProps) {
  const currentTheme = value ? getThemeById(value) : null;
  const globalTheme = globalDefaultTheme ? getThemeById(globalDefaultTheme) : null;
  const byCategory = groupThemesByCategory(THEME_CATALOG);

  const handleThemeSelect = (themeId: string) => {
    onChange(themeId);
  };

  return (
    <TooltipProvider>
      <div>
        {label && (
          <Label className="text-sm">
            {label}
          </Label>
        )}

        {CATEGORY_ORDER.map((category) => {
          const categoryThemes = byCategory.get(category) ?? [];
          if (categoryThemes.length === 0) return null;

          return (
            <div key={category} className="mt-2 first:mt-0">
              <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">
                {CATEGORY_LABELS[category]}
              </div>
              <div className="grid grid-cols-8 gap-0.5 w-full">
                {categoryThemes.map((theme) => {
                  const isSelected =
                    value === theme.id || (!value && globalDefaultTheme === theme.id);
                  const bg = theme.bg ?? theme.header?.bg ?? '#fff';
                  const fg = theme.fg ?? theme.header?.fg ?? '#000';

                  return (
                    <div key={theme.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => handleThemeSelect(theme.id)}
                            className={`group relative w-8 h-8 rounded border-2 transition-all ${
                              isSelected
                                ? 'ring-2 ring-primary ring-offset-1 ring-offset-background border-primary'
                                : 'border-border hover:border-primary/50 hover:scale-110'
                            }`}
                            style={{
                              background: `linear-gradient(135deg, ${bg} 50%, ${fg} 50%)`,
                            }}
                            aria-label={theme.name}
                          >
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                                  <svg
                                    className="w-2 h-2 text-primary"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="text-xs">
                          <div className="font-medium">{theme.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-0.5">
                            {CATEGORY_LABELS[theme.category]}
                          </div>
                          <div className="flex gap-1 mt-1">
                            <span className="font-mono text-[10px]">{bg}</span>
                            <span className="text-muted-foreground">•</span>
                            <span className="font-mono text-[10px]">{fg}</span>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
}