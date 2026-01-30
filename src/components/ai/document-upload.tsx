'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  uploadedAt: Date;
}

interface DocumentUploadProps {
  onDocumentProcessed: (doc: UploadedDocument) => void;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

const DEFAULT_ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'text/csv',
];

const DEFAULT_MAX_SIZE_MB = 5;

export function DocumentUpload({ 
  onDocumentProcessed, 
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
  acceptedTypes = DEFAULT_ACCEPTED_TYPES 
}: DocumentUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    // For text files, read directly
    if (file.type === 'text/plain' || file.type === 'text/csv') {
      return await file.text();
    }

    // For PDFs and DOCs, we'll use a simplified approach
    // In production, you'd use a library like pdf.js or send to a backend
    if (file.type === 'application/pdf') {
      // Basic PDF text extraction (simplified - in production use pdf.js)
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      let text = '';
      
      // Simple extraction of visible text from PDF
      for (let i = 0; i < bytes.length; i++) {
        const char = String.fromCharCode(bytes[i]);
        if (char.match(/[\x20-\x7E\n\r\t]/)) {
          text += char;
        }
      }
      
      // Clean up and extract meaningful text
      const cleanedText = text
        .replace(/\s+/g, ' ')
        .replace(/[^\x20-\x7E\n]/g, '')
        .trim();
      
      return cleanedText.length > 100 
        ? cleanedText 
        : `[PDF Document: ${file.name}] Content extraction limited. For full parsing, backend processing is recommended.`;
    }

    // For Word documents
    if (file.type.includes('word') || file.type.includes('document')) {
      return `[Word Document: ${file.name}] Document uploaded. Full content extraction requires backend processing.`;
    }

    return `[${file.name}] File uploaded but content extraction not supported for this file type.`;
  };

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setIsUploading(true);

    try {
      for (const file of Array.from(files)) {
        // Validate file type
        if (!acceptedTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.csv')) {
          setError(`File type not supported: ${file.type || 'unknown'}`);
          continue;
        }

        // Validate file size
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`File too large. Maximum size is ${maxSizeMB}MB`);
          continue;
        }

        // Extract text content
        const content = await extractTextFromFile(file);

        const doc: UploadedDocument = {
          id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          content,
          uploadedAt: new Date(),
        };

        setUploadedDocs(prev => [...prev, doc]);
        onDocumentProcessed(doc);
      }
    } catch (err) {
      setError('Failed to process document. Please try again.');
      console.error('Document upload error:', err);
    } finally {
      setIsUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [acceptedTypes, maxSizeMB, onDocumentProcessed]);

  const removeDocument = (docId: string) => {
    setUploadedDocs(prev => prev.filter(d => d.id !== docId));
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="document-upload">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.csv"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload document"
      />

      {/* Upload button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={triggerFileSelect}
        disabled={isUploading}
        className="text-gray-500 hover:text-gray-700"
        aria-label="Upload document"
      >
        {isUploading ? (
          <Icon name="loader" size={18} className="animate-spin" />
        ) : (
          <Icon name="upload" size={18} />
        )}
      </Button>

      {/* Error message */}
      {error && (
        <div className="absolute bottom-16 left-4 right-4 bg-red-50 text-red-600 text-xs p-2 rounded-lg">
          {error}
          <button 
            onClick={() => setError(null)} 
            className="ml-2 font-bold"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Uploaded documents indicator */}
      {uploadedDocs.length > 0 && (
        <div className="absolute bottom-16 left-4 right-4 bg-violet-50 p-2 rounded-lg">
          <p className="text-xs text-violet-700 font-medium mb-1">
            {uploadedDocs.length} document(s) attached
          </p>
          <div className="flex flex-wrap gap-1">
            {uploadedDocs.map(doc => (
              <span 
                key={doc.id}
                className="inline-flex items-center gap-1 bg-white text-xs px-2 py-1 rounded border"
              >
                <Icon name="file" size={12} className="text-violet-500" />
                <span className="truncate max-w-[100px]">{doc.name}</span>
                <span className="text-gray-400">({formatFileSize(doc.size)})</span>
                <button
                  onClick={() => removeDocument(doc.id)}
                  className="text-gray-400 hover:text-red-500 ml-1"
                  aria-label={`Remove ${doc.name}`}
                >
                  <Icon name="x" size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentUpload;
