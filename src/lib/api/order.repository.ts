import { DEMO_ORDERS } from '@/src/lib/mock-data/orders';
import { CheckoutInput, Order, OrderStatus } from '@/src/types/order';
import { APP_CONFIG, simulateLatency } from './config';
import { readDemoCollection, writeDemoCollection } from './storage-helper';

const STORAGE_KEY_ORDERS = 'sakhikart_demo_orders_v1';

export interface IOrderRepository {
  listOrders(customerId?: string): Promise<Order[]>;
  getOrderByNumber(orderNumber: string): Promise<Order | null>;
  createOrder(input: CheckoutInput): Promise<Order>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
}

class DemoOrderRepository implements IOrderRepository {
  private getAll(): Order[] {
    return readDemoCollection<Order[]>(STORAGE_KEY_ORDERS, DEMO_ORDERS);
  }

  private saveAll(orders: Order[]): void {
    writeDemoCollection(STORAGE_KEY_ORDERS, orders);
  }

  async listOrders(customerId?: string): Promise<Order[]> {
    await simulateLatency(130);
    const all = this.getAll();
    return customerId ? all.filter((o) => o.customerId === customerId) : all;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    await simulateLatency(100);
    return (
      this.getAll().find(
        (o) => o.orderNumber.toLowerCase() === orderNumber.toLowerCase()
      ) ?? null
    );
  }

  async createOrder(input: CheckoutInput): Promise<Order> {
    await simulateLatency(240);
    const existing = this.getAll();
    const subtotal = input.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shippingAmount =
      subtotal >= APP_CONFIG.freeShippingThreshold ? 0 : APP_CONFIG.standardShippingFee;
    const totalAmount = subtotal + shippingAmount;
    const orderNum = `SK-2026-${Math.floor(1050 + Math.random() * 8900)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerId: input.customerId,
      customerName: input.shippingAddress.fullName,
      shippingAddress: input.shippingAddress,
      items: input.items.map((item) => ({
        productId: item.productId,
        productName: item.name,
        sellerId: 'seller-maa-shakti-shg',
        sellerName: item.sellerName,
        imageUrl: item.imageUrl,
        unitPrice: item.price,
        quantity: item.quantity,
        lineTotal: item.price * item.quantity,
      })),
      subtotal,
      shippingAmount,
      totalAmount,
      paymentMethod: input.paymentMethod,
      paymentStatus: input.paymentMethod === 'cod' ? 'cod_due' : 'paid',
      orderStatus: 'confirmed',
      trackingCode: `SK-TRK-${Date.now().toString().slice(-6)}`,
      courierPartner: 'SakhiKart Partner Logistics (Demo)',
      timeline: [
        {
          label: 'Order Placed',
          detail:
            input.paymentMethod === 'cod'
              ? 'Confirmed with Cash on Delivery'
              : 'Payment authorized in Demo Mode',
          timestamp: new Date().toLocaleString('en-IN'),
          completed: true,
        },
        {
          label: 'Quality Inspection & Hub Packing',
          detail: 'Queued at Bhubaneswar Fulfillment Hub',
          timestamp: 'Pending',
          completed: false,
        },
        {
          label: 'In Transit',
          detail: 'Tracking will activate upon dispatch',
          timestamp: 'Pending',
          completed: false,
        },
        {
          label: 'Delivered',
          detail: `Delivering to ${input.shippingAddress.city}, ${input.shippingAddress.state}`,
          timestamp: 'Pending',
          completed: false,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    this.saveAll([newOrder, ...existing]);
    return newOrder;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    await simulateLatency(140);
    const existing = this.getAll();
    const target = existing.find((o) => o.id === orderId);
    if (!target) throw new Error('Order not found.');
    const updated: Order = {
      ...target,
      orderStatus: status,
    };
    this.saveAll(existing.map((o) => (o.id === orderId ? updated : o)));
    return updated;
  }
}

export const orderRepository: IOrderRepository =
  APP_CONFIG.dataMode === 'production'
    ? new DemoOrderRepository()
    : new DemoOrderRepository();
