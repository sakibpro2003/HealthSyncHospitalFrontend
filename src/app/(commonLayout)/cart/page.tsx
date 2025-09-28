"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { addToCart, getCart, removeFromCart, clearCart, decrementCartItem } from "@/utils/cart";
import { TProduct } from "@/types/product";
import { toast } from "sonner";

const formatTaka = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
  }).format(value);

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

  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart],
  );

  const handleRemove = (id: string) => setCart(removeFromCart(id));

  const handleIncrement = (product: TProduct) => {
    if (!product?._id) {
      return;
    }
    setCart(addToCart(product));
  };

  const handleDecrement = (product: TProduct) => {
    if (!product?._id) {
      return;
    }

    if ((product.quantity ?? 0) <= 1) {
      handleRemove(product._id);
      return;
    }

    setCart(decrementCartItem(product._id));
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

  if (!cart.length) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
        <div className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-6 text-center">
          <div className="rounded-3xl border border-white/60 bg-white/70 p-12 shadow-xl backdrop-blur">
            <h1 className="mb-4 text-4xl font-black text-slate-800">🛒 Your Cart Is Empty</h1>
            <p className="mb-8 text-lg text-slate-600">
              Looks like you haven&apos;t added anything yet. Browse our services and come back when you&apos;re ready.
            </p>
            <Button asChild className="rounded-full px-8 py-3 text-base font-semibold">
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <header className="mb-10 text-center sm:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-500">Shopping Cart</p>
          <h1 className="mt-4 text-4xl font-black text-slate-900 sm:text-5xl">
            Review &amp; confirm your selections
          </h1>
          <p className="mt-3 text-base text-slate-600 sm:max-w-xl">
            Secure checkout, instant confirmations, and dedicated support for every appointment or service you book.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            {cart.map((item) => (
              <article
                key={item._id}
                className="group flex rounded-3xl border border-slate-200/70 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
              >
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-28 sm:w-28">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(min-width: 640px) 7rem, 6rem"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-between gap-3 px-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
                      <div className="mt-2 flex items-center gap-3">
                        <Button
                          aria-label="Decrease quantity"
                          size="icon"
                          variant="outline"
                          className="rounded-full border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                          onClick={() => handleDecrement(item)}
                        >
                          -
                        </Button>
                        <span className="min-w-[2.5rem] text-center text-base font-semibold text-slate-900">
                          {item.quantity}
                        </span>
                        <Button
                          aria-label="Increase quantity"
                          size="icon"
                          variant="outline"
                          className="rounded-full border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                          onClick={() => handleIncrement(item)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Unit Price</p>
                      <p className="text-lg font-semibold text-slate-900">
                        {formatTaka(item.price)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total</p>
                      <p className="text-xl font-semibold text-violet-600">
                        {formatTaka(item.price * item.quantity)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => item._id && handleRemove(item._id)}
                      className="rounded-full border-red-500 px-4 py-1 text-red-500 transition hover:bg-red-50 hover:text-red-600"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="flex flex-col justify-between gap-6">
            <div className="rounded-3xl bg-gradient-to-br from-violet-600 via-violet-500 to-purple-500 p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-semibold">Order Summary</h3>
              <p className="mt-2 text-sm text-violet-100">
                Secure payments powered by Stripe. Review your booking before continuing.
              </p>

              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <dt>Items</dt>
                  <dd>{cart.length}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatTaka(totalPrice)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Service fee</dt>
                  <dd className="text-violet-200">Complimentary</dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-white/20 pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm uppercase tracking-[0.3em] text-violet-200">Total due</p>
                  <p className="text-3xl font-bold">{formatTaka(totalPrice)}</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">
                Need to make changes? You can remove items or clear the cart entirely before checkout.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1 rounded-full border-slate-200 px-6 py-2 text-slate-700 hover:border-red-500 hover:bg-red-50 hover:text-red-500"
                >
                  Clear Cart
                </Button>
                <Button
                  onClick={handleCreatePayment}
                  className="flex-1 rounded-full bg-violet-600 px-6 py-2 font-semibold shadow-md transition hover:bg-violet-700"
                >
                  Proceed to Checkout →
                </Button>
              </div>

              <Button
                asChild
                variant="ghost"
                className="mt-4 w-full rounded-full text-sm text-slate-500 underline-offset-4 hover:text-violet-600 hover:underline"
              >
                <Link href="/services">← Continue browsing services</Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
