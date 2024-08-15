import assert from "assert";

import { Block, GENESIS_BLOCK } from "../../blockchain/block";
import { MINE_RATE } from "../../config";
import { sleep } from "../../utils/tools";
import { crypto_hash } from "../../utils/crypto_hash";
import { Transaction } from "../../wallet/transaction";
import { Wallet } from "../../wallet/wallet";
import { Blockchain } from "../../blockchain/blockchain";
describe("Test block", () => {
  it("TestAdjustDifficulty", async function () {
    //for mocha, default timeout: 2000ms
    this.timeout(3000);
    const genesis_block = Block.getGenesisBlock();
    const block_1 = Block.mine(genesis_block, [{ data: "block_1" }]);
    const block_2 = Block.mine(block_1, [{ data: "block_2" }]);
    //should be harder
    assert(
      block_1.difficulty + 1 === block_2.difficulty,
      "TestAdjustDifficulty: should be harder"
    );
    await sleep(MINE_RATE + 1);
    const block_3 = Block.mine(block_2, [{ data: "block_3" }]);
    //should be easier
    assert(
      block_2.difficulty - 1 === block_3.difficulty,
      "TestAdjustDifficulty: should be easier"
    );
  });
  it("TestBlockIsValid", () => {
    const genesis_block = Block.getGenesisBlock();
    //const data = [{ data: "blodk_data" }];
    const tx = new Transaction(
      new Wallet(new Blockchain()),
      "receipt",
      1,
      undefined,
      undefined
    );
    const block = Block.mine(genesis_block, [tx]);
    assert(block.data[0] === tx, "TestBlockIsValid failed");
    const hash = crypto_hash(
      block.timestamp,
      genesis_block.hash,
      tx.txOutput,
      block.difficulty,
      block.nonce
    );
    assert(hash === block.hash);
  });

  describe("test genesis block", () => {
    const block = Block.getGenesisBlock();
    assert(block instanceof Block);
    const keys = Object.keys(block);
    keys.forEach((key) => {
      assert(block[key as keyof Block] === GENESIS_BLOCK[key as keyof Block]);
    });
  });

  describe("test is_valid_blok", () => {
    let last_block: Block;
    let block: Block;
    beforeEach(() => {
      last_block = Block.mine(Block.getGenesisBlock(), ["foo"]);
      block = Block.mine(last_block, ["bar"]);
    });
    it("bad lastHash", () => {
      block.lastHash = "abcdef";
      assert.throws(
        () => Block.blockIsValid(last_block, block),
        /last_hash must be correct/
      );
    });
    it("bad pow", () => {
      block.hash = "abcdef"; // + block.hash;
      assert.throws(
        () => Block.blockIsValid(last_block, block),
        /The POW requirement is not met/
      );
    });

    it("jump difficulty", () => {
      last_block.difficulty = 100;
      assert.throws(
        () => Block.blockIsValid(last_block, block),
        /difficulty must only adjust by 1/
      );
    });
    it("bad hash", () => {
      block.hash = block.hash + "123";
      assert.throws(
        () => Block.blockIsValid(last_block, block),
        /hash must be correct/
      );
    });
  });
});
