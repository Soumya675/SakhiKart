import { APP_CONFIG } from '@/src/lib/api/config';
import { sellerRepository } from '@/src/lib/api/seller.repository';
import { ApiResponse } from '@/src/types/common';
import {
  CollectionRequest,
  CollectionStatus,
  Seller,
  SellerOnboardingInput,
  SellerPayout,
  SellerStatus,
} from '@/src/types/seller';

function wrap<T>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    source: APP_CONFIG.dataMode,
    timestamp: new Date().toISOString(),
    message,
  };
}

export const SellersService = {
  async listSellers(includePending = false): Promise<ApiResponse<Seller[]>> {
    const items = await sellerRepository.listSellers(includePending);
    return wrap(items);
  },

  async getSellerBySlug(slug: string): Promise<ApiResponse<Seller | null>> {
    const seller = await sellerRepository.getSellerBySlug(slug);
    return wrap(seller);
  },

  async getSellerById(id: string): Promise<ApiResponse<Seller | null>> {
    const seller = await sellerRepository.getSellerById(id);
    return wrap(seller);
  },

  async onboardSeller(input: SellerOnboardingInput): Promise<ApiResponse<Seller>> {
    const seller = await sellerRepository.onboardSeller(input);
    return wrap(seller, 'Seller application received for field team verification');
  },

  async updateSellerStatus(
    sellerId: string,
    status: SellerStatus
  ): Promise<ApiResponse<Seller>> {
    const seller = await sellerRepository.updateSellerStatus(sellerId, status);
    return wrap(seller, `Seller status updated to ${status}`);
  },

  async listPayouts(sellerId?: string): Promise<ApiResponse<SellerPayout[]>> {
    const payouts = await sellerRepository.listPayouts(sellerId);
    return wrap(payouts);
  },

  async listCollectionRequests(
    sellerId?: string
  ): Promise<ApiResponse<CollectionRequest[]>> {
    const requests = await sellerRepository.listCollectionRequests(sellerId);
    return wrap(requests);
  },

  async createCollectionRequest(
    input: Omit<CollectionRequest, 'id' | 'status' | 'createdAt'>
  ): Promise<ApiResponse<CollectionRequest>> {
    const created = await sellerRepository.createCollectionRequest(input);
    return wrap(created, 'Village pickup request logged with Operations');
  },

  async updateCollectionStatus(
    requestId: string,
    status: CollectionStatus,
    assignedVehicle?: string
  ): Promise<ApiResponse<CollectionRequest>> {
    const updated = await sellerRepository.updateCollectionStatus(
      requestId,
      status,
      assignedVehicle
    );
    return wrap(updated, `Collection updated to ${status}`);
  },
};
