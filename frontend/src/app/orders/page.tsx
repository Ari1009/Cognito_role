"use client";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axiosinstance";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  total: number;
  productImage: string;
}

interface Order {
  id: string;
  totalAmount: number;
  subtotal: number;
  deliveryCharge: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosInstance.get("/orders");
        setOrders(res.data || []);
      } catch (e: any) {
        setError(e?.response?.data?.message || e?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <div className="max-w-[1160px] mx-auto px-6 py-10">
      <h1 className="text-xl font-semibold mb-6">My Orders</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && orders.length === 0 && <p>No orders yet.</p>}

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-mono text-sm">{o.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Placed on</p>
                <p className="text-sm">{new Date(o.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-700">
              <p>
                Customer {o.firstName} {o.lastName} • {o.email}
              </p>
              <p>
                Items {o.items?.length || 0} • Subtotal ${Number(o.subtotal).toFixed(2)} • Delivery ${Number(o.deliveryCharge).toFixed(2)} • Total ${Number(o.totalAmount).toFixed(2)}
              </p>
            </div>

            {o.items?.length > 0 && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {o.items.slice(0, 6).map((it, idx) => (
                  <div key={idx} className="flex items-center gap-3 border rounded p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={it.productImage} alt={it.productName} className="w-12 h-12 object-contain" />
                    <div className="text-xs">
                      <p className="font-medium line-clamp-1">{it.productName}</p>
                      <p className="text-gray-500">{it.quantity} × ${Number(it.price).toFixed(2)} = ${Number(it.total).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
