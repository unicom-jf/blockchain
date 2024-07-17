import time

from backend.config import MINE_RATE
from backend.utils.crypto_hash import crypto_hash
from backend.utils.hex_to_binary import hex_to_binary

GENESIS_DATA = {
  'timestamp': 1,
  'last_hash': 'genesis_last_hash',
  'hash': 'genesis_hash',
  'data': [],
  'difficulty': 3,
  'nonce': 'genesis_nonce'
}

class Block:
  """
    a unit of storage
    stores in a blockchain that supports a cryptocurrency.
  """
  def __init__(self, timestamp, last_hash, hash, data, difficulty, nonce) -> None:
    self.timestamp = timestamp
    self.last_hash = last_hash
    self.hash = hash
    self.data = data
    self.difficulty = difficulty
    self.nonce = nonce

  def __repr__(self) -> str:
    return (
      'Block('
      f'timestamp: {self.timestamp}'
      f'last_hash: {self.last_hash}'
      f'hash: {self.hash}'
      f'data: {self.data}'
      f'difficulty: {self.difficulty}'
      f'nonce: {self.nonce}'
    ')'
    )
  def __eq__(self, value: object) -> bool:
    return self.__dict__ == value.__dict__
  
  def to_json(self) :
    """
    serialize a block instance to json with its attributes
    """
    return self.__dict__

  @staticmethod
  def genesis_block():
    """
    Generate a genesis block instance
    """
    return Block(**GENESIS_DATA)
  
  @staticmethod
  def from_json(json_data):
    """
    deserialize json data to a block instance
    """
    return Block(**json_data)

  @staticmethod
  def adjust_difficulty(last_block, current_timestamp):
    """
    difficulty changed by 1
    and at least 1
    to_do: avoid the waves?
    """
    if current_timestamp - last_block.timestamp < MINE_RATE:
      return last_block.difficulty + 1
    if last_block.difficulty == 1:
      return 1
    return last_block.difficulty - 1

  @staticmethod
  def mine_block(last_block, data):
    """
    calculate the hash with the attributes,
    and satisfy the difficulty
    """
    nonce = 0
    last_hash = last_block.last_hash
    while True:
      timestamp = time.time_ns()
      difficulty = Block.adjust_difficulty(last_block, timestamp)
      hash = crypto_hash(timestamp, last_hash, data, difficulty, nonce)
      if hex_to_binary(hash)[0:difficulty] == '0' * difficulty:
        return Block(timestamp, last_hash, hash, data, difficulty, nonce)
      nonce += 1

  @staticmethod
  def block_is_valid(last_block, block):
    """
      check 4 :
        block's last_hash, 
        difficulty with the hash,
        difference between difficulties no more than 1
        recalculate the hash
      
    """
    if block.last_hash != last_block.hash:
      raise Exception("The block's last_hash must be correct")
    if hex_to_binary(block.hash)[0:block.difficulty] != '0' * block.difficulty:
      raise Exception("The POW requirement is not met")
    if abs(block.difficulty - last_block.difficulty) > 1:
      raise Exception("The block's difficulty must only adjust by 1")
    if block.hash != crypto_hash(block.timestamp, block.last_hash, block.data, block.difficulty, block.nonce):
      raise Exception("The block's hash must be correct")