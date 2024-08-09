//const { generateKeyPairSync, createSign, createVerify } = import("node:crypto");
import {
  generateKeyPairSync,
  createSign,
  createVerify,
  KeyObject,
} from "node:crypto";

import { v4 as uuidv4 } from "uuid";

import { Transaction, TxInput } from "./transaction";
import { Blockchain } from "../blockchain/blockchain";
import { Block } from "../blockchain/block";
import { STARTING_BALANCE } from "../config";
export class Wallet {
  private _address!: string;
  private _privateKey!: string | KeyObject;
  private _publicKey!: string | KeyObject;
  private _balance!: bigint;
  blockChain: Blockchain;
  constructor(blockChain: Blockchain) {
    this.blockChain = blockChain;
    const key_pair = generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });
    this._privateKey = key_pair.privateKey;
    this._publicKey = key_pair.publicKey;
    this._address = uuidv4().substring(0, 8);
  }

  public get address() {
    return this._address;
  }
  public get privateKey() {
    return this._privateKey;
  }
  public get publicKey() {
    return this._publicKey;
  }
  public get balance() {
    return Wallet.calculateBalance(this.blockChain, this.address);
  }
  static calculateBalance(blockchain: Blockchain, address: string) {
    let balance = BigInt(STARTING_BALANCE);
    if (blockchain.chain.length === 0) {
      return balance;
    }
    for (let idx = 0; idx < blockchain.chain.length; idx++) {
      const block = blockchain.chain[idx];
      if (block.data.length === 0) {
        continue;
      }
      for (let i = 0; i < block.data.length; i++) {
        const tx = block.data[i];
        const keys = Object.keys(tx.txOutput);
        if (tx.txInput!["address"] === address) {
          balance = BigInt(tx.txOutput[address]);
        } else if (keys.includes(address)) {
          balance += BigInt(tx.txOutput[address]);
        }
      }
    }
    return balance;
  }
  sign(data: string) {
    const sign = createSign("SHA256");
    sign.write(data);
    sign.end();
    return sign.sign(this.privateKey, "hex");
  }
  static verify(
    public_key: string | KeyObject,
    data: string,
    signature: string
  ) {
    const verify = createVerify("SHA256");
    verify.write(data);
    verify.end();
    return verify.verify(public_key, signature, "hex");
  }
}
/*
const blockchain = new Blockchain();
const data = { foo: "bar" };
const wallet = new Wallet(blockchain);
const sig = wallet.sign(JSON.stringify(data));
console.log(wallet, sig);
console.log(
  "verified-1: ",
  Wallet.verify(wallet.publicKey, JSON.stringify(data), sig)
);

console.log(
  "verified-2: ",
  Wallet.verify(new Wallet(blockchain).publicKey, JSON.stringify(data), sig)
);
*/
