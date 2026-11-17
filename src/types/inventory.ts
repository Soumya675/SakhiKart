export type QualityCheckStatus = 'pending_inspection' | 'passed' | 'rework_needed';

export interface InventoryBatch {
  id: string;
  batchCode: string;
  productId: string;
  productName: string;
  sellerName: string;
  categoryName: string;
  hubLocation: string;
  receivedQuantity: number;
  availableQuantity: number;
  qualityStatus: QualityCheckStatus;
  packedDate: string;
  expiryDate?: string;
  daysUntilExpiry?: number;
}

export interface QualityInspectionRecord {
  id: string;
  batchCode: string;
  productName: string;
  sellerName: string;
  district: string;
  inspectorName: string;
  packagingSealOk: boolean;
  weightVerified: boolean;
  craftOrFreshnessGrade: 'Grade A+' | 'Grade A' | 'Hold';
  notes: string;
  status: QualityCheckStatus;
  inspectedAt: string;
}

export interface WarehouseDispatch {
  id: string;
  orderNumber: string;
  customerName: string;
  destinationCity: string;
  itemsCount: number;
  packingStatus: 'awaiting_pack' | 'packed_labeled' | 'dispatched';
  courierPartner: string;
  awbNumber: string;
  scheduledPickup: string;
}

export interface RevenuePoint {
  month: string;
  grossMerchandiseValue: number;
  sellerPayouts: number;
  ordersCount: number;
}
