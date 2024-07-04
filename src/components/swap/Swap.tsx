import { Button, Input, Modal } from "antd";
// import "antd/dist/antd.css";
import "./Swap.css";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
interface Crypto {
  value: string;
  label: string;
  symbol: string;
}

export const Swap = () => {
  const [searchTermFrom, setSearchTermFrom] = useState("");
  const [showModalFrom, setShowModalFrom] = useState(false);
  const [selectedCryptoFrom, setSelectedCryptoFrom] = useState<Crypto | null>(
    null
  );

  const [searchTermTo, setSearchTermTo] = useState("");
  const [showModalTo, setShowModalTo] = useState(false);
  const [selectedCryptoTo, setSelectedCryptoTo] = useState<Crypto | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSearchFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermFrom(event.target.value);
  };

  const handleSelectFrom = (crypto: Crypto) => {
    setSelectedCryptoFrom(crypto);
    setShowModalFrom(false);
  };

  const toggleModalFrom = () => {
    setShowModalFrom(!showModalFrom);
  };

  const handleSearchTo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTermTo(event.target.value);
  };

  const handleSelectTo = (crypto: Crypto) => {
    setSelectedCryptoTo(crypto);
    setShowModalTo(false);
  };

  const toggleModalTo = () => {
    setShowModalTo(!showModalTo);
  };

  const handleSwapToken = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000); 
  };

  const cryptocurrencies: Crypto[] = [
    { value: "ethereum", label: "Ethereum", symbol: "ETH" },
    { value: "bitcoin", label: "Bitcoin", symbol: "BTC" },
    { value: "litecoin", label: "Litecoin", symbol: "LTC" },
  ];

  const filteredCryptosFrom = cryptocurrencies.filter((crypto) =>
    crypto.label.toLowerCase().includes(searchTermFrom.toLowerCase())
  );

  const filteredCryptosTo = cryptocurrencies.filter((crypto) =>
    crypto.label.toLowerCase().includes(searchTermTo.toLowerCase())
  );

  return (
    <div className="swap_main">
      <div className="header1">
        <h1
          style={{ marginTop: "10px", marginLeft: "10rem", cursor: "pointer" }}
        >
          Swap
        </h1>
      </div>
      <div className="main_box">
        <div className="subBox1">
          <div className="box">
            <div
              className="dropdown-container"
              style={{ margin: "0px 0px 0px 5px" }}
            >
              <div className="symbol"></div>
              <div
                className="selected-option"
                onClick={toggleModalFrom}
                style={{ margin: "9px 0px 0px 8px " }}
              >
                {selectedCryptoFrom
                  ? selectedCryptoFrom.label
                  : "Cryptocurrency"}
                <IoIosArrowDown />
              </div>
              <Modal
                visible={showModalFrom}
                onCancel={toggleModalFrom}
                title="Swap From"
              >
                <div className="modal-content">
                  <Input
                    type="text"
                    id="cryptoSearch"
                    placeholder="Search cryptocurrencies..."
                    onChange={handleSearchFrom}
                  />
                  <ul style={{ cursor: "pointer" }}>
                    {filteredCryptosFrom.map((crypto) => (
                      <li
                        key={crypto.value}
                        onClick={() => handleSelectFrom(crypto)}
                      >
                        {crypto.label} ({crypto.symbol})
                      </li>
                    ))}
                  </ul>
                </div>
              </Modal>
            </div>
          </div>
          <Input placeholder="0" className="input_box1" />
          <div className="balance">
            <h4>Balance: </h4>
          </div>
        </div>
        <div className="subBox2">
          <div className="box">
            <div
              className="dropdown-container"
              style={{ margin: "0px 0px 0px 5px", cursor: "pointer" }}
            >
              <div className="symbol"></div>
              <div
                className="selected-option"
                onClick={toggleModalTo}
                style={{ margin: "9px 0px 0px 8px ", cursor: "pointer" }}
              >
                {selectedCryptoTo ? selectedCryptoTo.label : "Select Token"}
                <IoIosArrowDown />
              </div>
              <Modal
                visible={showModalTo}
                onCancel={toggleModalTo}
                title="Swap To"
              >
                <div className="modal-content">
                  <Input
                    type="text"
                    id="cryptoSearch"
                    placeholder="Search cryptocurrencies..."
                    onChange={handleSearchTo}
                  />
                  <ul style={{ cursor: "pointer" }}>
                    {filteredCryptosTo.map((crypto) => (
                      <li
                        key={crypto.value}
                        onClick={() => handleSelectTo(crypto)}
                      >
                        {crypto.label} ({crypto.symbol})
                      </li>
                    ))}
                  </ul>
                </div>
              </Modal>
            </div>
          </div>
        </div>
      </div>
      <div className="swap_button">
        <Button type="primary" onClick={handleSwapToken} disabled={loading}>
          {loading ? (
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          ) : (
            "Swap The Token"
          )}
        </Button>
      </div>
    </div>
  );
};
