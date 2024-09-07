export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      action: {
        Row: {
          content: string | null
          content_prompt: string | null
          created_at: string | null
          id: string
          rule_id: string
          type: Database["public"]["Enums"]["action_type"]
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          content_prompt?: string | null
          created_at?: string | null
          id?: string
          rule_id: string
          type: Database["public"]["Enums"]["action_type"]
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          content_prompt?: string | null
          created_at?: string | null
          id?: string
          rule_id?: string
          type?: Database["public"]["Enums"]["action_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_rule"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "rule"
            referencedColumns: ["id"]
          },
        ]
      }
      author: {
        Row: {
          created_at: string | null
          display_name: string
          id: string
          status: Database["public"]["Enums"]["author_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_name: string
          id?: string
          status?: Database["public"]["Enums"]["author_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string
          id?: string
          status?: Database["public"]["Enums"]["author_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_comment_pagination: {
        Row: {
          channel_id: string
          last_fetched_timestamp: string | null
          next_page_token: string | null
          no_more_comments: boolean | null
        }
        Insert: {
          channel_id: string
          last_fetched_timestamp?: string | null
          next_page_token?: string | null
          no_more_comments?: boolean | null
        }
        Update: {
          channel_id?: string
          last_fetched_timestamp?: string | null
          next_page_token?: string | null
          no_more_comments?: boolean | null
        }
        Relationships: []
      }
      executed_action: {
        Row: {
          content: string | null
          created_at: string | null
          executed_rule_id: string
          id: string
          type: Database["public"]["Enums"]["action_type"]
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          executed_rule_id: string
          id?: string
          type: Database["public"]["Enums"]["action_type"]
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          executed_rule_id?: string
          id?: string
          type?: Database["public"]["Enums"]["action_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_executed_rule"
            columns: ["executed_rule_id"]
            isOneToOne: false
            referencedRelation: "executed_rule"
            referencedColumns: ["id"]
          },
        ]
      }
      executed_rule: {
        Row: {
          automated: boolean
          comment_id: string
          created_at: string | null
          id: string
          reason: string | null
          rule_id: string | null
          status: Database["public"]["Enums"]["executed_rule_status"] | null
          updated_at: string | null
          user_id: string
          video_id: string
        }
        Insert: {
          automated: boolean
          comment_id: string
          created_at?: string | null
          id?: string
          reason?: string | null
          rule_id?: string | null
          status?: Database["public"]["Enums"]["executed_rule_status"] | null
          updated_at?: string | null
          user_id: string
          video_id: string
        }
        Update: {
          automated?: boolean
          comment_id?: string
          created_at?: string | null
          id?: string
          reason?: string | null
          rule_id?: string | null
          status?: Database["public"]["Enums"]["executed_rule_status"] | null
          updated_at?: string | null
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_rule"
            columns: ["rule_id"]
            isOneToOne: false
            referencedRelation: "rule"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      premium: {
        Row: {
          ai_automation_access:
            | Database["public"]["Enums"]["feature_access"]
            | null
          ai_credits: number | null
          ai_month: number | null
          approve_or_ban_credits: number | null
          approve_or_ban_month: number | null
          bulk_approve_or_ban_access:
            | Database["public"]["Enums"]["feature_access"]
            | null
          created_at: string | null
          id: string
          lemon_license_instance_id: string | null
          lemon_license_key: string | null
          lemon_squeezy_customer_id: number | null
          lemon_squeezy_order_id: number | null
          lemon_squeezy_product_id: number | null
          lemon_squeezy_renews_at: string | null
          lemon_squeezy_subscription_id: number | null
          lemon_squeezy_subscription_item_id: number | null
          lemon_squeezy_variant_id: number | null
          tier: Database["public"]["Enums"]["premium_tier"] | null
          updated_at: string | null
        }
        Insert: {
          ai_automation_access?:
            | Database["public"]["Enums"]["feature_access"]
            | null
          ai_credits?: number | null
          ai_month?: number | null
          approve_or_ban_credits?: number | null
          approve_or_ban_month?: number | null
          bulk_approve_or_ban_access?:
            | Database["public"]["Enums"]["feature_access"]
            | null
          created_at?: string | null
          id?: string
          lemon_license_instance_id?: string | null
          lemon_license_key?: string | null
          lemon_squeezy_customer_id?: number | null
          lemon_squeezy_order_id?: number | null
          lemon_squeezy_product_id?: number | null
          lemon_squeezy_renews_at?: string | null
          lemon_squeezy_subscription_id?: number | null
          lemon_squeezy_subscription_item_id?: number | null
          lemon_squeezy_variant_id?: number | null
          tier?: Database["public"]["Enums"]["premium_tier"] | null
          updated_at?: string | null
        }
        Update: {
          ai_automation_access?:
            | Database["public"]["Enums"]["feature_access"]
            | null
          ai_credits?: number | null
          ai_month?: number | null
          approve_or_ban_credits?: number | null
          approve_or_ban_month?: number | null
          bulk_approve_or_ban_access?:
            | Database["public"]["Enums"]["feature_access"]
            | null
          created_at?: string | null
          id?: string
          lemon_license_instance_id?: string | null
          lemon_license_key?: string | null
          lemon_squeezy_customer_id?: number | null
          lemon_squeezy_order_id?: number | null
          lemon_squeezy_product_id?: number | null
          lemon_squeezy_renews_at?: string | null
          lemon_squeezy_subscription_id?: number | null
          lemon_squeezy_subscription_item_id?: number | null
          lemon_squeezy_variant_id?: number | null
          tier?: Database["public"]["Enums"]["premium_tier"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      prompt_history: {
        Row: {
          created_at: string | null
          id: string
          prompt: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          prompt: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          prompt?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      rule: {
        Row: {
          automate: boolean | null
          created_at: string | null
          id: string
          instructions: string
          name: string
          type: Database["public"]["Enums"]["rule_type"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          automate?: boolean | null
          created_at?: string | null
          id?: string
          instructions: string
          name: string
          type?: Database["public"]["Enums"]["rule_type"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          automate?: boolean | null
          created_at?: string | null
          id?: string
          instructions?: string
          name?: string
          type?: Database["public"]["Enums"]["rule_type"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          access_token: string | null
          ai_api_key: string | null
          ai_model: string | null
          ai_provider: string | null
          avatar_url: string
          behavior_profile: Json | null
          completed_onboarding: boolean | null
          created_at: string | null
          email: string
          id: string
          last_login: string | null
          name: string | null
          onboarding_answers: Json | null
          premium_admin_id: string | null
          premium_id: string | null
          prompt: string | null
          refresh_token: string | null
          type: string | null
        }
        Insert: {
          access_token?: string | null
          ai_api_key?: string | null
          ai_model?: string | null
          ai_provider?: string | null
          avatar_url: string
          behavior_profile?: Json | null
          completed_onboarding?: boolean | null
          created_at?: string | null
          email: string
          id: string
          last_login?: string | null
          name?: string | null
          onboarding_answers?: Json | null
          premium_admin_id?: string | null
          premium_id?: string | null
          prompt?: string | null
          refresh_token?: string | null
          type?: string | null
        }
        Update: {
          access_token?: string | null
          ai_api_key?: string | null
          ai_model?: string | null
          ai_provider?: string | null
          avatar_url?: string
          behavior_profile?: Json | null
          completed_onboarding?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          last_login?: string | null
          name?: string | null
          onboarding_answers?: Json | null
          premium_admin_id?: string | null
          premium_id?: string | null
          prompt?: string | null
          refresh_token?: string | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_premium_admin_id_fkey"
            columns: ["premium_admin_id"]
            isOneToOne: false
            referencedRelation: "premium"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_premium_id_fkey"
            columns: ["premium_id"]
            isOneToOne: false
            referencedRelation: "premium"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      author_status_summary: {
        Row: {
          display_name: string | null
          status: Database["public"]["Enums"]["author_status"] | null
          status_count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      insert_rule_with_actions: {
        Args: {
          rule_type: Database["public"]["Enums"]["rule_type"]
          rule_name: string
          rule_instructions: string
          rule_automate: boolean
          user_id: string
          actions_data: Json
        }
        Returns: {
          rule_id: string
        }[]
      }
      update_rule_and_actions: {
        Args: {
          _rule_id: string
          _user_id: string
          _name: string
          _instructions: string
          _automate: boolean
          _type: Database["public"]["Enums"]["rule_type"]
          _actions: Json
        }
        Returns: undefined
      }
    }
    Enums: {
      action_type:
        | "REPLY"
        | "PUBLISH"
        | "REJECT"
        | "REVIEW"
        | "MARK_SPAM"
        | "DELETE"
      author_status: "APPROVED" | "BANNED"
      executed_rule_status: "APPLIED" | "REJECTED" | "PENDING" | "SKIPPED"
      feature_access: "UNLOCKED" | "UNLOCKED_WITH_API_KEY" | "LOCKED"
      premium_tier:
        | "BASIC_MONTHLY"
        | "BASIC_ANNUALLY"
        | "PRO_MONTHLY"
        | "PRO_ANNUALLY"
        | "BUSINESS_MONTHLY"
        | "BUSINESS_ANNUALLY"
        | "COPILOT_MONTHLY"
        | "LIFETIME"
      rule_type: "AI" | "STATIC"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
