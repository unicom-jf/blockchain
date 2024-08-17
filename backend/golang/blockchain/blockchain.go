package blockchain

import (
	"encoding/json"
	"errors"
	"slices"

	
)

type Blockchain struct {
	Chain []Block
}

func (block_chain *Blockchain) AddBlock(data [][]byte) error {
	if len(block_chain.Chain) == 0 {
		return errors.New("no genesis block")
	}
	block, err := Mine(block_chain.Chain[len(block_chain.Chain)-1], data)
	if err != nil {
		return err
	}
	block_chain.Chain = append(block_chain.Chain, block)
	return nil
}
func NewBlockchain() Blockchain {
	blockchain := Blockchain{}
	blockchain.Chain = append(blockchain.Chain, GenesisBlock())
	return blockchain
}

func ValidChain(chain []Block) error {
	if len(chain) == 0 {
		return errors.New("no genesis block")
	}

	buf1, err := json.Marshal(chain[0])
	if err != nil {
		return err
	}
	buf2, err := json.Marshal(GenesisBlock())
	if err != nil {
		return err
	}
	if !slices.Equal(buf1, buf2) {
		return errors.New("the genesis block must be valid")
	}
	for i, block := range chain {
		if i == 0 {
			continue
		}
		BlockIsValid(chain[i], block)
	}
	return nil
}

