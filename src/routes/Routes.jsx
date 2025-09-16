import { Navigate } from "react-router-dom";

import Guitars from "../components/pages/Guitars";
import Cart from "../components/pages/Cart";
import GuitarDetail from "../components/pages/GuitarDetail";
import HeroSection from "../components/HeroSection";
import FeaturedProducts from "../components/FeaturedProducts";
import { Footer, Newsletter } from "../components/Footer";
import Login from "../components/pages/Login";
import Signup from "../components/pages/Signup";

export const routes = [
  {
    path: "/",
    element: [
      <HeroSection />,
      <FeaturedProducts />,
      <Newsletter />,
      <Footer />,
    ],
  },
  {
    path: "/guitars",
    element: <Guitars />,
  },
  {
    path: "/guitars/:id",
    element: <GuitarDetail />,
  },
  {
    path: "/Login",
    element: <Login />,
  },

  {
    path: "/Signup",
    element: <Signup />,
  },
  {
      path: "/cart",
    element: <Cart/>,
  }, 
   {
    path: "*",
    element: <Navigate to="/" replace />,
  },
];
