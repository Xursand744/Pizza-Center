import { useState, useEffect } from "react"
import { HandPlatter, Clock, CheckCircle, ChefHat } from "lucide-react"

function KitchenPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // Load orders from localStorage
    const loadOrders = () => {
      const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
      setOrders(savedOrders)
    }

    // Initial load
    loadOrders()

    // Set up interval to check for new orders every 30 seconds
    const intervalId = setInterval(loadOrders, 30000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  const markAsDone = (orderId) => {
    const filtered = orders.filter((order) => order.id !== orderId)
    setOrders(filtered)
    localStorage.setItem("orders", JSON.stringify(filtered))
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-gray-500">
        <ChefHat size={120} className="mb-6 text-gray-400" />
        <h3 className="text-3xl font-bold mb-4">Hozircha buyurtmalar yo'q</h3>
        <p className="text-xl text-gray-500">Yangi buyurtmalar kelganda bu yerda ko'rinadi</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Oshxona paneli</h1>

      <div className="grid grid-cols-1 gap-8">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-gray-200">
            {/* Order header */}
            <div className="bg-gray-800 px-8 py-6 flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-white mr-3" />
                <span className="font-bold text-white text-2xl">{order.time}</span>
              </div>
              <div>
                <span className="text-xl font-bold bg-yellow-400 text-gray-900 py-2 px-4 rounded-full">
                  #{order.id.toString().slice(-4)}
                </span>
              </div>
            </div>

            {/* Order items - Redesigned as a single line per item */}
            <div className="px-8 py-6">
              <h3 className="text-2xl font-bold mb-5 text-gray-800">Buyurtma:</h3>
              <ul className="space-y-4 mb-6">
                {order.items.map((item, index) => {
                  // Combine all item details into a single beautiful line
                  const extras = item.extras && item.extras.length > 0 ? ` + ${item.extras.join(", ")}` : ""
                  const size = item.size && item.size !== "Standard" ? ` (${item.size})` : ""

                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-gray-50 px-6 py-4 rounded-xl border border-gray-100"
                    >
                      <div className="flex-1">
                        <span className="text-2xl font-bold text-gray-800">
                          {item.name}
                          {size}
                          {extras && <span className="text-gray-600 ml-2">{extras}</span>}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-2xl font-bold ml-4 bg-gray-800 text-white px-5 py-2 rounded-full">
                          ×{item.qty}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>

              {/* Order total and action in a single row */}
              <div className="flex items-center gap-6 mt-8">
                <div className="flex items-center bg-gray-100 px-6 py-4 rounded-xl">
                  <span className="text-2xl font-bold text-gray-700 mr-3">Jami:</span>
                  <span className="text-3xl font-bold text-gray-800">{order.total.toLocaleString()} so'm</span>
                </div>

                <button
                  onClick={() => markAsDone(order.id)}
                  className="flex-1 flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white py-5 px-6 rounded-xl font-bold text-xl transition-colors"
                >
                  <CheckCircle className="h-7 w-7" />
                  <span>TAYYOR</span>
                  <HandPlatter className="h-7 w-7" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default KitchenPage
