package wallet

import (
	"crypto/rsa"

)
type TxInput struct {
	Timestamp uint64;
	Address string;
	Amount uint64;
	PublicKey rsa.PublicKey;
	Signature string;
}

type TxOutput struct {
	ReceiveAddress string;
	ReceiveAmount uint64;
	SourceAddress string;
	SourceAmount uint64;
}

type Transaction struct {
	Id string;
	TxInput TxInput;
	TxOutput TxOutput;
}

func NewTx(wallet Wallet, receipt string, amount uint64) (Transaction, error) {
	tx := Transaction {
		Id: "a",
	}
	return tx, nil
}

func NewRewardTx() (Transaction, error) {
	tx := Transaction {
		Id: "a",
	}
	return tx, nil
}