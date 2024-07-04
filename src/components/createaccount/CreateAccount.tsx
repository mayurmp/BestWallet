import React, { useEffect } from "react";
import "./CreateAccount.css";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

interface CreateAccountProps {
  setSeedPhrase: (seedPhrase: string) => void;
  setWallet: (wallet: string) => void;
}

export const CreateAccount: React.FC<CreateAccountProps> = ({
  setSeedPhrase,
  setWallet,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const storedSeedPhrase = localStorage.getItem("seedPhrase");

    if (storedSeedPhrase) {
      setSeedPhrase(storedSeedPhrase);
      setWallet(ethers.Wallet.fromPhrase(storedSeedPhrase).address);
      navigate("/walletView");
    }
  }, [navigate, setSeedPhrase, setWallet]);

  function generateWalletAndNavigate() {
    const mnemonics: any = ethers.Wallet.createRandom().mnemonic?.phrase;
    localStorage.setItem("seedPhrase", mnemonics);

    setSeedPhrase(mnemonics);
    setWallet(ethers.Wallet.fromPhrase(mnemonics).address);

    navigate("/walletView");
  }

  return (
    <div className="content">
      <Button
        className="generateseedphraseButton"
        type="primary"
        onClick={() => generateWalletAndNavigate()}
      >
        Create Wallet
      </Button>
      <Button
        className="back"
        onClick={() => {
          navigate("/home");
        }}
      >
        Back
      </Button>
    </div>
  );
};
