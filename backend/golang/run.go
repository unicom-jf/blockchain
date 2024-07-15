package main

import (
	"fmt"

	"soho.net/blockchain/utils"
)
func main() {
	s, _ := utils.Crypto_hash("one", fmt.Sprintf("%d", 2), fmt.Sprintf("%v", [2]int{3,4}))
	fmt.Printf("hash: %v\n", s)
	fmt.Println(utils.Hex_to_binary("1e"))
}