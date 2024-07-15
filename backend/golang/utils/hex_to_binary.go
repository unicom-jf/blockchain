package utils
import (
	"fmt"
)
func getHex2BinMap() map[string]string {
	m := make(map[string]string, 16)
	for i := 0; i < 16; i++ {
		m[fmt.Sprintf("%x", i)] = fmt.Sprintf("%04b", i)
	}
	//fmt.Printf("%v\n", m)
	return m
}
func Hex_to_binary(src string) string {
	m := getHex2BinMap()
	s := ""
	for i := 0; i < len(src); i++ {
		s += m[string(src[i])]
	}
	return s
}