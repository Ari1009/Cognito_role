import { create } from "zustand";
import { axiosInstance } from "../lib/axiosinstance";

export interface Product {
  id: string;
  brand?: string;
  rating: number;
  type?: string; // maps to backend category
  name: string;
  price: number;
  image: string;
  bestSell: boolean; // derived from badge/isFeatured
  dayDeal: boolean; // derived from badge/isFeatured
}

interface ProductStore {
  products: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  getProductById: (id: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  product: null,
  loading: false,
  error: null,

  
  fetchProducts: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get("/products");
      const mapped = (res.data || []).map((p: any) => ({
        id: p.id,
        brand: p.brand ?? "",
        rating: Number(p.rating ?? 0),
        type: p.category ?? "",
        name: p.name,
        price: Number(p.price),
        image: p.image,
        bestSell: Boolean(p.isFeatured) || p?.badge === "best",
        dayDeal: Boolean(p.isFeatured) || p?.badge === "sale",
      })) as Product[];
      set({ products: mapped, loading: false, error: null });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },


  getProductById: async (id: string) => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(`/products/${id}`);
      const p = res.data;
      const mapped: Product = {
        id: p.id,
        brand: p.brand ?? "",
        rating: Number(p.rating ?? 0),
        type: p.category ?? "",
        name: p.name,
        price: Number(p.price),
        image: p.image,
        bestSell: Boolean(p.isFeatured) || p?.badge === "best",
        dayDeal: Boolean(p.isFeatured) || p?.badge === "sale",
      };
      set({ product: mapped, loading: false, error: null });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },
}));
