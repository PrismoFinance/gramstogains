
export interface User {
  id: string;
  username: string;
  role: 'administrator' | 'sales_representative';
}

// Represents the general product definition or template
export interface ProductTemplate {
  id: string;
  productName: string;
  strainType: 'Indica' | 'Sativa' | 'Hybrid' | 'CBD' | 'Other';
  productCategory: 'Flower' | 'Concentrates' | 'Edibles' | 'Vapes' | 'Topicals' | 'Pre-Rolls' | 'Other';
  unitOfMeasure: 'Grams' | 'Ounces' | 'Each' | 'Milligrams' | 'Other'; // General unit for the template
  supplier: string;
  description?: string;
  imageUrl?: string;
  activeStatus: boolean; // Is this product template actively being produced/sold?
}

// Represents a specific batch of a ProductTemplate, tracked by a METRC ID
export interface ProductBatch {
  id: string; // Internal unique ID for the batch
  productTemplateId: string; // Foreign key to ProductTemplate
  metrcPackageId: string; // The actual METRC Package ID for this batch
  thcPercentage: number;
  cbdPercentage: number;
  wholesalePricePerUnit: number; // Price for this specific batch
  currentStockQuantity: number;
  unitOfMeasure: ProductTemplate['unitOfMeasure']; // Confirmed unit for this batch, usually same as template
  productionDate?: string; // ISO date string
  expirationDate?: string; // ISO date string
  activeStatus: boolean; // Is this batch available for sale?
}

export interface ProductOrdered {
  productTemplateId: string; // Link to the general product
  productBatchId: string; // Link to the specific batch sold
  productName: string; // Denormalized from ProductTemplate
  batchMetrcPackageId: string; // Denormalized from ProductBatch
  quantity: number;
  wholesalePricePerUnit: number; // Price at the time of sale from the batch
  subtotal: number;
  // Store batch-specific cannabinoid profile at time of sale if needed for historicals
  thcPercentageAtSale?: number;
  cbdPercentageAtSale?: number;
}

export interface WholesaleOrder {
  id: string;
  orderDate: string; // ISO string format
  dispensaryId: string;
  dispensaryName?: string; // Denormalized for convenience
  productsOrdered: ProductOrdered[];
  totalOrderAmount: number;
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'ACH' | 'Check' | 'Other';
  paymentTerms: 'Net 15' | 'Net 30' | 'Net 60' | 'Due on Receipt' | 'Prepaid';
  paymentStatus: 'Pending' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Cancelled';
  salesAssociateId: string;
  salesAssociateName: string; // Denormalized
  notes?: string;
  shipmentDate?: string; // ISO string format
  trackingNumber?: string;
  metrcManifestId?: string;
}

export interface Dispensary {
  id: string;
  dispensaryName: string;
  licenseNumber: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhoneNumber?: string;
  address?: string;
  notes?: string;
}

// For AI insights - Adjusted to new structures
// ProductTemplate details for AI
export interface ProductTemplateForAI extends Pick<ProductTemplate, 'id' | 'productName' | 'productCategory' | 'strainType'> {}

// ProductBatch details for AI
export interface ProductBatchForAI extends Pick<ProductBatch, 'id' | 'productTemplateId' | 'metrcPackageId' | 'thcPercentage' | 'cbdPercentage' | 'wholesalePricePerUnit' | 'currentStockQuantity'> {}

// Details of product ordered in AI context, linking to batch
export interface ProductOrderedForAI {
  productTemplateId: string;
  productBatchId: string;
  productName: string; // from template
  batchMetrcPackageId: string; // from batch
  quantity: number;
  wholesalePricePerUnit: number; // from batch
  subtotal: number;
  thcPercentageAtSale?: number; // from batch
  cbdPercentageAtSale?: number; // from batch
}

export interface WholesaleOrderForAI extends Pick<WholesaleOrder, 'id' | 'dispensaryId' | 'totalOrderAmount' | 'orderDate' | 'salesAssociateId' | 'paymentStatus' | 'metrcManifestId'> {
  productsOrdered: ProductOrderedForAI[];
}

export interface WholesaleDataForAI {
  productTemplates: ProductTemplateForAI[];
  productBatches: ProductBatchForAI[];
  wholesaleOrders: WholesaleOrderForAI[];
  dispensaries: Pick<Dispensary, 'id' | 'dispensaryName' | 'licenseNumber' | 'address'>[];
}
