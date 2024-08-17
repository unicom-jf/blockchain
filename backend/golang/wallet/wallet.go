package wallet

import (
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/json"
	"errors"
	"fmt"

	//"slices"

	//"fmt"

	"github.com/google/uuid"
	"github.com/unicom-jf/blockchain/backend/golang/blockchain"
	"github.com/unicom-jf/blockchain/backend/golang/utils"
)
type Wallet struct {
	Blockchain blockchain.Blockchain
	Address string
	PrivateKey *rsa.PrivateKey
	PublicKey rsa.PublicKey
	balance uint64
}

func (wallet Wallet) Sign(data []byte) ([]byte, error) {
	msgHash := sha256.New()
	_, err := msgHash.Write(data)
	if err != nil {
		return []byte(""), err
	}
	msgHashSum := msgHash.Sum(nil)
	
	// In order to generate the signature, we provide a random number generator,
	// our private key, the hashing algorithm that we used, and the hash sum
	// of our message
	return rsa.SignPSS(rand.Reader, wallet.PrivateKey, crypto.SHA256, msgHashSum, nil)
}
func Balance(chain blockchain.Blockchain, address string) uint64 {
	balance := uint64(utils.StartingBalance)
	blocks := chain.Chain
	if len(blocks) == 0 {
		return balance
	}
	var tx Transaction
	for _, block := range blocks {
		if len(block.Data) == 0 {
			continue
		}
		//array of []byte for tx
		for _, buf := range block.Data {
			json.Unmarshal(buf, &tx)
			//fmt.Printf("tx data: %v\n", tx.TxOutput)
			if tx.TxInput.Address == address {
				balance = tx.TxOutput[address]
			} else {
				v, ok := tx.TxOutput[address]
				if ok {
					balance += v
				}
			}
		}
	}
	return balance
}
func (wallet Wallet)Balance() uint64 {
	return Balance(wallet.Blockchain, wallet.Address)
}

func NewWallet() (Wallet, error){
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return Wallet{}, err
	}
	return Wallet{
		blockchain.NewBlockchain(),
		uuid.New().String()[0:8],
		privateKey,
		privateKey.PublicKey,
		uint64(utils.StartingBalance),
	}, nil

}

func Verify(public_key rsa.PublicKey, data []byte, signature []byte) error {
	msgHash := sha256.New()
	_, err := msgHash.Write(data)
	msg := "invalid-tx:"
	if err != nil {
		fmt.Sprintf("%s %s", msg, err.Error())
		return errors.New(msg)
	}
	msgHashSum := msgHash.Sum(nil)
	err = rsa.VerifyPSS(&public_key, crypto.SHA256, msgHashSum, signature, nil)
	if err != nil {
		fmt.Sprintf("%s %s", msg, err.Error())
		return errors.New(msg)
	}
	return nil
}


func ValidTxChain(chain []blockchain.Block) error {
	txIds := make(map[string]int)
	for idx, block := range chain {
		foundReward := false
		for _, buf := range block.Data {
			var tx Transaction
			err := json.Unmarshal(buf, &tx)
			if err != nil {
				return err
			}
			_, ok := txIds[tx.Id]
			if ok {
				return errors.New("tx is not unique")
			}
			txIds[tx.Id] = 1

			if tx.TxInput.Address == utils.MiningRewardInput {
				if foundReward {
					return errors.New("one mining reward per block")
				} else {
					foundReward = true
				}
			} else {
				historic_blockchain := blockchain.NewBlockchain()
				historic_blockchain.Chain = chain[0:idx]
				historic_balance := Balance(historic_blockchain, tx.TxInput.Address)
				if historic_balance != tx.TxInput.Amount {
					msg := fmt.Sprintf("tx: %s has an invalid input amount", tx.Id)
					return errors.New(msg)
				}
				err = ValidTx(tx)
				if err != nil {
					return err
				}
			}
		}
	}
	return nil
}
