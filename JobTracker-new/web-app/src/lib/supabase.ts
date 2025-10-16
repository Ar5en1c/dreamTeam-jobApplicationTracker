import { createClient } from '@supabase/supabase-js';
import type { Database as DatabaseSchema } from '@/types/database';

// These would typically come from environment variables
// For demo purposes, we'll use placeholder values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

type AddRelationships<Entity> = Entity extends { Relationships: unknown }
  ? Entity
  : Entity & { Relationships: [] };

type AugmentedTables<Tables extends Record<string, unknown>> = {
  [TableName in keyof Tables]: AddRelationships<Tables[TableName]>;
};

type AugmentedViews<Views extends Record<string, unknown>> = {
  [ViewName in keyof Views]: AddRelationships<Views[ViewName]>;
};

type AugmentedDatabase = Omit<DatabaseSchema, 'public'> & {
  public: {
    Tables: AugmentedTables<DatabaseSchema['public']['Tables']>;
    Views: AugmentedViews<DatabaseSchema['public']['Views']>;
    Functions: DatabaseSchema['public']['Functions'];
    Enums: DatabaseSchema['public']['Enums'];
    CompositeTypes: DatabaseSchema['public']['CompositeTypes'];
  };
};

export const supabase = createClient<AugmentedDatabase>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Export types for easier importing
export type Database = AugmentedDatabase;
export type RawDatabase = DatabaseSchema;
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];
