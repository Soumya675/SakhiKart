import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';
import { APP_CONFIG } from '@/src/lib/api/config';
import { formatINR } from '@/src/lib/utils';
import { Button } from '@/src/components/ui/Button';
import { SafeImage } from '@/src/components/ui/SafeImage';

export function CartPage() {
  const {
    cart,
    cartCount,
    cartSubtotal,
    shippingFee,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
  } = useStore();
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#E5DCD0] pb-5">
        <h1 className="font-serif text-3xl font-bold text-[#302B27]">
          Your Shopping Bag ({cartCount})
        </h1>
        <p className="text-sm text-[#6B625B] mt-1">
          Every item directly supports rural women artisans and SHG collectives in Odisha.
        </p>
      </div>

      {cart.length === 0 ? (
        <div className="rounded-2xl border border-[#E5DCD0] bg-white p-12 text-center space-y-4">
          <ShoppingBag className="h-10 w-10 text-[#A45C3B]/60 mx-auto" />
          <h2 className="font-serif text-2xl font-semibold text-[#302B27]">
            Your bag is currently empty
          </h2>
          <p className="text-sm text-[#6B625B] max-w-md mx-auto">
            Browse our collection of homemade pickles, Sambalpuri sarees,
            bamboo homeware, and Pattachitra artworks.
          </p>
          <Button onClick={() => navigate('/shop')}>Explore Marketplace</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="rounded-xl border border-[#E5DCD0] bg-white p-4 flex flex-col sm:flex-row gap-4 sm:items-center"
              >
                <Link
                  to={`/product/${item.slug}`}
                  className="w-full sm:w-28 aspect-[4/3] rounded-lg overflow-hidden bg-[#EFE7DA] shrink-0"
                >
                  <SafeImage src={item.imageUrl} alt={item.name} className="w-full h-full" />
                </Link>

                <div className="flex-1 min-w-0 space-y-1">
                  <Link
                    to={`/product/${item.slug}`}
                    className="font-serif text-lg font-semibold text-[#302B27] hover:text-[#A45C3B] block"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-[#6B625B]">
                    Made by {item.sellerName} · {item.originDistrict} · {item.unitLabel}
                  </p>
                  <p className="text-sm font-semibold text-[#302B27] tabular-nums pt-1">
                    {formatINR(item.price)} each
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4">
                  <div className="inline-flex items-center border border-[#D5C9B8] rounded-lg bg-[#FBF8F3]">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      aria-label="Decrease quantity"
                      className="h-9 w-9 inline-flex items-center justify-center hover:bg-[#EFE6D8] cursor-pointer"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-9 text-center text-sm font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      aria-label="Increase quantity"
                      className="h-9 w-9 inline-flex items-center justify-center hover:bg-[#EFE6D8] cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <span className="text-base font-bold text-[#302B27] tabular-nums w-20 text-right">
                    {formatINR(item.price * item.quantity)}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId)}
                    aria-label="Remove item"
                    className="p-2 text-[#6B625B] hover:text-[#B9382C] cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <aside className="lg:col-span-4 rounded-xl border border-[#E5DCD0] bg-white p-6 space-y-5 lg:sticky lg:top-24">
            <h2 className="font-serif text-xl font-bold text-[#302B27]">
              Order Summary
            </h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-[#6B625B]">
                <span>Subtotal</span>
                <span className="tabular-nums font-medium text-[#302B27]">
                  {formatINR(cartSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[#6B625B]">
                <span>Hub-Checked Shipping</span>
                <span className="tabular-nums font-medium text-[#456B50]">
                  {shippingFee === 0 ? 'Free' : formatINR(shippingFee)}
                </span>
              </div>
              {cartSubtotal < APP_CONFIG.freeShippingThreshold ? (
                <p className="text-xs text-[#A45C3B]">
                  Add {formatINR(APP_CONFIG.freeShippingThreshold - cartSubtotal)} more for free shipping.
                </p>
              ) : null}
              <div className="pt-3 border-t border-[#E5DCD0] flex justify-between text-base font-bold text-[#302B27]">
                <span>Estimated Total</span>
                <span className="tabular-nums">{formatINR(cartTotal)}</span>
              </div>
            </div>

            <Button size="lg" className="w-full" onClick={() => navigate('/checkout')}>
              <span>Proceed to Checkout</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Link
              to="/shop"
              className="block text-center text-xs font-medium text-[#6B625B] hover:text-[#A45C3B]"
            >
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
