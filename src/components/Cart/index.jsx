import { useCart } from "../../context/CartContext"
import { useState, useEffect } from "react"
import { X, CheckCheck } from "lucide-react"
import Burger from "../../assets/Burger.jpg"
import Chiz from "../../assets/chiz.jpg"
import Chis from "../../assets/chis.jpg"

import Sprite from "../../assets/sprite.jpg"
import Fanta from "../../assets/fanta.jpg"
import Cola from "../../assets/cola.jpg"
import Hoddog from "../../assets/hoddog.jpg"
import Chizz from "../../assets/chizz.jpg"
import Yello from "../../assets/yellow.jpg"


// Categorized products
const foodProducts = [
  { id: 1, img: Chizz, name: "Big sanders burger achchiq", price: 12000, hasSizes: false, category: "food" },
  { id: 2, img: Chis, name: "Margherita Pizza", price: 15000, hasSizes: true, category: "food" },

  { id: 4, img: Chiz, name: "Cheese Pizza", price: 12000, hasSizes: false, category: "food" },
  { id: 5, img: Burger, name: "Classic Burger", price: 15000, hasSizes: false, category: "food" },
  { id: 6, img: Chis, name: "Pepperoni Pizza", price: 14000, hasSizes: true, category: "food" },
  { id: 7, img: Hoddog, name: "Bittalig Burger", price: 12000, hasSizes: false, category: "food" },

]

const drinkProducts = [
  {
    id: 10,
    img: Cola,
    name: "Coca Cola",
    price: 5000,
    hasSizes: false,
    category: "drink",
  },
  {
    id: 11,
    img: Sprite,
    name: "Sprite",
    price: 5000,
    hasSizes: false,
    category: "drink",
  },
  {
    id: 12,
    img: Fanta,
    name: "Fanta",
    price: 5000,
    hasSizes: false,
    category: "drink",
  },
  {
    id: 13,
    img: Sprite,
    name: "Mineral Water",
    price: 3000,
    hasSizes: false,
    category: "drink",
  },
]

const dessertProducts = [
  {
    id: 20,
    img: Burger,
    name: "Chocolate Cake",
    price: 18000,
    hasSizes: false,
    category: "dessert",
  },
  {
    id: 21,
    img: Burger,
    name: "Cheesecake",
    price: 20000,
    hasSizes: false,
    category: "dessert",
  },
  {
    id: 22,
    img: Burger,
    name: "Ice Cream",
    price: 8000,
    hasSizes: false,
    category: "dessert",
  },
]

// Combine all products for easier access by ID
const allProducts = [...foodProducts, ...drinkProducts, ...dessertProducts]

const sizes = ["Kichik", "O'rtacha", "Katta"]
const additionalItems = [
  {
    id: "mayo",
    name: "Mayonnaise",
    price: 2000,
    img: Cola,
  },
  {
    id: "spicy",
    name: "Spicy Sauce",
    price: 1500,
    img: Sprite,
  },
  {
    id: "fries",
    name: "Potato Fries",
    price: 5000,
    img: Fanta,
  },
]

