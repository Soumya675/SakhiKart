import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CheckCircle2, Eye, ShieldCheck, XCircle } from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';
import { formatDate, formatINR } from '@/src/lib/utils';
import { InventoryService } from '@/src/services/inventory.service';
import { OrdersService } from '@/src/services/orders.service';
import { ProductsService } from '@/src/services/products.service';
import { SellersService } from '@/src/services/sellers.service';
import { RevenuePoint } from '@/src/types/inventory';
import { Order } from '@/src/types/order';
import { Product } from '@/src/types/product';
import { Seller } from '@/src/types/seller';
import { AdminLayout } from '@/src/components/layout/AdminLayout';
import { Button } from '@/src/components/ui/Button';
import { DataStateView } from '@/src/components/ui/DataStateView';
import { SafeImage } from '@/src/components/ui/SafeImage';

export function AdminLoginPage() {
  const [email, setEmail] = useState('admin@sakhikart.in');
  const [password, setPassword] = useState('admin-demo-2026');
  const { pushToast } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    pushToast({ title: 'Signed in as SakhiKart Admin (Demo)', tone: 'success' });
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F1E7] flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl border border-[#E5DCD0] bg-white p-7 space-y-6">
        <div className="space-y-1">
          <Link to="/" className="font-serif text-xl font-bold text-[#302B27]">
            Sakhi<span className="text-[#A45C3B]">Kart</span>
          </Link>
          <h1 className="font-serif text-2xl font-bold text-[#302B27] pt-2">
            Admin Console Sign In
          </h1>
          <p className="text-xs text-[#6B625B]">
            Managed marketplace approvals, seller settlements, and order oversight.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3 text-sm"
            />
          </div>
          <Button type="submit" variant="secondary" size="lg" className="w-full">
            <ShieldCheck className="h-4 w-4" />
            <span>Access Admin Dashboard</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const [revenue, setRevenue] = useState<RevenuePoint[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      InventoryService.getRevenueSeries(),
      SellersService.listSellers(true),
      ProductsService.listProducts({ includeUnapproved: true }),
      OrdersService.listOrders(),
    ])
      .then(([r, s, p, o]) => {
        setRevenue(r.data);
        setSellers(s.data);
        setProducts(p.data);
        setOrders(o.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const totalGMV = revenue.reduce((sum, pt) => sum + pt.grossMerchandiseValue, 0);
  const pendingProducts = products.filter((p) => p.status === 'pending_verification');
  const pendingSellers = sellers.filter((s) => s.status === 'pending');

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
            Marketplace Overview
          </h1>
          <p className="text-sm text-[#6B625B] mt-1">
            Demo telemetry across Odisha seller clusters, approvals, and settlements.
          </p>
        </div>

        <DataStateView isLoading={isLoading} error={null} isEmpty={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-xl border border-[#E5DCD0] bg-white p-5">
              <p className="text-xs text-[#6B625B]">6-Month GMV (Demo)</p>
              <p className="font-serif text-2xl font-bold text-[#302B27] tabular-nums mt-1">
                {formatINR(totalGMV)}
              </p>
              <p className="text-xs text-[#456B50] mt-1">88% remitted to women makers</p>
            </div>
            <div className="rounded-xl border border-[#E5DCD0] bg-white p-5">
              <p className="text-xs text-[#6B625B]">Active & Demo Orders</p>
              <p className="font-serif text-2xl font-bold text-[#302B27] tabular-nums mt-1">
                {orders.length + 1537}
              </p>
              <p className="text-xs text-[#6B625B] mt-1">Across 14 Indian states</p>
            </div>
            <div className="rounded-xl border border-[#E5DCD0] bg-white p-5">
              <p className="text-xs text-[#6B625B]">Verified Sellers & SHGs</p>
              <p className="font-serif text-2xl font-bold text-[#302B27] tabular-nums mt-1">
                {sellers.filter((s) => s.status === 'verified').length}
              </p>
              <p className="text-xs text-[#A45C3B] mt-1">
                {pendingSellers.length} pending verification
              </p>
            </div>
            <div className="rounded-xl border border-[#E5DCD0] bg-white p-5">
              <p className="text-xs text-[#6B625B]">Pending Product Approvals</p>
              <p className="font-serif text-2xl font-bold text-[#D9A441] tabular-nums mt-1">
                {pendingProducts.length}
              </p>
              <Link to="/admin/products" className="text-xs text-[#A45C3B] font-semibold hover:underline block mt-1">
                Review approval queue →
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-[#E5DCD0] bg-white p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="font-serif text-xl font-bold text-[#302B27]">
                Monthly Gross Merchandise Value vs. Maker Payouts
              </h2>
              <span className="text-xs text-[#6B625B]">Jun – Nov 2026</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EFE7DA" />
                  <XAxis dataKey="month" stroke="#6B625B" fontSize={12} />
                  <YAxis stroke="#6B625B" fontSize={12} tickFormatter={(v) => `₹${v / 1000}k`} />
                  <Tooltip
                    formatter={(val) => formatINR(Number(val ?? 0))}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      borderColor: '#E5DCD0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="grossMerchandiseValue"
                    name="Gross Sales"
                    stroke="#A45C3B"
                    fill="#A45C3B"
                    fillOpacity={0.14}
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="sellerPayouts"
                    name="Maker Payouts"
                    stroke="#456B50"
                    fill="#456B50"
                    fillOpacity={0.14}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </DataStateView>
      </div>
    </AdminLayout>
  );
}

export function AdminSellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [selected, setSelected] = useState<Seller | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { pushToast } = useStore();

  const load = async () => {
    setIsLoading(true);
    const res = await SellersService.listSellers(true);
    setSellers(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleStatus = async (sellerId: string, status: Seller['status']) => {
    const res = await SellersService.updateSellerStatus(sellerId, status);
    pushToast({ title: `Seller marked ${status}`, description: res.data.displayName, tone: 'success' });
    setSelected(res.data);
    load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
            Seller & SHG Management
          </h1>
          <p className="text-sm text-[#6B625B] mt-1">
            Verify newly onboarded women artisans and review district collectives.
          </p>
        </div>

        <DataStateView isLoading={isLoading} error={null} isEmpty={sellers.length === 0}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8 rounded-xl border border-[#E5DCD0] bg-white overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#FBF8F3] border-b border-[#E5DCD0] text-xs text-[#6B625B]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Seller / SHG</th>
                    <th className="py-3 px-4 font-semibold">District</th>
                    <th className="py-3 px-4 font-semibold">Type</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Earnings</th>
                    <th className="py-3 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8DC]">
                  {sellers.map((s) => (
                    <tr key={s.id} className="hover:bg-[#FBF8F3]">
                      <td className="py-3 px-4 font-medium text-[#302B27]">{s.displayName}</td>
                      <td className="py-3 px-4 text-[#6B625B]">{s.district}</td>
                      <td className="py-3 px-4 text-xs uppercase text-[#6B625B]">{s.sellerType}</td>
                      <td className="py-3 px-4 text-xs font-semibold capitalize">
                        <span
                          className={
                            s.status === 'verified'
                              ? 'text-[#456B50]'
                              : s.status === 'pending'
                              ? 'text-[#D9A441]'
                              : 'text-[#B9382C]'
                          }
                        >
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums font-medium">
                        {formatINR(s.totalEarnings)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelected(s)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#A45C3B] hover:underline cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" /> Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-4 rounded-xl border border-[#E5DCD0] bg-white p-5 space-y-4">
              {selected ? (
                <>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-[#A45C3B]">Seller Detail Panel</p>
                    <h2 className="font-serif text-xl font-bold text-[#302B27]">
                      {selected.displayName}
                    </h2>
                    <p className="text-xs text-[#6B625B]">
                      {selected.village}, {selected.block}, {selected.district}
                    </p>
                  </div>
                  <p className="text-xs text-[#302B27] leading-relaxed">{selected.story}</p>
                  <div className="text-xs text-[#6B625B] space-y-1">
                    <p>Coordinator: {selected.leaderName}</p>
                    <p>Phone: +91 {selected.phone}</p>
                    <p>Language: {selected.preferredLanguage.toUpperCase()}</p>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="forest"
                      onClick={() => handleStatus(selected.id, 'verified')}
                      className="flex-1"
                    >
                      Verify Seller
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatus(selected.id, 'suspended')}
                      className="flex-1"
                    >
                      Suspend
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-sm text-[#6B625B]">
                  Select any seller row to inspect details and approve verification.
                </p>
              )}
            </div>
          </div>
        </DataStateView>
      </div>
    </AdminLayout>
  );
}

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | Product['status']>('all');
  const [isLoading, setIsLoading] = useState(true);
  const { pushToast } = useStore();

  const load = async () => {
    setIsLoading(true);
    const res = await ProductsService.listProducts({ includeUnapproved: true });
    setProducts(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDecision = async (productId: string, status: Product['status']) => {
    const res = await ProductsService.updateProductStatus(productId, status);
    pushToast({
      title: `Product ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      description: res.data.name,
      tone: status === 'approved' ? 'success' : 'info',
    });
    load();
  };

  const filtered =
    statusFilter === 'all'
      ? products
      : products.filter((p) => p.status === statusFilter);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
              Product Verification & Catalog
            </h1>
            <p className="text-sm text-[#6B625B] mt-1">
              Approve seller-submitted crafts before they appear on the live storefront.
            </p>
          </div>

          <div className="inline-flex p-1 rounded-lg bg-white border border-[#E5DCD0]">
            {[
              { id: 'all', label: 'All' },
              { id: 'pending_verification', label: 'Pending' },
              { id: 'approved', label: 'Approved' },
              { id: 'rejected', label: 'Rejected' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#302B27] text-white'
                    : 'text-[#6B625B] hover:text-[#302B27]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <DataStateView isLoading={isLoading} error={null} isEmpty={filtered.length === 0}>
          <div className="rounded-xl border border-[#E5DCD0] bg-white overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FBF8F3] border-b border-[#E5DCD0] text-xs text-[#6B625B]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Maker</th>
                  <th className="py-3 px-4 font-semibold">Category</th>
                  <th className="py-3 px-4 font-semibold text-right">Price</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DC]">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FBF8F3]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-[#EFE7DA] shrink-0">
                          <SafeImage src={p.imageUrl} alt={p.name} className="w-full h-full" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[#302B27] truncate max-w-[220px]">
                            {p.name}
                          </p>
                          <p className="text-xs text-[#6B625B] font-mono">{p.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-xs text-[#6B625B]">{p.sellerName}</td>
                    <td className="py-3 px-4 text-xs text-[#6B625B]">{p.categoryName}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold">
                      {formatINR(p.price)}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold capitalize">
                      <span
                        className={
                          p.status === 'approved'
                            ? 'text-[#456B50]'
                            : p.status === 'rejected'
                            ? 'text-[#B9382C]'
                            : 'text-[#9A6E14]'
                        }
                      >
                        {p.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleDecision(p.id, 'approved')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#456B50] text-white text-xs font-medium hover:bg-[#385842] cursor-pointer"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDecision(p.id, 'rejected')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded border border-[#D5C9B8] text-[#B9382C] text-xs font-medium hover:bg-[#F7F1E7] cursor-pointer"
                        >
                          <XCircle className="h-3.5 w-3.5" /> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataStateView>
      </div>
    </AdminLayout>
  );
}
