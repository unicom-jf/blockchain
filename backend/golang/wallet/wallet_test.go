package wallet

import (
	//"bytes"
	"crypto"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/json"
	"strings"

	//"encoding/hex"
	//"fmt"

	"testing"

	"github.com/unicom-jf/blockchain/backend/golang/blockchain"
)

func TestVerify(t *testing.T) {
	wallet, err := NewWallet()
	if err != nil {
		t.Error(err)
	}
	
	// if len(wallet.Blockchain.Chain) != 0 {
	// 	t.Error("blockchain not empty")
	// }
	
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

func TestValidTxChain(t *testing.T) {
	wallet, err := NewWallet()
	if err != nil {
		t.Error(err)
	}	
	tx1, err := NewRewardTx(wallet)
	if err != nil {
		t.Error(err)
	}
	buf1, err := json.Marshal(tx1)
	if err != nil {
		t.Error(err)
	}
	tx2, err := NewTx(wallet, "receipt", 123)
	if err != nil {
		t.Error(err)
	}
	buf2, err := json.Marshal(tx2)
	if err != nil {
		t.Error(err)
	}
	//buf := []([]byte) {buf1, buf2}
	//wallet.Blockchain.AddBlock(buf)
	block_chain := &wallet.Blockchain
	block_chain.AddBlock([]([]byte){buf1, buf2})
	err = blockchain.ValidChain(wallet.Blockchain.Chain)
	if err != nil {
		t.Error(err)
	}

	err = ValidTxChain(wallet.Blockchain.Chain)
	if err != nil {
		t.Error(err)
	}

}

func TestValidTxChainDetail(t *testing.T) {
	wallet, err := NewWallet()
	if err != nil {
		t.Error(err)
	}	
	tx1, err := NewRewardTx(wallet)
	if err != nil {
		t.Error(err)
	}
	buf1, err := json.Marshal(tx1)
	if err != nil {
		t.Error(err)
	}
	//duplicate tx
	block_chain := &wallet.Blockchain
	block_chain.AddBlock([]([]byte){buf1, buf1})
	err = ValidTxChain(block_chain.Chain)
	if !strings.Contains(err.Error(), "is not unique") {
		t.Error("tx duplicate check failed")
	}

	//duplicate rewards
	wallet.Blockchain = blockchain.NewBlockchain()

	tx1, err = NewRewardTx(wallet)
	if err != nil {
		t.Error(err)
	}
	tx2, err := NewRewardTx(wallet)
	if err != nil {
		t.Error(err)
	}

	buf1, err = json.Marshal(tx1)
	if err != nil {
		t.Error(err)
	}
	buf2, err := json.Marshal(tx2)
	if err != nil {
		t.Error(err)
	}
	block_chain = &wallet.Blockchain
	block_chain.AddBlock([]([]byte){buf1, buf2})
	err = ValidTxChain(block_chain.Chain)
	if !strings.Contains(err.Error(), "one mining reward per block") {
		t.Error("rewarding tx duplicate check failed")
	}

	//bad tx
	wallet, err = NewWallet()
	if err != nil {
		t.Error(err)
	}
	tx1, err = NewTx(wallet, "receipt", 123)
	if err != nil {
		t.Error(err)
	}
	buf_output, err := json.Marshal(tx1.TxOutput)
	if err != nil {
		t.Error(err)
	}

	//sig, err := wallet.Sign(buf_output)
	wallet2, err := NewWallet()
	if err != nil {
		t.Error(err)
	}
	//make it bad
	sig, err := wallet2.Sign(buf_output)
	if err != nil {
		t.Error(err)
	}
	tx1.TxInput.Signature = sig
	buf1, err = json.Marshal(tx1)
	if err != nil {
		t.Error(err)
	}

	block_chain = &wallet.Blockchain
	block_chain.AddBlock([]([]byte){buf1})
	err = ValidTxChain(block_chain.Chain)
	if err == nil {
		t.Error("check transaction failed")
		return
	}
	if !strings.Contains(err.Error(), "invalid-tx") {
		t.Error("check transaction failed")
	}
}