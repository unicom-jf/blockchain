from python.blockchain.block import Block
from python.wallet.wallet import Wallet
from python.wallet.transaction import Transaction
from python.config import MINING_REWARD_INPUT

class Blockchain:
  """
  Blockchain: a public ledger of transactions
  Implemented as a list of blocks( data sets of transactions)
  """
  def __init__(self) -> None:
    self.chain = [Block.genesis_block()]
  
  def add_block(self, data):
    self.chain.append(Block.mine_block(self.chain[-1], data))

  def __repr__(self) -> str:
    return f'Blockchain: {self.chain}'
  
  def replace_chain(self, chain):
    """
    Replace the local chain with the incoming one if the following applies:
      - the incoming chain is longer than local one
      - the incoming chain is formatted properly
    """
    if len(self.chain) >= len(chain):
      raise Exception('Cannot replace. The incoming chain must be longer.')
    
    try:
      Blockchain.is_valid_chain(chain)
    except Exception as e:
      raise Exception(f'Cannot replace. The incoming chain is invalid: {e}')
    
    self.chain = chain

  def to_json(self):
    """
    Serialize the blockchain to a list of blocks
    """
    return list(map(lambda block: block.to_json(), self.chain))

  @staticmethod
  def from_json(json_blocks):
    """
    Deserialize a blockchain from a list of json_blocks
    """
    blockchain = Blockchain()
    blockchain.chain = list(map(lambda json_block: Block.from_json(json_block), json_blocks))
    return blockchain
  
  @staticmethod
  def is_valid_chain(chain):
    """
    the chain must start with the genesis block
    blocks must be formatted correctly
    """
    if chain[0] != Block.genesis_block():
      raise Exception('The genesis block must be valid')
    
    for i in range(1, len(chain)):
      Block.block_is_valid(chain[i - 1], chain[i])

    Blockchain.is_valid_transaction_chain(chain)

  @staticmethod
  def is_valid_transaction_chain(chain):
    """
    transaction should be unique
    a block can have at most one reward
    transaction must be valid
    """
    tx_ids = set()
    for i in range(len(chain)):
      block = chain[i]
      foundReward = False

      for tx_json in block.data:
        tx = Transaction.from_json(tx_json)
        if tx.id in tx_ids:
          raise Exception('Tx {tx.id} is not unique')
        tx_ids.add(tx.id)

        if tx.input == MINING_REWARD_INPUT:
          if foundReward:
            raise Exception('There can be only one mining reward per block. '\
                            f'Check block with hash: {block.hash}')
          foundReward = True
        else:
          historic_blockchain = Blockchain()
          historic_blockchain.chain = chain[0:i]
          historic_balance = Wallet.calculate_balance(
            historic_blockchain, tx.input['address'])
          if historic_balance != tx.input['amount']:
            raise Exception(f'tx {tx.id} has an invalid input amount')
        
        Transaction.is_valid_tx(tx)

def main():
  blockchain = Blockchain()
  # blockchain.add_block('one')        
  # blockchain.add_block('two')     
  # print(blockchain)

  wallet = Wallet()
  wallet.blockchain = blockchain
  print(f'balance: {wallet.balance}')
  tx = Transaction.reward_tx(wallet)
  #reward_block = Block.mine_block(wallet.blockchain.chain[-1], tx.to_json())
  wallet.blockchain.add_block([tx.to_json()])
  print(f'balance with rewarding: {wallet.balance}')
  client_wallet = Wallet()
  tx = Transaction(client_wallet, wallet.address, 123)
  wallet.blockchain.add_block([tx.to_json()])
  print(f'balance with transfer: {wallet.balance}')

  tx = Transaction(wallet, client_wallet.address, 200)
  wallet.blockchain.add_block([tx.to_json()])
  print(f'balance after payment: {wallet.balance}')

if __name__ == '__main__':
  main()