import re
import time
import urllib.request

BASE = "https://samiinw.github.io/vouch/"
UA = {"User-Agent": "Mozilla/5.0"}


def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read().decode("utf-8", "ignore")


for attempt in range(20):
    try:
        status, body = fetch(BASE)
        if status == 200 and "_next" in body:
            m = re.search(r'/vouch/_next/static/[^"]+\.js', body)
            if m:
                js_url = "https://samiinw.github.io" + m.group(0)
                js_status, _ = fetch(js_url)
                print("PAGE", status, "| JS", js_status, "|", js_url)
                if js_status == 200:
                    print("LIVE_OK")
                    break
        print("attempt", attempt, "status", status, "has_next", "_next" in body)
    except Exception as e:
        print("attempt", attempt, "error", e)
    time.sleep(20)
