import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Download } from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';
import { formatDate, formatINR } from '@/src/lib/utils';
import { InventoryService } from '@/src/services/inventory.service';
import { OrdersService } from '@/src/services/orders.service';
import { ProductsService } from '@/src/services/products.service';
import { SellersService } from '@/src/services/sellers.service';
import { InventoryBatch, RevenuePoint } from '@/src/types/inventory';
import { Order, OrderStatus } from '@/src/types/order';
import { ProductCategory } from '@/src/types/product';
import { SellerPayout } from '@/src/types/seller';
import { AdminLayout } from '@/src/components/layout/AdminLayout';
import { Button } from '@/src/components/ui/Button';
import { DataStateView } from '@/src/components/ui/DataStateView';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { pushToast } = useStore();

  const load = async () => {
    setIsLoading(true);
    const res = await OrdersService.listOrders();
    setOrders(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const res = await OrdersService.updateOrderStatus(orderId, status);
    pushToast({
      title: `Order ${res.data.orderNumber} updated`,
      description: `Status set to ${status}`,
      tone: 'success',
    });
    load();
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
            Order Tracking & Fulfillment
          </h1>
          <p className="text-sm text-[#6B625B] mt-1">
            Monitor customer orders and advance hub dispatch states.
          </p>
        </div>

        <DataStateView isLoading={isLoading} error={null} isEmpty={orders.length === 0}>
          <div className="rounded-xl border border-[#E5DCD0] bg-white overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FBF8F3] border-b border-[#E5DCD0] text-xs text-[#6B625B]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Order #</th>
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Destination</th>
                  <th className="py-3 px-4 font-semibold text-right">Amount</th>
                  <th className="py-3 px-4 font-semibold">Payment</th>
                  <th className="py-3 px-4 font-semibold">Order Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DC]">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-[#FBF8F3]">
                    <td className="py-3 px-4 font-mono text-xs font-semibold">
                      {ord.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-medium">{ord.customerName}</td>
                    <td className="py-3 px-4 text-xs text-[#6B625B]">
                      {ord.shippingAddress.city}, {ord.shippingAddress.state}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold">
                      {formatINR(ord.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-xs capitalize text-[#6B625B]">
                      {ord.paymentStatus.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4">
                      <select
                        value={ord.orderStatus}
                        onChange={(e) =>
                          updateStatus(ord.id, e.target.value as OrderStatus)
                        }
                        className="h-8 px-2.5 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] text-xs font-medium"
                      >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="packed">Packed</option>
                        <option value="in_transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                      </select>
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

export function AdminInventoryPage() {
  const [batches, setBatches] = useState<InventoryBatch[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([InventoryService.listBatches(), ProductsService.getCategories()])
      .then(([b, c]) => {
        setBatches(b.data);
        setCategories(c.data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
            Categories & Warehouse Inventory
          </h1>
          <p className="text-sm text-[#6B625B] mt-1">
            Monitor active craft categories, hub batch stock, and food expiry timelines.
          </p>
        </div>

        <DataStateView isLoading={isLoading} error={null} isEmpty={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="rounded-xl border border-[#E5DCD0] bg-white p-4 space-y-1">
                <p className="text-xs font-medium text-[#A45C3B]">{cat.odishaOriginHighlight}</p>
                <h2 className="font-serif text-lg font-bold text-[#302B27]">{cat.name}</h2>
                <p className="text-xs text-[#6B625B] tabular-nums">
                  {cat.productCount ?? 0} live catalog SKUs
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-[#E5DCD0] bg-white overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FBF8F3] border-b border-[#E5DCD0] text-xs text-[#6B625B]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Batch Code</th>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Hub Bay</th>
                  <th className="py-3 px-4 font-semibold text-right">Available</th>
                  <th className="py-3 px-4 font-semibold">QC Status</th>
                  <th className="py-3 px-4 font-semibold">Expiry Alert</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DC]">
                {batches.map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 px-4 font-mono text-xs font-semibold">{b.batchCode}</td>
                    <td className="py-3 px-4 font-medium">{b.productName}</td>
                    <td className="py-3 px-4 text-xs text-[#6B625B]">{b.hubLocation}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold">
                      {b.availableQuantity} / {b.receivedQuantity}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold capitalize text-[#456B50]">
                      {b.qualityStatus.replace('_', ' ')}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {b.expiryDate
                        ? `${b.expiryDate} (${b.daysUntilExpiry}d left)`
                        : 'Non-perishable craft'}
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

export function AdminFinancePage() {
  const [payouts, setPayouts] = useState<SellerPayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    SellersService.listPayouts()
      .then((res) => setPayouts(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  const totalGross = payouts.reduce((s, p) => s + p.grossSales, 0);
  const totalCommission = payouts.reduce((s, p) => s + p.platformFee, 0);
  const totalNet = payouts.reduce((s, p) => s + p.netPayable, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
            Commission & Seller Settlements
          </h1>
          <p className="text-sm text-[#6B625B] mt-1">
            Flat 12% managed-marketplace service fee covering collection, QC, photography, and packaging.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-[#E5DCD0] bg-white p-5">
            <p className="text-xs text-[#6B625B]">Total Settled Gross Sales</p>
            <p className="font-serif text-2xl font-bold tabular-nums mt-1">
              {formatINR(totalGross)}
            </p>
          </div>
          <div className="rounded-xl border border-[#E5DCD0] bg-white p-5">
            <p className="text-xs text-[#6B625B]">SakhiKart Service Fee (12%)</p>
            <p className="font-serif text-2xl font-bold text-[#A45C3B] tabular-nums mt-1">
              {formatINR(totalCommission)}
            </p>
          </div>
          <div className="rounded-xl border border-[#E5DCD0] bg-white p-5">
            <p className="text-xs text-[#6B625B]">Net Remitted to Makers (88%)</p>
            <p className="font-serif text-2xl font-bold text-[#456B50] tabular-nums mt-1">
              {formatINR(totalNet)}
            </p>
          </div>
        </div>

        <DataStateView isLoading={isLoading} error={null} isEmpty={payouts.length === 0}>
          <div className="rounded-xl border border-[#E5DCD0] bg-white overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FBF8F3] border-b border-[#E5DCD0] text-xs text-[#6B625B]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Reference</th>
                  <th className="py-3 px-4 font-semibold">Seller / SHG</th>
                  <th className="py-3 px-4 font-semibold">Cycle</th>
                  <th className="py-3 px-4 font-semibold text-right">Gross</th>
                  <th className="py-3 px-4 font-semibold text-right">12% Fee</th>
                  <th className="py-3 px-4 font-semibold text-right">Net Payout</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DC]">
                {payouts.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 px-4 font-mono text-xs">{p.referenceNumber}</td>
                    <td className="py-3 px-4 font-medium">{p.sellerName}</td>
                    <td className="py-3 px-4 text-xs text-[#6B625B]">{p.periodLabel}</td>
                    <td className="py-3 px-4 text-right tabular-nums">{formatINR(p.grossSales)}</td>
                    <td className="py-3 px-4 text-right tabular-nums text-[#6B625B]">
                      {formatINR(p.platformFee)}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-[#456B50]">
                      {formatINR(p.netPayable)}
                    </td>
                    <td className="py-3 px-4 text-xs font-semibold capitalize">
                      {p.status}
                      {p.paidAt ? ` · ${formatDate(p.paidAt)}` : ''}
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

export function AdminReportsPage() {
  const [series, setSeries] = useState<RevenuePoint[]>([]);
  const { pushToast } = useStore();

  useEffect(() => {
    InventoryService.getRevenueSeries().then((res) => setSeries(res.data));
  }, []);

  const exportCsv = () => {
    const header = 'Month,GrossSalesINR,SellerPayoutsINR,OrdersCount\n';
    const rows = series
      .map((r) => `${r.month},${r.grossMerchandiseValue},${r.sellerPayouts},${r.ordersCount}`)
      .join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sakhikart-demo-revenue-report.csv';
    link.click();
    URL.revokeObjectURL(url);
    pushToast({ title: 'CSV report downloaded', tone: 'success' });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
              Marketplace Impact & Volume Reports
            </h1>
            <p className="text-sm text-[#6B625B] mt-1">
              Monthly order throughput and women artisan payout performance.
            </p>
          </div>
          <Button variant="outline" onClick={exportCsv}>
            <Download className="h-4 w-4" />
            <span>Export CSV</span>
          </Button>
        </div>

        <div className="rounded-xl border border-[#E5DCD0] bg-white p-6 space-y-4">
          <h2 className="font-serif text-lg font-bold">Monthly Orders Volume</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EFE7DA" />
                <XAxis dataKey="month" stroke="#6B625B" fontSize={12} />
                <YAxis stroke="#6B625B" fontSize={12} />
                <Tooltip />
                <Bar dataKey="ordersCount" name="Orders" fill="#456B50" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
