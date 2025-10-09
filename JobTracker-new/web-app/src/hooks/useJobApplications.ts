import { useState, useEffect, useCallback } from 'react';
import { DatabaseService, useMockDataFallback } from '@/services/database';
import { mockJobApplications } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import type { JobApplication } from '@/types';

export const useJobApplications = (userId?: string) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const effectiveUserId = userId || user?.id;

  // Always use real database when user is authenticated
  const useMockData = false;

  const fetchApplications = useCallback(async () => {
    if (!effectiveUserId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (useMockData) {
        // Use mock data for demo
        setApplications(mockJobApplications);
      } else {
        // Use real database
        const data = await DatabaseService.getJobApplications(effectiveUserId);
        setApplications(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
      // Don't fallback to mock data - show empty state with error
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [effectiveUserId, useMockData]);

  const createApplication = useCallback(async (applicationData: Partial<JobApplication>) => {
    if (!effectiveUserId) return null;
    
    try {
      if (useMockData) {
        // Mock creation for demo
        const newApplication: JobApplication = {
          id: `app-${Date.now()}`,
          userId: effectiveUserId,
          statusHistory: [{
            id: `status-${Date.now()}`,
            status: applicationData.status || 'applied',
            date: new Date(),
            source: 'manual'
          }],
          dates: {
            applied: new Date(),
            lastUpdated: new Date(),
            interviews: [],
            responses: []
          },
          documents: {
            resume: undefined,
            coverLetter: undefined,
            others: []
          },
          aiInsights: {
            matchScore: 0,
            skillGaps: [],
            suggestions: [],
            lastAnalyzed: new Date()
          },
          createdAt: new Date(),
          updatedAt: new Date(),
          ...applicationData
        } as JobApplication;

        setApplications(prev => [newApplication, ...prev]);
        return newApplication;
      } else {
        // Use real database
        const newApplication = await DatabaseService.createJobApplication(effectiveUserId, applicationData);
        if (newApplication) {
          setApplications(prev => [newApplication, ...prev]);
        }
        return newApplication;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create application');
      return null;
    }
  }, [effectiveUserId, useMockData]);

  const updateApplication = useCallback(async (id: string, updates: Partial<JobApplication>) => {
    // Store previous state for rollback
    const previousApplications = applications;

    // Optimistic update - update UI immediately
    setApplications(prev => prev.map(app =>
      app.id === id
        ? { ...app, ...updates, updatedAt: new Date() }
        : app
    ));

    try {
      if (useMockData) {
        // Mock update for demo
        return true;
      } else {
        // Use real database
        const updatedApplication = await DatabaseService.updateJobApplication(id, updates);
        if (!updatedApplication) {
          throw new Error('Update failed');
        }

        // Replace optimistic update with server response
        setApplications(prev => prev.map(app =>
          app.id === id ? updatedApplication : app
        ));

        return true;
      }
    } catch (err) {
      // Rollback on error
      setApplications(previousApplications);
      setError(err instanceof Error ? err.message : 'Failed to update application');
      return false;
    }
  }, [useMockData, applications]);

  const deleteApplication = useCallback(async (id: string) => {
    // Store previous state for rollback
    const previousApplications = applications;

    // Optimistic delete - remove from UI immediately
    setApplications(prev => prev.filter(app => app.id !== id));

    try {
      if (useMockData) {
        // Mock deletion for demo
        return true;
      } else {
        // Use real database
        const success = await DatabaseService.deleteJobApplication(id);
        if (!success) {
          throw new Error('Delete failed');
        }
        return true;
      }
    } catch (err) {
      // Rollback on error
      setApplications(previousApplications);
      setError(err instanceof Error ? err.message : 'Failed to delete application');
      return false;
    }
  }, [useMockData, applications]);

  // Set up real-time subscription (only for real database)
  useEffect(() => {
    if (!useMockData && effectiveUserId) {
      const subscription = DatabaseService.subscribeToJobApplications(effectiveUserId, (payload) => {
        // Handle real-time updates
        fetchApplications();
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [effectiveUserId, useMockData, fetchApplications]);

  // Initial fetch
  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    refetch: fetchApplications,
    isUsingMockData: useMockData
  };
};