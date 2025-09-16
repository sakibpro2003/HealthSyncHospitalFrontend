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
import { Button } from "@/components/ui/button";
import { getCart, removeFromCart, clearCart } from "@/utils/cart";
// import { useCreatePaymentMutation } from "@/redux/features/payment/paymentApi";

export default function CartPage() {
  // const [createPayment] = useCreatePaymentMutation();
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleRemove = (id: string) => {
    setCart(removeFromCart(id));
  };

  const handleClear = () => {
    clearCart();
    setCart([]);
  };

 const handleCreatePayment = async () => {
  const paymentData = {
    email: "dd@gmail.com",
    price: 44, // better use actual cart total
    transactionId: `txn_${Date.now()}`, // make unique
    date: new Date(),
    status: "pending",
  };
  console.log("Sending paymentData:", paymentData);

  try {
    const res = await fetch("http://localhost:5000/api/v1/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(paymentData),
    });

    if (!res.ok) {
      throw new Error("Failed to create payment");
    }

    const data = await res.json(); // ✅ parse the response body
    console.log("Backend response:", data);

    // redirect to SSLCommerz Gateway if URL exists
    if (data.GatewayPageURL) {
      window.location.href = data.GatewayPageURL;
    }
  } catch (error) {
    console.error("Payment error:", error);
  }
};


  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>
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
                      onClick={() => handleRemove(item._id)}
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
