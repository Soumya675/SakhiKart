import { DEMO_COLLECTION_REQUESTS } from '@/src/lib/mock-data/operations';
import { DEMO_ASSETS } from '@/src/lib/mock-data/images';
import { DEMO_PAYOUTS, DEMO_SELLERS } from '@/src/lib/mock-data/sellers';
import { slugify } from '@/src/lib/utils';
import {
  CollectionRequest,
  CollectionStatus,
  Seller,
  SellerOnboardingInput,
  SellerPayout,
  SellerStatus,
} from '@/src/types/seller';
import { APP_CONFIG, simulateLatency } from './config';
import { readDemoCollection, writeDemoCollection } from './storage-helper';

const STORAGE_KEY_SELLERS = 'sakhikart_demo_sellers_v1';
const STORAGE_KEY_COLLECTIONS = 'sakhikart_demo_collections_v1';

export interface ISellerRepository {
  listSellers(includePending?: boolean): Promise<Seller[]>;
  getSellerBySlug(slug: string): Promise<Seller | null>;
  getSellerById(id: string): Promise<Seller | null>;
  onboardSeller(input: SellerOnboardingInput): Promise<Seller>;
  updateSellerStatus(sellerId: string, status: SellerStatus): Promise<Seller>;
  listPayouts(sellerId?: string): Promise<SellerPayout[]>;
  listCollectionRequests(sellerId?: string): Promise<CollectionRequest[]>;
  createCollectionRequest(
    input: Omit<CollectionRequest, 'id' | 'status' | 'createdAt'>
  ): Promise<CollectionRequest>;
  updateCollectionStatus(
    requestId: string,
    status: CollectionStatus,
    assignedVehicle?: string
  ): Promise<CollectionRequest>;
}

class DemoSellerRepository implements ISellerRepository {
  private getAllSellers(): Seller[] {
    return readDemoCollection<Seller[]>(STORAGE_KEY_SELLERS, DEMO_SELLERS);
  }

  private saveSellers(sellers: Seller[]): void {
    writeDemoCollection(STORAGE_KEY_SELLERS, sellers);
  }

  private getAllCollections(): CollectionRequest[] {
    return readDemoCollection<CollectionRequest[]>(
      STORAGE_KEY_COLLECTIONS,
      DEMO_COLLECTION_REQUESTS
    );
  }

  private saveCollections(collections: CollectionRequest[]): void {
    writeDemoCollection(STORAGE_KEY_COLLECTIONS, collections);
  }

  async listSellers(includePending = false): Promise<Seller[]> {
    await simulateLatency(120);
    const all = this.getAllSellers();
    return includePending ? all : all.filter((s) => s.status === 'verified');
  }

  async getSellerBySlug(slug: string): Promise<Seller | null> {
    await simulateLatency(100);
    return this.getAllSellers().find((s) => s.slug === slug) ?? null;
  }

  async getSellerById(id: string): Promise<Seller | null> {
    await simulateLatency(90);
    return this.getAllSellers().find((s) => s.id === id) ?? null;
  }

  async onboardSeller(input: SellerOnboardingInput): Promise<Seller> {
    await simulateLatency(240);
    const existing = this.getAllSellers();
    const newSeller: Seller = {
      id: `seller-${Date.now()}`,
      sellerType: input.sellerType,
      displayName: input.displayName,
      slug: `${slugify(input.displayName)}-${Date.now().toString().slice(-3)}`,
      groupMemberCount: input.sellerType === 'shg' ? input.groupMemberCount ?? 10 : undefined,
      leaderName: input.leaderName,
      phone: input.phone,
      village: input.village,
      block: input.block,
      district: input.district,
      state: input.state,
      preferredLanguage: input.preferredLanguage,
      specialties: input.specialties,
      story: input.story,
      avatarUrl:
        input.sellerType === 'shg' ? DEMO_ASSETS.makerKalyani : DEMO_ASSETS.makerSita,
      status: 'pending',
      totalEarnings: 0,
      pendingPayout: 0,
      productsCount: 0,
      rating: 5.0,
      joinedAt: new Date().toISOString(),
    };
    this.saveSellers([newSeller, ...existing]);
    return newSeller;
  }

  async updateSellerStatus(sellerId: string, status: SellerStatus): Promise<Seller> {
    await simulateLatency(140);
    const existing = this.getAllSellers();
    const found = existing.find((s) => s.id === sellerId);
    if (!found) throw new Error('Seller profile not found.');
    const updated = { ...found, status };
    this.saveSellers(existing.map((s) => (s.id === sellerId ? updated : s)));
    return updated;
  }

  async listPayouts(sellerId?: string): Promise<SellerPayout[]> {
    await simulateLatency(110);
    if (!sellerId) return DEMO_PAYOUTS;
    return DEMO_PAYOUTS.filter((p) => p.sellerId === sellerId);
  }

  async listCollectionRequests(sellerId?: string): Promise<CollectionRequest[]> {
    await simulateLatency(110);
    const all = this.getAllCollections();
    return sellerId ? all.filter((c) => c.sellerId === sellerId) : all;
  }

  async createCollectionRequest(
    input: Omit<CollectionRequest, 'id' | 'status' | 'createdAt'>
  ): Promise<CollectionRequest> {
    await simulateLatency(180);
    const existing = this.getAllCollections();
    const record: CollectionRequest = {
      ...input,
      id: `col-${Date.now().toString().slice(-4)}`,
      status: 'requested',
      createdAt: new Date().toISOString(),
    };
    this.saveCollections([record, ...existing]);
    return record;
  }

  async updateCollectionStatus(
    requestId: string,
    status: CollectionStatus,
    assignedVehicle?: string
  ): Promise<CollectionRequest> {
    await simulateLatency(140);
    const existing = this.getAllCollections();
    const target = existing.find((c) => c.id === requestId);
    if (!target) throw new Error('Collection request not found.');
    const updated: CollectionRequest = {
      ...target,
      status,
      assignedVehicle: assignedVehicle ?? target.assignedVehicle,
    };
    this.saveCollections(existing.map((c) => (c.id === requestId ? updated : c)));
    return updated;
  }
}

export const sellerRepository: ISellerRepository =
  APP_CONFIG.dataMode === 'production'
    ? new DemoSellerRepository()
    : new DemoSellerRepository();