// Fireworks component
const Fireworks = () => {
  const [particles, setParticles] = useState([])

  

  return (
    <div className="fixed inset-0 pointer-events-none z-40">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

function Cart() {
  const { cart, addToCart, removeFromCart, clearCart } = useCart()
  const [total, setTotal] = useState(0)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedSize, setSelectedSize] = useState("")
  const [additionalSelections, setAdditionalSelections] = useState({
    mayo: false,
    spicy: false,
    fries: false,
  })
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)

  useEffect(() => {
    const sum = cart.reduce((acc, item) => acc + item.price * item.qty, 0)
    setTotal(sum)
  }, [cart])

  const handleOrder = () => {
    if (cart.length === 0) {
      alert("Savat bo'sh.")
      return
    }

    const now = new Date()
    const newOrder = {
      id: Date.now(),
      time: now.toLocaleTimeString(),
      items: cart,
      total,
    }

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    localStorage.setItem("orders", JSON.stringify([newOrder, ...existingOrders]))

    // Show fireworks first
    setShowFireworks(true)

    // Then show confirmation after a short delay
    setTimeout(() => {
      clearCart()
      setShowConfirmation(true)
      setShowFireworks(false)
    }, 2000)
  }

  const openModal = (product) => {
    if (product.hasSizes) {
      setSelectedProduct(product)
      setSelectedSize("")
      setAdditionalSelections({
        mayo: false,
        spicy: false,
        fries: false,
      })
    } else {
      // Directly add to cart for products without sizes
      addToCart({
        ...product,
        size: "Standard",
        extras: [],
      })
    }
  }

  const toggleAdditionalItem = (itemId) => {
    setAdditionalSelections((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const calculateTotalPrice = () => {
    if (!selectedProduct) return 0

    let price = selectedProduct.price

    // Add size-based pricing
    if (selectedSize === "O'rtacha") {
      price += 3000 // Medium size adds 3000
    } else if (selectedSize === "Katta") {
      price += 6000 // Large size adds 6000
    }

    // Add price for additional items
    additionalItems.forEach((item) => {
      if (additionalSelections[item.id]) {
        price += item.price
      }
    })

    return price
  }

  const confirmSelection = () => {
    if (!selectedSize) return alert("Iltimos, o'lcham tanlang.")

    // Create array of selected additional items
    const extras = additionalItems.filter((item) => additionalSelections[item.id]).map((item) => item.name)

    // Calculate total price with additions
    const totalPrice = calculateTotalPrice()

    addToCart({
      ...selectedProduct,
      size: selectedSize,
      extras: extras,
      price: totalPrice,
    })

    setSelectedProduct(null)
    setSelectedSize("")
  }

  // Function to render a category of products
  const renderProductCategory = (products, title) => (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 pl-2 border-l-4 border-green-500">{title}</h2>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((item) => (
         <div key={item.id} className="flex flex-col bg-white rounded-t-3xl shadow-xl">
         <div
           className="border rounded-3xl shadow bg-white cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
           onClick={() => openModal(item)}
         >
           <div className="w-full aspect-[4/3]">
             <img src={item.img || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
           </div>
         </div>
         {/* Name and price outside the card */}
         <div className="mt-3 px-2">
           <h3 className="font-semibold text-lg text-black">{item.name}</h3>
           <p className="text-black font-semibold text-[20px]">{item.price.toLocaleString()} so'm</p>
         </div>
       </div>
       
        ))}
      </div>
    </div>
  )

  return (
    <div className="relative flex">
      {/* Fireworks Animation */}
      {showFireworks && <Fireworks />}

      {/* Mahsulotlar ro'yxati */}
      <div className="w-full  p-4 text-white">
        {/* Food section */}
        {renderProductCategory(foodProducts, "Taomlar")}

        {/* Drinks section */}
        {renderProductCategory(drinkProducts, "Ichimliklar")}

        {/* Desserts section */}
        {renderProductCategory(dessertProducts, "Desertlar")}
      </div>

      {/* Savat - Updated Design */}
      <div className="sticky top-5 h-[92vh] right-4 w-[350px]  lg:w-[450px]  bg-gray-50 border rounded-2xl shadow-lg flex flex-col z-50">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 text-center">Savatcha</h2>
        </div>

        {/* Cart Content */}
        <div className="flex-1 flex flex-col">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6">
              {/* Empty cart icon */}
              <div className="w-20 h-20 mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">Savatingiz boʻsh</h3>
              <p className="text-gray-400 text-center">Boshlash uchun ba'zi mazali narsalarni qo'shing</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-4">
              <ul className="space-y-3">
                {cart.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                    <img
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                      src={item.img || "/placeholder.svg"}
                      alt=""
                    />
                    <div className="flex-1 min-w-0 ">
                      <h4 className="font-medium text-gray-800 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        {item.size} × {item.qty}
                      </p>
                      {item.extras && item.extras.length > 0 && (
                        <p className="text-sm text-gray-400">+ {item.extras.join(", ")}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-800 text-[20px]">
                        {(item.price * item.qty).toLocaleString()} so'm
                      </span>
                      <button
                        className="w-9 h-9 p-1 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        onClick={() => removeFromCart(item.id, item.size)}
                      >
                        <X size={40} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[19px] font-bold text-gray-800 ">Jami:</span>
            <span className="text-[22px] font-bold text-gray-800 ">{total.toLocaleString()} so'm</span>
          </div>

          <div className="space-y-3 xl:space-y-0 xl:flex gap-3">
            <button
              onClick={clearCart}
              className="w-full  flex-1 py-4 px-4 border  border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Savatni yangilash
            </button>
            <button
              onClick={handleOrder}
              disabled={cart.length === 0}
              className="w-full  flex-1 py-4 px-4 bg-gray-800  text-white rounded-lg font-medium hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Buyurtma berish
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Modal: o'lcham va qo'shimchalar tanlash */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
          onClick={() => setSelectedProduct(null)} // Close when clicking on the overlay
        >
          <div
            className="bg-white p-8 rounded-2xl w-[900px] max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the modal content
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">{selectedProduct.name}</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Size selection with images */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4">O'lcham tanlang:</h4>
              <div className="grid grid-cols-3 gap-4">
                {sizes.map((size, index) => {
                  const sizePrice = index === 0 ? 0 : index === 1 ? 3000 : 6000
                  // Different image sizes based on the size option
                  const imgSize = size === "Kichik" ? 100 : size === "O'rtacha" ? 140 : 180
                  return (
                    <div
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border-2 rounded-xl p-3 cursor-pointer transition-all transform hover:scale-105 ${
                        selectedSize === size
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <div className="flex justify-center mb-3">
                        <img
                          src={selectedProduct.img || "/placeholder.svg"}
                          alt={size}
                          className="object-contain"
                          style={{ width: `${imgSize}px`, height: `${imgSize}px` }}
                        />
                      </div>
                      <p className="text-center font-medium">{size}</p>
                      {sizePrice > 0 && (
                        <p className="text-center text-sm text-green-600 font-medium">
                          +{sizePrice.toLocaleString()} so'm
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Additional items with images */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-4">Qo'shimchalar:</h4>
              <div className="grid grid-cols-3 gap-4">
                {additionalItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      additionalSelections[item.id]
                        ? "border-green-500 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => toggleAdditionalItem(item.id)}
                  >
                    <div className="mb-2">
                      {additionalSelections[item.id] ? (
                        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white">
                          <CheckCheck size={16} />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                      )}
                    </div>

                    <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border mb-2">
                      <img
                        src={item.img || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="text-center">
                      <span className="text-lg font-medium block">{item.name}</span>
                      <span className="text-green-600 font-medium">{item.price.toLocaleString()} so'm</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total price */}
            <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-xl border">
              <span className="text-xl font-bold">Jami:</span>
              <span className="text-xl font-bold text-green-600">{calculateTotalPrice().toLocaleString()} so'm</span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmSelection}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
              >
                Savatga qo'shish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal with Enhanced Price Visibility */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl w-[600px] shadow-2xl text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCheck className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">Buyurtma qabul qilindi!</h3>
              <p className="text-xl text-gray-600 mb-8">Rahmat, iltimos to'lovni amalga oshiring</p>

              {/* Enhanced Price Display */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-2xl shadow-lg mb-6">
                <p className="text-white text-lg font-medium mb-2">To'lov miqdori:</p>
                <p className="text-white text-5xl font-bold tracking-wide">
                  {total.toLocaleString()} <span className="text-3xl">so'm</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowConfirmation(false)}
              className="w-full py-5 px-6 bg-green-600 text-white rounded-xl font-bold text-xl hover:bg-green-700 transition-colors shadow-lg"
            >
              Yaxshi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
