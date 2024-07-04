import { useEffect, useState } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { CHAIN_NAMESPACES, IProvider, WALLET_ADAPTERS } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import "./Login.css";
import RPC from "../../web3RPC";
import { useNavigate } from "react-router-dom";
import Home from "../home/Home";
import { ethers } from "ethers";
import { Button } from "antd";

const clientId = process.env.REACT_APP_CLIENT_ID || "";

function Login() {
  const [web3auth, setWeb3auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(false);
  const [isFullPage, setIsFullPage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const chainConfig = {
          chainNamespace: CHAIN_NAMESPACES.EIP155,
          chainId: process.env.REACT_APP_CHAIN_ID || "",
          rpcTarget: process.env.REACT_APP_RPC_TARGET || "",
          displayName: process.env.REACT_APP_DISPLAY_NAME || "",
          blockExplorer: process.env.REACT_APP_BLOCK_EXPLORER || "",
          ticker: process.env.REACT_APP_TICKER || "",
          tickerName: process.env.REACT_APP_TICKER_Name || "",
        };
        const web3auth = new Web3AuthNoModal({
          clientId,
          chainConfig,
          web3AuthNetwork: "testnet",
        });

        setWeb3auth(web3auth);
        // console.log("mayur", chainConfig);
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        const openloginAdapter = new OpenloginAdapter({
          // adapterSettings: {
          //   uxMode: "popup",
          //   redirectUrl: chrome.runtime.getURL("/home"),
          //   replaceUrlOnRedirect: false,
          // },
          // loginSettings: {
          //   extraLoginOptions: {
          //     display: "page",
          //   },
          // },
          privateKeyProvider,
        });

        web3auth.configureAdapter(openloginAdapter);
        // setWeb3auth(web3auth);

        await web3auth.init();
        setProvider(web3auth.provider);
        if (web3auth.connected) {
          setLoggedIn(true);

          const address = localStorage.getItem("Address");
          const seedPhrase = localStorage.getItem("seedPhrase");

          if (address && seedPhrase) {
            navigate("/walletView");
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    init();

    if (window.innerWidth > 400) setIsFullPage(true);
  }, []);

  const login = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const web3authProvider = await web3auth.connectTo(
      WALLET_ADAPTERS.OPENLOGIN,
      {
        loginProvider: "google",
      }
    );

    localStorage.setItem("Provider", JSON.stringify(web3authProvider));
    setProvider(web3authProvider);
  };

  const getAccounts = async () => {
    if (!provider) {
      console.log("provider not initialised");
      return;
    }

    const rpc = new RPC(provider);
    const address = await rpc.getAccounts();
    localStorage.setItem("Address", address);

    const privateKey = await rpc.getPrivateKey();
    localStorage.setItem("privateKey", privateKey);
    localStorage.setItem("web3PrivateKey", privateKey);

    const mnemonics: any = ethers.Wallet.createRandom().mnemonic?.phrase;
    localStorage.setItem("seedPhrase", mnemonics);

    navigate("/walletView");
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("Provider not initialized yet");
      return;
    }

    const rpc = new RPC(provider);
    const balance = await rpc.getBalance();
    const balanceString = balance.toString();
    localStorage.setItem("balance", balanceString);
  };
  getBalance();

  const loggedInView = (
    <>
      <Home onButtonClick={getAccounts} />
    </>
  );

  const unloggedInView = (
    <>
      {!isFullPage ? (
        <div className="login_button">
          <div className="google_logo"></div>
          <button
            style={{ border: "none", backgroundColor: "none" }}
            onClick={() => chrome.tabs.create({ url: "index.html" })}
            className="card_login"
          >
            Login
          </button>
        </div>
      ) : (
        <div className="login_button">
          <div className="google_logo"></div>
          <button onClick={login} className="card_login">
            Login
          </button>
        </div>
      )}
    </>
  );

  return loggedIn ? (
    <div className="container">
      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
    </div>
  ) : (
    <div className="container">
      <div className="ta_image"></div>
      <h1 className="title">
        <a target="_blank" href="https://techalchemy.com" rel="noreferrer">
          Tech Alchemy{" "}
        </a>
        {unloggedInView && " Web3 Wallet"}
      </h1>
      <div className="grid">{loggedIn ? loggedInView : unloggedInView}</div>
    </div>
  );
}

export default Login;
