const mongoose = require('mongoose');
const slugify = require('slugify');

const variantSchema = new mongoose.Schema(
  {
    color: { type: String, required: true },
    colorHex: { type: String, default: '#000000' },
    images: [{ type: String, required: true }],
    sizes: [
      {
        size: { type: String, required: true }, // EU size e.g. "40", "41"
        stock: { type: Number, required: true, default: 0, min: 0 }
      }
    ]
  },
  { _id: true }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
    verifiedPurchase: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Product name is required'], trim: true, maxlength: 150 },
    nameAr: { type: String, trim: true, maxlength: 150 },
    slug: { type: String, unique: true, index: true },
    brand: { type: String, required: [true, 'Brand is required'], trim: true, index: true },
    category: {
      type: String,
      enum: ['Firm Ground', 'Indoor', 'Street', 'Turf', 'Soft Ground', 'Kids'],
      default: 'Firm Ground'
    },
    description: { type: String, required: [true, 'Description is required'] },
    descriptionAr: { type: String },
    price: { type: Number, required: [true, 'Price is required'], min: 0 },
    discountPrice: { type: Number, min: 0, default: 0 },
    currency: { type: String, default: 'EGP' },
    sku: { type: String, unique: true, sparse: true },
    variants: { type: [variantSchema], default: [] },
    coverImage: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    isOnSale: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    totalStock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    metaTitle: String,
    metaDescription: String
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', brand: 'text', description: 'text', tags: 'text' });

productSchema.pre('save', function (next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${Math.random()
      .toString(36)
      .substring(2, 7)}`;
  }
  // Recalculate total stock from variants
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((sum, v) => {
      return sum + v.sizes.reduce((s, sz) => s + sz.stock, 0);
    }, 0);
  }
  next();
});

productSchema.methods.recalculateRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0;
    this.numReviews = 0;
    return;
  }
  const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
  this.rating = Math.round((total / this.reviews.length) * 10) / 10;
  this.numReviews = this.reviews.length;
};

module.exports = mongoose.model('Product', productSchema);
