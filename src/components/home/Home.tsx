import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { LogoutOutlined } from "@ant-design/icons";
import "./Home.css";
import Header from "../header/Header";

const Home = ({ onButtonClick }: any) => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };
  return (
    <>
      <div>
        <header>
          <Header />
        </header>
      </div>
      <div className="createAccount">
        <div className="logoutButton" onClick={logout}>
          <LogoutOutlined />
        </div>
        <h1>Create Wallet </h1>
        <div>
          <Button
            onClick={onButtonClick}
            className="createAccountButton"
            type="primary"
          >
            Create Wallet{" "}
          </Button>
        </div>

        <div>
          <Button
            onClick={() => navigate("/recoveraccount")}
            className="signInButton1"
          >
            Recover Wallet With Seed Phrese
          </Button>
        </div>
      </div>
    </>
  );
};

export default Home;
