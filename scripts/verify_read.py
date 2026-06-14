import json
import os
from gl import make_client, read

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

with open(os.path.join(ROOT, "deployment.json"), encoding="utf-8") as f:
    ADDR = json.load(f)["contract_address"]

client, account = make_client()

print("contract:", ADDR)
print("get_stats ->", read(client, account, ADDR, "get_stats"))
print("get_profiles(0) ->", read(client, account, ADDR, "get_profiles", [0]))
print("get_attestations(0) ->", read(client, account, ADDR, "get_attestations", [0]))
