from gltest import get_contract_factory, create_account
from gltest.assertions import tx_execution_succeeded


def test_open_and_vouch_flow():
    factory = get_contract_factory("Vouch")
    contract = factory.deploy(args=[])

    stats = contract.get_stats(args=[]).call()
    assert stats["profiles"] == 0
    assert stats["vouches"] == 0

    # Open a profile (deterministic write, no AI)
    open_receipt = contract.open_profile(args=[
        "ada.eth",
        "Senior Solidity auditor who has led security reviews for three live DeFi protocols.",
    ]).transact()
    assert tx_execution_succeeded(open_receipt)

    profiles = contract.get_profiles(args=[0]).call()
    assert len(profiles) == 1
    pid = profiles[0]["id"]
    assert profiles[0]["status"] == "OPEN"

    # Submit a vouch from a DIFFERENT account (voucher != subject)
    voucher = create_account()
    vouch_receipt = contract.connect(voucher).submit_vouch(args=[
        pid,
        "I co-led the Q2 audit of a lending protocol with this person. They found a reentrancy "
        "path in the liquidation flow that two prior reviews missed, wrote the remediation, and "
        "the fix shipped before mainnet. I worked beside them for six weeks.",
    ]).transact()
    assert tx_execution_succeeded(vouch_receipt)

    vouched = contract.get_profile(args=[pid]).call()
    assert vouched["status"] == "VOUCHED"
    assert vouched["ruling"] in ("TRUSTED", "MIXED", "UNVERIFIED")
    assert 0 <= vouched["credibility"] <= 100
    assert vouched["vouch_count"] == 1
    if vouched["ruling"] == "TRUSTED":
        assert vouched["credibility"] >= 67
    elif vouched["ruling"] == "MIXED":
        assert 34 <= vouched["credibility"] <= 66
    else:
        assert vouched["credibility"] <= 33


def test_subject_cannot_vouch_for_self():
    factory = get_contract_factory("Vouch")
    contract = factory.deploy(args=[])

    open_receipt = contract.open_profile(args=[
        "self.eth",
        "Independent researcher seeking peer attestations of published work.",
    ]).transact()
    assert tx_execution_succeeded(open_receipt)
    pid = contract.get_profiles(args=[0]).call()[0]["id"]

    # Same account that opened the profile tries to vouch: must fail.
    receipt = contract.submit_vouch(args=[pid, "I am great, trust me, this is my own profile."]).transact()
    assert not tx_execution_succeeded(receipt)


def test_guard_rejects_empty_handle():
    factory = get_contract_factory("Vouch")
    contract = factory.deploy(args=[])
    receipt = contract.open_profile(args=["", "some claim text"]).transact()
    assert not tx_execution_succeeded(receipt)
