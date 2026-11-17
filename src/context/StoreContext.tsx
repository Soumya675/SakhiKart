import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useLocalStorageState } from '@/src/hooks/useLocalStorageState';
import { DEMO_CUSTOMER } from '@/src/lib/mock-data/orders';
import { APP_CONFIG } from '@/src/lib/api/config';
import { LanguageCode } from '@/src/types/common';
import { CartItem, CustomerProfile } from '@/src/types/order';
import { Product } from '@/src/types/product';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  tone: 'success' | 'info' | 'error';
}

interface StoreContextValue {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  shippingFee: number;
  cartTotal: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  wishlistIds: string[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  sellerLanguage: LanguageCode;
  setSellerLanguage: (lang: LanguageCode) => void;
  customer: CustomerProfile | null;
  loginCustomerDemo: (email?: string, name?: string) => void;
  logoutCustomer: () => void;
  activeSellerId: string;
  setActiveSellerId: (sellerId: string) => void;
  toasts: ToastMessage[];
  pushToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart, resetCart] = useLocalStorageState<CartItem[]>(
    'sakhikart_cart_v1',
    []
  );
  const [wishlistIds, setWishlistIds] = useLocalStorageState<string[]>(
    'sakhikart_wishlist_v1',
    ['prod-03', 'prod-06']
  );
  const [sellerLanguage, setSellerLanguage] = useLocalStorageState<LanguageCode>(
    'sakhikart_seller_lang_v1',
    'en'
  );
  const [customer, setCustomer] = useLocalStorageState<CustomerProfile | null>(
    'sakhikart_customer_demo_v1',
    DEMO_CUSTOMER
  );
  const [activeSellerId, setActiveSellerId] = useLocalStorageState<string>(
    'sakhikart_active_seller_v1',
    'seller-maa-shakti-shg'
  );

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<ToastMessage, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
      setTimeout(() => {
        dismissToast(id);
      }, 3600);
    },
    [dismissToast]
  );

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      setCart((prev) => {
        const existing = prev.find((i) => i.productId === product.id);
        if (existing) {
          const nextQty = Math.min(existing.quantity + quantity, product.stockQuantity);
          return prev.map((i) =>
            i.productId === product.id ? { ...i, quantity: nextQty } : i
          );
        }
        return [
          ...prev,
          {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            unitLabel: product.unitLabel,
            imageUrl: product.imageUrl,
            sellerName: product.sellerName,
            originDistrict: product.originDistrict,
            quantity: Math.min(quantity, product.stockQuantity),
            maxStock: product.stockQuantity,
          },
        ];
      });
      pushToast({
        title: 'Added to bag',
        description: `${product.name} (${quantity} ×)`,
        tone: 'success',
      });
      setIsCartDrawerOpen(true);
    },
    [setCart, pushToast]
  );

  const updateCartQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        setCart((prev) => prev.filter((i) => i.productId !== productId));
        return;
      }
      setCart((prev) =>
        prev.map((i) =>
          i.productId === productId
            ? { ...i, quantity: Math.min(quantity, i.maxStock) }
            : i
        )
      );
    },
    [setCart]
  );

  const removeFromCart = useCallback(
    (productId: string) => {
      setCart((prev) => prev.filter((i) => i.productId !== productId));
      pushToast({ title: 'Removed from bag', tone: 'info' });
    },
    [setCart, pushToast]
  );

  const clearCart = useCallback(() => {
    resetCart();
  }, [resetCart]);

  const toggleWishlist = useCallback(
    (product: Product) => {
      const exists = wishlistIds.includes(product.id);
      setWishlistIds((prev) =>
        exists ? prev.filter((id) => id !== product.id) : [...prev, product.id]
      );
      pushToast({
        title: exists ? 'Removed from wishlist' : 'Saved to wishlist',
        description: product.name,
        tone: 'info',
      });
    },
    [wishlistIds, setWishlistIds, pushToast]
  );

  const isWishlisted = useCallback(
    (productId: string) => wishlistIds.includes(productId),
    [wishlistIds]
  );

  const loginCustomerDemo = useCallback(
    (email?: string, name?: string) => {
      setCustomer({
        ...DEMO_CUSTOMER,
        email: email || DEMO_CUSTOMER.email,
        fullName: name || DEMO_CUSTOMER.fullName,
      });
      pushToast({
        title: 'Signed in (Demo Account)',
        description: `Welcome back, ${name || DEMO_CUSTOMER.fullName}`,
        tone: 'success',
      });
    },
    [setCustomer, pushToast]
  );

  const logoutCustomer = useCallback(() => {
    setCustomer(null);
    pushToast({ title: 'Signed out', tone: 'info' });
  }, [setCustomer, pushToast]);

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );
  const cartSubtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );
  const shippingFee =
    cartSubtotal === 0 || cartSubtotal >= APP_CONFIG.freeShippingThreshold
      ? 0
      : APP_CONFIG.standardShippingFee;
  const cartTotal = cartSubtotal + shippingFee;

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        shippingFee,
        cartTotal,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlistIds,
        toggleWishlist,
        isWishlisted,
        sellerLanguage,
        setSellerLanguage,
        customer,
        loginCustomerDemo,
        logoutCustomer,
        activeSellerId,
        setActiveSellerId,
        toasts,
        pushToast,
        dismissToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
