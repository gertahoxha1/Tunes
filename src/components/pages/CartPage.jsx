// frontend/src/pages/CartPage.js
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function CartPage() {
  const [cart, setCart] = useState(null);

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

      setCart(res.data || { items: [] });
    } catch (err) {
      Swal.fire("Error", "Please log in again.", "error");
    }
  };

  const removeFromCart = async (guitarId) => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const token = savedUser?.token;
      if (!token) return;

      await axios.delete(`http://localhost:5000/cart/${guitarId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      Swal.fire("Error", "Could not remove item.", "error");
    }
  };

  const checkout = async () => {
    try {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      const token = savedUser?.token;
      if (!token) return;

      await axios.post(
        "http://localhost:5000/cart/checkout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCart({ items: [] });
      Swal.fire("Success", "Checkout completed!", "success");
    } catch (err) {
      Swal.fire("Error", "Checkout failed.", "error");
    }
  };

  if (!cart || cart.items.length === 0) {
    return <p className="text-center py-10">Your cart is empty.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

      {cart.items.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between bg-white p-4 mb-3 rounded shadow"
        >
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-contain"
          />
          <div className="flex-1 ml-4">
            <h3 className="font-bold">{item.name}</h3>
            <p>{item.price}</p>
            <p>Qty: {item.quantity}</p>
          </div>
          <button
            onClick={() => removeFromCart(Number(item.guitarId))}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={checkout}
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded"
      >
        Checkout
      </button>
    </div>
  );
}
