import json
import os
import time
from gl import make_client, read
from genlayer_py import create_account, create_client
from genlayer_py.chains import testnet_bradbury
from genlayer_py.types import TransactionStatus

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

with open(os.path.join(ROOT, "deployment.json"), encoding="utf-8") as f:
    ADDR = json.load(f)["contract_address"]

client, account = make_client()


def native_transfer(to_addr: str, gen: float):
    nonce = client.get_transaction_count(account.address)
    gp = client.gas_price
    tx = {
        "to": to_addr,
        "value": int(gen * 10**18),
        "nonce": nonce,
        "chainId": client.chain.id,
        "gas": 30000,
        "maxFeePerGas": gp,
        "maxPriorityFeePerGas": gp,
    }
    signed = account.sign_transaction(tx)
    return client.send_raw_transaction(signed.raw_transaction)


print("Opening a profile (subject = .env account)...")
tx1 = client.write_contract(
    address=ADDR,
    function_name="open_profile",
    args=[
        "ada.eth",
        "Senior smart-contract auditor who has led security reviews for live DeFi protocols and "
        "ships remediations before mainnet.",
    ],
)
print("open tx:", tx1)
client.wait_for_transaction_receipt(transaction_hash=tx1, status=TransactionStatus.ACCEPTED, interval=6000, retries=120)
profiles = read(client, account, ADDR, "get_profiles", [0])
pid = profiles[-1]["id"]
print("profile id:", pid)

# A vouch must come from a DIFFERENT address than the subject.
voucher = create_account()
print("Funding voucher", voucher.address, "...")
native_transfer(voucher.address, 3)
bal = 0
for _ in range(30):
    time.sleep(5)
    bal = client.get_balance(voucher.address) / 10**18
    if bal > 0:
        break
print("voucher balance:", bal, "GEN")

vclient = create_client(chain=testnet_bradbury, account=voucher)
print("Submitting a vouch (voucher, AI write under consensus)...")
tx2 = vclient.write_contract(
    address=ADDR,
    function_name="submit_vouch",
    args=[
        pid,
        "I co-led the Q2 audit of a lending protocol with this person. They found a reentrancy "
        "path in the liquidation flow that two prior reviews missed, wrote the remediation, and "
        "the fix shipped before mainnet. I worked beside them for six weeks.",
    ],
)
print("vouch tx:", tx2)
vclient.wait_for_transaction_receipt(transaction_hash=tx2, status=TransactionStatus.ACCEPTED, interval=8000, retries=120)
time.sleep(3)
print("stats:", read(client, account, ADDR, "get_stats"))
print("vouched profile ->", read(client, account, ADDR, "get_profile", [pid]))
