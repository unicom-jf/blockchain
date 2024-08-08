
import time
import uuid

from backend.config import MINING_REWARD_INPUT, MINING_REWARD
from backend.wallet.wallet import Wallet

class Transaction:
  """
  Documnet an exchange of cryptocurrency from a sender to one or more recipients
  """ 
  def __init__(
      self,
      send_wallet = None,
      recipient = None,
      amount = None,
      id = None,
      output = None,
      input = None) -> None:
    self.id = id or str(uuid.uuid4())[0:8]
    self.output = output or self.create_output(send_wallet, recipient, amount)
    #self.input = input or self.create_input(send_wallet, self.output)
    self.input = input or self.create_input(send_wallet)

  def create_output(self, send_wallet, recipient, amount):
    """
    Structure the output data for the transaction
    """
    if amount > send_wallet.balance:
      raise Exception('Amounts exceeds balance')
    
    output = {}
    output[recipient] = amount
    output[send_wallet.address] = send_wallet.balance - amount

    return output
  
  #def create_input(self, send_wallet, output):
  def create_input(self, send_wallet):
    """
    Structure the input data for the transaction
    Sign the transaction and include the sender's public key and address
    """
    return {
      'timestamp': time.time_ns(),
      'amount': send_wallet.balance,
      'address': send_wallet.address,
      'public_key': send_wallet.public_key,
      'signature': send_wallet.sign(self.output)
    }
  
  def to_json(self):
    """
    Serialize the transaction from __dict__
    """
    return self.__dict__
  
  @staticmethod
  def from_json(json_tx):

    return Transaction(**json_tx)
  
  @staticmethod
  def is_valid_tx(tx):
    if tx.input == MINING_REWARD_INPUT:
      if list(tx.output.values()) != [MINING_REWARD]:
        raise Exception('Invalid mining reward')
      return
    
    output_total = sum(tx.output.values())
    if output_total != tx.input['amount']:
      raise Exception('Invalid transaction output values')
    
    if not Wallet.verify(
      tx.input['public_key'],
      tx.output,
      tx.input['signature']):
      raise Exception('Invalid signature')
  
  @staticmethod
  def reward_tx(miner_wallet):
    """
    Generate a reward tx that awards the miner
    """
    output = {}
    output[miner_wallet.address] = MINING_REWARD

    return Transaction(output=output, input=MINING_REWARD_INPUT)
  
def main():
  wallet = Wallet()
  tx = Transaction.reward_tx(wallet)
  print(f'tx: {tx.__dict__}')

  try:
    tx.output[wallet.address] = 1
    Transaction.is_valid_tx(tx)
    print(f'is_valid: true')
  except Exception as e:
    print(e)

# if __name__ == '__main__':
#   main()