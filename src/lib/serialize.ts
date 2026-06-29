import type { Product, Category, Review } from '@/lib/types'

// Serialize a Prisma product row into the public Product type
export function serializeProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    tagline: p.tagline,
    description: p.description,
    categoryId: p.categoryId,
    category: p.category
      ? {
          id: p.category.id,
          name: p.category.name,
          slug: p.category.slug,
          description: p.category.description,
          icon: p.category.icon,
          color: p.category.color,
        }
      : undefined,
    brand: p.brand,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    currency: p.currency,
    stock: p.stock,
    rating: p.rating,
    reviewCount: p.reviewCount,
    salesCount: p.salesCount,
    featured: p.featured,
    trending: p.trending,
    bestSeller: p.bestSeller,
    flashDeal: p.flashDeal,
    newArrival: p.newArrival,
    hasLicenseKey: p.hasLicenseKey,
    isSubscription: p.isSubscription,
    subscriptionInterval: p.subscriptionInterval,
    coverGradient: p.coverGradient,
    coverImage: p.coverImage,
    icon: p.icon,
    tags: p.tags ? p.tags.split(',').filter(Boolean) : [],
    fileName: p.fileName,
    fileSize: p.fileSize,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
  }
}

export function serializeReview(r: any): Review {
  return {
    id: r.id,
    productId: r.productId,
    userName: r.userName,
    userAvatar: r.userAvatar,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    verified: r.verified,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  }
}

export function serializeCategory(c: any): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    icon: c.icon,
    color: c.color,
  }
}
