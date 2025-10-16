// Supabase Database Types
// Auto-generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      career_preferences: {
        Row: {
          id: string;
          user_id: string;
          job_types: string[] | null;
          locations: string[] | null;
          industries: string[] | null;
          roles: string[] | null;
          salary_min: number | null;
          salary_max: number | null;
          salary_currency: string | null;
          work_arrangements: string[] | null;
          company_sizes: string[] | null;
          benefits: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          job_types?: string[] | null;
          locations?: string[] | null;
          industries?: string[] | null;
          roles?: string[] | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string | null;
          work_arrangements?: string[] | null;
          company_sizes?: string[] | null;
          benefits?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          job_types?: string[] | null;
          locations?: string[] | null;
          industries?: string[] | null;
          roles?: string[] | null;
          salary_min?: number | null;
          salary_max?: number | null;
          salary_currency?: string | null;
          work_arrangements?: string[] | null;
          company_sizes?: string[] | null;
          benefits?: string[] | null;
          updated_at?: string;
        };
      };
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
          verified: boolean | null;
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
          verified?: boolean | null;
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
          verified?: boolean | null;
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
          current: boolean | null;
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
          current?: boolean | null;
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
          current?: boolean | null;
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
          portal: Database['public']['Enums']['job_portal'];
          benefits: string[] | null;
          company_size: Database['public']['Enums']['company_size'] | null;
          work_arrangement: Database['public']['Enums']['work_arrangement'] | null;
          industry: string | null;
          status: Database['public']['Enums']['application_status'];
          notes: string | null;
          tags: string[] | null;
          applied_date: string;
          created_at: string;
          updated_at: string;
          // New fields from migration
          application_source: string | null;
          status_history: Json | null;
          interview_dates: Json | null;
          response_dates: Json | null;
          is_favorite: boolean | null;
          priority: string | null;
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
          portal: Database['public']['Enums']['job_portal'];
          benefits?: string[] | null;
          company_size?: Database['public']['Enums']['company_size'] | null;
          work_arrangement?: Database['public']['Enums']['work_arrangement'] | null;
          industry?: string | null;
          status: Database['public']['Enums']['application_status'];
          notes?: string | null;
          tags?: string[] | null;
          applied_date: string;
          created_at?: string;
          updated_at?: string;
          application_source?: string | null;
          status_history?: Json | null;
          interview_dates?: Json | null;
          response_dates?: Json | null;
          is_favorite?: boolean | null;
          priority?: string | null;
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
          portal?: Database['public']['Enums']['job_portal'];
          benefits?: string[] | null;
          company_size?: Database['public']['Enums']['company_size'] | null;
          work_arrangement?: Database['public']['Enums']['work_arrangement'] | null;
          industry?: string | null;
          status?: Database['public']['Enums']['application_status'];
          notes?: string | null;
          tags?: string[] | null;
          applied_date?: string;
          updated_at?: string;
          application_source?: string | null;
          status_history?: Json | null;
          interview_dates?: Json | null;
          response_dates?: Json | null;
          is_favorite?: boolean | null;
          priority?: string | null;
        };
      };
    };
    Views: {
      v_user_application_summary: {
        Row: {
          user_id: string | null;
          total_applications: number | null;
          unique_companies: number | null;
          applied: number | null;
          under_review: number | null;
          in_interview: number | null;
          offers: number | null;
          rejected: number | null;
          favorites: number | null;
          last_application_date: string | null;
          first_application_date: string | null;
        };
      };
      v_monthly_application_trends: {
        Row: {
          user_id: string | null;
          month: string | null;
          application_count: number | null;
          unique_companies: number | null;
          status_breakdown: Json | null;
        };
      };
      v_application_funnel: {
        Row: {
          user_id: string | null;
          status: Database['public']['Enums']['application_status'] | null;
          count: number | null;
          stage_order: number | null;
          percentage_of_applied: number | null;
        };
      };
    };
    Functions: {
      search_job_applications: {
        Args: { p_user_id: string; p_search_term: string };
        Returns: Database['public']['Tables']['job_applications']['Row'][];
      };
      get_application_statistics: {
        Args: { p_user_id: string };
        Returns: {
          total_applications: number;
          applied_count: number;
          under_review_count: number;
          phone_screen_count: number;
          interview_count: number;
          final_interview_count: number;
          offer_count: number;
          rejected_count: number;
          withdrawn_count: number;
          success_rate: number;
          avg_response_time_days: number;
        }[];
      };
      get_applications_timeline: {
        Args: { p_user_id: string; p_days_back?: number };
        Returns: {
          date: string;
          applications_count: number;
          status_breakdown: Json;
        }[];
      };
      get_top_companies: {
        Args: { p_user_id: string; p_limit?: number };
        Returns: {
          company: string;
          application_count: number;
          latest_status: string;
          latest_application_date: string;
        }[];
      };
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
