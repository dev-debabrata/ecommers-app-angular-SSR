export interface AddressUser {
  id?: string;
  createdAt?: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface User {
  uid?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string[];
  role?: 'user' | 'admin';

  addresses?: AddressUser[];
  createdAt?: any;
}

// export interface User {
//   uid?: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phoneNumber: string[];
//   role?: 'user' | 'admin';
// }

// export interface User {
//   id: number;
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   phoneNumber: string[];
// }
