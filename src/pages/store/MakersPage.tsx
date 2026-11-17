import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Users } from 'lucide-react';
import { SellersService } from '@/src/services/sellers.service';
import { Seller } from '@/src/types/seller';
import { DataStateView } from '@/src/components/ui/DataStateView';
import { SafeImage } from '@/src/components/ui/SafeImage';

export function MakersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'individual' | 'shg'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    SellersService.listSellers(false)
      .then((res) => setSellers(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load makers'))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered =
    filterType === 'all'
      ? sellers
      : sellers.filter((s) => s.sellerType === filterType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E5DCD0] pb-6">
        <div className="max-w-2xl space-y-2">
          <p className="text-xs font-medium text-[#A45C3B]">
            Odisha Rural Artisan Network
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#302B27]">
            Women Makers & Self-Help Groups
          </h1>
          <p className="text-sm sm:text-base text-[#6B625B]">
            Every seller on SakhiKart is verified by our field coordinators and
            supported with village collection, photography, and direct payouts.
          </p>
        </div>

        <div className="inline-flex p-1 rounded-lg bg-[#EFE6D8] border border-[#E5DCD0] self-start">
          {[
            { id: 'all', label: 'All Makers' },
            { id: 'shg', label: 'Self-Help Groups' },
            { id: 'individual', label: 'Individual Artisans' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id as typeof filterType)}
              className={`px-3.5 py-2 rounded-md text-xs font-medium whitespace-nowrap cursor-pointer transition-colors ${
                filterType === tab.id
                  ? 'bg-white text-[#302B27] shadow-sm'
                  : 'text-[#6B625B] hover:text-[#302B27]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <DataStateView isLoading={isLoading} error={error} isEmpty={filtered.length === 0}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((seller) => (
            <Link
              key={seller.id}
              to={`/makers/${seller.slug}`}
              className="group rounded-xl border border-[#E5DCD0] bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="aspect-[4/3] bg-[#EFE7DA] overflow-hidden">
                <SafeImage
                  src={seller.avatarUrl}
                  alt={seller.displayName}
                  className="w-full h-full group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#6B625B]">
                    <span className="font-semibold text-[#A45C3B]">
                      {seller.sellerType === 'shg'
                        ? `SHG · ${seller.groupMemberCount ?? 10} Members`
                        : 'Individual Artisan'}
                    </span>
                    <span className="inline-flex items-center gap-1 tabular-nums text-[#302B27] font-medium">
                      <Star className="h-3.5 w-3.5 fill-[#D9A441] text-[#D9A441]" />
                      {seller.rating.toFixed(1)}
                    </span>
                  </div>
                  <h2 className="font-serif text-xl font-bold text-[#302B27] group-hover:text-[#A45C3B]">
                    {seller.displayName}
                  </h2>
                  <p className="text-xs text-[#6B625B] flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span>
                      {seller.village}, {seller.block}, {seller.district}
                    </span>
                  </p>
                  <p className="text-sm text-[#6B625B] line-clamp-3 leading-relaxed">
                    {seller.story}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0E8DC] flex items-center justify-between text-xs">
                  <span className="text-[#6B625B] truncate">
                    {seller.specialties.join(' · ')}
                  </span>
                  <span className="font-semibold text-[#A45C3B] whitespace-nowrap ml-2">
                    View Profile →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </DataStateView>
    </div>
  );
}
