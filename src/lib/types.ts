
export interface User {
  id: string;
  username: string;
  role: 'administrator' | 'sales_representative';
}

export interface Product {
  id: string;
  productName: string; // Renamed from name
  strainType: 'Indica' | 'Sativa' | 'Hybrid' | 'CBD' | 'Other';
  thcPercentage: number;
  cbdPercentage: number;
  productCategory: 'Flower' | 'Concentrates' | 'Edibles' | 'Vapes' | 'Topicals' | 'Pre-Rolls' | 'Other';
  unitOfMeasure: 'Grams' | 'Ounces' | 'Each' | 'Milligrams' | 'Other';
  wholesalePricePerUnit: number; // Renamed from price
  currentStockQuantity: number; // Renamed from stock
  supplier: string;
  description?: string;
  imageUrl?: string;
  activeStatus: boolean;
  metrcPackageId?: string; // New field for METRC Package ID
}

export interface ProductOrdered {
  productId: string;
  productName: string;
  quantity: number;
  wholesalePricePerUnit: number;
  subtotal: number;
  metrcPackageId?: string; // New field for METRC Package ID of the specific item sold
}

export interface WholesaleOrder {
  id: string; // Was TransactionID
  orderDate: string; // Was SaleDate (ISO string format)
  dispensaryId: string;
  dispensaryName?: string; // Denormalized for convenience
  productsOrdered: ProductOrdered[];
  totalOrderAmount: number; // Was TotalSaleAmount
  paymentMethod: 'Cash' | 'Credit Card' | 'Debit Card' | 'ACH' | 'Check' | 'Other';
  paymentTerms: 'Net 15' | 'Net 30' | 'Net 60' | 'Due on Receipt' | 'Prepaid';
  paymentStatus: 'Pending' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Cancelled';
  salesAssociateId: string;
  salesAssociateName: string; // Denormalized
  notes?: string;
  shipmentDate?: string; // ISO string format
  trackingNumber?: string;
  metrcManifestId?: string; // Crucial for compliance
}

export interface Dispensary {
  id: string;
  dispensaryName: string;
  licenseNumber: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhoneNumber?: string;
  address?: string; // Could be a structured object later
  notes?: string;
}

// For AI insights - Adjusted to new structures
export interface WholesaleDataForAI {
  products: Pick<Product, 'id' | 'productName' | 'productCategory' | 'strainType' | 'thcPercentage' | 'cbdPercentage' | 'wholesalePricePerUnit' | 'currentStockQuantity' | 'metrcPackageId'>[];
  wholesaleOrders: Array<Pick<WholesaleOrder, 'id' | 'dispensaryId' | 'productsOrdered' | 'totalOrderAmount' | 'orderDate' | 'salesAssociateId' | 'paymentStatus' | 'metrcManifestId'>>;
  dispensaries: Pick<Dispensary, 'id' | 'dispensaryName' | 'licenseNumber' | 'address'>[];
}
