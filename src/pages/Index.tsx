import React from 'react';
import { HackathonAnalyzer } from '@/components/HackathonAnalyzer';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-background">
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Hackathon Problem Analyzer
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Analyze hackathon problems for depth, competition, and success potential. 
            Upload multiple sources and get AI-powered recommendations.
          </p>
        </div>
        <HackathonAnalyzer />
      </main>
    </div>
  );
};

export default Index;