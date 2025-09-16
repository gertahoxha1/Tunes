// GuitarDetail.js
import { useParams, useNavigate } from "react-router-dom";
import { guitars } from "../data";
import axios from "axios";
import Swal from "sweetalert2";

export default function GuitarDetail({ user }) { // pass user from App or Context
  const { id } = useParams();
  const navigate = useNavigate();
  const guitar = guitars.find((g) => g.id === Number(id) || g.id === id);

  if (!guitar) return <p className="text-center text-gray-500">Guitar not found.</p>;

  const addToCart = async () => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "You must be logged in to add items to your cart.",
        icon: "warning",
      });
      return;
    }

    try {
      await axios.post("http://localhost:5000/cartpage", {
        guitarId: guitar.id,
        name: guitar.name,
        price: guitar.price,
        image: guitar.image,
        userId: user.id, // optional if you track cart per user
      });

      Swal.fire({
        title: "Added!",
        text: `${guitar.name} has been added to your cart.`,
        icon: "success",
      }).then(() => {
        navigate("/cartpage");
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Failed to add guitar to cart.",
        icon: "error",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <img src={guitar.image} alt={guitar.name} className="w-full h-96 object-contain mb-6" />
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
