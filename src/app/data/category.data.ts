import { Category } from '../models/category.model';

export const CATEGORIES: Category[] = [
  {
    name: 'Electronics',
    subcategories: [
      { label: 'Mobiles', slug: 'mobiles' },
      { label: 'Laptops', slug: 'laptops' },
      { label: 'Headphones', slug: 'headphones' },
      { label: 'Smart Watches', slug: 'smart-watches' },
    ],
  },
  {
    name: 'Fashion',
    subcategories: [
      { label: "Men's Fashion", slug: 'mens-fashion' },
      { label: "Women's Fashion", slug: 'womens-fashion' },
    ],
  },
  {
    name: 'Bags',
    subcategories: [
      { label: 'Backpacks', slug: 'backpacks' },
      { label: 'Travel Bags', slug: 'travel-bags' },
    ],
  },
  {
    name: 'Footwear',
    subcategories: [
      { label: 'Sneakers', slug: 'sneakers' },
      { label: 'Sandals', slug: 'sandals' },
    ],
  },
  {
    name: 'Groceries',
    subcategories: [
      { label: 'Rice', slug: 'rice' },
      { label: 'Oil', slug: 'oil' },
      { label: 'Snacks', slug: 'snacks' },
    ],
  },
  {
    name: 'Beauty',
    subcategories: [
      { label: 'Makeup', slug: 'makeup' },
      { label: 'Skincare', slug: 'skincare' },
    ],
  },
  {
    name: 'Wellness',
    subcategories: [
      { label: 'Supplements', slug: 'supplements' },
      { label: 'Yoga', slug: 'yoga' },
    ],
  },
  {
    name: 'Jewellery',
    subcategories: [
      { label: 'Gold', slug: 'gold' },
      { label: 'Silver', slug: 'silver' },
      { label: 'Rings', slug: 'rings' },
    ],
  },

  {
    name: 'Home & Living',
    subcategories: [
      { label: 'Furniture', slug: 'furniture' },
      { label: 'Office Chair', slug: 'office-chair' },
      { label: 'Home Decor', slug: 'home-decor' },
      { label: 'Kitchenware', slug: 'kitchenware' },
      { label: 'Bedding & Bath', slug: 'bedding-bath' },
    ],
  },

  {
    name: 'Baby & Kids',
    subcategories: [
      { label: 'Baby care', slug: 'baby-care' },
      { label: 'Toys & Games', slug: 'toys-games' },
      { label: 'Kids’ clothing & accessories', slug: 'kids-clothing-accessories' },
    ],
  },

  {
    name: 'Pet Supplies',
    subcategories: [
      { label: 'Pet food', slug: 'pet-food' },
      { label: 'Grooming', slug: 'grooming' },
      { label: 'Accessories', slug: 'accessories' },
    ],
  },
];

////////////////////////////////////////////////////////////////
// Home & Living

// Furniture
// Home Décor
// Kitchenware
// Bedding & Bath

// Appliances

// Large Appliances (refrigerators, washing machines)
// Small Appliances (mixers, air fryers, coffee makers)

// Health & Medical

// OTC medicines
// Medical devices (thermometers, BP monitors)

// Baby & Kids

// Baby care
// Toys & Games
// Kids’ clothing & accessories

// Sports & Fitness

// Gym equipment
// Outdoor sports gear
// Activewear (could overlap with fashion, but often separate)

// Automotive

// Car accessories
// Bike accessories
// Maintenance products

// Office & Stationery

// Office supplies
// School supplies
// Books & notebooks

// Pet Supplies

// Pet food
// Grooming
// Accessories

// Gaming & Entertainment

// Video games
// Consoles & accessories
// Board games

// Hardware & Tools

// Power tools
// DIY equipment
// Electricals & fittings

////////////////////////////////////////////////////////////////

// import { Category } from '../models/category.model';

// export const CATEGORIES: Category[] = [
//   {
//     name: 'Electronics',
//     subcategories: ['Mobiles', 'Laptops', 'Headphones', 'Smart Watches'],
//   },
//   {
//     name: 'Fashion',
//     subcategories: ["Men's Fashion", "Women's Fashion"],
//   },
//   {
//     name: 'Bags',
//     subcategories: ['Backpacks', 'Travel Bags'],
//   },
//   {
//     name: 'Footwear',
//     subcategories: ['Sneakers', 'Sandals'],
//   },
//   {
//     name: 'Groceries',
//     subcategories: ['Rice', 'Oil', 'Snacks'],
//   },
//   {
//     name: 'Beauty',
//     subcategories: ['Makeup', 'Skincare'],
//   },
//   {
//     name: 'Wellness',
//     subcategories: ['Supplements', 'Yoga'],
//   },
//   {
//     name: 'Jewellery',
//     subcategories: ['Gold', 'Silver', 'Rings'],
//   },
// ];
