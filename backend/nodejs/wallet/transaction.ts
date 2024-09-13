import { KeyObject } from "crypto";
import { v4 as uuidv4 } from "uuid";
import { Wallet } from "./wallet";

import { MINING_REWARD_INPUT, MINING_REWARD } from "../config";
import { Blockchain } from "../blockchain/blockchain";
type TxInput = {
  timestamp?: number;
  amount?: bigint;
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
  //private _txOutput: Map<string, bigint> | undefined;
  private _txOutput: any | undefined;
  constructor(
    sender_wallet: Wallet | undefined,
    receive_address: string | undefined,
    receive_amount: number | undefined,
    txInput: TxInput | undefined,
    //txOutput: TxOutput | undefined
    //txOutput: Map<string, bigint> | undefined
    txOutput: any | undefined
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
      signature: sender_wallet!.sign(this._txOutput.toString()),
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
    let output = new Map<string, string>();
    output = new Map<string, string>();
    output.set(receive_address!, receive_amount!.toString());
    output.set(
      sender_wallet?.address!,
      (sender_wallet!.balance - BigInt(receive_amount!)).toString()
    );
    this._txOutput = JSON.parse(JSON.stringify(Object.fromEntries(output)));
    /*
    this._txOutput[receive_address!] = BigInt(receive_amount!);
    this._txOutput[sender_wallet!.address] = BigInt(
      sender_wallet!.balance - receive_amount!
    );
    */

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
    /*
    for (const key of tx.txOutput!.keys()) {
      total = total + tx._txOutput!.get(key)!;
    }
    */
    const values = Object.values(tx.txOutput);
    //console.log("values: ", values);
    values.forEach((value) => {
      //console.log("value: ", value);
      total += BigInt(value as string);
    });
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
        tx.txOutput.toString(),
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
    let txOutput = new Map<string, string>();
    txOutput.set(miner.address!, MINING_REWARD.toString());
    return new Transaction(
      undefined,
      undefined,
      undefined,
      txInput,
      JSON.parse(JSON.stringify(Object.fromEntries(txOutput)))
    );
  }
  public get txInput() {
    return this._txInput;
  }
  public get txOutput() {
    return this._txOutput;
  }
  public get id() {
    return this._id;
  }
}

export { Transaction, TxInput };
/*
function test() {
  const blockchain = new Blockchain();
  const wallet = new Wallet(blockchain);
  const tx = new Transaction(wallet, "receipt", 123, undefined, undefined);
  console.log("tx: ", tx);
  Transaction.validTx(tx);
  wallet.blockChain.addBlock([tx]);
  console.log("balance: ", wallet.balance);
  const rewardTx = Transaction.rewardTransaction(wallet);
  wallet.blockChain.addBlock([rewardTx]);
  console.log("balance: ", wallet.balance);
}

function test2() {
  const blockchain = new Blockchain();
  const wallet = new Wallet(blockchain);
  const rewardTx = Transaction.rewardTransaction(wallet);
  console.log("rewardTx: ", rewardTx);
  
  // wallet = Wallet()
  // wallet.blockchain = blockchain
  // print(f'balance: {wallet.balance}')
  // tx = Transaction.reward_tx(wallet)
  // #reward_block = Block.mine_block(wallet.blockchain.chain[-1], tx.to_json())
  // wallet.blockchain.add_block([tx.to_json()])
  // print(f'balance with rewarding: {wallet.balance}')
  // client_wallet = Wallet()
  // tx = Transaction(client_wallet, wallet.address, 123)
  // wallet.blockchain.add_block([tx.to_json()])
  // print(f'balance with transfer: {wallet.balance}')

  // tx = Transaction(wallet, client_wallet.address, 200)
  // wallet.blockchain.add_block([tx.to_json()])
  // print(f'balance after payment: {wallet.balance}')
  
}
test();
*/
