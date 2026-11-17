import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { ProductsService } from '@/src/services/products.service';
import { ProductCategory } from '@/src/types/product';
import { DataStateView } from '@/src/components/ui/DataStateView';
import { SafeImage } from '@/src/components/ui/SafeImage';

export function CategoriesPage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    ProductsService.getCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load categories'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="max-w-2xl space-y-2">
        <p className="text-xs font-medium text-[#A45C3B]">Curated Odisha Craft Taxonomy</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#302B27]">
          Browse Handmade Categories
        </h1>
        <p className="text-sm sm:text-base text-[#6B625B]">
          Every category represents a livelihood skill practiced by rural women
          and Self-Help Groups across Odisha.
        </p>
      </div>

      <DataStateView
        isLoading={isLoading}
        error={error}
        isEmpty={categories.length === 0}
        skeletonCount={4}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group grid grid-cols-1 sm:grid-cols-12 rounded-xl border border-[#E5DCD0] bg-white overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="sm:col-span-5 aspect-[4/3] sm:aspect-auto bg-[#EFE7DA] overflow-hidden">
                <SafeImage
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <div className="sm:col-span-7 p-5 flex flex-col justify-between gap-4">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-[#A45C3B]">
                    {cat.odishaOriginHighlight} · {cat.productCount ?? 0} Products
                  </p>
                  <h2 className="font-serif text-xl font-bold text-[#302B27] group-hover:text-[#A45C3B]">
                    {cat.name}
                  </h2>
                  <p className="text-sm text-[#6B625B] leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#302B27] group-hover:text-[#A45C3B]">
                  <span>Browse Collection</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </DataStateView>
    </div>
  );
}
