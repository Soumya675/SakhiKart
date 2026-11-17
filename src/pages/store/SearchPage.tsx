import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ProductsService } from '@/src/services/products.service';
import { Product } from '@/src/types/product';
import { ProductCard } from '@/src/components/marketplace/ProductCard';
import { DataStateView } from '@/src/components/ui/DataStateView';
import { Button } from '@/src/components/ui/Button';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    setIsLoading(true);
    setError(null);
    ProductsService.listProducts({ search: q })
      .then((res) => setResults(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Search failed'))
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query.trim() ? { q: query.trim() } : {});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="max-w-2xl space-y-4">
        <h1 className="font-serif text-3xl font-bold text-[#302B27]">
          Search Handmade Marketplace
        </h1>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="h-4 w-4 text-[#6B625B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try 'mango pickle', 'Bargarh', 'bamboo', 'Dokra'..."
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#D5C9B8] bg-white text-sm"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
        <p className="text-sm text-[#6B625B]">
          {searchParams.get('q')
            ? `${results.length} results for “${searchParams.get('q')}”`
            : `Showing ${results.length} curated items`}
        </p>
      </div>

      <DataStateView
        isLoading={isLoading}
        error={error}
        isEmpty={results.length === 0}
        emptyTitle="No products matched your search"
        emptyDescription="Try searching for pickles, papad, Sambalpuri, bamboo, terracotta, or Pattachitra."
        emptyActionLabel="Browse Full Shop"
        onEmptyAction={() => navigate('/shop')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </DataStateView>
    </div>
  );
}
