export type Karat = 375 | 585 | 750 | 999;
export type LeadCategory = 'gold' | 'tech';
export type LeadStatus = 'new' | 'processing' | 'completed' | 'rejected';
export type ProductCondition = 'new' | 'excellent' | 'good' | 'fair';

export interface GoldPriceRow {
  id: number;
  karat: Karat;
  price_per_gram: number;
  updated_at: string;
}

export interface LeadRow {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  category: LeadCategory;
  details: Record<string, unknown> | null;
  estimated_value: number | null;
  status: LeadStatus;
  is_duplicate: boolean;
  bitrix_lead_id: string | null;
  user_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
}

export interface ProductSpecs {
  // Свободная карта характеристик. Ключ — короткое название поля по-русски,
  // значение — строка/число. Примеры ключей: "Чип", "RAM", "Хранилище", "Экран".
  [key: string]: string | number | null;
}

export interface ProductRow {
  id: string;
  title: string;
  description: string | null;
  price: number;
  old_price: number | null;
  category: string | null;
  brand: string | null;
  images: string[];
  condition: ProductCondition | null;
  is_sold: boolean;
  is_published: boolean;
  specs: ProductSpecs | null;
  battery_health: number | null;
  created_at: string;
}

export interface PromotionRow {
  id: string;
  title: string;
  code: string;
  discount_percent: number;
  active_until: string;
}

export interface Database {
  __InternalSupabase: { PostgrestVersion: '12' };
  public: {
    Tables: {
      gold_prices: {
        Row: GoldPriceRow;
        Insert: Omit<GoldPriceRow, 'id' | 'updated_at'>;
        Update: Partial<GoldPriceRow>;
        Relationships: [];
      };
      leads: {
        Row: LeadRow;
        Insert: Omit<LeadRow, 'id' | 'created_at' | 'is_duplicate' | 'bitrix_lead_id' | 'status'> & {
          status?: LeadStatus;
        };
        Update: Partial<LeadRow>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, 'id' | 'created_at'>;
        Update: Partial<ProductRow>;
        Relationships: [];
      };
      promotions: {
        Row: PromotionRow;
        Insert: Omit<PromotionRow, 'id'>;
        Update: Partial<PromotionRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
