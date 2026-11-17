import { LanguageCode } from './common';

export type SellerType = 'individual' | 'shg';
export type SellerStatus = 'pending' | 'verified' | 'suspended';
export type CollectionStatus =
  | 'requested'
  | 'pickup_scheduled'
  | 'collected'
  | 'received_at_hub';

export interface Seller {
  id: string;
  sellerType: SellerType;
  displayName: string;
  slug: string;
  groupMemberCount?: number;
  leaderName: string;
  phone: string;
  village: string;
  block: string;
  district: string;
  state: string;
  preferredLanguage: LanguageCode;
  specialties: string[];
  story: string;
  avatarUrl: string;
  status: SellerStatus;
  totalEarnings: number;
  pendingPayout: number;
  productsCount: number;
  rating: number;
  joinedAt: string;
}

export interface SellerOnboardingInput {
  sellerType: SellerType;
  displayName: string;
  leaderName: string;
  groupMemberCount?: number;
  phone: string;
  village: string;
  block: string;
  district: string;
  state: string;
  preferredLanguage: LanguageCode;
  specialties: string[];
  story: string;
  upiOrBankAccount: string;
}

export interface SellerPayout {
  id: string;
  sellerId: string;
  sellerName: string;
  periodLabel: string;
  grossSales: number;
  platformFee: number;
  netPayable: number;
  status: 'paid' | 'processing' | 'scheduled';
  paidAt?: string;
  referenceNumber: string;
}

export interface CollectionRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  village: string;
  district: string;
  productSummary: string;
  estimatedUnits: number;
  preferredDate: string;
  assignedVehicle?: string;
  status: CollectionStatus;
  createdAt: string;
}
