import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    const existing = cart.find(
      (item) => item.id === product.id && item.size === product.size
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id && item.size === product.size
            ? { ...item, qty: item.qty + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (productId, size) => {
    setCart((prevCart) => {
      const existing = prevCart.find(
        (item) => item.id === productId && item.size === size
      );
      if (!existing) return prevCart;

      if (existing.qty === 1) {
        return prevCart.filter(
          (item) => !(item.id === productId && item.size === size)
        );
      }

      return prevCart.map((item) =>
        item.id === productId && item.size === size
          ? { ...item, qty: item.qty - 1 }
          : item
      );
    });
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
