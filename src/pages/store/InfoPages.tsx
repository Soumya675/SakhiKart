import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Mail, MapPin, Phone } from 'lucide-react';
import { DEMO_ASSETS } from '@/src/lib/mock-data/images';
import { contactSchema, ContactFormValues } from '@/src/lib/validation/schemas';
import { useStore } from '@/src/context/StoreContext';
import { Button } from '@/src/components/ui/Button';
import { SafeImage } from '@/src/components/ui/SafeImage';

export function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4">
          <p className="text-xs font-medium text-[#A45C3B]">About SakhiKart</p>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#302B27] leading-tight">
            Building Dignified Market Access for Rural Women Makers
          </h1>
          <p className="text-base text-[#6B625B] leading-relaxed">
            Across Odisha’s villages, women weave exquisite Sambalpuri cottons,
            sun-cure heritage pickles and badi, sculpt river terracotta, and
            plait hill bamboo — yet middlemen and digital barriers keep them
            disconnected from fair urban markets.
          </p>
          <p className="text-base text-[#6B625B] leading-relaxed">
            SakhiKart operates as a managed multi-vendor marketplace: our field
            teams collect products directly from homes and Self-Help Groups,
            inspect quality at our Bhubaneswar hub, shoot studio photography,
            and remit transparent payouts directly to women-led accounts.
          </p>
        </div>
        <div className="lg:col-span-6 aspect-[16/10] rounded-2xl overflow-hidden border border-[#E5DCD0]">
          <SafeImage
            src={DEMO_ASSETS.shgEmpowerment}
            alt="Rural women Self-Help Group members working together in Odisha"
            className="w-full h-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: 'Zero Technical Barrier',
            desc: 'Sellers use a simplified portal in Odia, Hindi, or English without needing courier accounts or studio cameras.',
          },
          {
            title: 'Managed Quality & Hygiene',
            desc: 'Food batches undergo moisture, seal, and shelf-life logging; handlooms and crafts are graded before dispatch.',
          },
          {
            title: '88% Direct Artisan Share',
            desc: 'Only a transparent 12% managed-service fee covers hub packaging, photography, and customer support.',
          },
        ].map((card) => (
          <div key={card.title} className="rounded-xl border border-[#E5DCD0] bg-white p-6 space-y-2">
            <h2 className="font-serif text-xl font-bold text-[#302B27]">{card.title}</h2>
            <p className="text-sm text-[#6B625B] leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-[#302B27] text-white p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold">Ready to support Odisha’s makers?</h2>
          <p className="text-sm text-[#D7CEC4] mt-1">
            Explore curated food, handloom, and home craft collections.
          </p>
        </div>
        <Link
          to="/shop"
          className="h-11 px-6 inline-flex items-center rounded-lg bg-[#A45C3B] text-white text-sm font-medium hover:bg-[#8A4A2E]"
        >
          Shop SakhiKart
        </Link>
      </div>
    </div>
  );
}

export function ContactPage() {
  const { pushToast } = useStore();
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { topic: 'Customer Order Support' },
  });

  const onSubmit = () => {
    setSubmitted(true);
    pushToast({
      title: 'Message sent to SakhiKart Support',
      description: 'Our Bhubaneswar coordinator team responds within 24 hours.',
      tone: 'success',
    });
    reset();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-5">
        <p className="text-xs font-medium text-[#A45C3B]">Contact Us</p>
        <h1 className="font-serif text-3xl font-bold text-[#302B27]">
          We’re Here to Help Buyers & Rural Makers
        </h1>
        <p className="text-sm text-[#6B625B] leading-relaxed">
          Reach out for bulk festive gifting, SHG onboarding partnerships, or
          customer order assistance.
        </p>
        <div className="space-y-3 text-sm text-[#302B27] pt-2">
          <p className="flex items-center gap-2.5">
            <MapPin className="h-4 w-4 text-[#A45C3B]" />
            <span>Plot 18, Saheed Nagar Hub, Bhubaneswar, Odisha 751007</span>
          </p>
          <p className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-[#A45C3B]" />
            <span className="font-mono">+91 674 254 8810 (Mon–Sat, 9 AM–6 PM)</span>
          </p>
          <p className="flex items-center gap-2.5">
            <Mail className="h-4 w-4 text-[#A45C3B]" />
            <span>support@sakhikart.in</span>
          </p>
        </div>
      </div>

      <div className="lg:col-span-7 rounded-2xl border border-[#E5DCD0] bg-white p-6 sm:p-8">
        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <h2 className="font-serif text-2xl font-bold text-[#456B50]">
              Thank you for writing to us
            </h2>
            <p className="text-sm text-[#6B625B]">
              Your inquiry has been logged in our Bhubaneswar support desk.
            </p>
            <Button variant="outline" onClick={() => setSubmitted(false)}>
              Send Another Message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1">Your Name</label>
              <input
                {...register('name')}
                className="w-full h-11 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
              />
              {errors.name ? (
                <p className="text-xs text-[#B9382C] mt-1">{errors.name.message}</p>
              ) : null}
            </div>
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
              <label className="block text-xs font-medium mb-1">Topic</label>
              <select
                {...register('topic')}
                className="w-full h-11 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
              >
                <option value="Customer Order Support">Customer Order Support</option>
                <option value="Seller / SHG Onboarding">Seller / SHG Onboarding</option>
                <option value="Corporate & Festive Gifting">Corporate & Festive Gifting</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Message</label>
              <textarea
                rows={4}
                {...register('message')}
                className="w-full rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] p-3.5 text-sm"
              />
              {errors.message ? (
                <p className="text-xs text-[#B9382C] mt-1">{errors.message.message}</p>
              ) : null}
            </div>
            <Button type="submit" size="lg" className="w-full">
              Send Message
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}

const FAQS = [
  {
    q: 'How does SakhiKart ensure quality for homemade pickles and papad?',
    a: 'Every food batch collected from our partner Self-Help Groups undergoes moisture, aroma, weight, and vacuum-seal inspection at our Bhubaneswar hub before listing and dispatch.',
  },
  {
    q: 'How much of my purchase price goes to the women artisan or SHG?',
    a: '88% of the net product revenue goes directly to the artisan or Self-Help Group bank account. SakhiKart retains a flat 12% managed-marketplace fee to cover village pickup, studio photography, quality inspection, and packaging.',
  },
  {
    q: 'Can rural women without smartphones or English literacy sell on SakhiKart?',
    a: 'Yes. Our Seller Portal supports Odia, Hindi, and English with large visual controls, and our field coordinators assist with onboarding and doorstep stock collection.',
  },
  {
    q: 'Do you ship outside Odisha?',
    a: 'Yes! While our launch artisans and food clusters are rooted across Odisha, we ship hub-verified orders across India with free shipping above ₹999.',
  },
];

export function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <p className="text-xs font-medium text-[#A45C3B]">Frequently Asked Questions</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#302B27]">
          How SakhiKart Works
        </h1>
      </div>

      <div className="space-y-3">
        {FAQS.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={item.q}
              className="rounded-xl border border-[#E5DCD0] bg-white overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-[#302B27] cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-[#A45C3B]' : ''
                  }`}
                />
              </button>
              {isOpen ? (
                <div className="px-5 pb-4 text-sm text-[#6B625B] leading-relaxed border-t border-[#F5EFE6] pt-3">
                  {item.a}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
