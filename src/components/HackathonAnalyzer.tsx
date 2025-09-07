import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FileUploadZone } from './FileUploadZone';
import { AnalysisResults } from './AnalysisResults';
import { ProblemInput } from './ProblemInput';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Link, FileText } from 'lucide-react';

export interface Problem {
  id: string;
  title: string;
  description: string;
  source: string;
  sourceType: 'url' | 'file' | 'manual';
  analysis?: ProblemAnalysis;
}

export interface ProblemAnalysis {
  depthScore: number;
  competitionScore: number;
  overallScore: number;
  reasoning: string;
  tags: string[];
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: string;
  marketPotential: number;
  technicalComplexity: number;
}

export const HackathonAnalyzer = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addProblem = (problem: Omit<Problem, 'id'>) => {
    const newProblem: Problem = {
      ...problem,
      id: Date.now().toString(),
    };
    setProblems(prev => [...prev, newProblem]);
  };

  const analyzeProblem = async (problemId: string) => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAnalysis: ProblemAnalysis = {
      depthScore: Math.floor(Math.random() * 40) + 60,
      competitionScore: Math.floor(Math.random() * 40) + 30,
      overallScore: Math.floor(Math.random() * 30) + 70,
      reasoning: "This problem demonstrates strong technical depth with moderate market competition. The solution space allows for innovative approaches while maintaining practical feasibility.",
      tags: ['AI/ML', 'Web Development', 'Data Analysis'],
      difficulty: ['Easy', 'Medium', 'Hard'][Math.floor(Math.random() * 3)] as 'Easy' | 'Medium' | 'Hard',
      estimatedTime: `${Math.floor(Math.random() * 20) + 10}-${Math.floor(Math.random() * 20) + 30} hours`,
      marketPotential: Math.floor(Math.random() * 40) + 60,
      technicalComplexity: Math.floor(Math.random() * 50) + 40,
    };

    setProblems(prev => 
      prev.map(p => 
        p.id === problemId ? { ...p, analysis: mockAnalysis } : p
      )
    );
    
    setIsAnalyzing(false);
  };

  const analyzeAll = async () => {
    setIsAnalyzing(true);
    for (const problem of problems.filter(p => !p.analysis)) {
      await analyzeProblem(problem.id);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Card className="bg-gradient-card border-0 shadow-medium p-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              File Upload
            </TabsTrigger>
            <TabsTrigger value="link" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Links
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Manual Entry
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload">
            <FileUploadZone onProblemsExtracted={addProblem} />
          </TabsContent>
          
          <TabsContent value="link">
            <ProblemInput type="url" onProblemAdd={addProblem} />
          </TabsContent>
          
          <TabsContent value="manual">
            <ProblemInput type="manual" onProblemAdd={addProblem} />
          </TabsContent>
        </Tabs>
      </Card>

      {problems.length > 0 && (
        <AnalysisResults 
          problems={problems}
          onAnalyze={analyzeProblem}
          onAnalyzeAll={analyzeAll}
          isAnalyzing={isAnalyzing}
        />
      )}
    </div>
  );
};