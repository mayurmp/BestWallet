import { Routes, Route, MemoryRouter } from "react-router-dom";
import Login from "./components/login/Login";
import Home from "./components/home/Home";
import { CreateAccount } from "./components/createaccount/CreateAccount";
import { WalletView } from "./components/walletview/WalletView";
import { RecoverAccount } from "./components/recoveraccount/RecoverAccount";
import { useState } from "react";
import { Footer } from "./components/footer/Footer";
import { Swap } from "./components/swap/Swap";
import { Setting } from "./components/setting/Setting";
import Activity from "./components/activity/Activity";
import "./App.css";
const App = () => {
  const [wallet, setWallet] = useState<null | string>(null);
  const [selectedChain, setSelectedChain] = useState<"0x1" | "0x13881">("0x1");
  const [seedPhrase, setSeedPhrase] = useState<null | string>(null);

  return (
    <div>
      <div className="App">
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route
              path="/createAccount"
              element={
                <CreateAccount
                  setSeedPhrase={setSeedPhrase}
                  setWallet={setWallet}
                />
              }
            />
            <Route path="/walletView" element={<WalletView />} />
            <Route
              path="/recoveraccount"
              element={
                <RecoverAccount
                  setSeedPhrase={setSeedPhrase}
                  setWallet={setWallet}
                />
              }
            />
            <Route path="/swap" element={<Swap />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/activity" element={<Activity />} />
          </Routes>
          <Footer />
        </MemoryRouter>
      </div>
    </div>
  );
};
export default App;
