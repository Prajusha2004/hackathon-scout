import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Brain, TrendingUp, Clock, Target, Zap, Trophy } from 'lucide-react';
import type { Problem } from './HackathonAnalyzer';

interface AnalysisResultsProps {
  problems: Problem[];
  onAnalyze: (problemId: string) => void;
  onAnalyzeAll: () => void;
  isAnalyzing: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  problems,
  onAnalyze,
  onAnalyzeAll,
  isAnalyzing,
}) => {
  const analyzedProblems = problems.filter(p => p.analysis);
  const unanalyzedProblems = problems.filter(p => !p.analysis);
  const topProblems = analyzedProblems
    .sort((a, b) => (b.analysis?.overallScore || 0) - (a.analysis?.overallScore || 0))
    .slice(0, 5);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-success/10 text-success border-success/20';
      case 'Medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'Hard': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Control Panel */}
      <Card className="p-6 bg-gradient-card border-0 shadow-medium">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Analysis Dashboard</h2>
            <p className="text-muted-foreground">
              {problems.length} problems • {analyzedProblems.length} analyzed
            </p>
          </div>
          <Button
            onClick={onAnalyzeAll}
            disabled={isAnalyzing || unanalyzedProblems.length === 0}
            className="bg-gradient-primary border-0 shadow-soft hover:shadow-medium transition-all duration-300"
          >
            <Brain className="w-4 h-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze All'}
          </Button>
        </div>
        
        {problems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg bg-accent/30">
              <div className="text-2xl font-bold text-primary">{problems.length}</div>
              <div className="text-sm text-muted-foreground">Total Problems</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-success/10">
              <div className="text-2xl font-bold text-success">{analyzedProblems.length}</div>
              <div className="text-sm text-muted-foreground">Analyzed</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-warning/10">
              <div className="text-2xl font-bold text-warning">{unanalyzedProblems.length}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </div>
        )}
      </Card>

      {/* Top 5 Recommendations */}
      {topProblems.length > 0 && (
        <Card className="p-6 bg-gradient-card border-0 shadow-medium">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Top 5 Recommendations</h2>
          </div>
          <div className="space-y-4">
            {topProblems.map((problem, index) => (
              <Card key={problem.id} className="p-4 border shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${index === 0 ? 'bg-gradient-primary text-primary-foreground shadow-glow' : 
                          index === 1 ? 'bg-warning text-warning-foreground' :
                          index === 2 ? 'bg-success text-success-foreground' :
                          'bg-muted text-muted-foreground'}
                      `}>
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold">{problem.title}</h3>
                      <Badge className={getDifficultyColor(problem.analysis!.difficulty)}>
                        {problem.analysis!.difficulty}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {problem.description}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Brain className="w-3 h-3" />
                          Depth
                        </div>
                        <div className={`text-lg font-bold ${getScoreColor(problem.analysis!.depthScore)}`}>
                          {problem.analysis!.depthScore}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <TrendingUp className="w-3 h-3" />
                          Competition
                        </div>
                        <div className={`text-lg font-bold ${getScoreColor(100 - problem.analysis!.competitionScore)}`}>
                          {100 - problem.analysis!.competitionScore}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Target className="w-3 h-3" />
                          Market
                        </div>
                        <div className={`text-lg font-bold ${getScoreColor(problem.analysis!.marketPotential)}`}>
                          {problem.analysis!.marketPotential}%
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          Time
                        </div>
                        <div className="text-sm font-medium">
                          {problem.analysis!.estimatedTime}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Overall Score</span>
                        <Progress value={problem.analysis!.overallScore} className="flex-1 h-2" />
                        <span className={`text-sm font-bold ${getScoreColor(problem.analysis!.overallScore)}`}>
                          {problem.analysis!.overallScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* All Problems */}
      <Card className="p-6 bg-gradient-card border-0 shadow-medium">
        <h2 className="text-2xl font-bold mb-6">All Problems</h2>
        <div className="space-y-4">
          {problems.map((problem) => (
            <Card key={problem.id} className="p-4 border shadow-soft hover:shadow-medium transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{problem.title}</h3>
                    <Badge variant="outline">{problem.sourceType}</Badge>
                    {problem.analysis && (
                      <Badge className={getDifficultyColor(problem.analysis.difficulty)}>
                        {problem.analysis.difficulty}
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground mb-3 line-clamp-2">{problem.description}</p>
                  <div className="text-sm text-muted-foreground mb-4">
                    Source: {problem.source}
                  </div>
                  
                  {problem.analysis ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Depth Score</div>
                          <div className={`text-lg font-bold ${getScoreColor(problem.analysis.depthScore)}`}>
                            {problem.analysis.depthScore}%
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Competition</div>
                          <div className={`text-lg font-bold ${getScoreColor(100 - problem.analysis.competitionScore)}`}>
                            {100 - problem.analysis.competitionScore}%
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Market Potential</div>
                          <div className={`text-lg font-bold ${getScoreColor(problem.analysis.marketPotential)}`}>
                            {problem.analysis.marketPotential}%
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-sm text-muted-foreground">Estimated Time</div>
                          <div className="text-sm font-medium">{problem.analysis.estimatedTime}</div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">Overall Score</span>
                          <Progress value={problem.analysis.overallScore} className="flex-1 h-2" />
                          <span className={`text-sm font-bold ${getScoreColor(problem.analysis.overallScore)}`}>
                            {problem.analysis.overallScore}%
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {problem.analysis.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-sm text-muted-foreground italic">
                          {problem.analysis.reasoning}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <Button
                      onClick={() => onAnalyze(problem.id)}
                      disabled={isAnalyzing}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      {isAnalyzing ? 'Analyzing...' : 'Analyze Problem'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </div>
  );
};