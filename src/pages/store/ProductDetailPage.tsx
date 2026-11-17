import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  CheckCircle2,
  Heart,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';
import { formatINR } from '@/src/lib/utils';
import { ProductsService } from '@/src/services/products.service';
import { SellersService } from '@/src/services/sellers.service';
import { Product } from '@/src/types/product';
import { Seller } from '@/src/types/seller';
import { DataStateView } from '@/src/components/ui/DataStateView';
import { SafeImage } from '@/src/components/ui/SafeImage';
import { Button } from '@/src/components/ui/Button';
import { ProductCard } from '@/src/components/marketplace/ProductCard';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [maker, setMaker] = useState<Seller | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'craft' | 'care'>('details');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!slug) return;
      setIsLoading(true);
      setError(null);
      setQuantity(1);
      try {
        const res = await ProductsService.getProductBySlug(slug);
        if (!active) return;
        const found = res.data;
        setProduct(found);
        if (found) {
          setSelectedImage(found.imageUrl);
          const [sellerRes, relRes] = await Promise.all([
            SellersService.getSellerById(found.sellerId),
            ProductsService.listProducts({ categorySlug: found.categorySlug }),
          ]);
          if (!active) return;
          setMaker(sellerRes.data);
          setRelated(relRes.data.filter((p) => p.id !== found.id).slice(0, 4));
        }
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Unable to load product');
      } finally {
        if (active) setIsLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <DataStateView
        isLoading={isLoading}
        error={error}
        isEmpty={!product}
        emptyTitle="Product not found"
        emptyDescription="This handmade item may have moved or been archived."
        emptyActionLabel="Back to Shop"
        onEmptyAction={() => window.history.back()}
      >
        {product ? (
          <div className="space-y-14">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-xs text-[#6B625B] flex flex-wrap items-center gap-1.5">
              <Link to="/" className="hover:text-[#A45C3B]">Home</Link>
              <span>/</span>
              <Link to={`/shop?category=${product.categorySlug}`} className="hover:text-[#A45C3B]">
                {product.categoryName}
              </Link>
              <span>/</span>
              <span className="text-[#302B27] font-medium truncate">{product.name}</span>
            </nav>

            {/* Gallery + Contiguous Purchase Module */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* Left Gallery */}
              <div className="lg:col-span-6 space-y-3 lg:sticky lg:top-24">
                <div className="aspect-[4/3] rounded-2xl border border-[#E5DCD0] bg-white overflow-hidden">
                  <SafeImage
                    src={selectedImage || product.imageUrl}
                    alt={product.name}
                    className="w-full h-full"
                  />
                </div>
                {product.galleryUrls.length > 1 ? (
                  <div className="flex gap-3">
                    {product.galleryUrls.map((url, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedImage(url)}
                        className={`w-20 h-20 rounded-lg overflow-hidden border-2 cursor-pointer ${
                          selectedImage === url ? 'border-[#A45C3B]' : 'border-[#E5DCD0]'
                        }`}
                      >
                        <SafeImage src={url} alt={`${product.name} view ${index + 1}`} className="w-full h-full" />
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Right Purchase Module */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B625B]">
                    <span className="font-semibold text-[#A45C3B]">{product.categoryName}</span>
                    <span>·</span>
                    <span>Crafted in {product.originDistrict}, Odisha</span>
                    <span>·</span>
                    <span className="font-mono">{product.sku}</span>
                  </div>

                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#302B27] leading-tight">
                    {product.name}
                  </h1>

                  <p className="text-sm sm:text-base text-[#6B625B] leading-relaxed">
                    {product.shortDescription}
                  </p>

                  <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-1 text-sm tabular-nums">
                      <Star className="h-4 w-4 fill-[#D9A441] text-[#D9A441]" />
                      <span className="font-semibold text-[#302B27]">{product.rating.toFixed(1)}</span>
                      <span className="text-[#6B625B]">({product.reviewCount} verified reviews)</span>
                    </div>
                    <span className="text-[#E5DCD0]">|</span>
                    <span className={`text-xs font-semibold ${product.stockQuantity > 0 ? 'text-[#456B50]' : 'text-[#B9382C]'}`}>
                      {product.stockQuantity > 0
                        ? `In Stock (${product.stockQuantity} available)`
                        : 'Currently Sold Out'}
                    </span>
                  </div>
                </div>

                {/* Price & Purchase Controls */}
                <div className="rounded-xl border border-[#E5DCD0] bg-white p-5 space-y-4">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-serif text-3xl font-bold text-[#302B27] tabular-nums">
                        {formatINR(product.price)}
                      </span>
                      {product.compareAtPrice ? (
                        <span className="text-base text-[#6B625B] line-through tabular-nums">
                          {formatINR(product.compareAtPrice)}
                        </span>
                      ) : null}
                    </div>
                    <span className="text-xs font-medium text-[#6B625B]">
                      Pack / Unit: {product.unitLabel}
                    </span>
                  </div>

                  <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
                    <div className="inline-flex items-center h-12 border border-[#D5C9B8] rounded-lg bg-[#FBF8F3]">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-11 h-full inline-flex items-center justify-center hover:bg-[#EFE6D8] cursor-pointer"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold tabular-nums">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQuantity((q) => Math.min(product.stockQuantity, q + 1))}
                        className="w-11 h-full inline-flex items-center justify-center hover:bg-[#EFE6D8] cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <Button
                      size="lg"
                      disabled={product.stockQuantity <= 0}
                      onClick={() => addToCart(product, quantity)}
                      className="flex-1"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add to Bag · {formatINR(product.price * quantity)}</span>
                    </Button>

                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      aria-label="Toggle wishlist"
                      className={`h-12 w-12 inline-flex items-center justify-center rounded-lg border border-[#D5C9B8] cursor-pointer transition-colors ${
                        isWishlisted(product.id)
                          ? 'bg-[#A45C3B]/10 text-[#A45C3B] border-[#A45C3B]/40'
                          : 'bg-white text-[#302B27] hover:bg-[#F7F1E7]'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isWishlisted(product.id) ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="pt-3 border-t border-[#F0E8DC] grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#6B625B]">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-[#456B50] shrink-0" />
                      <span>Free shipping above ₹999 · COD available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-[#456B50] shrink-0" />
                      <span>Hub quality checked before dispatch</span>
                    </div>
                  </div>
                </div>

                {/* Product Tabs */}
                <div className="rounded-xl border border-[#E5DCD0] bg-white overflow-hidden">
                  <div className="flex border-b border-[#E5DCD0] bg-[#FBF8F3]">
                    {[
                      { id: 'details', label: 'About Product' },
                      { id: 'craft', label: 'Materials & Method' },
                      { id: 'care', label: 'Shelf Life & Care' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex-1 py-3 px-4 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 cursor-pointer transition-colors ${
                          activeTab === tab.id
                            ? 'border-[#A45C3B] text-[#A45C3B] bg-white'
                            : 'border-transparent text-[#6B625B] hover:text-[#302B27]'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="p-5 text-sm text-[#302B27] leading-relaxed">
                    {activeTab === 'details' ? <p>{product.description}</p> : null}
                    {activeTab === 'craft' ? (
                      <div className="space-y-2">
                        <p><strong className="font-semibold">Craft Method:</strong> {product.craftMethod}</p>
                        <p><strong className="font-semibold">Ingredients / Materials:</strong> {product.materialsOrIngredients}</p>
                      </div>
                    ) : null}
                    {activeTab === 'care' ? <p>{product.shelfLifeOrCare}</p> : null}
                  </div>
                </div>

                {/* Maker Story Card */}
                {maker ? (
                  <div className="rounded-xl border border-[#E5DCD0] bg-white p-5 flex items-start gap-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[#EFE7DA] shrink-0">
                      <SafeImage src={maker.avatarUrl} alt={maker.displayName} className="w-full h-full" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#456B50] font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Verified SakhiKart Maker</span>
                      </div>
                      <Link
                        to={`/makers/${maker.slug}`}
                        className="font-serif text-lg font-bold text-[#302B27] hover:text-[#A45C3B] block"
                      >
                        {maker.displayName}
                      </Link>
                      <p className="text-xs text-[#6B625B] flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>{maker.village}, {maker.district}, {maker.state}</span>
                      </p>
                      <p className="text-xs text-[#6B625B] line-clamp-2 pt-1">{maker.story}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Related Products */}
            {related.length > 0 ? (
              <section className="pt-8 border-t border-[#E5DCD0]">
                <h2 className="font-serif text-2xl font-bold text-[#302B27] mb-6">
                  More From This Craft Tradition
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {related.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : null}
      </DataStateView>
    </div>
  );
}
