// frontend/src/pages/GuitarDetail.js
import { useParams, useNavigate } from "react-router-dom";
import { guitars } from "../data";
import axios from "axios";
import Swal from "sweetalert2";

export default function GuitarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const guitar = guitars.find((g) => g.id === Number(id) || g.id === id);

  if (!guitar) {
    return <p className="text-center text-gray-500">Guitar not found.</p>;
  }

  const addToCart = async () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser?.token) {
      Swal.fire(
        "Login Required",
        "You must be logged in to add items.",
        "warning"
      );
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/cart/add",
        {
          guitarId: guitar.id,
          name: guitar.name,
          type: guitar.type,
          price: guitar.price,
          image: guitar.image, // 👈 make sure your guitar object has this
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${savedUser.token}` },
        }
      );

      Swal.fire("Added!", `${guitar.name} added to your cart.`, "success").then(
        () => navigate("/cartpage")
      );
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error || "Failed to add to cart.",
        "error"
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <img
        src={guitar.image || guitar.image?.[0]}
        alt={guitar.name}
        className="w-full h-96 object-contain mb-6"
      />
      <h2 className="text-3xl font-bold mb-2">{guitar.name}</h2>
      <p className="text-lg text-gray-600 mb-4">{guitar.type} Guitar</p>
      <p className="text-xl font-semibold text-gray-800 mb-6">{guitar.price}</p>
      <button
        onClick={addToCart}
        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
