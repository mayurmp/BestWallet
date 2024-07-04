import "./Footer.css";
import { HiWallet } from "react-icons/hi2";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { RxActivityLog } from "react-icons/rx";
import { IoMdSettings } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();
  return (
    <div className="footer_main">
      <div className="componnets">
        <div style={{ marginLeft: "1rem", cursor: "pointer" }}>
          <HiWallet
            size={25}
            onClick={() => {
              navigate("./walletView");
            }}
          />
        </div>
        <div style={{ marginLeft: "4rem", cursor: "pointer" }}>
          <FaArrowRightArrowLeft
            size={25}
            onClick={() => {
              navigate("./swap");
            }}
          />
        </div>
        <div style={{ marginLeft: "4rem", cursor: "pointer" }}>
          <RxActivityLog
            size={25}
            onClick={() => {
              navigate("./activity");
            }}
          />
        </div>
        <div style={{ marginLeft: "4rem", cursor: "pointer" }}>
          <IoMdSettings
            size={25}
            onClick={() => {
              navigate("./setting");
            }}
          />
        </div>
      </div>
    </div>
  );
};
