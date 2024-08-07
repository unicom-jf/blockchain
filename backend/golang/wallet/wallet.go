package wallet

import (
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"

	"github.com/google/uuid"
	"github.com/unicom-jf/blockchain/backend/golang/blockchain"
)
type Wallet struct {
	BlockChain blockchain.BlockChain
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
func (wallet Wallet)Balance() uint64 {
	return wallet.balance
}

func NewWallet() (*Wallet, error){
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		return nil, err
	}
	return &Wallet{
		blockchain.BlockChain {},
		uuid.New().String()[0:8],
		privateKey,
		privateKey.PublicKey,
		0,
	}, nil

}