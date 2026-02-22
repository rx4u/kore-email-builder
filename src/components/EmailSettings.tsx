import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Settings, X } from 'lucide-react';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { iconSizes } from '../lib/design-tokens';
import { type PaddingSize } from '../lib/layout-scales';
import { type ColorValue, type ColorId } from '../lib/color-token-system';

export interface HeaderConfig {
  title: string;
  date: string;
  showDate?: boolean; // Show/hide date above header
  // Product name configuration
  productName?: string; // Product name shown above title (e.g., "AI for Work")
  showProductName?: boolean; // Show/hide product name
  productNameFontSize?: number; // Font size for product name (default: 20px, range: 12-28px)
  // New badge options (Phase 1)
  categoryBadge?: 'release-notes' | 'feature-update' | 'product-announcement' | 'security-update' | 'maintenance' | 'webinar' | 'event';
  versionText?: string;
  versionBadgeStyle?: 'outlined' | 'filled' | 'accent';
  // Logo configuration
  showLogo?: boolean; // Show/hide logo
  logoSrc?: string; // Logo image source (base64 or URL)
  logoSize?: 'sm' | 'md' | 'lg' | 'xl' | 'custom'; // Semantic logo size
  logoCustomWidth?: number; // Custom width when logoSize is 'custom'
  logoWidth?: number; // DEPRECATED: Use logoSize instead (kept for migration)
  // Layout properties
  padding?: PaddingSize; // Semantic padding (sm/md/lg from theme; compact/standard/spacious also valid)
  contentAlignment?: 'left' | 'center' | 'right';
  logoAlignment?: 'left' | 'center' | 'right';
  theme?: string; // Theme ID for header zone (e.g. 'kore-default')
  // Spacing properties
  logoTitleGap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  titleDateGap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  // Styling properties - Token-based colors (NEW) + backwards compatibility
  backgroundColor?: ColorValue | ColorId | string; // Preferred: ColorValue, string for migration
  titleColor?: ColorValue | ColorId | string;
  titleFontSize?: number;
  dateColor?: ColorValue | ColorId | string;
  dateFontSize?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
}

export interface FooterConfig {
  showFooter?: boolean;
  message: string;
  teamName: string;
  email: string;
  website: string;
  disclaimer: string;
  // Logo configuration
  showLogo?: boolean;
  logoSrc?: string;
  logoSize?: 'sm' | 'md' | 'lg';
  // Styling properties
  contentAlignment?: 'left' | 'center' | 'right';
  theme?: string; // Theme ID for footer zone
  // Token-based colors (NEW) + backwards compatibility
  backgroundColor?: ColorValue | ColorId | string; // Preferred: ColorValue, string for migration
  messageColor?: ColorValue | ColorId | string;
  messageFontSize?: number;
  teamNameColor?: ColorValue | ColorId | string;
  teamNameFontSize?: number;
  linkColor?: ColorValue | ColorId | string;
  disclaimerColor?: ColorValue | ColorId | string;
  disclaimerFontSize?: number;
  // Padding - NEW: Semantic padding system
  padding?: PaddingSize; // Preferred: Use semantic padding (sm/md/lg)
  paddingTop?: number;   // DEPRECATED: Legacy pixel values for backward compatibility
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
}

interface EmailSettingsButtonProps {
  onClick: () => void;
}

export function EmailSettingsButton({ onClick, isActive }: EmailSettingsButtonProps & { isActive?: boolean }) {
  return (
    <Button variant="outline" onClick={onClick} className="h-9">
      <Settings className={iconSizes.md} />
    </Button>
  );
}

interface EmailSettingsPanelProps {
  header: HeaderConfig;
  footer: FooterConfig;
  onHeaderChange: (header: HeaderConfig) => void;
  onFooterChange: (footer: FooterConfig) => void;
  onClose: () => void;
}

