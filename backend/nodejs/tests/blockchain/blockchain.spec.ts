import { GENESIS_BLOCK } from "../../blockchain/block";
import { Blockchain } from "../../blockchain/blockchain";
import { Wallet } from "../../wallet/wallet";
import { Transaction } from "../../wallet/transaction";
import assert from "assert";
describe("Test blockchain", () => {
  let blockchain: Blockchain;
  beforeEach(() => {
    blockchain = new Blockchain();
    for (let i = 0; i < 3; i++) {
      blockchain.addBlock(
        new Transaction(
          new Wallet(new Blockchain()),
          "receipt",
          i,
          undefined,
          undefined
        )
      );
    }
  });

  it("test genesis block", () => {
    assert(blockchain.chain[0].hash === GENESIS_BLOCK.hash);
  });

  it("test add block", () => {
    //const data = "block data"
    let data: any[] = [];
    data.push("block_data");
    blockchain.addBlock(data);
    assert(blockchain.chain[blockchain.chain.length - 1].data === data);
  });

  it("test is_valid_chain", () => {
    assert.throws(() => {
      blockchain.chain[0].hash = "000111";
      Blockchain.isValidChain(blockchain.chain);
    }, /the genesis block must be valid/);
  });

  it("test_is_valid_transaction_chain", () => {
    Blockchain.validTransactionChain(blockchain.chain);
  });

  it("test_is_valid_tx_chain_duplicate_tx", () => {
    const tx = new Transaction(
      new Wallet(new Blockchain()),
      "receipt",
      1,
      undefined,
      undefined
    );
    blockchain.addBlock([tx, tx]);
    assert.throws(
      () => Blockchain.validTransactionChain(blockchain.chain),
      /is not unique/
    );
  });

  it("test_is_valid_tx_chain_multiple_rewarding", () => {
    const tx1 = Transaction.rewardTransaction(new Wallet(new Blockchain()));
    const tx2 = Transaction.rewardTransaction(new Wallet(new Blockchain()));
    blockchain.addBlock([tx1, tx2]);
    assert.throws(
      () => Blockchain.validTransactionChain(blockchain.chain),
      /only one mining reward per block/
    );
  });

  it("test_is_valid_tx_chain_bad_tx", () => {
    const wallet = new Wallet(new Blockchain());
    const tx = new Transaction(wallet, "receipt", 1, undefined, undefined);
    //tx.txInput!.signature = wallet.sign(tx.txOutput.toString());
    tx.txInput!.signature = new Wallet(new Blockchain()).sign(
      tx.txOutput.toString()
    );
    //tx.txInput!.signature = "000aaa";
    blockchain.addBlock([tx]);
    assert.throws(
      () => Blockchain.validTransactionChain(blockchain.chain),
      /Invalid signature/
    );
  });

  it("test_is_valid_tx_chain_bad_historic_balance", () => {
    const wallet = new Wallet(new Blockchain());
    let tx = new Transaction(wallet, "receipt", 1, undefined, undefined);
    tx.txInput!.amount = BigInt(9);
    tx.txOutput[wallet.address] = BigInt(10);
    blockchain.addBlock([tx]);
    assert.throws(
      () => Blockchain.validTransactionChain(blockchain.chain),
      /has an invalid amount/
    );
  });
});
