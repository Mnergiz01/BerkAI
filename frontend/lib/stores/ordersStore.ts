import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    neighborhood?: string;
  };
  paymentMethod: string;
}

interface OrdersStore {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status'>) => void;
  getOrderById: (id: string) => Order | undefined;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

export const useOrdersStore = create<OrdersStore>()(
  persist(
    (set, get) => ({
      orders: [],

      addOrder: (orderData) => {
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const newOrder: Order = {
          ...orderData,
          id: Date.now().toString(),
          orderNumber,
          date: new Date().toISOString(),
          status: 'pending',
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));
      },

      getOrderById: (id) => {
        return get().orders.find((order) => order.id === id);
      },

      updateOrderStatus: (id, status) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, status } : order
          ),
        }));
      },
    }),
    {
      name: 'orders-storage',
    }
  )
);
