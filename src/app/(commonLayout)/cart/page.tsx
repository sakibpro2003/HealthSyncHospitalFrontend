"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { addToCart, getCart, removeFromCart, clearCart, decrementCartItem } from "@/utils/cart";
import { TProduct } from "@/types/product";
import { toast } from "sonner";
import { useClientUser } from "@/hooks/useClientUser";

const formatTaka = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "BDT",
    minimumFractionDigits: 2,
  }).format(value);

export default function CartPage() {
  const [cart, setCart] = useState<TProduct[]>([]);
  const { user, isLoading: isUserLoading } = useClientUser();

  useEffect(() => {
    setCart(getCart());
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

    if (isUserLoading) {
      toast.info("Checking your login status. Please try again in a moment.");
      return;
    }

    if (!user) {
      toast.error("Please log in to update your cart.");
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
    if (isUserLoading) {
      toast.info("Checking your login status. Please try again in a moment.");
      return;
    }

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
      <section className="relative min-h-screen bg-gradient-to-br from-white via-violet-50/70 to-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,58,237,0.12),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.1),transparent_30%),radial-gradient(circle_at_12%_80%,rgba(99,102,241,0.08),transparent_30%)]" aria-hidden />
        <div className="absolute -left-12 top-10 h-44 w-44 rounded-full bg-violet-200/50 blur-3xl" aria-hidden />
        <div className="absolute -right-16 bottom-6 h-52 w-52 rounded-full bg-indigo-200/50 blur-3xl" aria-hidden />

        <div className="mx-auto flex min-h-screen w-full max-w-[85vw] flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border border-white/60 bg-white/85 p-12 shadow-2xl shadow-violet-200/40 backdrop-blur">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-violet-700">
              Cart is empty
            </span>
            <h1 className="mt-4 text-4xl font-black text-slate-900">Add your first items</h1>
            <p className="mt-3 text-base text-slate-600">
              Browse services and products, then return here to review and checkout securely.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild className="rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 px-8 py-3 text-base font-semibold text-white shadow-lg transition hover:brightness-110">
                <Link href="/services">Explore services</Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-violet-200 px-8 py-3 text-base font-semibold text-violet-700 hover:border-violet-300 hover:bg-violet-50">
                <Link href="/medicine">Browse medicines</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white via-violet-50/60 to-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(124,58,237,0.12),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.1),transparent_30%),radial-gradient(circle_at_12%_80%,rgba(99,102,241,0.08),transparent_30%)]" aria-hidden />
      <div className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-violet-200/50 blur-3xl" aria-hidden />
      <div className="absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-indigo-200/50 blur-3xl" aria-hidden />

      <div className="relative mx-auto w-full max-w-[85vw] px-4 py-14 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 rounded-[1.75rem] border border-white/50 bg-white/80 p-6 text-center shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-violet-700">
              Shopping Cart
            </p>
            <h1 className="text-3xl font-black text-slate-900 sm:text-4xl">
              Review &amp; confirm your selections
            </h1>
            <p className="text-sm text-slate-600 sm:text-base">
              Secure checkout with Stripe. Update quantities, remove items, or continue browsing before paying.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end">
            <div className="rounded-2xl border border-violet-100 bg-white/70 px-4 py-3 text-left shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Items</p>
              <p className="text-xl font-semibold text-slate-900">{cart.length}</p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-white/70 px-4 py-3 text-left shadow-sm">
              <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">Current total</p>
              <p className="text-xl font-semibold text-violet-600">{formatTaka(totalPrice)}</p>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            {cart.map((item) => (
              <article
                key={item._id}
                className="group flex rounded-3xl border border-white/60 bg-gradient-to-br from-white/95 via-white to-violet-50/60 p-4 shadow-md ring-1 ring-violet-100/70 transition hover:-translate-y-1.5 hover:shadow-xl hover:ring-violet-200"
              >
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-28 sm:w-28">
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
                        <span className="min-w-10 text-center text-base font-semibold text-slate-900">
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
            <div className="rounded-3xl bg-gradient-to-br from-violet-700 via-indigo-600 to-sky-500 p-8 text-white shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold">Order Summary</h3>
                <span className="rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
                  Stripe secure
                </span>
              </div>
              <p className="mt-2 text-sm text-violet-100">
                Review your booking before continuing. Payment details are encrypted and processed by Stripe.
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
                <p className="mt-2 text-xs text-violet-100">
                  Taxes calculated at checkout if applicable.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/90 p-6 shadow-md backdrop-blur">
              <p className="text-sm text-slate-600">
                Need to make changes? Remove items, clear the cart, or continue browsing before you pay.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="flex-1 rounded-full border-violet-200 px-6 py-2 text-slate-700 hover:border-red-400 hover:bg-red-50 hover:text-red-600"
                >
                  Clear Cart
                </Button>
                <Button
                  onClick={handleCreatePayment}
                  className="flex-1 rounded-full bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 px-6 py-2 font-semibold shadow-md transition hover:brightness-110"
                >
                  Proceed to Checkout →
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                  ✓ Encrypted payment
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                  ✓ Instant confirmation
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                  ✓ 24/7 support
                </span>
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
