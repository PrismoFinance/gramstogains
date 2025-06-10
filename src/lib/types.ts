export interface User {
  id: string;
  username: string;
  role: 'administrator' | 'sales_representative';
  // In a real app, never store passwords directly
  // passwordHash?: string; 
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  description?: string;
  imageUrl?: string;
}

export interface Sale {
  id: string;
  productId: string;
  productName: string; // Denormalized for display convenience
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  saleDate: string; // ISO string format for date
  salesAssociateId: string;
  salesAssociateName: string; // Denormalized
}

// For AI insights
export interface SalesDataForAI {
  products: Pick<Product, 'id' | 'name' | 'category' | 'price' | 'stock'>[];
  sales: Pick<Sale, 'productId' | 'quantity' | 'totalAmount' | 'saleDate' | 'salesAssociateId'>[];
}
