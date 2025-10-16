import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { supabase, type Tables } from '@/lib/supabase';
import type {
  JobApplication,
  UserProfile,
  Skill,
  Experience,
  Education,
  JobPortal,
  ApplicationStatus,
  CompanySize,
  WorkArrangement,
} from '@/types';

// Database service layer for job applications
export class DatabaseService {
  
  // Job Applications
  static async getJobApplications(userId: string): Promise<JobApplication[]> {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      return data?.map(this.transformJobApplication) || [];
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return [];
    }
  }

  static async createJobApplication(userId: string, application: Partial<JobApplication>): Promise<JobApplication | null> {
    try {
      const dbApplication = this.transformToDbJobApplication(userId, application);
      
      console.log('Creating application with data:', dbApplication);
      
      const { data, error } = await supabase
        .from('job_applications')
        .insert(dbApplication)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return data ? this.transformJobApplication(data) : null;
    } catch (error) {
      console.error('Error creating job application:', error);
      return null;
    }
  }

  static async updateJobApplication(id: string, updates: Partial<JobApplication>): Promise<JobApplication | null> {
    try {
      const dbUpdates = this.transformToDbJobApplicationUpdates(updates);
      
      const { data, error } = await supabase
        .from('job_applications')
        .update({ ...dbUpdates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return data ? this.transformJobApplication(data) : null;
    } catch (error) {
      console.error('Error updating job application:', error);
      return null;
    }
  }

  static async deleteJobApplication(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting job application:', error);
      return false;
    }
  }

  // User Profile CRUD Operations
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('Error fetching user profile:', profileError);
        throw profileError;
      }

      if (!profile) {
        // No profile found, return null
        return null;
      }

      // Get related data
      const [skills, experiences, education] = await Promise.all([
        this.getUserSkills(userId),
        this.getUserExperiences(userId),
        this.getUserEducation(userId)
      ]);

      return {
        userId: profile.user_id,
        personalInfo: {
          name: profile.name,
          email: profile.email,
          phone: profile.phone || '',
          location: profile.location || '',
          websites: profile.websites || []
        },
        skills,
        experience: experiences,
        education,
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
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at)
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  static async createUserProfile(userId: string, profile: UserProfile): Promise<UserProfile | null> {
    try {
      // Use upsert to handle potential conflicts with unique constraint
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          name: profile.personalInfo.name,
          email: profile.personalInfo.email,
          phone: profile.personalInfo.phone,
          location: profile.personalInfo.location,
          websites: profile.personalInfo.websites
        }, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });

      if (profileError) throw profileError;

      return profile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return null;
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      // Update basic profile info
      if (updates.personalInfo) {
        const updateData: Record<string, unknown> = {};

        // Only include fields that are being updated
        if (updates.personalInfo.name !== undefined) updateData.name = updates.personalInfo.name;
        if (updates.personalInfo.phone !== undefined) updateData.phone = updates.personalInfo.phone;
        if (updates.personalInfo.location !== undefined) updateData.location = updates.personalInfo.location;
        if (updates.personalInfo.websites !== undefined) updateData.websites = updates.personalInfo.websites;
        // Note: email is NOT included - it's managed through auth.users table

        if (Object.keys(updateData).length > 0) {
          const { error: profileError } = await supabase
            .from('user_profiles')
            .update(updateData)
            .eq('user_id', userId);

          if (profileError) throw profileError;
        }
      }

      // Return updated profile
      return await this.getUserProfile(userId);
    } catch (error) {
      console.error('Error updating user profile:', error);
      return null;
    }
  }

  static async getUserSkills(userId: string): Promise<Skill[]> {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      return data?.map(this.transformSkill) || [];
    } catch (error) {
      console.error('Error fetching user skills:', error);
      return [];
    }
  }

  static async getUserExperiences(userId: string): Promise<Experience[]> {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

      if (error) throw error;

      return data?.map(this.transformExperience) || [];
    } catch (error) {
      console.error('Error fetching user experiences:', error);
      return [];
    }
  }

  static async getUserEducation(userId: string): Promise<Education[]> {
    try {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .eq('user_id', userId)
        .order('start_date', { ascending: false });

      if (error) throw error;

      return data?.map(this.transformEducation) || [];
    } catch (error) {
      console.error('Error fetching user education:', error);
      return [];
    }
  }

  static async createSkill(userId: string, skill: Omit<Skill, 'id'>): Promise<Skill | null> {
    try {
      const { data, error } = await supabase
        .from('skills')
        .insert(this.transformToDbSkill(userId, skill))
        .select()
        .single();

      if (error) throw error;

      return data ? this.transformSkill(data) : null;
    } catch (error) {
      console.error('Error creating skill:', error);
      return null;
    }
  }

  static async updateSkill(skillId: string, updates: Partial<Skill>): Promise<Skill | null> {
    try {
      const dbUpdates = this.transformToDbSkillUpdates(updates);

      const { data, error } = await supabase
        .from('skills')
        .update({ ...dbUpdates, updated_at: new Date().toISOString() })
        .eq('id', skillId)
        .select()
        .single();

      if (error) throw error;

      return data ? this.transformSkill(data) : null;
    } catch (error) {
      console.error('Error updating skill:', error);
      return null;
    }
  }

  static async deleteSkill(skillId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', skillId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting skill:', error);
      return false;
    }
  }

  static async createExperience(userId: string, experience: Omit<Experience, 'id'>): Promise<Experience | null> {
    try {
      const { data, error } = await supabase
        .from('experiences')
        .insert(this.transformToDbExperience(userId, experience))
        .select()
        .single();

      if (error) throw error;

      return data ? this.transformExperience(data) : null;
    } catch (error) {
      console.error('Error creating experience:', error);
      return null;
    }
  }

  static async updateExperience(experienceId: string, updates: Partial<Experience>): Promise<Experience | null> {
    try {
      const dbUpdates = this.transformToDbExperienceUpdates(updates);

      const { data, error } = await supabase
        .from('experiences')
        .update({ ...dbUpdates, updated_at: new Date().toISOString() })
        .eq('id', experienceId)
        .select()
        .single();

      if (error) throw error;

      return data ? this.transformExperience(data) : null;
    } catch (error) {
      console.error('Error updating experience:', error);
      return null;
    }
  }

  static async deleteExperience(experienceId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', experienceId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting experience:', error);
      return false;
    }
  }

  static async createEducation(userId: string, education: Omit<Education, 'id'>): Promise<Education | null> {
    try {
      const { data, error } = await supabase
        .from('education')
        .insert(this.transformToDbEducation(userId, education))
        .select()
        .single();

      if (error) throw error;

      return data ? this.transformEducation(data) : null;
    } catch (error) {
      console.error('Error creating education:', error);
      return null;
    }
  }

  static async updateEducation(educationId: string, updates: Partial<Education>): Promise<Education | null> {
    try {
      const dbUpdates = this.transformToDbEducationUpdates(updates);

      const { data, error } = await supabase
        .from('education')
        .update({ ...dbUpdates, updated_at: new Date().toISOString() })
        .eq('id', educationId)
        .select()
        .single();

      if (error) throw error;

      return data ? this.transformEducation(data) : null;
    } catch (error) {
      console.error('Error updating education:', error);
      return null;
    }
  }

  static async deleteEducation(educationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', educationId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting education:', error);
      return false;
    }
  }

  // Transform functions
  private static transformJobApplication(dbApp: Tables<'job_applications'>): JobApplication {
    return {
      id: dbApp.id,
      userId: dbApp.user_id,
      job: {
        title: dbApp.job_title,
        company: dbApp.company,
        location: dbApp.location,
        description: dbApp.description,
        requirements: dbApp.requirements,
        salary: dbApp.salary,
        url: dbApp.url,
        portal: (dbApp.portal as JobPortal) ?? 'direct',
        benefits: dbApp.benefits || undefined,
        companySize: dbApp.company_size ? (dbApp.company_size as CompanySize) : undefined,
        workArrangement: dbApp.work_arrangement ? (dbApp.work_arrangement as WorkArrangement) : undefined,
        industry: dbApp.industry || undefined
      },
      status: dbApp.status as ApplicationStatus,
      statusHistory: [{
        id: `${dbApp.id}-status`,
        status: dbApp.status as ApplicationStatus,
        date: new Date(dbApp.updated_at),
        source: 'manual'
      }],
      dates: {
        applied: new Date(dbApp.applied_date),
        lastUpdated: new Date(dbApp.updated_at),
        interviews: [],
        responses: []
      },
      documents: {
        resume: undefined,
        coverLetter: undefined,
        others: []
      },
      notes: dbApp.notes || '',
      tags: dbApp.tags || [],
      aiInsights: {
        matchScore: 0,
        skillGaps: [],
        suggestions: [],
        lastAnalyzed: new Date()
      },
      createdAt: new Date(dbApp.created_at),
      updatedAt: new Date(dbApp.updated_at)
    };
  }

  private static transformToDbJobApplication(userId: string, app: Partial<JobApplication>) {
    return {
      user_id: userId,
      job_title: app.job?.title || '',
      company: app.job?.company || '',
      location: app.job?.location || '',
      description: app.job?.description || '',
      requirements: app.job?.requirements || [],
      salary: app.job?.salary || '',
      url: app.job?.url || '',
      portal: app.job?.portal || 'direct',
      benefits: app.job?.benefits || null,
      company_size: app.job?.companySize || null,
      work_arrangement: app.job?.workArrangement || null,
      industry: app.job?.industry || null,
      status: app.status || 'applied',
      notes: app.notes || '',
      tags: app.tags || [],
      applied_date: app.dates?.applied ? app.dates.applied.toISOString() : new Date().toISOString(),
      // New fields
      application_source: 'manual',
      is_favorite: false,
      priority: 'medium'
    };
  }

  private static transformToDbJobApplicationUpdates(app: Partial<JobApplication>) {
    const updates: Record<string, unknown> = {};
    
    if (app.job?.title) updates.job_title = app.job.title;
    if (app.job?.company) updates.company = app.job.company;
    if (app.job?.location) updates.location = app.job.location;
    if (app.job?.description) updates.description = app.job.description;
    if (app.job?.requirements) updates.requirements = app.job.requirements;
    if (app.job?.salary) updates.salary = app.job.salary;
    if (app.job?.url) updates.url = app.job.url;
    if (app.job?.portal) updates.portal = app.job.portal;
    if (app.job?.benefits) updates.benefits = app.job.benefits;
    if (app.job?.companySize) updates.company_size = app.job.companySize;
    if (app.job?.workArrangement) updates.work_arrangement = app.job.workArrangement;
    if (app.job?.industry) updates.industry = app.job.industry;
    if (app.status) updates.status = app.status;
    if (app.notes !== undefined) updates.notes = app.notes;
    if (app.tags) updates.tags = app.tags;
    
    return updates;
  }

  private static transformSkill(dbSkill: Tables<'skills'>): Skill {
    return {
      id: dbSkill.id,
      name: dbSkill.name,
      level: dbSkill.level,
      category: dbSkill.category,
      yearsOfExperience: dbSkill.years_of_experience ?? undefined,
      verified: dbSkill.verified ?? false
    };
  }

  private static transformToDbSkill(userId: string, skill: Omit<Skill, 'id'>) {
    return {
      user_id: userId,
      name: skill.name,
      level: skill.level,
      category: skill.category,
      years_of_experience: skill.yearsOfExperience ?? null,
      verified: skill.verified ?? false
    };
  }

  private static transformToDbSkillUpdates(updates: Partial<Skill>) {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.level !== undefined) dbUpdates.level = updates.level;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.yearsOfExperience !== undefined) dbUpdates.years_of_experience = updates.yearsOfExperience;
    if (updates.verified !== undefined) dbUpdates.verified = updates.verified;

    return dbUpdates;
  }

  private static transformExperience(dbExperience: Tables<'experiences'>): Experience {
    return {
      id: dbExperience.id,
      company: dbExperience.company,
      title: dbExperience.title,
      startDate: new Date(dbExperience.start_date),
      endDate: dbExperience.end_date ? new Date(dbExperience.end_date) : undefined,
      current: dbExperience.current ?? false,
      description: dbExperience.description,
      skills: dbExperience.skills,
      achievements: dbExperience.achievements ?? undefined,
      location: dbExperience.location ?? undefined
    };
  }

  private static transformToDbExperience(userId: string, experience: Omit<Experience, 'id'>) {
    return {
      user_id: userId,
      company: experience.company,
      title: experience.title,
      start_date: experience.startDate.toISOString(),
      end_date: experience.current ? null : experience.endDate ? experience.endDate.toISOString() : null,
      current: experience.current,
      description: experience.description,
      skills: experience.skills,
      achievements: experience.achievements ?? null,
      location: experience.location ?? null
    };
  }

  private static transformToDbExperienceUpdates(updates: Partial<Experience>) {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.company !== undefined) dbUpdates.company = updates.company;
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate.toISOString();
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate ? updates.endDate.toISOString() : null;
    if (updates.current !== undefined) dbUpdates.current = updates.current;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.skills !== undefined) dbUpdates.skills = updates.skills;
    if (updates.achievements !== undefined) dbUpdates.achievements = updates.achievements ?? null;
    if (updates.location !== undefined) dbUpdates.location = updates.location ?? null;

    return dbUpdates;
  }

  private static transformEducation(dbEducation: Tables<'education'>): Education {
    return {
      id: dbEducation.id,
      institution: dbEducation.institution,
      degree: dbEducation.degree,
      field: dbEducation.field,
      startDate: new Date(dbEducation.start_date),
      endDate: dbEducation.end_date ? new Date(dbEducation.end_date) : undefined,
      description: dbEducation.description,
      gpa: dbEducation.gpa ?? undefined,
      achievements: dbEducation.achievements ?? undefined
    };
  }

  private static transformToDbEducation(userId: string, education: Omit<Education, 'id'>) {
    return {
      user_id: userId,
      institution: education.institution,
      degree: education.degree,
      field: education.field,
      start_date: education.startDate.toISOString(),
      end_date: education.endDate ? education.endDate.toISOString() : null,
      description: education.description,
      gpa: education.gpa ?? null,
      achievements: education.achievements ?? null
    };
  }

  private static transformToDbEducationUpdates(updates: Partial<Education>) {
    const dbUpdates: Record<string, unknown> = {};

    if (updates.institution !== undefined) dbUpdates.institution = updates.institution;
    if (updates.degree !== undefined) dbUpdates.degree = updates.degree;
    if (updates.field !== undefined) dbUpdates.field = updates.field;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate.toISOString();
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate ? updates.endDate.toISOString() : null;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.gpa !== undefined) dbUpdates.gpa = updates.gpa ?? null;
    if (updates.achievements !== undefined) dbUpdates.achievements = updates.achievements ?? null;

    return dbUpdates;
  }

  // Real-time subscriptions
  static subscribeToJobApplications(
    userId: string,
    callback: (payload: RealtimePostgresChangesPayload<Tables<'job_applications'>>) => void
  ) {
    return supabase
      .channel('job_applications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_applications',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }
}

// Disable mock data fallback - use real database only
export const useMockDataFallback = false;
