import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, ShieldCheck } from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';
import { checkoutSchema, CheckoutFormValues } from '@/src/lib/validation/schemas';
import { formatINR } from '@/src/lib/utils';
import { OrdersService } from '@/src/services/orders.service';
import { Button } from '@/src/components/ui/Button';

export function CheckoutPage() {
  const { cart, cartSubtotal, shippingFee, cartTotal, customer, clearCart, pushToast } =
    useStore();
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: customer?.defaultAddress.fullName || '',
      phone: customer?.defaultAddress.phone || '',
      email: customer?.defaultAddress.email || '',
      addressLine: customer?.defaultAddress.addressLine || '',
      city: customer?.defaultAddress.city || '',
      district: customer?.defaultAddress.district || '',
      state: customer?.defaultAddress.state || 'Odisha',
      pincode: customer?.defaultAddress.pincode || '',
      paymentMethod: 'cod',
    },
  });

  const selectedPayment = watch('paymentMethod');

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="font-serif text-3xl font-bold text-[#302B27]">
          No items to checkout
        </h1>
        <p className="text-sm text-[#6B625B]">
          Add handmade crafts to your bag before proceeding to delivery details.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center justify-center h-11 px-6 rounded-lg bg-[#A45C3B] text-white text-sm font-medium"
        >
          Browse Shop
        </Link>
      </div>
    );
  }

  const onSubmit = async (values: CheckoutFormValues) => {
    setSubmitting(true);
    try {
      const res = await OrdersService.createOrder({
        customerId: customer?.id || 'cust-guest',
        shippingAddress: {
          fullName: values.fullName,
          phone: values.phone,
          email: values.email,
          addressLine: values.addressLine,
          city: values.city,
          district: values.district,
          state: values.state,
          pincode: values.pincode,
        },
        paymentMethod: values.paymentMethod,
        items: cart,
      });
      clearCart();
      pushToast({
        title: `Order ${res.data.orderNumber} Confirmed`,
        description: 'Redirecting to your live order tracking view.',
        tone: 'success',
      });
      navigate(`/orders/${res.data.orderNumber}`);
    } catch (err) {
      pushToast({
        title: 'Checkout error',
        description: err instanceof Error ? err.message : 'Could not place order',
        tone: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#E5DCD0] pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#302B27]">Checkout</h1>
          <p className="text-sm text-[#6B625B] mt-1">
            Phase 1 Demo Checkout — No live payment gateway charge is made.
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#456B50]">
          <ShieldCheck className="h-4 w-4" />
          <span>Hub-Verified Packaging & Safe Delivery</span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
      >
        {/* Left Shipping & Payment Form */}
        <div className="lg:col-span-7 space-y-6">
          <section className="rounded-xl border border-[#E5DCD0] bg-white p-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#302B27]">
              1. Delivery Address
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#302B27] mb-1">
                  Recipient Full Name
                </label>
                <input
                  {...register('fullName')}
                  className="w-full h-10 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3 text-sm"
                />
                {errors.fullName ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.fullName.message}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#302B27] mb-1">
                  Mobile Number (10-digit)
                </label>
                <input
                  {...register('phone')}
                  placeholder="9861045210"
                  className="w-full h-10 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3 text-sm"
                />
                {errors.phone ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.phone.message}</p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#302B27] mb-1">
                  Email for Order Updates
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full h-10 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3 text-sm"
                />
                {errors.email ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#302B27] mb-1">
                  Street / House / Apartment
                </label>
                <input
                  {...register('addressLine')}
                  className="w-full h-10 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3 text-sm"
                />
                {errors.addressLine ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.addressLine.message}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#302B27] mb-1">
                  City / Town
                </label>
                <input
                  {...register('city')}
                  className="w-full h-10 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3 text-sm"
                />
                {errors.city ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.city.message}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#302B27] mb-1">
                  District
                </label>
                <input
                  {...register('district')}
                  className="w-full h-10 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3 text-sm"
                />
                {errors.district ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.district.message}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#302B27] mb-1">
                  State
                </label>
                <input
                  {...register('state')}
                  className="w-full h-10 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3 text-sm"
                />
                {errors.state ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.state.message}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-medium text-[#302B27] mb-1">
                  PIN Code
                </label>
                <input
                  {...register('pincode')}
                  placeholder="751007"
                  className="w-full h-10 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3 text-sm font-mono"
                />
                {errors.pincode ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.pincode.message}</p>
                ) : null}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[#E5DCD0] bg-white p-6 space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#302B27]">
              2. Payment Method (Phase 1 Demo)
            </h2>
            <div className="space-y-2.5">
              {[
                {
                  id: 'cod',
                  title: 'Cash on Delivery (COD)',
                  desc: 'Pay in cash or UPI upon delivery at your doorstep.',
                },
                {
                  id: 'upi_demo',
                  title: 'UPI / QR (Razorpay Integration Preview)',
                  desc: 'Simulated instant UPI confirmation for Phase 1 testing.',
                },
                {
                  id: 'card_demo',
                  title: 'Debit / Credit Card (Razorpay Preview)',
                  desc: 'Simulated card checkout — real Razorpay keys connect in Phase 2.',
                },
              ].map((method) => (
                <label
                  key={method.id}
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                    selectedPayment === method.id
                      ? 'border-[#A45C3B] bg-[#FBF8F3]'
                      : 'border-[#E5DCD0] hover:bg-[#FBF8F3]/60'
                  }`}
                >
                  <input
                    type="radio"
                    value={method.id}
                    {...register('paymentMethod')}
                    className="mt-1 accent-[#A45C3B]"
                  />
                  <div>
                    <p className="text-sm font-semibold text-[#302B27]">{method.title}</p>
                    <p className="text-xs text-[#6B625B] mt-0.5">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right Summary */}
        <aside className="lg:col-span-5 rounded-xl border border-[#E5DCD0] bg-white p-6 space-y-5 lg:sticky lg:top-24">
          <h2 className="font-serif text-xl font-bold text-[#302B27]">
            Order Summary ({cart.length} items)
          </h2>

          <div className="divide-y divide-[#F0E8DC] max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.productId} className="py-3 flex justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium text-[#302B27] truncate">{item.name}</p>
                  <p className="text-xs text-[#6B625B]">
                    Qty {item.quantity} × {formatINR(item.price)}
                  </p>
                </div>
                <span className="font-semibold text-[#302B27] tabular-nums shrink-0">
                  {formatINR(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-[#E5DCD0] text-sm">
            <div className="flex justify-between text-[#6B625B]">
              <span>Subtotal</span>
              <span className="tabular-nums font-medium text-[#302B27]">
                {formatINR(cartSubtotal)}
              </span>
            </div>
            <div className="flex justify-between text-[#6B625B]">
              <span>Shipping</span>
              <span className="tabular-nums font-medium text-[#456B50]">
                {shippingFee === 0 ? 'Free' : formatINR(shippingFee)}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-[#E5DCD0] text-base font-bold text-[#302B27]">
              <span>Total Payable</span>
              <span className="tabular-nums">{formatINR(cartTotal)}</span>
            </div>
          </div>

          <Button type="submit" size="lg" isLoading={submitting} className="w-full">
            <Lock className="h-4 w-4" />
            <span>Place Demo Order · {formatINR(cartTotal)}</span>
          </Button>
        </aside>
      </form>
    </div>
  );
}
