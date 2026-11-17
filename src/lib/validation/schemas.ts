import { z } from 'zod';

export const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Please enter the recipient name'),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  email: z.string().email('Enter a valid email address'),
  addressLine: z.string().min(6, 'Enter house number, street, or village'),
  city: z.string().min(2, 'Enter city or town'),
  district: z.string().min(2, 'Enter district'),
  state: z.string().min(2, 'Enter state'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  paymentMethod: z.enum(['cod', 'upi_demo', 'card_demo']),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export const sellerOnboardingSchema = z.object({
  sellerType: z.enum(['individual', 'shg']),
  displayName: z.string().min(2, 'Enter your name or SHG group name'),
  leaderName: z.string().min(2, 'Enter primary contact person name'),
  groupMemberCount: z.number().min(1).max(200).optional(),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  village: z.string().min(2, 'Enter village or gram panchayat'),
  block: z.string().min(2, 'Enter block or tehsil'),
  district: z.string().min(2, 'Select or enter district'),
  state: z.string().min(2, 'Enter state'),
  preferredLanguage: z.enum(['en', 'hi', 'or']),
  specialties: z.array(z.string()).min(1, 'Choose at least one craft or food skill'),
  story: z.string().min(15, 'Share a short story about your craft (at least 15 characters)'),
  upiOrBankAccount: z.string().min(4, 'Enter UPI ID or last 4 digits of bank account'),
});

export type SellerOnboardingValues = z.infer<typeof sellerOnboardingSchema>;

export const productSubmissionSchema = z.object({
  categoryId: z.string().min(1, 'Please select a category'),
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  shortDescription: z.string().min(8, 'Add a brief 1-line summary'),
  description: z.string().min(15, 'Describe how this product is handmade'),
  price: z.number().min(20, 'Minimum price is ₹20').max(100000),
  unitLabel: z.string().min(2, 'Specify weight or unit (e.g. 500g Jar, 1 Piece)'),
  stockQuantity: z.number().min(1, 'At least 1 unit is required').max(5000),
  craftMethod: z.string().min(3, 'Enter craft or preparation method'),
  materialsOrIngredients: z.string().min(3, 'List key materials or ingredients'),
  shelfLifeOrCare: z.string().min(3, 'Mention shelf life or care instructions'),
});

export type ProductSubmissionValues = z.infer<typeof productSubmissionSchema>;

export const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email'),
  topic: z.string().min(2, 'Select a topic'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
