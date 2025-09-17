import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function CartPage() {
  const [cart, setCart] = useState([]);

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/cartpage", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      Swal.fire("Error", "Please log in again.", "error");
    }
  };

  const removeFromCart = async (id) => {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/cartpage/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCart();
  };

  const checkout = async () => {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:5000/cartpage/checkout", {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCart([]);
    Swal.fire("Success", "Checkout completed!", "success");
  };

  if (cart.length === 0) return <p className="text-center py-10">Your cart is empty.</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
      {cart.map((item) => (
        <div key={item._id} className="flex items-center justify-between bg-white p-4 mb-3 rounded shadow">
          <img src={item.image} alt={item.name} className="w-20 h-20" />
          <div className="flex-1 ml-4">
            <h3>{item.name}</h3>
            <p>{item.price}</p>
            <p>Qty: {item.quantity}</p>
          </div>
          <button onClick={() => removeFromCart(item._id)} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
        </div>
      ))}
      <button onClick={checkout} className="mt-6 bg-green-500 text-white px-4 py-2 rounded">Checkout</button>
    </div>
  );
}



