export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  branding: {
    Tables: {
      asset_categories: {
        Row: {
          active: boolean
          asset_kind: string
          created_at: string
          description: string | null
          id: string
          key: string
          label: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          asset_kind?: string
          created_at?: string
          description?: string | null
          id?: string
          key: string
          label: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          asset_kind?: string
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          label?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [],
      }
      asset_slots: {
        Row: {
          active: boolean
          allowed_mime_types: string[]
          category_id: string
          created_at: string
          entity_type: string
          help_text: string | null
          id: string
          is_required: boolean
          label_override: string | null
          max_assets: number
          sort_order: number
          subcategory_id: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          allowed_mime_types?: string[]
          category_id: string
          created_at?: string
          entity_type: string
          help_text?: string | null
          id?: string
          is_required?: boolean
          label_override?: string | null
          max_assets?: number
          sort_order?: number
          subcategory_id?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          allowed_mime_types?: string[]
          category_id?: string
          created_at?: string
          entity_type?: string
          help_text?: string | null
          id?: string
          is_required?: boolean
          label_override?: string | null
          max_assets?: number
          sort_order?: number
          subcategory_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_slots_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "asset_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asset_slots_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "asset_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      asset_subcategories: {
        Row: {
          active: boolean
          category_id: string
          created_at: string
          description: string | null
          id: string
          key: string
          label: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          category_id: string
          created_at?: string
          description?: string | null
          id?: string
          key: string
          label: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          category_id?: string
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          label?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "asset_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "asset_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          bucket: string
          category_id: string
          created_at: string
          description: string | null
          entity_id: string
          height_px: number | null
          id: string
          is_retired: boolean
          mime_type: string | null
          name: string
          path: string
          size_bytes: number | null
          subcategory_id: string | null
          updated_at: string
          width_px: number | null
        }
        Insert: {
          bucket?: string
          category_id: string
          created_at?: string
          description?: string | null
          entity_id: string
          height_px?: number | null
          id?: string
          is_retired?: boolean
          mime_type?: string | null
          name: string
          path: string
          size_bytes?: number | null
          subcategory_id?: string | null
          updated_at?: string
          width_px?: number | null
        }
        Update: {
          bucket?: string
          category_id?: string
          created_at?: string
          description?: string | null
          entity_id?: string
          height_px?: number | null
          id?: string
          is_retired?: boolean
          mime_type?: string | null
          name?: string
          path?: string
          size_bytes?: number | null
          subcategory_id?: string | null
          updated_at?: string
          width_px?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "asset_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "asset_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      palette_colors: {
        Row: {
          created_at: string
          hex: string
          id: string
          label: string | null
          palette_id: string
          slot: number
          updated_at: string
          usage_notes: string | null
        }
        Insert: {
          created_at?: string
          hex: string
          id?: string
          label?: string | null
          palette_id: string
          slot: number
          updated_at?: string
          usage_notes?: string | null
        }
        Update: {
          created_at?: string
          hex?: string
          id?: string
          label?: string | null
          palette_id?: string
          slot?: number
          updated_at?: string
          usage_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "palette_colors_palette_fk"
            columns: ["palette_id"]
            isOneToOne: false
            referencedRelation: "palettes"
            referencedColumns: ["id"]
          },
        ]
      }
      palettes: {
        Row: {
          created_at: string
          entity_id: string
          id: string
          name: string
          role: Database["branding"]["Enums"]["color_role"]
          updated_at: string
          usage_notes: string | null
        }
        Insert: {
          created_at?: string
          entity_id: string
          id?: string
          name: string
          role: Database["branding"]["Enums"]["color_role"]
          updated_at?: string
          usage_notes?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string
          id?: string
          name?: string
          role?: Database["branding"]["Enums"]["color_role"]
          updated_at?: string
          usage_notes?: string | null
        }
        Relationships: []
      }
      patterns: {
        Row: {
          allowed_colors: string[] | null
          created_at: string | null
          entity_id: string
          file_png: string | null
          file_svg: string | null
          id: string
          notes: string | null
          pattern_type: Database["branding"]["Enums"]["pattern_type"]
          updated_at: string | null
        }
        Insert: {
          allowed_colors?: string[] | null
          created_at?: string | null
          entity_id: string
          file_png?: string | null
          file_svg?: string | null
          id?: string
          notes?: string | null
          pattern_type: Database["branding"]["Enums"]["pattern_type"]
          updated_at?: string | null
        }
        Update: {
          allowed_colors?: string[] | null
          created_at?: string | null
          entity_id?: string
          file_png?: string | null
          file_svg?: string | null
          id?: string
          notes?: string | null
          pattern_type?: Database["branding"]["Enums"]["pattern_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      typography: {
        Row: {
          availability: string | null
          created_at: string | null
          download_url: string | null
          entity_id: string
          font_name: string
          id: string
          role: Database["branding"]["Enums"]["typography_role"]
          updated_at: string | null
          usage_rules: string | null
          weights: Json | null
        }
        Insert: {
          availability?: string | null
          created_at?: string | null
          download_url?: string | null
          entity_id: string
          font_name: string
          id?: string
          role?: Database["branding"]["Enums"]["typography_role"]
          updated_at?: string | null
          usage_rules?: string | null
          weights?: Json | null
        }
        Update: {
          availability?: string | null
          created_at?: string | null
          download_url?: string | null
          entity_id?: string
          font_name?: string
          id?: string
          role?: Database["branding"]["Enums"]["typography_role"]
          updated_at?: string | null
          usage_rules?: string | null
          weights?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      color_role: "primary" | "secondary" | "accent"
      logo_category:
        | "full_color"
        | "stacked"
        | "horizontal"
        | "one_color_white"
        | "one_color_black"
        | "one_color_red"
        | "inverse"
        | "pattern_small"
        | "pattern_large"
        | "other"
      logo_subcategory:
        | "district_primary"
        | "district_secondary"
        | "icon"
        | "school_logo"
        | "community_ed"
        | "athletics_primary"
        | "athletics_icon"
        | "athletics_wordmark"
        | "script_wordmark"
        | "wings_up"
        | "team_logo"
        | "brand_pattern"
        | "retired"
        | "primary_logo"
        | "secondary_logo"
        | "wordmark"
        | "seal"
        | "co_brand"
        | "event"
        | "program"
      pattern_type: "none" | "dots" | "stripes" | "grid" | "chevrons" | "waves"
      typography_role:
        | "header1"
        | "header2"
        | "subheader"
        | "body"
        | "logo"
        | "display"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  business: {
    Tables: {
      business_close_periods: {
        Row: {
          closed_at: string | null
          created_at: string
          entity_id: string
          id: string
          locked_at: string | null
          notes: string | null
          opened_at: string
          owner_user_id: string | null
          period_end: string
          period_label: string
          period_start: string
          status: string
          updated_at: string
        }
        Insert: {
          closed_at?: string | null
          created_at?: string
          entity_id: string
          id?: string
          locked_at?: string | null
          notes?: string | null
          opened_at?: string
          owner_user_id?: string | null
          period_end: string
          period_label: string
          period_start: string
          status?: string
          updated_at?: string
        }
        Update: {
          closed_at?: string | null
          created_at?: string
          entity_id?: string
          id?: string
          locked_at?: string | null
          notes?: string | null
          opened_at?: string
          owner_user_id?: string | null
          period_end?: string
          period_label?: string
          period_start?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_close_periods_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_close_periods_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_close_tasks: {
        Row: {
          account_id: string | null
          assigned_person_role_id: string | null
          assigned_user_id: string | null
          blocker_reason: string | null
          close_period_id: string
          completed_at: string | null
          completed_by: string | null
          created_at: string
          due_date: string | null
          entity_id: string
          evidence_url: string | null
          id: string
          notes: string | null
          status: string
          system_id: string | null
          task_type: string
          template_task_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          assigned_person_role_id?: string | null
          assigned_user_id?: string | null
          blocker_reason?: string | null
          close_period_id: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          due_date?: string | null
          entity_id: string
          evidence_url?: string | null
          id?: string
          notes?: string | null
          status?: string
          system_id?: string | null
          task_type: string
          template_task_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          assigned_person_role_id?: string | null
          assigned_user_id?: string | null
          blocker_reason?: string | null
          close_period_id?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          due_date?: string | null
          entity_id?: string
          evidence_url?: string | null
          id?: string
          notes?: string | null
          status?: string
          system_id?: string | null
          task_type?: string
          template_task_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_close_tasks_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "business_financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_close_tasks_assigned_person_role_id_fkey"
            columns: ["assigned_person_role_id"]
            isOneToOne: false
            referencedRelation: "entity_person_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_close_tasks_assigned_user_id_fkey"
            columns: ["assigned_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_close_tasks_close_period_id_fkey"
            columns: ["close_period_id"]
            isOneToOne: false
            referencedRelation: "business_close_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_close_tasks_completed_by_fkey"
            columns: ["completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_close_tasks_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_close_tasks_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "business_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_close_tasks_template_task_id_fkey"
            columns: ["template_task_id"]
            isOneToOne: false
            referencedRelation: "business_close_template_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      business_close_template_tasks: {
        Row: {
          account_id: string | null
          created_at: string
          default_due_day: number | null
          description: string | null
          evidence_hint: string | null
          id: string
          is_required: boolean
          responsibility_type: string | null
          sort_order: number
          system_id: string | null
          task_key: string
          task_type: string
          template_id: string
          title: string
        }
        Insert: {
          account_id?: string | null
          created_at?: string
          default_due_day?: number | null
          description?: string | null
          evidence_hint?: string | null
          id?: string
          is_required?: boolean
          responsibility_type?: string | null
          sort_order?: number
          system_id?: string | null
          task_key: string
          task_type: string
          template_id: string
          title: string
        }
        Update: {
          account_id?: string | null
          created_at?: string
          default_due_day?: number | null
          description?: string | null
          evidence_hint?: string | null
          id?: string
          is_required?: boolean
          responsibility_type?: string | null
          sort_order?: number
          system_id?: string | null
          task_key?: string
          task_type?: string
          template_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_close_template_tasks_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "business_financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_close_template_tasks_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "business_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_close_template_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "business_close_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      business_close_templates: {
        Row: {
          close_frequency: string
          created_at: string
          created_by: string | null
          description: string | null
          entity_id: string
          id: string
          is_active: boolean
          name: string
          updated_at: string
        }
        Insert: {
          close_frequency?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          entity_id: string
          id?: string
          is_active?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          close_frequency?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          entity_id?: string
          id?: string
          is_active?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_close_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_close_templates_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      business_financial_accounts: {
        Row: {
          account_name: string
          account_type: string
          created_at: string
          currency_code: string
          entity_id: string
          external_account_ref: string | null
          id: string
          institution_name: string | null
          is_active: boolean
          is_reconcilable: boolean
          masked_account_number: string | null
          notes: string | null
          reconciliation_cadence: string
          system_id: string | null
          updated_at: string
        }
        Insert: {
          account_name: string
          account_type: string
          created_at?: string
          currency_code?: string
          entity_id: string
          external_account_ref?: string | null
          id?: string
          institution_name?: string | null
          is_active?: boolean
          is_reconcilable?: boolean
          masked_account_number?: string | null
          notes?: string | null
          reconciliation_cadence?: string
          system_id?: string | null
          updated_at?: string
        }
        Update: {
          account_name?: string
          account_type?: string
          created_at?: string
          currency_code?: string
          entity_id?: string
          external_account_ref?: string | null
          id?: string
          institution_name?: string | null
          is_active?: boolean
          is_reconcilable?: boolean
          masked_account_number?: string | null
          notes?: string | null
          reconciliation_cadence?: string
          system_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_financial_accounts_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_financial_accounts_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "business_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      business_invoices: {
        Row: {
          created_at: string
          created_by: string | null
          due_on: string | null
          engagement_id: string
          entity_id: string
          id: string
          invoice_number: string
          issued_on: string
          notes: string | null
          paid_at: string | null
          period_end: string | null
          period_start: string | null
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          due_on?: string | null
          engagement_id: string
          entity_id: string
          id?: string
          invoice_number: string
          issued_on: string
          notes?: string | null
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          due_on?: string | null
          engagement_id?: string
          entity_id?: string
          id?: string
          invoice_number?: string
          issued_on?: string
          notes?: string | null
          paid_at?: string | null
          period_end?: string | null
          period_start?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_invoices_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_invoices_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "business_service_engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_invoices_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      business_profiles: {
        Row: {
          bookkeeping_status: string
          close_cadence: string
          created_at: string
          dba_name: string | null
          default_accounting_basis: string | null
          ein: string | null
          entity_id: string
          entity_structure: string | null
          fiscal_year_end_day: number | null
          fiscal_year_end_month: number | null
          legal_name: string
          notes: string | null
          state_of_formation: string | null
          updated_at: string
        }
        Insert: {
          bookkeeping_status?: string
          close_cadence?: string
          created_at?: string
          dba_name?: string | null
          default_accounting_basis?: string | null
          ein?: string | null
          entity_id: string
          entity_structure?: string | null
          fiscal_year_end_day?: number | null
          fiscal_year_end_month?: number | null
          legal_name: string
          notes?: string | null
          state_of_formation?: string | null
          updated_at?: string
        }
        Update: {
          bookkeeping_status?: string
          close_cadence?: string
          created_at?: string
          dba_name?: string | null
          default_accounting_basis?: string | null
          ein?: string | null
          entity_id?: string
          entity_structure?: string | null
          fiscal_year_end_day?: number | null
          fiscal_year_end_month?: number | null
          legal_name?: string
          notes?: string | null
          state_of_formation?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_profiles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      business_service_engagements: {
        Row: {
          client_entity_id: string | null
          contact_email: string | null
          contact_name: string | null
          contract_document_id: string | null
          created_at: string
          created_by: string | null
          currency_code: string
          default_hourly_rate: number | null
          entity_id: string
          id: string
          invoice_prefix: string | null
          invoice_terms_days: number
          is_active: boolean
          notes: string | null
          service_type: string
          title: string
          billing_model: string
          updated_at: string
        }
        Insert: {
          client_entity_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contract_document_id?: string | null
          created_at?: string
          created_by?: string | null
          currency_code?: string
          default_hourly_rate?: number | null
          entity_id: string
          id?: string
          invoice_prefix?: string | null
          invoice_terms_days?: number
          is_active?: boolean
          notes?: string | null
          service_type?: string
          title: string
          billing_model?: string
          updated_at?: string
        }
        Update: {
          client_entity_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contract_document_id?: string | null
          created_at?: string
          created_by?: string | null
          currency_code?: string
          default_hourly_rate?: number | null
          entity_id?: string
          id?: string
          invoice_prefix?: string | null
          invoice_terms_days?: number
          is_active?: boolean
          notes?: string | null
          service_type?: string
          title?: string
          billing_model?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_service_engagements_client_entity_id_fkey"
            columns: ["client_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_service_engagements_contract_document_id_fkey"
            columns: ["contract_document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_service_engagements_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_service_engagements_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      business_recurring_tasks: {
        Row: {
          account_id: string | null
          anchor_date: string
          cadence: string
          created_at: string
          description: string | null
          entity_id: string
          id: string
          interval_count: number
          is_active: boolean
          last_completed_at: string | null
          last_completed_by: string | null
          last_completed_for_due_date: string | null
          notes: string | null
          responsibility_id: string | null
          system_id: string | null
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          account_id?: string | null
          anchor_date: string
          cadence?: string
          created_at?: string
          description?: string | null
          entity_id: string
          id?: string
          interval_count?: number
          is_active?: boolean
          last_completed_at?: string | null
          last_completed_by?: string | null
          last_completed_for_due_date?: string | null
          notes?: string | null
          responsibility_id?: string | null
          system_id?: string | null
          task_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          account_id?: string | null
          anchor_date?: string
          cadence?: string
          created_at?: string
          description?: string | null
          entity_id?: string
          id?: string
          interval_count?: number
          is_active?: boolean
          last_completed_at?: string | null
          last_completed_by?: string | null
          last_completed_for_due_date?: string | null
          notes?: string | null
          responsibility_id?: string | null
          system_id?: string | null
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_recurring_tasks_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "business_financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_recurring_tasks_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_recurring_tasks_last_completed_by_fkey"
            columns: ["last_completed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_recurring_tasks_responsibility_id_fkey"
            columns: ["responsibility_id"]
            isOneToOne: false
            referencedRelation: "business_responsibilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_recurring_tasks_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "business_systems"
            referencedColumns: ["id"]
          },
        ]
      }
      business_time_entries: {
        Row: {
          billable: boolean
          created_at: string
          created_by: string | null
          description: string
          engagement_id: string
          entity_id: string
          hourly_rate: number | null
          hours: number
          id: string
          invoice_id: string | null
          updated_at: string
          work_date: string
        }
        Insert: {
          billable?: boolean
          created_at?: string
          created_by?: string | null
          description: string
          engagement_id: string
          entity_id: string
          hourly_rate?: number | null
          hours: number
          id?: string
          invoice_id?: string | null
          updated_at?: string
          work_date: string
        }
        Update: {
          billable?: boolean
          created_at?: string
          created_by?: string | null
          description?: string
          engagement_id?: string
          entity_id?: string
          hourly_rate?: number | null
          hours?: number
          id?: string
          invoice_id?: string | null
          updated_at?: string
          work_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_time_entries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_time_entries_engagement_id_fkey"
            columns: ["engagement_id"]
            isOneToOne: false
            referencedRelation: "business_service_engagements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_time_entries_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_time_entries_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "business_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      business_responsibilities: {
        Row: {
          account_id: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          ends_on: string | null
          entity_id: string
          id: string
          is_primary: boolean
          notes: string | null
          person_role_id: string | null
          responsibility_type: string
          starts_on: string | null
          system_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          account_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          ends_on?: string | null
          entity_id: string
          id?: string
          is_primary?: boolean
          notes?: string | null
          person_role_id?: string | null
          responsibility_type: string
          starts_on?: string | null
          system_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          account_id?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          ends_on?: string | null
          entity_id?: string
          id?: string
          is_primary?: boolean
          notes?: string | null
          person_role_id?: string | null
          responsibility_type?: string
          starts_on?: string | null
          system_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_responsibilities_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "business_financial_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_responsibilities_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_responsibilities_person_role_id_fkey"
            columns: ["person_role_id"]
            isOneToOne: false
            referencedRelation: "entity_person_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_responsibilities_system_id_fkey"
            columns: ["system_id"]
            isOneToOne: false
            referencedRelation: "business_systems"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_responsibilities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      business_systems: {
        Row: {
          access_notes: string | null
          created_at: string
          entity_id: string
          environment: string | null
          external_org_id: string | null
          id: string
          is_primary: boolean
          owner_person_role_id: string | null
          owner_user_id: string | null
          status: string
          system_name: string
          system_type: string
          updated_at: string
          vendor_name: string | null
        }
        Insert: {
          access_notes?: string | null
          created_at?: string
          entity_id: string
          environment?: string | null
          external_org_id?: string | null
          id?: string
          is_primary?: boolean
          owner_person_role_id?: string | null
          owner_user_id?: string | null
          status?: string
          system_name: string
          system_type: string
          updated_at?: string
          vendor_name?: string | null
        }
        Update: {
          access_notes?: string | null
          created_at?: string
          entity_id?: string
          environment?: string | null
          external_org_id?: string | null
          id?: string
          is_primary?: boolean
          owner_person_role_id?: string | null
          owner_user_id?: string | null
          status?: string
          system_name?: string
          system_type?: string
          updated_at?: string
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_systems_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_systems_owner_person_role_id_fkey"
            columns: ["owner_person_role_id"]
            isOneToOne: false
            referencedRelation: "entity_person_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "business_systems_owner_user_id_fkey"
            columns: ["owner_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  governance: {
    Tables: {
      action_items: {
        Row: {
          agent_run_id: string | null
          created_at: string
          description: string
          due_date: string | null
          id: string
          meeting_id: string
          motion_id: string | null
          owner_name: string | null
          source_excerpt: string | null
          source_line_number: number | null
          status: string
          updated_at: string
        }
        Insert: {
          agent_run_id?: string | null
          created_at?: string
          description: string
          due_date?: string | null
          id?: string
          meeting_id: string
          motion_id?: string | null
          owner_name?: string | null
          source_excerpt?: string | null
          source_line_number?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          agent_run_id?: string | null
          created_at?: string
          description?: string
          due_date?: string | null
          id?: string
          meeting_id?: string
          motion_id?: string | null
          owner_name?: string | null
          source_excerpt?: string | null
          source_line_number?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_items_agent_run_id_fkey"
            columns: ["agent_run_id"]
            isOneToOne: false
            referencedRelation: "agent_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_items_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "board_meetings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "action_items_motion_id_fkey"
            columns: ["motion_id"]
            isOneToOne: false
            referencedRelation: "motions"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_runs: {
        Row: {
          agent_name: string
          applied_minutes_id: string | null
          created_at: string
          created_by: string | null
          error_message: string | null
          id: string
          input_hash: string
          input_payload: Json
          meeting_id: string
          output_payload: Json | null
          result_payload: Json | null
          run_type: string
          status: string
          updated_at: string
        }
        Insert: {
          agent_name: string
          applied_minutes_id?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          id?: string
          input_hash: string
          input_payload?: Json
          meeting_id: string
          output_payload?: Json | null
          result_payload?: Json | null
          run_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          agent_name?: string
          applied_minutes_id?: string | null
          created_at?: string
          created_by?: string | null
          error_message?: string | null
          id?: string
          input_hash?: string
          input_payload?: Json
          meeting_id?: string
          output_payload?: Json | null
          result_payload?: Json | null
          run_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agent_runs_applied_minutes_id_fkey"
            columns: ["applied_minutes_id"]
            isOneToOne: false
            referencedRelation: "meeting_minutes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_runs_applied_minutes_id_fkey"
            columns: ["applied_minutes_id"]
            isOneToOne: false
            referencedRelation: "meeting_minutes_expanded"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agent_runs_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "board_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      approvals: {
        Row: {
          approval_method: string
          approved_at: string
          board_member_id: string
          entity_id: string
          id: string
          ip_address: unknown
          signature_hash: string
          target_id: string
          target_type: Database["governance"]["Enums"]["approval_target_type"]
        }
        Insert: {
          approval_method?: string
          approved_at?: string
          board_member_id: string
          entity_id: string
          id?: string
          ip_address?: unknown
          signature_hash: string
          target_id: string
          target_type: Database["governance"]["Enums"]["approval_target_type"]
        }
        Update: {
          approval_method?: string
          approved_at?: string
          board_member_id?: string
          entity_id?: string
          id?: string
          ip_address?: unknown
          signature_hash?: string
          target_id?: string
          target_type?: Database["governance"]["Enums"]["approval_target_type"]
        }
        Relationships: [
          {
            foreignKeyName: "approvals_board_member_id_fkey"
            columns: ["board_member_id"]
            isOneToOne: false
            referencedRelation: "board_members"
            referencedColumns: ["id"]
          },
        ]
      }
      board_meetings: {
        Row: {
          adjourned_at: string | null
          board_id: string
          called_by_user_id: string | null
          cancelled_at: string | null
          created_at: string
          finalized_at: string | null
          finalized_by: string | null
          finalized_signature_hash: string | null
          id: string
          meeting_type: string
          presiding_user_id: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          started_at: string | null
          status: string
          title: string | null
        }
        Insert: {
          adjourned_at?: string | null
          board_id: string
          called_by_user_id?: string | null
          cancelled_at?: string | null
          created_at?: string
          finalized_at?: string | null
          finalized_by?: string | null
          finalized_signature_hash?: string | null
          id?: string
          meeting_type?: string
          presiding_user_id?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          started_at?: string | null
          status?: string
          title?: string | null
        }
        Update: {
          adjourned_at?: string | null
          board_id?: string
          called_by_user_id?: string | null
          cancelled_at?: string | null
          created_at?: string
          finalized_at?: string | null
          finalized_by?: string | null
          finalized_signature_hash?: string | null
          id?: string
          meeting_type?: string
          presiding_user_id?: string | null
          scheduled_end?: string | null
          scheduled_start?: string | null
          started_at?: string | null
          status?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "board_meetings_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      board_members: {
        Row: {
          board_id: string
          created_at: string
          id: string
          role: string
          status: string
          term_end: string | null
          term_start: string | null
          user_id: string
        }
        Insert: {
          board_id: string
          created_at?: string
          id?: string
          role?: string
          status?: string
          term_end?: string | null
          term_start?: string | null
          user_id: string
        }
        Update: {
          board_id?: string
          created_at?: string
          id?: string
          role?: string
          status?: string
          term_end?: string | null
          term_start?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "board_members_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      boards: {
        Row: {
          created_at: string
          entity_id: string | null
          id: string
          is_primary: boolean
          name: string | null
        }
        Insert: {
          created_at?: string
          entity_id?: string | null
          id?: string
          is_primary?: boolean
          name?: string | null
        }
        Update: {
          created_at?: string
          entity_id?: string | null
          id?: string
          is_primary?: boolean
          name?: string | null
        }
        Relationships: []
      }
      meeting_attendance: {
        Row: {
          board_member_id: string
          id: string
          meeting_id: string
          status: string
        }
        Insert: {
          board_member_id: string
          id?: string
          meeting_id: string
          status: string
        }
        Update: {
          board_member_id?: string
          id?: string
          meeting_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_attendance_board_member_id_fkey"
            columns: ["board_member_id"]
            isOneToOne: false
            referencedRelation: "board_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_attendance_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "board_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_minutes: {
        Row: {
          amended_from_id: string | null
          content: string | null
          content_json: Json | null
          content_md: string | null
          created_at: string
          draft: boolean | null
          finalized_at: string | null
          finalized_by: string | null
          id: string
          locked_at: string | null
          meeting_id: string
          status: Database["governance"]["Enums"]["minutes_status"]
          version_number: number
        }
        Insert: {
          amended_from_id?: string | null
          content?: string | null
          content_json?: Json | null
          content_md?: string | null
          created_at?: string
          draft?: boolean | null
          finalized_at?: string | null
          finalized_by?: string | null
          id?: string
          locked_at?: string | null
          meeting_id: string
          status?: Database["governance"]["Enums"]["minutes_status"]
          version_number?: number
        }
        Update: {
          amended_from_id?: string | null
          content?: string | null
          content_json?: Json | null
          content_md?: string | null
          created_at?: string
          draft?: boolean | null
          finalized_at?: string | null
          finalized_by?: string | null
          id?: string
          locked_at?: string | null
          meeting_id?: string
          status?: Database["governance"]["Enums"]["minutes_status"]
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "meeting_minutes_amended_from_fkey"
            columns: ["amended_from_id"]
            isOneToOne: false
            referencedRelation: "meeting_minutes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_minutes_amended_from_fkey"
            columns: ["amended_from_id"]
            isOneToOne: false
            referencedRelation: "meeting_minutes_expanded"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_minutes_finalized_by_fkey"
            columns: ["finalized_by"]
            isOneToOne: false
            referencedRelation: "board_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_minutes_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: true
            referencedRelation: "board_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      meeting_transcripts: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          meeting_id: string
          transcript: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          meeting_id: string
          transcript?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          meeting_id?: string
          transcript?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "meeting_transcripts_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: true
            referencedRelation: "board_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      motions: {
        Row: {
          created_at: string
          id: string
          meeting_id: string
          status: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          meeting_id: string
          status?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          meeting_id?: string
          status?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "motions_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: false
            referencedRelation: "board_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          board_member_id: string | null
          created_at: string
          id: string
          motion_id: string
          user_id: string | null
          vote: string | null
          vote_value: string | null
        }
        Insert: {
          board_member_id?: string | null
          created_at?: string
          id?: string
          motion_id: string
          user_id?: string | null
          vote?: string | null
          vote_value?: string | null
        }
        Update: {
          board_member_id?: string | null
          created_at?: string
          id?: string
          motion_id?: string
          user_id?: string | null
          vote?: string | null
          vote_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_motion_id_fkey"
            columns: ["motion_id"]
            isOneToOne: false
            referencedRelation: "motions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      meeting_minutes_expanded: {
        Row: {
          amended_from_id: string | null
          board_id: string | null
          content: string | null
          content_json: Json | null
          content_md: string | null
          created_at: string | null
          draft: boolean | null
          finalized_at: string | null
          finalized_by: string | null
          id: string | null
          locked_at: string | null
          meeting_id: string | null
          meeting_status: string | null
          meeting_title: string | null
          meeting_type: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          status: Database["governance"]["Enums"]["minutes_status"] | null
          version_number: number | null
        }
        Relationships: [
          {
            foreignKeyName: "board_meetings_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_minutes_amended_from_fkey"
            columns: ["amended_from_id"]
            isOneToOne: false
            referencedRelation: "meeting_minutes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_minutes_amended_from_fkey"
            columns: ["amended_from_id"]
            isOneToOne: false
            referencedRelation: "meeting_minutes_expanded"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_minutes_finalized_by_fkey"
            columns: ["finalized_by"]
            isOneToOne: false
            referencedRelation: "board_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meeting_minutes_meeting_id_fkey"
            columns: ["meeting_id"]
            isOneToOne: true
            referencedRelation: "board_meetings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _object_exists: {
        Args: { p_kind: string; p_name: string; p_schema: string }
        Returns: boolean
      }
      approve_document_version: {
        Args: {
          p_approval_method?: string
          p_document_version_id: string
          p_ip?: unknown
          p_meeting_id?: string
          p_signature_hash?: string
        }
        Returns: string
      }
      approve_meeting_minutes: {
        Args: {
          p_approval_method?: string
          p_ip?: unknown
          p_meeting_id: string
          p_signature_hash?: string
        }
        Returns: string
      }
      assert_can_adjourn_meeting: {
        Args: { p_board_id: string; p_presiding_user_id: string }
        Returns: undefined
      }
      assert_can_start_meeting: {
        Args: { p_board_id: string }
        Returns: undefined
      }
      can_read_board: {
        Args: { p_board_id: string; p_user_id: string }
        Returns: boolean
      }
      can_read_entity: {
        Args: { p_entity_id: string; p_user_id: string }
        Returns: boolean
      }
      can_read_meeting: {
        Args: { p_meeting_id: string; p_user_id: string }
        Returns: boolean
      }
      create_board_packet_for_meeting: {
        Args: { p_meeting_id: string; p_title?: string }
        Returns: Json
      }
      current_user_id: { Args: never; Returns: string }
      ensure_primary_board: { Args: { p_entity_id: string }; Returns: string }
      finalize_meeting: {
        Args: { p_meeting_id: string; p_signature_hash?: string }
        Returns: {
          adjourned_at: string | null
          board_id: string
          called_by_user_id: string | null
          cancelled_at: string | null
          created_at: string
          finalized_at: string | null
          finalized_by: string | null
          finalized_signature_hash: string | null
          id: string
          meeting_type: string
          presiding_user_id: string | null
          scheduled_end: string | null
          scheduled_start: string | null
          started_at: string | null
          status: string
          title: string | null
        }
        SetofOptions: {
          from: "*"
          to: "board_meetings"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      finalize_motion: {
        Args: {
          p_approval_method?: string
          p_ip?: unknown
          p_motion_id: string
          p_signature_hash?: string
        }
        Returns: string
      }
      is_board_chair:
        | { Args: { p_entity_id: string }; Returns: boolean }
        | { Args: { p_entity_id: string; p_user_id: string }; Returns: boolean }
      is_board_chair_for_board: {
        Args: { p_board_id: string; p_user_id: string }
        Returns: boolean
      }
      is_board_member:
        | { Args: { p_entity_id: string }; Returns: boolean }
        | { Args: { p_entity_id: string; p_user_id: string }; Returns: boolean }
      is_board_member_current: {
        Args: { p_board_id: string }
        Returns: boolean
      }
      is_board_member_for_board: {
        Args: { p_board_id: string; p_user_id: string }
        Returns: boolean
      }
      is_board_officer: {
        Args: { p_board_id: string; p_user_id: string }
        Returns: boolean
      }
      is_board_officer_current: {
        Args: { p_board_id: string }
        Returns: boolean
      }
      is_quorum_met: { Args: { p_meeting_id: string }; Returns: boolean }
      meeting_is_adjourned_for_motion: {
        Args: { p_motion_id: string }
        Returns: boolean
      }
      quorum_required_for_meeting: {
        Args: { p_meeting_id: string }
        Returns: number
      }
      set_board_packet_version: {
        Args: { p_document_version_id: string; p_meeting_id: string }
        Returns: boolean
      }
    }
    Enums: {
      approval_target_type: "meeting_minutes" | "document_version" | "motion"
      meeting_status: "scheduled" | "in_session" | "adjourned" | "cancelled"
      minutes_status: "draft" | "finalized" | "amended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  irs: {
    Tables: {
      entity_links: {
        Row: {
          confidence: number | null
          created_at: string
          ein: string
          entity_id: string
          match_type: string
          notes: string | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          ein: string
          entity_id: string
          match_type?: string
          notes?: string | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          ein?: string
          entity_id?: string
          match_type?: string
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_links_ein_fkey"
            columns: ["ein"]
            isOneToOne: true
            referencedRelation: "organizations"
            referencedColumns: ["ein"]
          },
        ]
      }
      organizations: {
        Row: {
          aka_names: string[]
          city: string | null
          country: string
          created_at: string
          deductibility_code: string | null
          ein: string
          eobmf_last_seen_at: string | null
          epostcard_last_seen_at: string | null
          foundation_code: string | null
          is_pub78: boolean
          is_revoked: boolean
          last_seen_at: string
          latest_return_id: string | null
          legal_name: string
          normalized_legal_name: string | null
          pub78_last_seen_at: string | null
          revocation_last_seen_at: string | null
          ruling_year: number | null
          state: string | null
          subsection_code: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          aka_names?: string[]
          city?: string | null
          country?: string
          created_at?: string
          deductibility_code?: string | null
          ein: string
          eobmf_last_seen_at?: string | null
          epostcard_last_seen_at?: string | null
          foundation_code?: string | null
          is_pub78?: boolean
          is_revoked?: boolean
          last_seen_at?: string
          latest_return_id?: string | null
          legal_name: string
          normalized_legal_name?: string | null
          pub78_last_seen_at?: string | null
          revocation_last_seen_at?: string | null
          ruling_year?: number | null
          state?: string | null
          subsection_code?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          aka_names?: string[]
          city?: string | null
          country?: string
          created_at?: string
          deductibility_code?: string | null
          ein?: string
          eobmf_last_seen_at?: string | null
          epostcard_last_seen_at?: string | null
          foundation_code?: string | null
          is_pub78?: boolean
          is_revoked?: boolean
          last_seen_at?: string
          latest_return_id?: string | null
          legal_name?: string
          normalized_legal_name?: string | null
          pub78_last_seen_at?: string | null
          revocation_last_seen_at?: string | null
          ruling_year?: number | null
          state?: string | null
          subsection_code?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_latest_return_id_fkey"
            columns: ["latest_return_id"]
            isOneToOne: false
            referencedRelation: "latest_returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organizations_latest_return_id_fkey"
            columns: ["latest_return_id"]
            isOneToOne: false
            referencedRelation: "returns"
            referencedColumns: ["id"]
          },
        ]
      }
      return_documents: {
        Row: {
          bytes: number | null
          created_at: string
          doc_type: Database["irs"]["Enums"]["irs_doc_type"]
          fetched_at: string | null
          fetched_from: string | null
          id: string
          mime_type: string | null
          return_id: string
          sha256: string | null
          storage_bucket: string | null
          storage_path: string | null
        }
        Insert: {
          bytes?: number | null
          created_at?: string
          doc_type: Database["irs"]["Enums"]["irs_doc_type"]
          fetched_at?: string | null
          fetched_from?: string | null
          id?: string
          mime_type?: string | null
          return_id: string
          sha256?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
        }
        Update: {
          bytes?: number | null
          created_at?: string
          doc_type?: Database["irs"]["Enums"]["irs_doc_type"]
          fetched_at?: string | null
          fetched_from?: string | null
          id?: string
          mime_type?: string | null
          return_id?: string
          sha256?: string | null
          storage_bucket?: string | null
          storage_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "return_documents_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "latest_returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_documents_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "returns"
            referencedColumns: ["id"]
          },
        ]
      }
      return_financials: {
        Row: {
          contributions: number | null
          created_at: string
          excess_or_deficit: number | null
          fundraising_expenses: number | null
          fundraising_gross: number | null
          investment_income: number | null
          management_general_expenses: number | null
          net_assets_begin: number | null
          net_assets_end: number | null
          program_expenses: number | null
          program_service_revenue: number | null
          return_id: string
          source_map: Json
          total_assets_begin: number | null
          total_assets_end: number | null
          total_expenses: number | null
          total_liabilities_begin: number | null
          total_liabilities_end: number | null
          total_revenue: number | null
          updated_at: string
        }
        Insert: {
          contributions?: number | null
          created_at?: string
          excess_or_deficit?: number | null
          fundraising_expenses?: number | null
          fundraising_gross?: number | null
          investment_income?: number | null
          management_general_expenses?: number | null
          net_assets_begin?: number | null
          net_assets_end?: number | null
          program_expenses?: number | null
          program_service_revenue?: number | null
          return_id: string
          source_map?: Json
          total_assets_begin?: number | null
          total_assets_end?: number | null
          total_expenses?: number | null
          total_liabilities_begin?: number | null
          total_liabilities_end?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Update: {
          contributions?: number | null
          created_at?: string
          excess_or_deficit?: number | null
          fundraising_expenses?: number | null
          fundraising_gross?: number | null
          investment_income?: number | null
          management_general_expenses?: number | null
          net_assets_begin?: number | null
          net_assets_end?: number | null
          program_expenses?: number | null
          program_service_revenue?: number | null
          return_id?: string
          source_map?: Json
          total_assets_begin?: number | null
          total_assets_end?: number | null
          total_expenses?: number | null
          total_liabilities_begin?: number | null
          total_liabilities_end?: number | null
          total_revenue?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "return_financials_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: true
            referencedRelation: "latest_returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_financials_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: true
            referencedRelation: "returns"
            referencedColumns: ["id"]
          },
        ]
      }
      return_narratives: {
        Row: {
          ai_summary: string | null
          created_at: string
          extracted: Json
          id: string
          label: string | null
          raw_text: string
          return_id: string
          section: Database["irs"]["Enums"]["irs_narrative_section"]
          source_map: Json
        }
        Insert: {
          ai_summary?: string | null
          created_at?: string
          extracted?: Json
          id?: string
          label?: string | null
          raw_text: string
          return_id: string
          section: Database["irs"]["Enums"]["irs_narrative_section"]
          source_map?: Json
        }
        Update: {
          ai_summary?: string | null
          created_at?: string
          extracted?: Json
          id?: string
          label?: string | null
          raw_text?: string
          return_id?: string
          section?: Database["irs"]["Enums"]["irs_narrative_section"]
          source_map?: Json
        }
        Relationships: [
          {
            foreignKeyName: "return_narratives_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "latest_returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_narratives_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "returns"
            referencedColumns: ["id"]
          },
        ]
      }
      return_people: {
        Row: {
          average_hours_per_week: number | null
          created_at: string
          id: string
          is_current: boolean | null
          name: string
          other_compensation: number | null
          reportable_compensation: number | null
          return_id: string
          role: Database["irs"]["Enums"]["irs_person_role"]
          source_map: Json
          title: string | null
        }
        Insert: {
          average_hours_per_week?: number | null
          created_at?: string
          id?: string
          is_current?: boolean | null
          name: string
          other_compensation?: number | null
          reportable_compensation?: number | null
          return_id: string
          role: Database["irs"]["Enums"]["irs_person_role"]
          source_map?: Json
          title?: string | null
        }
        Update: {
          average_hours_per_week?: number | null
          created_at?: string
          id?: string
          is_current?: boolean | null
          name?: string
          other_compensation?: number | null
          reportable_compensation?: number | null
          return_id?: string
          role?: Database["irs"]["Enums"]["irs_person_role"]
          source_map?: Json
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "return_people_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "latest_returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_people_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "returns"
            referencedColumns: ["id"]
          },
        ]
      }
      return_restrictions: {
        Row: {
          confidence: number | null
          created_at: string
          details: Json
          id: string
          restriction_type: Database["irs"]["Enums"]["irs_restriction_type"]
          return_id: string
          source_narrative_id: string | null
          summary: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          details?: Json
          id?: string
          restriction_type: Database["irs"]["Enums"]["irs_restriction_type"]
          return_id: string
          source_narrative_id?: string | null
          summary: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          details?: Json
          id?: string
          restriction_type?: Database["irs"]["Enums"]["irs_restriction_type"]
          return_id?: string
          source_narrative_id?: string | null
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "return_restrictions_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "latest_returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_restrictions_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: false
            referencedRelation: "returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_restrictions_source_narrative_id_fkey"
            columns: ["source_narrative_id"]
            isOneToOne: false
            referencedRelation: "return_narratives"
            referencedColumns: ["id"]
          },
        ]
      }
      returns: {
        Row: {
          created_at: string
          ein: string
          filed_on: string | null
          gross_receipts_cap: number | null
          id: string
          irs_object_id: string | null
          is_amended: boolean | null
          is_terminated: boolean | null
          principal_officer_name: string | null
          return_meta: Json | null
          return_name: string | null
          return_type: Database["irs"]["Enums"]["irs_return_type"]
          source_priority: string
          source_system: string
          tax_period_end: string | null
          tax_period_start: string | null
          tax_year: number
          teos_filing_type: string | null
          teos_index_year: number | null
          teos_return_id: string | null
          teos_return_type: string | null
          teos_shard: string | null
          teos_tax_period_yyyymm: string | null
          teos_tax_year: string | null
          teos_taxpayer_name: string | null
          updated_at: string
          xml_path: string | null
          xml_sha256: string | null
        }
        Insert: {
          created_at?: string
          ein: string
          filed_on?: string | null
          gross_receipts_cap?: number | null
          id?: string
          irs_object_id?: string | null
          is_amended?: boolean | null
          is_terminated?: boolean | null
          principal_officer_name?: string | null
          return_meta?: Json | null
          return_name?: string | null
          return_type?: Database["irs"]["Enums"]["irs_return_type"]
          source_priority?: string
          source_system?: string
          tax_period_end?: string | null
          tax_period_start?: string | null
          tax_year: number
          teos_filing_type?: string | null
          teos_index_year?: number | null
          teos_return_id?: string | null
          teos_return_type?: string | null
          teos_shard?: string | null
          teos_tax_period_yyyymm?: string | null
          teos_tax_year?: string | null
          teos_taxpayer_name?: string | null
          updated_at?: string
          xml_path?: string | null
          xml_sha256?: string | null
        }
        Update: {
          created_at?: string
          ein?: string
          filed_on?: string | null
          gross_receipts_cap?: number | null
          id?: string
          irs_object_id?: string | null
          is_amended?: boolean | null
          is_terminated?: boolean | null
          principal_officer_name?: string | null
          return_meta?: Json | null
          return_name?: string | null
          return_type?: Database["irs"]["Enums"]["irs_return_type"]
          source_priority?: string
          source_system?: string
          tax_period_end?: string | null
          tax_period_start?: string | null
          tax_year?: number
          teos_filing_type?: string | null
          teos_index_year?: number | null
          teos_return_id?: string | null
          teos_return_type?: string | null
          teos_shard?: string | null
          teos_tax_period_yyyymm?: string | null
          teos_tax_year?: string | null
          teos_taxpayer_name?: string | null
          updated_at?: string
          xml_path?: string | null
          xml_sha256?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "returns_ein_fkey"
            columns: ["ein"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["ein"]
          },
        ]
      }
    }
    Views: {
      latest_financials: {
        Row: {
          contributions: number | null
          created_at: string | null
          ein: string | null
          excess_or_deficit: number | null
          fundraising_expenses: number | null
          fundraising_gross: number | null
          investment_income: number | null
          management_general_expenses: number | null
          net_assets_begin: number | null
          net_assets_end: number | null
          program_expenses: number | null
          program_service_revenue: number | null
          return_id: string | null
          return_type: Database["irs"]["Enums"]["irs_return_type"] | null
          source_map: Json | null
          tax_year: number | null
          total_assets_begin: number | null
          total_assets_end: number | null
          total_expenses: number | null
          total_liabilities_begin: number | null
          total_liabilities_end: number | null
          total_revenue: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "return_financials_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: true
            referencedRelation: "latest_returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "return_financials_return_id_fkey"
            columns: ["return_id"]
            isOneToOne: true
            referencedRelation: "returns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "returns_ein_fkey"
            columns: ["ein"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["ein"]
          },
        ]
      }
      latest_returns: {
        Row: {
          created_at: string | null
          ein: string | null
          filed_on: string | null
          gross_receipts_cap: number | null
          id: string | null
          irs_object_id: string | null
          is_amended: boolean | null
          is_terminated: boolean | null
          principal_officer_name: string | null
          return_type: Database["irs"]["Enums"]["irs_return_type"] | null
          source_system: string | null
          tax_period_end: string | null
          tax_period_start: string | null
          tax_year: number | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "returns_ein_fkey"
            columns: ["ein"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["ein"]
          },
        ]
      }
    }
    Functions: {
      can_access_ein: { Args: { p_ein: string }; Returns: boolean }
      format_ein: { Args: { ein_digits: string }; Returns: string }
      normalize_ein: { Args: { p_ein: string }; Returns: string }
      refresh_latest_return_id: { Args: { p_ein: string }; Returns: undefined }
      search_organizations_trgm: {
        Args: {
          p_city_prefix?: string
          p_limit?: number
          p_offset?: number
          p_only_pub78?: boolean
          p_only_revoked?: boolean
          p_query: string
          p_state?: string
        }
        Returns: {
          city: string
          country: string
          ein: string
          is_pub78: boolean
          is_revoked: boolean
          legal_name: string
          score: number
          state: string
        }[]
      }
    }
    Enums: {
      irs_doc_type: "pdf" | "xml" | "other"
      irs_narrative_section:
        | "part_iii"
        | "schedule_o"
        | "schedule_d"
        | "schedule_a"
        | "other"
        | "mission"
        | "program_accomplishments"
      irs_person_role:
        | "officer"
        | "director"
        | "trustee"
        | "key_employee"
        | "highest_compensated"
        | "independent_contractor"
        | "other"
      irs_restriction_type:
        | "endowment"
        | "donor_restricted"
        | "temporarily_restricted"
        | "permanently_restricted"
        | "board_designated"
        | "scholarship_restriction"
        | "program_restriction"
        | "geographic_restriction"
        | "other"
      irs_return_type: "990" | "990EZ" | "990PF" | "990N" | "unknown"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ai_credit_rates: {
        Row: {
          created_at: string
          effective_at: string
          id: string
          name: string
          retired_at: string | null
          usd_cents_per_credit: number
        }
        Insert: {
          created_at?: string
          effective_at?: string
          id?: string
          name: string
          retired_at?: string | null
          usd_cents_per_credit: number
        }
        Update: {
          created_at?: string
          effective_at?: string
          id?: string
          name?: string
          retired_at?: string | null
          usd_cents_per_credit?: number
        }
        Relationships: [],
      }
      service_availability_rules: {
        Row: {
          created_at: string
          day_of_week: number
          effective_from: string | null
          effective_until: string | null
          end_time: string
          id: string
          is_active: boolean
          service_offering_id: string
          start_time: string
          timezone: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          effective_from?: string | null
          effective_until?: string | null
          end_time: string
          id?: string
          is_active?: boolean
          service_offering_id: string
          start_time: string
          timezone?: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          effective_from?: string | null
          effective_until?: string | null
          end_time?: string
          id?: string
          is_active?: boolean
          service_offering_id?: string
          start_time?: string
          timezone?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_availability_rules_service_offering_id_fkey"
            columns: ["service_offering_id"]
            isOneToOne: false
            referencedRelation: "service_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      service_locations: {
        Row: {
          address1: string | null
          address2: string | null
          city: string | null
          country: string
          created_at: string
          id: string
          is_active: boolean
          is_primary: boolean
          label: string | null
          latitude: number | null
          location_type: string
          longitude: number | null
          postal: string | null
          service_offering_id: string
          state: string | null
          updated_at: string
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_primary?: boolean
          label?: string | null
          latitude?: number | null
          location_type?: string
          longitude?: number | null
          postal?: string | null
          service_offering_id: string
          state?: string | null
          updated_at?: string
        }
        Update: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          country?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_primary?: boolean
          label?: string | null
          latitude?: number | null
          location_type?: string
          longitude?: number | null
          postal?: string | null
          service_offering_id?: string
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_locations_service_offering_id_fkey"
            columns: ["service_offering_id"]
            isOneToOne: false
            referencedRelation: "service_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      service_offering_prices: {
        Row: {
          amount_cents: number
          created_at: string
          currency_code: string
          id: string
          is_default: boolean
          service_offering_id: string
          unit_label: string
          updated_at: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency_code?: string
          id?: string
          is_default?: boolean
          service_offering_id: string
          unit_label?: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency_code?: string
          id?: string
          is_default?: boolean
          service_offering_id?: string
          unit_label?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_offering_prices_service_offering_id_fkey"
            columns: ["service_offering_id"]
            isOneToOne: false
            referencedRelation: "service_offerings"
            referencedColumns: ["id"]
          },
        ]
      }
      service_offerings: {
        Row: {
          configuration: Json
          created_at: string
          description: string | null
          id: string
          name: string
          provider_id: string
          service_type: string
          status: string
          updated_at: string
        }
        Insert: {
          configuration?: Json
          created_at?: string
          description?: string | null
          id?: string
          name: string
          provider_id: string
          service_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          configuration?: Json
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          provider_id?: string
          service_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_offerings_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "service_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      service_providers: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string
          entity_id: string | null
          id: string
          profile_id: string | null
          slug: string | null
          status: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name: string
          entity_id?: string | null
          id?: string
          profile_id?: string | null
          slug?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string
          entity_id?: string | null
          id?: string
          profile_id?: string | null
          slug?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_providers_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_providers_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          address: string | null
          created_at: string | null
          entity_id: string
          id: string
          lat: number | null
          lng: number | null
          name: string
          phone_number: string | null
          place_id: string | null
          status: string
          types: string[] | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          entity_id: string
          id?: string
          lat?: number | null
          lng?: number | null
          name: string
          phone_number?: string | null
          place_id?: string | null
          status?: string
          types?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          entity_id?: string
          id?: string
          lat?: number | null
          lng?: number | null
          name?: string
          phone_number?: string | null
          place_id?: string | null
          status?: string
          types?: string[] | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "businesses_entity_id_fk"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      district_metadata: {
        Row: {
          acres: number | null
          created_at: string
          entity_id: string
          formid: string | null
          prefname: string | null
          sdnumber: string | null
          sdorgid: string | null
          sdtype: string | null
          shortname: string | null
          sqmiles: number | null
          updated_at: string
          web_url: string | null
        }
        Insert: {
          acres?: number | null
          created_at?: string
          entity_id: string
          formid?: string | null
          prefname?: string | null
          sdnumber?: string | null
          sdorgid?: string | null
          sdtype?: string | null
          shortname?: string | null
          sqmiles?: number | null
          updated_at?: string
          web_url?: string | null
        }
        Update: {
          acres?: number | null
          created_at?: string
          entity_id?: string
          formid?: string | null
          prefname?: string | null
          sdnumber?: string | null
          sdorgid?: string | null
          sdtype?: string | null
          shortname?: string | null
          sqmiles?: number | null
          updated_at?: string
          web_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "district_metadata_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      document_versions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          approved_by_meeting_id: string | null
          content_md: string | null
          created_at: string
          created_by: string | null
          document_id: string
          file_sha256: string | null
          id: string
          mime_type: string | null
          review_notes: string | null
          status: Database["public"]["Enums"]["document_version_status"]
          storage_bucket: string | null
          storage_path: string | null
          updated_at: string
          version_number: number | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          approved_by_meeting_id?: string | null
          content_md?: string | null
          created_at?: string
          created_by?: string | null
          document_id: string
          file_sha256?: string | null
          id?: string
          mime_type?: string | null
          review_notes?: string | null
          status?: Database["public"]["Enums"]["document_version_status"]
          storage_bucket?: string | null
          storage_path?: string | null
          updated_at?: string
          version_number?: number | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          approved_by_meeting_id?: string | null
          content_md?: string | null
          created_at?: string
          created_by?: string | null
          document_id?: string
          file_sha256?: string | null
          id?: string
          mime_type?: string | null
          review_notes?: string | null
          status?: Database["public"]["Enums"]["document_version_status"]
          storage_bucket?: string | null
          storage_path?: string | null
          updated_at?: string
          version_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "document_versions_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          created_by: string | null
          current_version_id: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          effective_end: string | null
          effective_start: string | null
          entity_id: string
          id: string
          status: Database["public"]["Enums"]["document_status"]
          tax_year: number | null
          title: string
          updated_at: string
          visibility: Database["public"]["Enums"]["document_visibility"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          current_version_id?: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          effective_end?: string | null
          effective_start?: string | null
          entity_id: string
          id?: string
          status?: Database["public"]["Enums"]["document_status"]
          tax_year?: number | null
          title: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["document_visibility"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          current_version_id?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          effective_end?: string | null
          effective_start?: string | null
          entity_id?: string
          id?: string
          status?: Database["public"]["Enums"]["document_status"]
          tax_year?: number | null
          title?: string
          updated_at?: string
          visibility?: Database["public"]["Enums"]["document_visibility"]
        }
        Relationships: [
          {
            foreignKeyName: "documents_current_version_fk"
            columns: ["current_version_id"]
            isOneToOne: false
            referencedRelation: "document_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          created_at: string | null
          email: string | null
          entity_id: string | null
          id: string
          invoice_id: string | null
          receipt_url: string | null
          stripe_session_id: string
          subscription_id: string | null
          type: Database["public"]["Enums"]["donation_type"]
          user_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          email?: string | null
          entity_id?: string | null
          id?: string
          invoice_id?: string | null
          receipt_url?: string | null
          stripe_session_id: string
          subscription_id?: string | null
          type?: Database["public"]["Enums"]["donation_type"]
          user_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          email?: string | null
          entity_id?: string | null
          id?: string
          invoice_id?: string | null
          receipt_url?: string | null
          stripe_session_id?: string
          subscription_id?: string | null
          type?: Database["public"]["Enums"]["donation_type"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entities: {
        Row: {
          active: boolean
          created_at: string
          entity_type: string
          external_ids: Json
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          entity_type: string
          external_ids?: Json
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          entity_type?: string
          external_ids?: Json
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entities_entity_type_fkey"
            columns: ["entity_type"]
            isOneToOne: false
            referencedRelation: "entity_types"
            referencedColumns: ["key"]
          },
        ]
      }
      entity_address_geocodes: {
        Row: {
          accuracy: string | null
          confidence: number
          created_at: string
          entity_address_id: string
          geocoded_at: string
          id: string
          lat: number
          lng: number
          place_id: string | null
          provider: string
          raw_response: Json | null
        }
        Insert: {
          accuracy?: string | null
          confidence?: number
          created_at?: string
          entity_address_id: string
          geocoded_at?: string
          id?: string
          lat: number
          lng: number
          place_id?: string | null
          provider: string
          raw_response?: Json | null
        }
        Update: {
          accuracy?: string | null
          confidence?: number
          created_at?: string
          entity_address_id?: string
          geocoded_at?: string
          id?: string
          lat?: number
          lng?: number
          place_id?: string | null
          provider?: string
          raw_response?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_address_geocodes_entity_address_id_fkey"
            columns: ["entity_address_id"]
            isOneToOne: false
            referencedRelation: "entity_addresses"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_addresses: {
        Row: {
          address1: string | null
          address2: string | null
          city: string | null
          country: string | null
          created_at: string
          entity_id: string
          id: string
          is_primary: boolean
          label: string
          postal: string | null
          source_ref: string | null
          source_system: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          entity_id: string
          id?: string
          is_primary?: boolean
          label?: string
          postal?: string | null
          source_ref?: string | null
          source_system?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          entity_id?: string
          id?: string
          is_primary?: boolean
          label?: string
          postal?: string | null
          source_ref?: string | null
          source_system?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_addresses_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_agent_runs: {
        Row: {
          agent_id: string | null
          capability: string
          completed_at: string | null
          created_at: string
          credit_estimate: number
          credits_charged: number
          entity_id: string
          id: string
          prompt_summary: string | null
          requested_by: string | null
          result_summary: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          agent_id?: string | null
          capability: string
          completed_at?: string | null
          created_at?: string
          credit_estimate?: number
          credits_charged?: number
          entity_id: string
          id?: string
          prompt_summary?: string | null
          requested_by?: string | null
          result_summary?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          agent_id?: string | null
          capability?: string
          completed_at?: string | null
          created_at?: string
          credit_estimate?: number
          credits_charged?: number
          entity_id?: string
          id?: string
          prompt_summary?: string | null
          requested_by?: string | null
          result_summary?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_agent_runs_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "entity_agents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_agent_runs_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_agent_runs_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_agent_runs_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "user_profiles_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_agents: {
        Row: {
          created_at: string
          enabled_capabilities: Json
          entity_id: string
          id: string
          instructions: string | null
          safety_policy: Json
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          enabled_capabilities?: Json
          entity_id: string
          id?: string
          instructions?: string | null
          safety_policy?: Json
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          enabled_capabilities?: Json
          entity_id?: string
          id?: string
          instructions?: string | null
          safety_policy?: Json
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_agents_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_ai_accounts: {
        Row: {
          created_at: string
          display_name: string | null
          entity_id: string
          hard_limit_credits: number
          id: string
          low_balance_threshold_credits: number
          monthly_budget_credits: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          entity_id: string
          hard_limit_credits?: number
          id?: string
          low_balance_threshold_credits?: number
          monthly_budget_credits?: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          entity_id?: string
          hard_limit_credits?: number
          id?: string
          low_balance_threshold_credits?: number
          monthly_budget_credits?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_ai_accounts_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_ai_credit_ledger: {
        Row: {
          account_id: string
          amount_credits: number
          created_at: string
          created_by: string | null
          description: string | null
          direction: string
          entity_id: string
          id: string
          metadata: Json
          money_amount_cents: number | null
          source_id: string | null
          source_type: string
        }
        Insert: {
          account_id: string
          amount_credits: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          direction: string
          entity_id: string
          id?: string
          metadata?: Json
          money_amount_cents?: number | null
          source_id?: string | null
          source_type: string
        }
        Update: {
          account_id?: string
          amount_credits?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          direction?: string
          entity_id?: string
          id?: string
          metadata?: Json
          money_amount_cents?: number | null
          source_id?: string | null
          source_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_ai_credit_ledger_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "entity_ai_account_summaries"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "entity_ai_credit_ledger_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "entity_ai_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_ai_credit_ledger_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_ai_credit_ledger_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles_with_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_ai_credit_ledger_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_ai_usage_events: {
        Row: {
          agent_run_id: string | null
          billed_credits: number
          cached_tokens: number
          capability: string
          created_at: string
          created_by: string | null
          entity_id: string
          id: string
          input_tokens: number
          metadata: Json
          model: string | null
          output_tokens: number
          provider: string | null
          provider_cost_cents: number
          status: string
        }
        Insert: {
          agent_run_id?: string | null
          billed_credits?: number
          cached_tokens?: number
          capability: string
          created_at?: string
          created_by?: string | null
          entity_id: string
          id?: string
          input_tokens?: number
          metadata?: Json
          model?: string | null
          output_tokens?: number
          provider?: string | null
          provider_cost_cents?: number
          status?: string
        }
        Update: {
          agent_run_id?: string | null
          billed_credits?: number
          cached_tokens?: number
          capability?: string
          created_at?: string
          created_by?: string | null
          entity_id?: string
          id?: string
          input_tokens?: number
          metadata?: Json
          model?: string | null
          output_tokens?: number
          provider?: string | null
          provider_cost_cents?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_ai_usage_events_agent_run_id_fkey"
            columns: ["agent_run_id"]
            isOneToOne: false
            referencedRelation: "entity_agent_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_ai_usage_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_ai_usage_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles_with_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_ai_usage_events_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_attributes: {
        Row: {
          attrs: Json
          entity_id: string
          namespace: string
          updated_at: string
        }
        Insert: {
          attrs?: Json
          entity_id: string
          namespace: string
          updated_at?: string
        }
        Update: {
          attrs?: Json
          entity_id?: string
          namespace?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_attributes_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_contacts: {
        Row: {
          contact_role: string
          email: string | null
          entity_id: string
          first_seen_at: string
          id: string
          is_current: boolean
          last_seen_at: string
          name: string | null
          phone: string | null
          raw: Json | null
          source_formid: string
          source_system: string
          source_url: string
        }
        Insert: {
          contact_role: string
          email?: string | null
          entity_id: string
          first_seen_at?: string
          id?: string
          is_current?: boolean
          last_seen_at?: string
          name?: string | null
          phone?: string | null
          raw?: Json | null
          source_formid: string
          source_system: string
          source_url: string
        }
        Update: {
          contact_role?: string
          email?: string | null
          entity_id?: string
          first_seen_at?: string
          id?: string
          is_current?: boolean
          last_seen_at?: string
          name?: string | null
          phone?: string | null
          raw?: Json | null
          source_formid?: string
          source_system?: string
          source_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_contacts_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_field_overrides: {
        Row: {
          confidence: number
          entity_id: string
          field_key: string
          namespace: string
          source: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          confidence?: number
          entity_id: string
          field_key: string
          namespace: string
          source?: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          confidence?: number
          entity_id?: string
          field_key?: string
          namespace?: string
          source?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "entity_field_overrides_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_geometries: {
        Row: {
          bbox: unknown
          centroid: unknown
          created_at: string
          entity_id: string
          geojson: Json | null
          geom: unknown
          geometry_type: string
          id: string
          source: string | null
          updated_at: string
        }
        Insert: {
          bbox?: unknown
          centroid?: unknown
          created_at?: string
          entity_id: string
          geojson?: Json | null
          geom?: unknown
          geometry_type: string
          id?: string
          source?: string | null
          updated_at?: string
        }
        Update: {
          bbox?: unknown
          centroid?: unknown
          created_at?: string
          entity_id?: string
          geojson?: Json | null
          geom?: unknown
          geometry_type?: string
          id?: string
          source?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_geometries_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_onboarding_progress: {
        Row: {
          entity_id: string
          last_updated: string
          section: string
          status: string
        }
        Insert: {
          entity_id: string
          last_updated?: string
          section: string
          status?: string
        }
        Update: {
          entity_id?: string
          last_updated?: string
          section?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_onboarding_progress_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_person_claims: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          entity_id: string
          id: string
          source: string
          source_person_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          entity_id: string
          id?: string
          source?: string
          source_person_id: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          entity_id?: string
          id?: string
          source?: string
          source_person_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_person_claims_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_person_roles: {
        Row: {
          created_at: string
          display_name: string
          email: string | null
          entity_id: string
          id: string
          invite_status: string
          invited_at: string | null
          is_officer: boolean | null
          joined_at: string | null
          linked_user_id: string | null
          other_compensation: number | null
          phone: string | null
          reportable_compensation: number | null
          role_title: string | null
          source_ref: string
          source_system: string
          tax_year: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name: string
          email?: string | null
          entity_id: string
          id?: string
          invite_status?: string
          invited_at?: string | null
          is_officer?: boolean | null
          joined_at?: string | null
          linked_user_id?: string | null
          other_compensation?: number | null
          phone?: string | null
          reportable_compensation?: number | null
          role_title?: string | null
          source_ref: string
          source_system: string
          tax_year?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string
          email?: string | null
          entity_id?: string
          id?: string
          invite_status?: string
          invited_at?: string | null
          is_officer?: boolean | null
          joined_at?: string | null
          linked_user_id?: string | null
          other_compensation?: number | null
          phone?: string | null
          reportable_compensation?: number | null
          role_title?: string | null
          source_ref?: string
          source_system?: string
          tax_year?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_person_roles_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_person_roles_linked_user_id_fkey"
            columns: ["linked_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_person_roles_linked_user_id_fkey"
            columns: ["linked_user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_relationships: {
        Row: {
          child_entity_id: string
          created_at: string
          id: string
          is_primary: boolean
          parent_entity_id: string
          relationship_type: string
          updated_at: string
        }
        Insert: {
          child_entity_id: string
          created_at?: string
          id?: string
          is_primary?: boolean
          parent_entity_id: string
          relationship_type: string
          updated_at?: string
        }
        Update: {
          child_entity_id?: string
          created_at?: string
          id?: string
          is_primary?: boolean
          parent_entity_id?: string
          relationship_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_relationships_child_entity_id_fkey"
            columns: ["child_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_relationships_parent_entity_id_fkey"
            columns: ["parent_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_source_records: {
        Row: {
          entity_id: string
          external_key: string | null
          fetched_at: string
          payload: Json
          source: string
        }
        Insert: {
          entity_id: string
          external_key?: string | null
          fetched_at?: string
          payload: Json
          source: string
        }
        Update: {
          entity_id?: string
          external_key?: string | null
          fetched_at?: string
          payload?: Json
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_source_records_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_status: {
        Row: {
          entity_id: string
          status: string
          updated_at: string
        }
        Insert: {
          entity_id: string
          status: string
          updated_at?: string
        }
        Update: {
          entity_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_status_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_types: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          key: string
          label: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          key: string
          label: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          key?: string
          label?: string
        }
        Relationships: []
      }
      entity_user_invites: {
        Row: {
          accepted_at: string | null
          created_at: string
          desired_role: Database["public"]["Enums"]["entity_user_role"]
          email: string
          entity_id: string
          entity_person_role_id: string | null
          expires_at: string
          id: string
          invited_at: string
          invited_by: string
          status: string
          token_hash: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          desired_role: Database["public"]["Enums"]["entity_user_role"]
          email: string
          entity_id: string
          entity_person_role_id?: string | null
          expires_at: string
          id?: string
          invited_at?: string
          invited_by: string
          status?: string
          token_hash: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          desired_role?: Database["public"]["Enums"]["entity_user_role"]
          email?: string
          entity_id?: string
          entity_person_role_id?: string | null
          expires_at?: string
          id?: string
          invited_at?: string
          invited_by?: string
          status?: string
          token_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_user_invites_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_user_invites_entity_person_role_id_fkey"
            columns: ["entity_person_role_id"]
            isOneToOne: false
            referencedRelation: "entity_person_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_user_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_user_invites_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "user_profiles_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_users: {
        Row: {
          created_at: string
          entity_id: string
          id: string
          is_primary_admin: boolean
          role: Database["public"]["Enums"]["entity_user_role"]
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          id?: string
          is_primary_admin?: boolean
          role: Database["public"]["Enums"]["entity_user_role"]
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          id?: string
          is_primary_admin?: boolean
          role?: Database["public"]["Enums"]["entity_user_role"]
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entity_users_entity_ref_id_fk"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles_with_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      mde_org_types: {
        Row: {
          code: string
          description: string
          updated_at: string
        }
        Insert: {
          code: string
          description: string
          updated_at?: string
        }
        Update: {
          code?: string
          description?: string
          updated_at?: string
        }
        Relationships: []
      }
      mde_school_class_types: {
        Row: {
          code: string
          description: string
          program_school: string | null
          short_description: string | null
          updated_at: string
        }
        Insert: {
          code: string
          description: string
          program_school?: string | null
          short_description?: string | null
          updated_at?: string
        }
        Update: {
          code?: string
          description?: string
          program_school?: string | null
          short_description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      mde_states: {
        Row: {
          code: string
          country: string | null
          fips_code: number | null
          name: string
          updated_at: string
        }
        Insert: {
          code: string
          country?: string | null
          fips_code?: number | null
          name: string
          updated_at?: string
        }
        Update: {
          code?: string
          country?: string | null
          fips_code?: number | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          channel_id: number
          id: number
          inserted_at: string
          message: string | null
          user_id: string
        }
        Insert: {
          channel_id: number
          id?: number
          inserted_at?: string
          message?: string | null
          user_id: string
        }
        Update: {
          channel_id?: number
          id?: number
          inserted_at?: string
          message?: string | null
          user_id?: string
        }
        Relationships: []
      }
      nonprofits: {
        Row: {
          active: boolean
          address: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          ein: string | null
          entity_id: string
          id: string
          logo_url: string | null
          mission_statement: string | null
          name: string
          org_type: Database["public"]["Enums"]["org_type"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          active?: boolean
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          ein?: string | null
          entity_id: string
          id?: string
          logo_url?: string | null
          mission_statement?: string | null
          name: string
          org_type: Database["public"]["Enums"]["org_type"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          active?: boolean
          address?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          ein?: string | null
          entity_id?: string
          id?: string
          logo_url?: string | null
          mission_statement?: string | null
          name?: string
          org_type?: Database["public"]["Enums"]["org_type"]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nonprofits_entity_id_fk"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          role: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          first_name?: string | null
          full_name?: string | null
          id: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      school_program_location_metadata: {
        Row: {
          countycode: string | null
          created_at: string
          entity_id: string
          formid: string | null
          graderange: string | null
          locdistid: string | null
          locdistname: string | null
          loctype: string | null
          magnet: string | null
          mdeaddr: string | null
          mdename: string | null
          orgid: string | null
          orgnumber: string | null
          orgtype: string | null
          pubpriv: string | null
          schnumber: string | null
          updated_at: string
          web_url: string | null
        }
        Insert: {
          countycode?: string | null
          created_at?: string
          entity_id: string
          formid?: string | null
          graderange?: string | null
          locdistid?: string | null
          locdistname?: string | null
          loctype?: string | null
          magnet?: string | null
          mdeaddr?: string | null
          mdename?: string | null
          orgid?: string | null
          orgnumber?: string | null
          orgtype?: string | null
          pubpriv?: string | null
          schnumber?: string | null
          updated_at?: string
          web_url?: string | null
        }
        Update: {
          countycode?: string | null
          created_at?: string
          entity_id?: string
          formid?: string | null
          graderange?: string | null
          locdistid?: string | null
          locdistname?: string | null
          loctype?: string | null
          magnet?: string | null
          mdeaddr?: string | null
          mdename?: string | null
          orgid?: string | null
          orgnumber?: string | null
          orgtype?: string | null
          pubpriv?: string | null
          schnumber?: string | null
          updated_at?: string
          web_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "school_program_location_metadata_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          email: string | null
          entity_id: string | null
          id: string
          status: string
          stripe_subscription_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          entity_id?: string | null
          id?: string
          status: string
          stripe_subscription_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          entity_id?: string | null
          id?: string
          status?: string
          stripe_subscription_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      superintendent_scope_nonprofits: {
        Row: {
          created_at: string
          district_entity_id: string
          ein: string
          entity_id: string | null
          id: string
          label: string | null
          org_type: Database["public"]["Enums"]["org_type"]
          source_ref: string | null
          source_system: string | null
          status: string
          tier: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          district_entity_id: string
          ein: string
          entity_id?: string | null
          id?: string
          label?: string | null
          org_type?: Database["public"]["Enums"]["org_type"]
          source_ref?: string | null
          source_system?: string | null
          status?: string
          tier?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          district_entity_id?: string
          ein?: string
          entity_id?: string | null
          id?: string
          label?: string | null
          org_type?: Database["public"]["Enums"]["org_type"]
          source_ref?: string | null
          source_system?: string | null
          status?: string
          tier?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "superintendent_scope_nonprofits_district_entity_id_fkey"
            columns: ["district_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "superintendent_scope_nonprofits_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      entity_ai_account_summaries: {
        Row: {
          account_id: string | null
          balance_credits: number | null
          created_at: string | null
          display_name: string | null
          entity_id: string | null
          hard_limit_credits: number | null
          last_funded_at: string | null
          last_used_at: string | null
          low_balance_threshold_credits: number | null
          month_usage_credits: number | null
          monthly_budget_credits: number | null
          status: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_ai_accounts_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: true
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      entity_donation_totals: {
        Row: {
          donation_count: number | null
          entity_id: string | null
          first_donation_at: string | null
          last_donation_at: string | null
          total_amount: number | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      superintendent_scope_nonprofits_ready: {
        Row: {
          district_entity_id: string | null
          ein: string | null
          entity_id: string | null
          filed_on: string | null
          has_irs_org: boolean | null
          has_returns: boolean | null
          label: string | null
          latest_tax_year: number | null
          org_type: Database["public"]["Enums"]["org_type"] | null
          scope_id: string | null
          status: string | null
          tax_period_end: string | null
          tier: string | null
          total_net_assets: number | null
          total_revenue: number | null
        }
        Relationships: [
          {
            foreignKeyName: "superintendent_scope_nonprofits_district_entity_id_fkey"
            columns: ["district_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "superintendent_scope_nonprofits_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles_with_roles: {
        Row: {
          avatar_url: string | null
          first_name: string | null
          full_name: string | null
          id: string | null
          last_name: string | null
          role: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string | null
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string | null
          last_name?: string | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      v_district_scope_nonprofits: {
        Row: {
          district_entity_id: string | null
          ein: string | null
          entity_id: string | null
          filing_recency_days: number | null
          has_entity: boolean | null
          has_irs_org: boolean | null
          has_returns: boolean | null
          irs_city: string | null
          irs_legal_name: string | null
          irs_state: string | null
          latest_return_type: string | null
          latest_tax_year: number | null
          narratives_ok: boolean | null
          net_assets_end: number | null
          org_type: Database["public"]["Enums"]["org_type"] | null
          people_parse_ok: boolean | null
          scope_label: string | null
          status: string | null
          tier: string | null
          total_expenses: number | null
          total_revenue: number | null
        }
        Relationships: [
          {
            foreignKeyName: "superintendent_scope_nonprofits_district_entity_id_fkey"
            columns: ["district_entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
      v_entity_best_geocode: {
        Row: {
          accuracy: string | null
          confidence: number | null
          entity_id: string | null
          geocoded_at: string | null
          lat: number | null
          lng: number | null
          place_id: string | null
          provider: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_addresses_entity_id_fkey"
            columns: ["entity_id"]
            isOneToOne: false
            referencedRelation: "entities"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      _geom_from_geojson_4326: { Args: { p_geojson: Json }; Returns: unknown }
      activate_scoped_nonprofits: {
        Args: { p_district_entity_id: string; p_eins?: string[] }
        Returns: {
          activated_count: number
          activated_eins: string[]
          errors: Json
          skipped_count: number
        }[]
      }
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
        }
        Returns: boolean
      }
      can_manage_entity_assets: {
        Args: { p_entity_id: string; p_user_id: string }
        Returns: boolean
      }
      can_read_entity: {
        Args: { p_entity_id: string; p_user_id: string }
        Returns: boolean
      }
      create_user: { Args: { email: string }; Returns: string }
      current_ai_credit_rate: {
        Args: never
        Returns: {
          created_at: string
          effective_at: string
          id: string
          name: string
          retired_at: string | null
          usd_cents_per_credit: number
        }
        SetofOptions: {
          from: "*"
          to: "ai_credit_rates"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      ensure_entity_ai_account: {
        Args: { p_entity_id: string }
        Returns: {
          created_at: string
          display_name: string | null
          entity_id: string
          hard_limit_credits: number
          id: string
          low_balance_threshold_credits: number
          monthly_budget_credits: number
          status: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "entity_ai_accounts"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      entity_ai_credit_balance: {
        Args: { p_entity_id: string }
        Returns: number
      }
      grant_entity_ai_donation_credits: {
        Args: {
          p_amount_cents: number
          p_created_by?: string
          p_donation_id: string
          p_entity_id: string
        }
        Returns: {
          account_id: string
          amount_credits: number
          created_at: string
          created_by: string | null
          description: string | null
          direction: string
          entity_id: string
          id: string
          metadata: Json
          money_amount_cents: number | null
          source_id: string | null
          source_type: string
        }
        SetofOptions: {
          from: "*"
          to: "entity_ai_credit_ledger"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      is_entity_admin:
        | { Args: { p_entity_id: string }; Returns: boolean }
        | { Args: { p_entity_id: string; p_user_id: string }; Returns: boolean }
      is_entity_user: {
        Args: { p_entity_id: string; p_user_id: string }
        Returns: boolean
      }
      is_global_admin: { Args: { p_user_id: string }; Returns: boolean }
      link_nonprofits_to_districts: {
        Args: { p_limit?: number; p_offset?: number }
        Returns: Json
      }
      link_schools_to_districts: {
        Args: { p_limit: number; p_offset: number }
        Returns: Json
      }
      record_entity_ai_usage: {
        Args: {
          p_agent_run_id?: string
          p_billed_credits: number
          p_cached_tokens?: number
          p_capability: string
          p_created_by?: string
          p_entity_id: string
          p_input_tokens?: number
          p_metadata?: Json
          p_model?: string
          p_output_tokens?: number
          p_provider?: string
          p_provider_cost_cents?: number
          p_status?: string
        }
        Returns: {
          agent_run_id: string | null
          billed_credits: number
          cached_tokens: number
          capability: string
          created_at: string
          created_by: string | null
          entity_id: string
          id: string
          input_tokens: number
          metadata: Json
          model: string | null
          output_tokens: number
          provider: string | null
          provider_cost_cents: number
          status: string
        }
        SetofOptions: {
          from: "*"
          to: "entity_ai_usage_events"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      safe_geom_from_geojson_4326: {
        Args: { p_geojson: Json }
        Returns: unknown
      }
      upsert_entity_geometry_from_geojson:
        | {
            Args: {
              p_entity_id: string
              p_geojson: Json
              p_geometry_type: string
              p_simplified_type?: string
              p_simplify?: boolean
              p_source?: string
              p_tolerance?: number
            }
            Returns: undefined
          }
        | {
            Args: {
              p_entity_id: string
              p_geojson: Json
              p_geometry_type: string
              p_source?: string
            }
            Returns: undefined
          }
      upsert_entity_geometry_with_geom_geojson: {
        Args: {
          p_bbox: Json
          p_entity_id: string
          p_geojson: Json
          p_geom_geojson: Json
          p_geometry_type: string
          p_source: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_permission: "channels.delete" | "messages.delete"
      app_role: "admin" | "moderator"
      campaign_type: "Primary" | "Secondary"
      document_status: "active" | "archived"
      document_type:
        | "articles_of_incorporation"
        | "irs_determination_letter"
        | "ein_letter"
        | "bylaws"
        | "conflict_of_interest_policy"
        | "whistleblower_policy"
        | "document_retention_policy"
        | "financial_controls_policy"
        | "expense_reimbursement_policy"
        | "gift_acceptance_policy"
        | "grant_management_policy"
        | "form_990"
        | "state_annual_report"
        | "meeting_minutes"
        | "service_contract"
        | "other"
        | "board_packet"
      document_version_status:
        | "draft"
        | "in_review"
        | "approved"
        | "rejected"
        | "superseded"
      document_visibility: "public" | "internal" | "board_only"
      donation_type: "platform" | "district"
      entity_user_role: "admin" | "editor" | "viewer" | "employee"
      org_type: "district_foundation" | "up_the_ante" | "external_charity"
      user_status: "ONLINE" | "OFFLINE"
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
  branding: {
    Enums: {
      color_role: ["primary", "secondary", "accent"],
      logo_category: [
        "full_color",
        "stacked",
        "horizontal",
        "one_color_white",
        "one_color_black",
        "one_color_red",
        "inverse",
        "pattern_small",
        "pattern_large",
        "other",
      ],
      logo_subcategory: [
        "district_primary",
        "district_secondary",
        "icon",
        "school_logo",
        "community_ed",
        "athletics_primary",
        "athletics_icon",
        "athletics_wordmark",
        "script_wordmark",
        "wings_up",
        "team_logo",
        "brand_pattern",
        "retired",
        "primary_logo",
        "secondary_logo",
        "wordmark",
        "seal",
        "co_brand",
        "event",
        "program",
      ],
      pattern_type: ["none", "dots", "stripes", "grid", "chevrons", "waves"],
      typography_role: [
        "header1",
        "header2",
        "subheader",
        "body",
        "logo",
        "display",
      ],
    },
  },
  business: {
    Enums: {},
  },
  governance: {
    Enums: {
      approval_target_type: ["meeting_minutes", "document_version", "motion"],
      meeting_status: ["scheduled", "in_session", "adjourned", "cancelled"],
      minutes_status: ["draft", "finalized", "amended"],
    },
  },
  irs: {
    Enums: {
      irs_doc_type: ["pdf", "xml", "other"],
      irs_narrative_section: [
        "part_iii",
        "schedule_o",
        "schedule_d",
        "schedule_a",
        "other",
        "mission",
        "program_accomplishments",
      ],
      irs_person_role: [
        "officer",
        "director",
        "trustee",
        "key_employee",
        "highest_compensated",
        "independent_contractor",
        "other",
      ],
      irs_restriction_type: [
        "endowment",
        "donor_restricted",
        "temporarily_restricted",
        "permanently_restricted",
        "board_designated",
        "scholarship_restriction",
        "program_restriction",
        "geographic_restriction",
        "other",
      ],
      irs_return_type: ["990", "990EZ", "990PF", "990N", "unknown"],
    },
  },
  public: {
    Enums: {
      app_permission: ["channels.delete", "messages.delete"],
      app_role: ["admin", "moderator"],
      campaign_type: ["Primary", "Secondary"],
      document_status: ["active", "archived"],
      document_type: [
        "articles_of_incorporation",
        "irs_determination_letter",
        "ein_letter",
        "bylaws",
        "conflict_of_interest_policy",
        "whistleblower_policy",
        "document_retention_policy",
        "financial_controls_policy",
        "expense_reimbursement_policy",
        "gift_acceptance_policy",
        "grant_management_policy",
        "form_990",
        "state_annual_report",
        "meeting_minutes",
        "service_contract",
        "other",
        "board_packet",
      ],
      document_version_status: [
        "draft",
        "in_review",
        "approved",
        "rejected",
        "superseded",
      ],
      document_visibility: ["public", "internal", "board_only"],
      donation_type: ["platform", "district"],
      entity_user_role: ["admin", "editor", "viewer", "employee"],
      org_type: ["district_foundation", "up_the_ante", "external_charity"],
      user_status: ["ONLINE", "OFFLINE"],
    },
  },
} as const
