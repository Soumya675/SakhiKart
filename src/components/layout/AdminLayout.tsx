import React from 'react';
import {
  BarChart3,
  Boxes,
  CheckSquare,
  IndianRupee,
  LayoutDashboard,
  ShoppingCart,
  Users,
} from 'lucide-react';
import { DashboardShell, DashboardNavItem } from './DashboardShell';

const ADMIN_NAV: DashboardNavItem[] = [
  { label: 'Overview', to: '/admin/dashboard', icon: <LayoutDashboard className="h-4 w-4 shrink-0" /> },
  { label: 'Sellers & SHGs', to: '/admin/sellers', icon: <Users className="h-4 w-4 shrink-0" /> },
  { label: 'Products & QC', to: '/admin/products', icon: <CheckSquare className="h-4 w-4 shrink-0" /> },
  { label: 'Orders', to: '/admin/orders', icon: <ShoppingCart className="h-4 w-4 shrink-0" /> },
  { label: 'Inventory & Categories', to: '/admin/inventory', icon: <Boxes className="h-4 w-4 shrink-0" /> },
  { label: 'Finance & Payouts', to: '/admin/finance', icon: <IndianRupee className="h-4 w-4 shrink-0" /> },
  { label: 'Reports', to: '/admin/reports', icon: <BarChart3 className="h-4 w-4 shrink-0" /> },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      portalName="SakhiKart Admin Console"
      portalRoleLabel="Marketplace Admin"
      navItems={ADMIN_NAV}
      accentTone="charcoal"
      headerRight={
        <span className="text-xs font-medium text-[#6B625B] whitespace-nowrap">
          Odisha Hub · Demo Mode
        </span>
      }
    >
      {children}
    </DashboardShell>
  );
}
