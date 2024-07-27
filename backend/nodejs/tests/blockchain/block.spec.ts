import assert from "assert";

import { Block } from "../../blockchain/block";
import { MINE_RATE } from "../../config";
import { sleep } from "../../utils/tools";
import { crypto_hash } from "../../utils/crypto_hash";
describe("Test block", () => {
  it("TestAdjustDifficulty", async function () {
    //for mocha, default timeout: 2000ms
    this.timeout(3000);
    const genesis_block = Block.getGenesisBlock();
    const block_1 = Block.mine(genesis_block, { data: "block_1" });
    const block_2 = Block.mine(block_1, { data: "block_2" });
    //should be harder
    assert(
      block_1.difficulty + 1 === block_2.difficulty,
      "TestAdjustDifficulty: should be harder"
    );
    await sleep(MINE_RATE + 1);
    const block_3 = Block.mine(block_2, { data: "block_3" });
    //should be easier
    assert(
      block_2.difficulty - 1 === block_3.difficulty,
      "TestAdjustDifficulty: should be easier"
    );
  });
  it("TestBlockIsValid", () => {
    const genesis_block = Block.getGenesisBlock();
    const data = { data: "blodk_data" };
    const block = Block.mine(genesis_block, data);
    assert(block.data === data, "TestBlockIsValid failed");
    const hash = crypto_hash(
      block.timestamp,
      genesis_block.hash,
      data,
      block.difficulty,
      block.nonce
    );
    assert(hash === block.hash);
  });
});
