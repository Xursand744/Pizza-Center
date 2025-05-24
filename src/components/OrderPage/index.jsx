import menu from "../../data/menu";
import MenuItem from "../MenuItem";

function OrderPage() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Menyu</h2>
      <div className="grid grid-cols-2 gap-4">
        {menu.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default OrderPage;
