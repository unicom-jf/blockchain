from python.utils.crypto_hash import crypto_hash

def test_crypto_hash():
  """
  same hash result with same input
  """
  
  hash_1 = crypto_hash('one', 2, [3])
  hash_2 = crypto_hash('one', 2, [3])
  assert hash_1 == hash_2
