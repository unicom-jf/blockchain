package blockchain

import (
	"fmt"
	"log"
	"math"
	"strconv"
	"strings"
	"time"

	"soho.net/blockchain/utils"
)
type Block struct {
	Timestamp int64 `json:"timestamp"`
	LastHash string `json:"lastHash"`
	Hash string `json:"hash"`
	Data string `json:"data"`
	Difficulty int `json:"difficulty"`
	Nonce int `json:"nonce"`
}

func GenesisBlock() Block {
	return Block{
		Timestamp: 0, //milli seconds
		LastHash: "genesis_last_hash",
		Hash: "genesis_hash",
		Data: "genesis_data",
		Difficulty: 1,
		Nonce: 0,
	}
}

// compare two milliseconds
func AdjustDifficulty(last_block Block, timestamp int64) int {
	if timestamp - last_block.Timestamp < utils.MineRate {
		return last_block.Difficulty + 1
	}
	if last_block.Difficulty == 1 {
		return 1
	}
	return last_block.Difficulty - 1
}
func Mine(last_block Block, data string) (*Block, error) {
	last_hash := last_block.LastHash
	nonce := last_block.Nonce
	for {
		timestamp := time.Now().UnixMilli()
		difficulty := AdjustDifficulty(last_block, timestamp)
		hash, err := utils.Crypto_hash(strconv.FormatInt(timestamp, 10), last_hash, data, strconv.Itoa(difficulty), strconv.Itoa(nonce))
		if err != nil {
			log.Fatal(err)
		}
		if utils.Hex_to_binary(hash)[0:difficulty] == strings.Repeat("0", difficulty) {
			return &Block {
				Timestamp: timestamp,
				LastHash: last_hash,
				Hash: hash,
				Data: data,
				Difficulty: difficulty,
				Nonce: nonce,
			}, nil
		}
		nonce++
	}
}

func BlockIsValid(last_block Block, block Block) error {
	if block.LastHash != last_block.Hash {
		return fmt.Errorf("the block's last_hash must be correct")	
	}
	if utils.Hex_to_binary(block.Hash)[0:block.Difficulty] != strings.Repeat("0", block.Difficulty) {
		return fmt.Errorf("the POW requirement is not met")	
	}
	if math.Abs(float64(block.Difficulty - last_block.Difficulty)) > 1 {
		return fmt.Errorf("the block's difficulty must only adjust by 1")	
	}
	hash, err := utils.Crypto_hash(strconv.FormatInt(block.Timestamp, 10), 
		block.LastHash, block.Data, strconv.Itoa(block.Difficulty), strconv.Itoa(block.Nonce))
	if err != nil {
		return err
	}
	if block.Hash != hash {
		return fmt.Errorf("the block's hash must be correct")	
	}
	
	return nil
}