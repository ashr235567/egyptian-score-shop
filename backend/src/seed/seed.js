const dotenv = require('dotenv');
dotenv.config();
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const Order = require('../models/Order');

const SIZES = ['39', '40', '41', '42', '43', '44', '45'];

const makeSizes = (stockEach = 10) => SIZES.map((size) => ({ size, stock: stockEach }));

const products = [
  {
    name: 'Nike Mercurial Vapor 15 Elite FG',
    nameAr: 'نايك ميركوريال فيبور 15 إيليت',
    brand: 'Nike',
    category: 'Firm Ground',
    description:
      'The Nike Mercurial Vapor 15 Elite is built for explosive speed. An ultra-thin Vaporposite+ upper offers a barefoot feel with precise ball control, paired with an aggressive FG plate for traction on natural grass.',
    descriptionAr: 'حذاء نايك ميركوريال فيبور 15 إيليت مصمم للسرعة الفائقة مع تحكم ممتاز في الكرة وثبات على الملاعب الطبيعية.',
    price: 8999,
    discountPrice: 7499,
    isOnSale: true,
    coverImage: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800',
    variants: [
      {
        color: 'Bright Crimson',
        colorHex: '#dc143c',
        images: [
          'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800',
          'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800'
        ],
        sizes: makeSizes(8)
      },
      {
        color: 'Black/White',
        colorHex: '#111111',
        images: [
          'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800',
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'
        ],
        sizes: makeSizes(6)
      }
    ],
    tags: ['speed', 'firm ground', 'nike', 'mercurial'],
    isFeatured: true,
    isBestSeller: true,
    metaTitle: 'Nike Mercurial Vapor 15 Elite FG | Egyptian Score Shop',
    metaDescription: 'Shop the original Nike Mercurial Vapor 15 Elite FG football boots in Egypt with fast delivery.'
  },
  {
    name: 'Adidas Predator Accuracy+ FG',
    nameAr: 'أديداس بريداتور أكيوراسي',
    brand: 'Adidas',
    category: 'Firm Ground',
    description:
      'Laceless design with full-foot Hybridtouch control elements that deliver unrivaled grip and spin on every strike. Built for players who demand total ball mastery.',
    descriptionAr: 'تصميم بدون رباط مع عناصر تحكم هايبريدتاتش توفر قبضة وتأثير لا مثيل لهما على الكرة.',
    price: 9499,
    discountPrice: 0,
    isOnSale: false,
    coverImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800',
    variants: [
      {
        color: 'Core Black',
        colorHex: '#000000',
        images: [
          'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800',
          'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800'
        ],
        sizes: makeSizes(7)
      },
      {
        color: 'Solar Red',
        colorHex: '#ff3b30',
        images: ['https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800'],
        sizes: makeSizes(5)
      }
    ],
    tags: ['control', 'laceless', 'adidas', 'predator'],
    isFeatured: true,
    isNewArrival: true,
    metaTitle: 'Adidas Predator Accuracy+ FG | Egyptian Score Shop',
    metaDescription: 'Original Adidas Predator Accuracy+ laceless football boots, available now in Egypt.'
  },
  {
    name: 'Puma Future Ultimate FG/AG',
    nameAr: 'بوما فيوتشر ألتيميت',
    brand: 'Puma',
    category: 'Firm Ground',
    description:
      'FUZIONFIT+ compression band locks the foot in place for ultimate adaptability, while the Dynamic Motion System collar supports natural ankle movement during sharp cuts.',
    descriptionAr: 'حزام FUZIONFIT+ يثبت القدم بإحكام بينما ياقة Dynamic Motion تدعم حركة الكاحل الطبيعية.',
    price: 7999,
    discountPrice: 6999,
    isOnSale: true,
    coverImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
    variants: [
      {
        color: 'Electric Blue',
        colorHex: '#1e90ff',
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
        sizes: makeSizes(9)
      }
    ],
    tags: ['agility', 'puma', 'future'],
    isBestSeller: true,
    metaTitle: 'Puma Future Ultimate FG/AG | Egyptian Score Shop',
    metaDescription: 'Shop original Puma Future Ultimate football boots with adaptive fit, fast Egypt-wide delivery.'
  },
  {
    name: 'Nike Phantom GX Elite Link FG',
    nameAr: 'نايك فانتوم جي إكس إيليت لينك',
    brand: 'Nike',
    category: 'Firm Ground',
    description:
      'Magnetic Link technology connects sensory plates across the upper for an enhanced touch on every surface of the boot, redefining close control.',
    descriptionAr: 'تقنية ماجنيتيك لينك تربط ألواح استشعار عبر الحذاء لتحكم محسّن في الكرة من كل الزوايا.',
    price: 8499,
    discountPrice: 0,
    isOnSale: false,
    coverImage: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800',
    variants: [
      {
        color: 'Volt Yellow',
        colorHex: '#d4ff00',
        images: ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=800'],
        sizes: makeSizes(6)
      },
      {
        color: 'White/Black',
        colorHex: '#f5f5f5',
        images: ['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800'],
        sizes: makeSizes(4)
      }
    ],
    tags: ['touch', 'nike', 'phantom'],
    isNewArrival: true,
    metaTitle: 'Nike Phantom GX Elite Link FG | Egyptian Score Shop',
    metaDescription: 'Original Nike Phantom GX football boots featuring Magnetic Link technology.'
  },
  {
    name: 'Adidas X Crazyfast.1 FG',
    nameAr: 'أديداس إكس كريزي فاست',
    brand: 'Adidas',
    category: 'Firm Ground',
    description:
      'The lightest boot in the adidas range, built with a Speedframe outsole and a one-of-a-kind Speedanium+ plate to launch fast players forward.',
    descriptionAr: 'أخف حذاء في تشكيلة أديداس مزود بنعل سبيدفريم وصفيحة سبيدانيوم لإطلاق سرعتك.',
    price: 8999,
    discountPrice: 7999,
    isOnSale: true,
    coverImage: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800',
    variants: [
      {
        color: 'Solar Gold',
        colorHex: '#ffd700',
        images: ['https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800'],
        sizes: makeSizes(5)
      }
    ],
    tags: ['speed', 'adidas', 'crazyfast', 'lightweight'],
    isBestSeller: true,
    metaTitle: 'Adidas X Crazyfast.1 FG | Egyptian Score Shop',
    metaDescription: 'The lightest Adidas X Crazyfast football boots, now available in Egypt.'
  },
  {
    name: 'Puma Ultra Ultimate FG/AG',
    nameAr: 'بوما ألترا ألتيميت',
    brand: 'Puma',
    category: 'Firm Ground',
    description:
      'Featherlight 5.6oz construction paired with a re-engineered speed plate to give explosive players an unfair advantage on the pitch.',
    descriptionAr: 'تصميم خفيف الوزن مقترن بصفيحة سرعة معاد تصميمها لمنح اللاعبين الانفجاريين ميزة في الملعب.',
    price: 7499,
    discountPrice: 0,
    isOnSale: false,
    coverImage: 'https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800',
    variants: [
      {
        color: 'Fire Orchid',
        colorHex: '#c026d3',
        images: ['https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800'],
        sizes: makeSizes(7)
      }
    ],
    tags: ['lightweight', 'puma', 'ultra'],
    isNewArrival: true,
    metaTitle: 'Puma Ultra Ultimate FG/AG | Egyptian Score Shop',
    metaDescription: 'Original Puma Ultra Ultimate boots, lightweight design for explosive speed.'
  },
  {
    name: 'Nike Tiempo Legend 10 Elite FG',
    nameAr: 'نايك تيمبو ليجند 10 إيليت',
    brand: 'Nike',
    category: 'Firm Ground',
    description:
      'Premium kangaroo-leather-style upper wraps the foot for a soft touch and classic control, favored by midfield playmakers worldwide.',
    descriptionAr: 'جلد فاخر يلتف حول القدم لإحساس ناعم وتحكم كلاسيكي، يفضله صناع اللعب في الوسط حول العالم.',
    price: 8299,
    discountPrice: 0,
    isOnSale: false,
    coverImage: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800',
    variants: [
      {
        color: 'Deep Royal',
        colorHex: '#1d3a8a',
        images: ['https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800'],
        sizes: makeSizes(6)
      }
    ],
    tags: ['leather', 'nike', 'tiempo', 'control'],
    metaTitle: 'Nike Tiempo Legend 10 Elite FG | Egyptian Score Shop',
    metaDescription: 'Premium leather Nike Tiempo Legend 10 Elite football boots in Egypt.'
  },
  {
    name: 'Adidas Copa Pure.1 FG',
    nameAr: 'أديداس كوبا بيور',
    brand: 'Adidas',
    category: 'Firm Ground',
    description:
      'A modern take on the classic leather boot, with a soft, tongue-less collar for a sock-like fit and traditional touch on the ball.',
    descriptionAr: 'تصميم عصري للحذاء الجلدي الكلاسيكي مع ياقة بدون لسان لإحساس يشبه الجورب ولمسة تقليدية للكرة.',
    price: 7999,
    discountPrice: 6499,
    isOnSale: true,
    coverImage: 'https://images.unsplash.com/photo-1525491923734-fb1e995ca52c?w=800',
    variants: [
      {
        color: 'Core Black/Gold',
        colorHex: '#1a1a1a',
        images: ['https://images.unsplash.com/photo-1525491923734-fb1e995ca52c?w=800'],
        sizes: makeSizes(8)
      }
    ],
    tags: ['leather', 'adidas', 'copa'],
    metaTitle: 'Adidas Copa Pure.1 FG | Egyptian Score Shop',
    metaDescription: 'Classic-style Adidas Copa Pure leather football boots, original stock in Egypt.'
  },
  {
    name: 'Nike Mercurial Zoom Superfly 10 Academy TF',
    nameAr: 'نايك ميركوريال زووم سوبرفلاي 10 أكاديمي',
    brand: 'Nike',
    category: 'Turf',
    description:
      'Built for street and turf pitches, this Academy-level boot brings Mercurial speed DNA to everyday training sessions and 5-a-side games.',
    descriptionAr: 'مصمم لملاعب الشارع والتيرف، يجلب هذا الحذاء حمض السرعة الميركوريال لتدريباتك اليومية وكرة الخماسي.',
    price: 4999,
    discountPrice: 0,
    isOnSale: false,
    coverImage: 'https://images.unsplash.com/photo-1556817411-92ae294c2e2e?w=800',
    variants: [
      {
        color: 'Hyper Pink',
        colorHex: '#ff1493',
        images: ['https://images.unsplash.com/photo-1556817411-92ae294c2e2e?w=800'],
        sizes: makeSizes(10)
      }
    ],
    tags: ['turf', 'nike', 'training'],
    isNewArrival: true,
    metaTitle: 'Nike Mercurial Superfly 10 Academy TF | Egyptian Score Shop',
    metaDescription: 'Turf football boots from Nike Mercurial, perfect for 5-a-side and training.'
  },
  {
    name: 'Puma King Ultimate FG/AG',
    nameAr: 'بوما كينج ألتيميت',
    brand: 'Puma',
    category: 'Firm Ground',
    description:
      'A timeless icon reborn with K-Fit construction for a snug, sock-like fit, delivering classic premium touch with modern performance.',
    descriptionAr: 'أيقونة خالدة أعيد تصميمها بتقنية K-Fit لملاءمة تشبه الجورب مع لمسة فاخرة كلاسيكية وأداء عصري.',
    price: 7299,
    discountPrice: 0,
    isOnSale: false,
    coverImage: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800',
    variants: [
      {
        color: 'Classic Black',
        colorHex: '#000000',
        images: ['https://images.unsplash.com/photo-1511886929837-354d827aae26?w=800'],
        sizes: makeSizes(5)
      }
    ],
    tags: ['classic', 'puma', 'king'],
    metaTitle: 'Puma King Ultimate FG/AG | Egyptian Score Shop',
    metaDescription: 'The iconic Puma King boot, reborn for modern players. Shop original stock in Egypt.'
  },
  {
    name: 'Nike Mercurial Vapor 15 Club Kids',
    nameAr: 'نايك ميركوريال فيبور 15 كلوب أطفال',
    brand: 'Nike',
    category: 'Kids',
    description:
      'Give young players the same speed-focused design as the elite version, scaled down for comfort and durability on the youth pitch.',
    descriptionAr: 'امنح اللاعبين الصغار نفس التصميم الذي يركز على السرعة مثل النسخة الاحترافية، بمقاس مناسب للراحة والمتانة.',
    price: 2999,
    discountPrice: 2499,
    isOnSale: true,
    coverImage: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800',
    variants: [
      {
        color: 'Bright Crimson',
        colorHex: '#dc143c',
        images: ['https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800'],
        sizes: [
          { size: '28', stock: 8 },
          { size: '29', stock: 8 },
          { size: '30', stock: 8 },
          { size: '31', stock: 8 },
          { size: '32', stock: 8 },
          { size: '33', stock: 8 }
        ]
      }
    ],
    tags: ['kids', 'nike', 'youth'],
    isOnSale: true,
    metaTitle: 'Nike Mercurial Vapor 15 Club Kids | Egyptian Score Shop',
    metaDescription: 'Kids football boots from Nike Mercurial, original stock with Egypt-wide delivery.'
  },
  {
    name: 'Adidas Predator Club Indoor',
    nameAr: 'أديداس بريداتور كلوب إندور',
    brand: 'Adidas',
    category: 'Indoor',
    description:
      "A gum-rubber outsole built specifically for indoor courts, paired with Predator's signature control elements for five-a-side dominance.",
    descriptionAr: 'نعل مطاطي مصمم خصيصًا للملاعب المغطاة مقترن بعناصر تحكم بريداتور المميزة للسيطرة في كرة الصالات.',
    price: 3999,
    discountPrice: 0,
    isOnSale: false,
    coverImage: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800',
    variants: [
      {
        color: 'Core Black',
        colorHex: '#000000',
        images: ['https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=800'],
        sizes: makeSizes(9)
      }
    ],
    tags: ['indoor', 'adidas', 'futsal'],
    metaTitle: 'Adidas Predator Club Indoor | Egyptian Score Shop',
    metaDescription: 'Indoor futsal boots from Adidas Predator, original stock available in Egypt.'
  }
];

