import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ClipboardCheck, Package, Truck, Warehouse } from 'lucide-react';
import { useStore } from '@/src/context/StoreContext';
import { InventoryService } from '@/src/services/inventory.service';
import { SellersService } from '@/src/services/sellers.service';
import {
  InventoryBatch,
  QualityCheckStatus,
  QualityInspectionRecord,
  WarehouseDispatch,
} from '@/src/types/inventory';
import { CollectionRequest, CollectionStatus } from '@/src/types/seller';
import { OperationsLayout } from '@/src/components/layout/OperationsLayout';
import { DataStateView } from '@/src/components/ui/DataStateView';

export function OperationsDashboardPage() {
  const [collections, setCollections] = useState<CollectionRequest[]>([]);
  const [qcRecords, setQcRecords] = useState<QualityInspectionRecord[]>([]);
  const [batches, setBatches] = useState<InventoryBatch[]>([]);
  const [dispatches, setDispatches] = useState<WarehouseDispatch[]>([]);

  useEffect(() => {
    Promise.all([
      SellersService.listCollectionRequests(),
      InventoryService.listQualityRecords(),
      InventoryService.listBatches(),
      InventoryService.listDispatches(),
    ]).then(([c, q, b, d]) => {
      setCollections(c.data);
      setQcRecords(q.data);
      setBatches(b.data);
      setDispatches(d.data);
    });
  }, []);

  const nearExpiry = batches.filter(
    (b) => typeof b.daysUntilExpiry === 'number' && b.daysUntilExpiry <= 45
  );

  return (
    <OperationsLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
            Field Collection & Hub Operations
          </h1>
          <p className="text-sm text-[#6B625B] mt-1">
            Coordinate village pickups, hub receiving, quality checks, batch expiry, and courier dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/operations/collections" className="rounded-xl border border-[#E5DCD0] bg-white p-5 hover:shadow-sm">
            <Truck className="h-5 w-5 text-[#A45C3B] mb-2" />
            <p className="text-xs text-[#6B625B]">Active Village Pickups</p>
            <p className="font-serif text-2xl font-bold tabular-nums mt-0.5">
              {collections.length}
            </p>
          </Link>
          <Link to="/operations/quality" className="rounded-xl border border-[#E5DCD0] bg-white p-5 hover:shadow-sm">
            <ClipboardCheck className="h-5 w-5 text-[#456B50] mb-2" />
            <p className="text-xs text-[#6B625B]">Pending QC Inspections</p>
            <p className="font-serif text-2xl font-bold tabular-nums mt-0.5">
              {qcRecords.filter((q) => q.status === 'pending_inspection').length}
            </p>
          </Link>
          <Link to="/operations/warehouse" className="rounded-xl border border-[#E5DCD0] bg-white p-5 hover:shadow-sm">
            <Warehouse className="h-5 w-5 text-[#D9A441] mb-2" />
            <p className="text-xs text-[#6B625B]">Near-Expiry Food Batches</p>
            <p className="font-serif text-2xl font-bold tabular-nums mt-0.5">
              {nearExpiry.length}
            </p>
          </Link>
          <Link to="/operations/dispatch" className="rounded-xl border border-[#E5DCD0] bg-white p-5 hover:shadow-sm">
            <Package className="h-5 w-5 text-[#302B27] mb-2" />
            <p className="text-xs text-[#6B625B]">Orders to Pack</p>
            <p className="font-serif text-2xl font-bold tabular-nums mt-0.5">
              {dispatches.filter((d) => d.packingStatus !== 'dispatched').length}
            </p>
          </Link>
        </div>
      </div>
    </OperationsLayout>
  );
}

export function OperationsCollectionsPage() {
  const [collections, setCollections] = useState<CollectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { pushToast } = useStore();

  const load = async () => {
    setIsLoading(true);
    const res = await SellersService.listCollectionRequests();
    setCollections(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updateCollection = async (id: string, status: CollectionStatus) => {
    await SellersService.updateCollectionStatus(
      id,
      status,
      status === 'pickup_scheduled' ? 'OD-02-SK-19 (Assigned)' : undefined
    );
    pushToast({ title: `Collection marked ${status.replace(/_/g, ' ')}`, tone: 'success' });
    load();
  };

  return (
    <OperationsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
            Village Collection & Pickup Scheduling
          </h1>
          <p className="text-sm text-[#6B625B] mt-1">
            Assign field vans to collect finished batches from rural SHGs and receive them at the hub.
          </p>
        </div>

        <DataStateView isLoading={isLoading} error={null} isEmpty={collections.length === 0}>
          <div className="space-y-4">
            {collections.map((c) => (
              <div
                key={c.id}
                className="rounded-xl border border-[#E5DCD0] bg-white p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#6B625B]">
                    <span className="font-mono font-semibold text-[#302B27]">{c.id.toUpperCase()}</span>
                    <span>·</span>
                    <span>{c.village}, {c.district}</span>
                    <span>·</span>
                    <span>Preferred: {c.preferredDate}</span>
                  </div>
                  <h2 className="font-semibold text-base text-[#302B27]">{c.sellerName}</h2>
                  <p className="text-sm text-[#6B625B]">
                    {c.productSummary} ({c.estimatedUnits} units)
                  </p>
                  {c.assignedVehicle ? (
                    <p className="text-xs font-medium text-[#456B50]">
                      Vehicle: {c.assignedVehicle}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={c.status}
                    onChange={(e) => updateCollection(c.id, e.target.value as CollectionStatus)}
                    className="h-10 px-3 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] text-xs font-semibold"
                  >
                    <option value="requested">Requested</option>
                    <option value="pickup_scheduled">Pickup Scheduled</option>
                    <option value="collected">Collected from Village</option>
                    <option value="received_at_hub">Received at Hub</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </DataStateView>
      </div>
    </OperationsLayout>
  );
}

export function OperationsQualityPage() {
  const [records, setRecords] = useState<QualityInspectionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { pushToast } = useStore();

  const load = async () => {
    setIsLoading(true);
    const res = await InventoryService.listQualityRecords();
    setRecords(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleQC = async (id: string, status: QualityCheckStatus) => {
    await InventoryService.updateQualityStatus(id, status);
    pushToast({
      title: `Quality status updated: ${status.replace('_', ' ')}`,
      tone: status === 'passed' ? 'success' : 'info',
    });
    load();
  };

  return (
    <OperationsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
            Quality Inspection & Grading
          </h1>
          <p className="text-sm text-[#6B625B] mt-1">
            Verify seal integrity, weight compliance, and artisan finish before releasing stock to sell.
          </p>
        </div>

        <DataStateView isLoading={isLoading} error={null} isEmpty={records.length === 0}>
          <div className="space-y-4">
            {records.map((rec) => (
              <div
                key={rec.id}
                className="rounded-xl border border-[#E5DCD0] bg-white p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-[#6B625B]">
                    <span className="font-mono font-semibold text-[#302B27]">{rec.batchCode}</span>
                    <span>·</span>
                    <span>{rec.district}</span>
                    <span>·</span>
                    <span>Inspector: {rec.inspectorName}</span>
                  </div>
                  <h2 className="font-serif text-lg font-bold text-[#302B27]">
                    {rec.productName}
                  </h2>
                  <p className="text-xs text-[#6B625B]">
                    {rec.sellerName} · Grade: <strong>{rec.craftOrFreshnessGrade}</strong> ·{' '}
                    Seal {rec.packagingSealOk ? 'Verified' : 'Check'} · Weight{' '}
                    {rec.weightVerified ? 'Verified' : 'Check'}
                  </p>
                  <p className="text-xs text-[#302B27]">{rec.notes}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleQC(rec.id, 'passed')}
                    className={`h-9 px-3.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      rec.status === 'passed'
                        ? 'bg-[#456B50] text-white'
                        : 'border border-[#456B50] text-[#456B50] hover:bg-[#456B50]/10'
                    }`}
                  >
                    Pass QC
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQC(rec.id, 'rework_needed')}
                    className={`h-9 px-3.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      rec.status === 'rework_needed'
                        ? 'bg-[#B9382C] text-white'
                        : 'border border-[#D5C9B8] text-[#B9382C] hover:bg-[#F7F1E7]'
                    }`}
                  >
                    Hold / Rework
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DataStateView>
      </div>
    </OperationsLayout>
  );
}

export function OperationsWarehousePage() {
  const [batches, setBatches] = useState<InventoryBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    InventoryService.listBatches()
      .then((res) => setBatches(res.data))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <OperationsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
            Warehouse Batches & Expiry Tracking
          </h1>
          <p className="text-sm text-[#6B625B] mt-1">
            Track rack locations, live unit counts, and perishable shelf-life windows.
          </p>
        </div>

        <DataStateView isLoading={isLoading} error={null} isEmpty={batches.length === 0}>
          <div className="rounded-xl border border-[#E5DCD0] bg-white overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#FBF8F3] border-b border-[#E5DCD0] text-xs text-[#6B625B]">
                <tr>
                  <th className="py-3 px-4 font-semibold">Batch</th>
                  <th className="py-3 px-4 font-semibold">Product</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold text-right">Available</th>
                  <th className="py-3 px-4 font-semibold">Packed Date</th>
                  <th className="py-3 px-4 font-semibold">Expiry Window</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DC]">
                {batches.map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 px-4 font-mono text-xs font-semibold">{b.batchCode}</td>
                    <td className="py-3 px-4 font-medium">{b.productName}</td>
                    <td className="py-3 px-4 text-xs text-[#6B625B]">{b.hubLocation}</td>
                    <td className="py-3 px-4 text-right tabular-nums font-semibold">
                      {b.availableQuantity} units
                    </td>
                    <td className="py-3 px-4 text-xs font-mono">{b.packedDate}</td>
                    <td className="py-3 px-4 text-xs">
                      {b.expiryDate ? (
                        <span
                          className={
                            (b.daysUntilExpiry ?? 999) <= 30
                              ? 'font-semibold text-[#B9382C]'
                              : 'text-[#456B50]'
                          }
                        >
                          {b.expiryDate} ({b.daysUntilExpiry} days left)
                        </span>
                      ) : (
                        <span className="text-[#6B625B]">No expiry</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DataStateView>
      </div>
    </OperationsLayout>
  );
}

export function OperationsDispatchPage() {
  const [dispatches, setDispatches] = useState<WarehouseDispatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { pushToast } = useStore();

  const load = async () => {
    setIsLoading(true);
    const res = await InventoryService.listDispatches();
    setDispatches(res.data);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const updatePacking = async (
    id: string,
    status: WarehouseDispatch['packingStatus']
  ) => {
    await InventoryService.updateDispatchStatus(id, status);
    pushToast({ title: `Shipment marked ${status.replace('_', ' ')}`, tone: 'success' });
    load();
  };

  return (
    <OperationsLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#302B27]">
            Order Packing & Shipment Dispatch
          </h1>
          <p className="text-sm text-[#6B625B] mt-1">
            Prepare cushioned craft boxes, print AWB labels, and confirm courier handoff.
          </p>
        </div>

        <DataStateView isLoading={isLoading} error={null} isEmpty={dispatches.length === 0}>
          <div className="space-y-4">
            {dispatches.map((d) => (
              <div
                key={d.id}
                className="rounded-xl border border-[#E5DCD0] bg-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-[#6B625B]">
                    <span className="font-mono font-semibold text-[#302B27]">{d.orderNumber}</span>
                    <span>·</span>
                    <span>{d.courierPartner}</span>
                    <span>·</span>
                    <span className="font-mono">AWB {d.awbNumber}</span>
                  </div>
                  <h2 className="font-semibold text-base text-[#302B27]">
                    {d.customerName} — {d.destinationCity}
                  </h2>
                  <p className="text-xs text-[#6B625B]">
                    {d.itemsCount} item(s) · Pickup slot: {d.scheduledPickup}
                  </p>
                </div>

                <select
                  value={d.packingStatus}
                  onChange={(e) =>
                    updatePacking(
                      d.id,
                      e.target.value as WarehouseDispatch['packingStatus']
                    )
                  }
                  className="h-10 px-3 rounded-lg border border-[#D5C9B8] bg-[#FBF8F3] text-xs font-semibold"
                >
                  <option value="awaiting_pack">Awaiting Packing</option>
                  <option value="packed_labeled">Packed & Labeled</option>
                  <option value="dispatched">Dispatched to Courier</option>
                </select>
              </div>
            ))}
          </div>
        </DataStateView>
      </div>
    </OperationsLayout>
  );
}
