import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, ArrowLeft, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export interface DashboardNavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
}

interface DashboardShellProps {
  portalName: string;
  portalRoleLabel: string;
  navItems: DashboardNavItem[];
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  accentTone?: 'terracotta' | 'forest' | 'charcoal';
}

export function DashboardShell({
  portalName,
  portalRoleLabel,
  navItems,
  headerRight,
  children,
  accentTone = 'terracotta',
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeClass =
    accentTone === 'forest'
      ? 'bg-[#456B50] text-white'
      : accentTone === 'charcoal'
      ? 'bg-[#302B27] text-white'
      : 'bg-[#A45C3B] text-white';

  return (
    <div className="min-h-screen bg-[#F7F1E7] text-[#302B27] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-[#E5DCD0]">
        <div className="h-16 px-5 border-b border-[#E5DCD0] flex items-center justify-between">
          <Link to="/" className="font-serif text-xl font-bold text-[#302B27]">
            Sakhi<span className="text-[#A45C3B]">Kart</span>
          </Link>
          <span className="text-xs font-medium text-[#6B625B]">{portalRoleLabel}</span>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto" aria-label={portalName}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  isActive
                    ? activeClass
                    : 'text-[#302B27]/80 hover:bg-[#F7F1E7] hover:text-[#302B27]'
                )
              }
            >
              {item.icon}
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#E5DCD0] space-y-2 text-xs">
          <p className="font-medium text-[#6B625B]">Switch Portal (Demo)</p>
          <div className="grid grid-cols-2 gap-1.5">
            <Link to="/seller/dashboard" className="px-2 py-1.5 rounded bg-[#F7F1E7] hover:bg-[#EFE6D8] text-center font-medium">Seller</Link>
            <Link to="/admin/dashboard" className="px-2 py-1.5 rounded bg-[#F7F1E7] hover:bg-[#EFE6D8] text-center font-medium">Admin</Link>
            <Link to="/operations/dashboard" className="px-2 py-1.5 rounded bg-[#F7F1E7] hover:bg-[#EFE6D8] text-center font-medium">Operations</Link>
            <Link to="/" className="px-2 py-1.5 rounded bg-[#F7F1E7] hover:bg-[#EFE6D8] text-center font-medium">Storefront</Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#302B27]/45"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative z-10 w-72 bg-white h-full flex flex-col border-r border-[#E5DCD0]">
            <div className="h-16 px-4 border-b border-[#E5DCD0] flex items-center justify-between">
              <span className="font-serif text-xl font-bold">
                Sakhi<span className="text-[#A45C3B]">Kart</span>
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                className="h-9 w-9 inline-flex items-center justify-center rounded-lg hover:bg-[#F7F1E7]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium',
                      isActive ? activeClass : 'text-[#302B27] hover:bg-[#F7F1E7]'
                    )
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="p-4 border-t border-[#E5DCD0] flex flex-wrap gap-2 text-xs">
              <Link to="/seller/dashboard" onClick={() => setSidebarOpen(false)} className="px-2.5 py-1.5 rounded bg-[#F7F1E7] font-medium">Seller</Link>
              <Link to="/admin/dashboard" onClick={() => setSidebarOpen(false)} className="px-2.5 py-1.5 rounded bg-[#F7F1E7] font-medium">Admin</Link>
              <Link to="/operations/dashboard" onClick={() => setSidebarOpen(false)} className="px-2.5 py-1.5 rounded bg-[#F7F1E7] font-medium">Operations</Link>
              <Link to="/" onClick={() => setSidebarOpen(false)} className="px-2.5 py-1.5 rounded bg-[#F7F1E7] font-medium">Storefront</Link>
            </div>
          </aside>
        </div>
      ) : null}

      {/* Main Content */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-sm border-b border-[#E5DCD0] px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-lg border border-[#E5DCD0] text-[#302B27]"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#302B27] truncate">
                {portalName}
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-1 text-xs text-[#6B625B] hover:text-[#A45C3B]"
              >
                <ArrowLeft className="h-3 w-3" /> Back to Marketplace
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">{headerRight}</div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
