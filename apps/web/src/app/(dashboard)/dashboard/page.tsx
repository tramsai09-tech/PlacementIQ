'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { DashboardWidgets } from '@/components/dashboard/DashboardWidgets';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { appUser } = useAuth();

  const { data: response, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await api.getDashboard();
      return res.data;
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-text">Dashboard</h1>
          <p className="text-text-secondary mt-1">Welcome back, {appUser?.displayName}!</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="text-warning">Error loading dashboard data.</div>
      ) : response?.data ? (
        <DashboardWidgets summary={response.data} />
      ) : (
        <div className="text-text-secondary">No dashboard data available.</div>
      )}
    </div>
  );
}
