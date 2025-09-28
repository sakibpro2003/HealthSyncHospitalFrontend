import React from "react";
import logo from "../../../public/logo.png";
import Image from "next/image";
const Logo = () => {
  return (
    <div>
      <Image height={150} width={150} alt="logo.png" src={logo}></Image>
    </div>
  );
};

export default Logo;
