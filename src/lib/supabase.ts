import { createClient } from "@supabase/supabase-js";

type ExerciseTotalsRow = {
  user_id: string;
  flexoes: number;
  polichinelos: number;
  abdominais: number;
  updated_at: string;
};

type Database = {
  public: {
    Tables: {
      exercise_totals: {
        Row: ExerciseTotalsRow;
        Insert: {
          user_id: string;
          flexoes?: number;
          polichinelos?: number;
          abdominais?: number;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          flexoes?: number;
          polichinelos?: number;
          abdominais?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabasePublishableKey,
);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl, supabasePublishableKey)
  : null;