const seedData = async () => {
  await connectDB();

  try {
    console.log('Clearing existing data...');
    await Promise.all([User.deleteMany(), Product.deleteMany(), Coupon.deleteMany(), Order.deleteMany()]);

    console.log('Creating admin user...');
    await User.create({
      name: 'Admin',
      email: process.env.ADMIN_EMAIL || 'admin@egyptianscoreshop.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@12345',
      role: 'admin',
      isVerified: true
    });

    console.log('Creating demo customer...');
    await User.create({
      name: 'Ahmed Mostafa',
      email: 'customer@example.com',
      password: 'Customer@123',
      phone: '01012345678',
      role: 'customer',
      isVerified: true
    });

    console.log('Seeding products...');
    await Product.insertMany(products);

    console.log('Seeding coupons...');
    await Coupon.create([
      {
        code: 'WELCOME10',
        description: '10% off your first order',
        discountType: 'percentage',
        discountValue: 10,
        maxDiscountAmount: 500,
        minOrderValue: 1000,
        usageLimit: 1000,
        perUserLimit: 1,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      },
      {
        code: 'SAVE200',
        description: 'Flat 200 EGP off orders above 3000 EGP',
        discountType: 'fixed',
        discountValue: 200,
        minOrderValue: 3000,
        usageLimit: 500,
        perUserLimit: 2,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('Seed data imported successfully!');
    console.log(
      `Admin login -> email: ${process.env.ADMIN_EMAIL || 'admin@egyptianscoreshop.com'} / password: ${
        process.env.ADMIN_PASSWORD || 'Admin@12345'
      }`
    );
    console.log('Customer login -> email: customer@example.com / password: Customer@123');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

const destroyData = async () => {
  await connectDB();
  try {
    await Promise.all([User.deleteMany(), Product.deleteMany(), Coupon.deleteMany(), Order.deleteMany()]);
    console.log('Data destroyed successfully');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
