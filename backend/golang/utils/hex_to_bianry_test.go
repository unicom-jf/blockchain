package utils

import "testing"

func TestHex_to_binary(t *testing.T) {
	bin_str := Hex_to_binary("1e")
	if bin_str != "00011110" {
		t.Errorf("1e => 00011110: %v\n", bin_str)
	}
}