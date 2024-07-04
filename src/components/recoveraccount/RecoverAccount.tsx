import { Button, Input } from "antd";
import "./RecoverAccount.css";
import { useNavigate } from "react-router-dom";
import { SetStateAction, useState } from "react";
import { ethers } from "ethers";

interface RecoverAccountProps {
  setSeedPhrase: (seedPhrase: string) => void;
  setWallet: (wallet: string) => void;
}

export const RecoverAccount: React.FC<RecoverAccountProps> = ({
  setSeedPhrase,
  setWallet,
}) => {
  const navigate = useNavigate();
  const [nonValid, setNonValid] = useState(false);
  const [typedSeed, setTypedSeed] = useState("");
  const TextArea = Input;
  const [recoveredAddress, setRecoveredAddress] = useState<string>();
  const [recoverPrivateKey, setRecoverPrivateKey] = useState<string>();

  function seedAdjust(e: { target: { value: SetStateAction<string> } }) {
    setNonValid(false);
    setTypedSeed(e.target.value);
  }

  function recoverWallet() {
    let recoverWallet: any;

    try {
      recoverWallet = ethers.Wallet.fromPhrase(typedSeed);
      const privateKey = recoverWallet.privateKey;
      const recoveredAddress = recoverWallet.address;

      localStorage.setItem("recoverPrivateKey", privateKey);
      localStorage.setItem("recoveredAddress", recoveredAddress);

      setRecoverPrivateKey(privateKey);

      const recoveredAccount = {
        address: recoveredAddress,
        privateKey: privateKey,
      };
      const storedAccountsString = localStorage.getItem("Accounts") ?? "[]";
      const storedAccounts = JSON.parse(storedAccountsString);
      const updatedAccounts = [...storedAccounts, recoveredAccount];
      localStorage.setItem("Accounts", JSON.stringify(updatedAccounts));

      setSeedPhrase(typedSeed);
      setWallet(recoveredAddress);
      setRecoveredAddress(recoveredAddress);

      navigate("/walletview");
      return;
    } catch (error) {
      setNonValid(true);
      return;
    }
  }

  return (
    <div className="recoveraccount">
      <h1 style={{ textAlign: "center" }}>Recover Account</h1>
      <TextArea
        value={typedSeed}
        onChange={seedAdjust}
        className="seedPhraseContainer"
        placeholder="Type Your Seed Phrase Here..."
      />

      <Button
        disabled={
          typedSeed.split(" ").length !== 12 || typedSeed.slice(-1) === " "
        }
        className="recoverButton"
        type="primary"
        onClick={() => recoverWallet()}
      >
        Recover Wallet
      </Button>
      {nonValid && (
        <p style={{ color: "red", fontSize: "15px", marginLeft: "8rem" }}>
          {" "}
          Invalid Seed Phrase{" "}
        </p>
      )}
      <Button className="back" onClick={() => navigate("/home")}>
        Back
      </Button>
    </div>
  );
};
