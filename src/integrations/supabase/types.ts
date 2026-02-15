export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          applicant_id: string
          created_at: string | null
          id: string
          links: Json | null
          message: string
          open_call_id: string
          status: Database["public"]["Enums"]["application_status"]
          updated_at: string | null
        }
        Insert: {
          applicant_id: string
          created_at?: string | null
          id?: string
          links?: Json | null
          message: string
          open_call_id: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
        }
        Update: {
          applicant_id?: string
          created_at?: string | null
          id?: string
          links?: Json | null
          message?: string
          open_call_id?: string
          status?: Database["public"]["Enums"]["application_status"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_open_call_id_fkey"
            columns: ["open_call_id"]
            isOneToOne: false
            referencedRelation: "open_calls"
            referencedColumns: ["id"]
          },
        ]
      }
      checkins: {
        Row: {
          blocker: string | null
          created_at: string | null
          deliverable_link: string | null
          help_request: string | null
          id: string
          main_metric_name: string | null
          main_metric_value: string | null
          project_id: string
          user_id: string
          week_start: string
        }
        Insert: {
          blocker?: string | null
          created_at?: string | null
          deliverable_link?: string | null
          help_request?: string | null
          id?: string
          main_metric_name?: string | null
          main_metric_value?: string | null
          project_id: string
          user_id: string
          week_start: string
        }
        Update: {
          blocker?: string | null
          created_at?: string | null
          deliverable_link?: string | null
          help_request?: string | null
          id?: string
          main_metric_name?: string | null
          main_metric_value?: string | null
          project_id?: string
          user_id?: string
          week_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "checkins_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      needs_catalog: {
        Row: {
          category: Database["public"]["Enums"]["need_category"]
          description: string | null
          id: string
          is_active: boolean | null
          stage_key: Database["public"]["Enums"]["stage_key"] | null
          title: string
        }
        Insert: {
          category: Database["public"]["Enums"]["need_category"]
          description?: string | null
          id?: string
          is_active?: boolean | null
          stage_key?: Database["public"]["Enums"]["stage_key"] | null
          title: string
        }
        Update: {
          category?: Database["public"]["Enums"]["need_category"]
          description?: string | null
          id?: string
          is_active?: boolean | null
          stage_key?: Database["public"]["Enums"]["stage_key"] | null
          title?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          payload: Json
          read_at: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          payload?: Json
          read_at?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          payload?: Json
          read_at?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      open_calls: {
        Row: {
          apply_until: string | null
          call_type: Database["public"]["Enums"]["call_type"]
          commitment: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          location_mode: Database["public"]["Enums"]["location_mode"]
          project_id: string
          status: Database["public"]["Enums"]["call_status"]
          tags: string[] | null
          title: string
          updated_at: string | null
          visibility: Database["public"]["Enums"]["project_visibility"]
        }
        Insert: {
          apply_until?: string | null
          call_type?: Database["public"]["Enums"]["call_type"]
          commitment?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          location_mode?: Database["public"]["Enums"]["location_mode"]
          project_id: string
          status?: Database["public"]["Enums"]["call_status"]
          tags?: string[] | null
          title: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["project_visibility"]
        }
        Update: {
          apply_until?: string | null
          call_type?: Database["public"]["Enums"]["call_type"]
          commitment?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          location_mode?: Database["public"]["Enums"]["location_mode"]
          project_id?: string
          status?: Database["public"]["Enums"]["call_status"]
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["project_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "open_calls_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          availability_hours: number | null
          bio: string | null
          created_at: string | null
          display_name: string
          id: string
          skills_tags: string[] | null
          trust_level: number | null
          updated_at: string | null
        }
        Insert: {
          availability_hours?: number | null
          bio?: string | null
          created_at?: string | null
          display_name: string
          id: string
          skills_tags?: string[] | null
          trust_level?: number | null
          updated_at?: string | null
        }
        Update: {
          availability_hours?: number | null
          bio?: string | null
          created_at?: string | null
          display_name?: string
          id?: string
          skills_tags?: string[] | null
          trust_level?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_members: {
        Row: {
          created_at: string | null
          project_id: string
          role: Database["public"]["Enums"]["membership_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          project_id: string
          role?: Database["public"]["Enums"]["membership_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          project_id?: string
          role?: Database["public"]["Enums"]["membership_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_needs: {
        Row: {
          created_at: string | null
          need_id: string
          project_id: string
        }
        Insert: {
          created_at?: string | null
          need_id: string
          project_id: string
        }
        Update: {
          created_at?: string | null
          need_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_needs_need_id_fkey"
            columns: ["need_id"]
            isOneToOne: false
            referencedRelation: "needs_catalog"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_needs_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          cover_image_url: string | null
          created_at: string | null
          current_stage: Database["public"]["Enums"]["stage_key"]
          description: string | null
          id: string
          owner_id: string
          slug: string | null
          stage_updated_at: string | null
          summary: string | null
          tags: string[] | null
          title: string
          type: Database["public"]["Enums"]["project_type"]
          updated_at: string | null
          visibility: Database["public"]["Enums"]["project_visibility"]
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string | null
          current_stage?: Database["public"]["Enums"]["stage_key"]
          description?: string | null
          id?: string
          owner_id: string
          slug?: string | null
          stage_updated_at?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          type?: Database["public"]["Enums"]["project_type"]
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["project_visibility"]
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string | null
          current_stage?: Database["public"]["Enums"]["stage_key"]
          description?: string | null
          id?: string
          owner_id?: string
          slug?: string | null
          stage_updated_at?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["project_type"]
          updated_at?: string | null
          visibility?: Database["public"]["Enums"]["project_visibility"]
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          id: string
          reason: string
          reporter_id: string
          status: string
          target_id: string
          target_type: Database["public"]["Enums"]["report_target_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason: string
          reporter_id: string
          status?: string
          target_id: string
          target_type: Database["public"]["Enums"]["report_target_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          status?: string
          target_id?: string
          target_type?: Database["public"]["Enums"]["report_target_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      stage_checklists: {
        Row: {
          items: Json
          stage_key: Database["public"]["Enums"]["stage_key"]
        }
        Insert: {
          items: Json
          stage_key: Database["public"]["Enums"]["stage_key"]
        }
        Update: {
          items?: Json
          stage_key?: Database["public"]["Enums"]["stage_key"]
        }
        Relationships: [
          {
            foreignKeyName: "stage_checklists_stage_key_fkey"
            columns: ["stage_key"]
            isOneToOne: true
            referencedRelation: "stages"
            referencedColumns: ["key"]
          },
        ]
      }
      stages: {
        Row: {
          description: string | null
          key: Database["public"]["Enums"]["stage_key"]
          title: string
        }
        Insert: {
          description?: string | null
          key: Database["public"]["Enums"]["stage_key"]
          title: string
        }
        Update: {
          description?: string | null
          key?: Database["public"]["Enums"]["stage_key"]
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      profiles_public: {
        Row: {
          availability_hours: number | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          skills_tags: string[] | null
          trust_level: number | null
        }
        Insert: {
          availability_hours?: number | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          skills_tags?: string[] | null
          trust_level?: number | null
        }
        Update: {
          availability_hours?: number | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          skills_tags?: string[] | null
          trust_level?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          p_role: Database["public"]["Enums"]["user_role"]
          p_user: string
        }
        Returns: boolean
      }
      is_admin_or_mod: { Args: { p_user: string }; Returns: boolean }
      is_project_member: {
        Args: { p_project_id: string; p_user_id: string }
        Returns: boolean
      }
      is_project_owner: {
        Args: { p_project_id: string; p_user_id: string }
        Returns: boolean
      }
      is_project_team: {
        Args: { p_project_id: string; p_user_id: string }
        Returns: boolean
      }
      is_verified_user: { Args: { p_user: string }; Returns: boolean }
    }
    Enums: {
      application_status:
        | "submitted"
        | "shortlisted"
        | "accepted"
        | "rejected"
        | "withdrawn"
      call_status: "open" | "paused" | "closed"
      call_type: "core" | "volunteer" | "short_task" | "advisor"
      location_mode: "remote" | "onsite" | "hybrid"
      membership_role: "owner" | "core" | "volunteer" | "editor" | "moderator"
      need_category:
        | "mentorluk"
        | "data"
        | "networking"
        | "operasyon"
        | "icerik"
        | "teknik"
        | "hukuk"
        | "moderasyon"
      project_type:
        | "content"
        | "app"
        | "community"
        | "open_source"
        | "education"
        | "media"
        | "other"
      project_visibility: "public" | "verified_only" | "private"
      report_target_type:
        | "project"
        | "open_call"
        | "application"
        | "profile"
        | "message"
      stage_key:
        | "niyet_istikamet"
        | "taslak_cerceve"
        | "ilk_yayin"
        | "kullaniciya_acilim"
        | "istikrar_sureklilik"
        | "yayinginlastirma"
        | "arsiv_kurumsallasma"
      user_role: "member" | "mentor" | "moderator" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "submitted",
        "shortlisted",
        "accepted",
        "rejected",
        "withdrawn",
      ],
      call_status: ["open", "paused", "closed"],
      call_type: ["core", "volunteer", "short_task", "advisor"],
      location_mode: ["remote", "onsite", "hybrid"],
      membership_role: ["owner", "core", "volunteer", "editor", "moderator"],
      need_category: [
        "mentorluk",
        "data",
        "networking",
        "operasyon",
        "icerik",
        "teknik",
        "hukuk",
        "moderasyon",
      ],
      project_type: [
        "content",
        "app",
        "community",
        "open_source",
        "education",
        "media",
        "other",
      ],
      project_visibility: ["public", "verified_only", "private"],
      report_target_type: [
        "project",
        "open_call",
        "application",
        "profile",
        "message",
      ],
      stage_key: [
        "niyet_istikamet",
        "taslak_cerceve",
        "ilk_yayin",
        "kullaniciya_acilim",
        "istikrar_sureklilik",
        "yayinginlastirma",
        "arsiv_kurumsallasma",
      ],
      user_role: ["member", "mentor", "moderator", "admin"],
    },
  },
} as const
