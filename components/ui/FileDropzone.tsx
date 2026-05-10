'use client';
import { useCallback, useState, DragEvent, ChangeEvent } from 'react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onFiles: (files: File[]) => void;
  uploading?: boolean;
  label?: string;
  hint?: string;
  className?: string;
}

export function FileDropzone({
  accept = 'image/*',
  multiple = true,
  maxFiles = 10,
  onFiles,
  uploading = false,
  label = 'Drop files here or click to browse',
  hint,
  className,
}: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).slice(0, maxFiles);
      if (files.length) onFiles(files);
    },
    [onFiles, maxFiles]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []).slice(0, maxFiles);
      if (files.length) onFiles(files);
      e.target.value = '';
    },
    [onFiles, maxFiles]
  );

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors',
        dragging ? 'border-[#1E2D5A] bg-[#1E2D5A]/5' : 'border-gray-300 hover:border-[#1E2D5A]/50 bg-gray-50',
        uploading && 'opacity-60 pointer-events-none',
        className
      )}
    >
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="text-4xl mb-3">📁</div>
      <p className="text-gray-700 font-medium">{uploading ? 'Uploading…' : label}</p>
      {hint && <p className="text-gray-400 text-sm mt-1">{hint}</p>}
    </div>
  );
}
