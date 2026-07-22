'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Loader2, Briefcase, Building2, MapPin, Banknote, RefreshCw, CheckCircle2, XCircle, ChevronRight, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function JobsPage() {
  const router = useRouter();
  
  const { data: response, isLoading, refetch } = useQuery({
    queryKey: ['jobRecommendations'],
    queryFn: async () => {
      const res = await api.getJobRecommendations();
      return res.data;
    },
  });

  const cards = response?.data || [];
  const meta = response?.meta || {};

  const refreshMutation = useMutation({
    mutationFn: async (analysisId?: string) => {
      const res = await api.refreshJobRecommendations(analysisId);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.data.message || 'Job recommendations refreshed!');
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to refresh recommendations');
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // No analysis has been completed yet
  if (!meta.analysisId && cards.length === 0) {
    return (
      <div className="w-full max-w-5xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-text mb-2">Job Matches</h1>
          <p className="text-text-secondary">AI-powered job recommendations tailored to your profile.</p>
        </div>
        <Card glass>
          <CardContent className="pt-16 pb-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Briefcase className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-text mb-2">Unlock Job Matches</h2>
            <p className="text-text-secondary max-w-md mb-8">
              We need to analyze your profile first to find the best job matches for your skill set. Run a placement analysis to get started.
            </p>
            <Button onClick={() => router.push('/dashboard/analysis')} className="px-8 py-6 text-lg">
              <Zap className="w-5 h-5 mr-2" />
              Run Placement Analysis
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">Job Matches</h1>
          <p className="text-text-secondary">Based on your {Math.round(meta.analysisScore || 0)}/100 placement score for {meta.targetRole}.</p>
        </div>
        <Button 
          variant="outline"
          onClick={() => refreshMutation.mutate(meta.analysisId)} 
          disabled={refreshMutation.isPending}
          className="whitespace-nowrap"
        >
          {refreshMutation.isPending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          Refresh Matches
        </Button>
      </div>

      {cards.length === 0 ? (
        <Card glass>
          <CardContent className="pt-16 pb-16 flex flex-col items-center justify-center text-center">
            <Briefcase className="w-12 h-12 text-text-muted mb-4" />
            <h2 className="text-xl font-semibold text-text mb-2">No Matches Found</h2>
            <p className="text-text-secondary max-w-md mb-6">
              We couldn&apos;t find any active job postings that strongly match your current skill profile. Keep learning and try refreshing later.
            </p>
            <Button onClick={() => refreshMutation.mutate(meta.analysisId)}>
              Try Refreshing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {cards.map((card: any) => (
            <Card key={card.id} glass className="overflow-hidden hover:border-primary/50 transition-colors">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row border-b border-border">
                  {/* Left Column: Match Score & Readiness */}
                  <div className="md:w-48 bg-surface-3/30 p-6 flex flex-col items-center justify-center border-r border-border border-b md:border-b-0">
                    <div className="relative mb-2">
                      <svg className="w-20 h-20 transform -rotate-90">
                        <circle cx="40" cy="40" r="36" className="stroke-surface-3" strokeWidth="8" fill="none" />
                        <circle 
                          cx="40" 
                          cy="40" 
                          r="36" 
                          className="stroke-primary" 
                          strokeWidth="8" 
                          fill="none" 
                          strokeDasharray="226.2"
                          strokeDashoffset={226.2 - (226.2 * card.matchScore) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
                        <span className="text-xl font-bold text-text">{Math.round(card.matchScore)}</span>
                        <span className="text-[10px] text-text-secondary">%</span>
                      </div>
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      card.estimatedReadiness === 'READY' ? 'bg-green-500/10 text-green-500' :
                      card.estimatedReadiness === 'CLOSE' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-danger/10 text-danger'
                    }`}>
                      {card.estimatedReadiness}
                    </span>
                  </div>

                  {/* Right Column: Job Details */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-text mb-1">{card.job.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
                          <span className="flex items-center font-medium text-text">
                            <Building2 className="w-4 h-4 mr-1.5" />
                            {card.job.company}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1.5" />
                            {card.job.isRemote ? 'Remote' : (card.job.location || 'Not specified')}
                          </span>
                          {card.job.salaryRange && (
                            <span className="flex items-center text-green-500 font-medium">
                              <Banknote className="w-4 h-4 mr-1.5" />
                              {card.job.salaryRange}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" className="hidden sm:flex text-primary">
                        View Details <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>

                    <p className="text-sm text-text-secondary line-clamp-2 mb-4">
                      {card.reason}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                      {/* Matched Skills */}
                      <div>
                        <div className="flex items-center gap-1.5 mb-2 text-sm font-medium text-text">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Skills you have
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {card.matchedSkills.slice(0, 5).map((skill: string, i: number) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 border border-green-500/20">
                              {skill}
                            </span>
                          ))}
                          {card.matchedSkills.length > 5 && (
                            <span className="text-[10px] px-2 py-0.5 text-text-secondary">+{card.matchedSkills.length - 5} more</span>
                          )}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      {card.missingSkills.length > 0 && (
                        <div>
                          <div className="flex items-center gap-1.5 mb-2 text-sm font-medium text-text">
                            <XCircle className="w-4 h-4 text-danger" />
                            Skills to learn
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {card.missingSkills.slice(0, 5).map((skill: string, i: number) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-danger/10 text-danger border border-danger/20">
                                {skill}
                              </span>
                            ))}
                            {card.missingSkills.length > 5 && (
                              <span className="text-[10px] px-2 py-0.5 text-text-secondary">+{card.missingSkills.length - 5} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Improvement Tips */}
                {card.improvementTips && card.improvementTips.length > 0 && (
                  <div className="bg-surface-3/30 p-4 px-6 border-t border-border">
                    <h4 className="text-xs font-semibold text-text uppercase tracking-wider mb-2">How to improve your match</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {card.improvementTips.map((tip: string, i: number) => (
                        <li key={i} className="text-sm text-text-secondary">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
