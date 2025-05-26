
import { useCart } from "../../context/CartContext"
import { useState, useEffect } from "react"
import { X, CheckCheck, ChevronUp, ChevronDown } from "lucide-react"
import Burger from "../../assets/Burger.jpg"
import Chiz from "../../assets/chiz.jpg"
import Chis from "../../assets/chis.jpg"
import Sprite from "../../assets/sprite.jpg"
import Fanta from "../../assets/fanta.jpg"
import Cola from "../../assets/cola.jpg"
import Hoddog from "../../assets/hoddog.jpg"
import Chizz from "../../assets/chizz.jpg"

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
  { id: 10, img: Cola, name: "Coca Cola", price: 5000, hasSizes: false, category: "drink" },
  { id: 11, img: Sprite, name: "Sprite", price: 5000, hasSizes: false, category: "drink" },
  { id: 12, img: Fanta, name: "Fanta", price: 5000, hasSizes: false, category: "drink" },
  { id: 13, img: Sprite, name: "Mineral Water", price: 3000, hasSizes: false, category: "drink" },
]

const dessertProducts = [
  { id: 20, img: Burger, name: "Chocolate Cake", price: 18000, hasSizes: false, category: "dessert" },
  { id: 21, img: Burger, name: "Cheesecake", price: 20000, hasSizes: false, category: "dessert" },
  { id: 22, img: Burger, name: "Ice Cream", price: 8000, hasSizes: false, category: "dessert" },
]

const allProducts = [...foodProducts, ...drinkProducts, ...dessertProducts]

