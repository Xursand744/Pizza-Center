import { useCart } from "../../context/CartContext";

function MenuItem({ item }) {
  const { addToCart } = useCart();

  return (
    <div className="p-4 border rounded bg-white shadow">
      <h3 className="text-lg font-bold">{item.name}</h3>
      <p>{item.price.toLocaleString()} so'm</p>
      <button
        onClick={() => addToCart(item)}
        className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
      >
        Qo‘shish
      </button>
    </div>
  );
}

export default MenuItem;
