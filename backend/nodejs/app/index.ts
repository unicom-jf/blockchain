import express from "express";
import cors from "cors";

import { Wallet } from "../wallet/wallet";
import { Blockchain } from "../blockchain/blockchain";
import { TransactionPool } from "../wallet/transaction_pool";
import { Transaction } from "../wallet/transaction";

let blockchain = new Blockchain();
let wallet = new Wallet(blockchain);
let txPool = new TransactionPool();

function seedBlockChain() {
  for (let i = 0; i < 10; i++) {
    blockchain.addBlock([
      new Transaction(
        new Wallet(new Blockchain()),
        new Wallet(new Blockchain()).address,
        //1,
        Math.ceil(Math.random() * 100) + 1, // 1-101
        undefined,
        undefined
      ),
      new Transaction(
        new Wallet(new Blockchain()),
        new Wallet(new Blockchain()).address,
        //1,
        Math.ceil(Math.random() * 100) + 1, // 1-101
        undefined,
        undefined
      ),
    ]);
  }
}

function seedTxPool() {
  for (let i = 0; i < 3; i++) {
    txPool.setTx(
      new Transaction(
        new Wallet(new Blockchain()),
        new Wallet(new Blockchain()).address,
        //1,
        Math.ceil(Math.random() * 100) + 1, // 1-101
        undefined,
        undefined
      )
    );
  }
}

seedBlockChain();
seedTxPool();
const app = express();
const PORT = 5000;

//app.use(cors({ origin: "domain1" }));
//app.use(cors({ origin: ["domain1", "domain2" }));
app.use(cors({ origin: "*" }));
app.get("/", (req, res) => {
  //res.send("hello, from express");
  res.send(JSON.stringify({ info: "hello, from express" }));
});

app.get("/wallet/info", (req, res) => {
  //res.send("hello, from express");

  res.send(
    JSON.stringify({
      address: wallet.address,
      balance: BigInt(wallet.balance).toString(),
    })
  );
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT} ...`);
});
