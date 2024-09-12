import express from "express";
import cors from "cors";

//import { Wallet } from "../wallet/wallet";
//import { Blockchain } from "../blockchain/blockchain";
//import { TransactionP}
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
      address: "0x1212121212",
      balance: BigInt(1234).toString(),
    })
  );
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT} ...`);
});