export function EmailSettingsPanel({ header, footer, onHeaderChange, onFooterChange, onClose }: EmailSettingsPanelProps) {
  const [localHeader, setLocalHeader] = useState(header);
  const [localFooter, setLocalFooter] = useState(footer);

  // Update local state when props change
  useEffect(() => {
    setLocalHeader(header);
    setLocalFooter(footer);
  }, [header, footer]);

  const handleSave = () => {
    onHeaderChange(localHeader);
    onFooterChange(localFooter);
    onClose();
  };

  const handleCancel = () => {
    // Reset to original values
    setLocalHeader(header);
    setLocalFooter(footer);
    onClose();
  };



  return (
    <aside className="w-80 border-l bg-card flex flex-col slide-in-right">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Email Settings</h3>
        <Button variant="ghost" onClick={handleCancel} className="h-9 w-9 p-0">
          <X className={iconSizes.md} />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Header Settings */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Header</h4>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="email-title">Email Title</Label>
                <Input
                  id="email-title"
                  value={localHeader.title}
                  onChange={(e) => setLocalHeader({ ...localHeader, title: e.target.value })}
                  placeholder="Release Notes v3.2.0"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email-date">Date</Label>
                <Input
                  id="email-date"
                  value={localHeader.date}
                  onChange={(e) => setLocalHeader({ ...localHeader, date: e.target.value })}
                  placeholder="August 13, 2025"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="version-text">Version Badge (Optional)</Label>
                <Input
                  id="version-text"
                  value={localHeader.versionText || ''}
                  onChange={(e) => setLocalHeader({ ...localHeader, versionText: e.target.value || undefined })}
                  placeholder="v10.5.0 or October 2025"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="category-badge">Category Badge (Optional)</Label>
                <select
                  id="category-badge"
                  aria-label="Category Badge (Optional)"
                  value={localHeader.categoryBadge || ''}
                  onChange={(e) => setLocalHeader({ ...localHeader, categoryBadge: e.target.value as any || undefined })}
                  className="flex h-9 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">None</option>
                  <option value="release-notes">Release Notes</option>
                  <option value="feature-update">Feature Update</option>
                  <option value="product-announcement">Product Announcement</option>
                  <option value="security-update">Security Update</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="webinar">Webinar</option>
                  <option value="event">Event</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="product-name">Product Name (Optional)</Label>
                <Input
                  id="product-name"
                  value={localHeader.productName || ''}
                  onChange={(e) => setLocalHeader({ ...localHeader, productName: e.target.value || undefined })}
                  placeholder="AI for Work"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="show-product-name">Show Product Name</Label>
                <Switch
                  checked={localHeader.showProductName ?? false}
                  onCheckedChange={(checked) => setLocalHeader({ ...localHeader, showProductName: checked })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="product-name-font-size">Product Name Font Size (Optional)</Label>
                <Input
                  id="product-name-font-size"
                  type="number"
                  value={localHeader.productNameFontSize?.toString() || ''}
                  onChange={(e) => setLocalHeader({ ...localHeader, productNameFontSize: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="12-28"
                  className="h-9"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Footer Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Footer</h4>
              <Switch
                checked={localFooter.showFooter ?? true}
                onCheckedChange={(checked) => setLocalFooter({ ...localFooter, showFooter: checked })}
              />
            </div>

            {(localFooter.showFooter ?? true) && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="footer-message">Message</Label>
                  <Input
                    id="footer-message"
                    value={localFooter.message}
                    onChange={(e) => setLocalFooter({ ...localFooter, message: e.target.value })}
                    placeholder="Thank you for your continued support and valuable feedback."
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="footer-team">Team Name</Label>
                  <Input
                    id="footer-team"
                    value={localFooter.teamName}
                    onChange={(e) => setLocalFooter({ ...localFooter, teamName: e.target.value })}
                    placeholder="Kore.ai Product Management Team"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="footer-email">Email</Label>
                  <Input
                    id="footer-email"
                    type="email"
                    value={localFooter.email}
                    onChange={(e) => setLocalFooter({ ...localFooter, email: e.target.value })}
                    placeholder="releases@kore.ai"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="footer-website">Website</Label>
                  <Input
                    id="footer-website"
                    value={localFooter.website}
                    onChange={(e) => setLocalFooter({ ...localFooter, website: e.target.value })}
                    placeholder="kore.ai"
                    className="h-9"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="footer-disclaimer">Disclaimer</Label>
                  <Textarea
                    id="footer-disclaimer"
                    value={localFooter.disclaimer}
                    onChange={(e) => setLocalFooter({ ...localFooter, disclaimer: e.target.value })}
                    placeholder="This email is confidential..."
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex flex-col gap-2 pb-4">
            <Button onClick={handleSave} className="h-9 w-full">
              Apply Changes
            </Button>
            <Button variant="outline" onClick={handleCancel} className="h-9 w-full">
              Cancel
            </Button>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}