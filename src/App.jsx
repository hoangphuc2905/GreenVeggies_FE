import React from "react";
import logo from "./assets/Green.png";


export default function App() {
  return (
    // <h1 className="text-3xl font-bold underline">
    //   {/* Website GreenVeggies welcomes you! */}
    // </h1>
    <div className="flex justify-center items-center h-screen">
      <img src={logo} alt="logo" className="h-96 w-96" />
    </div>
  );
}
