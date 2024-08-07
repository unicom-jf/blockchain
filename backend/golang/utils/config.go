package utils

import "time"

var (
	MineRate = (2 * time.Second).Milliseconds()
	StartingBalance = 1000
	MiningReward = 50
	MiningRewardInput = "*--official-mining-reward--*"
)
