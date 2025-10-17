import { useState, useEffect, useCallback } from 'react';
import { useSessionStore } from '../store/session';
import { getSupabaseClient } from '@shared/supabase/client';

// Simplified type for extension (will match web app types later)
export interface JobApplication {
  id: string;
  userId: string;
  job: {
    title: string;
    company: string;
    location: string;
    url?: string;
    description?: string;
    salary?: string;
  };
  status: 'applied' | 'phone_screen' | 'interview' | 'final_interview' | 'offer' | 'rejected' | 'withdrawn';
  dates: {
    applied: string;
  };
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export const useJobApplications = () => {
  const session = useSessionStore((state) => state.session);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = getSupabaseClient();
  const userId = session?.user?.id;

  const fetchApplications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      setApplications([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      // Transform database data to match our type
      const transformedData: JobApplication[] = (data || []).map((app: any) => ({
        id: app.id,
        userId: app.user_id,
        job: {
          title: app.job_title || '',
          company: app.company || '',
          location: app.location || '',
          url: app.job_url,
          description: app.job_description,
          salary: app.salary_range,
        },
        status: app.status || 'applied',
        dates: {
          applied: app.applied_date || app.created_at,
        },
        notes: app.notes,
        tags: app.tags || [],
        createdAt: app.created_at,
        updatedAt: app.updated_at,
      }));

      setApplications(transformedData);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  const createApplication = useCallback(
    async (applicationData: Partial<JobApplication>) => {
      if (!userId) return null;

      try {
        const { data, error: createError } = await supabase
          .from('job_applications')
          .insert({
            user_id: userId,
            job_title: applicationData.job?.title,
            company: applicationData.job?.company,
            location: applicationData.job?.location,
            job_url: applicationData.job?.url,
            status: applicationData.status || 'applied',
            applied_date: new Date().toISOString(),
            notes: applicationData.notes,
            tags: applicationData.tags || [],
          })
          .select()
          .single();

        if (createError) throw createError;

        // Refresh the list
        await fetchApplications();

        return data;
      } catch (err) {
        console.error('Error creating application:', err);
        setError(err instanceof Error ? err.message : 'Failed to create application');
        return null;
      }
    },
    [userId, supabase, fetchApplications]
  );

  const updateApplication = useCallback(
    async (id: string, updates: Partial<JobApplication>) => {
      try {
        const updateData: any = {};

        if (updates.job?.title) updateData.job_title = updates.job.title;
        if (updates.job?.company) updateData.company = updates.job.company;
        if (updates.job?.location) updateData.location = updates.job.location;
        if (updates.status) updateData.status = updates.status;
        if (updates.notes !== undefined) updateData.notes = updates.notes;
        if (updates.tags) updateData.tags = updates.tags;

        const { error: updateError } = await supabase
          .from('job_applications')
          .update(updateData)
          .eq('id', id);

        if (updateError) throw updateError;

        // Refresh the list
        await fetchApplications();

        return true;
      } catch (err) {
        console.error('Error updating application:', err);
        setError(err instanceof Error ? err.message : 'Failed to update application');
        return false;
      }
    },
    [supabase, fetchApplications]
  );

  const deleteApplication = useCallback(
    async (id: string) => {
      try {
        const { error: deleteError } = await supabase
          .from('job_applications')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;

        // Remove from local state immediately
        setApplications((prev) => prev.filter((app) => app.id !== id));

        return true;
      } catch (err) {
        console.error('Error deleting application:', err);
        setError(err instanceof Error ? err.message : 'Failed to delete application');
        return false;
      }
    },
    [supabase]
  );

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchApplications();
    } else {
      setLoading(false);
      setApplications([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // Set up real-time subscription
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('job_applications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_applications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          // Refetch when data changes
          fetchApplications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    applications,
    loading,
    error,
    createApplication,
    updateApplication,
    deleteApplication,
    refetch: fetchApplications,
  };
};
