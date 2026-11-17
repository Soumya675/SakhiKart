import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  IndianRupee,
  Package,
  PhoneCall,
  PlusCircle,
  Truck,
} from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';
import { SELLER_TRANSLATIONS } from '@/src/lib/i18n/translations';
import { formatDate, formatINR } from '@/src/lib/utils';
import { ProductsService } from '@/src/services/products.service';
import { SellersService } from '@/src/services/sellers.service';
import { OrdersService } from '@/src/services/orders.service';
import { Product } from '@/src/types/product';
import { CollectionRequest, Seller, SellerPayout } from '@/src/types/seller';
import { Order } from '@/src/types/order';
import { SellerLayout } from '@/src/components/layout/SellerLayout';
import { Button } from '@/src/components/ui/Button';
import { DataStateView } from '@/src/components/ui/DataStateView';

export function SellerDashboardPage() {
  const { sellerLanguage, activeSellerId } = useStore();
  const t = SELLER_TRANSLATIONS[sellerLanguage];
  const [seller, setSeller] = useState<Seller | null>(null);
  const [productsCount, setProductsCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    Promise.all([
      SellersService.getSellerById(activeSellerId),
      ProductsService.getProductsBySeller(activeSellerId),
      OrdersService.listOrders(),
    ]).then(([sRes, pRes, oRes]) => {
      setSeller(sRes.data);
      setProductsCount(pRes.data.length);
      setOrdersCount(oRes.data.length);
    });
  }, [activeSellerId]);

  return (
    <SellerLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="rounded-2xl bg-[#302B27] text-white p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-medium text-[#E7B7A3]">
              {seller ? `${seller.village}, ${seller.district}` : 'Puri, Odisha'} ·{' '}
              {seller?.status === 'verified' ? 'Verified Maker' : 'Verification Pending'}
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold">
              {seller ? `Namaste, ${seller.displayName}` : t.welcomeBack}
            </h1>
            <p className="text-sm text-[#D7CEC4] leading-relaxed">{t.subtitle}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/seller/products/new"
              className="h-12 px-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#A45C3B] text-white text-sm font-semibold hover:bg-[#8A4A2E]"
            >
              <PlusCircle className="h-5 w-5" />
              <span>{t.submitNewProduct}</span>
            </Link>
            <Link
              to="/seller/orders"
              className="h-12 px-5 inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20"
            >
              <Truck className="h-5 w-5" />
              <span>{t.requestPickup}</span>
            </Link>
          </div>
        </div>

        {/* Large Touch-Friendly Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-[#E5DCD0] bg-white p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#6B625B]">
              <span>{t.totalEarnings}</span>
              <IndianRupee className="h-4 w-4 text-[#456B50]" />
            </div>
            <p className="font-serif text-3xl font-bold text-[#302B27] tabular-nums">
              {formatINR(seller?.totalEarnings ?? 216400)}
            </p>
            <p className="text-xs text-[#456B50] font-medium">Direct bank payouts</p>
          </div>

          <div className="rounded-xl border border-[#E5DCD0] bg-white p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#6B625B]">
              <span>{t.productsSubmitted}</span>
              <Package className="h-4 w-4 text-[#A45C3B]" />
            </div>
            <p className="font-serif text-3xl font-bold text-[#302B27] tabular-nums">
              {productsCount}
            </p>
            <Link to="/seller/products" className="text-xs text-[#A45C3B] font-semibold hover:underline block">
              View approval status →
            </Link>
          </div>

          <div className="rounded-xl border border-[#E5DCD0] bg-white p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#6B625B]">
              <span>{t.ordersReceived}</span>
              <Truck className="h-4 w-4 text-[#A45C3B]" />
            </div>
            <p className="font-serif text-3xl font-bold text-[#302B27] tabular-nums">
              {ordersCount}
            </p>
            <Link to="/seller/orders" className="text-xs text-[#A45C3B] font-semibold hover:underline block">
              {t.viewOrders} →
            </Link>
          </div>

          <div className="rounded-xl border border-[#E5DCD0] bg-white p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-[#6B625B]">
              <span>{t.payoutStatus}</span>
              <Clock className="h-4 w-4 text-[#D9A441]" />
            </div>
            <p className="font-serif text-3xl font-bold text-[#302B27] tabular-nums">
              {formatINR(seller?.pendingPayout ?? 19800)}
            </p>
            <Link to="/seller/earnings" className="text-xs text-[#456B50] font-semibold hover:underline block">
              {t.viewEarnings} →
            </Link>
          </div>
        </div>

        {/* Visual Step-by-Step Instructions */}
        <div className="rounded-2xl border border-[#E5DCD0] bg-white p-6 space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#302B27]">
            {t.howItWorksTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[t.step1, t.step2, t.step3, t.step4].map((step, i) => (
              <div
                key={i}
                className="rounded-xl border border-[#E5DCD0] bg-[#FBF8F3] p-4 space-y-2"
              >
                <CheckCircle2 className="h-5 w-5 text-[#456B50]" />
                <p className="text-sm font-medium text-[#302B27] leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}

export function SellerOrdersPage() {
  const { activeSellerId, pushToast } = useStore();
  const [collections, setCollections] = useState<CollectionRequest[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [productSummary, setProductSummary] = useState('');
  const [estimatedUnits, setEstimatedUnits] = useState(20);
  const [preferredDate, setPreferredDate] = useState('2026-11-20');
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    const [colRes, ordRes] = await Promise.all([
      SellersService.listCollectionRequests(),
      OrdersService.listOrders(),
    ]);
    setCollections(colRes.data);
    setOrders(ordRes.data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRequestPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productSummary.trim()) {
      pushToast({ title: 'Describe the items ready for pickup', tone: 'error' });
      return;
    }
    await SellersService.createCollectionRequest({
      sellerId: activeSellerId,
      sellerName: 'Maa Shakti Mahila SHG',
      village: 'Satyabadi',
      district: 'Puri',
      productSummary: productSummary.trim(),
      estimatedUnits,
      preferredDate,
    });
    setProductSummary('');
    pushToast({
      title: 'Village Pickup Requested',
      description: 'Operations team will assign a collection vehicle.',
      tone: 'success',
    });
    loadData();
  };

  return (
    <SellerLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
            Orders & Village Collection Requests
          </h1>
          <p className="text-sm text-[#6B625B] mt-1">
            Tell our field team when your batch is ready — we pick up directly from your doorstep.
          </p>
        </div>

        {/* Simple Collection Request Form */}
        <form
          onSubmit={handleRequestPickup}
          className="rounded-2xl border border-[#E5DCD0] bg-white p-5 sm:p-6 space-y-4"
        >
          <h2 className="font-serif text-lg font-bold text-[#302B27]">
            Request a Village Stock Pickup
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1">
                Items Ready for Collection
              </label>
              <input
                value={productSummary}
                onChange={(e) => setProductSummary(e.target.value)}
                placeholder="e.g. 25 jars Mango Achar, 30 packs Papad"
                className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Total Units</label>
              <input
                type="number"
                min={1}
                value={estimatedUnits}
                onChange={(e) => setEstimatedUnits(Number(e.target.value))}
                className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Preferred Date</label>
              <input
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
              />
            </div>
          </div>
          <Button type="submit" size="lg">
            <Truck className="h-4 w-4" />
            <span>Send Pickup Request</span>
          </Button>
        </form>

        <DataStateView isLoading={isLoading} error={null} isEmpty={collections.length === 0}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[#302B27]">
                Pickup Schedule Status
              </h2>
              {collections.map((col) => (
                <div
                  key={col.id}
                  className="rounded-xl border border-[#E5DCD0] bg-white p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-[#6B625B]">
                      {col.id.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-[#456B50] capitalize">
                      {col.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#302B27]">{col.productSummary}</p>
                  <p className="text-xs text-[#6B625B]">
                    {col.village}, {col.district} · {col.estimatedUnits} units · Date: {col.preferredDate}
                  </p>
                  {col.assignedVehicle ? (
                    <p className="text-xs font-medium text-[#A45C3B]">
                      Vehicle: {col.assignedVehicle}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h2 className="font-serif text-xl font-bold text-[#302B27]">
                Recent Customer Orders
              </h2>
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="rounded-xl border border-[#E5DCD0] bg-white p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold">{ord.orderNumber}</span>
                    <span className="text-xs font-semibold text-[#A45C3B] capitalize">
                      {ord.orderStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-[#302B27]">
                    {ord.items.map((i) => `${i.quantity}× ${i.productName}`).join(', ')}
                  </p>
                  <p className="text-xs text-[#6B625B]">
                    Ship to {ord.shippingAddress.city}, {ord.shippingAddress.state} ·{' '}
                    <span className="tabular-nums font-semibold text-[#302B27]">
                      {formatINR(ord.totalAmount)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </DataStateView>
      </div>
    </SellerLayout>
  );
}

export function SellerEarningsPage() {
  const [payouts, setPayouts] = useState<SellerPayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SellersService.listPayouts()
      .then((res) => setPayouts(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
            Earnings & Bank Payouts
          </h1>
          <p className="text-sm text-[#6B625B] mt-1">
            You receive 88% of product sales directly to your bank or SHG account.
          </p>
        </div>

        <DataStateView isLoading={isLoading} error={null} isEmpty={payouts.length === 0}>
          <div className="space-y-3">
            {payouts.map((pay) => (
              <div
                key={pay.id}
                className="rounded-xl border border-[#E5DCD0] bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <p className="text-xs text-[#6B625B] font-mono">{pay.referenceNumber}</p>
                  <h2 className="font-semibold text-base text-[#302B27]">{pay.periodLabel}</h2>
                  <p className="text-xs text-[#6B625B]">
                    {pay.sellerName} · Gross {formatINR(pay.grossSales)} · Service Fee{' '}
                    {formatINR(pay.platformFee)}
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                  <span className="font-serif text-2xl font-bold text-[#456B50] tabular-nums">
                    {formatINR(pay.netPayable)}
                  </span>
                  <span className="text-xs font-semibold capitalize text-[#302B27]">
                    {pay.status}
                    {pay.paidAt ? ` · ${formatDate(pay.paidAt)}` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DataStateView>
      </div>
    </SellerLayout>
  );
}

export function SellerProfilePage() {
  const { activeSellerId, pushToast } = useStore();
  const [seller, setSeller] = useState<Seller | null>(null);

  useEffect(() => {
    SellersService.getSellerById(activeSellerId).then((res) => setSeller(res.data));
  }, [activeSellerId]);

  return (
    <SellerLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
          Maker & SHG Profile
        </h1>
        {seller ? (
          <div className="rounded-2xl border border-[#E5DCD0] bg-white p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-[#6B625B]">Display Name</p>
                <p className="font-semibold text-[#302B27]">{seller.displayName}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B625B]">Account Type</p>
                <p className="font-semibold text-[#302B27]">
                  {seller.sellerType === 'shg'
                    ? `Self-Help Group (${seller.groupMemberCount ?? 10} Women)`
                    : 'Individual Artisan'}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B625B]">Village & Block</p>
                <p className="font-semibold text-[#302B27]">
                  {seller.village}, {seller.block}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B625B]">District & State</p>
                <p className="font-semibold text-[#302B27]">
                  {seller.district}, {seller.state}
                </p>
              </div>
              <div>
                <p className="text-xs text-[#6B625B]">Registered Mobile</p>
                <p className="font-mono font-semibold text-[#302B27]">+91 {seller.phone}</p>
              </div>
              <div>
                <p className="text-xs text-[#6B625B]">Verification Status</p>
                <p className="font-semibold text-[#456B50] capitalize">{seller.status}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-[#F0E8DC]">
              <p className="text-xs text-[#6B625B] mb-1">Your Craft Story</p>
              <p className="text-sm text-[#302B27] leading-relaxed">{seller.story}</p>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                pushToast({
                  title: 'Field Coordinator Notified',
                  description: 'Your district coordinator will confirm profile edits by phone.',
                  tone: 'info',
                })
              }
            >
              Request Profile Update via Coordinator
            </Button>
          </div>
        ) : null}
      </div>
    </SellerLayout>
  );
}

export function SellerSupportPage() {
  const { pushToast } = useStore();
  return (
    <SellerLayout>
      <div className="max-w-3xl space-y-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
          Maker Help & Field Support
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-[#E5DCD0] bg-white p-6 space-y-3">
            <PhoneCall className="h-6 w-6 text-[#A45C3B]" />
            <h2 className="font-serif text-lg font-bold">Odia & Hindi Helpline</h2>
            <p className="text-sm text-[#6B625B]">
              Speak directly with our Bhubaneswar field coordinators for help with
              product pricing, pickup timing, or bank payouts.
            </p>
            <p className="font-mono text-base font-bold text-[#302B27]">+91 674 254 8810</p>
          </div>
          <div className="rounded-xl border border-[#E5DCD0] bg-white p-6 space-y-3">
            <Truck className="h-6 w-6 text-[#456B50]" />
            <h2 className="font-serif text-lg font-bold">Request Field Visit</h2>
            <p className="text-sm text-[#6B625B]">
              Need help photographing new items or checking packaging jars? Ask a
              field Sakhi to visit your village cluster.
            </p>
            <Button
              variant="forest"
              onClick={() =>
                pushToast({
                  title: 'Field Visit Requested',
                  description: 'District coordinator will call you within 24 hours.',
                  tone: 'success',
                })
              }
            >
              Request Coordinator Callback
            </Button>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
