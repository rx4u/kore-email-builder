/**
 * Image Uploader Component
 * 
 * Provides interface for uploading images or pasting URLs
 * Supports:
 * - File upload (converts to base64)
 * - URL input
 * - Image preview
 * - Remove functionality
 */

import { useState, useRef, ChangeEvent } from 'react';
import { Upload, Link as LinkIcon, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { toast } from 'sonner@2.0.3';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  aspectRatio?: 'square' | '16:9' | '4:3' | 'auto';
  maxSizeMB?: number;
}

export function ImageUploader({
  value,
  onChange,
  label = 'Image',
  aspectRatio = 'auto',
  maxSizeMB = 2
}: ImageUploaderProps) {
  const [urlInput, setUrlInput] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle file upload
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Check file size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      toast.error(`Image size must be less than ${maxSizeMB}MB`);
      return;
    }

    try {
      setIsConverting(true);
      const base64 = await fileToBase64(file);
      onChange(base64);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Image upload error:', error);
    } finally {
      setIsConverting(false);
    }
  };

  // Handle URL input
  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
      onChange(urlInput);
      setUrlInput('');
      toast.success('Image URL added');
    } catch {
      toast.error('Please enter a valid URL');
    }
  };

  // Handle remove
  const handleRemove = () => {
    onChange('');
    setUrlInput('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Get aspect ratio class
  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case '16:9':
        return 'aspect-video';
      case '4:3':
        return 'aspect-[4/3]';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2.5 w-full max-w-full">
      {label && <Label className="font-semibold text-sm">{label}</Label>}

      {/* Image Preview */}
      {value && (
        <div className="relative w-full max-w-full">
          <div className={`relative border-2 border-border rounded-md overflow-hidden bg-muted ${getAspectRatioClass()} w-full`}>
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover p-2"
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"200\"%3E%3Crect fill=\"%23ddd\" width=\"200\" height=\"200\"/%3E%3Ctext fill=\"%23999\" font-family=\"sans-serif\" font-size=\"14\" dy=\"10\" x=\"50%25\" y=\"50%25\" text-anchor=\"middle\"%3EImage not found%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1.5 right-1.5 h-7 w-7"
            onClick={handleRemove}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      )}

      {/* Upload Interface */}
      {!value && (
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-8">
            <TabsTrigger value="upload" className="text-xs">
              <Upload className="w-3.5 h-3.5 mr-1" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="url" className="text-xs">
              <LinkIcon className="w-3.5 h-3.5 mr-1" />
              URL
            </TabsTrigger>
          </TabsList>

          {/* File Upload Tab */}
          <TabsContent value="upload" className="space-y-2 mt-2">
            <div
              className="border-2 border-dashed border-border rounded-md p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImageIcon className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
              <p className="text-xs font-medium mb-1">
                {isConverting ? 'Converting...' : 'Click to upload'}
              </p>
              <p className="text-xs text-muted-foreground">
                Up to {maxSizeMB}MB
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isConverting}
            />
          </TabsContent>

          {/* URL Input Tab */}
          <TabsContent value="url" className="space-y-2 mt-2">
            <div className="space-y-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleUrlSubmit();
                  }
                }}
                className="text-sm"
              />
              <Button
                onClick={handleUrlSubmit}
                className="w-full h-8 text-xs"
                variant="secondary"
              >
                <LinkIcon className="w-3.5 h-3.5 mr-1.5" />
                Add URL
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      )}

      {/* Helper Text */}
      <p className="text-xs text-muted-foreground leading-tight">
        Upload an image or paste a URL
      </p>
    </div>
  );
}