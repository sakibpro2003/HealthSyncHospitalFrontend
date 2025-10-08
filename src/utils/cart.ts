import { TProduct } from "@/types/product";

export const getCart = () => {
  if (typeof window !== "undefined") {
    const cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};

export const saveCart = (cart: TProduct[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

export const addToCart = (product: TProduct) => {
  const cart = getCart();
  const existing = cart.find((item: TProduct) => item._id === product._id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  return cart;
};

export const decrementCartItem = (id: string) => {
  const cart = getCart();
  const updatedCart = cart.reduce((acc: TProduct[], item: TProduct) => {
    if (item._id !== id) {
      acc.push(item);
      return acc;
    }

    const currentQuantity = Number(item.quantity ?? 0);
    if (currentQuantity > 1) {
      acc.push({ ...item, quantity: currentQuantity - 1 });
    }

    return acc;
  }, []);

  saveCart(updatedCart);
  return updatedCart;
};

export const removeFromCart = (id: string) => {
  let cart = getCart();
  cart = cart.filter((item: TProduct) => item._id !== id);
  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  saveCart([]);
};
