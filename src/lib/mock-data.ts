
import type { User, Product, WholesaleOrder, Dispensary } from './types';

export const mockUsers: User[] = [
  { id: 'admin001', username: 'admin', role: 'administrator' },
  { id: 'sales001', username: 'salesrep1', role: 'sales_representative' },
  { id: 'sales002', username: 'salesrep2', role: 'sales_representative' },
];

export const mockDispensaries: Dispensary[] = [
  { 
    id: 'disp001', 
    dispensaryName: 'Green Leaf Wellness', 
    licenseNumber: 'D12345', 
    contactPerson: 'Sarah Miller', 
    contactEmail: 'sarah@glwellness.com', 
    contactPhoneNumber: '555-1001',
    address: '123 Main St, Denver, CO'
  },
  { 
    id: 'disp002', 
    dispensaryName: 'The Higher Ground', 
    licenseNumber: 'D67890', 
    contactPerson: 'Mike Chen', 
    contactEmail: 'mike@higherground.com', 
    contactPhoneNumber: '555-2002',
    address: '456 Oak Ave, Boulder, CO'
  },
];

export const mockProducts: Product[] = [
  { 
    id: 'prod001', 
    productName: 'Green Crack Flower', 
    strainType: 'Sativa', 
    thcPercentage: 22.5, 
    cbdPercentage: 0.5,
    productCategory: 'Flower', 
    unitOfMeasure: 'Grams', 
    wholesalePricePerUnit: 8, 
    currentStockQuantity: 5000, // in grams
    supplier: 'CannaGrow Farms', 
    description: 'Potent Sativa strain, energizing effects. Bulk flower.', 
    imageUrl: 'https://placehold.co/300x200.png?text=Green+Crack',
    activeStatus: true,
    metrcPackageId: 'PKG00012345A'
  },
  { 
    id: 'prod002', 
    productName: 'OG Kush Pre-Rolls (1g)', 
    strainType: 'Indica', 
    thcPercentage: 18.0, 
    cbdPercentage: 1.0,
    productCategory: 'Pre-Rolls', 
    unitOfMeasure: 'Each', 
    wholesalePricePerUnit: 4, 
    currentStockQuantity: 1000, // number of pre-rolls
    supplier: 'RollRight Inc.', 
    description: 'Classic Indica-dominant hybrid, 1 gram pre-rolls.', 
    imageUrl: 'https://placehold.co/300x200.png?text=OG+Kush+PR',
    activeStatus: true,
    metrcPackageId: 'PKG00012345B'
  },
  { 
    id: 'prod003', 
    productName: 'CBD Gummies (10mg)', 
    strainType: 'CBD', 
    thcPercentage: 0.2, 
    cbdPercentage: 10.0,
    productCategory: 'Edibles', 
    unitOfMeasure: 'Each', 
    wholesalePricePerUnit: 1.5, 
    currentStockQuantity: 2000, // number of gummies
    supplier: 'SweetRelief Edibles', 
    description: 'Relaxing CBD-infused gummies, 10mg CBD per gummy.', 
    imageUrl: 'https://placehold.co/300x200.png?text=CBD+Gummies',
    activeStatus: true,
    metrcPackageId: 'PKG00012345C'
  },
  { 
    id: 'prod004', 
    productName: 'Full Spectrum Vape Cartridge (0.5g)', 
    strainType: 'Hybrid', 
    thcPercentage: 75.0, 
    cbdPercentage: 5.0,
    productCategory: 'Vapes', 
    unitOfMeasure: 'Each', 
    wholesalePricePerUnit: 15, 
    currentStockQuantity: 300, // number of cartridges
    supplier: 'VapePure Extracts', 
    description: 'High potency full spectrum 0.5g vape cartridge.', 
    imageUrl: 'https://placehold.co/300x200.png?text=Vape+Cart',
    activeStatus: true,
    metrcPackageId: 'PKG00012345D'
  },
  { 
    id: 'prod005', 
    productName: 'Blue Dream Concentrate (1g)', 
    strainType: 'Sativa', 
    thcPercentage: 85.2, 
    cbdPercentage: 0.8,
    productCategory: 'Concentrates', 
    unitOfMeasure: 'Grams', 
    wholesalePricePerUnit: 25, 
    currentStockQuantity: 250, // in grams
    supplier: 'CannaGrow Farms', 
    description: 'High-quality Blue Dream concentrate, sativa-dominant effects.', 
    imageUrl: 'https://placehold.co/300x200.png?text=BD+Concentrate',
    activeStatus: false, // Example of inactive product
    metrcPackageId: 'PKG00012345E'
  },
];

export const mockWholesaleOrders: WholesaleOrder[] = [
  { 
    id: 'order001', 
    orderDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    dispensaryId: 'disp001',
    dispensaryName: 'Green Leaf Wellness',
    productsOrdered: [
      { productId: 'prod001', productName: 'Green Crack Flower', quantity: 500, wholesalePricePerUnit: 8, subtotal: 4000, metrcPackageId: 'PKG00012345A' },
      { productId: 'prod002', productName: 'OG Kush Pre-Rolls (1g)', quantity: 100, wholesalePricePerUnit: 4, subtotal: 400, metrcPackageId: 'PKG00012345B' }
    ],
    totalOrderAmount: 4400, 
    paymentMethod: 'ACH',
    paymentTerms: 'Net 30',
    paymentStatus: 'Paid',
    salesAssociateId: 'sales001',
    salesAssociateName: 'salesrep1',
    shipmentDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    metrcManifestId: 'MM1002345',
    notes: 'Early delivery requested.'
  },
  { 
    id: 'order002', 
    orderDate: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    dispensaryId: 'disp002',
    dispensaryName: 'The Higher Ground',
    productsOrdered: [
      { productId: 'prod003', productName: 'CBD Gummies (10mg)', quantity: 500, wholesalePricePerUnit: 1.5, subtotal: 750, metrcPackageId: 'PKG00012345C' }
    ],
    totalOrderAmount: 750, 
    paymentMethod: 'Credit Card',
    paymentTerms: 'Due on Receipt',
    paymentStatus: 'Pending',
    salesAssociateId: 'sales002',
    salesAssociateName: 'salesrep2',
    shipmentDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    metrcManifestId: 'MM1002346',
  },
  { 
    id: 'order003', 
    orderDate: new Date().toISOString(), // Today
    dispensaryId: 'disp001',
    dispensaryName: 'Green Leaf Wellness',
    productsOrdered: [
      { productId: 'prod004', productName: 'Full Spectrum Vape Cartridge (0.5g)', quantity: 50, wholesalePricePerUnit: 15, subtotal: 750, metrcPackageId: 'PKG00012345D' }
    ],
    totalOrderAmount: 750, 
    paymentMethod: 'Check',
    paymentTerms: 'Net 15',
    paymentStatus: 'Pending',
    salesAssociateId: 'sales001',
    salesAssociateName: 'salesrep1',
    metrcManifestId: 'MM1002347',
    notes: 'Standard order.'
  },
];
