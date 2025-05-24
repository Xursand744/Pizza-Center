import { BrowserRouter, Routes, Route } from "react-router";
import { CartProvider } from "./context/CartContext";
import Cart from "./components/Cart";
import KitchenPage from "./pages/KitchenPage";

function App() {
  return (
    <CartProvider>

        <div className="p-4 bg-[#1c1c1e]">
        
          <Routes>
            <Route path="/" element={<Cart />} />
            <Route path="/oshpaz" element={<KitchenPage />} />
          </Routes>
        </div>

    </CartProvider>
  );
}

export default App;
