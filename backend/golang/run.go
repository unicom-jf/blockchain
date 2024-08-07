package main

import (
	"bytes"
	"crypto"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"log"
	"time"

	"soho.net/blockchain/utils"
	"soho.net/blockchain/wallet"
)

func utilsFunc() {
	s, _ := utils.Crypto_hash("one", fmt.Sprintf("%d", 2), fmt.Sprintf("%v", [2]int{3,4}))
	fmt.Printf("hash: %v\n", s)
	fmt.Println(utils.Hex_to_binary("1e"))
	fmt.Printf("%v, %v\n", utils.MineRate, time.Now())
	
	//time.Now().Unix()
	t := time.Now()
	time.Sleep(1 * time.Second)
	fmt.Printf("%v, %v, %v\n", t.UnixMilli(), time.Now().UnixMilli(), time.Unix(0, 0).UTC())

}
func walletFunc() {
	wallet, err := wallet.NewWallet()
	if err != nil {
		log.Fatal(err)
	}
	data := []byte("hello")
	sig, err := wallet.Sign(data)
	if err != nil {
		log.Fatal(err)
	}
	//fmt.Printf("sig: %v\n", string(sig))
	str1 := hex.EncodeToString(sig)
	fmt.Printf("sig: %v\n", str1)

	sig2, err := hex.DecodeString(str1)
	if err != nil {
		log.Fatal(err)
	}
	if bytes.Equal(sig, sig2) {
		fmt.Println("encode, decode ok.")
	} else {
		fmt.Println("encode, decode not equal.")
	}
	msgHash := sha256.New()
	_, err = msgHash.Write(data)
	if err != nil {
		panic(err)
	}
	msgHashSum := msgHash.Sum(nil)

	err = rsa.VerifyPSS(&wallet.PublicKey, crypto.SHA256, msgHashSum, sig, nil)
	if err != nil {
		fmt.Println("could not verify signature: ", err)
		return
	}
	// If we don't get any error from the `VerifyPSS` method, that means our
	// signature is valid
	fmt.Println("signature verified")
}
func main() {
	walletFunc()
}