export interface CartItem {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  category: string;
  brand: string;
  stock: number;
  quantity: number;
  createdAt?: number;
}

// export interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   discountPercentage?: number;
//   quantity: number;

//   image: string;
//   category: string;
//   stock: number;
// }
