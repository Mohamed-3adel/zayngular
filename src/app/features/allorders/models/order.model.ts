export interface Product {
  _id: string;
  id: string;
  title: string;
  quantity: number;
  imageCover: string;
  ratingsAverage: number;
  subcategory: {
    _id: string;
    name: string;
    slug: string;
    category: string;
  };
  category: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
  brand: {
    _id: string;
    name: string;
    slug: string;
    image: string;
  };
}

export interface CartItem {
  _id: string;
  count: number;
  price: number;
  product: Product | null;
}

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface OrderUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Order {
  _id: string;
  id: number;
  user: OrderUser;
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethodType: string;
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

