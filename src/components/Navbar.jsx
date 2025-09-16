import React from "react";
import {
  FaSearch,
  FaBars,
  FaShoppingCart,
  FaPlusCircle,
  FaSlidersH,
  FaTree,
  FaRulerVertical,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaUser,
} from "react-icons/fa";
import {Link} from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm py-4 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to='/' className="text-2xl font-bold text-red-600">Tunes</Link>
          <div className="hidden md:flex space-x-6">
            <Link to="/guitars" className="text-gray-700 hover:text-red-600 transition">
              Guitars
            </Link>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-red-600 transition">
            Shopping Cart
          </button>
          <Link to="/login" className="p-2 text-gray-600 hover:text-red-600 transition">
          Log in
          </Link>
          <button className="md:hidden p-2 text-gray-600 hover:text-red-600 transition">
            <FaBars />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
