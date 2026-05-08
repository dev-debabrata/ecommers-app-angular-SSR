export interface Product {
  id: string;
  title: string;
  searchName?: string;
  price: number;
  stock: number;
  brand: string;
  color: string;
  category: string;
  subCategory: string;
  image: string;

  description: string;
  discount?: number;
  discountPrice?: number;
  rating?: number;
  createdAt?: number;
}

export type ProductField =
  | 'title'
  | 'price'
  | 'discount'
  | 'stock'
  | 'brand'
  | 'color'
  | 'category'
  | 'subCategory'
  | 'image'
  | 'description'
  | 'rating';

// export interface Review {
//   rating: number;
//   comment: string;
//   date: string;
//   reviewerName: string;
//   reviewerEmail: string;
// }

// export interface Dimensions {
//   width: number;
//   height: number;
//   depth: number;
// }

// export interface Meta {
//   createdAt: string;
//   updatedAt: string;
//   barcode: string;
//   qrCode: string;
// }

// export interface Product {
//   id: number;
//   title: string;
//   description: string;
//   category: string;
//   price: number;
//   discountPercentage: number;
//   rating: number;
//   stock: number;
//   tags: string[];
//   brand: string;
//   sku: string;
//   weight: number;
//   dimensions: Dimensions;
//   warrantyInformation: string;
//   shippingInformation: string;
//   availabilityStatus: string;
//   reviews: Review[];
//   returnPolicy: string;
//   minimumOrderQuantity: number;
//   meta: Meta;
//   images: string[];
//   thumbnail: string;
// }

// export interface Product {
//   id?: string;
//   name: string;
//   price: number;
//   stock: number;

//   category: string;
//   subcategory: string;

//   brand?: string;
//   color?: string;
// }
