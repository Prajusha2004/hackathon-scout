import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Link as LinkIcon, FileText } from 'lucide-react';
import type { Problem } from './HackathonAnalyzer';

interface ProblemInputProps {
  type: 'url' | 'manual';
  onProblemAdd: (problem: Omit<Problem, 'id'>) => void;
}

export const ProblemInput: React.FC<ProblemInputProps> = ({ type, onProblemAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'manual' && (!title.trim() || !description.trim())) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and description",
        variant: "destructive",
      });
      return;
    }

    if (type === 'url' && !url.trim()) {
      toast({
        title: "Validation Error", 
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (type === 'url') {
        // Simulate URL fetching and extract multiple problems
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const urlProblems = [
          {
            title: `Collaborative Platform - ${new URL(url).hostname}`,
            description: "Develop a real-time collaborative platform that enables distributed teams to work together seamlessly on complex projects with version control and conflict resolution.",
            source: url,
            sourceType: 'url' as const,
          },
          {
            title: `IoT Smart City Solution - ${new URL(url).hostname}`,
            description: "Create an IoT-based smart city infrastructure that optimizes traffic flow, energy consumption, and waste management using sensor networks.",
            source: url,
            sourceType: 'url' as const,
          },
          {
            title: `Fintech Payment Gateway - ${new URL(url).hostname}`,
            description: "Build a secure, low-cost payment gateway for emerging markets that works with minimal internet connectivity and supports multiple currencies.",
            source: url,
            sourceType: 'url' as const,
          }
        ];

        urlProblems.forEach(problem => onProblemAdd(problem));

        setUrl('');
        toast({
          title: "Success",
          description: `Extracted ${urlProblems.length} problems from URL successfully`,
        });
      } else {
        onProblemAdd({
          title,
          description,
          source: 'Manual Entry',
          sourceType: 'manual',
        });

        setTitle('');
        setDescription('');
        toast({
          title: "Success",
          description: "Problem added successfully",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${type === 'url' ? 'fetch from URL' : 'add problem'}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-card border-0 shadow-soft">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          {type === 'url' ? (
            <LinkIcon className="w-5 h-5 text-primary" />
          ) : (
            <FileText className="w-5 h-5 text-primary" />
          )}
          <h3 className="text-lg font-semibold">
            {type === 'url' ? 'Add from URL' : 'Manual Entry'}
          </h3>
        </div>

        {type === 'url' ? (
          <div className="space-y-2">
            <Label htmlFor="url">Problem URL</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/hackathon-problem"
              className="h-12"
            />
            <p className="text-sm text-muted-foreground">
              Enter a URL containing hackathon problem details
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Problem Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter problem title"
                className="h-12"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Problem Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the hackathon problem in detail..."
                rows={4}
                className="resize-none"
              />
            </div>
          </>
        )}

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 bg-gradient-primary border-0 shadow-soft hover:shadow-medium transition-all duration-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          {isLoading ? 'Processing...' : `Add ${type === 'url' ? 'from URL' : 'Problem'}`}
        </Button>
      </form>
    </Card>
  );
};