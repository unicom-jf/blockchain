from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={ r"/*": { "origins": "http://localhost:3000"}})

# @app.route("/hello")
# def route_default():
#   return "welcome to python-blockchain"

@app.route('/')
def route_default():
    return 'Welcome to the python-blockchain'

ROOT_PORT = 5000
PORT = ROOT_PORT
app.run(port=PORT)
