from backend.blockchain.block import Block

def test_mine_block():
  genessis_block = Block.genessis()
  data = 'block_data'
  block = Block.mine_block(genessis_block, data)
  
  Block.is_valid_block(genessis_block, block)
  assert(block.data == data)
