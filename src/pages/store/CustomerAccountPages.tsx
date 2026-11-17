import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Clock, Package, Truck, User } from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';
import { loginSchema, registerSchema } from '@/src/lib/validation/schemas';
import { formatDate, formatINR } from '@/src/lib/utils';
import { OrdersService } from '@/src/services/orders.service';
import { ProductsService } from '@/src/services/products.service';
import { Order } from '@/src/types/order';
import { Product } from '@/src/types/product';
import { Button } from '@/src/components/ui/Button';
import { DataStateView } from '@/src/components/ui/DataStateView';
import { ProductCard } from '@/src/components/marketplace/ProductCard';
import { SafeImage } from '@/src/components/ui/SafeImage';

export function CustomerLoginPage() {
  const { loginCustomerDemo } = useStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'ananya.patnaik@example.in', password: 'password123' },
  });

  const onSubmit = (data: { email: string }) => {
    loginCustomerDemo(data.email);
    navigate('/profile');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="rounded-2xl border border-[#E5DCD0] bg-white p-7 space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#A45C3B]">Customer Sign In (Demo)</p>
          <h1 className="font-serif text-3xl font-bold text-[#302B27]">Welcome Back</h1>
          <p className="text-sm text-[#6B625B]">
            Sign in to view your saved crafts, addresses, and live order tracking.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Email Address</label>
            <input
              type="email"
              {...register('email')}
              className="w-full h-11 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
            />
            {errors.email ? (
              <p className="text-xs text-[#B9382C] mt-1">{errors.email.message}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full h-11 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
            />
            {errors.password ? (
              <p className="text-xs text-[#B9382C] mt-1">{errors.password.message}</p>
            ) : null}
          </div>
          <Button type="submit" size="lg" className="w-full">
            Sign In to SakhiKart
          </Button>
        </form>

        <p className="text-center text-xs text-[#6B625B]">
          New to SakhiKart?{' '}
          <Link to="/register" className="font-semibold text-[#A45C3B] hover:underline">
            Create Customer Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export function CustomerRegisterPage() {
  const { loginCustomerDemo } = useStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ fullName: string; email: string; phone: string; password: string }>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: { fullName: string; email: string }) => {
    loginCustomerDemo(data.email, data.fullName);
    navigate('/profile');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="rounded-2xl border border-[#E5DCD0] bg-white p-7 space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#A45C3B]">New Buyer Registration (Demo)</p>
          <h1 className="font-serif text-3xl font-bold text-[#302B27]">Join SakhiKart</h1>
          <p className="text-sm text-[#6B625B]">
            Support rural women artisans across Odisha with every order.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1">Full Name</label>
            <input
              {...register('fullName')}
              placeholder="Priya Mohanty"
              className="w-full h-11 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
            />
            {errors.fullName ? (
              <p className="text-xs text-[#B9382C] mt-1">{errors.fullName.message}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Email Address</label>
            <input
              type="email"
              {...register('email')}
              placeholder="priya@example.in"
              className="w-full h-11 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
            />
            {errors.email ? (
              <p className="text-xs text-[#B9382C] mt-1">{errors.email.message}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Mobile Number</label>
            <input
              {...register('phone')}
              placeholder="9861045210"
              className="w-full h-11 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
            />
            {errors.phone ? (
              <p className="text-xs text-[#B9382C] mt-1">{errors.phone.message}</p>
            ) : null}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Password</label>
            <input
              type="password"
              {...register('password')}
              className="w-full h-11 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
            />
            {errors.password ? (
              <p className="text-xs text-[#B9382C] mt-1">{errors.password.message}</p>
            ) : null}
          </div>
          <Button type="submit" size="lg" className="w-full">
            Create Account
          </Button>
        </form>

        <p className="text-center text-xs text-[#6B625B]">
          Already registered?{' '}
          <Link to="/login" className="font-semibold text-[#A45C3B] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

export function CustomerProfilePage() {
  const { customer, wishlistIds, logoutCustomer } = useStore();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    ProductsService.listProducts().then((res) => {
      setWishlistProducts(res.data.filter((p) => wishlistIds.includes(p.id)));
    });
  }, [wishlistIds]);

  if (!customer) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <User className="h-10 w-10 text-[#A45C3B] mx-auto" />
        <h1 className="font-serif text-3xl font-bold text-[#302B27]">
          Sign in to view your profile
        </h1>
        <Button onClick={() => navigate('/login')}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="rounded-2xl border border-[#E5DCD0] bg-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-[#A45C3B]">Customer Account</p>
          <h1 className="font-serif text-3xl font-bold text-[#302B27]">
            {customer.fullName}
          </h1>
          <p className="text-sm text-[#6B625B]">
            {customer.email} · +91 {customer.phone}
          </p>
          <p className="text-xs text-[#6B625B] pt-1">
            Default Address: {customer.defaultAddress.addressLine},{' '}
            {customer.defaultAddress.city}, {customer.defaultAddress.state} —{' '}
            {customer.defaultAddress.pincode}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/orders"
            className="h-10 px-4 inline-flex items-center rounded-lg border border-[#D5C9B8] text-sm font-medium hover:bg-[#F7F1E7]"
          >
            My Orders
          </Link>
          <Button variant="outline" size="sm" onClick={logoutCustomer}>
            Sign Out
          </Button>
        </div>
      </div>

      <section className="space-y-5">
        <h2 className="font-serif text-2xl font-bold text-[#302B27]">
          Saved Wishlist ({wishlistProducts.length})
        </h2>
        {wishlistProducts.length === 0 ? (
          <p className="text-sm text-[#6B625B]">
            Tap the heart icon on any handmade item to save it here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    OrdersService.listOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to load orders'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-[#302B27]">My Orders</h1>
        <p className="text-sm text-[#6B625B] mt-1">
          Track shipments packed and verified at SakhiKart’s Odisha fulfillment hub.
        </p>
      </div>

      <DataStateView
        isLoading={isLoading}
        error={error}
        isEmpty={orders.length === 0}
        emptyTitle="No orders yet"
        emptyDescription="Your handmade orders will appear here once placed."
        emptyActionLabel="Shop Crafts"
        onEmptyAction={() => navigate('/shop')}
      >
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-[#E5DCD0] bg-white p-5 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#F0E8DC]">
                <div className="space-y-0.5">
                  <p className="font-mono text-sm font-semibold text-[#302B27]">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-[#6B625B]">
                    Placed {formatDate(order.createdAt)} · {order.items.length} item(s)
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-[#456B50] capitalize">
                    {order.orderStatus.replace('_', ' ')}
                  </span>
                  <span className="text-base font-bold text-[#302B27] tabular-nums">
                    {formatINR(order.totalAmount)}
                  </span>
                  <Link
                    to={`/orders/${order.orderNumber}`}
                    className="h-9 px-3.5 inline-flex items-center rounded-lg bg-[#302B27] text-white text-xs font-medium hover:bg-[#A45C3B]"
                  >
                    Track Order
                  </Link>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                {order.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#EFE7DA]">
                      <SafeImage src={item.imageUrl} alt={item.productName} className="w-full h-full" />
                    </div>
                    <div className="text-xs">
                      <p className="font-semibold text-[#302B27]">{item.productName}</p>
                      <p className="text-[#6B625B]">Qty {item.quantity} · {item.sellerName}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DataStateView>
    </div>
  );
}

export function OrderTrackingPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) return;
    OrdersService.getOrderByNumber(orderNumber)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err instanceof Error ? err.message : 'Unable to fetch order'))
      .finally(() => setIsLoading(false));
  }, [orderNumber]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Link to="/orders" className="text-xs font-medium text-[#A45C3B] hover:underline">
        ← Back to My Orders
      </Link>

      <DataStateView
        isLoading={isLoading}
        error={error}
        isEmpty={!order}
        emptyTitle="Order not found"
        emptyDescription="Verify the order number and try again."
      >
        {order ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-[#E5DCD0] bg-white p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#F0E8DC] pb-4">
                <div>
                  <p className="text-xs font-medium text-[#A45C3B]">Live Order Tracking</p>
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27] mt-0.5">
                    Order <span className="font-mono">{order.orderNumber}</span>
                  </h1>
                  <p className="text-xs text-[#6B625B] mt-1">
                    Courier: {order.courierPartner} · AWB: <span className="font-mono">{order.trackingCode}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#6B625B]">Total Amount</p>
                  <p className="font-serif text-2xl font-bold text-[#302B27] tabular-nums">
                    {formatINR(order.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                {order.timeline.map((step, index) => (
                  <div key={index} className="flex items-start gap-3.5">
                    <div className="mt-0.5">
                      {step.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-[#456B50]" />
                      ) : (
                        <Clock className="h-5 w-5 text-[#D9A441]" />
                      )}
                    </div>
                    <div className="flex-1 pb-3 border-b border-[#F5EFE6] last:border-none">
                      <div className="flex flex-wrap justify-between gap-2">
                        <p className="text-sm font-semibold text-[#302B27]">{step.label}</p>
                        <span className="text-xs text-[#6B625B] font-mono">{step.timestamp}</span>
                      </div>
                      <p className="text-xs text-[#6B625B] mt-0.5">{step.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-[#E5DCD0] bg-white p-5 space-y-2 text-sm">
                <h2 className="font-serif text-lg font-bold flex items-center gap-2">
                  <Truck className="h-4 w-4 text-[#A45C3B]" />
                  <span>Delivery Address</span>
                </h2>
                <p className="font-semibold text-[#302B27]">{order.shippingAddress.fullName}</p>
                <p className="text-[#6B625B]">{order.shippingAddress.addressLine}</p>
                <p className="text-[#6B625B]">
                  {order.shippingAddress.city}, {order.shippingAddress.district},{' '}
                  {order.shippingAddress.state} — {order.shippingAddress.pincode}
                </p>
                <p className="text-xs text-[#6B625B]">Phone: +91 {order.shippingAddress.phone}</p>
              </div>

              <div className="rounded-xl border border-[#E5DCD0] bg-white p-5 space-y-3 text-sm">
                <h2 className="font-serif text-lg font-bold flex items-center gap-2">
                  <Package className="h-4 w-4 text-[#A45C3B]" />
                  <span>Items in Shipment</span>
                </h2>
                {order.items.map((item) => (
                  <div key={item.productId} className="flex justify-between gap-2 text-xs">
                    <span className="text-[#302B27] font-medium">
                      {item.quantity} × {item.productName}
                    </span>
                    <span className="tabular-nums font-semibold">{formatINR(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </DataStateView>
    </div>
  );
}
