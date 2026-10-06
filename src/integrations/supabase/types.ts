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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      custom_recipes: {
        Row: {
          cook_time: string
          created_at: string
          description: string | null
          dietary_tags: Json | null
          difficulty: string | null
          id: string
          ingredient_amounts: Json | null
          ingredients: Json
          instructions: Json
          meal_type: string
          nutrition: Json | null
          servings: number
          source_url: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cook_time?: string
          created_at?: string
          description?: string | null
          dietary_tags?: Json | null
          difficulty?: string | null
          id?: string
          ingredient_amounts?: Json | null
          ingredients?: Json
          instructions?: Json
          meal_type?: string
          nutrition?: Json | null
          servings?: number
          source_url?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cook_time?: string
          created_at?: string
          description?: string | null
          dietary_tags?: Json | null
          difficulty?: string | null
          id?: string
          ingredient_amounts?: Json | null
          ingredients?: Json
          instructions?: Json
          meal_type?: string
          nutrition?: Json | null
          servings?: number
          source_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      meal_plans: {
        Row: {
          created_at: string
          date: string
          id: string
          recipe_data: Json
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          recipe_data: Json
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          recipe_data?: Json
          recipe_id?: string
          user_id?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recipe_notes: {
        Row: {
          created_at: string
          id: string
          notes: string
          recipe_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string
          recipe_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string
          recipe_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recipe_overrides: {
        Row: {
          created_at: string
          id: string
          recipe_id: string
          servings: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipe_id: string
          servings?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recipe_id?: string
          servings?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_drinks: {
        Row: {
          created_at: string
          drink_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          drink_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          drink_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_recipes: {
        Row: {
          created_at: string
          id: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: []
      }
      shopping_list: {
        Row: {
          checked: boolean
          created_at: string
          id: string
          ingredient_id: string
          user_id: string
          variant: string
        }
        Insert: {
          checked?: boolean
          created_at?: string
          id?: string
          ingredient_id: string
          user_id: string
          variant: string
        }
        Update: {
          checked?: boolean
          created_at?: string
          id?: string
          ingredient_id?: string
          user_id?: string
          variant?: string
        }
        Relationships: []
      }
      user_pantry: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          default_servings: number | null
          dietary_preferences: Json | null
          id: string
          meal_times: Json | null
          skill_level: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_servings?: number | null
          dietary_preferences?: Json | null
          id?: string
          meal_times?: Json | null
          skill_level?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_servings?: number | null
          dietary_preferences?: Json | null
          id?: string
          meal_times?: Json | null
          skill_level?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_recipe_save_counts: {
        Args: never
        Returns: {
          recipe_id: string
          save_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
