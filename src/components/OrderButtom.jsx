import { useCart } from "../context/CartContext";
import { useEffect, useState } from "react";

function OrderButton() {
  const { cart, clearCart } = useCart();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sum = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    setTotal(sum);
  }, [cart]);

  const handleOrder = () => {
    if (cart.length === 0) {
      alert("Savat bo‘sh. Avval buyurtma tanlang.");
      return;
    }

    const now = new Date();
    const newOrder = {
      id: Date.now(),
      time: now.toLocaleTimeString(),
      items: cart,
      total,
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = [newOrder, ...existingOrders];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    clearCart();
    <div>
        <span className="w-[300px] h-[300px]">

        💹
        </span>
    </div>
  };

  return (
    <div className="fixed bottom-24 right-6">
      <button
        onClick={handleOrder}
        className="bg-green-600 text-white font-bold px-6 py-3 rounded-full shadow-lg hover:bg-green-700"
      >
        🧾 Buyurtma berish – {total.toLocaleString()} so'm
      </button>
    </div>
  );
}

export default OrderButton;
