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
      email_accounts: {
        Row: {
          allocated_at: string | null
          created_at: string
          current_user_id: string | null
          email: string
          id: string
          notes: string | null
          password_encrypted: string | null
          phone_number: string | null
          recovery_email: string | null
          reserved_until: string | null
          status: Database["public"]["Enums"]["email_status"]
          updated_at: string
        }
        Insert: {
          allocated_at?: string | null
          created_at?: string
          current_user_id?: string | null
          email: string
          id?: string
          notes?: string | null
          password_encrypted?: string | null
          phone_number?: string | null
          recovery_email?: string | null
          reserved_until?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          updated_at?: string
        }
        Update: {
          allocated_at?: string | null
          created_at?: string
          current_user_id?: string | null
          email?: string
          id?: string
          notes?: string | null
          password_encrypted?: string | null
          phone_number?: string | null
          recovery_email?: string | null
          reserved_until?: string | null
          status?: Database["public"]["Enums"]["email_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_accounts_current_user_id_fkey"
            columns: ["current_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_platform_status: {
        Row: {
          ban_reason: string | null
          banned_at: string | null
          created_at: string
          email_account_id: string
          id: string
          last_active_at: string | null
          platform: Database["public"]["Enums"]["ai_platform"]
          registered_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          ban_reason?: string | null
          banned_at?: string | null
          created_at?: string
          email_account_id: string
          id?: string
          last_active_at?: string | null
          platform: Database["public"]["Enums"]["ai_platform"]
          registered_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          ban_reason?: string | null
          banned_at?: string | null
          created_at?: string
          email_account_id?: string
          id?: string
          last_active_at?: string | null
          platform?: Database["public"]["Enums"]["ai_platform"]
          registered_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_platform_status_email_account_id_fkey"
            columns: ["email_account_id"]
            isOneToOne: false
            referencedRelation: "email_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      ios_accounts: {
        Row: {
          apple_id: string
          created_at: string
          device_info: Json | null
          id: string
          last_login_at: string | null
          notes: string | null
          password_encrypted: string
          phone_number: string | null
          region: string | null
          risk_control_until: string | null
          slot_combo: Database["public"]["Enums"]["slot_combo"]
          status: Database["public"]["Enums"]["ios_account_status"]
          total_spent: number | null
          updated_at: string
          virtual_card_id: string | null
        }
        Insert: {
          apple_id: string
          created_at?: string
          device_info?: Json | null
          id?: string
          last_login_at?: string | null
          notes?: string | null
          password_encrypted: string
          phone_number?: string | null
          region?: string | null
          risk_control_until?: string | null
          slot_combo?: Database["public"]["Enums"]["slot_combo"]
          status?: Database["public"]["Enums"]["ios_account_status"]
          total_spent?: number | null
          updated_at?: string
          virtual_card_id?: string | null
        }
        Update: {
          apple_id?: string
          created_at?: string
          device_info?: Json | null
          id?: string
          last_login_at?: string | null
          notes?: string | null
          password_encrypted?: string
          phone_number?: string | null
          region?: string | null
          risk_control_until?: string | null
          slot_combo?: Database["public"]["Enums"]["slot_combo"]
          status?: Database["public"]["Enums"]["ios_account_status"]
          total_spent?: number | null
          updated_at?: string
          virtual_card_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ios_accounts_virtual_card_id_fkey"
            columns: ["virtual_card_id"]
            isOneToOne: false
            referencedRelation: "virtual_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          account: Json | null
          amount: number
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          delivered_at: string | null
          discount_snapshot: Json | null
          discount_type: Database["public"]["Enums"]["discount_type"] | null
          email: string | null
          final_amount: number | null
          id: string
          package_id: string | null
          package_name: string | null
          paid_at: string | null
          payment_method: string | null
          payment_status:
            | Database["public"]["Enums"]["order_payment_status"]
            | null
          phone: string | null
          product_id: string | null
          status: Database["public"]["Enums"]["order_delivery_status"]
          stripe_customer_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          subscription_id: string | null
          type: Database["public"]["Enums"]["order_type"] | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          account?: Json | null
          amount: number
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          delivered_at?: string | null
          discount_snapshot?: Json | null
          discount_type?: Database["public"]["Enums"]["discount_type"] | null
          email?: string | null
          final_amount?: number | null
          id?: string
          package_id?: string | null
          package_name?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_status?:
            | Database["public"]["Enums"]["order_payment_status"]
            | null
          phone?: string | null
          product_id?: string | null
          status?: Database["public"]["Enums"]["order_delivery_status"]
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subscription_id?: string | null
          type?: Database["public"]["Enums"]["order_type"] | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          account?: Json | null
          amount?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          delivered_at?: string | null
          discount_snapshot?: Json | null
          discount_type?: Database["public"]["Enums"]["discount_type"] | null
          email?: string | null
          final_amount?: number | null
          id?: string
          package_id?: string | null
          package_name?: string | null
          paid_at?: string | null
          payment_method?: string | null
          payment_status?:
            | Database["public"]["Enums"]["order_payment_status"]
            | null
          phone?: string | null
          product_id?: string | null
          status?: Database["public"]["Enums"]["order_delivery_status"]
          stripe_customer_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subscription_id?: string | null
          type?: Database["public"]["Enums"]["order_type"] | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_logs: {
        Row: {
          created_at: string
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          stripe_event_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          payload: Json
          processed_at?: string | null
          stripe_event_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          stripe_event_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          error_message: string | null
          id: string
          kind: string
          occurred_at: string | null
          order_id: string
          provider: string
          status: Database["public"]["Enums"]["payment_status"]
          stripe_charge_id: string | null
          stripe_customer_id: string | null
          stripe_event_id: string | null
          stripe_payment_intent_id: string | null
          stripe_refund_id: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          error_message?: string | null
          id?: string
          kind: string
          occurred_at?: string | null
          order_id: string
          provider?: string
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_charge_id?: string | null
          stripe_customer_id?: string | null
          stripe_event_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_refund_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          error_message?: string | null
          id?: string
          kind?: string
          occurred_at?: string | null
          order_id?: string
          provider?: string
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_charge_id?: string | null
          stripe_customer_id?: string | null
          stripe_event_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_refund_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string
          description: string | null
          id: string
          ios_ngn_price: number | null
          ios_usd_price: number | null
          name: string
          platform: Database["public"]["Enums"]["ai_platform"]
          reserved_quantity: number | null
          selling_price: number
          sold_quantity: number | null
          status: Database["public"]["Enums"]["product_status"]
          stock_quantity: number | null
          tag: Database["public"]["Enums"]["product_tag"]
          updated_at: string
          web_usd_price: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          ios_ngn_price?: number | null
          ios_usd_price?: number | null
          name: string
          platform: Database["public"]["Enums"]["ai_platform"]
          reserved_quantity?: number | null
          selling_price: number
          sold_quantity?: number | null
          status?: Database["public"]["Enums"]["product_status"]
          stock_quantity?: number | null
          tag: Database["public"]["Enums"]["product_tag"]
          updated_at?: string
          web_usd_price?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          ios_ngn_price?: number | null
          ios_usd_price?: number | null
          name?: string
          platform?: Database["public"]["Enums"]["ai_platform"]
          reserved_quantity?: number | null
          selling_price?: number
          sold_quantity?: number | null
          status?: Database["public"]["Enums"]["product_status"]
          stock_quantity?: number | null
          tag?: Database["public"]["Enums"]["product_tag"]
          updated_at?: string
          web_usd_price?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          stripe_customer_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          stripe_customer_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: number
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          provider: string | null
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          provider?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          provider?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      virtual_cards: {
        Row: {
          balance: number | null
          billing_address_id: string | null
          brand: Database["public"]["Enums"]["card_brand"]
          created_at: string
          currency: Database["public"]["Enums"]["currency_code"]
          cvv_encrypted: string | null
          expiry_date: string | null
          holder_name: string | null
          id: string
          last4: string | null
          monthly_limit: number | null
          notes: string | null
          pan_encrypted: string | null
          provider: string | null
          status: Database["public"]["Enums"]["virtual_card_status"]
          updated_at: string
          used_this_month: number | null
        }
        Insert: {
          balance?: number | null
          billing_address_id?: string | null
          brand?: Database["public"]["Enums"]["card_brand"]
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          cvv_encrypted?: string | null
          expiry_date?: string | null
          holder_name?: string | null
          id?: string
          last4?: string | null
          monthly_limit?: number | null
          notes?: string | null
          pan_encrypted?: string | null
          provider?: string | null
          status?: Database["public"]["Enums"]["virtual_card_status"]
          updated_at?: string
          used_this_month?: number | null
        }
        Update: {
          balance?: number | null
          billing_address_id?: string | null
          brand?: Database["public"]["Enums"]["card_brand"]
          created_at?: string
          currency?: Database["public"]["Enums"]["currency_code"]
          cvv_encrypted?: string | null
          expiry_date?: string | null
          holder_name?: string | null
          id?: string
          last4?: string | null
          monthly_limit?: number | null
          notes?: string | null
          pan_encrypted?: string | null
          provider?: string | null
          status?: Database["public"]["Enums"]["virtual_card_status"]
          updated_at?: string
          used_this_month?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      products_public: {
        Row: {
          created_at: string | null
          description: string | null
          id: string | null
          ios_ngn_price: number | null
          ios_usd_price: number | null
          name: string | null
          platform: Database["public"]["Enums"]["ai_platform"] | null
          reserved_quantity: number | null
          selling_price: number | null
          sold_quantity: number | null
          status: Database["public"]["Enums"]["product_status"] | null
          stock_quantity: number | null
          tag: Database["public"]["Enums"]["product_tag"] | null
          web_usd_price: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          ios_ngn_price?: number | null
          ios_usd_price?: number | null
          name?: string | null
          platform?: Database["public"]["Enums"]["ai_platform"] | null
          reserved_quantity?: number | null
          selling_price?: number | null
          sold_quantity?: number | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number | null
          tag?: Database["public"]["Enums"]["product_tag"] | null
          web_usd_price?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string | null
          ios_ngn_price?: number | null
          ios_usd_price?: number | null
          name?: string | null
          platform?: Database["public"]["Enums"]["ai_platform"] | null
          reserved_quantity?: number | null
          selling_price?: number | null
          sold_quantity?: number | null
          status?: Database["public"]["Enums"]["product_status"] | null
          stock_quantity?: number | null
          tag?: Database["public"]["Enums"]["product_tag"] | null
          web_usd_price?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: {
        Args: { check_user_id: string }
        Returns: boolean
      }
      is_super_admin: {
        Args: { check_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      ai_platform: "openai" | "anthropic"
      app_role: "user" | "admin" | "super_admin"
      card_brand:
        | "visa"
        | "mastercard"
        | "amex"
        | "discover"
        | "jcb"
        | "diners"
        | "unionpay"
        | "unknown"
      currency_code: "USD" | "CNY" | "NGN"
      discount_type: "membership" | "code" | "squad" | "none"
      email_status: "available" | "allocated" | "reserved" | "recycled"
      ios_account_status: "active" | "locked" | "risk_control" | "suspended"
      order_delivery_status: "pending" | "processing" | "delivered" | "failed"
      order_payment_status:
        | "pending"
        | "paid"
        | "partially_refunded"
        | "refunded"
        | "canceled"
      order_type: "new" | "renewal"
      payment_status:
        | "pending"
        | "authorized"
        | "succeeded"
        | "failed"
        | "canceled"
        | "disputed"
        | "refunded"
        | "partially_refunded"
      product_status: "on_sale" | "sold_out" | "discontinued"
      product_tag: "chatgpt" | "claude" | "codex" | "claude_code"
      slot_combo: "none" | "openai_only" | "anthropic_only" | "both"
      virtual_card_status: "active" | "frozen" | "expired" | "cancelled"
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
      ai_platform: ["openai", "anthropic"],
      app_role: ["user", "admin", "super_admin"],
      card_brand: [
        "visa",
        "mastercard",
        "amex",
        "discover",
        "jcb",
        "diners",
        "unionpay",
        "unknown",
      ],
      currency_code: ["USD", "CNY", "NGN"],
      discount_type: ["membership", "code", "squad", "none"],
      email_status: ["available", "allocated", "reserved", "recycled"],
      ios_account_status: ["active", "locked", "risk_control", "suspended"],
      order_delivery_status: ["pending", "processing", "delivered", "failed"],
      order_payment_status: [
        "pending",
        "paid",
        "partially_refunded",
        "refunded",
        "canceled",
      ],
      order_type: ["new", "renewal"],
      payment_status: [
        "pending",
        "authorized",
        "succeeded",
        "failed",
        "canceled",
        "disputed",
        "refunded",
        "partially_refunded",
      ],
      product_status: ["on_sale", "sold_out", "discontinued"],
      product_tag: ["chatgpt", "claude", "codex", "claude_code"],
      slot_combo: ["none", "openai_only", "anthropic_only", "both"],
      virtual_card_status: ["active", "frozen", "expired", "cancelled"],
    },
  },
} as const
