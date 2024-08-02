package wallet

import (
	"crypto/rand"
	"crypto/rsa"
	"log"
)
type Wallet struct {
	PrivateKey *rsa.PrivateKey;
	PublicKey rsa.PublicKey
}

func NewWallet() (Wallet, error){
	privateKey, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		log.Fatal(err)
	}
	return Wallet{
		privateKey,
		privateKey.PublicKey,
	}, nil

}