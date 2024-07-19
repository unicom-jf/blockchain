package main

import (
	"fmt"
	"time"

	"soho.net/blockchain/utils"
)
func main() {
	
	s, _ := utils.Crypto_hash("one", fmt.Sprintf("%d", 2), fmt.Sprintf("%v", [2]int{3,4}))
	fmt.Printf("hash: %v\n", s)
	fmt.Println(utils.Hex_to_binary("1e"))
	fmt.Printf("%v, %v\n", utils.MineRate, time.Now())
	
	//time.Now().Unix()
	t := time.Now()
	time.Sleep(1 * time.Second)
	fmt.Printf("%v, %v, %v\n", t.UnixMilli(), time.Now().UnixMilli(), time.Unix(0, 0).UTC())
}