const sizes = ["Kichik", "O'rtacha", "Katta"]
const additionalItems = [
  { id: "mayo", name: "Mayonnaise", price: 2000, img: Cola },
  { id: "spicy", name: "Spicy Sauce", price: 1500, img: Sprite },
  { id: "fries", name: "Potato Fries", price: 5000, img: Fanta },
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
  const [isCartExpanded, setIsCartExpanded] = useState(false)

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

    setShowFireworks(true)
    setTimeout(() => {
      clearCart()
      setShowConfirmation(true)
      setShowFireworks(false)
      setIsCartExpanded(false)
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

    if (selectedSize === "O'rtacha") {
      price += 3000
    } else if (selectedSize === "Katta") {
      price += 6000
    }

    additionalItems.forEach((item) => {
      if (additionalSelections[item.id]) {
        price += item.price
      }
    })

    return price
  }

  const confirmSelection = () => {
    if (!selectedSize) return alert("Iltimos, o'lcham tanlang.")

    const extras = additionalItems.filter((item) => additionalSelections[item.id]).map((item) => item.name)
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

  const renderProductCategory = (products, title) => (
    <div className="mb-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 pl-2 border-l-4 border-green-500">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {products.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="cursor-pointer" onClick={() => openModal(item)}>
              <div className="w-full aspect-square">
                <img src={item.img || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <h3 className="font-semibold text-sm sm:text-base text-black line-clamp-2 mb-1 min-h-[2.5rem]">
                  {item.name}
                </h3>
                <p className="text-green-600 font-bold text-base sm:text-lg">{item.price.toLocaleString()} so'm</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="relative">
      {/* Fireworks Animation */}
      {showFireworks && <Fireworks />}

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Products List */}
        <div className="flex-1 p-3 sm:p-4 text-white lg:pr-6 pb-32 lg:pb-4">
          {renderProductCategory(foodProducts, "Taomlar")}
          {renderProductCategory(drinkProducts, "Ichimliklar")}
          {renderProductCategory(dessertProducts, "Desertlar")}
        </div>

        {/* Cart Sidebar - Desktop (Smaller) */}
        <div className="hidden lg:block sticky top-5 h-[92vh] w-[280px] bg-white border rounded-xl shadow-lg flex-col z-50">
          <CartContent
            cart={cart}
            total={total}
            removeFromCart={removeFromCart}
            clearCart={clearCart}
            handleOrder={handleOrder}
          />
        </div>

        {/* Compact Cart Bottom Section - Mobile/Tablet */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          {/* Cart Summary Bar */}
          <div
            className="flex items-center justify-between p-3 cursor-pointer"
            onClick={() => setIsCartExpanded(!isCartExpanded)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {cart.length}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {cart.length === 0 ? "Savat bo'sh" : `${cart.length} ta mahsulot`}
                </p>
                <p className="text-xs text-gray-500">{total.toLocaleString()} so'm</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOrder()
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Buyurtma
                </button>
              )}
              {isCartExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
            </div>
          </div>

          {/* Expandable Cart Content */}
          {isCartExpanded && (
            <div className="border-t bg-gray-50 max-h-60 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Hozircha hech narsa yo'q</p>
                </div>
              ) : (
                <div className="p-3">
                  <ul className="space-y-2">
                    {cart.map((item, index) => (
                      <li key={index} className="flex items-center gap-2 p-2 bg-white rounded-lg border">
                        <img
                          className="w-8 h-8 rounded object-cover flex-shrink-0"
                          src={item.img || "/placeholder.svg"}
                          alt=""
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800 truncate text-xs">{item.name}</h4>
                          <p className="text-xs text-gray-500">
                            {item.size} × {item.qty}
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-gray-800 text-xs">
                            {(item.price * item.qty).toLocaleString()}
                          </span>
                          <button
                            className="w-5 h-5 p-0.5 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                            onClick={() => removeFromCart(item.id, item.size)}
                          >
                            <X size={10} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 pt-3 border-t">
                    <button
                      onClick={clearCart}
                      className="w-full py-2 px-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
                    >
                      Savatni tozalash
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Modal: Responsive */}
      {selectedProduct && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className="bg-white p-4 sm:p-6 lg:p-8 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold">{selectedProduct.name}</h3>
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Size selection */}
            <div className="mb-6 sm:mb-8">
              <h4 className="text-base sm:text-lg font-semibold mb-4">O'lcham tanlang:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {sizes.map((size, index) => {
                  const sizePrice = index === 0 ? 0 : index === 1 ? 3000 : 6000
                  const imgSize = size === "Kichik" ? 80 : size === "O'rtacha" ? 100 : 120
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
                      <p className="text-center font-medium text-sm sm:text-base">{size}</p>
                      {sizePrice > 0 && (
                        <p className="text-center text-xs sm:text-sm text-green-600 font-medium">
                          +{sizePrice.toLocaleString()} so'm
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Additional items */}
            <div className="mb-6 sm:mb-8">
              <h4 className="text-base sm:text-lg font-semibold mb-4">Qo'shimchalar:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {additionalItems.map((item) => (
                  <div
                    key={item.id}
                    className={`flex flex-col items-center p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
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

                    <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border mb-2">
                      <img
                        src={item.img || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="text-center">
                      <span className="text-sm sm:text-base font-medium block">{item.name}</span>
                      <span className="text-xs sm:text-sm text-green-600 font-medium">
                        {item.price.toLocaleString()} so'm
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total price */}
            <div className="flex justify-between items-center mb-6 p-3 sm:p-4 bg-gray-50 rounded-xl border">
              <span className="text-lg sm:text-xl font-bold">Jami:</span>
              <span className="text-lg sm:text-xl font-bold text-green-600">
                {calculateTotalPrice().toLocaleString()} so'm
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => setSelectedProduct(null)}
                className="w-full px-4 sm:px-6 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                Bekor qilish
              </button>
              <button
                onClick={confirmSelection}
                className="w-full px-4 sm:px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
              >
                Savatga qo'shish
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-md sm:max-w-lg shadow-2xl text-center">
            <div className="mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCheck className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                Buyurtma qabul qilindi!
              </h3>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8">
                Rahmat, iltimos to'lovni amalga oshiring
              </p>

              <div className="bg-gradient-to-r from-green-500 to-green-600 p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg mb-4 sm:mb-6">
                <p className="text-white text-sm sm:text-base lg:text-lg font-medium mb-2">To'lov miqdori:</p>
                <p className="text-white text-2xl sm:text-3xl lg:text-5xl font-bold tracking-wide">
                  {total.toLocaleString()} <span className="text-lg sm:text-xl lg:text-3xl">so'm</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowConfirmation(false)}
              className="w-full py-3 sm:py-4 lg:py-5 px-4 sm:px-6 bg-green-600 text-white rounded-xl font-bold text-base sm:text-lg lg:text-xl hover:bg-green-700 transition-colors shadow-lg"
            >
              Yaxshi
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Separate Cart Content Component for Desktop
function CartContent({ cart, total, removeFromCart, clearCart, handleOrder }) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-800 text-center">Savat {cart.length > 0 && `(${cart.length})`}</h2>
      </div>

      {/* Cart Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="w-12 h-12 mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 7H6L5 9z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Savat bo'sh</h3>
            <p className="text-xs text-gray-400 text-center">Mahsulot qo'shing</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-3">
            <ul className="space-y-2">
              {cart.map((item, index) => (
                <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <img
                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                    src={item.img || "/placeholder.svg"}
                    alt=""
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-800 truncate text-xs">{item.name}</h4>
                    <p className="text-xs text-gray-500">
                      {item.size} × {item.qty}
                    </p>
                    {item.extras && item.extras.length > 0 && (
                      <p className="text-xs text-gray-400">+ {item.extras.join(", ")}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-gray-800 text-xs">
                      {(item.price * item.qty).toLocaleString()}
                    </span>
                    <button
                      className="w-5 h-5 p-0.5 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      onClick={() => removeFromCart(item.id, item.size)}
                    >
                      <X size={10} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold text-gray-800">Jami:</span>
          <span className="text-sm font-bold text-gray-800">{total.toLocaleString()} so'm</span>
        </div>

        <div className="space-y-2">
          <button
            onClick={clearCart}
            className="w-full py-2 px-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors text-xs"
          >
            Tozalash
          </button>
          <button
            onClick={handleOrder}
            disabled={cart.length === 0}
            className="w-full py-2 px-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors text-xs"
          >
            Buyurtma berish
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cart
