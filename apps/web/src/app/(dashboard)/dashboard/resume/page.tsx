'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { Loader2, UploadCloud, FileText, CheckCircle2, AlertCircle, Briefcase, GraduationCap, Code } from 'lucide-react';
import { toast } from 'sonner';

export default function ResumePage() {
  const { data: resumeResponse, isLoading: isLoadingResume, refetch } = useQuery({
    queryKey: ['resume'],
    queryFn: async () => {
      const res = await api.getResume();
      return res.data;
    },
  });

  const resume = resumeResponse?.data;
  const [jobId, setJobId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (jobId || resume?.status === 'PENDING') {
      interval = setInterval(async () => {
        try {
          if (jobId) {
            const res = await api.getResumeStatus(jobId);
            if (res.data.data.state === 'completed') {
              setJobId(null);
              refetch();
              toast.success('Resume parsed successfully!');
            } else if (res.data.data.state === 'failed') {
              setJobId(null);
              refetch();
              toast.error('Failed to parse resume.');
            }
          } else {
            // Just refetch the resume to see if status changed from PENDING
            const res = await api.getResume();
            if (res.data.data?.status !== 'PENDING') {
              refetch();
              if (res.data.data?.status === 'COMPLETED') {
                toast.success('Resume parsing finished.');
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
  }, [jobId, resume?.status, refetch]);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const res = await api.uploadResume(file);
      return res.data.data;
    },
    onSuccess: (data) => {
      setJobId(data.jobId);
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to upload resume');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      uploadMutation.mutate(file);
    }
  };

  if (isLoadingResume) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const parsedData = resume?.parsedData;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-text mb-2">Resume</h1>
          <p className="text-text-secondary">Upload your resume to extract skills, experience, and get AI-powered insights.</p>
        </div>
        {(resume || uploadMutation.isPending) && (
          <div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending || resume?.status === 'PENDING' || jobId !== null}
              className="whitespace-nowrap"
            >
              {uploadMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <UploadCloud className="w-4 h-4 mr-2" />}
              Update Resume
            </Button>
          </div>
        )}
      </div>

      {!resume && !uploadMutation.isPending && (
        <Card glass>
          <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold text-text mb-2">Upload your Resume</h2>
            <p className="text-text-secondary text-center max-w-md mb-8">
              We accept PDF, DOC, and DOCX files up to 5MB. Our AI will automatically extract and structure your profile.
            </p>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <Button onClick={() => fileInputRef.current?.click()} className="px-8 py-6 text-lg">
              <UploadCloud className="w-5 h-5 mr-2" />
              Select File
            </Button>
          </CardContent>
        </Card>
      )}

      {(uploadMutation.isPending || resume?.status === 'PENDING' || jobId) && (
        <Card glass gradientBorder>
          <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center min-h-[300px]">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
            <h2 className="text-2xl font-semibold text-text mb-2">Analyzing Resume...</h2>
            <p className="text-text-secondary text-center max-w-md">
              Our AI is reading your resume and extracting key skills, education, and experience. This usually takes 10-30 seconds.
            </p>
          </CardContent>
        </Card>
      )}

      {resume?.status === 'FAILED' && !jobId && (
        <Card glass className="border-danger/20">
          <CardContent className="pt-8 pb-8 flex flex-col items-center justify-center">
            <AlertCircle className="w-12 h-12 text-danger mb-4" />
            <h2 className="text-xl font-semibold text-text mb-2">Analysis Failed</h2>
            <p className="text-text-secondary text-center mb-6">{resume.errorMessage || 'We could not process this document.'}</p>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()}>Try Again</Button>
          </CardContent>
        </Card>
      )}

      {resume?.status === 'COMPLETED' && parsedData && !jobId && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card glass>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-6">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-text">Experience</h3>
                </div>
                {parsedData.experience && parsedData.experience.length > 0 ? (
                  <div className="space-y-6">
                    {parsedData.experience.map((exp: any, i: number) => (
                      <div key={i} className="relative pl-6 border-l-2 border-border pb-6 last:pb-0">
                        <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1.5 ring-4 ring-bg" />
                        <h4 className="font-medium text-text text-lg">{exp.title}</h4>
                        <div className="text-primary font-medium text-sm mb-1">{exp.company}</div>
                        <div className="text-text-secondary text-sm mb-3">
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-text-secondary">
                          {exp.highlights?.map((h: string, j: number) => (
                            <li key={j}>{h}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm">No experience found.</p>
                )}
              </CardContent>
            </Card>

            <Card glass>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-6">
                  <Code className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-text">Projects</h3>
                </div>
                {parsedData.projects && parsedData.projects.length > 0 ? (
                  <div className="grid gap-4">
                    {parsedData.projects.map((proj: any, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-surface-3/50 border border-border">
                        <h4 className="font-medium text-text mb-1">{proj.name}</h4>
                        {proj.technologies && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {proj.technologies.map((tech: string, j: number) => (
                              <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-surface border border-border text-text-secondary">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-text-secondary">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm">No projects found.</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card glass>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold text-text mb-4">Contact Info</h3>
                <div className="space-y-3 text-sm">
                  {parsedData.contactInfo?.name && (
                    <div className="flex flex-col">
                      <span className="text-text-secondary text-xs">Name</span>
                      <span className="text-text font-medium">{parsedData.contactInfo.name}</span>
                    </div>
                  )}
                  {parsedData.contactInfo?.email && (
                    <div className="flex flex-col">
                      <span className="text-text-secondary text-xs">Email</span>
                      <span className="text-text font-medium">{parsedData.contactInfo.email}</span>
                    </div>
                  )}
                  {parsedData.contactInfo?.phone && (
                    <div className="flex flex-col">
                      <span className="text-text-secondary text-xs">Phone</span>
                      <span className="text-text font-medium">{parsedData.contactInfo.phone}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card glass>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-text">Skills</h3>
                </div>
                {parsedData.skills && parsedData.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {parsedData.skills.map((skill: any, i: number) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-md bg-primary/10 text-primary font-medium border border-primary/20">
                        {typeof skill === 'string' ? skill : skill.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm">No skills found.</p>
                )}
              </CardContent>
            </Card>

            <Card glass>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-text">Education</h3>
                </div>
                {parsedData.education && parsedData.education.length > 0 ? (
                  <div className="space-y-4">
                    {parsedData.education.map((edu: any, i: number) => (
                      <div key={i} className="border-l-2 border-border pl-3">
                        <div className="font-medium text-text text-sm">{edu.degree}</div>
                        <div className="text-xs text-text-secondary mb-1">{edu.institution}</div>
                        <div className="text-[10px] text-text-muted">{edu.startDate} - {edu.endDate || 'Present'}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm">No education found.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
