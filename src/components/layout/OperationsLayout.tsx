import React from 'react';
import {
  ClipboardCheck,
  LayoutDashboard,
  PackageCheck,
  Truck,
  Warehouse,
} from 'lucide-react';
import { DashboardShell, DashboardNavItem } from './DashboardShell';

const OPS_NAV: DashboardNavItem[] = [
  { label: 'Hub Overview', to: '/operations/dashboard', icon: <LayoutDashboard className="h-4 w-4 shrink-0" /> },
  { label: 'Village Collections', to: '/operations/collections', icon: <Truck className="h-4 w-4 shrink-0" /> },
  { label: 'Quality Inspection', to: '/operations/quality', icon: <ClipboardCheck className="h-4 w-4 shrink-0" /> },
  { label: 'Warehouse & Expiry', to: '/operations/warehouse', icon: <Warehouse className="h-4 w-4 shrink-0" /> },
  { label: 'Packing & Dispatch', to: '/operations/dispatch', icon: <PackageCheck className="h-4 w-4 shrink-0" /> },
];

export function OperationsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      portalName="SakhiKart Field & Hub Operations"
      portalRoleLabel="Operations"
      navItems={OPS_NAV}
      accentTone="forest"
      headerRight={
        <span className="text-xs font-medium text-[#456B50] whitespace-nowrap">
          Bhubaneswar Central Hub
        </span>
      }
    >
      {children}
    </DashboardShell>
  );
}
