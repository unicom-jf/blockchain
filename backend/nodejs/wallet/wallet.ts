//const { generateKeyPairSync, createSign, createVerify } = import("node:crypto");
import {
  generateKeyPairSync,
  createSign,
  createVerify,
  KeyObject,
} from "node:crypto";

import { v4 as uuidv4 } from "uuid";

import { Transaction, TxInput, TxOutput } from "./transaction";
import { BlockChain, ChainData } from "../blockchain/blockchain";
import { STARTING_BALANCE } from "../config";
export class Wallet {
  private _address!: string;
  private _privateKey!: string | KeyObject;
  private _publicKey!: string | KeyObject;
  private _balance!: number;
  private _blockChain: BlockChain;
  constructor(blockChain: BlockChain) {
    this._blockChain = blockChain;
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
    return Wallet.calculateBalance(this._blockChain, this.address);
  }
  static calculateBalance(blockchain: BlockChain, address: string) {
    if (blockchain.chain.length === 0) {
      return STARTING_BALANCE;
    }
    return 0;
    //throw new Error("Method not implemented.");
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

const blockchain = new BlockChain();
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
