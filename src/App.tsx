/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { StoreProvider } from '@/src/context/StoreContext';
import { ToastContainer } from '@/src/components/ui/ToastContainer';
import { StoreLayout } from '@/src/components/layout/StoreLayout';

import { HomePage } from '@/src/pages/store/HomePage';
import { ShopPage } from '@/src/pages/store/ShopPage';
import { CategoriesPage } from '@/src/pages/store/CategoriesPage';
import { ProductDetailPage } from '@/src/pages/store/ProductDetailPage';
import { SearchPage } from '@/src/pages/store/SearchPage';
import { MakersPage } from '@/src/pages/store/MakersPage';
import { MakerDetailPage } from '@/src/pages/store/MakerDetailPage';
import { CartPage } from '@/src/pages/store/CartPage';
import { CheckoutPage } from '@/src/pages/store/CheckoutPage';
import {
  CustomerLoginPage,
  CustomerProfilePage,
  CustomerRegisterPage,
  MyOrdersPage,
  OrderTrackingPage,
} from '@/src/pages/store/CustomerAccountPages';
import { AboutPage, ContactPage, FaqPage } from '@/src/pages/store/InfoPages';

import {
  SellerLoginPage,
  SellerOnboardingPage,
} from '@/src/pages/seller/SellerAuthAndOnboarding';
import {
  SellerDashboardPage,
  SellerEarningsPage,
  SellerOrdersPage,
  SellerProfilePage,
  SellerSupportPage,
} from '@/src/pages/seller/SellerDashboardPages';
import {
  SellerNewProductPage,
  SellerProductsPage,
} from '@/src/pages/seller/SellerProductPages';

import {
  AdminDashboardPage,
  AdminLoginPage,
  AdminProductsPage,
  AdminSellersPage,
} from '@/src/pages/admin/AdminCorePages';
import {
  AdminFinancePage,
  AdminInventoryPage,
  AdminOrdersPage,
  AdminReportsPage,
} from '@/src/pages/admin/AdminFinanceAndReportsPages';

import {
  OperationsCollectionsPage,
  OperationsDashboardPage,
  OperationsDispatchPage,
  OperationsQualityPage,
  OperationsWarehousePage,
} from '@/src/pages/operations/OperationsPages';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <ScrollToTop />
        <Routes>
          {/* Customer Marketplace */}
          <Route path="/" element={<StoreLayout><HomePage /></StoreLayout>} />
          <Route path="/shop" element={<StoreLayout><ShopPage /></StoreLayout>} />
          <Route path="/categories" element={<StoreLayout><CategoriesPage /></StoreLayout>} />
          <Route path="/product/:slug" element={<StoreLayout><ProductDetailPage /></StoreLayout>} />
          <Route path="/search" element={<StoreLayout><SearchPage /></StoreLayout>} />
          <Route path="/makers" element={<StoreLayout><MakersPage /></StoreLayout>} />
          <Route path="/makers/:slug" element={<StoreLayout><MakerDetailPage /></StoreLayout>} />
          <Route path="/cart" element={<StoreLayout><CartPage /></StoreLayout>} />
          <Route path="/checkout" element={<StoreLayout><CheckoutPage /></StoreLayout>} />
          <Route path="/login" element={<StoreLayout><CustomerLoginPage /></StoreLayout>} />
          <Route path="/register" element={<StoreLayout><CustomerRegisterPage /></StoreLayout>} />
          <Route path="/profile" element={<StoreLayout><CustomerProfilePage /></StoreLayout>} />
          <Route path="/orders" element={<StoreLayout><MyOrdersPage /></StoreLayout>} />
          <Route path="/orders/:orderNumber" element={<StoreLayout><OrderTrackingPage /></StoreLayout>} />
          <Route path="/about" element={<StoreLayout><AboutPage /></StoreLayout>} />
          <Route path="/contact" element={<StoreLayout><ContactPage /></StoreLayout>} />
          <Route path="/faq" element={<StoreLayout><FaqPage /></StoreLayout>} />

          {/* Seller Portal */}
          <Route path="/seller/login" element={<SellerLoginPage />} />
          <Route path="/seller/onboarding" element={<SellerOnboardingPage />} />
          <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
          <Route path="/seller/profile" element={<SellerProfilePage />} />
          <Route path="/seller/products" element={<SellerProductsPage />} />
          <Route path="/seller/products/new" element={<SellerNewProductPage />} />
          <Route path="/seller/orders" element={<SellerOrdersPage />} />
          <Route path="/seller/earnings" element={<SellerEarningsPage />} />
          <Route path="/seller/support" element={<SellerSupportPage />} />

          {/* Admin Dashboard */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/sellers" element={<AdminSellersPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/inventory" element={<AdminInventoryPage />} />
          <Route path="/admin/finance" element={<AdminFinancePage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />

          {/* Operations Dashboard */}
          <Route path="/operations/dashboard" element={<OperationsDashboardPage />} />
          <Route path="/operations/collections" element={<OperationsCollectionsPage />} />
          <Route path="/operations/quality" element={<OperationsQualityPage />} />
          <Route path="/operations/warehouse" element={<OperationsWarehousePage />} />
          <Route path="/operations/dispatch" element={<OperationsDispatchPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer />
      </StoreProvider>
    </BrowserRouter>
  );
}
