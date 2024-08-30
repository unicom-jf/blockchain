import os
import random
import requests

from flask import Flask, jsonify, request
from flask_cors import CORS
from python.blockchain.blockchain import Blockchain
from python.wallet.wallet import Wallet
from python.wallet.transaction import Transaction
from python.wallet.transaction_pool import TransactionPool
app = Flask(__name__)
CORS(app, resources={ r"/*": { "origins": "http://localhost:3000"}})
blockchain = Blockchain()
wallet = Wallet(blockchain)
tx_pool = TransactionPool()

# @app.route("/hello")
# def route_default():
#   return "welcome to python-blockchain"

@app.route('/')
def route_default():
    return 'Welcome to the python-blockchain'

@app.route("/blockchain")
def route_blockchain():
    return jsonify(blockchain.to_json())

@app.route("/wallet/info")
def route_wallet_info():
    return jsonify({ "address": wallet.address, "balance": wallet.balance })

ROOT_PORT = 5000
PORT = ROOT_PORT

if os.environ.get('PEER') == "True":
    PORT = random.randint(5001, 6000)
    result = requests.get(f"http://localhost:{ROOT_PORT}/blockchain")
    result_blockchain = Blockchain.from_json(result.json())
    try:
        blockchain.replace_chain(result_blockchain)
        print('\n---successfully synchronized the local chain')
    except Exception as e:
        print("\n --- error synchronizing: {e}")

if os.environ.get("SEED_DATA") == "True":
    for i in range(10):
        blockchain.add_block([
            Transaction(Wallet(), Wallet().address, random.randint(2,50)).to_json(),
            Transaction(Wallet(), Wallet().address, random.randint(2,50)).to_json()
        ])
    for i in range(3):
        tx_pool.set_transaction(Transaction(Wallet(), Wallet().address, random.randint(2,50)).to_json())

print(f"server running on: {PORT}")
app.run(port=PORT)
