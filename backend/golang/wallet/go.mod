module wallet/blockchain/soho.net

go 1.22.0

require github.com/google/uuid v1.6.0

require (
	soho.net/blockchain/blockchain v0.0.0-00010101000000-000000000000 // indirect
	soho.net/blockchain/utils v0.0.0-00010101000000-000000000000 // indirect
)

replace soho.net/blockchain/blockchain => ..\blockchain

replace soho.net/blockchain/utils => ..\utils
