import { LanguageCode } from '@/src/types/common';

export interface SellerStrings {
  languageLabel: string;
  welcomeBack: string;
  subtitle: string;
  totalEarnings: string;
  productsSubmitted: string;
  ordersReceived: string;
  payoutStatus: string;
  submitNewProduct: string;
  requestPickup: string;
  viewOrders: string;
  viewEarnings: string;
  howItWorksTitle: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  voiceAssistantTitle: string;
  voiceAssistantHint: string;
  voiceTapToSpeak: string;
  voiceListening: string;
  voiceApplyDemo: string;
  navDashboard: string;
  navProducts: string;
  navAddProduct: string;
  navOrders: string;
  navEarnings: string;
  navProfile: string;
  navSupport: string;
  onboardingTitle: string;
  individualTitle: string;
  individualDesc: string;
  shgTitle: string;
  shgDesc: string;
}

export const SELLER_TRANSLATIONS: Record<LanguageCode, SellerStrings> = {
  en: {
    languageLabel: 'Language',
    welcomeBack: 'Namaste, Maa Shakti Mahila SHG',
    subtitle: 'Your craft is reaching homes across India. SakhiKart handles pickup, packing, and delivery.',
    totalEarnings: 'Total Earnings',
    productsSubmitted: 'Products Submitted',
    ordersReceived: 'Orders Received',
    payoutStatus: 'Next Payout Scheduled',
    submitNewProduct: 'Submit New Product',
    requestPickup: 'Request Village Pickup',
    viewOrders: 'Check My Orders',
    viewEarnings: 'See Payouts',
    howItWorksTitle: 'How SakhiKart Supports You',
    step1: '1. Add your product photo & price here (or speak in Odia/Hindi).',
    step2: '2. Our field team collects stock directly from your village.',
    step3: '3. We verify quality, photograph professionally, and pack safely.',
    step4: '4. Money arrives straight into your SHG or personal bank account.',
    voiceAssistantTitle: 'Speak Your Product Details (Voice Assistant Preview)',
    voiceAssistantHint: 'In Phase 2, Gemini AI will understand Odia, Hindi, and English voice notes to auto-fill this form.',
    voiceTapToSpeak: 'Tap to Try Voice Sample',
    voiceListening: 'Listening... Tap to fill sample',
    voiceApplyDemo: 'Fill Form from Voice Note',
    navDashboard: 'Home',
    navProducts: 'My Products',
    navAddProduct: 'Add Product',
    navOrders: 'Orders & Pickups',
    navEarnings: 'Earnings',
    navProfile: 'My Profile',
    navSupport: 'Help & Support',
    onboardingTitle: 'Join SakhiKart as a Maker',
    individualTitle: 'Individual Woman Artisan',
    individualDesc: 'For solo women weavers, potters, cooks, and home artisans.',
    shgTitle: 'Self-Help Group (SHG)',
    shgDesc: 'For women collectives & village SHGs producing food or crafts together.',
  },
  hi: {
    languageLabel: 'भाषा',
    welcomeBack: 'नमस्ते, माँ शक्ति महिला एसएचजी',
    subtitle: 'आपकी कला पूरे भारत के घरों तक पहुँच रही है। पिकअप, पैकिंग और डिलीवरी सखीकार्ट संभालता है।',
    totalEarnings: 'कुल कमाई',
    productsSubmitted: 'भेजे गए उत्पाद',
    ordersReceived: 'मिले ऑर्डर',
    payoutStatus: 'अगला भुगतान तय',
    submitNewProduct: 'नया उत्पाद जोड़ें',
    requestPickup: 'गाँव से पिकअप माँगें',
    viewOrders: 'मेरे ऑर्डर देखें',
    viewEarnings: 'भुगतान देखें',
    howItWorksTitle: 'सखीकार्ट आपकी कैसे मदद करता है',
    step1: '1. अपने उत्पाद की फोटो और कीमत यहाँ डालें (या बोलकर भरें)।',
    step2: '2. हमारी टीम आपके गाँव से सीधे सामान उठाती है।',
    step3: '3. हम गुणवत्ता जाँचते हैं, सुंदर फोटो लेते हैं और सुरक्षित पैक करते हैं।',
    step4: '4. पैसा सीधे आपके बैंक खाते या एसएचजी खाते में आता है।',
    voiceAssistantTitle: 'बोलकर उत्पाद विवरण भरें (वॉइस असिस्टेंट पूर्वावलोकन)',
    voiceAssistantHint: 'अगले चरण में जेमिनी एआई उड़िया, हिंदी और अंग्रेज़ी आवाज समझकर यह फॉर्म खुद भरेगा।',
    voiceTapToSpeak: 'आवाज से नमूना भरें',
    voiceListening: 'सुन रहे हैं...',
    voiceApplyDemo: 'फॉर्म में भरें',
    navDashboard: 'होम',
    navProducts: 'मेरे उत्पाद',
    navAddProduct: 'उत्पाद जोड़ें',
    navOrders: 'ऑर्डर व पिकअप',
    navEarnings: 'कमाई',
    navProfile: 'मेरी प्रोफ़ाइल',
    navSupport: 'सहायता केंद्र',
    onboardingTitle: 'सखीकार्ट से जुड़ें',
    individualTitle: 'व्यक्तिगत महिला कारीगर',
    individualDesc: 'अकेले काम करने वाली बुनकर, कुम्हार या गृह उद्यमी महिलाओं के लिए।',
    shgTitle: 'स्वयं सहायता समूह (SHG)',
    shgDesc: 'साथ मिलकर अचार, पापड़ या हस्तशिल्प बनाने वाले महिला समूहों के लिए।',
  },
  or: {
    languageLabel: 'ଭାଷା',
    welcomeBack: 'ନମସ୍କାର, ମାଆ ଶକ୍ତି ମହିଳା ଏସଏଚଜି',
    subtitle: 'ଆପଣଙ୍କ ହାତତିଆରି ସାମଗ୍ରୀ ସାରା ଭାରତରେ ପହଞ୍ଚୁଛି। ପିକଅପ୍, ପ୍ୟାକିଂ ଓ ଡେଲିଭରି ସଖୀକାର୍ଟ ସମ୍ଭାଳେ।',
    totalEarnings: 'ମୋଟ ରୋଜଗାର',
    productsSubmitted: 'ଦାଖଲ ଉତ୍ପାଦ',
    ordersReceived: 'ମିଳିଥିବା ଅର୍ଡର',
    payoutStatus: 'ପରବର୍ତ୍ତୀ ପେମେଣ୍ଟ',
    submitNewProduct: 'ନୂଆ ଉତ୍ପାଦ ଯୋଡ଼ନ୍ତୁ',
    requestPickup: 'ଗାଁରୁ ପିକଅପ୍ ମଗାନ୍ତୁ',
    viewOrders: 'ମୋ ଅର୍ଡର ଦେଖନ୍ତୁ',
    viewEarnings: 'ରୋଜଗାର ଦେଖନ୍ତୁ',
    howItWorksTitle: 'ସଖୀକାର୍ଟ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରେ',
    step1: '୧. ଆପଣଙ୍କ ଉତ୍ପାଦର ଫଟୋ ଓ ଦାମ୍ ଏଠାରେ ଦିଅନ୍ତୁ।',
    step2: '୨. ଆମ ଫିଲ୍ଡ ଟିମ୍ ଆପଣଙ୍କ ଗାଁରୁ ସିଧା ସାମଗ୍ରୀ ସଂଗ୍ରହ କରିବେ।',
    step3: '୩. ଆମେ ଗୁଣବତ୍ତା ପରୀକ୍ଷା କରି ସୁନ୍ଦର ପ୍ୟାକିଂ ଓ ଡେଲିଭରି କରୁ।',
    step4: '୪. ବିକ୍ରି ଟଙ୍କା ସିଧା ଆପଣଙ୍କ ବ୍ୟାଙ୍କ ଖାତାକୁ ଆସେ।',
    voiceAssistantTitle: 'କହିକି ଉତ୍ପାଦ ବିବରଣୀ ଦିଅନ୍ତୁ (ଭଏସ୍ ଆସିଷ୍ଟାଣ୍ଟ)',
    voiceAssistantHint: 'ପରବର୍ତ୍ତୀ ପର୍ଯ୍ୟାୟରେ ଓଡ଼ିଆ, ହିନ୍ଦୀ ଓ ଇଂରାଜୀ କଥା ଶୁଣି ଫର୍ମ ଆପେ ପୂରଣ ହେବ।',
    voiceTapToSpeak: 'ଭଏସ୍ ନମୁନା ଚେଷ୍ଟା କରନ୍ତୁ',
    voiceListening: 'ଶୁଣୁଛି...',
    voiceApplyDemo: 'ଫର୍ମରେ ଭରନ୍ତୁ',
    navDashboard: 'ମୂଳ ପୃଷ୍ଠା',
    navProducts: 'ମୋ ଉତ୍ପାଦ',
    navAddProduct: 'ଉତ୍ପାଦ ଯୋଡ଼ନ୍ତୁ',
    navOrders: 'ଅର୍ଡର ଓ ପିକଅପ୍',
    navEarnings: 'ରୋଜଗାର',
    navProfile: 'ମୋ ପ୍ରୋଫାଇଲ୍',
    navSupport: 'ସହାୟତା',
    onboardingTitle: 'ସଖୀକାର୍ଟରେ ଯୋଗ ଦିଅନ୍ତୁ',
    individualTitle: 'ବ୍ୟକ୍ତିଗତ ମହିଳା କାରିଗର',
    individualDesc: 'ଏକୁଟିଆ ବୁଣାକାର, କୁମ୍ଭାର ଓ ଘରୋଇ ଉଦ୍ୟୋଗୀ ମହିଳାଙ୍କ ପାଇଁ।',
    shgTitle: 'ସ୍ୱୟଂ ସହାୟକ ଗୋଷ୍ଠୀ (SHG)',
    shgDesc: 'ମିଳିମିଶି ଆଚାର, ପାମ୍ପଡ଼ କିମ୍ବା ହସ୍ତଶିଳ୍ପ କରୁଥିବା ମହିଳା ଗୋଷ୍ଠୀ ପାଇଁ।',
  },
};
