// Common type definitions for the application

export interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  description?: string;
  image?: string;
  stock?: number;
  brand?: Brand;
  category?: Category;
  subcategory?: Subcategory;
  flavors?: Flavor[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Brand {
  _id: string;
  name: string;
  logo?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  _id: string;
  name: string;
  category: string | Category;
  description?: string;
}

export interface Flavor {
  _id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  photo?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
}

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod?: string;
  shippingAddress?: Address;
  createdAt: string;
  updatedAt?: string;
  orderRef?: string;
}

export interface OrderItem {
  product: Product | string;
  quantity: number;
  price: number;
  selectedFlavor?: string;
}

export interface Address {
  fullName?: string;
  phone?: string;
  address?: string;
  street?: string;
  city: string;
  postalCode: string;
  country?: string;
}

export interface Review {
  _id: string;
  user: User | string;
  product: Product | string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedFlavor?: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: Order[];
  topProducts: Product[];
  salesData: SalesData[];
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
}
