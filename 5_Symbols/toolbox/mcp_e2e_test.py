#!/usr/bin/env python3
"""MCP e2e check — proves the custom Canva workspace-assistant server works over stdio.

Spawns `node dist/src/index.js` from 5_Symbols/mcp-server and drives a real MCP
session: initialize → tools/list → tools/call (both tools). Exit 0 = it works.

Usage:
    python3 5_Symbols/toolbox/mcp_e2e_test.py
"""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SERVER_DIR = os.path.join(ROOT, "5_Symbols", "mcp-server")
SERVER_JS = os.path.join(SERVER_DIR, "dist", "src", "index.js")


def rpc(id_, method, params=None):
    msg = {"jsonrpc": "2.0", "id": id_, "method": method}
    if params is not None:
        msg["params"] = params
    return json.dumps(msg) + "\n"


def main():
    if not os.path.exists(SERVER_JS):
        sys.exit(f"FAIL: {SERVER_JS} missing — run `npm run build` in 5_Symbols/mcp-server first")

    requests = (
        rpc(1, "initialize", {
            "protocolVersion": "2024-11-05",
            "capabilities": {},
            "clientInfo": {"name": "mcp-e2e-test", "version": "1.0.0"},
        })
        + json.dumps({"jsonrpc": "2.0", "method": "notifications/initialized"}) + "\n"
        + rpc(2, "tools/list")
        + rpc(3, "tools/call", {
            "name": "generate_design_brief",
            "arguments": {
                "clientName": "Pexabo",
                "description": "Landing page hero visuals for the Canva MCP launch",
                "brandColors": ["#8b5cf6", "#1e293b"],
                "deliverables": ["Instagram post", "Slide deck cover"],
                "tone": "confident, modern",
            },
        })
        + rpc(4, "tools/call", {
            "name": "stage_assets",
            "arguments": {
                "assetGroup": "Pexabo Canva MCP Launch",
                "urls": ["https://example.com/logo.png", "https://example.com/hero.jpg"],
                "tags": ["pexabo", "launch"],
            },
        })
    )

    proc = subprocess.run(
        ["node", SERVER_JS],
        input=requests, capture_output=True, text=True, timeout=30, cwd=SERVER_DIR,
    )

    responses = {}
    for line in proc.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            msg = json.loads(line)
        except json.JSONDecodeError:
            continue
        if "id" in msg:
            responses[msg["id"]] = msg

    checks = []

    init = responses.get(1, {})
    checks.append(("initialize", "result" in init,
                   init.get("result", {}).get("serverInfo", {}).get("name", init.get("error", ""))))

    tools = [t["name"] for t in responses.get(2, {}).get("result", {}).get("tools", [])]
    expected = {"generate_design_brief", "stage_assets"}
    checks.append(("tools/list", expected <= set(tools), ", ".join(tools) or "no tools"))

    for id_, name in ((3, "generate_design_brief"), (4, "stage_assets")):
        r = responses.get(id_, {})
        ok = "result" in r and not r.get("result", {}).get("isError")
        content = r.get("result", {}).get("content", [{}])
        preview = (content[0].get("text", "") if content else "")[:60].replace("\n", " ")
        checks.append((f"tools/call {name}", ok, preview or str(r.get("error", ""))))

    width = max(len(c[0]) for c in checks)
    failed = 0
    for name, ok, detail in checks:
        print(f"{'PASS' if ok else 'FAIL'}  {name.ljust(width)}  {detail}")
        failed += 0 if ok else 1

    if proc.stderr.strip() and failed:
        print("--- server stderr ---\n" + proc.stderr[-800:], file=sys.stderr)

    print(f"\n{len(checks) - failed}/{len(checks)} MCP e2e checks passed.")
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
