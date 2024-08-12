/*
const GENESIS_DATA = {

}
*/
import { crypto_hash } from "../utils/crypto_hash";
import { hex_to_binary } from "../utils/hex_to_binary";
import { MINE_RATE } from "../config";
const GENESIS_BLOCK: Block = {
  timestamp: 0,
  lastHash: "last_hash",
  hash: "hash",
  data: [],
  difficulty: 3,
  nonce: 0,
};
class Block {
  timestamp!: number;
  lastHash: string;
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
    const { timestamp, lastHash, hash, data, difficulty, nonce } =
      GENESIS_BLOCK;
    return new Block(timestamp, lastHash, hash, data, difficulty, nonce);
    //return new Block(0, "last_hash", "hash", [], 3, 0);
    //return GENESIS_BLOCK;
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
export { Block, GENESIS_BLOCK };
