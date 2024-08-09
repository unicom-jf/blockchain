package wallet

import (
	"encoding/json"
	"testing"

	"github.com/unicom-jf/blockchain/backend/golang/blockchain"
)

func TestValidTx(t *testing.T) {
	wallet, _ := NewWallet()
	tx, _ := NewRewardTx(*wallet)
	err := ValidTx(tx)
	if err != nil {
		t.Error(err)
	}

	tx, err = NewTx(*wallet, "test-recipient", 20)
	if err != nil {
		t.Error(err)
	}
	
	err = ValidTx(tx)
	if err != nil {
		t.Error(err)
	}
	/*
	data, _ := json.Marshal(tx.TxOutput) 

	err := Verify(wallet.PublicKey, data, tx.TxInput.Signature)
	*/
}

func TestOnchain(t *testing.T) {
	wallet, err := NewWallet()
	if err != nil {
		t.Error(err)
	}
	chain := blockchain.NewBlockchain()
	wallet.Blockchain = chain
	if len(wallet.Blockchain.Chain) == 0 {
		t.Error("wallet's chain is empty")
	}

	tx, err := NewRewardTx(*wallet)
	if err != nil {
		t.Error(err)
	}
	data, err := json.Marshal(tx)
	if err != nil {
		t.Error(err)
	}
	buf := [][]byte{}
	buf = append(buf, data)
	block, err := blockchain.Mine(wallet.Blockchain.Chain[len(wallet.Blockchain.Chain) - 1], buf)
	if err != nil {
		t.Error(err)
	}
	wallet.Blockchain.Chain = append(wallet.Blockchain.Chain, block)

	wallet2, err := NewWallet()
	if err != nil {
		t.Error(err)
	}
	tx2, err := NewTx(*wallet, wallet2.Address, 100)
	if err != nil {
		t.Error(err)
	}
	data2, err := json.Marshal(tx2)
	if err != nil {
		t.Error(err)
	}
	buf2 := [][]byte{}
	buf2 = append(buf2, data2)
	block2, err := blockchain.Mine(wallet.Blockchain.Chain[len(wallet.Blockchain.Chain) - 1], buf2)
	if err != nil {
		t.Error(err)
	}
	wallet.Blockchain.Chain = append(wallet.Blockchain.Chain, block2)
	// 1000 + 50 - 100 = 950
	if wallet.Balance() != 950 {
		t.Error("balance error")
	}
}