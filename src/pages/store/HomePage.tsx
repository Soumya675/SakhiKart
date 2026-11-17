import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Truck, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { DEMO_ASSETS } from '@/src/lib/mock-data/images';
import { ProductsService } from '@/src/services/products.service';
import { SellersService } from '@/src/services/sellers.service';
import { Product, ProductCategory } from '@/src/types/product';
import { Seller } from '@/src/types/seller';
import { useStore } from '@/src/context/StoreContext';
import { ProductCard } from '@/src/components/marketplace/ProductCard';
import { DataStateView } from '@/src/components/ui/DataStateView';
import { SafeImage } from '@/src/components/ui/SafeImage';
import { Button } from '@/src/components/ui/Button';

const TESTIMONIALS = [
  {
    name: 'Meenakshi Rout',
    location: 'Bengaluru, Karnataka',
    product: 'Sun-Cured Odisha Raw Mango Achar',
    quote:
      'I missed the authentic mustard-oil mango pickle my grandmother made in Cuttack. Every jar arrived sealed, aromatic, and knowing the payout went directly to Maa Shakti SHG makes it doubly special.',
  },
  {
    name: 'Dr. Kavita Mohapatra',
    location: 'New Delhi',
    product: 'Bargarh Terracotta Bandha Ikat Saree',
    quote:
      'The weave density and temple borders on Sita Devi’s saree are museum-worthy. SakhiKart’s quality inspection certificate gave me complete confidence buying handloom online.',
  },
  {
    name: 'Siddharth Nayak',
    location: 'Hyderabad, Telangana',
    product: 'Koraput Lidded Bamboo Storage Basket Set',
    quote:
      'Tight, smooth plaiting with zero splinters. We gifted these bamboo baskets for Diwali and ordered three more sets for our kitchen pantry.',
  },
];

