package blockchain

type Blockchain struct {
	Chain []Block
}

func (blockchain *Blockchain) AddBlock(data [][]byte) error {
	block, err := Mine(blockchain.Chain[len(blockchain.Chain)-1], data)
	if err != nil {
		return err
	}
	blockchain.Chain = append(blockchain.Chain, block)
	return nil
}
func NewBlockchain() Blockchain {
	blockchain := Blockchain{}
	blockchain.Chain = append(blockchain.Chain, GenesisBlock())
	return blockchain
}