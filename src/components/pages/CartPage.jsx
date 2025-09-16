import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:5000/cartpage");
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };
  const removeFromCart = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/cartpage/${id}`);
      fetchCart();
      Swal.fire({
        title: "Removed",
        text: "Item removed from cart",
        icon: "info",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: "Failed to remove item",
        icon: "error",
      });
    }
  };

  const checkout = async () => {
    if (cart.length === 0) {
      Swal.fire({
        title: "Empty Cart",
        text: "Your cart is empty!",
        icon: "warning",
      });
      return;
    }

    try {
      await Promise.all(
        cart.map((item) =>
          axios.delete(`http://localhost:5000/cartpage/${item._id}`)
        )
      );
      setCart([]);
      Swal.fire({
        title: "Success!",
        text: "Checkout completed successfully.",
        icon: "success",
      });
    } catch (err) {
      console.error("Checkout failed:", err);
      Swal.fire({
        title: "Error",
        text: "Checkout failed. Try again later.",
        icon: "error",
      });
    }
  };

  if (cart.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">Your cart is empty.</p>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
      <ul className="space-y-4">
        {cart.map((item) => (
          <li
            key={item._id}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-contain"
            />
            <div className="flex-1 ml-4">
              <h3 className="font-semibold">{item.name}</h3>
              <p>{item.price}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
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
      <button
        onClick={checkout}
        className="mt-6 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Checkout
      </button>
    </div>
  );
}
