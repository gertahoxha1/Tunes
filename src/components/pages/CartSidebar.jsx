import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CartSidebar() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const token = savedUser?.token;
      if (!token) return;

      const res = await axios.get("http://localhost:5000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  const removeFromCart = async (id) => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const token = savedUser?.token;
      if (!token) return;

      await axios.delete(`http://localhost:5000/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-gray-100 shadow-lg p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
      {cart.length === 0 && <p>Your cart is empty.</p>}
      {cart.map((item) => (
        <div
          key={item._id}
          className="flex items-center justify-between bg-white p-2 mb-2 rounded shadow"
        >
          <img src={item.image} alt={item.name} className="w-16 h-16" />
          <div className="flex-1 ml-2">
            <h3>{item.name}</h3>
            <p>{item.price}</p>
            <p className="text-sm">Qty: {item.quantity}</p>
          </div>
          <button
            onClick={() => removeFromCart(item._id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            X
          </button>
        </div>
      ))}
      {cart.length > 0 && (
        <Link
          to="/cartpage"
          className="block mt-4 bg-blue-500 text-white py-2 text-center rounded"
        >
          Go to Cart Page
        </Link>
      )}
    </div>
  );
}
