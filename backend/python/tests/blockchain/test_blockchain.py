import pytest

from python.blockchain.blockchain import Blockchain
from python.wallet.wallet import Wallet
from python.wallet.transaction import Transaction
from python.blockchain.block import GENESIS_DATA

def test_blockchain_instance():
  blockchain = Blockchain()
  assert blockchain.chain[0].hash == GENESIS_DATA["hash"]

def test_add_block():
  blockchain = Blockchain()
  data = "test_data"
  blockchain.add_block(data)
  assert blockchain.chain[-1].data == data

@pytest.fixture
def blockchain_three_blocks():
  blockchain = Blockchain()
  for i in range(3):
    blockchain.add_block([Transaction(Wallet(), "receipt", i).to_json()])
  return blockchain

def test_is_valid_chain(blockchain_three_blocks):
  Blockchain.is_valid_chain(blockchain_three_blocks.chain)

def test_is_valid_chain_bad_genesis(blockchain_three_blocks):
  blockchain_three_blocks.chain[0].hash = 'bad_genesis_hash'

  with pytest.raises(Exception, match="genesis block must be valid"):
    Blockchain.is_valid_chain(blockchain_three_blocks.chain)

def test_replace_chain(blockchain_three_blocks):
  blockchain = Blockchain()
  blockchain.replace_chain(blockchain_three_blocks.chain)

  assert blockchain.chain == blockchain_three_blocks.chain

def test_replace_chain_not_longer(blockchain_three_blocks):
  blockchain = Blockchain()

  with pytest.raises(Exception, match="incoming chain must be longer"):
    blockchain_three_blocks.replace_chain(blockchain.chain)

def test_replace_chain_bad_chain(blockchain_three_blocks):
  blockchain = Blockchain()
  blockchain_three_blocks.chain[1].hash = "111"

  with pytest.raises(Exception, match="incoming chain is invalid"):
    blockchain.replace_chain(blockchain_three_blocks.chain)

def test_valid_transaction_chain(blockchain_three_blocks):
  Blockchain.is_valid_transaction_chain(blockchain_three_blocks.chain)

def test_valid_transaction_chain_duplicate_transaction(blockchain_three_blocks):
  tx = Transaction(Wallet(), "receipt", 1)
  blockchain_three_blocks.add_block([tx.to_json(), tx.to_json()])

  with pytest.raises(Exception, match="is not unique"):
    Blockchain.is_valid_transaction_chain(blockchain_three_blocks.chain)

def test_valid_transaction_chain_multiple_rewards(blockchain_three_blocks):
  reward1 = Transaction.reward_tx(Wallet())
  reward2 = Transaction.reward_tx(Wallet())
  blockchain_three_blocks.add_block([reward1.to_json(), reward2.to_json()])
  with pytest.raises(Exception, match="one mining reward per block"):
    blockchain_three_blocks.is_valid_transaction_chain(blockchain_three_blocks.chain)

def test_valid_transaction_chain_bad_transaction(blockchain_three_blocks):
  tx = Transaction(Wallet(), "receipt", 1)
  tx.input["signature"] = Wallet().sign(tx.output)
  blockchain_three_blocks.add_block([tx.to_json()])

  with pytest.raises(Exception):
    Blockchain.is_valid_transaction_chain(blockchain_three_blocks.chain)

def test_valid_transaction_chain_bad_history_balance(blockchain_three_blocks):
  wallet = Wallet()
  tx = Transaction(wallet, "receipt", 1)
  tx.input["amount"] = 10000
  tx.output[wallet.address] = 100
  tx.input["signature"] = wallet.sign(tx.output)
  blockchain_three_blocks.add_block([tx.to_json()])

  with pytest.raises(Exception, match="invalid input amount"):
    Blockchain.is_valid_transaction_chain(blockchain_three_blocks.chain)