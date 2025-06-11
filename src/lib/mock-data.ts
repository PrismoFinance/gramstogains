
import type { User, ProductTemplate, ProductBatch, WholesaleOrder, Dispensary } from './types';

export const mockUsers: User[] = [
  { id: 'admin001', username: 'admin', role: 'administrator' },
  { id: 'sales001', username: 'salesrep1', role: 'sales_representative' },
  { id: 'sales002', username: 'salesrep2', role: 'sales_representative' },
];

export const mockDispensaries: Dispensary[] = [ // These are existing clients
  {
    id: 'disp001',
    dispensaryName: 'Green Leaf Wellness',
    licenseNumber: 'D12345',
    contactPerson: 'Sarah Miller',
    contactEmail: 'sarah@glwellness.com',
    contactPhoneNumber: '555-1001',
    address: '123 Main St, Denver, CO',
    state: 'CO',
  },
  {
    id: 'disp002',
    dispensaryName: 'The Higher Ground',
    licenseNumber: 'D67890',
    contactPerson: 'Mike Chen',
    contactEmail: 'mike@higherground.com',
    contactPhoneNumber: '555-2002',
    address: '456 Oak Ave, Boulder, CO',
    state: 'CO',
  },
];

export const mockAllPotentialDispensaries: Dispensary[] = [
  // Existing clients (should mirror mockDispensaries with state)
  { id: 'disp001', dispensaryName: 'Green Leaf Wellness', licenseNumber: 'D12345', contactPerson: 'Sarah Miller', contactEmail: 'sarah@glwellness.com', contactPhoneNumber: '555-1001', address: '123 Main St, Denver, CO', state: 'CO' },
  { id: 'disp002', dispensaryName: 'The Higher Ground', licenseNumber: 'D67890', contactPerson: 'Mike Chen', contactEmail: 'mike@higherground.com', contactPhoneNumber: '555-2002', address: '456 Oak Ave, Boulder, CO', state: 'CO' },

  // New prospects in CO
  { id: 'prospect_co_001', dispensaryName: 'Colorado Cannabis Corner', licenseNumber: 'DCO001', contactPerson: 'Alex Johnson', contactEmail: 'alex@ccc.com', contactPhoneNumber: '555-3003', address: '789 Pine Rd, Aurora, CO', state: 'CO', notes: 'New prospect in CO' },
  { id: 'prospect_co_002', dispensaryName: 'Mile High Dispensary', licenseNumber: 'DCO002', contactPerson: 'Maria Garcia', contactEmail: 'maria@milehigh.com', contactPhoneNumber: '555-4004', address: '101 Peak Blvd, Denver, CO', state: 'CO', notes: 'Another CO prospect' },
  { id: 'prospect_co_003', dispensaryName: 'Rocky Mountain Remedies', licenseNumber: 'DCO003', contactPerson: 'David Kim', contactEmail: 'dk@rmremedies.com', contactPhoneNumber: '555-3013', address: '555 Colfax Ave, Denver, CO', state: 'CO', notes: 'Denver prospect, check zoning.' },


  // Prospects in CA
  { id: 'prospect_ca_001', dispensaryName: 'Golden State Greens', licenseNumber: 'DCA001', contactPerson: 'Kevin Lee', contactEmail: 'kevin@gsgreens.com', contactPhoneNumber: '555-5005', address: '321 Palm St, Los Angeles, CA', state: 'CA', notes: 'Prospect in CA' },
  { id: 'prospect_ca_002', dispensaryName: 'SoCal Cannabis Co.', licenseNumber: 'DCA002', contactPerson: 'Jessica Brown', contactEmail: 'jessica@socalcannaco.com', contactPhoneNumber: '555-6006', address: '654 Beach Ave, San Diego, CA', state: 'CA', notes: 'Another CA prospect' },
  { id: 'prospect_ca_003', dispensaryName: 'Bay Area Botanicals', licenseNumber: 'DCA003', contactPerson: 'Tom Wilson', contactEmail: 'tom@baybotanicals.com', contactPhoneNumber: '555-7007', address: '987 Bridge Rd, San Francisco, CA', state: 'CA', notes: 'SF prospect' },
  { id: 'prospect_ca_004', dispensaryName: 'LA Kush Stop', licenseNumber: 'DCA004', contactPerson: 'Linda Young', contactEmail: 'ly@lakush.com', contactPhoneNumber: '555-5015', address: '77 Hollywood Blvd, Los Angeles, CA', state: 'CA', notes: 'LA central prospect.' },


  // Prospects in NV
  { id: 'prospect_nv_001', dispensaryName: 'Desert Bloom Cannabis', licenseNumber: 'DNV001', contactPerson: 'Mark Crane', contactEmail: 'mc@desertbloom.com', contactPhoneNumber: '702-1111', address: '10 Vegas Strip, Las Vegas, NV', state: 'NV', notes: 'Vegas prospect, high traffic.' },
  { id: 'prospect_nv_002', dispensaryName: 'Reno Green Relief', licenseNumber: 'DNV002', contactPerson: 'Susan Bones', contactEmail: 'sb@renogreen.com', contactPhoneNumber: '775-2222', address: '20 Sierra Hwy, Reno, NV', state: 'NV', notes: 'Reno area.' },
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
