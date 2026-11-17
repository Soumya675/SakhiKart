import {
  DEMO_DISPATCHES,
  DEMO_INVENTORY_BATCHES,
  DEMO_QUALITY_RECORDS,
  DEMO_REVENUE_SERIES,
} from '@/src/lib/mock-data/operations';
import {
  InventoryBatch,
  QualityCheckStatus,
  QualityInspectionRecord,
  RevenuePoint,
  WarehouseDispatch,
} from '@/src/types/inventory';
import { APP_CONFIG, simulateLatency } from './config';
import { readDemoCollection, writeDemoCollection } from './storage-helper';

const STORAGE_KEY_BATCHES = 'sakhikart_demo_batches_v1';
const STORAGE_KEY_QC = 'sakhikart_demo_qc_v1';
const STORAGE_KEY_DISPATCHES = 'sakhikart_demo_dispatches_v1';

export interface IInventoryRepository {
  listBatches(): Promise<InventoryBatch[]>;
  listQualityRecords(): Promise<QualityInspectionRecord[]>;
  updateQualityStatus(recordId: string, status: QualityCheckStatus): Promise<QualityInspectionRecord>;
  listDispatches(): Promise<WarehouseDispatch[]>;
  updateDispatchStatus(
    dispatchId: string,
    packingStatus: WarehouseDispatch['packingStatus']
  ): Promise<WarehouseDispatch>;
  getRevenueSeries(): Promise<RevenuePoint[]>;
}

class DemoInventoryRepository implements IInventoryRepository {
  async listBatches(): Promise<InventoryBatch[]> {
    await simulateLatency(110);
    return readDemoCollection<InventoryBatch[]>(
      STORAGE_KEY_BATCHES,
      DEMO_INVENTORY_BATCHES
    );
  }

  async listQualityRecords(): Promise<QualityInspectionRecord[]> {
    await simulateLatency(110);
    return readDemoCollection<QualityInspectionRecord[]>(
      STORAGE_KEY_QC,
      DEMO_QUALITY_RECORDS
    );
  }

  async updateQualityStatus(
    recordId: string,
    status: QualityCheckStatus
  ): Promise<QualityInspectionRecord> {
    await simulateLatency(140);
    const records = readDemoCollection<QualityInspectionRecord[]>(
      STORAGE_KEY_QC,
      DEMO_QUALITY_RECORDS
    );
    const target = records.find((r) => r.id === recordId);
    if (!target) throw new Error('Inspection record not found.');
    const updated: QualityInspectionRecord = {
      ...target,
      status,
      inspectedAt: new Date().toISOString(),
    };
    writeDemoCollection(
      STORAGE_KEY_QC,
      records.map((r) => (r.id === recordId ? updated : r))
    );

    const batches = readDemoCollection<InventoryBatch[]>(
      STORAGE_KEY_BATCHES,
      DEMO_INVENTORY_BATCHES
    );
    writeDemoCollection(
      STORAGE_KEY_BATCHES,
      batches.map((b) =>
        b.batchCode === target.batchCode ? { ...b, qualityStatus: status } : b
      )
    );
    return updated;
  }

  async listDispatches(): Promise<WarehouseDispatch[]> {
    await simulateLatency(110);
    return readDemoCollection<WarehouseDispatch[]>(
      STORAGE_KEY_DISPATCHES,
      DEMO_DISPATCHES
    );
  }

  async updateDispatchStatus(
    dispatchId: string,
    packingStatus: WarehouseDispatch['packingStatus']
  ): Promise<WarehouseDispatch> {
    await simulateLatency(140);
    const dispatches = readDemoCollection<WarehouseDispatch[]>(
      STORAGE_KEY_DISPATCHES,
      DEMO_DISPATCHES
    );
    const target = dispatches.find((d) => d.id === dispatchId);
    if (!target) throw new Error('Dispatch item not found.');
    const updated = { ...target, packingStatus };
    writeDemoCollection(
      STORAGE_KEY_DISPATCHES,
      dispatches.map((d) => (d.id === dispatchId ? updated : d))
    );
    return updated;
  }

  async getRevenueSeries(): Promise<RevenuePoint[]> {
    await simulateLatency(100);
    return DEMO_REVENUE_SERIES;
  }
}

export const inventoryRepository: IInventoryRepository =
  APP_CONFIG.dataMode === 'production'
    ? new DemoInventoryRepository()
    : new DemoInventoryRepository();
