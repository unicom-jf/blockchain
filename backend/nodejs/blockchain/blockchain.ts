//type ChainData = {};
import { Block } from "./block";

class Blockchain {
  private _chain: Block[] = [];
  constructor() {
    this._chain.push(Block.getGenesisBlock());
  }
  addBlock(data: any) {
    this._chain.push(Block.mine(this._chain[this._chain.length - 1], data));
  }
  public get chain() {
    return this._chain;
  }
}

export { Blockchain };
