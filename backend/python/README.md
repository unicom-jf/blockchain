pip install pytest
python -m pytest tests

pythonpath=
PYTHONPATH=

pip install cryptography

Get-ChildItem Env:PYTHONPATH

--main node
New-Item -Path Env:\SEED_DATA -Value 'True'
py -m python.app

--other node
New-Item -Path Env:\PEER -Value 'True'
py -m python.app

export SEED_DATA=True && python3 -m python.app

export PEER=True && python3 -m python.app

export SEED_DATA=True && python3 -m python.app

export PEER=True && python3 -m python.app
