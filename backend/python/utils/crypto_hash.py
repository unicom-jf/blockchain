import hashlib
import json

def crypto_hash(*args):
  """
  return a sha-256 hash of given args
  """
  stringified_args = map(lambda data: json.dumps(data), args)
  joined_data = ''.join(stringified_args)
  return hashlib.sha256(joined_data.encode("utf-8")).hexdigest()

def main():
  print(f"crypto_hash('one', 2, [3]): {crypto_hash('one', 2, [3])}")

if __name__ == "__main__":
  main()