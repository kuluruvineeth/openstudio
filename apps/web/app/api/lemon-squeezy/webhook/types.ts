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
