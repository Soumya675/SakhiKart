import { APP_CONFIG } from '@/src/lib/api/config';
import { inventoryRepository } from '@/src/lib/api/inventory.repository';
import { ApiResponse } from '@/src/types/common';
import {
  InventoryBatch,
  QualityCheckStatus,
  QualityInspectionRecord,
  RevenuePoint,
  WarehouseDispatch,
} from '@/src/types/inventory';

function wrap<T>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    source: APP_CONFIG.dataMode,
    timestamp: new Date().toISOString(),
    message,
  };
}

export const InventoryService = {
  async listBatches(): Promise<ApiResponse<InventoryBatch[]>> {
    const data = await inventoryRepository.listBatches();
    return wrap(data);
  },

  async listQualityRecords(): Promise<ApiResponse<QualityInspectionRecord[]>> {
    const data = await inventoryRepository.listQualityRecords();
    return wrap(data);
  },

  async updateQualityStatus(
    recordId: string,
    status: QualityCheckStatus
  ): Promise<ApiResponse<QualityInspectionRecord>> {
    const data = await inventoryRepository.updateQualityStatus(recordId, status);
    return wrap(data, `Quality check marked ${status}`);
  },

  async listDispatches(): Promise<ApiResponse<WarehouseDispatch[]>> {
    const data = await inventoryRepository.listDispatches();
    return wrap(data);
  },

  async updateDispatchStatus(
    dispatchId: string,
    packingStatus: WarehouseDispatch['packingStatus']
  ): Promise<ApiResponse<WarehouseDispatch>> {
    const data = await inventoryRepository.updateDispatchStatus(dispatchId, packingStatus);
    return wrap(data, `Dispatch marked ${packingStatus}`);
  },

  async getRevenueSeries(): Promise<ApiResponse<RevenuePoint[]>> {
    const data = await inventoryRepository.getRevenueSeries();
    return wrap(data);
  },
};
