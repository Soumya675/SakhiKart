import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';
import { cn, formatINR } from '@/src/lib/utils';
import { Product } from '@/src/types/product';
import { SafeImage } from '@/src/components/ui/SafeImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);

  return (
    <article className="group flex flex-col rounded-xl border border-[#E5DCD0] bg-white overflow-hidden transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative aspect-[4/3] bg-[#EFE7DA] overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          <SafeImage
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
        <button
          type="button"
          onClick={() => toggleWishlist(product)}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          className={cn(
            'absolute top-3 right-3 h-9 w-9 inline-flex items-center justify-center rounded-full bg-white/95 border border-[#E5DCD0] transition-colors cursor-pointer',
            wishlisted
              ? 'text-[#A45C3B]'
              : 'text-[#6B625B] hover:text-[#A45C3B]'
          )}
        >
          <Heart className={cn('h-4 w-4', wishlisted && 'fill-current')} />
        </button>
      </div>

      <div className="flex-1 p-4 flex flex-col justify-between gap-3">
        <div className="space-y-1.5">
          {/* Clean unboxed metadata with typographic separator */}
          <div className="flex items-center gap-1.5 text-xs text-[#6B625B] truncate">
            <span className="font-medium text-[#A45C3B]">{product.categoryName}</span>
            <span aria-hidden="true">·</span>
            <span>{product.originDistrict}, Odisha</span>
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="block font-serif text-lg font-semibold text-[#302B27] leading-snug hover:text-[#A45C3B] transition-colors line-clamp-2"
          >
            {product.name}
          </Link>

          <p className="text-xs text-[#6B625B] truncate">
            By {product.sellerName}
          </p>
        </div>

        <div className="pt-2 border-t border-[#F0E8DC] space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-[#302B27] tabular-nums">
                {formatINR(product.price)}
              </span>
              {product.compareAtPrice ? (
                <span className="text-xs text-[#6B625B] line-through tabular-nums">
                  {formatINR(product.compareAtPrice)}
                </span>
              ) : null}
            </div>

            <div className="flex items-center gap-1 text-xs text-[#302B27] tabular-nums">
              <Star className="h-3.5 w-3.5 fill-[#D9A441] text-[#D9A441]" />
              <span className="font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-[#6B625B]">({product.reviewCount})</span>
            </div>
          </div>

          <button
            type="button"
            disabled={product.stockQuantity <= 0}
            onClick={() => addToCart(product, 1)}
            className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-lg bg-[#302B27] text-white text-sm font-medium hover:bg-[#A45C3B] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{product.stockQuantity > 0 ? 'Add to Bag' : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </article>
  );
}
