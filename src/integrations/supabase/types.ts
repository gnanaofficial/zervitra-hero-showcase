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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      client_sequences: {
        Row: {
          client_uuid: string
          created_at: string
          current_value: number
          fiscal_year: string | null
          id: string
          sequence_type: string
          updated_at: string
        }
        Insert: {
          client_uuid: string
          created_at?: string
          current_value?: number
          fiscal_year?: string | null
          id?: string
          sequence_type: string
          updated_at?: string
        }
        Update: {
          client_uuid?: string
          created_at?: string
          current_value?: number
          fiscal_year?: string | null
          id?: string
          sequence_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_sequences_client_uuid_fkey"
            columns: ["client_uuid"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          city: string | null
          client_id: string | null
          client_sequence_number: number | null
          company_name: string | null
          contact_email: string | null
          country: string | null
          created_at: string
          id: string
          phone: string | null
          platform_code: string | null
          project_code: string | null
          state: string | null
          updated_at: string
          user_id: string
          year_hex: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          client_id?: string | null
          client_sequence_number?: number | null
          company_name?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          id?: string
          phone?: string | null
          platform_code?: string | null
          project_code?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          year_hex?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          client_id?: string | null
          client_sequence_number?: number | null
          company_name?: string | null
          contact_email?: string | null
          country?: string | null
          created_at?: string
          id?: string
          phone?: string | null
          platform_code?: string | null
          project_code?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          year_hex?: string | null
          zip?: string | null
        }
        Relationships: []
      }
      global_counters: {
        Row: {
          counter_type: string
          created_at: string
          current_value: number
          id: string
          updated_at: string
        }
        Insert: {
          counter_type: string
          created_at?: string
          current_value?: number
          id?: string
          updated_at?: string
        }
        Update: {
          counter_type?: string
          created_at?: string
          current_value?: number
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      id_sequences: {
        Row: {
          client_id: string | null
          created_at: string
          current_value: number
          fiscal_year: string | null
          id: string
          sequence_type: string
          updated_at: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          current_value?: number
          fiscal_year?: string | null
          id?: string
          sequence_type: string
          updated_at?: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          current_value?: number
          fiscal_year?: string | null
          id?: string
          sequence_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          client_id: string
          client_sequence: number | null
          created_at: string
          currency: string | null
          discount_percent: number | null
          due_date: string
          financial_year: string | null
          global_sequence: number | null
          id: string
          invoice_id: string | null
          notes: string | null
          payment_id: string | null
          payment_method: string | null
          project_id: string
          quotation_id: string | null
          services: Json | null
          status: string
          tax: number | null
          tax_percent: number | null
          total: number | null
          updated_at: string
          version: number | null
        }
        Insert: {
          amount: number
          client_id: string
          client_sequence?: number | null
          created_at?: string
          currency?: string | null
          discount_percent?: number | null
          due_date: string
          financial_year?: string | null
          global_sequence?: number | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_id?: string | null
          payment_method?: string | null
          project_id: string
          quotation_id?: string | null
          services?: Json | null
          status?: string
          tax?: number | null
          tax_percent?: number | null
          total?: number | null
          updated_at?: string
          version?: number | null
        }
        Update: {
          amount?: number
          client_id?: string
          client_sequence?: number | null
          created_at?: string
          currency?: string | null
          discount_percent?: number | null
          due_date?: string
          financial_year?: string | null
          global_sequence?: number | null
          id?: string
          invoice_id?: string | null
          notes?: string | null
          payment_id?: string | null
          payment_method?: string | null
          project_id?: string
          quotation_id?: string | null
          services?: Json | null
          status?: string
          tax?: number | null
          tax_percent?: number | null
          total?: number | null
          updated_at?: string
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_quotation_id_fkey"
            columns: ["quotation_id"]
            isOneToOne: false
            referencedRelation: "quotations"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      quotations: {
        Row: {
          amount: number
          client_id: string
          client_sequence: number | null
          created_at: string
          currency: string | null
          discount_percent: number | null
          global_sequence: number | null
          id: string
          notes: string | null
          pdf_url: string | null
          project_id: string
          quotation_id: string | null
          services: Json | null
          status: string
          tax_percent: number | null
          updated_at: string
          valid_until: string | null
          version: number | null
        }
        Insert: {
          amount: number
          client_id: string
          client_sequence?: number | null
          created_at?: string
          currency?: string | null
          discount_percent?: number | null
          global_sequence?: number | null
          id?: string
          notes?: string | null
          pdf_url?: string | null
          project_id: string
          quotation_id?: string | null
          services?: Json | null
          status?: string
          tax_percent?: number | null
          updated_at?: string
          valid_until?: string | null
          version?: number | null
        }
        Update: {
          amount?: number
          client_id?: string
          client_sequence?: number | null
          created_at?: string
          currency?: string | null
          discount_percent?: number | null
          global_sequence?: number | null
          id?: string
          notes?: string | null
          pdf_url?: string | null
          project_id?: string
          quotation_id?: string | null
          services?: Json | null
          status?: string
          tax_percent?: number | null
          updated_at?: string
          valid_until?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          is_super_admin: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_super_admin?: boolean | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_super_admin?: boolean | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_client_id: {
        Args: {
          p_country?: string
          p_platform_code: string
          p_project_code: string
        }
        Returns: {
          client_id: string
          sequence_number: number
          year_hex: string
        }[]
      }
      generate_invoice_id: {
        Args: {
          p_client_id: string
          p_client_uuid: string
          p_date?: string
          p_version?: number
        }
        Returns: {
          client_sequence: number
          financial_year: string
          global_sequence: number
          invoice_id: string
        }[]
      }
      generate_quotation_id: {
        Args: { p_client_id: string; p_client_uuid: string; p_version?: number }
        Returns: {
          client_sequence: number
          global_sequence: number
          quotation_id: string
        }[]
      }
      get_fiscal_year: { Args: { input_date?: string }; Returns: string }
      get_hex_month: { Args: { month_num: number }; Returns: string }
      get_next_client_sequence: {
        Args: {
          p_client_uuid: string
          p_fiscal_year?: string
          p_sequence_type: string
        }
        Returns: number
      }
      get_next_global_counter: {
        Args: { p_counter_type: string }
        Returns: number
      }
      get_next_sequence_value: {
        Args: {
          p_client_id?: string
          p_fiscal_year?: string
          p_sequence_type: string
        }
        Returns: number
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_valid_admin_email: { Args: { email: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
