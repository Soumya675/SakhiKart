export type PaymentMethod = 'cod' | 'upi_demo' | 'card_demo';
export type PaymentStatus = 'pending' | 'paid' | 'cod_due' | 'refunded';
export type OrderStatus =
  | 'placed'
  | 'confirmed'
  | 'packed'
  | 'in_transit'
  | 'delivered'
  | 'cancelled';

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  unitLabel: string;
  imageUrl: string;
  sellerName: string;
  originDistrict: string;
  quantity: number;
  maxStock: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sellerId: string;
  sellerName: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface OrderTimelineEvent {
  label: string;
  detail: string;
  timestamp: string;
  completed: boolean;
}

export interface CustomerAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  shippingAddress: CustomerAddress;
  items: OrderItem[];
  subtotal: number;
  shippingAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingCode: string;
  courierPartner: string;
  timeline: OrderTimelineEvent[];
  createdAt: string;
}

export interface CheckoutInput {
  customerId: string;
  shippingAddress: CustomerAddress;
  paymentMethod: PaymentMethod;
  items: CartItem[];
}

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  defaultAddress: CustomerAddress;
  memberSince: string;
}
