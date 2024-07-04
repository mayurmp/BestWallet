import {
  Avatar,
  Button,
  Input,
  List,
  Select,
  Spin,
  Tabs,
  Tooltip,
  message,
  Modal,
} from "antd";
import "./WalletView.css";
import { useNavigate } from "react-router-dom";
import logo from "../../logo.svg";
import { useEffect, useState } from "react";
import Header from "../header/Header";
import { ethers } from "ethers";
import React from "react";
import Web3 from "web3";
import ethSepolia from "../../images/ethSepolis.png";
import eth from "../../images/ethereum-log.png";
import chainlink from "../../images/chainlink.png";
import swap from "../../images/uniswap.png";
import polygon from "../../images/Polygon_Blockchain_Matic.png";

declare global {
  interface Window {
    ethereum?: any;
    web3?: any;
  }
}

export const WalletView = (wallet: any, selectedChain: any) => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<
    Array<{
      symbol: string;
      name: string;
      balance: number;
      decimals: number;
      image: any;
    }>
  >();

  const [selectedAccountIndex, setSelectedAccountIndex] = useState<
    number | null
  >(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [balance, setBalance] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = React.useState<string>("");
  const [provider, setProvider] = useState<any>("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState<string>("");
  const [web3Instance, setWeb3] = useState<Web3 | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [transactionInfo, setTransactionInfo] = useState<any>({});
  const [newAccountModalVisible, setNewAccountModalVisible] = useState(false);
  const [accounts, setAccounts] = useState<
    { address: string; privateKey: string | null }[]
  >([]);

  let privateKey: any = localStorage.getItem("privateKey");

  const handleRecipientChange = (value: string) => {
    setRecipientAddress(value);
  };

  const handleAmountChange = (value: string) => {
    setTransferAmount(value);
  };

  const createNewAccount = () => {
    const randomWallet = ethers.Wallet.createRandom();
    const newAccount = {
      address: randomWallet.address,
      privateKey: randomWallet.privateKey,
    };

    setAccounts((prevAccounts) => [...prevAccounts, newAccount]);

    const storedAccountsString = localStorage.getItem("Accounts");
    const storedAccounts = storedAccountsString
      ? JSON.parse(storedAccountsString)
      : [];

    const updatedAccounts = [...storedAccounts, newAccount];
    localStorage.setItem("Accounts", JSON.stringify(updatedAccounts));
  };

  const handleAccountChange = (selectedAddress: string) => {
    const selectedAccount = accounts.find(
      (account) => account.address === selectedAddress
    );
    if (selectedAccount) {
      setUserAddress(selectedAccount.address);
    }
  };

  const getBalance = async () => {
    if (!web3Instance) {
      console.error(
        "Web3 instance not initialized or user address not available"
      );
      return;
    }

    try {
      const balance = await web3Instance.eth.getBalance(userAddress);
      const formattedBalance = web3Instance.utils.fromWei(balance, "ether");
      setBalance(parseFloat(formattedBalance));
      localStorage.setItem("balance", formattedBalance);
    } catch (error) {
      console.error("Error getting balance:", error);
    }
  };
  getBalance();

  const estimateGas = async () => {
    if (!web3Instance) {
      console.error("Web3 instance not initialized");
      return null;
    }

    let transactionObject: any = {
      from: userAddress,
      to: recipientAddress,
      value: web3Instance.utils.toWei(transferAmount, "ether"),
    };

    try {
      let gasEstimate = await web3Instance.eth.estimateGas(transactionObject);
      return gasEstimate;
    } catch (error) {
      console.error("Error estimating gas:", error);
      return null;
    }
  };

  const sendTransaction = async () => {
    if (!web3Instance) {
      console.error("Web3 instance not initialized");
      return;
    }

    if (!recipientAddress || !transferAmount) {
      message.error("Recipient address and transfer amount are required");
    }

    try {
      setProcessing(true);

      let gasEstimate = await estimateGas();
      let gasPrice = await web3Instance.eth.getGasPrice();
      let transactionObject: any = {
        from: userAddress,
        to: recipientAddress,
        value: web3Instance.utils.toWei(transferAmount, "ether"),
        gas: gasEstimate,
        gasPrice,
      };

      let signedTx = await web3Instance.eth.accounts.signTransaction(
        transactionObject,
        privateKey
      );
      let transactionHash = await web3Instance.eth.sendSignedTransaction(
        signedTx.rawTransaction
      );

      localStorage.setItem("Amount", transferAmount);

      const existingTransactionsString = localStorage.getItem("Transactions");
      const existingTransactions = existingTransactionsString
        ? JSON.parse(existingTransactionsString)
        : [];

      const newTransactionDetails = {
        blockHash: transactionHash.blockHash.toString(),
        blockNumber: Number(transactionHash.blockNumber),
        from: transactionHash.from,
        to: transactionHash.to,
        Amount: transferAmount,
        transactionHash: transactionHash.transactionHash,
      };

      existingTransactions.push(newTransactionDetails);

      localStorage.setItem(
        "Transactions",
        JSON.stringify(existingTransactions)
      );

      setTransactionInfo(newTransactionDetails);
      setModalVisible(true);
      setTransferAmount("");
      setRecipientAddress("");
    } catch (error: any) {
      if (
        error.message &&
        error.message.includes("insufficient funds for transfer")
      ) {
        message.error("Insufficient funds for transfer");
      } else if (
        error.message &&
        error.message.includes("reverted by the EVM")
      ) {
        try {
          if (error.transactionHash) {
            const receipt = await web3Instance.eth.getTransactionReceipt(
              error.transactionHash
            );
            console.error("Transaction Receipt:", receipt);
          } else {
            console.error(
              "Transaction hash not available in the error object."
            );
          }
        } catch (receiptError) {
          console.error("Error getting transaction receipt:", receiptError);
        }
      } else {
        console.error("Unexpected error:", error);
        if (
          error.message &&
          error.message.includes("replacement transaction underpriced")
        ) {
          message.error("Replacement transaction underpriced");
        }
      }
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    const initWeb3 = async () => {
      const web3Provider = process.env.REACT_APP_PROVIDER || "";
      const web3Instance = new Web3(
        new Web3.providers.HttpProvider(web3Provider)
      );
      setWeb3(web3Instance);

      setTokens([
        {
          symbol: "ethSepolia",
          name: "Ethereum Sepolia",
          balance: 10000000,
          decimals: 18,
          image: ethSepolia,
        },
        {
          symbol: "ETH",
          name: "Ethereum",
          balance: 10000000,
          decimals: 18,
          image: eth,
        },
        {
          symbol: "LINK",
          name: "Chainlink",
          balance: 10000000,
          decimals: 18,
          image: chainlink,
        },
        {
          symbol: "UNI",
          name: "Uniswap",
          balance: 10000000,
          decimals: 18,
          image: swap,
        },
        // {
        //   symbol: "MATICS",
        //   name: "Polygon",
        //   balance: 10000000,
        //   decimals: 18,
        //   image: polygon,
        // },
      ]);
    };

    initWeb3();
  }, []);

  useEffect(() => {
    const storedUserAddress = localStorage.getItem("Address");
    if (storedUserAddress) {
      setUserAddress(storedUserAddress);
    }

    const storedAccountsString = localStorage.getItem("Accounts") ?? "[]";
    const storedAccounts = JSON.parse(storedAccountsString);
    setAccounts(storedAccounts);

    const storedProviderString = localStorage.getItem("Provider");
    if (storedProviderString) {
      const storedProvider = JSON.parse(storedProviderString);
      setProvider((prevProvider: any) => {
        return storedProvider;
      });
    }

    const recoveredAddress = localStorage.getItem("recoveredAddress");
    const recoverPrivate = localStorage.getItem("privateKey");

    if (recoveredAddress) {
      const recoveredAccount = {
        address: recoveredAddress,
        privateKey: recoverPrivate,
      };

      const accountExists = storedAccounts.some(
        (account: { address: string }) =>
          account.address === recoveredAccount.address
      );

      if (!accountExists) {
        setAccounts((prevAccounts) => [...prevAccounts, recoveredAccount]);

        localStorage.setItem(
          "Accounts",
          JSON.stringify([...storedAccounts, recoveredAccount])
        );
      }
    }

    const web3Account = localStorage.getItem("Address");
    if (web3Account) {
      const accountAddress = {
        address: web3Account,
        privateKey: privateKey,
      };

      const accountExists = storedAccounts.some(
        (account: { address: string }) =>
          account.address === accountAddress.address
      );

      if (!accountExists) {
        const updatedAccounts = [...storedAccounts, accountAddress];
        setAccounts(updatedAccounts);

        localStorage.setItem("Accounts", JSON.stringify(updatedAccounts));
      }
    }
  }, []);

  const changePrivateKey = (selectedAddress: string) => {
    const selectedAccount = accounts.find(
      (account) => account.address === selectedAddress
    );

    if (selectedAccount) {
      localStorage.setItem("privateKey", selectedAccount.privateKey as any);

      privateKey = selectedAccount.privateKey;
    }
  };

  const items = [
    {
      key: "3",
      label: "Tokens",
      children: (
        <>
          {tokens ? (
            <>
              <List
                bordered
                itemLayout="horizontal"
                dataSource={tokens}
                renderItem={(item, index) => (
                  <List.Item style={{ textAlign: "left" }}>
                    <List.Item.Meta
                      avatar={<Avatar src={item.image} />}
                      title={item.symbol}
                      description={item.name}
                    />
                    <div>
                      {(
                        Number(item.balance) /
                        18 ** Number(item.decimals)
                      ).toFixed(2)}{" "}
                      Tokens
                    </div>
                  </List.Item>
                )}
              ></List>
            </>
          ) : (
            <>
              <span>You seem to not have any tokens yet</span>
              <p className="frontPageButton">
                Find Alt Coin Gens:{" "}
                <a
                  href="https://techalchemy.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  techalchemy
                </a>
              </p>
            </>
          )}
        </>
      ),
    },

    {
      key: "2",
      label: `NFTs`,
      children: (
        <>
          <span>You seem to not have any NFTs yet</span>
          <p className="frontPageBottom">
            Find Alt Coin Gems:{" "}
            <a href="https://techalchemy.com/" target="_blank" rel="noreferrer">
              Tech Alchemy
            </a>
          </p>
        </>
      ),
    },

    {
      key: "1",
      label: `Transfer`,
      children: (
        <div className="token">
          <h3 style={{ textAlign: "center" }}>Balance</h3>
          <h4 style={{ textAlign: "center" }}>
            {balance.toFixed(4)} SepoliaETH
          </h4>
          <div className="sendRow">
            <p style={{ width: "90px", textAlign: "left" }}> To:</p>
            <Input
              placeholder="0x..."
              value={recipientAddress}
              onChange={(e) => handleRecipientChange(e.target.value)}
            />
          </div>
          <div className="sendRow">
            <p style={{ width: "90px", textAlign: "left" }}> Amount:</p>
            <Input
              placeholder="Native tokens you wish to send..."
              value={transferAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
          </div>
          <Button
            style={{ width: "100%", marginTop: "10px" }}
            // type="primary"
            onClick={sendTransaction}
          >
            {processing ? <Spin /> : "Send Tokens"}
          </Button>
        </div>
      ),
    },
  ];
  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleSelectAccount = (value: string, index: number) => {
    setSelectedAccountIndex(index);
    handleAccountChange(value);
    setNewAccountModalVisible(false);
    changePrivateKey(value);
  };

  return (
    <div className="walletView">
      <div
        style={{
          marginLeft: "3rem",
        }}
      >
        <Header />
      </div>
      <div className="accountDropdown">
        <Button
          onClick={() => setNewAccountModalVisible(true)}
          style={{ marginLeft: "1rem" }}
        >
          {selectedAccountIndex !== null
            ? `Account ${selectedAccountIndex + 1}`
            : "Accounts"}
        </Button>

        <Modal
          title="Create New Account"
          visible={newAccountModalVisible}
          onCancel={() => setNewAccountModalVisible(false)}
          footer={null}
          className="modal"
        >
          <div>
            <Button onClick={createNewAccount} style={{ marginBottom: "1rem" }}>
              Create New Account
            </Button>

            <Select
              style={{ width: "100%", height: "4rem" }}
              defaultValue={userAddress || accounts[0]?.address}
              onChange={(value) =>
                handleSelectAccount(
                  value,
                  accounts.findIndex((account) => account.address === value)
                )
              }
            >
              {accounts.map((account, index) => (
                <Select.Option
                  key={account.address}
                  value={account.address}
                  onCancel={() => setNewAccountModalVisible(false)}
                >
                  {`Account ${index + 1} `}
                  <br /> {account.address.slice(0, 4)}...
                  {account.address.slice(38)}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Modal>
      </div>

      <div className="walletName">Wallet</div>
      <Tooltip title={userAddress}>
        <div style={{ marginLeft: "9rem" }}>
          {userAddress &&
            `${userAddress.slice(0, 4)}...${userAddress.slice(38)}`}
        </div>
      </Tooltip>
      <div style={{ overflowX: "auto" }}>
        <Tabs defaultActiveKey="1" items={items} centered />
      </div>
      <Button className="backButton" onClick={() => navigate("/home")}>
        Back
      </Button>

      <Modal
        title="Transaction Successful"
        visible={modalVisible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
      >
        <p>From: {transactionInfo.from}</p>
        <p>To: {transactionInfo.to}</p>
        <p>Amount: {transactionInfo.Amount}</p>
      </Modal>
    </div>
  );
};