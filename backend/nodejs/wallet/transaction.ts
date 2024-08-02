import { KeyObject } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { Wallet } from "./wallet";
type TxInput = {
  timestamp: number;
  amount: number;
  address: string;
  publicKey: string | KeyObject;
  signature: string;
};

type TxOutput = {
  receiveAddress: string;
  receiveAmount: number;
  sourceAddress: string;
  sourceBalance: number; // sourceWallet.balance - receiveAmount
};
class Transaction {
  private _id: string;
  private _txInput: TxInput;
  private _txOutput: TxOutput;
  constructor(
    sender_wallet: Wallet,
    receive_address: string,
    receive_amount: number
  ) {
    this._id = uuidv4().substring(0, 8);
    this.createOutput(sender_wallet, receive_address, receive_amount);
    this.createInput(sender_wallet);
  }
  /*
   *  Structure the input data for the transaction
   *  Sign the transaction, save the sender's public key and address
   */
  createInput(sender_wallet: Wallet) {
    this._txInput = {
      timestamp: Date.now(),
      amount: sender_wallet.balance,
      address: sender_wallet.address,
      publicKey: sender_wallet.publicKey,
      signature: sender_wallet.sign(JSON.stringify(this._txOutput)),
    };
    //throw new Error("Method not implemented.");
  }

  /*
   *   Structure the output data for the transaction
   */
  createOutput(
    sender_wallet: Wallet,
    receive_address: string,
    receive_amount: number
  ) {
    if (receive_amount > sender_wallet.balance) {
      throw new Error("Function not implemented.");
    }
    this._txOutput = {
      receiveAddress: receive_address,
      receiveAmount: receive_amount,
      sourceAddress: sender_wallet.address,
      sourceBalance: sender_wallet.balance - receive_amount,
    };
  }
  public get txInput() {
    return this._txInput;
  }
  public get txOutput() {
    return this._txOutput;
  }
}

export { Transaction, TxInput, TxOutput };
