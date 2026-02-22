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
      companies: {
        Row: {
          address: string | null
          country: string | null
          created_at: string | null
          id: string
          name: string
          user_id: string | null
          vat_number: string | null
        }
        Insert: {
          address?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          name: string
          user_id?: string | null
          vat_number?: string | null
        }
        Update: {
          address?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          name?: string
          user_id?: string | null
          vat_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "companies_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      compliance_audit_log: {
        Row: {
          action: string
          actor_id: string
          created_at: string | null
          id: string
          product_id: string | null
          source: string
        }
        Insert: {
          action: string
          actor_id: string
          created_at?: string | null
          id: string
          product_id?: string | null
          source: string
        }
        Update: {
          action?: string
          actor_id?: string
          created_at?: string | null
          id?: string
          product_id?: string | null
          source?: string
        }
        Relationships: []
      }
      compliance_reports: {
        Row: {
          created_at: string | null
          dpp_data: Json | null
          dpp_qr_url: string | null
          empty_space_percent: number | null
          finalized_at: string | null
          id: string
          is_ppwr_compliant: boolean | null
          pdf_url: string | null
          ppwr_compliant: boolean | null
          ppwr_qr_url: string | null
          product_id: string
          qr_payload: string | null
          recommended_box_id: string | null
          report_type: string
          status: string
          updated_at: string | null
          user_id: string | null
          void_space_percent: number | null
        }
        Insert: {
          created_at?: string | null
          dpp_data?: Json | null
          dpp_qr_url?: string | null
          empty_space_percent?: number | null
          finalized_at?: string | null
          id?: string
          is_ppwr_compliant?: boolean | null
          pdf_url?: string | null
          ppwr_compliant?: boolean | null
          ppwr_qr_url?: string | null
          product_id: string
          qr_payload?: string | null
          recommended_box_id?: string | null
          report_type?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
          void_space_percent?: number | null
        }
        Update: {
          created_at?: string | null
          dpp_data?: Json | null
          dpp_qr_url?: string | null
          empty_space_percent?: number | null
          finalized_at?: string | null
          id?: string
          is_ppwr_compliant?: boolean | null
          pdf_url?: string | null
          ppwr_compliant?: boolean | null
          ppwr_qr_url?: string | null
          product_id?: string
          qr_payload?: string | null
          recommended_box_id?: string | null
          report_type?: string
          status?: string
          updated_at?: string | null
          user_id?: string | null
          void_space_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_reports_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compliance_reports_recommended_box_id_fkey"
            columns: ["recommended_box_id"]
            isOneToOne: false
            referencedRelation: "standard_boxes"
            referencedColumns: ["id"]
          },
        ]
      }
      dpp: {
        Row: {
          carbon_calculation_date: string | null
          carbon_calculation_method: string | null
          carbon_material_co2: number | null
          carbon_total_co2: number | null
          carbon_transport_co2: number | null
          created_at: string | null
          destination_country: string | null
          id: string
          product_id: string | null
          report_id: string | null
        }
        Insert: {
          carbon_calculation_date?: string | null
          carbon_calculation_method?: string | null
          carbon_material_co2?: number | null
          carbon_total_co2?: number | null
          carbon_transport_co2?: number | null
          created_at?: string | null
          destination_country?: string | null
          id: string
          product_id?: string | null
          report_id?: string | null
        }
        Update: {
          carbon_calculation_date?: string | null
          carbon_calculation_method?: string | null
          carbon_material_co2?: number | null
          carbon_total_co2?: number | null
          carbon_transport_co2?: number | null
          created_at?: string | null
          destination_country?: string | null
          id?: string
          product_id?: string | null
          report_id?: string | null
        }
        Relationships: []
      }
      epr_quarterly_exports: {
        Row: {
          created_at: string | null
          id: string
          pdf_url: string | null
          period_end: string
          period_start: string
          totals_json: Json
          xlsx_url: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          pdf_url?: string | null
          period_end: string
          period_start: string
          totals_json: Json
          xlsx_url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          pdf_url?: string | null
          period_end?: string
          period_start?: string
          totals_json?: Json
          xlsx_url?: string | null
        }
        Relationships: []
      }
      packaging_boxes: {
        Row: {
          height_cm: number
          id: string
          length_cm: number
          name: string
          width_cm: number
        }
        Insert: {
          height_cm: number
          id: string
          length_cm: number
          name: string
          width_cm: number
        }
        Update: {
          height_cm?: number
          id?: string
          length_cm?: number
          name?: string
          width_cm?: number
        }
        Relationships: []
      }
      packaging_reports: {
        Row: {
          company_id: string | null
          created_at: string | null
          glass_weight: number | null
          id: string
          metal_weight: number | null
          paper_weight: number | null
          plastic_weight: number | null
          report_year: number
          status: string | null
          submitted_at: string | null
          total_weight: number | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          glass_weight?: number | null
          id?: string
          metal_weight?: number | null
          paper_weight?: number | null
          plastic_weight?: number | null
          report_year: number
          status?: string | null
          submitted_at?: string | null
          total_weight?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          glass_weight?: number | null
          id?: string
          metal_weight?: number | null
          paper_weight?: number | null
          plastic_weight?: number | null
          report_year?: number
          status?: string | null
          submitted_at?: string | null
          total_weight?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packaging_reports_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          confirmed_at: string | null
          confirmed_by: string | null
          confirmed_source: string | null
          created_at: string | null
          description: string | null
          external_id: string | null
          height_cm: number | null
          id: string
          image_url: string | null
          length_cm: number | null
          materials: string | null
          merchant_id: string | null
          name: string | null
          pack_height_cm: number | null
          pack_length_cm: number | null
          pack_width_cm: number | null
          packaging_confirmed: boolean | null
          packaging_confirmed_at: string | null
          packaging_material_type: string | null
          packaging_status: string | null
          product_url: string | null
          sku: string | null
          source: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
          weight_g: number | null
          weight_kg: number | null
          width_cm: number | null
        }
        Insert: {
          confirmed_at?: string | null
          confirmed_by?: string | null
          confirmed_source?: string | null
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          height_cm?: number | null
          id?: string
          image_url?: string | null
          length_cm?: number | null
          materials?: string | null
          merchant_id?: string | null
          name?: string | null
          pack_height_cm?: number | null
          pack_length_cm?: number | null
          pack_width_cm?: number | null
          packaging_confirmed?: boolean | null
          packaging_confirmed_at?: string | null
          packaging_material_type?: string | null
          packaging_status?: string | null
          product_url?: string | null
          sku?: string | null
          source?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          weight_g?: number | null
          weight_kg?: number | null
          width_cm?: number | null
        }
        Update: {
          confirmed_at?: string | null
          confirmed_by?: string | null
          confirmed_source?: string | null
          created_at?: string | null
          description?: string | null
          external_id?: string | null
          height_cm?: number | null
          id?: string
          image_url?: string | null
          length_cm?: number | null
          materials?: string | null
          merchant_id?: string | null
          name?: string | null
          pack_height_cm?: number | null
          pack_length_cm?: number | null
          pack_width_cm?: number | null
          packaging_confirmed?: boolean | null
          packaging_confirmed_at?: string | null
          packaging_material_type?: string | null
          packaging_status?: string | null
          product_url?: string | null
          sku?: string | null
          source?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
          weight_g?: number | null
          weight_kg?: number | null
          width_cm?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          language: string | null
          subscription_status: string | null
          subscription_tier: string | null
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          language?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          language?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          carbon_json: Json | null
          created_at: string | null
          dpp_json: Json | null
          finalized_at: string | null
          id: string
          kind: string
          pdf_url: string | null
          ppwr_result_json: Json | null
          product_id: string
          qr_dpp_url: string | null
          qr_ppwr_url: string | null
          status: string
        }
        Insert: {
          carbon_json?: Json | null
          created_at?: string | null
          dpp_json?: Json | null
          finalized_at?: string | null
          id: string
          kind: string
          pdf_url?: string | null
          ppwr_result_json?: Json | null
          product_id: string
          qr_dpp_url?: string | null
          qr_ppwr_url?: string | null
          status: string
        }
        Update: {
          carbon_json?: Json | null
          created_at?: string | null
          dpp_json?: Json | null
          finalized_at?: string | null
          id?: string
          kind?: string
          pdf_url?: string | null
          ppwr_result_json?: Json | null
          product_id?: string
          qr_dpp_url?: string | null
          qr_ppwr_url?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shops: {
        Row: {
          api_key: string | null
          created_at: string | null
          id: string
          merchant_id: string | null
          name: string | null
          status: string | null
        }
        Insert: {
          api_key?: string | null
          created_at?: string | null
          id: string
          merchant_id?: string | null
          name?: string | null
          status?: string | null
        }
        Update: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          merchant_id?: string | null
          name?: string | null
          status?: string | null
        }
        Relationships: []
      }
      standard_boxes: {
        Row: {
          cost_eur: number
          created_at: string | null
          height_cm: number
          id: string
          length_cm: number
          name: string
          volume_cm3: number | null
          width_cm: number
        }
        Insert: {
          cost_eur?: number
          created_at?: string | null
          height_cm: number
          id: string
          length_cm: number
          name: string
          volume_cm3?: number | null
          width_cm: number
        }
        Update: {
          cost_eur?: number
          created_at?: string | null
          height_cm?: number
          id?: string
          length_cm?: number
          name?: string
          volume_cm3?: number | null
          width_cm?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          products_limit: number
          products_used: number | null
          status: string
          tier: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          products_limit?: number
          products_used?: number | null
          status?: string
          tier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          products_limit?: number
          products_used?: number | null
          status?: string
          tier?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      terms_acceptances: {
        Row: {
          accepted_at: string | null
          id: string
          ip_address: string | null
          privacy_version: string
          terms_version: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          id?: string
          ip_address?: string | null
          privacy_version: string
          terms_version: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          id?: string
          ip_address?: string | null
          privacy_version?: string
          terms_version?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          language: string | null
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          language?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          language?: string | null
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_ppwr_compliance: {
        Args: {
          pack_height: number
          pack_length: number
          pack_width: number
          product_height: number
          product_length: number
          product_width: number
        }
        Returns: {
          box_volume_cm3: number
          explanation: string
          is_compliant: boolean
          product_volume_cm3: number
          recommended_box_id: string
          recommended_box_name: string
          void_space_percent: number
        }[]
      }
      generate_compliance_report: {
        Args: { p_product_id: string; p_report_kind?: string }
        Returns: {
          message: string
          ppwr_result: Json
          report_id: string
          status: string
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
    Enums: {},
  },
} as const
