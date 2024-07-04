interface ChainConfig {
  hex: string;
  name: string;
  rpcUrl: string;
  ticker: string;
}
interface ChainsConfig {
  [key: string]: ChainConfig;
}

const Ethereum = {
  hex: "0x1",
  name: "Ethereum",
  rpcUrl: "",
  ticker: "ETH",
};

const MumbaiTestnet = {
  hex: "0x13881",
  name: "Mumbai Testnet",
  rpcUrl: "",
  ticker: "MATIC",
};

export const CHAINS_CONFIG: ChainsConfig = {
  "0x1": Ethereum,
  "0x13881": MumbaiTestnet,
};
