package main

import (
	"fmt"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/unicom-jf/blockchain/backend/golang/blockchain"
	"github.com/unicom-jf/blockchain/backend/golang/wallet"
)

// config := cors.DefaultConfig()
// config.AllowAllOrigins = true
// router.Use(cors.New(config))

// cors.New(cors.Config{
// 	AllowOrigins:     []string{"https://foo.com"},
// 	AllowMethods:     []string{"PUT", "PATCH"},
// 	AllowHeaders:     []string{"Origin"},
// 	ExposeHeaders:    []string{"Content-Length"},
// 	AllowCredentials: true,
// 	AllowOriginFunc: func(origin string) bool {
// 		return origin == "https://github.com"
// 	},
// 	MaxAge: 12 * time.Hour,
// })

var (
	wallet1 wallet.Wallet
	chain blockchain.Blockchain
	//txPool w
	err error
)	
func seedBlockChain() {
	chain = blockchain.NewBlockchain()
	wallet1, err = wallet.NewWallet()

}
func seedTxPool() {

}

func init() {
	seedBlockChain()
	seedTxPool()
}
func main() {
	fmt.Println("server")
	router := gin.Default()
	
	router.Use(cors.Default())

	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"info": "hello from gin",
		})
	})

	router.GET("/wallet/info", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"address": wallet1.Address,
			"balance": wallet1.Balance(),
		})
	})

	router.Run("127.0.0.1:5000")
}