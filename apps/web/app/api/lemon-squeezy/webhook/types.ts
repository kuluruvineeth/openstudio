export type EventName =
  | "order_created"
  | "order_refunded"
  | "subscription_created"
  | "subscription_updated"
  | "subscription_cancelled"
  | "subscription_resumed"
  | "subscription_expired"
  | "subscription_paused"
  | "subscription_unpaused"
  | "subscription_payment_failed"
  | "subscription_payment_success"
  | "subscription_payment_recovered";

export interface Meta {
  test_mode: boolean;
  event_name: EventName;
  custom_data?: { user_id: string };
}

export interface Data {
  type: string;
  id: string;
  attributes: Attributes;
  relationships: Relationships;
  links: Links2;
}

export interface Payload {
  meta: Meta;
  data: Data;
}

export interface Attributes {
  store_id: number;
  customer_id: number;
  order_id: number;
  order_item_id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  variant_name: string;
  user_name: string;
  user_email: string;
  status: string;
  status_formatted: string;
  card_brand: string;
  card_last_four: string;
  pause: any;
  cancelled: boolean;
  trial_ends_at: any;
  billing_anchor: number;
  urls: Urls;
  renews_at?: string;
  ends_at?: string;
  created_at: string;
  updated_at: string;
  test_mode: boolean;
  first_subscription_item?: FirstSubscriptionItem;
  first_order_item?: FirstOrderItem;
}

export interface Relationships {
  store: Store;
  customer: Customer;
  order: Order;
  "order-item": OrderItem;
  product: Product;
  variant: Variant;
  "subscription-items": SubscriptionItems;
  "subscription-invoices": SubscriptionInvoices;
}

export interface FirstSubscriptionItem {
  id: number;
  subscription_id: number;
  price_id: number;
  quantity: number;
  is_usage_based: boolean;
  created_at: string;
  updated_at: string;
}

export interface Urls {
  update_payment_method: string;
}

export interface Links {
  related: string;
  self: string;
}

export interface Links2 {
  self: string;
}

export interface Store {
  links: Links;
}

export interface Customer {
  links: Links;
}

export interface Order {
  links: Links;
}

export interface OrderItem {
  links: Links;
}

export interface Product {
  links: Links;
}

export interface Variant {
  links: Links;
}

export interface SubscriptionItems {
  links: Links;
}

export interface SubscriptionInvoices {
  links: Links;
}

export interface FirstOrderItem {
  id: number;
  order_id: number;
  product_id: number;
  variant_id: number;
  price_id: number;
  product_name: string;
  variant_name: string;
  price: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  test_mode: boolean;
}