export function HomePage() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collectionTab, setCollectionTab] = useState<'bestsellers' | 'odisha'>('bestsellers');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { pushToast } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    async function loadHome() {
      setIsLoading(true);
      setError(null);
      try {
        const [catRes, prodRes, sellerRes] = await Promise.all([
          ProductsService.getCategories(),
          ProductsService.listProducts({ sort: 'featured' }),
          SellersService.listSellers(false),
        ]);
        if (!active) return;
        setCategories(catRes.data);
        setProducts(prodRes.data);
        setSellers(sellerRes.data.slice(0, 4));
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Failed to load marketplace');
      } finally {
        if (active) setIsLoading(false);
      }
    }
    loadHome();
    return () => {
      active = false;
    };
  }, []);

  const displayedProducts =
    collectionTab === 'bestsellers'
      ? products.filter((p) => p.isBestSeller).slice(0, 8)
      : products.filter((p) => p.isOdishaSpecial).slice(0, 8);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim() || !newsletterEmail.includes('@')) {
      pushToast({ title: 'Enter a valid email address', tone: 'error' });
      return;
    }
    pushToast({
      title: 'Subscribed to SakhiKart Stories',
      description: 'You will receive seasonal Odisha harvest & craft updates.',
      tone: 'success',
    });
    setNewsletterEmail('');
  };

  return (
    <div>
      {/* 1. Hero Banner */}
      <section className="bg-[#FBF8F3] border-b border-[#E5DCD0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-6 flex flex-col justify-center space-y-6"
            >
              <p className="text-sm font-medium text-[#A45C3B]">
                Odisha Rural Women & Self-Help Group Marketplace
              </p>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-[#302B27] leading-[1.12] tracking-tight">
                Her Skills. Her Products. Her Independence.
              </h1>

              <p className="text-base sm:text-lg text-[#6B625B] leading-relaxed max-w-xl">
                Shop authentic homemade pickles, sun-dried papad and badi,
                Sambalpuri handlooms, bamboo crafts, terracotta, and Pattachitra
                art — collected directly from rural women artisans in Odisha and
                quality-checked before reaching your home.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  size="lg"
                  onClick={() => navigate('/shop')}
                  className="px-6"
                >
                  <span>Shop Handmade Crafts</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Link
                  to="/makers"
                  className="inline-flex items-center justify-center h-12 px-5 rounded-lg border border-[#D5C9B8] bg-white text-sm font-medium text-[#302B27] hover:bg-[#F7F1E7] transition-colors"
                >
                  Meet Women Makers
                </Link>
              </div>

              <div className="pt-4 border-t border-[#E5DCD0] grid grid-cols-3 gap-4 max-w-lg">
                <div>
                  <p className="font-serif text-2xl font-bold text-[#302B27] tabular-nums">140+</p>
                  <p className="text-xs text-[#6B625B]">SHGs & Women Artisans</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-[#302B27] tabular-nums">12</p>
                  <p className="text-xs text-[#6B625B]">Odisha Craft Districts</p>
                </div>
                <div>
                  <p className="font-serif text-2xl font-bold text-[#456B50] tabular-nums">88%</p>
                  <p className="text-xs text-[#6B625B]">Direct Maker Share</p>
                </div>
              </div>
            </motion.div>

            <div className="lg:col-span-6">
              <div className="relative h-72 sm:h-96 lg:h-full min-h-[360px] rounded-2xl overflow-hidden border border-[#E5DCD0] bg-[#EFE7DA]">
                <SafeImage
                  src={DEMO_ASSETS.heroArtisan}
                  alt="Rural Indian woman artisan in Odisha inspecting handwoven Sambalpuri textiles and bamboo crafts"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-5 sm:p-6 text-white">
                  <p className="text-xs font-medium text-[#E7B7A3]">
                    Featured Artisan Cluster · Bargarh & Puri
                  </p>
                  <p className="font-serif text-lg sm:text-xl font-semibold mt-0.5">
                    Every purchase is hub-inspected for purity and craft authenticity.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
              Shop by Craft & Kitchen Category
            </h2>
            <p className="text-sm text-[#6B625B] mt-1">
              From stone-ground pickles to pit-loom textiles across Odisha.
            </p>
          </div>
          <Link
            to="/categories"
            className="text-sm font-semibold text-[#A45C3B] hover:underline inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>All 8 Categories</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group rounded-xl border border-[#E5DCD0] bg-white overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-150"
            >
              <div className="aspect-[4/3] bg-[#EFE7DA] overflow-hidden">
                <SafeImage
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <div className="p-3.5 sm:p-4">
                <h3 className="font-serif text-base sm:text-lg font-semibold text-[#302B27] group-hover:text-[#A45C3B] transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-[#6B625B] mt-1 truncate">
                  {cat.odishaOriginHighlight} · {cat.productCount ?? 0} items
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Best-Selling & Odisha Special Collection */}
      <section className="bg-[#FBF8F3] border-y border-[#E5DCD0] py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
                Curated From Village Workshops
              </h2>
              <p className="text-sm text-[#6B625B] mt-1">
                Small-batch foods and heritage crafts verified at our Bhubaneswar hub.
              </p>
            </div>

            <div className="inline-flex items-center p-1 rounded-lg bg-[#EFE6D8] border border-[#E5DCD0] self-start">
              <button
                type="button"
                onClick={() => setCollectionTab('bestsellers')}
                className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  collectionTab === 'bestsellers'
                    ? 'bg-white text-[#302B27] shadow-sm'
                    : 'text-[#6B625B] hover:text-[#302B27]'
                }`}
              >
                Best Sellers
              </button>
              <button
                type="button"
                onClick={() => setCollectionTab('odisha')}
                className={`px-4 py-2 rounded-md text-xs sm:text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  collectionTab === 'odisha'
                    ? 'bg-white text-[#302B27] shadow-sm'
                    : 'text-[#6B625B] hover:text-[#302B27]'
                }`}
              >
                Odisha Specials
              </button>
            </div>
          </div>

          <DataStateView
            isLoading={isLoading}
            error={error}
            isEmpty={displayedProducts.length === 0}
            skeletonCount={4}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </DataStateView>

          <div className="mt-10 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-lg border border-[#302B27] text-sm font-medium text-[#302B27] hover:bg-[#302B27] hover:text-white transition-colors"
            >
              <span>Explore Full Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Women Makers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
              Meet Our Women Makers & Self-Help Groups
            </h2>
            <p className="text-sm text-[#6B625B] mt-1">
              Real artisans behind every jar, weave, and basket.
            </p>
          </div>
          <Link
            to="/makers"
            className="text-sm font-semibold text-[#A45C3B] hover:underline inline-flex items-center gap-1"
          >
            <span>Maker Directory</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sellers.map((seller) => (
            <Link
              key={seller.id}
              to={`/makers/${seller.slug}`}
              className="group rounded-xl border border-[#E5DCD0] bg-white p-4 space-y-4 hover:-translate-y-0.5 hover:shadow-md transition-all"
            >
              <div className="aspect-square rounded-lg overflow-hidden bg-[#EFE7DA]">
                <SafeImage
                  src={seller.avatarUrl}
                  alt={seller.displayName}
                  className="w-full h-full group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <div className="space-y-1">
                <p className="text-xs text-[#A45C3B] font-medium">
                  {seller.sellerType === 'shg'
                    ? `SHG Collective · ${seller.groupMemberCount ?? 10} Women`
                    : 'Individual Artisan'}
                </p>
                <h3 className="font-serif text-lg font-semibold text-[#302B27] group-hover:text-[#A45C3B]">
                  {seller.displayName}
                </h3>
                <p className="text-xs text-[#6B625B] flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    {seller.village}, {seller.district}
                  </span>
                </p>
                <p className="text-xs text-[#6B625B] line-clamp-2 pt-1">
                  {seller.specialties.join(' · ')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. How We Empower Women & Why Choose SakhiKart */}
      <section className="bg-[#302B27] text-[#F7F1E7] py-14 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-[#463F39]">
                <SafeImage
                  src={DEMO_ASSETS.shgEmpowerment}
                  alt="Rural women in an Odisha Self-Help Group sorting spices, packing pickle jars, and weaving baskets"
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-[#E7B7A3]">
                  Managed Multi-Vendor Model
                </p>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Artisans Create. SakhiKart Handles Everything Else.
                </h2>
                <p className="text-sm sm:text-base text-[#D7CEC4] leading-relaxed">
                  Rural women shouldn’t have to worry about courier labels,
                  product studio lighting, or city marketing. Our field &
                  warehouse teams manage the end-to-end journey.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-[#463F39] bg-[#3A3430] p-4 space-y-1.5">
                  <Truck className="h-5 w-5 text-[#E7B7A3]" />
                  <h3 className="font-semibold text-white text-sm">
                    Village Doorstep Collection
                  </h3>
                  <p className="text-xs text-[#D7CEC4] leading-relaxed">
                    Scheduled field pickups collect stock directly from village homes and SHG kitchens.
                  </p>
                </div>
                <div className="rounded-xl border border-[#463F39] bg-[#3A3430] p-4 space-y-1.5">
                  <ShieldCheck className="h-5 w-5 text-[#E7B7A3]" />
                  <h3 className="font-semibold text-white text-sm">
                    Hub Quality & Hygiene Checks
                  </h3>
                  <p className="text-xs text-[#D7CEC4] leading-relaxed">
                    Every food batch and handloom piece undergoes weight, seal, and craft verification.
                  </p>
                </div>
                <div className="rounded-xl border border-[#463F39] bg-[#3A3430] p-4 space-y-1.5">
                  <CheckCircle2 className="h-5 w-5 text-[#E7B7A3]" />
                  <h3 className="font-semibold text-white text-sm">
                    Studio Photography & Listings
                  </h3>
                  <p className="text-xs text-[#D7CEC4] leading-relaxed">
                    Our team writes clear product stories and photographs items in English, Hindi, and Odia.
                  </p>
                </div>
                <div className="rounded-xl border border-[#463F39] bg-[#3A3430] p-4 space-y-1.5">
                  <Users className="h-5 w-5 text-[#E7B7A3]" />
                  <h3 className="font-semibold text-white text-sm">
                    Transparent Direct Payouts
                  </h3>
                  <p className="text-xs text-[#D7CEC4] leading-relaxed">
                    Earnings settle straight to the artisan’s or SHG’s verified bank account on schedule.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="mb-8">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
            Trusted by Conscious Homes Across India
          </h2>
          <p className="text-sm text-[#6B625B] mt-1">
            Verified customer feedback from early Odisha and pan-India orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item) => (
            <blockquote
              key={item.name}
              className="rounded-xl border border-[#E5DCD0] bg-white p-6 flex flex-col justify-between gap-4"
            >
              <p className="text-sm text-[#302B27] leading-relaxed">
                “{item.quote}”
              </p>
              <footer className="pt-3 border-t border-[#F0E8DC]">
                <p className="text-sm font-semibold text-[#302B27]">{item.name}</p>
                <p className="text-xs text-[#6B625B]">
                  {item.location} · Ordered {item.product}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* 7. Become a Seller + Newsletter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-[#456B50] text-white p-8 flex flex-col justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#E7B7A3]">
                For Women Artisans & Self-Help Groups
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold">
                Sell Your Handmade Products Without Technical Hassle
              </h2>
              <p className="text-sm text-white/85 leading-relaxed">
                Available in Odia, Hindi, and English. Register individually or
                with your Self-Help Group — our field coordinators guide you
                from first listing to bank payout.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/seller/onboarding"
                className="inline-flex items-center justify-center h-11 px-5 rounded-lg bg-white text-[#302B27] text-sm font-semibold hover:bg-[#F7F1E7]"
              >
                Register as Seller / SHG
              </Link>
              <Link
                to="/seller/dashboard"
                className="inline-flex items-center justify-center h-11 px-5 rounded-lg border border-white/40 text-white text-sm font-medium hover:bg-white/10"
              >
                Open Seller Demo
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-8 flex flex-col justify-between gap-6">
            <div className="space-y-2">
              <p className="text-xs font-medium text-[#A45C3B]">
                Seasonal Craft Dispatch
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
                Get Fresh Summer Pickle & Festive Loom Drops
              </h2>
              <p className="text-sm text-[#6B625B] leading-relaxed">
                Receive notes when new small-batch harvests, Sambalpuri weaves,
                and artisan stories are curated from Odisha’s villages.
              </p>
            </div>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2.5">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                aria-label="Email address for SakhiKart newsletter"
                className="flex-1 h-11 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm text-[#302B27] focus:outline-none focus:ring-2 focus:ring-[#A45C3B]/30"
              />
              <Button type="submit" className="h-11 px-6">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
