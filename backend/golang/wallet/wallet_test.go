package wallet

import (
	//"bytes"
	"crypto"
	"crypto/rsa"
	"crypto/sha256"
	//"encoding/hex"
	//"fmt"

	"testing"
)

func TestVerify(t *testing.T) {
	wallet, err := NewWallet()
	if err != nil {
		t.Error(err)
	}
	
	if len(wallet.Blockchain.Chain) != 0 {
		t.Error("blockchain not empty")
	}
	
	data := []byte("hello")
	sig, err := wallet.Sign(data)
	if err != nil {
		t.Error(err)
	}
	//fmt.Printf("sig: %v\n", string(sig))
	//str1 := hex.EncodeToString(sig)
	//fmt.Printf("sig: %v\n", str1)

	// sig2, err := hex.DecodeString(str1)
	// if err != nil {
	// 	t.Error(err)
	// }
	// if bytes.Equal(sig, sig2) {
	// 	fmt.Println("encode, decode ok.")
	// } else {
	// 	t.Error("encode, decode not equal.")
	// }
	msgHash := sha256.New()
	_, err = msgHash.Write(data)
	if err != nil {
		t.Error(err)
	}
	msgHashSum := msgHash.Sum(nil)

	err = rsa.VerifyPSS(&wallet.PublicKey, crypto.SHA256, msgHashSum, sig, nil)
	if err != nil {
		t.Error(err)
	}

	err = Verify(wallet.PublicKey, data, sig)
	if err != nil {
		t.Errorf("Verify err: %v\n", err)
	}
		
}