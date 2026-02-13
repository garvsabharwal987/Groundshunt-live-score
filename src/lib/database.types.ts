export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MatchStatus = 'upcoming' | 'live' | 'completed' | 'cancelled' | 'postponed';
export type UserRole = 'admin' | 'moderator' | 'viewer';

export interface Database {
  public: {
    Tables: {
      sports: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          scoring_format: Json;
          points_config: Json;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          scoring_format?: Json;
          points_config?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string | null;
          scoring_format?: Json;
          points_config?: Json;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      teams: {
        Row: {
          id: string;
          name: string;
          short_name: string;
          logo_url: string | null;
          sport_id: string;
          color_primary: string;
          color_secondary: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          short_name: string;
          logo_url?: string | null;
          sport_id: string;
          color_primary?: string;
          color_secondary?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          short_name?: string;
          logo_url?: string | null;
          sport_id?: string;
          color_primary?: string;
          color_secondary?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      venues: {
        Row: {
          id: string;
          name: string;
          short_name: string | null;
          location: string | null;
          capacity: number | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          short_name?: string | null;
          location?: string | null;
          capacity?: number | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          short_name?: string | null;
          location?: string | null;
          capacity?: number | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
      fixtures: {
        Row: {
          id: string;
          sport_id: string;
          team_a_id: string;
          team_b_id: string;
          venue_id: string | null;
          match_date: string;
          match_time: string;
          status: MatchStatus;
          round: string | null;
          match_number: number | null;
          winner_id: string | null;
          is_draw: boolean;
          summary: string | null;
          enable_live_scoring: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sport_id: string;
          team_a_id: string;
          team_b_id: string;
          venue_id?: string | null;
          match_date: string;
          match_time: string;
          status?: MatchStatus;
          round?: string | null;
          match_number?: number | null;
          winner_id?: string | null;
          is_draw?: boolean;
          summary?: string | null;
          enable_live_scoring?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sport_id?: string;
          team_a_id?: string;
          team_b_id?: string;
          venue_id?: string | null;
          match_date?: string;
          match_time?: string;
          status?: MatchStatus;
          round?: string | null;
          match_number?: number | null;
          winner_id?: string | null;
          is_draw?: boolean;
          summary?: string | null;
          enable_live_scoring?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      live_scores: {
        Row: {
          id: string;
          fixture_id: string;
          team_a_score: Json;
          team_b_score: Json;
          current_period: string | null;
          elapsed_time: string | null;
          match_info: Json;
          last_event: string | null;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          fixture_id: string;
          team_a_score?: Json;
          team_b_score?: Json;
          current_period?: string | null;
          elapsed_time?: string | null;
          match_info?: Json;
          last_event?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          fixture_id?: string;
          team_a_score?: Json;
          team_b_score?: Json;
          current_period?: string | null;
          elapsed_time?: string | null;
          match_info?: Json;
          last_event?: string | null;
          updated_at?: string;
          updated_by?: string | null;
        };
      };
      points_table: {
        Row: {
          id: string;
          sport_id: string;
          team_id: string;
          played: number;
          won: number;
          lost: number;
          drawn: number;
          tied: number;
          points: number;
          stats: Json;
          net_rating: number;
          group_name: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sport_id: string;
          team_id: string;
          played?: number;
          won?: number;
          lost?: number;
          drawn?: number;
          tied?: number;
          points?: number;
          stats?: Json;
          net_rating?: number;
          group_name?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sport_id?: string;
          team_id?: string;
          played?: number;
          won?: number;
          lost?: number;
          drawn?: number;
          tied?: number;
          points?: number;
          stats?: Json;
          net_rating?: number;
          group_name?: string | null;
          updated_at?: string;
        };
      };
      news_of_the_day: {
        Row: {
          id: string;
          title: string;
          content: string;
          summary: string | null;
          highlights: Json;
          notable_performances: Json;
          featured_image_url: string | null;
          publish_date: string;
          is_published: boolean;
          published_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          summary?: string | null;
          highlights?: Json;
          notable_performances?: Json;
          featured_image_url?: string | null;
          publish_date: string;
          is_published?: boolean;
          published_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          summary?: string | null;
          highlights?: Json;
          notable_performances?: Json;
          featured_image_url?: string | null;
          publish_date?: string;
          is_published?: boolean;
          published_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: UserRole;
          avatar_url: string | null;
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          user_email: string | null;
          action: string;
          entity_type: string;
          entity_id: string | null;
          old_data: Json;
          new_data: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          user_email?: string | null;
          action: string;
          entity_type: string;
          entity_id?: string | null;
          old_data?: Json;
          new_data?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          user_email?: string | null;
          action?: string;
          entity_type?: string;
          entity_id?: string | null;
          old_data?: Json;
          new_data?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          message: string;
          type: string;
          is_active: boolean;
          starts_at: string;
          ends_at: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          message: string;
          type?: string;
          is_active?: boolean;
          starts_at?: string;
          ends_at?: string | null;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          message?: string;
          type?: string;
          is_active?: boolean;
          starts_at?: string;
          ends_at?: string | null;
          created_by?: string | null;
          created_at?: string;
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
      match_status: MatchStatus;
      user_role: UserRole;
    };
  };
}

// Convenience types
export type Sport = Database['public']['Tables']['sports']['Row'];
export type Team = Database['public']['Tables']['teams']['Row'];
export type Venue = Database['public']['Tables']['venues']['Row'];
export type Fixture = Database['public']['Tables']['fixtures']['Row'];
export type LiveScore = Database['public']['Tables']['live_scores']['Row'];
export type PointsTableEntry = Database['public']['Tables']['points_table']['Row'];
export type NewsOfTheDay = Database['public']['Tables']['news_of_the_day']['Row'];
export type User = Database['public']['Tables']['users']['Row'];
export type AuditLog = Database['public']['Tables']['audit_logs']['Row'];
export type Announcement = Database['public']['Tables']['announcements']['Row'];

// Extended types with relations
export interface FixtureWithDetails extends Fixture {
  sport: Sport;
  team_a: Team;
  team_b: Team;
  venue: Venue | null;
  live_score?: LiveScore;
  winner?: Team | null;
}

export interface PointsTableWithTeam extends PointsTableEntry {
  team: Team;
  sport: Sport;
}

// Score types for different sports
export interface TableTennisScore {
  set1: number;
  set2: number;
  set3?: number;
  sets_won: number;
  current_set?: number;
}

export interface FootballScore {
  goals: number;
  shots?: number;
  possession?: number;
  fouls?: number;
  yellow_cards?: number;
  red_cards?: number;
}

export interface BasketballScore {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  ot?: number;
  total: number;
}

export interface SetBasedScore {
  set1: number;
  set2: number;
  set3?: number;
  set4?: number;
  set5?: number;
  sets_won: number;
  current_set?: number;
}

export type SportScore = TableTennisScore | FootballScore | BasketballScore | SetBasedScore;
