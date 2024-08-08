from python.blockchain.block import Block

def test_mine_block():
  genesis_block = Block.genesis_block()
  data = 'block_data'
  block = Block.mine_block(genesis_block, data)
  
  Block.block_is_valid(genesis_block, block)
  assert(block.data == data)
