"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { getCart, removeFromCart, clearCart } from "@/utils/cart";
import { TProduct } from "@/types/product";
import { toast } from "sonner";

export default function CartPage() {
  const [cart, setCart] = useState<TProduct[]>([]);
  const [user, setUser] = useState<{
    userId?: string;
    _id?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    setCart(getCart());
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/me");
        if (!res.ok) {
          throw new Error("Unauthenticated");
        }
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

  // TODO: refactor with redux
  const handleCreatePayment = async () => {
    const resolvedUserId = user?.userId ?? user?._id;
    if (!resolvedUserId) {
      console.error("Unable to resolve user id for checkout");
      return;
    }

    const stripe = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
    );
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
    const response = await fetch(
      "http://localhost:5000/api/v1/payment/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const message =
        errorBody?.message || errorBody?.error || "Unable to create checkout session";
      toast.error(message);
      console.error("Unable to create checkout session", errorBody);
      return;
    }

    const data = await response.json();

    if (!data?.data?.id) {
      toast.error("Payment session could not be created. Please try again.");
      console.error("Stripe session id missing in response", data);
      return;
    }

    const result = await stripe?.redirectToCheckout({
      sessionId: data.data.id, // use the id from backend
    });

    if (result?.error) {
      toast.error(result.error.message ?? "Stripe redirect failed");
      console.error("Stripe redirect error:", result.error.message);
    }
  };

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        <Button onClick={handleCreatePayment}>Checkout</Button>
      </div>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-lg">Your cart is empty</p>
      ) : (
        <div className="rounded-xl border shadow-md bg-white p-4">
          <Table>
            <TableCaption>A summary of your shopping cart.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-md object-contain"
                    />
                    undefined
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${item.price.toFixed(2)}</TableCell>
                  <TableCell className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => item._id && handleRemove(item._id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={4} className="text-right font-bold">
                  Total
                </TableCell>
                <TableCell className="font-bold text-green-600 text-lg">
                  ${totalPrice.toFixed(2)}
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={handleClear}>
              Clear Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
