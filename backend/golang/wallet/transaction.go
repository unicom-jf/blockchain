package wallet

import (
	"crypto/rsa"
	"encoding/json"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/unicom-jf/blockchain/backend/golang/utils"
)
type TxInput struct {
	Timestamp uint64;
	Address string;
	Amount uint64;
	PublicKey rsa.PublicKey;
	Signature []byte;
}

type Transaction struct {
	Id string;
	TxInput TxInput;
	TxOutput map[string]uint64;
}

func NewTx(wallet Wallet, receipt string, amount uint64) (Transaction, error) {
	tx := Transaction {}
	if amount > wallet.Balance() {
		return tx, errors.New("amount exceeds balance")
	}

	output := make(map[string]uint64)
	output[receipt] = amount
	output[wallet.Address] = wallet.Balance() - amount

	data, err := json.Marshal(output)
	if err != nil {
		return tx, err
	}
	sig, err := wallet.Sign([]byte(data))
	if err != nil {
		return tx, err
	}

	tx.Id = uuid.New().String()[0:8]
	tx.TxOutput = output
	tx.TxInput = TxInput {
		Timestamp: uint64(time.Now().UnixMilli()),
		Address: wallet.Address,
		Amount: wallet.Balance(),
		PublicKey: wallet.PublicKey,
		Signature: sig,
	}

	return tx, nil
}

func NewRewardTx(miner Wallet) (Transaction, error) {
	output := make(map[string]uint64)
	output[miner.Address] = uint64(utils.MiningReward)
	tx := Transaction {
		Id: uuid.New().String()[0:8],
		TxInput: TxInput{
			Address: utils.MiningRewardInput,
		},
		TxOutput: output,
	}
	return tx, nil
}

func ValidTx(tx Transaction) error {
	var total uint64;
	for _, v := range tx.TxOutput {
		total += v
	}

	if tx.TxInput.Address == utils.MiningRewardInput {
		if total != uint64(utils.MiningReward) {
			return errors.New("invalid mining reward")
		}
		return nil
	}

	if tx.TxInput.Amount != total {
		return errors.New("invalid output values")
	}

	data, err := json.Marshal(tx.TxOutput)
	if err != nil {
		return err
	}
	// sig, err := hex.DecodeString(tx.TxInput.Signature)
	// if err != nil {
	// 	return err
	// }
	return Verify(
		tx.TxInput.PublicKey,
		data,
		tx.TxInput.Signature,
	)

}