package utils
import(
	"fmt"
	"testing"
)
func TestCrypto_hash(t *testing.T) {
	h1, _ := Crypto_hash("one", fmt.Sprintf("%d", 2), fmt.Sprintf("%v", [2]int{3,4}))
	h2, _ := Crypto_hash("one", fmt.Sprintf("%d", 2), fmt.Sprintf("%v", [2]int{3,4}))
	h3, _ := Crypto_hash("one-x", fmt.Sprintf("%d", 2), fmt.Sprintf("%v", [2]int{3,4}))
	if h1 != h2 {
		t.Errorf("h1 should be the same as h2: %v, %v\n", h1, h2)
	}

	if h1 == h3 {
		t.Errorf("h1 should not be the same as h3: %v, %v\n", h1, h3)
	}
}