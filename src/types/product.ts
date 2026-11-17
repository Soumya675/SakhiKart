export type ProductStatus =
  | 'pending_verification'
  | 'approved'
  | 'rejected'
  | 'draft';

export type ProductSortOption =
  | 'featured'
  | 'price_asc'
  | 'price_desc'
  | 'rating_desc'
  | 'newest';

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  odishaOriginHighlight: string;
  productCount?: number;
}

export interface Product {
  id: string;
  sku: string;
  sellerId: string;
  sellerName: string;
  sellerDistrict: string;
  categoryId: string;
  categoryName: string;
  categorySlug: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  unitLabel: string;
  imageUrl: string;
  galleryUrls: string[];
  isDemoAsset: boolean;
  status: ProductStatus;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  isBestSeller?: boolean;
  isOdishaSpecial?: boolean;
  craftMethod: string;
  materialsOrIngredients: string;
  shelfLifeOrCare: string;
  originDistrict: string;
  createdAt: string;
}

export interface ProductFilterParams {
  search?: string;
  categorySlug?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: ProductSortOption;
  onlyBestSellers?: boolean;
  onlyOdishaSpecial?: boolean;
  includeUnapproved?: boolean;
}

export interface ProductSubmissionInput {
  sellerId: string;
  sellerName: string;
  sellerDistrict: string;
  categoryId: string;
  name: string;
  shortDescription: string;
  description: string;
  price: number;
  unitLabel: string;
  stockQuantity: number;
  craftMethod: string;
  materialsOrIngredients: string;
  shelfLifeOrCare: string;
  uploadedPhotoDataUrl?: string;
}
