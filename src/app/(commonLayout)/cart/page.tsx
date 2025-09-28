"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { getCart, removeFromCart, clearCart } from "@/utils/cart";
import { TProduct } from "@/types/product";
import { toast } from "sonner";

export default function CartPage() {
  const [cart, setCart] = useState<TProduct[]>([]);
  const [user, setUser] = useState<{ userId?: string; _id?: string; email?: string } | null>(null);

  useEffect(() => {
    setCart(getCart());
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) throw new Error("Unauthenticated");
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        console.error("Unable to fetch user info", error);
      }
    };
    fetchUser();
  }, []);

  const handleRemove = (id: string) => {
    setCart(removeFromCart(id));
  };

  const handleClear = () => {
    clearCart();
    setCart([]);
  };

  const handleCreatePayment = async () => {
    const resolvedUserId = user?.userId ?? user?._id;
    if (!resolvedUserId) {
      toast.error("Please log in before checkout");
      return;
    }

    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
    const payload = {
      userId: resolvedUserId,
      email: user?.email,
      items: cart.map((item) => ({
        productId: item._id,
        title: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        type: "product" as const,
      })),
    };

    const response = await fetch("http://localhost:5000/api/v1/payment/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      toast.error(errorBody?.message || "Unable to create checkout session");
      return;
    }

    const data = await response.json();
    if (!data?.data?.id) {
      toast.error("Payment session could not be created. Please try again.");
      return;
    }

    const result = await stripe?.redirectToCheckout({ sessionId: data.data.id });
    if (result?.error) toast.error(result.error.message ?? "Stripe redirect failed");
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-center text-4xl font-extrabold text-gray-800 mb-10">
        🛒 Your Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="bg-white shadow-md rounded-2xl p-10 text-center">
          <p className="text-gray-500 text-lg">Your cart is empty</p>
        </div>
      ) : (
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gradient-to-r from-violet-600 to-purple-500 text-white">
                <tr>
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={60}
                        height={60}
                        className="rounded-lg shadow-sm object-contain"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4 text-gray-700">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 font-semibold text-violet-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => item._id && handleRemove(item._id)}
                        className="rounded-full px-4 py-1"
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-right font-bold text-gray-800">
                    Total:
                  </td>
                  <td className="px-6 py-4 font-extrabold text-green-600 text-lg">
                    ${totalPrice.toFixed(2)}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex justify-between items-center p-6 border-t bg-gray-50">
            <Button
              variant="outline"
              onClick={handleClear}
              className="rounded-full px-6 py-2 hover:bg-red-50 hover:text-red-600"
            >
              Clear Cart
            </Button>
            <Button
              onClick={handleCreatePayment}
              className="rounded-full px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold shadow-md"
            >
              Proceed to Checkout →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
