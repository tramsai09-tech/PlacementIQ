'use client';

import { DashboardSummary } from '@placementiq/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  TrendingUp,
  FileText,
  Github,
  Code,
  Briefcase,
  AlertTriangle,
  Lightbulb,
  Map,
  FileBarChart
} from 'lucide-react';
import Link from 'next/link';

interface DashboardWidgetsProps {
  summary: DashboardSummary;
}

export function DashboardWidgets({ summary }: DashboardWidgetsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 1. Placement Score */}
      <Card glass gradientBorder>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Placement Score</CardTitle>
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <CardDescription>Your overall readiness</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-text">
            {summary.placementScore !== undefined ? `${summary.placementScore}%` : 'N/A'}
          </div>
          {summary.scoreGrade && (
            <p className="text-sm text-text-secondary mt-1">Grade: {summary.scoreGrade}</p>
          )}
        </CardContent>
      </Card>

      {/* 2. Resume Score */}
      <Card glass>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Resume Score</CardTitle>
            <FileText className="h-5 w-5 text-accent-1" />
          </div>
          <CardDescription>ATS & Content Quality</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-text">
            {summary.resumeScore !== undefined ? `${summary.resumeScore}%` : 'N/A'}
          </div>
        </CardContent>
      </Card>

      {/* 3. GitHub Score */}
      <Card glass>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">GitHub Score</CardTitle>
            <Github className="h-5 w-5 text-accent-2" />
          </div>
          <CardDescription>Project Complexity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-text">
            {summary.githubScore !== undefined ? `${summary.githubScore}%` : 'N/A'}
          </div>
        </CardContent>
      </Card>

      {/* 4. Coding Score */}
      <Card glass>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Coding Score</CardTitle>
            <Code className="h-5 w-5 text-accent-3" />
          </div>
          <CardDescription>Problem Solving</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-text">
            {summary.codingScore !== undefined ? `${summary.codingScore}%` : 'N/A'}
          </div>
        </CardContent>
      </Card>

      {/* 5. Job Matches */}
      <Card glass>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Job Matches</CardTitle>
            <Briefcase className="h-5 w-5 text-primary" />
          </div>
          <CardDescription>Based on your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-text">
            {summary.quickStats?.jobMatchesFound || 0}
          </div>
          <Link href="/dashboard/jobs" className="text-sm text-primary hover:underline mt-1 inline-block">
            View matches
          </Link>
        </CardContent>
      </Card>

      {/* 6. Skill Gap */}
      <Card glass>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Top Skill Gap</CardTitle>
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <CardDescription>What to learn next</CardDescription>
        </CardHeader>
        <CardContent>
          {summary.topSkillGaps && summary.topSkillGaps.length > 0 ? (
            <div>
              <div className="font-semibold text-text">{summary.topSkillGaps[0].skill}</div>
              <p className="text-sm text-text-secondary mt-1 line-clamp-2">
                {summary.topSkillGaps[0].reason}
              </p>
            </div>
          ) : (
            <div className="text-sm text-text-secondary">No skill gaps identified.</div>
          )}
        </CardContent>
      </Card>

      {/* 7. Recommendations */}
      <Card glass>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Top Recommendation</CardTitle>
            <Lightbulb className="h-5 w-5 text-accent-1" />
          </div>
          <CardDescription>Best matching role</CardDescription>
        </CardHeader>
        <CardContent>
          {summary.topJobRecommendations && summary.topJobRecommendations.length > 0 ? (
            <div>
              <div className="font-semibold text-text truncate">
                {summary.topJobRecommendations[0].job.title}
              </div>
              <p className="text-sm text-text-secondary mt-1">
                {Math.round(summary.topJobRecommendations[0].matchScore)}% Match
              </p>
            </div>
          ) : (
            <div className="text-sm text-text-secondary">No recommendations yet.</div>
          )}
        </CardContent>
      </Card>

      {/* 8. Roadmap */}
      <Card glass>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Roadmap</CardTitle>
            <Map className="h-5 w-5 text-accent-2" />
          </div>
          <CardDescription>Your learning path</CardDescription>
        </CardHeader>
        <CardContent>
          {summary.roadmapSummary ? (
            <div>
              <div className="font-semibold text-text">
                {summary.roadmapSummary.totalWeeks} Weeks Total
              </div>
              <p className="text-sm text-text-secondary mt-1 truncate">
                Next: {summary.roadmapSummary.nextMilestone || 'All done!'}
              </p>
              <Link href="/dashboard/roadmap" className="text-sm text-primary hover:underline mt-2 inline-block">
                View Roadmap
              </Link>
            </div>
          ) : (
            <div className="text-sm text-text-secondary">Generate a roadmap first.</div>
          )}
        </CardContent>
      </Card>

      {/* 9. Reports */}
      <Card glass>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Recent Reports</CardTitle>
            <FileBarChart className="h-5 w-5 text-accent-3" />
          </div>
          <CardDescription>Past analyses</CardDescription>
        </CardHeader>
        <CardContent>
          {summary.reportsSummary && summary.reportsSummary.length > 0 ? (
            <div className="space-y-2">
              {summary.reportsSummary.slice(0, 2).map((report, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-sm text-text-secondary">
                    {new Date(report.createdAt).toLocaleDateString()}
                  </span>
                  <span className="font-semibold text-text">{report.overallScore}%</span>
                </div>
              ))}
              <Link href="/dashboard/reports" className="text-sm text-primary hover:underline mt-2 inline-block">
                View all reports
              </Link>
            </div>
          ) : (
            <div className="text-sm text-text-secondary">No reports available.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
