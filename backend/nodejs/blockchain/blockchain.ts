//type ChainData = {};
import { MINING_REWARD_INPUT } from "../config";
import { Transaction } from "../wallet/transaction";
import { Wallet } from "../wallet/wallet";
import { Block, GENESIS_BLOCK } from "./block";

class Blockchain {
  private _chain: Block[] = [];
  constructor() {
    this._chain.push(Block.getGenesisBlock());
  }
  addBlock(data: any) {
    this._chain.push(Block.mine(this._chain[this._chain.length - 1], data));
  }
  /*
   * start with genesis block
   * block must be formatted correctly
   *
   */
  static isValidChain(chain: Block[]) {
    const keys = Object.keys(chain[0]);
    keys.forEach((key) => {
      if (chain[0][key as keyof Block] !== GENESIS_BLOCK[key as keyof Block]) {
        throw "the genesis block must be valid";
      }
    });

    for (let i = 1; i < chain.length - 1; i++) {
      Block.blockIsValid(chain[i - 1], chain[i]);
    }
    Blockchain.validTransactionChain(chain);
  }
  static validTransactionChain(chain: Block[]) {
    let txIds = new Set();
    for (let i = 0; i < chain.length; i++) {
      let foundRewardTx = false;
      for (let j = 0; j < chain[i].data.length; j++) {
        const tx = chain[i].data[j];
        if (txIds.has(tx.id)) {
          throw `tx ${tx.id} is not unique`;
        }
        txIds.add(tx.id);

        if (tx.txInput?.address === MINING_REWARD_INPUT) {
          if (foundRewardTx) {
            throw (
              "there can be only one mining reward per block, check the block with hash: " +
              chain[i].hash
            );
          }
          foundRewardTx = true;
        } else {
          let historic_chain = new Blockchain();
          historic_chain.chain = chain.slice(0, i);
          const historic_balance = Wallet.calculateBalance(
            historic_chain,
            tx.txInput!.address
          );
          if (historic_balance != tx.txInput?.amount) {
            throw "tx: " + tx.id + " has an invalid amount";
          }
        }
        Transaction.validTx(tx);
      }
    }
  }
  public get chain() {
    return this._chain;
  }
  public set chain(chain: Block[]) {
    this._chain = chain;
  }
}

export { Blockchain };
/*
let blockchain = new Blockchain();
try {
  Blockchain.isValidChain(blockchain.chain);
} catch (e) {
  console.log("err: ", e);
}
*/
