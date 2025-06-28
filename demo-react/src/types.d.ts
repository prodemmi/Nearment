export interface Comment {
  id: string;
  text: string;
  author: string;
  avatar?: string;
  timestamp: string;
  likes: number;
  dislikes: number;
  subject?: string;
  productId: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  image: string;
  rating: number;
  reviewCount: number;
}