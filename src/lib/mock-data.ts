import type { User, Product, Sale } from './types';

export const mockUsers: User[] = [
  { id: 'admin001', username: 'admin', role: 'administrator' },
  { id: 'sales001', username: 'salesrep1', role: 'sales_representative' },
  { id: 'sales002', username: 'salesrep2', role: 'sales_representative' },
];

export const mockProducts: Product[] = [
  { id: 'prod001', name: 'Green Crack', category: 'Flower', price: 15, stock: 100, description: 'Potent Sativa strain.', imageUrl: 'https://placehold.co/300x200.png?text=Green+Crack' },
  { id: 'prod002', name: 'OG Kush', category: 'Flower', price: 12, stock: 150, description: 'Classic Indica-dominant hybrid.', imageUrl: 'https://placehold.co/300x200.png?text=OG+Kush' },
  { id: 'prod003', name: 'CBD Gummies', category: 'Edibles', price: 25, stock: 80, description: 'Relaxing CBD-infused gummies.', imageUrl: 'https://placehold.co/300x200.png?text=CBD+Gummies' },
  { id: 'prod004', name: 'THC Tincture', category: 'Tinctures', price: 40, stock: 50, description: 'Fast-acting THC tincture.', imageUrl: 'https://placehold.co/300x200.png?text=THC+Tincture' },
  { id: 'prod005', name: 'Pre-Roll Variety Pack', category: 'Pre-Rolls', price: 30, stock: 60, description: 'Assortment of popular pre-rolls.', imageUrl: 'https://placehold.co/300x200.png?text=Pre-Rolls' },
];

export const mockSales: Sale[] = [
  { 
    id: 'sale001', 
    productId: 'prod001', 
    productName: 'Green Crack', 
    quantity: 2, 
    unitPrice: 15,
    totalAmount: 30, 
    saleDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    salesAssociateId: 'sales001',
    salesAssociateName: 'salesrep1'
  },
  { 
    id: 'sale002', 
    productId: 'prod003', 
    productName: 'CBD Gummies',
    quantity: 1, 
    unitPrice: 25,
    totalAmount: 25, 
    saleDate: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    salesAssociateId: 'sales002',
    salesAssociateName: 'salesrep2'
  },
  { 
    id: 'sale003', 
    productId: 'prod002', 
    productName: 'OG Kush',
    quantity: 3, 
    unitPrice: 12,
    totalAmount: 36, 
    saleDate: new Date().toISOString(), // Today
    salesAssociateId: 'sales001',
    salesAssociateName: 'salesrep1'
  },
];
