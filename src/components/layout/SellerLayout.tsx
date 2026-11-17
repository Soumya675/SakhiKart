import React from 'react';
import {
  HelpCircle,
  Home,
  IndianRupee,
  Package,
  PlusCircle,
  Truck,
  UserCircle,
} from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';
import { SELLER_TRANSLATIONS } from '@/src/lib/i18n/translations';
import { LanguageCode } from '@/src/types/common';
import { DashboardShell, DashboardNavItem } from './DashboardShell';

export function SellerLayout({ children }: { children: React.ReactNode }) {
  const { sellerLanguage, setSellerLanguage } = useStore();
  const t = SELLER_TRANSLATIONS[sellerLanguage];

  const navItems: DashboardNavItem[] = [
    { label: t.navDashboard, to: '/seller/dashboard', icon: <Home className="h-4 w-4 shrink-0" /> },
    { label: t.navProducts, to: '/seller/products', icon: <Package className="h-4 w-4 shrink-0" /> },
    { label: t.navAddProduct, to: '/seller/products/new', icon: <PlusCircle className="h-4 w-4 shrink-0" /> },
    { label: t.navOrders, to: '/seller/orders', icon: <Truck className="h-4 w-4 shrink-0" /> },
    { label: t.navEarnings, to: '/seller/earnings', icon: <IndianRupee className="h-4 w-4 shrink-0" /> },
    { label: t.navProfile, to: '/seller/profile', icon: <UserCircle className="h-4 w-4 shrink-0" /> },
    { label: t.navSupport, to: '/seller/support', icon: <HelpCircle className="h-4 w-4 shrink-0" /> },
  ];

  const languageSwitcher = (
    <div
      role="group"
      aria-label="Seller interface language"
      className="inline-flex items-center p-1 rounded-lg bg-[#F7F1E7] border border-[#E5DCD0]"
    >
      {(
        [
          { code: 'en', label: 'EN' },
          { code: 'hi', label: 'हिन्दी' },
          { code: 'or', label: 'ଓଡ଼ିଆ' },
        ] as { code: LanguageCode; label: string }[]
      ).map((lang) => (
        <button
          key={lang.code}
          type="button"
          onClick={() => setSellerLanguage(lang.code)}
          className={`px-2.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
            sellerLanguage === lang.code
              ? 'bg-[#A45C3B] text-white'
              : 'text-[#302B27] hover:bg-[#EFE6D8]'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );

  return (
    <DashboardShell
      portalName="SakhiKart Maker Portal"
      portalRoleLabel="Seller & SHG"
      navItems={navItems}
      headerRight={languageSwitcher}
      accentTone="terracotta"
    >
      {children}
    </DashboardShell>
  );
}
