
import type { User, ProductTemplate, ProductBatch, WholesaleOrder, Dispensary } from './types';

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

export const mockProductTemplates: ProductTemplate[] = [
  { 
    id: 'pt001', 
    productName: 'Green Crack Flower', 
    strainType: 'Sativa', 
    productCategory: 'Flower', 
    unitOfMeasure: 'Grams', 
    supplier: 'CannaGrow Farms', 
    description: 'Potent Sativa strain, energizing effects. Bulk flower.', 
    imageUrl: 'https://placehold.co/300x200.png?text=Green+Crack',
    coaUrl: 'https://example.com/coa/green-crack-flower.pdf',
    activeStatus: true,
  },
  { 
    id: 'pt002', 
    productName: 'OG Kush Pre-Rolls', 
    strainType: 'Indica', 
    productCategory: 'Pre-Rolls', 
    unitOfMeasure: 'Each', 
    supplier: 'RollRight Inc.', 
    description: 'Classic Indica-dominant hybrid pre-rolls.', 
    imageUrl: 'https://placehold.co/300x200.png?text=OG+Kush+PR',
    activeStatus: true,
  },
  { 
    id: 'pt003', 
    productName: 'CBD Gummies', 
    strainType: 'CBD', 
    productCategory: 'Edibles', 
    unitOfMeasure: 'Each', 
    supplier: 'SweetRelief Edibles', 
    description: 'Relaxing CBD-infused gummies.', 
    imageUrl: 'https://placehold.co/300x200.png?text=CBD+Gummies',
    coaUrl: 'https://example.com/coa/cbd-gummies.pdf',
    activeStatus: true,
  },
  { 
    id: 'pt004', 
    productName: 'Full Spectrum Vape Cartridge', 
    strainType: 'Hybrid', 
    productCategory: 'Vapes', 
    unitOfMeasure: 'Each', 
    supplier: 'VapePure Extracts', 
    description: 'High potency full spectrum vape cartridges.', 
    imageUrl: 'https://placehold.co/300x200.png?text=Vape+Cart',
    activeStatus: true,
  },
  { 
    id: 'pt005', 
    productName: 'Blue Dream Concentrate', 
    strainType: 'Sativa', 
    productCategory: 'Concentrates', 
    unitOfMeasure: 'Grams', 
    supplier: 'CannaGrow Farms', 
    description: 'High-quality Blue Dream concentrate, sativa-dominant effects.', 
    imageUrl: 'https://placehold.co/300x200.png?text=BD+Concentrate',
    activeStatus: false, 
  },
];

export const mockProductBatches: ProductBatch[] = [
  // Batches for Green Crack Flower (pt001)
  { 
    id: 'batch001', productTemplateId: 'pt001', metrcPackageId: 'PKGCRACKA001', 
    thcPercentage: 22.5, cbdPercentage: 0.5, wholesalePricePerUnit: 8, 
    currentStockQuantity: 3000, unitOfMeasure: 'Grams', activeStatus: true,
    productionDate: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
  },
  { 
    id: 'batch002', productTemplateId: 'pt001', metrcPackageId: 'PKGCRACKA002', 
    thcPercentage: 23.1, cbdPercentage: 0.4, wholesalePricePerUnit: 8.10, 
    currentStockQuantity: 2000, unitOfMeasure: 'Grams', activeStatus: true,
    productionDate: new Date(Date.now() - 86400000 * 15).toISOString(), // 15 days ago
  },
  // Batches for OG Kush Pre-Rolls (pt002)
  { 
    id: 'batch003', productTemplateId: 'pt002', metrcPackageId: 'PKGOGPRB001', 
    thcPercentage: 18.0, cbdPercentage: 1.0, wholesalePricePerUnit: 4, 
    currentStockQuantity: 1000, unitOfMeasure: 'Each', activeStatus: true,
  },
  // Batches for CBD Gummies (pt003)
  { 
    id: 'batch004', productTemplateId: 'pt003', metrcPackageId: 'PKGCBDGUMC001', 
    thcPercentage: 0.2, cbdPercentage: 10.0, wholesalePricePerUnit: 1.5, 
    currentStockQuantity: 2000, unitOfMeasure: 'Each', activeStatus: true,
  },
  // Batches for Vape Cartridge (pt004)
  { 
    id: 'batch005', productTemplateId: 'pt004', metrcPackageId: 'PKGVAPED001', 
    thcPercentage: 75.0, cbdPercentage: 5.0, wholesalePricePerUnit: 15, 
    currentStockQuantity: 150, unitOfMeasure: 'Each', activeStatus: true,
  },
  { 
    id: 'batch006', productTemplateId: 'pt004', metrcPackageId: 'PKGVAPED002', 
    thcPercentage: 72.8, cbdPercentage: 5.5, wholesalePricePerUnit: 14.50, 
    currentStockQuantity: 150, unitOfMeasure: 'Each', activeStatus: true,
  },
  // Batch for inactive Blue Dream (pt005)
  {
    id: 'batch007', productTemplateId: 'pt005', metrcPackageId: 'PKGBLUEDRE001',
    thcPercentage: 85.2, cbdPercentage: 0.8, wholesalePricePerUnit: 25,
    currentStockQuantity: 0, unitOfMeasure: 'Grams', activeStatus: false, // Out of stock and template is inactive
  }
];


export const mockWholesaleOrders: WholesaleOrder[] = [
  { 
    id: 'order001', 
    orderDate: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    dispensaryId: 'disp001',
    dispensaryName: 'Green Leaf Wellness',
    productsOrdered: [
      { productTemplateId: 'pt001', productBatchId: 'batch001', productName: 'Green Crack Flower', batchMetrcPackageId: 'PKGCRACKA001', quantity: 500, wholesalePricePerUnit: 8, subtotal: 4000, thcPercentageAtSale: 22.5, cbdPercentageAtSale: 0.5 },
      { productTemplateId: 'pt002', productBatchId: 'batch003', productName: 'OG Kush Pre-Rolls', batchMetrcPackageId: 'PKGOGPRB001', quantity: 100, wholesalePricePerUnit: 4, subtotal: 400, thcPercentageAtSale: 18.0, cbdPercentageAtSale: 1.0 }
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
      { productTemplateId: 'pt003', productBatchId: 'batch004', productName: 'CBD Gummies', batchMetrcPackageId: 'PKGCBDGUMC001', quantity: 500, wholesalePricePerUnit: 1.5, subtotal: 750, thcPercentageAtSale: 0.2, cbdPercentageAtSale: 10.0 }
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
      { productTemplateId: 'pt004', productBatchId: 'batch005', productName: 'Full Spectrum Vape Cartridge', batchMetrcPackageId: 'PKGVAPED001', quantity: 50, wholesalePricePerUnit: 15, subtotal: 750, thcPercentageAtSale: 75.0, cbdPercentageAtSale: 5.0 }
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
