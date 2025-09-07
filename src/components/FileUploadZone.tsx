import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Upload, FileText, FileSpreadsheet, Link as LinkIcon } from 'lucide-react';
import type { Problem } from './HackathonAnalyzer';

interface FileUploadZoneProps {
  onProblemsExtracted: (problem: Omit<Problem, 'id'>) => void;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({ onProblemsExtracted }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setProgress(0);

    try {
      // Simulate file processing with progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Mock extraction of problems from file
      const mockProblems = [
        {
          title: `Problem from ${file.name}`,
          description: "Create an AI-powered healthcare monitoring system that can predict patient health deterioration using wearable device data and electronic health records.",
          source: file.name,
          sourceType: 'file' as const,
        },
        {
          title: `Challenge from ${file.name}`,
          description: "Develop a sustainable urban mobility solution that reduces carbon emissions while improving transportation efficiency in metropolitan areas.",
          source: file.name,
          sourceType: 'file' as const,
        }
      ];

      mockProblems.forEach(problem => onProblemsExtracted(problem));

      toast({
        title: "Success",
        description: `Extracted ${mockProblems.length} problems from ${file.name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(processFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: true,
  });

  return (
    <div className="space-y-6">
      <Card 
        {...getRootProps()} 
        className={`
          border-2 border-dashed transition-all duration-300 cursor-pointer
          ${isDragActive 
            ? 'border-primary bg-accent/50 shadow-glow' 
            : 'border-border hover:border-primary/50 hover:bg-accent/20'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-glow">
            <Upload className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? 'Drop files here' : 'Upload hackathon files'}
            </h3>
            <p className="text-muted-foreground mb-4">
              Drag & drop files or click to browse
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                PDF, DOC
              </div>
              <div className="flex items-center gap-1">
                <FileSpreadsheet className="w-4 h-4" />
                Excel, CSV
              </div>
              <div className="flex items-center gap-1">
                <LinkIcon className="w-4 h-4" />
                TXT
              </div>
            </div>
          </div>
          {!isDragActive && (
            <Button variant="outline" className="mt-4">
              Choose Files
            </Button>
          )}
        </div>
      </Card>

      {isProcessing && (
        <Card className="p-6 bg-gradient-card border-0 shadow-soft">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Processing files...</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>
      )}
    </div>
  );
};