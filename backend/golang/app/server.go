package main

import (
	"fmt"

	"github.com/gin-gonic/gin"

)

func main() {
	fmt.Println("server")
	router := gin.Default()
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "hello from gin",
		})
	})

	router.Run("127.0.0.1:3000")
}