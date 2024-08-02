type ChainData = {};
class BlockChain {
  private _chain: ChainData[] = [];
  public get chain() {
    return this._chain;
  }
}

export { BlockChain, ChainData };
