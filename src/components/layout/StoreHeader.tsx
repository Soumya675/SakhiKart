import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';
import { cn } from '@/src/lib/utils';

const NAV_ITEMS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'Makers', to: '/makers' },
  { label: 'Our Story', to: '/about' },
  { label: 'Seller Portal', to: '/seller/login' },
];

export function StoreHeader() {
  const { cartCount, setIsCartDrawerOpen, customer } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    setSearchOpen(false);
    setMobileOpen(false);
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/shop');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF8F3]/95 backdrop-blur-md border-b border-[#E5DCD0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <Link
          to="/"
          className="font-serif text-2xl font-bold tracking-tight text-[#302B27] whitespace-nowrap shrink-0"
        >
          Sakhi<span className="text-[#A45C3B]">Kart</span>
        </Link>

        {/* Zone 2: 5 concise single-line text links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-6 lg:gap-8"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'text-sm font-medium whitespace-nowrap shrink-0 pb-0.5 transition-colors border-b-2',
                  isActive
                    ? 'text-[#A45C3B] border-[#A45C3B]'
                    : 'text-[#302B27]/80 border-transparent hover:text-[#A45C3B] hover:border-[#A45C3B]/40'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Zone 3: Search, Account & Bag primary trigger */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setSearchOpen((prev) => !prev)}
            aria-label="Toggle product search"
            className="h-10 w-10 inline-flex items-center justify-center rounded-lg text-[#302B27] hover:bg-[#EFE6D8] transition-colors cursor-pointer"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          <Link
            to={customer ? '/profile' : '/login'}
            aria-label="Customer account"
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-lg text-[#302B27] hover:bg-[#EFE6D8] transition-colors"
          >
            <User className="h-4.5 w-4.5" />
          </Link>

          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(true)}
            className="inline-flex items-center gap-2 h-10 px-3.5 rounded-lg bg-[#A45C3B] text-white text-sm font-medium whitespace-nowrap shrink-0 hover:bg-[#8A4A2E] transition-colors cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="tabular-nums">Bag ({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-lg text-[#302B27] hover:bg-[#EFE6D8] cursor-pointer"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Search Row */}
      {searchOpen ? (
        <div className="border-t border-[#E5DCD0] bg-white px-4 py-3">
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-3xl mx-auto flex items-center gap-2"
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search handmade pickles, Sambalpuri sarees, bamboo baskets, terracotta..."
              className="flex-1 h-10 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm text-[#302B27] focus:outline-none focus:ring-2 focus:ring-[#A45C3B]/30"
              autoFocus
            />
            <button
              type="submit"
              className="h-10 px-4 rounded-lg bg-[#302B27] text-white text-sm font-medium whitespace-nowrap cursor-pointer hover:bg-[#463F39]"
            >
              Search
            </button>
          </form>
        </div>
      ) : null}

      {/* Mobile Navigation Drawer */}
      {mobileOpen ? (
        <div className="md:hidden border-t border-[#E5DCD0] bg-[#FBF8F3] px-4 py-4 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className="block py-2.5 px-3 rounded-lg text-sm font-medium text-[#302B27] hover:bg-[#EFE6D8]"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#E5DCD0] flex items-center gap-3">
            <Link
              to={customer ? '/profile' : '/login'}
              onClick={() => setMobileOpen(false)}
              className="flex-1 py-2.5 px-3 rounded-lg border border-[#D5C9B8] bg-white text-center text-sm font-medium text-[#302B27]"
            >
              {customer ? 'My Profile' : 'Sign In'}
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileOpen(false)}
              className="flex-1 py-2.5 px-3 rounded-lg border border-[#D5C9B8] bg-white text-center text-sm font-medium text-[#302B27]"
            >
              My Orders
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
