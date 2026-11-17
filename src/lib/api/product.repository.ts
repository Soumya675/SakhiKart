import { DEMO_CATEGORIES } from '@/src/lib/mock-data/categories';
import { DEMO_PRODUCTS } from '@/src/lib/mock-data/products';
import { DEMO_ASSETS } from '@/src/lib/mock-data/images';
import { slugify } from '@/src/lib/utils';
import {
  Product,
  ProductCategory,
  ProductFilterParams,
  ProductStatus,
  ProductSubmissionInput,
} from '@/src/types/product';
import { APP_CONFIG, simulateLatency } from './config';
import { readDemoCollection, writeDemoCollection } from './storage-helper';

const STORAGE_KEY_PRODUCTS = 'sakhikart_demo_products_v1';

export interface IProductRepository {
  getCategories(): Promise<ProductCategory[]>;
  listProducts(filters?: ProductFilterParams): Promise<Product[]>;
  getProductBySlug(slug: string): Promise<Product | null>;
  getProductsBySeller(sellerId: string): Promise<Product[]>;
  submitProduct(input: ProductSubmissionInput): Promise<Product>;
  updateProductStatus(productId: string, status: ProductStatus): Promise<Product>;
}

class DemoProductRepository implements IProductRepository {
  private getAllRaw(): Product[] {
    return readDemoCollection<Product[]>(STORAGE_KEY_PRODUCTS, DEMO_PRODUCTS);
  }

  private saveAll(products: Product[]): void {
    writeDemoCollection(STORAGE_KEY_PRODUCTS, products);
  }

  async getCategories(): Promise<ProductCategory[]> {
    await simulateLatency(90);
    const products = this.getAllRaw().filter((p) => p.status === 'approved');
    return DEMO_CATEGORIES.map((cat) => ({
      ...cat,
      productCount: products.filter((p) => p.categoryId === cat.id).length,
    }));
  }

  async listProducts(filters?: ProductFilterParams): Promise<Product[]> {
    await simulateLatency(140);
    let items = this.getAllRaw();

    if (!filters?.includeUnapproved) {
      items = items.filter((p) => p.status === 'approved');
    }

    if (filters?.categorySlug && filters.categorySlug !== 'all') {
      items = items.filter((p) => p.categorySlug === filters.categorySlug);
    }

    if (filters?.district && filters.district !== 'all') {
      items = items.filter(
        (p) => p.originDistrict.toLowerCase() === filters.district?.toLowerCase()
      );
    }

    if (typeof filters?.minPrice === 'number') {
      items = items.filter((p) => p.price >= (filters.minPrice ?? 0));
    }

    if (typeof filters?.maxPrice === 'number') {
      items = items.filter((p) => p.price <= (filters.maxPrice ?? Infinity));
    }

    if (filters?.onlyBestSellers) {
      items = items.filter((p) => p.isBestSeller);
    }

    if (filters?.onlyOdishaSpecial) {
      items = items.filter((p) => p.isOdishaSpecial);
    }

    if (filters?.search && filters.search.trim().length > 0) {
      const q = filters.search.trim().toLowerCase();
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q) ||
          p.sellerName.toLowerCase().includes(q) ||
          p.originDistrict.toLowerCase().includes(q)
      );
    }

    switch (filters?.sort) {
      case 'price_asc':
        items = [...items].sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        items = [...items].sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        items = [...items].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        items = [...items].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        items = [...items].sort(
          (a, b) => Number(Boolean(b.isBestSeller)) - Number(Boolean(a.isBestSeller))
        );
        break;
    }

    return items;
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    await simulateLatency(100);
    return this.getAllRaw().find((p) => p.slug === slug) ?? null;
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    await simulateLatency(120);
    return this.getAllRaw().filter((p) => p.sellerId === sellerId);
  }

  async submitProduct(input: ProductSubmissionInput): Promise<Product> {
    await simulateLatency(220);
    const category =
      DEMO_CATEGORIES.find((c) => c.id === input.categoryId) ?? DEMO_CATEGORIES[0];
    const existing = this.getAllRaw();
    const id = `prod-${Date.now()}`;
    const hasCustomPhoto = Boolean(input.uploadedPhotoDataUrl);

    const newProduct: Product = {
      id,
      sku: `SK-NEW-${String(existing.length + 1).padStart(3, '0')}`,
      sellerId: input.sellerId,
      sellerName: input.sellerName,
      sellerDistrict: input.sellerDistrict,
      categoryId: category.id,
      categoryName: category.name,
      categorySlug: category.slug,
      name: input.name,
      slug: `${slugify(input.name)}-${Date.now().toString().slice(-4)}`,
      shortDescription: input.shortDescription,
      description: input.description,
      price: input.price,
      unitLabel: input.unitLabel,
      // Real seller uploads stay separated via isDemoAsset=false
      imageUrl: input.uploadedPhotoDataUrl || category.imageUrl || DEMO_ASSETS.mangoPickle,
      galleryUrls: [input.uploadedPhotoDataUrl || category.imageUrl],
      isDemoAsset: !hasCustomPhoto,
      status: 'pending_verification',
      stockQuantity: input.stockQuantity,
      rating: 4.8,
      reviewCount: 0,
      isBestSeller: false,
      isOdishaSpecial: true,
      craftMethod: input.craftMethod,
      materialsOrIngredients: input.materialsOrIngredients,
      shelfLifeOrCare: input.shelfLifeOrCare,
      originDistrict: input.sellerDistrict,
      createdAt: new Date().toISOString(),
    };

    this.saveAll([newProduct, ...existing]);
    return newProduct;
  }

  async updateProductStatus(productId: string, status: ProductStatus): Promise<Product> {
    await simulateLatency(150);
    const existing = this.getAllRaw();
    const target = existing.find((p) => p.id === productId);
    if (!target) {
      throw new Error('Product record not found.');
    }
    const updated = { ...target, status };
    this.saveAll(existing.map((p) => (p.id === productId ? updated : p)));
    return updated;
  }
}

// Phase 2 swap point: return SupabaseProductRepository when APP_CONFIG.dataMode === 'production'
export const productRepository: IProductRepository =
  APP_CONFIG.dataMode === 'production'
    ? new DemoProductRepository()
    : new DemoProductRepository();
