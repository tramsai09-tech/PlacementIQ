import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return Math.round(score).toString();
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#00D97E';
  if (score >= 60) return '#00C2FF';
  if (score >= 40) return '#FFB547';
  return '#FF6B6B';
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A': return '#00D97E';
    case 'B': return '#00C2FF';
    case 'C': return '#FFB547';
    case 'D': return '#FF6B6B';
    default: return '#98A2B3';
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'CRITICAL': return '#FF6B6B';
    case 'HIGH': return '#FFB547';
    case 'MEDIUM': return '#00C2FF';
    case 'LOW': return '#98A2B3';
    default: return '#98A2B3';
  }
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = diff / 1000;
  const minutes = seconds / 60;
  const hours = minutes / 60;
  const days = hours / 24;

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${Math.floor(minutes)}m ago`;
  if (hours < 24) return `${Math.floor(hours)}h ago`;
  if (days < 7) return `${Math.floor(days)}d ago`;
  return d.toLocaleDateString();
}
