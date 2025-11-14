import { create } from "zustand";

import { useCartStore } from "./cartStore";
import { axiosInstance } from "../lib/axiosinstance";
import toast from "react-hot-toast";
import { useEmailStore } from "./emailStore";

interface Order {
  email: string;
  items: any[];
  total: number;
  paymentMethod: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postCode: string;
  country: string;
  regionState: string;
}

interface OrderStore {
  loading: boolean;
  error: string | null;
  createOrder: (
    orderData: Omit<Order, "items" | "total"> & { deliveryCharge?: number; shippingMethod?: string },
    opts?: { showToast?: boolean }
  ) => Promise<string | null>; // returns orderId on success
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  loading: false,
  error: null,


  createOrder: async (orderData, opts) => {
    const { cart, total, clearCart } = useCartStore.getState();
    const { email, verified } = useEmailStore.getState();

    if (!verified || !email) {
      toast.error("Please verify your email before placing the order.");
      return null;
    }

    set({ loading: true, error: null });

    try {
      const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const deliveryCharge = orderData.deliveryCharge ?? 0;
      const totalAmount = subtotal + deliveryCharge;

      const payload = {
        items: cart.map((item) => ({
          productId: item.id,
          productName: item.name,
          productImage: item.image,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
        subtotal,
        deliveryCharge,
        totalAmount,
        firstName: orderData.firstName,
        lastName: orderData.lastName,
        email,
        address: orderData.address,
        city: orderData.city,
        postCode: orderData.postCode,
        country: orderData.country,
        regionState: orderData.regionState,
        paymentMethod: orderData.paymentMethod,
        shippingMethod: orderData.shippingMethod,
      };

      const res = await axiosInstance.post("/orders", payload);
      const orderId = res?.data?.id ?? res?.data?.order?.id ?? null;
      clearCart();
      set({ loading: false });
      if (orderId && (opts?.showToast ?? true)) {
        toast.success(`Order placed successfully #${orderId.slice(0, 8)}...`, {
          style: { background: "#10B981", color: "white", fontSize: "14px" },
        });
      }
      return orderId;
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Failed to place order",
      });
      return null;
    }
  },
}));
