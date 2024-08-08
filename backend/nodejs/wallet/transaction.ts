import { KeyObject } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { Wallet } from "./wallet";

import { MINING_REWARD_INPUT, MINING_REWARD } from "../config";
import { BlockChain } from "../blockchain/blockchain";
type TxInput = {
  timestamp?: number;
  amount?: number;
  address: string;
  publicKey?: string | KeyObject;
  signature?: string;
};

/*
type TxOutput = {
  receiveAddress: string;
  receiveAmount: number;
  sourceAddress?: string;
  sourceBalance?: number; // sourceWallet.balance - receiveAmount
};
*/
class Transaction {
  private _id: string;
  private _txInput: TxInput | undefined;
  private _txOutput: Map<string, bigint> | undefined;
  constructor(
    sender_wallet: Wallet | undefined,
    receive_address: string | undefined,
    receive_amount: number | undefined,
    txInput: TxInput | undefined,
    //txOutput: TxOutput | undefined
    txOutput: Map<string, bigint> | undefined
  ) {
    this._id = uuidv4().substring(0, 8);
    if (txOutput === undefined) {
      this.createOutput(sender_wallet, receive_address, receive_amount);
    } else {
      this._txOutput = txOutput;
    }
    if (txInput === undefined) {
      this.createInput(sender_wallet);
    } else {
      this._txInput = txInput;
    }
  }
  /*
   *  Structure the input data for the transaction
   *  Sign the transaction, save the sender's public key and address
   */
  createInput(sender_wallet: Wallet | undefined) {
    this._txInput = {
      timestamp: Date.now(),
      amount: sender_wallet!.balance,
      address: sender_wallet!.address,
      publicKey: sender_wallet!.publicKey,
      signature: sender_wallet!.sign(JSON.stringify(this._txOutput)),
    };
    //throw new Error("Method not implemented.");
  }

  /*
   *   Structure the output data for the transaction
   */
  createOutput(
    sender_wallet: Wallet | undefined,
    receive_address: string | undefined,
    receive_amount: number | undefined
  ) {
    if (receive_amount! > sender_wallet!.balance) {
      throw new Error("out of balance.");
    }

    this._txOutput = new Map<string, bigint>();
    this._txOutput.set(receive_address!, BigInt(receive_amount!));
    this._txOutput.set(
      sender_wallet?.address!,
      BigInt(sender_wallet!.balance - receive_amount!)
    );
    // let balance = sender_wallet.balance;
    // if (receive_address !== MINING_REWARD_INPUT["address"]) {
    //   balance = sender_wallet.balance - receive_amount;
    // }
    /*
    this._txOutput = {
      receiveAddress: receive_address!,
      receiveAmount: receive_amount!,
      sourceAddress: sender_wallet!.address,
      sourceBalance: sender_wallet!.balance - receive_amount!,
    };
    */
  }
  /*
   * Validate a tx
   * throw exception if invalid
   */
  static validTx(tx: Transaction) {
    let total = BigInt("0");
    for (const key of tx.txOutput!.keys()) {
      total = total + tx._txOutput!.get(key)!;
    }
    if (tx.txInput!["address"] === MINING_REWARD_INPUT) {
      if (total != BigInt(MINING_REWARD)) {
        throw "Invalid mining reward";
      }
      return;
    }
    if (total != BigInt(tx.txInput!["amount"]!)) {
      throw "Invalid output values";
    }

    if (
      Wallet.verify(
        tx.txInput!["publicKey"]!,
        JSON.stringify(tx.txOutput),
        tx.txInput!["signature"]!
      ) === false
    ) {
      throw "Invalid signature";
    }
  }
  /*
   * Generate a transaction that rewards the miner
   */
  static rewardTransaction(miner: Wallet) {
    const txInput: TxInput = {
      address: MINING_REWARD_INPUT,
    };
    let txOutput = new Map<string, bigint>();
    txOutput.set(miner.address!, BigInt(MINING_REWARD));
    return new Transaction(undefined, undefined, undefined, txInput, txOutput);
  }
  public get txInput() {
    return this._txInput;
  }
  public get txOutput() {
    return this._txOutput;
  }
}

export { Transaction, TxInput };

function test() {
  const blockchain = new BlockChain();
  const wallet = new Wallet(blockchain);
  const rewardTx = Transaction.rewardTransaction(wallet);
  console.log("rewardTx: ", rewardTx);

  //rewardTx.txOutput!["receiveAmount"] = 1;
  let txInput, txOutput;
  let tx = new Transaction(wallet, "receipt", 15, txInput, txOutput);
  console.log("tx: ", tx);
  //tx.txOutput!["receiveAddress"] = "111";
  Transaction.validTx(tx);

  Transaction.validTx(rewardTx);
}

test();
