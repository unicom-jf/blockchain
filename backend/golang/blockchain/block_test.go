package blockchain

import (
	"encoding/json"
	"reflect"
	"strconv"
	"testing"
	"time"

	"github.com/unicom-jf/blockchain/backend/golang/utils"
)


func TestAdjustDifficulty(t *testing.T) {
	genesis_block := GenesisBlock()
	//time.Sleep(time.Duration((utils.MineRate + 1000) * int64(time.Millisecond)))
	buf := [][]byte {}
	data := []byte("block_1")
	buf = append(buf, data)
	block_1, err := Mine(genesis_block, buf)
	if err != nil {
		t.Errorf("%v:\n", err)
	}
	data = []byte("block_2")
	buf = [][]byte {}
	buf = append(buf, data)
	block_2, err := Mine(block_1, buf)
	if err != nil {
		t.Errorf("%v:\n", err)
	}
	//should be fast, adjust to harder
	if block_1.Difficulty + 1 != block_2.Difficulty {
		t.Errorf("adjustDifficulty failed:%v, %v\n", block_1.Difficulty, block_2.Difficulty)
	}
	time.Sleep(time.Duration((utils.MineRate + 1000) * int64(time.Millisecond) ))
	//should adjust easier
	data = []byte("block_3")
	buf = [][]byte {}
	buf = append(buf, data)
	block_3, err := Mine(block_2, buf)
	if err != nil {
		t.Errorf("%v:\n", err)
	}
	if block_3.Difficulty + 1 != block_2.Difficulty {
		t.Errorf("adjustDifficulty failed:%v, %v\n", block_2.Difficulty, block_3.Difficulty)
	}
}

func TestBlockIsValid(t *testing.T) {
	genesis := GenesisBlock()
	buf := [][]byte {}
	data := []byte("block_1")
	buf = append(buf, data) 
	block, err := Mine(genesis, buf)
	if err != nil {
		t.Errorf("%v:\n", err)
	}
	if string(block.Data[0]) != "block_1" {
		t.Errorf("block data error: %v\n", block.Data)
	}
	
	json_bytes, err := json.Marshal(buf)
	if err != nil {
		t.Error(err)
	}
	hash, err := utils.Crypto_hash(strconv.FormatInt(block.Timestamp, 10), 
		genesis.Hash, string(json_bytes), strconv.Itoa(block.Difficulty), strconv.Itoa(block.Nonce))
	
	if err != nil {
		t.Errorf("%v:\n", err)
	}
	if hash != block.Hash {
		t.Errorf("hash error: %v, %v\n", hash, block.Hash)
	}
}

func TestGenesis(t *testing.T) {
	genesis := GenesisBlock()

	if reflect.TypeOf(genesis).Name() != "Block" {
		t.Errorf("invalid block type: %v\n", reflect.TypeOf(genesis).Name())
	}

	

}