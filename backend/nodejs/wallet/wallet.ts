//const { generateKeyPairSync, createSign, createVerify } = import("node:crypto");
import {
  generateKeyPairSync,
  createSign,
  createVerify,
  KeyObject,
} from "node:crypto";
export class Wallet {
  address!: string;
  privateKey!: string | KeyObject;
  publicKey!: string | KeyObject;
  constructor() {
    const key_pair = generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });
    this.privateKey = key_pair.privateKey;
    this.publicKey = key_pair.publicKey;
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
const data = { foo: "bar" };
const wallet = new Wallet();
const sig = wallet.sign(JSON.stringify(data));
console.log(wallet, sig);
console.log(
  "verified-1: ",
  Wallet.verify(wallet.publicKey, JSON.stringify(data), sig)
);

console.log(
  "verified-2: ",
  Wallet.verify(new Wallet().publicKey, JSON.stringify(data), sig)
);
*/
