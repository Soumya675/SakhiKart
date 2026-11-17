import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';
import { APP_CONFIG } from '@/src/lib/api/config';
import { formatINR } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/Button';
import { SafeImage } from '@/src/components/ui/SafeImage';

export function CartDrawer() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    shippingFee,
    cartTotal,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
  } = useStore();

  if (!isCartDrawerOpen) return null;

  const remainingForFree = Math.max(0, APP_CONFIG.freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="fixed inset-0 bg-[#302B27]/45 backdrop-blur-[2px]"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <aside
        aria-label="Shopping bag drawer"
        className="relative z-10 w-full max-w-md bg-[#FBF8F3] h-full flex flex-col border-l border-[#E5DCD0] shadow-2xl"
      >
        <div className="px-5 py-4 border-b border-[#E5DCD0] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#A45C3B]" />
            <h2 className="font-serif text-lg font-semibold text-[#302B27]">
              Your Bag ({cartCount})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(false)}
            aria-label="Close shopping bag"
            className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-[#F7F1E7] text-[#302B27] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {cart.length > 0 ? (
          <div className="px-5 py-2.5 bg-[#456B50]/10 border-b border-[#456B50]/15 text-xs text-[#456B50] font-medium">
            {remainingForFree === 0
              ? 'Free Hub-to-Home delivery unlocked on this order.'
              : `Add ${formatINR(remainingForFree)} more to unlock free delivery across India.`}
          </div>
        ) : null}

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
              <ShoppingBag className="h-10 w-10 text-[#A45C3B]/50" />
              <p className="font-serif text-lg font-semibold text-[#302B27]">
                Your bag is empty
              </p>
              <p className="text-sm text-[#6B625B] max-w-xs">
                Explore handmade pickles, Sambalpuri weaves, bamboo baskets, and
                heritage crafts by rural women makers.
              </p>
              <Link
                to="/shop"
                onClick={() => setIsCartDrawerOpen(false)}
                className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-[#A45C3B] text-white text-sm font-medium hover:bg-[#8A4A2E]"
              >
                Explore Marketplace
              </Link>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.productId}
                className="flex gap-3.5 rounded-xl border border-[#E5DCD0] bg-white p-3"
              >
                <Link
                  to={`/product/${item.slug}`}
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-[#F7F1E7]"
                >
                  <SafeImage
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full"
                  />
                </Link>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={() => setIsCartDrawerOpen(false)}
                        className="text-sm font-semibold text-[#302B27] hover:text-[#A45C3B] line-clamp-1"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId)}
                        aria-label={`Remove ${item.name}`}
                        className="text-[#6B625B] hover:text-[#B9382C] p-0.5 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-xs text-[#6B625B] mt-0.5 truncate">
                      {item.sellerName} · {item.unitLabel}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="inline-flex items-center border border-[#D5C9B8] rounded-lg bg-[#FBF8F3]">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          updateCartQuantity(item.productId, item.quantity - 1)
                        }
                        className="h-7 w-7 inline-flex items-center justify-center text-[#302B27] hover:bg-[#EFE6D8] cursor-pointer"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center text-xs font-semibold tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() =>
                          updateCartQuantity(item.productId, item.quantity + 1)
                        }
                        className="h-7 w-7 inline-flex items-center justify-center text-[#302B27] hover:bg-[#EFE6D8] cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-[#302B27] tabular-nums">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 ? (
          <div className="border-t border-[#E5DCD0] bg-white p-5 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#6B625B]">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-[#302B27]">
                  {formatINR(cartSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[#6B625B]">
                <span>Delivery</span>
                <span className="tabular-nums font-medium text-[#456B50]">
                  {shippingFee === 0 ? 'Free' : formatINR(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#E5DCD0] text-base font-semibold text-[#302B27]">
                <span>Total</span>
                <span className="tabular-nums">{formatINR(cartTotal)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Link
                to="/cart"
                onClick={() => setIsCartDrawerOpen(false)}
                className="h-11 inline-flex items-center justify-center rounded-lg border border-[#D5C9B8] text-sm font-medium text-[#302B27] hover:bg-[#F7F1E7]"
              >
                View Bag
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="h-11 inline-flex items-center justify-center rounded-lg bg-[#A45C3B] text-white text-sm font-medium hover:bg-[#8A4A2E]"
              >
                Checkout
              </Link>
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
