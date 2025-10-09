// Supabase Database Types
// This file would typically be auto-generated from your Supabase schema

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          email: string;
          phone: string | null;
          location: string | null;
          websites: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          email: string;
          phone?: string | null;
          location?: string | null;
          websites?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          location?: string | null;
          websites?: string[] | null;
          updated_at?: string;
        };
      };
      skills: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
          category: 'technical' | 'soft' | 'language' | 'certification' | 'tool';
          years_of_experience: number | null;
          verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
          category: 'technical' | 'soft' | 'language' | 'certification' | 'tool';
          years_of_experience?: number | null;
          verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
          category?: 'technical' | 'soft' | 'language' | 'certification' | 'tool';
          years_of_experience?: number | null;
          verified?: boolean;
          updated_at?: string;
        };
      };
      experiences: {
        Row: {
          id: string;
          user_id: string;
          company: string;
          title: string;
          start_date: string;
          end_date: string | null;
          current: boolean;
          description: string;
          skills: string[];
          achievements: string[] | null;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company: string;
          title: string;
          start_date: string;
          end_date?: string | null;
          current?: boolean;
          description: string;
          skills: string[];
          achievements?: string[] | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company?: string;
          title?: string;
          start_date?: string;
          end_date?: string | null;
          current?: boolean;
          description?: string;
          skills?: string[];
          achievements?: string[] | null;
          location?: string | null;
          updated_at?: string;
        };
      };
      education: {
        Row: {
          id: string;
          user_id: string;
          institution: string;
          degree: string;
          field: string;
          start_date: string;
          end_date: string | null;
          description: string;
          gpa: number | null;
          achievements: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          institution: string;
          degree: string;
          field: string;
          start_date: string;
          end_date?: string | null;
          description: string;
          gpa?: number | null;
          achievements?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          institution?: string;
          degree?: string;
          field?: string;
          start_date?: string;
          end_date?: string | null;
          description?: string;
          gpa?: number | null;
          achievements?: string[] | null;
          updated_at?: string;
        };
      };
      job_applications: {
        Row: {
          id: string;
          user_id: string;
          job_title: string;
          company: string;
          location: string;
          description: string;
          requirements: string[];
          salary: string;
          url: string;
          portal: string;
          benefits: string[] | null;
          company_size: string | null;
          work_arrangement: string | null;
          industry: string | null;
          status: string;
          notes: string;
          tags: string[];
          applied_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_title: string;
          company: string;
          location: string;
          description: string;
          requirements: string[];
          salary: string;
          url: string;
          portal: string;
          benefits?: string[] | null;
          company_size?: string | null;
          work_arrangement?: string | null;
          industry?: string | null;
          status: string;
          notes?: string;
          tags?: string[];
          applied_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_title?: string;
          company?: string;
          location?: string;
          description?: string;
          requirements?: string[];
          salary?: string;
          url?: string;
          portal?: string;
          benefits?: string[] | null;
          company_size?: string | null;
          work_arrangement?: string | null;
          industry?: string | null;
          status?: string;
          notes?: string;
          tags?: string[];
          applied_date?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      skill_level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
      skill_category: 'technical' | 'soft' | 'language' | 'certification' | 'tool';
      application_status: 'draft' | 'applied' | 'under_review' | 'phone_screen' | 'interview' | 'final_interview' | 'offer' | 'rejected' | 'withdrawn' | 'expired';
      job_portal: 'lever' | 'greenhouse' | 'workday' | 'ultipro' | 'smartrecruiters' | 'oracle' | 'jobvite' | 'ashby' | 'taleo' | 'eightfold' | 'linkedin' | 'indeed' | 'glassdoor' | 'direct' | 'other';
      work_arrangement: 'remote' | 'hybrid' | 'on-site';
      company_size: 'startup' | 'small' | 'medium' | 'large' | 'enterprise';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}