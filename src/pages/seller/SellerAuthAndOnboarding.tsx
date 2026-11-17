import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Phone, User, Users } from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';
import { SELLER_TRANSLATIONS } from '@/src/lib/i18n/translations';
import {
  sellerOnboardingSchema,
  SellerOnboardingValues,
} from '@/src/lib/validation/schemas';
import { SellersService } from '@/src/services/sellers.service';
import { LanguageCode } from '@/src/types/common';
import { Button } from '@/src/components/ui/Button';

const SKILL_OPTIONS = [
  'Homemade Pickles',
  'Papad & Badi',
  'Sambalpuri Handloom',
  'Bamboo & Cane Crafts',
  'Terracotta Pottery',
  'Pattachitra Art',
  'Handmade Jewellery',
  'Embroidery & Stitching',
];

export function SellerLoginPage() {
  const { sellerLanguage, setSellerLanguage, setActiveSellerId, pushToast } = useStore();
  const t = SELLER_TRANSLATIONS[sellerLanguage];
  const [phone, setPhone] = useState('9861402391');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      pushToast({ title: 'Enter a valid 10-digit mobile number', tone: 'error' });
      return;
    }
    setActiveSellerId('seller-maa-shakti-shg');
    pushToast({
      title: 'Signed in as Maa Shakti Mahila SHG (Demo)',
      tone: 'success',
    });
    navigate('/seller/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#F7F1E7] flex flex-col justify-center px-4 py-10">
      <div className="max-w-md w-full mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="font-serif text-2xl font-bold text-[#302B27]">
            Sakhi<span className="text-[#A45C3B]">Kart</span>
          </Link>
          <div className="inline-flex p-1 rounded-lg bg-white border border-[#E5DCD0]">
            {(
              [
                { code: 'en', label: 'EN' },
                { code: 'hi', label: 'हिन्दी' },
                { code: 'or', label: 'ଓଡ଼ିଆ' },
              ] as { code: LanguageCode; label: string }[]
            ).map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSellerLanguage(lang.code)}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  sellerLanguage === lang.code
                    ? 'bg-[#A45C3B] text-white'
                    : 'text-[#302B27]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5DCD0] bg-white p-6 sm:p-8 space-y-6">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-[#A45C3B]">Seller & SHG Portal</p>
            <h1 className="font-serif text-3xl font-bold text-[#302B27]">
              {t.welcomeBack.split(',')[0]} Maker
            </h1>
            <p className="text-sm text-[#6B625B]">
              Enter your registered mobile number to manage your products,
              pickups, and payouts.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#302B27] mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <Phone className="h-4 w-4 text-[#6B625B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] text-base font-mono"
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full h-12 text-base">
              Enter Seller Dashboard (Demo)
            </Button>
          </form>

          <div className="pt-4 border-t border-[#F0E8DC] space-y-3">
            <p className="text-xs text-[#6B625B] text-center">
              New artisan or Self-Help Group?
            </p>
            <Link
              to="/seller/onboarding"
              className="w-full h-12 inline-flex items-center justify-center rounded-xl border-2 border-[#456B50] text-[#456B50] text-sm font-semibold hover:bg-[#456B50] hover:text-white transition-colors"
            >
              {t.onboardingTitle}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SellerOnboardingPage() {
  const { sellerLanguage, setSellerLanguage, setActiveSellerId, pushToast } = useStore();
  const t = SELLER_TRANSLATIONS[sellerLanguage];
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SellerOnboardingValues>({
    resolver: zodResolver(sellerOnboardingSchema),
    defaultValues: {
      sellerType: 'shg',
      state: 'Odisha',
      preferredLanguage: sellerLanguage,
      specialties: ['Homemade Pickles'],
      groupMemberCount: 12,
    },
  });

  const sellerType = watch('sellerType');
  const selectedSkills = watch('specialties') || [];

  const toggleSkill = (skill: string) => {
    const next = selectedSkills.includes(skill)
      ? selectedSkills.filter((s) => s !== skill)
      : [...selectedSkills, skill];
    setValue('specialties', next, { shouldValidate: true });
  };

  const onSubmit = async (values: SellerOnboardingValues) => {
    setSubmitting(true);
    try {
      const res = await SellersService.onboardSeller(values);
      setActiveSellerId(res.data.id);
      pushToast({
        title: 'Onboarding Application Submitted',
        description: `${res.data.displayName} is saved for field coordinator verification.`,
        tone: 'success',
      });
      navigate('/seller/dashboard');
    } catch (err) {
      pushToast({
        title: 'Submission error',
        description: err instanceof Error ? err.message : 'Please check your fields',
        tone: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F1E7] py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/seller/login" className="text-sm font-medium text-[#A45C3B] hover:underline">
            ← Back to Seller Login
          </Link>
          <div className="inline-flex p-1 rounded-lg bg-white border border-[#E5DCD0]">
            {(
              [
                { code: 'en', label: 'EN' },
                { code: 'hi', label: 'हिन्दी' },
                { code: 'or', label: 'ଓଡ଼ିଆ' },
              ] as { code: LanguageCode; label: string }[]
            ).map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => {
                  setSellerLanguage(lang.code);
                  setValue('preferredLanguage', lang.code);
                }}
                className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                  sellerLanguage === lang.code
                    ? 'bg-[#A45C3B] text-white'
                    : 'text-[#302B27]'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#E5DCD0] bg-white p-6 sm:p-8 space-y-8">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-[#456B50]">Step-by-Step Simple Onboarding</p>
            <h1 className="font-serif text-3xl font-bold text-[#302B27]">
              {t.onboardingTitle}
            </h1>
            <p className="text-sm text-[#6B625B]">
              Choose whether you are registering individually or as a women’s Self-Help Group.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
            {/* Step 1: Two Onboarding Types */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#302B27]">
                1. Choose Your Account Type
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setValue('sellerType', 'individual')}
                  className={`p-5 rounded-xl border-2 text-left space-y-2 cursor-pointer transition-colors ${
                    sellerType === 'individual'
                      ? 'border-[#A45C3B] bg-[#FBF8F3]'
                      : 'border-[#E5DCD0] hover:bg-[#FBF8F3]/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <User className="h-7 w-7 text-[#A45C3B]" />
                    {sellerType === 'individual' ? (
                      <CheckCircle2 className="h-5 w-5 text-[#A45C3B]" />
                    ) : null}
                  </div>
                  <h2 className="font-serif text-lg font-bold text-[#302B27]">
                    {t.individualTitle}
                  </h2>
                  <p className="text-xs text-[#6B625B] leading-relaxed">
                    {t.individualDesc}
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('sellerType', 'shg')}
                  className={`p-5 rounded-xl border-2 text-left space-y-2 cursor-pointer transition-colors ${
                    sellerType === 'shg'
                      ? 'border-[#456B50] bg-[#F4F8F5]'
                      : 'border-[#E5DCD0] hover:bg-[#FBF8F3]/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Users className="h-7 w-7 text-[#456B50]" />
                    {sellerType === 'shg' ? (
                      <CheckCircle2 className="h-5 w-5 text-[#456B50]" />
                    ) : null}
                  </div>
                  <h2 className="font-serif text-lg font-bold text-[#302B27]">
                    {t.shgTitle}
                  </h2>
                  <p className="text-xs text-[#6B625B] leading-relaxed">
                    {t.shgDesc}
                  </p>
                </button>
              </div>
            </div>

            {/* Step 2: Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  {sellerType === 'shg' ? 'Self-Help Group Name' : 'Your Full Name'}
                </label>
                <input
                  {...register('displayName')}
                  placeholder={sellerType === 'shg' ? 'Maa Mangala Mahila SHG' : 'Laxmi Behera'}
                  className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
                />
                {errors.displayName ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.displayName.message}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  {sellerType === 'shg' ? 'Group President / Coordinator Name' : 'Guardian / Contact Name'}
                </label>
                <input
                  {...register('leaderName')}
                  placeholder="Sunita Panda"
                  className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
                />
                {errors.leaderName ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.leaderName.message}</p>
                ) : null}
              </div>

              {sellerType === 'shg' ? (
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Number of Women Members
                  </label>
                  <input
                    type="number"
                    {...register('groupMemberCount', { valueAsNumber: true })}
                    className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
                  />
                </div>
              ) : null}

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Mobile Number (WhatsApp / Call)
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="9437012345"
                  className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm font-mono"
                />
                {errors.phone ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.phone.message}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Village / Panchayat</label>
                <input
                  {...register('village')}
                  placeholder="Pipli"
                  className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
                />
                {errors.village ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.village.message}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Block</label>
                <input
                  {...register('block')}
                  placeholder="Satyabadi"
                  className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
                />
                {errors.block ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.block.message}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">District</label>
                <input
                  {...register('district')}
                  placeholder="Puri"
                  className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
                />
                {errors.district ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.district.message}</p>
                ) : null}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Bank / UPI Payout Reference
                </label>
                <input
                  {...register('upiOrBankAccount')}
                  placeholder="shg@oksbi or A/C ending 4421"
                  className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
                />
                {errors.upiOrBankAccount ? (
                  <p className="text-xs text-[#B9382C] mt-1">{errors.upiOrBankAccount.message}</p>
                ) : null}
              </div>
            </div>

            {/* Step 3: Skills */}
            <div className="space-y-2.5">
              <p className="text-sm font-semibold text-[#302B27]">
                2. What Products Do You Make?
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map((skill) => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold border cursor-pointer transition-colors ${
                        active
                          ? 'bg-[#A45C3B] text-white border-[#A45C3B]'
                          : 'bg-[#FBF8F3] text-[#302B27] border-[#D5C9B8] hover:bg-[#EFE6D8]'
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
              {errors.specialties ? (
                <p className="text-xs text-[#B9382C]">{errors.specialties.message}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                3. Short Craft Story (Helps buyers connect with your work)
              </label>
              <textarea
                rows={3}
                {...register('story')}
                placeholder="We are a group of 12 women making sun-dried mango pickles and urad papad..."
                className="w-full rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] p-3.5 text-sm"
              />
              {errors.story ? (
                <p className="text-xs text-[#B9382C] mt-1">{errors.story.message}</p>
              ) : null}
            </div>

            <Button type="submit" size="lg" isLoading={submitting} className="w-full h-13 text-base">
              Submit Application for Verification
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
