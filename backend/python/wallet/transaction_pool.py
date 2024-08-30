class TransactionPool:
  def __init__(self):
    self.transaction_map = {}

  def set_transaction(self, tx):
    """
    Set a tx in the tx_pool
    """
    self.transaction_map[tx["id"]] = tx

  def find_first_tx(self, address):
    for tx in self.transaction_map.values():
      if tx.input["address"] == address:
        return tx
      
  def tx_data(self):
    return list(map(
      lambda tx: tx.to_json(), self.transaction_map.values()))

  def remove_chained_tx(self, blockchain):
    for block in blockchain:
      for tx in block.data:
        try:
          del self.transaction_map[tx.id]
        except KeyError:
          pass
  