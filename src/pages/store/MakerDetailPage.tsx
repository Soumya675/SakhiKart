import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, MapPin, Star, Users } from 'lucide-react';
import { ProductsService } from '@/src/services/products.service';
import { SellersService } from '@/src/services/sellers.service';
import { Product } from '@/src/types/product';
import { Seller } from '@/src/types/seller';
import { DataStateView } from '@/src/components/ui/DataStateView';
import { SafeImage } from '@/src/components/ui/SafeImage';
import { ProductCard } from '@/src/components/marketplace/ProductCard';

export function MakerDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    setError(null);
    SellersService.getSellerBySlug(slug)
      .then(async (res) => {
        setSeller(res.data);
        if (res.data) {
          const prodRes = await ProductsService.getProductsBySeller(res.data.id);
          setProducts(prodRes.data.filter((p) => p.status === 'approved'));
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load maker'))
      .finally(() => setIsLoading(false));
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <DataStateView
        isLoading={isLoading}
        error={error}
        isEmpty={!seller}
        emptyTitle="Maker profile not found"
        emptyDescription="Explore other women artisans and Self-Help Groups across Odisha."
        emptyActionLabel="All Makers"
        onEmptyAction={() => window.history.back()}
      >
        {seller ? (
          <>
            <div className="text-xs text-[#6B625B] flex items-center gap-2">
              <Link to="/" className="hover:text-[#A45C3B]">Home</Link>
              <span>/</span>
              <Link to="/makers" className="hover:text-[#A45C3B]">Makers</Link>
              <span>/</span>
              <span className="text-[#302B27] font-medium">{seller.displayName}</span>
            </div>

            <div className="rounded-2xl border border-[#E5DCD0] bg-white p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-4 aspect-square rounded-xl overflow-hidden bg-[#EFE7DA]">
                <SafeImage
                  src={seller.avatarUrl}
                  alt={seller.displayName}
                  className="w-full h-full"
                />
              </div>

              <div className="lg:col-span-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
                  <span className="inline-flex items-center gap-1 text-[#456B50]">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified SakhiKart Maker
                  </span>
                  <span className="text-[#E5DCD0]">|</span>
                  <span className="text-[#A45C3B]">
                    {seller.sellerType === 'shg'
                      ? `Self-Help Group (${seller.groupMemberCount ?? 10} Women)`
                      : 'Individual Woman Artisan'}
                  </span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#302B27]">
                  {seller.displayName}
                </h1>

                <div className="flex flex-wrap gap-4 text-sm text-[#6B625B]">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#A45C3B]" />
                    {seller.village}, {seller.block}, {seller.district}, {seller.state}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-[#A45C3B]" />
                    Lead Coordinator: {seller.leaderName}
                  </span>
                  <span className="inline-flex items-center gap-1 tabular-nums text-[#302B27] font-medium">
                    <Star className="h-4 w-4 fill-[#D9A441] text-[#D9A441]" />
                    {seller.rating.toFixed(1)} Maker Rating
                  </span>
                </div>

                <p className="text-base text-[#302B27] leading-relaxed max-w-3xl">
                  {seller.story}
                </p>

                <div className="pt-2">
                  <p className="text-xs font-medium text-[#6B625B]">
                    Craft & Production Specialties:{' '}
                    <span className="text-[#302B27] font-semibold">
                      {seller.specialties.join(' · ')}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <section className="space-y-6">
              <h2 className="font-serif text-2xl font-bold text-[#302B27]">
                Handmade Creations by {seller.displayName} ({products.length})
              </h2>
              {products.length === 0 ? (
                <p className="text-sm text-[#6B625B]">
                  New batch currently undergoing quality verification at the Bhubaneswar hub.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}
      </DataStateView>
    </div>
  );
}
