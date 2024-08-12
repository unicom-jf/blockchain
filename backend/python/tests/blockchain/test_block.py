import pytest
import time
from python.blockchain.block import Block, GENESIS_DATA
from python.utils.hex_to_binary import hex_to_binary
from python.config import MINE_RATE, SECONDS
def test_mine_block():
  last_block = Block.genesis_block()
  data = "block_data"
  block = Block.mine_block(last_block, data)
  
  assert isinstance(block, Block)
  Block.block_is_valid(last_block, block)
  assert block.data == data
  assert block.last_hash == last_block.hash
  assert hex_to_binary(block.hash)[0:block.difficulty] == "0" * block.difficulty
  #assert hex_to_binary(block.hash)[0:block.difficulty] == '0' * block.difficulty

def test_genesis():
  genesis = Block.genesis_block()

  assert isinstance(genesis, Block)
  for key, value in GENESIS_DATA.items():
    getattr(genesis, key) == value

def test_quickly_mined_block():
  last_block = Block.mine_block(Block.genesis_block(), "foo")
  block = Block.mine_block(last_block, "bar")
  assert last_block.difficulty == block.difficulty - 1

def test_slowly_mined_block():
  last_block = Block.mine_block(Block.genesis_block(), "foo")
  time.sleep(MINE_RATE / SECONDS)
  block = Block.mine_block(last_block, "bar")
  assert last_block.difficulty == block.difficulty + 1

def test_difficulty_at_least_1():
  last_block = Block.mine_block(Block.genesis_block(), "foo")
  last_block.difficulty = 1
  time.sleep(MINE_RATE / SECONDS)
  block = Block.mine_block(last_block, "bar")

  assert block.difficulty == 1

@pytest.fixture
def last_block():
  return Block.mine_block(Block.genesis_block(), "foo")

@pytest.fixture
def block(last_block):
  return Block.mine_block(last_block, "bar")

def test_is_valid_block(last_block, block):
  Block.block_is_valid(last_block, block)

def test_is_valid_block_bad_last_hash(last_block, block):
  block.last_hash = "dsfds"
  
  with pytest.raises(Exception, match="The block's last_hash must be correct"):
    Block.block_is_valid(last_block, block)

def test_is_valid_block_bad_pow(last_block, block):
  block.hash = "111"
  with pytest.raises(Exception, match='hash must be correct'):
    Block.block_is_valid(last_block, block)

def test_is_valid_block_jump_difficulty(last_block, block):
  jumped_difficulty = 10
  block.difficulty = jumped_difficulty
  block.hash = f'{"0" * block.difficulty}dfdf'
  #block.hash = f'{"0" * jumped_difficulty}111abc'
  with pytest.raises(Exception, match='only adjust by 1'):
    Block.block_is_valid(last_block, block)

def test_is_valid_block_bad_block_hash(last_block, block):
  #block.hash = '00000dfdfds'
  #Input: "invalid literal for int() with base 16: '0xs'"
  block.hash = '00000dfdfd'
  with pytest.raises(Exception, match="hash must be correct"):
    Block.block_is_valid(last_block, block)