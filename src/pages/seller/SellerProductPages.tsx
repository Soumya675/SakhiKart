import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, Clock, Mic, PlusCircle, Upload, XCircle } from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';
import { SELLER_TRANSLATIONS } from '@/src/lib/i18n/translations';
import {
  productSubmissionSchema,
  ProductSubmissionValues,
} from '@/src/lib/validation/schemas';
import { formatINR } from '@/src/lib/utils';
import { ProductsService } from '@/src/services/products.service';
import { Product, ProductCategory } from '@/src/types/product';
import { SellerLayout } from '@/src/components/layout/SellerLayout';
import { Button } from '@/src/components/ui/Button';
import { DataStateView } from '@/src/components/ui/DataStateView';
import { SafeImage } from '@/src/components/ui/SafeImage';

export function SellerProductsPage() {
  const { sellerLanguage } = useStore();
  const t = SELLER_TRANSLATIONS[sellerLanguage];
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    ProductsService.listProducts({ includeUnapproved: true })
      .then((res) => setProducts(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <SellerLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
              {t.navProducts}
            </h1>
            <p className="text-sm text-[#6B625B] mt-1">
              Track verification status and available stock across all your crafts.
            </p>
          </div>
          <Link
            to="/seller/products/new"
            className="h-12 px-5 inline-flex items-center justify-center gap-2 rounded-xl bg-[#A45C3B] text-white text-sm font-semibold hover:bg-[#8A4A2E]"
          >
            <PlusCircle className="h-5 w-5" />
            <span>{t.submitNewProduct}</span>
          </Link>
        </div>

        <DataStateView
          isLoading={isLoading}
          error={null}
          isEmpty={products.length === 0}
          emptyActionLabel={t.submitNewProduct}
          onEmptyAction={() => navigate('/seller/products/new')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="rounded-xl border border-[#E5DCD0] bg-white overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] bg-[#EFE7DA] relative">
                  <SafeImage src={product.imageUrl} alt={product.name} className="w-full h-full" />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-medium text-[#A45C3B]">{product.categoryName}</span>
                      <span className="inline-flex items-center gap-1 font-semibold">
                        {product.status === 'approved' ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 text-[#456B50]" />
                            <span className="text-[#456B50]">Approved</span>
                          </>
                        ) : product.status === 'rejected' ? (
                          <>
                            <XCircle className="h-3.5 w-3.5 text-[#B9382C]" />
                            <span className="text-[#B9382C]">Needs Update</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-3.5 w-3.5 text-[#D9A441]" />
                            <span className="text-[#9A6E14]">Pending Verification</span>
                          </>
                        )}
                      </span>
                    </div>
                    <h2 className="font-serif text-lg font-bold text-[#302B27]">
                      {product.name}
                    </h2>
                    <p className="text-xs text-[#6B625B]">
                      {product.isDemoAsset ? 'Hub Studio Photo' : 'Seller Uploaded Photo'} ·{' '}
                      {product.unitLabel}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F0E8DC] flex items-center justify-between text-sm">
                    <span className="font-bold tabular-nums">{formatINR(product.price)}</span>
                    <span className="text-xs text-[#6B625B] tabular-nums">
                      Stock: {product.stockQuantity} units
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DataStateView>
      </div>
    </SellerLayout>
  );
}

export function SellerNewProductPage() {
  const { sellerLanguage, activeSellerId, pushToast } = useStore();
  const t = SELLER_TRANSLATIONS[sellerLanguage];
  const navigate = useNavigate();

  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | undefined>(undefined);
  const [voiceListening, setVoiceListening] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductSubmissionValues>({
    resolver: zodResolver(productSubmissionSchema),
    defaultValues: {
      categoryId: 'cat-pickles',
      price: 320,
      stockQuantity: 25,
      unitLabel: '500g Glass Jar',
    },
  });

  useEffect(() => {
    ProductsService.getCategories().then((res) => setCategories(res.data));
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setUploadedPhoto(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleVoiceDemo = () => {
    setVoiceListening(true);
    setTimeout(() => {
      setVoiceListening(false);
      setValue('categoryId', 'cat-papad-badi');
      setValue('name', 'Homemade Jeera & Black Pepper Urad Papad');
      setValue('shortDescription', 'Sun-dried crisp Odisha papad rolled by hand with roasted cumin.');
      setValue(
        'description',
        'Prepared fresh in Satyabadi using unpolished black gram flour, crushed peppercorn, and coastal sunlight drying.'
      );
      setValue('price', 240);
      setValue('unitLabel', '400g Family Pack');
      setValue('stockQuantity', 40);
      setValue('craftMethod', 'Hand-rolled & solar dried over bamboo mats');
      setValue('materialsOrIngredients', 'Urad Dal, Cumin, Black Pepper, Sea Salt');
      setValue('shelfLifeOrCare', '6 months in dry airtight container');
      pushToast({
        title: 'Voice Sample Applied (Phase 2 AI Preview)',
        description: 'Form fields populated from sample Odia/Hindi voice note.',
        tone: 'info',
      });
    }, 900);
  };

  const onSubmit = async (values: ProductSubmissionValues) => {
    setSubmitting(true);
    try {
      await ProductsService.submitProduct({
        ...values,
        sellerId: activeSellerId,
        sellerName: 'Maa Shakti Mahila SHG',
        sellerDistrict: 'Puri',
        uploadedPhotoDataUrl: uploadedPhoto,
      });
      pushToast({
        title: 'Product Submitted for Verification',
        description: 'SakhiKart Quality Team will review and approve your listing.',
        tone: 'success',
      });
      navigate('/seller/products');
    } catch (err) {
      pushToast({
        title: 'Submission failed',
        description: err instanceof Error ? err.message : 'Unable to submit product',
        tone: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SellerLayout>
      <div className="max-w-3xl space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
            {t.submitNewProduct}
          </h1>
          <p className="text-sm text-[#6B625B] mt-1">
            Add simple details and a mobile photo. Our studio team polishes the listing before launch.
          </p>
        </div>

        {/* Voice Input Placeholder UI for Future Gemini AI Integration */}
        <div className="rounded-2xl border border-[#456B50]/30 bg-[#F4F8F5] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-[#456B50]">
              <Mic className="h-4 w-4" />
              <span>{t.voiceAssistantTitle}</span>
            </div>
            <p className="text-xs text-[#6B625B] max-w-xl">{t.voiceAssistantHint}</p>
          </div>
          <Button
            type="button"
            variant="forest"
            onClick={handleVoiceDemo}
            className="h-12 shrink-0"
          >
            <Mic className="h-4 w-4" />
            <span>{voiceListening ? t.voiceListening : t.voiceTapToSpeak}</span>
          </Button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-[#E5DCD0] bg-white p-6 space-y-5"
        >
          {/* Seller Photo Upload (kept distinct from demo assets) */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-[#302B27]">
              1. Upload Product Photo (From Phone Camera)
            </label>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="h-28 w-full sm:w-48 rounded-xl border-2 border-dashed border-[#D5C9B8] bg-[#FBF8F3] flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-[#A45C3B]">
                <Upload className="h-5 w-5 text-[#A45C3B]" />
                <span className="text-xs font-medium text-[#302B27]">Choose Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              {uploadedPhoto ? (
                <div className="h-28 w-36 rounded-xl overflow-hidden border border-[#E5DCD0]">
                  <img
                    src={uploadedPhoto}
                    alt="Seller uploaded preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <p className="text-xs text-[#6B625B]">
                  Optional in Demo Mode. Uploaded seller photos are flagged separately from hub studio photos.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Category</label>
              <select
                {...register('categoryId')}
                className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Product Name</label>
              <input
                {...register('name')}
                placeholder="e.g. Homemade Tamarind & Chilli Achar"
                className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
              />
              {errors.name ? (
                <p className="text-xs text-[#B9382C] mt-1">{errors.name.message}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Selling Price (₹)</label>
              <input
                type="number"
                {...register('price', { valueAsNumber: true })}
                className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
              />
              {errors.price ? (
                <p className="text-xs text-[#B9382C] mt-1">{errors.price.message}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Weight / Size Unit</label>
              <input
                {...register('unitLabel')}
                placeholder="e.g. 500g Glass Jar"
                className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
              />
              {errors.unitLabel ? (
                <p className="text-xs text-[#B9382C] mt-1">{errors.unitLabel.message}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Available Stock Units</label>
              <input
                type="number"
                {...register('stockQuantity', { valueAsNumber: true })}
                className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
              />
              {errors.stockQuantity ? (
                <p className="text-xs text-[#B9382C] mt-1">{errors.stockQuantity.message}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">How It Is Made</label>
              <input
                {...register('craftMethod')}
                placeholder="Sun-cured & stone ground"
                className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
              />
              {errors.craftMethod ? (
                <p className="text-xs text-[#B9382C] mt-1">{errors.craftMethod.message}</p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1">Short 1-Line Summary</label>
              <input
                {...register('shortDescription')}
                placeholder="Authentic village-style pickle made in cold-pressed mustard oil"
                className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
              />
              {errors.shortDescription ? (
                <p className="text-xs text-[#B9382C] mt-1">{errors.shortDescription.message}</p>
              ) : null}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold mb-1">Full Description</label>
              <textarea
                rows={3}
                {...register('description')}
                placeholder="Tell buyers about the ingredients, preparation, and tradition..."
                className="w-full rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] p-3.5 text-sm"
              />
              {errors.description ? (
                <p className="text-xs text-[#B9382C] mt-1">{errors.description.message}</p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Ingredients / Materials</label>
              <input
                {...register('materialsOrIngredients')}
                placeholder="Raw mango, mustard oil, spices"
                className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
              />
              {errors.materialsOrIngredients ? (
                <p className="text-xs text-[#B9382C] mt-1">
                  {errors.materialsOrIngredients.message}
                </p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Shelf Life / Care Note</label>
              <input
                {...register('shelfLifeOrCare')}
                placeholder="12 months · Keep dry spoon"
                className="w-full h-12 rounded-xl border border-[#D5C9B8] bg-[#FBF8F3] px-3.5 text-sm"
              />
              {errors.shelfLifeOrCare ? (
                <p className="text-xs text-[#B9382C] mt-1">{errors.shelfLifeOrCare.message}</p>
              ) : null}
            </div>
          </div>

          <Button type="submit" size="lg" isLoading={submitting} className="w-full h-13 text-base">
            Submit Product to SakhiKart Hub
          </Button>
        </form>
      </div>
    </SellerLayout>
  );
}
