import React from 'react';
import { Link } from 'react-router-dom';
import { APP_CONFIG } from '@/src/lib/api/config';

export function StoreFooter() {
  return (
    <footer className="bg-[#302B27] text-[#F7F1E7] border-t border-[#463F39]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="space-y-3">
            <Link to="/" className="font-serif text-2xl font-bold text-white">
              Sakhi<span className="text-[#E7B7A3]">Kart</span>
            </Link>
            <p className="text-sm text-[#D7CEC4] leading-relaxed">
              Her Skills. Her Products. Her Independence. A managed rural
              commerce marketplace empowering women artisans and Self-Help Groups
              starting from Odisha.
            </p>
            <p className="text-xs text-[#B9AEA3]">
              Hub: Saheed Nagar, Bhubaneswar · Odisha 751007
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Marketplace</h4>
            <ul className="space-y-2 text-sm text-[#D7CEC4]">
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All Crafts</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">Browse Categories</Link></li>
              <li><Link to="/makers" className="hover:text-white transition-colors">Women Makers & SHGs</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Shopping Bag</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Track Your Order</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">About & Help</h4>
            <ul className="space-y-2 text-sm text-[#D7CEC4]">
              <li><Link to="/about" className="hover:text-white transition-colors">About SakhiKart</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">Customer Profile</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Ecosystem Portals</h4>
            <ul className="space-y-2 text-sm text-[#D7CEC4]">
              <li><Link to="/seller/login" className="hover:text-[#E7B7A3] transition-colors">Seller & SHG Portal</Link></li>
              <li><Link to="/seller/onboarding" className="hover:text-[#E7B7A3] transition-colors">Register as a Maker</Link></li>
              <li><Link to="/admin/login" className="hover:text-[#E7B7A3] transition-colors">Admin Management</Link></li>
              <li><Link to="/operations/dashboard" className="hover:text-[#E7B7A3] transition-colors">Operations & Warehouse Hub</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#463F39] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#B9AEA3]">
          <p>© {new Date().getFullYear()} SakhiKart Rural Commerce Initiative. All rights reserved.</p>
          <p>
            Phase 1 Data Mode: {APP_CONFIG.isDemoMode ? 'Demo Repository (Simulated Seed Data)' : 'Production'}
          </p>
        </div>
      </div>
    </footer>
  );
}
