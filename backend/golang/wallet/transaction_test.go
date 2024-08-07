package wallet

import (
	//"encoding/json"
	"testing"
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