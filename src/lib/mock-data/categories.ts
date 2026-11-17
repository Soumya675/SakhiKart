import { ProductCategory } from '@/src/types/product';
import { DEMO_ASSETS } from './images';

export const DEMO_CATEGORIES: ProductCategory[] = [
  {
    id: 'cat-pickles',
    name: 'Homemade Pickles',
    slug: 'homemade-pickles',
    description: 'Sun-matured mango, lemon, and bamboo shoot pickles crafted in cold-pressed mustard oil.',
    imageUrl: DEMO_ASSETS.mangoPickle,
    odishaOriginHighlight: 'Cuttack & Puri Villages',
  },
  {
    id: 'cat-papad-badi',
    name: 'Papad & Badi',
    slug: 'papad-badi',
    description: 'Crisp hand-rolled urad papad and traditional Odisha phula badi dried under coastal sun.',
    imageUrl: DEMO_ASSETS.papadBadi,
    odishaOriginHighlight: 'Balasore & Kendrapara',
  },
  {
    id: 'cat-sambalpuri',
    name: 'Sambalpuri & Handloom',
    slug: 'sambalpuri-handloom',
    description: 'Authentic tie-dye Bandha Ikat sarees and handspun cotton weaves by master women weavers.',
    imageUrl: DEMO_ASSETS.sambalpuriSaree,
    odishaOriginHighlight: 'Bargarh & Sonepur',
  },
  {
    id: 'cat-bamboo',
    name: 'Bamboo & Cane Crafts',
    slug: 'bamboo-crafts',
    description: 'Seasoned hill-bamboo storage baskets, serving trays, and lamps woven without metal nails.',
    imageUrl: DEMO_ASSETS.bambooBasket,
    odishaOriginHighlight: 'Koraput & Rayagada',
  },
  {
    id: 'cat-terracotta',
    name: 'Terracotta Pottery',
    slug: 'terracotta-pottery',
    description: 'Kiln-fired river clay water carafes, cooking handis, and carved festive diyas.',
    imageUrl: DEMO_ASSETS.terracottaPottery,
    odishaOriginHighlight: 'Barpali & Khordha',
  },
  {
    id: 'cat-pattachitra',
    name: 'Pattachitra & Applique',
    slug: 'pattachitra-crafts',
    description: 'Natural mineral-pigment cloth scrolls and Pipili heritage applique wall hangings.',
    imageUrl: DEMO_ASSETS.pattachitraArt,
    odishaOriginHighlight: 'Raghurajpur & Pipili',
  },
  {
    id: 'cat-jewellery',
    name: 'Handmade Jewellery',
    slug: 'handmade-jewellery',
    description: 'Lost-wax Dokra brass pendants, terracotta bead necklaces, and hand-painted earrings.',
    imageUrl: DEMO_ASSETS.dokraJewellery,
    odishaOriginHighlight: 'Mayurbhanj & Dhenkanal',
  },
  {
    id: 'cat-embroidery',
    name: 'Embroidery & Stitching',
    slug: 'embroidery-stitching',
    description: 'Hand-embroidered cushion covers, table runners, and patchwork quilts stitched by SHGs.',
    imageUrl: DEMO_ASSETS.embroideryCushion,
    odishaOriginHighlight: 'Pipili & Puri District',
  },
];
