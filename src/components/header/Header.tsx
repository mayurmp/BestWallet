import { Select } from "antd";
import React, { useState } from "react";
import logo from "../../ta-removebg-preview (1).png";

import "./Header.css";
const Header = () => {
  const [selectedChain, setSelectedChain] = useState("0xAA36A7");

  return (
    <div className="header">
      <img src={logo} className="headerLogo" alt="logo" />
      <div className="select">
        <Select
          onChange={(val) => setSelectedChain(val)}
          value={selectedChain}
          options={[
            {
              label: "Ethereum",
              value: "0x1",
            },
            {
              label: "Mumbai Testnet",
              value: "0x13881",
            },
            {
              label: "Polygon",
              value: "0x89",
            },
            {
              label: "Ethereum Sepolia",
              value: "0xAA36A7",
            },
          ]}
          className="dropdown"
        ></Select>
      </div>
    </div>
  );
};

export default Header;
