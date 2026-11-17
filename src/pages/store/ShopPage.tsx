import React, { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { ProductsService } from '@/src/services/products.service';
import { Product, ProductCategory, ProductSortOption } from '@/src/types/product';
import { ProductCard } from '@/src/components/marketplace/ProductCard';
import { DataStateView } from '@/src/components/ui/DataStateView';
import { formatINR } from '@/src/lib/utils';

const DISTRICTS = ['all', 'Puri', 'Bargarh', 'Koraput', 'Mayurbhanj'];

export function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [categorySlug, setCategorySlug] = useState(initialCategory);
  const [search, setSearch] = useState(initialQuery);
  const [district, setDistrict] = useState('all');
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sort, setSort] = useState<ProductSortOption>('featured');

  useEffect(() => {
    setCategorySlug(searchParams.get('category') || 'all');
  }, [searchParams]);

  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [catRes, prodRes] = await Promise.all([
        ProductsService.getCategories(),
        ProductsService.listProducts({
          categorySlug,
          search,
          district,
          maxPrice,
          sort,
        }),
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load products');
    } finally {
      setIsLoading(false);
    }
  }, [categorySlug, search, district, maxPrice, sort]);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const clearFilters = () => {
    setCategorySlug('all');
    setSearch('');
    setDistrict('all');
    setMaxPrice(5000);
    setSort('featured');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5DCD0] pb-6">
        <div>
          <p className="text-xs font-medium text-[#A45C3B]">
            Quality-Verified Handmade Marketplace
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#302B27] mt-1">
            Shop Artisanal Goods
          </h1>
          <p className="text-sm text-[#6B625B] mt-1">
            Showing {products.length} verified handmade products from Odisha’s women makers.
          </p>
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="h-4 w-4 text-[#6B625B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pickles, sarees, bamboo..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-[#D5C9B8] bg-white text-sm text-[#302B27] focus:outline-none focus:ring-2 focus:ring-[#A45C3B]/30"
            />
          </div>

          <select
            aria-label="Sort products"
            value={sort}
            onChange={(e) => setSort(e.target.value as ProductSortOption)}
            className="h-10 px-3 rounded-lg border border-[#D5C9B8] bg-white text-sm text-[#302B27] focus:outline-none"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating_desc">Top Rated</option>
            <option value="newest">Newest Arrivals</option>
          </select>
        </div>
      </div>

      {/* Filters Row */}
      <div className="rounded-xl border border-[#E5DCD0] bg-white p-4 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#302B27]">
            <SlidersHorizontal className="h-4 w-4 text-[#A45C3B]" />
            <span>Filter Catalog</span>
          </div>
          {(categorySlug !== 'all' || search || district !== 'all' || maxPrice < 5000) ? (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#A45C3B] hover:underline cursor-pointer"
            >
              <X className="h-3.5 w-3.5" /> Clear Filters
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setCategorySlug('all');
              setSearchParams({});
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              categorySlug === 'all'
                ? 'bg-[#302B27] text-white'
                : 'bg-[#F7F1E7] text-[#302B27] hover:bg-[#EFE6D8]'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setCategorySlug(cat.slug);
                setSearchParams({ category: cat.slug });
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                categorySlug === cat.slug
                  ? 'bg-[#A45C3B] text-white'
                  : 'bg-[#F7F1E7] text-[#302B27] hover:bg-[#EFE6D8]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#F0E8DC]">
          <div className="flex items-center gap-3">
            <label htmlFor="district-filter" className="text-xs font-medium text-[#6B625B] whitespace-nowrap">
              Odisha District:
            </label>
            <select
              id="district-filter"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="h-9 px-3 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] text-xs font-medium text-[#302B27]"
            >
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d === 'all' ? 'All Districts' : d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label htmlFor="price-range" className="text-xs font-medium text-[#6B625B] whitespace-nowrap">
              Max Price: <span className="font-semibold text-[#302B27] tabular-nums">{formatINR(maxPrice)}</span>
            </label>
            <input
              id="price-range"
              type="range"
              min={250}
              max={5000}
              step={50}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="flex-1 accent-[#A45C3B]"
            />
          </div>
        </div>
      </div>

      <DataStateView
        isLoading={isLoading}
        error={error}
        isEmpty={products.length === 0}
        emptyTitle="No matching handmade products"
        emptyDescription="Try raising the price limit or clearing your category and district filters."
        emptyActionLabel="Reset All Filters"
        onEmptyAction={clearFilters}
        onRetry={loadCatalog}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </DataStateView>
    </div>
  );
}
