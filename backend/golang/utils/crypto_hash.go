package utils

import (
	"crypto/sha256"
	"fmt"
)
func Crypto_hash(args ...string) (string, error) {
//func Crypto_hash(args ...[]byte) (string, error) {
	s := ""
	for _, i := range args {
		s += i
	}
	h := sha256.New()
	h.Write([]byte(s))
	return fmt.Sprintf("%x", h.Sum(nil)), nil
}