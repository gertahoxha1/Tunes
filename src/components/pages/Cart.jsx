import { useEffect, useState } from "react";
import axios from "axios";

export default function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/cart").then((res) => setCart(res.data));
  }, []);

  const removeFromCart = async (id) => {
    await axios.delete(`http://localhost:5000/cart/${id}`);
    setCart(cart.filter((item) => item._id !== id));
  };

  if (cart.length === 0) {
    return <p className="text-center py-10 text-gray-500">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
      <ul className="space-y-4">
        {cart.map((item) => (
          <li key={item._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-contain" />
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">{item.price}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
