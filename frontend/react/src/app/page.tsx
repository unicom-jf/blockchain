"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import { API_BASE_URL } from "./config";
// class WalletInfo {
//   address: string = "";
//   balance: bigint = BigInt(0);
// }
export default function App() {
  const [walletInfo, setWalletInfo] = useState({
    address: "",
    balance: BigInt(0),
  });

  useEffect(() => {
    fetch(`${API_BASE_URL}/wallet/info`)
      .then((response) => response.json())
      .then((json) => setWalletInfo(json));
  }, []);

  const { address, balance } = walletInfo;

  return (
    <div className="App">
      <h3>Welcome to pychain</h3>
      <br />
      <div className="NavBar">
        <Link className="LinkBlock" href="/blockchain">
          Blockchain
        </Link>
        <Link className="LinkBlock" href="/conduct-transaction">
          Conduct a Transaction
        </Link>
        <Link className="LinkBlock" href="/transaction-pool">
          Transaction Pool
        </Link>
      </div>
      <br />
      <div className="WalletInfo">
        <div>Address: {address}</div>
        <div>Balance: {balance}</div>
      </div>
    </div>
  );
}

//export default function Home() {
// export default function Home() {
//   return (
//     <div>
//       <p>main of app</p>
//     </div>
//   );
// }
