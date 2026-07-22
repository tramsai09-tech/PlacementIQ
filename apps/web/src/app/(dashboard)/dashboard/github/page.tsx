'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { Loader2, Github, AlertCircle, GitBranch, Star, BookOpen, Code } from 'lucide-react';
import { toast } from 'sonner';

const githubSchema = z.object({
  username: z.string().min(1, 'Username is required').max(39, 'Username is too long'),
});

type GithubFormValues = z.infer<typeof githubSchema>;

export default function GitHubPage() {
  const { data: githubResponse, isLoading: isLoadingGithub, refetch } = useQuery({
    queryKey: ['github'],
    queryFn: async () => {
      const res = await api.getGitHub();
      return res.data;
    },
  });

  const profile = githubResponse?.data;
  const [jobId, setJobId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GithubFormValues>({
    resolver: zodResolver(githubSchema),
  });

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (jobId || profile?.status === 'PENDING') {
      interval = setInterval(async () => {
        try {
          if (jobId) {
            const res = await api.getGitHubStatus(jobId);
            if (res.data.data.state === 'completed') {
              setJobId(null);
              refetch();
              toast.success('GitHub profile analyzed successfully!');
            } else if (res.data.data.state === 'failed') {
              setJobId(null);
              refetch();
              toast.error('Failed to analyze GitHub profile.');
            }
          } else {
            const res = await api.getGitHub();
            if (res.data.data?.status !== 'PENDING') {
              refetch();
              if (res.data.data?.status === 'COMPLETED') {
                toast.success('GitHub analysis finished.');
              }
            }
          }
        } catch (e) {
          console.error(e);
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobId, profile?.status, refetch]);

  const connectMutation = useMutation({
    mutationFn: async (data: GithubFormValues) => {
      const res = await api.connectGitHub(data.username);
      return res.data.data;
    },
    onSuccess: (data) => {
      setJobId(data.jobId);
      setIsEditing(false);
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to connect GitHub');
    },
  });

  const onSubmit = (data: GithubFormValues) => {
    connectMutation.mutate(data);
  };

  if (isLoadingGithub) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-text mb-2">GitHub Sync</h1>
        <p className="text-text-secondary">Connect your GitHub to analyze your coding habits, languages, and public repositories.</p>
      </div>

      {(!profile || isEditing) && !connectMutation.isPending && (
        <Card glass>
          <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Github className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-text mb-2">{isEditing ? 'Edit GitHub Account' : 'Connect GitHub'}</h2>
            <p className="text-text-secondary text-center max-w-md mb-8">
              Enter your GitHub username. Our AI will automatically scan your public repositories to extract technical skills and project history.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-4">
              <div>
                <Input
                  {...register('username')}
                  placeholder="Username"
                  className="w-full"
                  defaultValue={profile?.username || ''}
                />
                {errors.username && <p className="text-xs text-danger mt-1">{errors.username.message}</p>}
              </div>
              <div className="flex gap-2 w-full">
                {isEditing && (
                  <Button type="button" variant="outline" className="w-full h-11" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" className="w-full h-11" disabled={connectMutation.isPending}>
                  {isEditing ? 'Update Account' : 'Connect Account'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {(connectMutation.isPending || profile?.status === 'PENDING' || jobId) && (
        <Card glass gradientBorder>
          <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-semibold text-text mb-2">Analyzing Repositories...</h2>
            <p className="text-text-secondary text-center max-w-md">
              We are cloning and scanning your public repositories to build your skill graph. This can take up to a minute.
            </p>
          </CardContent>
        </Card>
      )}

      {profile?.status === 'FAILED' && !jobId && !isEditing && (
        <Card glass className="border-danger/20">
          <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center">
            <AlertCircle className="w-12 h-12 text-danger mb-4" />
            <h2 className="text-xl font-semibold text-text mb-2">Sync Failed</h2>
            <p className="text-text-secondary text-center mb-6">We could not analyze the provided GitHub account. Please check the username and try again.</p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Username</Button>
              <Button onClick={() => refetch()}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {profile?.status === 'COMPLETED' && !jobId && !isEditing && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card glass>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-text">Top Repositories</h3>
                  </div>
                </div>
                {profile.repositories && profile.repositories.length > 0 ? (
                  <div className="grid gap-4">
                    {profile.repositories.map((repo: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-surface-3/50 border border-border">
                        <div className="flex justify-between items-start mb-2">
                          <a href={repo.url} target="_blank" rel="noreferrer" className="font-medium text-text hover:text-primary transition-colors">
                            {repo.name}
                          </a>
                          <div className="flex items-center gap-3 text-xs text-text-secondary">
                            <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5" /> {repo.stars}</span>
                            <span className="flex items-center gap-1"><GitBranch className="w-3.5 h-3.5" /> {repo.forks}</span>
                          </div>
                        </div>
                        <p className="text-sm text-text-secondary mb-3">{repo.description || 'No description provided.'}</p>
                        {repo.languages && (
                          <div className="flex flex-wrap gap-2">
                            {repo.languages.map((lang: string, j: number) => (
                              <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-text-secondary">
                                {lang}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm">No public repositories found.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card glass>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  {profile.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.avatarUrl} alt={profile.username} className="w-20 h-20 rounded-full mb-4 border-2 border-primary/20" />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-surface-3 flex items-center justify-center mb-4 border-2 border-primary/20">
                      <Github className="w-8 h-8 text-text-secondary" />
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-text">{profile.username}</h3>
                  <a href={profile.profileUrl} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline mb-4">View on GitHub</a>
                  <Button variant="outline" size="sm" className="w-full mb-4" onClick={() => setIsEditing(true)}>Edit GitHub Account</Button>
                  
                  <div className="grid grid-cols-2 gap-4 w-full border-t border-border pt-4">
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold text-text">{profile.publicRepos}</span>
                      <span className="text-xs text-text-secondary">Repos</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xl font-bold text-text">{profile.followers}</span>
                      <span className="text-xs text-text-secondary">Followers</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card glass>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Code className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-text">Top Languages</h3>
                </div>
                {profile.topLanguages && profile.topLanguages.length > 0 ? (
                  <div className="space-y-4">
                    {profile.topLanguages.map((lang: any, i: number) => (
                      <div key={i}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-text font-medium">{lang.language}</span>
                          <span className="text-text-secondary">{lang.percentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-surface-3 h-2 rounded-full overflow-hidden">
                          <div className="bg-primary h-full" style={{ width: `${Math.min(100, Math.max(0, lang.percentage))}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm">No language data found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
