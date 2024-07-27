package blockchain

import (
	"strconv"
	"testing"
	"time"

	"soho.net/blockchain/utils"
)


func TestAdjustDifficulty(t *testing.T) {
	genesis_block := GenesisBlock()
	//time.Sleep(time.Duration((utils.MineRate + 1000) * int64(time.Millisecond)))
	block_1, err := Mine(genesis_block, "block_1")
	if err != nil {
		t.Errorf("%v:\n", err)
	}
	block_2, err := Mine(*block_1, "block_2")
	if err != nil {
		t.Errorf("%v:\n", err)
	}
	//should be fast, adjust to harder
	if block_1.Difficulty + 1 != block_2.Difficulty {
		t.Errorf("adjustDifficulty failed:%v, %v\n", block_1.Difficulty, block_2.Difficulty)
	}
	time.Sleep(time.Duration((utils.MineRate + 1000) * int64(time.Millisecond) ))
	//should adjust easier
	block_3, err := Mine(*block_2, "block_3")
	if err != nil {
		t.Errorf("%v:\n", err)
	}
	if block_3.Difficulty + 1 != block_2.Difficulty {
		t.Errorf("adjustDifficulty failed:%v, %v\n", block_2.Difficulty, block_3.Difficulty)
	}
}

func TestBlockIsValid(t *testing.T) {
	genesis := GenesisBlock()
	data := "block"
	block, err := Mine(genesis, data)
	if err != nil {
		t.Errorf("%v:\n", err)
	}
	if block.Data != data {
		t.Errorf("block data error: %v\n", block.Data)
	}
	
	hash, err := utils.Crypto_hash(strconv.FormatInt(block.Timestamp, 10), 
		genesis.Hash, data, strconv.Itoa(block.Difficulty), strconv.Itoa(block.Nonce))
	
	if err != nil {
		t.Errorf("%v:\n", err)
	}
	if hash != block.Hash {
		t.Errorf("hash error: %v, %v\n", hash, block.Hash)
	}
}