/*
const GENESIS_DATA = {

}
*/
import { crypto_hash } from "../utils/crypto_hash";
import { hex_to_binary } from "../utils/hex_to_binary";
import { MINE_RATE } from "../config";
export class Block {
  timestamp!: number;
  lastHash!: string;
  hash!: string;
  data!: any[];
  difficulty!: number;
  nonce!: number;

  constructor(
    timestamp: number,
    last_hash: string,
    hash: string,
    data: any[],
    difficulty: number,
    nonce: number
  ) {
    this.timestamp = timestamp;
    this.lastHash = last_hash;
    this.hash = hash;
    this.data = data;
    this.difficulty = difficulty;
    this.nonce = nonce;
  }

  static getGenesisBlock() {
    return new Block(0, "last_hash", "hash", [], 3, 0);
  }

  static adjustDifficulty(last_block: Block, timestamp: number) {
    if (timestamp - last_block.timestamp < MINE_RATE) {
      return last_block.difficulty + 1;
    }
    if (last_block.difficulty == 1) {
      return last_block.difficulty;
    }
    return last_block.difficulty - 1;
  }
  static mine(last_block: Block, data: any[]) {
    let nonce = 0;
    let last_hash = last_block.hash;
    while (true) {
      let timestamp = Date.now();
      let difficulty = Block.adjustDifficulty(last_block, timestamp);
      let hash = crypto_hash(timestamp, last_hash, data, difficulty, nonce);
      if (
        hex_to_binary(hash).substring(0, difficulty) ===
        Array(difficulty + 1).join("0")
      ) {
        return new Block(timestamp, last_hash, hash, data, difficulty, nonce);
      }
      nonce++;
    }
  }
  static blockIsValid(last_block: Block, block: Block) {
    if (block.lastHash !== last_block.hash) {
      throw new Error("The block's last_hash must be correct");
    }
    if (
      hex_to_binary(block.hash).substring(0, block.difficulty) !==
      Array(block.difficulty + 1).join("0")
    ) {
      throw new Error("The POW requirement is not met");
    }
    if (Math.abs(block.difficulty - last_block.difficulty) > 1) {
      throw new Error("The block's difficulty must only adjust by 1");
    }
    if (
      block.hash !=
      crypto_hash(
        block.timestamp,
        block.lastHash,
        block.data,
        block.difficulty,
        block.nonce
      )
    ) {
      throw new Error("The block's hash must be correct");
    }
  }
}
//const s = Array(6).join("0");
//console.log(s, s.substring(0, 3));
/*
const block = Block.getGenesisBlock();
console.log(block);
const block2 = Block.getGenesisBlock();
if (JSON.stringify(block) === JSON.stringify(block2)) {
  console.log("ok");
} else {
  console.log("failed");
}

const b = Block.mine(block, { data: "mined" });
b.difficulty = 2;
console.log("mined:", Block.blockIsValid(block, b));
*/
