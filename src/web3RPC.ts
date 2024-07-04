import { IProvider } from "@web3auth/base";
import Web3 from "web3";

export default class EthereumRpc {
  private provider: IProvider;
  constructor(provider: IProvider) {
    this.provider = provider;
  }

  async getAccounts(): Promise<any> {
    try {
      const web3 = new Web3(this.provider as any);

      const address = await web3.eth.getAccounts();

      return address;
    } catch (error) {
      return error;
    }
  }

  async getBalance(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any);
      const address = (await web3.eth.getAccounts())[0];
      const balance = web3.utils.fromWei(
        await web3.eth.getBalance(address),
        "ether"
      );
      return balance;
    } catch (error) {
      return error as string;
    }
  }

  async getPrivateKey(): Promise<any> {
    try {
      const privateKey = await this.provider.request({
        method: "eth_private_key",
      });

      return privateKey;
    } catch (error) {
      return error as string;
    }
  }
}
