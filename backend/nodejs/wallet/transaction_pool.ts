import { Transaction } from "./transaction";

class TransactionPool {
  private _txMap: Map<string, Transaction>;
  constructor() {
    this._txMap = new Map();
  }

  setTx(tx: Transaction) {
    this._txMap.set(tx.id, tx);
  }
  get txPool() {
    return this._txMap;
  }
}

export { TransactionPool };
