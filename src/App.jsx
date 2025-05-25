import { BrowserRouter, Routes, Route } from "react-router";
import { CartProvider } from "./context/CartContext";
import Cart from "./components/Cart";
import KitchenPage from "./pages/KitchenPage";
import Yello from "./assets/yellow.jpg"

function App() {
  return (
    <CartProvider>

        <div className="p-4 bg-[url(./assets/yess.jpg)]">
        
          <Routes>
            <Route path="/" element={<Cart />} />
            <Route path="/oshpaz" element={<KitchenPage />} />
          </Routes>
        </div>

    </CartProvider>
  );
}

export default App;
