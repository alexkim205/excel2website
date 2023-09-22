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
      dashboard_items: {
        Row: {
          created_at: string | null
          dashboard: string | null
          data: Json
          id: string
          user: string | null
        }
        Insert: {
          created_at?: string | null
          dashboard?: string | null
          data?: Json
          id?: string
          user?: string | null
        }
        Update: {
          created_at?: string | null
          dashboard?: string | null
          data?: Json
          id?: string
          user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dashboard_items_dashboard_fkey"
            columns: ["dashboard"]
            referencedRelation: "dashboards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dashboard_items_user_fkey"
            columns: ["user"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      dashboards: {
        Row: {
          created_at: string | null
          data: Json
          id: string
          user: string
        }
        Insert: {
          created_at?: string | null
          data?: Json
          id?: string
          user: string
        }
        Update: {
          created_at?: string | null
          data?: Json
          id?: string
          user?: string
        }
        Relationships: [
          {
            foreignKeyName: "dashboards_user_fkey"
            columns: ["user"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
}
