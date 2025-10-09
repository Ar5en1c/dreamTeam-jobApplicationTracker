import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { DatabaseService } from '@/services/database';
import type { UserProfile, Skill, Experience, Education } from '@/types';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Try to fetch existing profile from database
      const existingProfile = await DatabaseService.getUserProfile(user.id);
      
      if (existingProfile) {
        setProfile(existingProfile);
      } else {
        // Create a basic profile from user data if none exists
        const basicProfile: UserProfile = {
          userId: user.id,
          personalInfo: {
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            email: user.email || '',
            phone: user.user_metadata?.phone || '',
            location: '',
            websites: []
          },
          skills: [],
          experience: [],
          education: [],
          preferences: {
            jobTypes: [],
            locations: [],
            industries: [],
            roles: [],
            salaryRange: { min: 0, max: 0, currency: 'USD' },
            workArrangement: [],
            companySize: [],
            benefits: []
          },
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Save the basic profile to database
        await DatabaseService.createUserProfile(user.id, basicProfile);
        setProfile(basicProfile);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!profile || !user) return false;

    try {
      // Update database
      const updatedProfile = await DatabaseService.updateUserProfile(user.id, updates);
      if (updatedProfile) {
        setProfile(updatedProfile);
        return true;
      }
      return false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    }
  }, [profile, user]);

  const addSkill = useCallback(async (skill: Omit<Skill, 'id'>) => {
    if (!profile || !user) return false;

    try {
      setError(null);
      const createdSkill = await DatabaseService.createSkill(user.id, skill);
      if (!createdSkill) {
        throw new Error('Skill creation returned no data');
      }

      setProfile(prev => prev ? {
        ...prev,
        skills: [...prev.skills, createdSkill],
        updatedAt: new Date()
      } : prev);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add skill');
      return false;
    }
  }, [profile, user]);

  const updateSkill = useCallback(async (skillId: string, updates: Partial<Skill>) => {
    if (!profile || !user) return false;

    try {
      setError(null);
      const updatedSkill = await DatabaseService.updateSkill(skillId, updates);
      if (!updatedSkill) {
        throw new Error('Skill update returned no data');
      }

      setProfile(prev => prev ? {
        ...prev,
        skills: prev.skills.map(skill => skill.id === skillId ? updatedSkill : skill),
        updatedAt: new Date()
      } : prev);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update skill');
      return false;
    }
  }, [profile, user]);

  const deleteSkill = useCallback(async (skillId: string) => {
    if (!profile || !user) return false;

    try {
      setError(null);
      const success = await DatabaseService.deleteSkill(skillId);
      if (!success) {
        throw new Error('Delete operation was not successful');
      }

      setProfile(prev => prev ? {
        ...prev,
        skills: prev.skills.filter(skill => skill.id !== skillId),
        updatedAt: new Date()
      } : prev);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete skill');
      return false;
    }
  }, [profile, user]);

  const addExperience = useCallback(async (experience: Omit<Experience, 'id'>) => {
    if (!profile || !user) return false;

    try {
      setError(null);
      const createdExperience = await DatabaseService.createExperience(user.id, experience);
      if (!createdExperience) {
        throw new Error('Experience creation returned no data');
      }

      setProfile(prev => prev ? {
        ...prev,
        experience: [...prev.experience, createdExperience].sort(
          (a, b) => b.startDate.getTime() - a.startDate.getTime()
        ),
        updatedAt: new Date()
      } : prev);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add experience');
      return false;
    }
  }, [profile, user]);

  const updateExperience = useCallback(async (expId: string, updates: Partial<Experience>) => {
    if (!profile || !user) return false;

    try {
      setError(null);
      const updatedExperience = await DatabaseService.updateExperience(expId, updates);
      if (!updatedExperience) {
        throw new Error('Experience update returned no data');
      }

      setProfile(prev => prev ? {
        ...prev,
        experience: prev.experience
          .map(exp => exp.id === expId ? updatedExperience : exp)
          .sort((a, b) => b.startDate.getTime() - a.startDate.getTime()),
        updatedAt: new Date()
      } : prev);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update experience');
      return false;
    }
  }, [profile, user]);

  const deleteExperience = useCallback(async (expId: string) => {
    if (!profile || !user) return false;

    try {
      setError(null);
      const success = await DatabaseService.deleteExperience(expId);
      if (!success) {
        throw new Error('Delete operation was not successful');
      }

      setProfile(prev => prev ? {
        ...prev,
        experience: prev.experience.filter(exp => exp.id !== expId),
        updatedAt: new Date()
      } : prev);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete experience');
      return false;
    }
  }, [profile, user]);

  const addEducation = useCallback(async (education: Omit<Education, 'id'>) => {
    if (!profile || !user) return false;

    try {
      setError(null);
      const createdEducation = await DatabaseService.createEducation(user.id, education);
      if (!createdEducation) {
        throw new Error('Education creation returned no data');
      }

      setProfile(prev => prev ? {
        ...prev,
        education: [...prev.education, createdEducation].sort(
          (a, b) => b.startDate.getTime() - a.startDate.getTime()
        ),
        updatedAt: new Date()
      } : prev);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add education');
      return false;
    }
  }, [profile, user]);

  const updateEducation = useCallback(async (eduId: string, updates: Partial<Education>) => {
    if (!profile || !user) return false;

    try {
      setError(null);
      const updatedEducation = await DatabaseService.updateEducation(eduId, updates);
      if (!updatedEducation) {
        throw new Error('Education update returned no data');
      }

      setProfile(prev => prev ? {
        ...prev,
        education: prev.education
          .map(edu => edu.id === eduId ? updatedEducation : edu)
          .sort((a, b) => b.startDate.getTime() - a.startDate.getTime()),
        updatedAt: new Date()
      } : prev);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update education');
      return false;
    }
  }, [profile, user]);

  const deleteEducation = useCallback(async (eduId: string) => {
    if (!profile || !user) return false;

    try {
      setError(null);
      const success = await DatabaseService.deleteEducation(eduId);
      if (!success) {
        throw new Error('Delete operation was not successful');
      }

      setProfile(prev => prev ? {
        ...prev,
        education: prev.education.filter(edu => edu.id !== eduId),
        updatedAt: new Date()
      } : prev);

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete education');
      return false;
    }
  }, [profile, user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    addSkill,
    updateSkill,
    deleteSkill,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    refetch: fetchProfile
  };
};
