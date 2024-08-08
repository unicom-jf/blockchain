import uuid
import json

from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.utils import (
  decode_dss_signature,
  encode_dss_signature
)

from backend.config import STARTING_BALANCE, MINING_REWARD, MINING_REWARD_INPUT

class Wallet:
  """
  An individual wallet for a miner, id?
  Keeps track of the miner's balance, using blockchain
  Allows a miner to authorize and issue a transaction
  """
  def __init__(self, blockchain = None):
    self.blockchain = blockchain
    self.address = str(uuid.uuid4())[0:8]
    self.private_key = ec.generate_private_key(
      ec.SECP256K1(),
      default_backend()
    )
    self.public_key = self.private_key.public_key()
    self.serialize_public_key()

  @staticmethod
  def calculate_balance(blockchain, address):
    balance = STARTING_BALANCE
    if not blockchain:
      return balance
    
    for block in blockchain.chain:
      for transaction in block.data:
        if transaction['input']['address'] == address:
          ##?
          balance = transaction['output'][address] 
        elif address in transaction['output']:
          balance += transaction['output'][address]
    return balance
  
  @staticmethod
  def verify(public_key, data, signature):
    """
    Verify a signature based on the original public key and data
    """
    deserialized_public_key = serialization.load_pem_public_key(
      public_key.encode('utf-8'),
      default_backend()
    )
    (r, s) = signature
    try:
      deserialized_public_key.verify(
        encode_dss_signature(r, s),
        json.dumps(data).encode('utf-8'),
        ec.ECDSA(hashes.SHA256())
      )
      return True
    except InvalidSignature:
      return False

  @property
  def balance(self):
    return Wallet.calculate_balance(self.blockchain, self.address)
  
  def serialize_public_key(self):
    """
    Reset the public_key to its serialized version
    """
    self.public_key = self.public_key.public_bytes(
      serialization.Encoding.PEM,
      serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode('utf-8')

  def sign(self, data):
    """
    Generate a signature based on the data and the local private key
    """
    return decode_dss_signature(self.private_key.sign(
      json.dumps(data).encode('utf-8'),
      ec.ECDSA(hashes.SHA256())
    ))
  
def main():
  wallet = Wallet()
  print(f'wallet.__dict__:, {wallet.__dict__}')
  data = {'foo': 'bar'}
  signature = wallet.sign(data)
  print(f'sig: {signature}')
  should_be_valid = Wallet.verify(wallet.public_key, data, signature)
  print(f'ok: {should_be_valid}')
  should_be_invalid = Wallet.verify(Wallet().public_key, data, signature)
  print(f'ok: {should_be_invalid}')

# if __name__ == '__main__':
#   main()