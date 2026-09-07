#!/usr/bin/env python3
"""SPEC-020: render 1–100 atomic circle+numeral badges and import to Canva.

Each badge is one PNG (circle + number baked together) so Canva import
cannot split them. Credentials come from gitignored
5_Symbols/mcp-server/.env — never printed.
"""
from __future__ import annotations

import base64
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
ENV_PATH = ROOT / "5_Symbols" / "mcp-server" / ".env"
SIM = ROOT / "3_Simulation"
PPTX_PATH = SIM / "numbers_1_100_atomic.pptx"
PREVIEW_PATH = SIM / "numbers_1_100_atomic_preview.png"
VENV = Path(__file__).resolve().parent / ".venv"

PALETTE = [
    ("#1D4ED8", "#FFFFFF"),
    ("#DC2626", "#FFFFFF"),
    ("#059669", "#FFFFFF"),
    ("#F59E0B", "#111827"),
    ("#7C3AED", "#FFFFFF"),
    ("#0E7490", "#FFFFFF"),
    ("#DB2777", "#FFFFFF"),
    ("#4D7C0F", "#FFFFFF"),
    ("#0F172A", "#FBBF24"),
    ("#EA580C", "#FFFFFF"),
]


def load_env(path: Path) -> dict[str, str]:
    env: dict[str, str] = {}
    for raw in path.read_text().splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, val = line.split("=", 1)
        env[key.strip()] = val.strip().strip('"').strip("'")
    return env


def write_env_keys(path: Path, updates: dict[str, str]) -> None:
    lines = path.read_text().splitlines()
    seen = set()
    out = []
    for line in lines:
        stripped = line.strip()
        if stripped and not stripped.startswith("#") and "=" in stripped:
            key = stripped.split("=", 1)[0].strip()
            if key in updates:
                out.append(f"{key}={updates[key]}")
                seen.add(key)
                continue
        out.append(line)
    for key, val in updates.items():
        if key not in seen:
            out.append(f"{key}={val}")
    path.write_text("\n".join(out) + "\n")


def hex_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def ensure_pptx() -> None:
    try:
        import pptx  # noqa: F401
        return
    except ImportError:
        pass
    if not (VENV / "bin" / "python").exists():
        subprocess.check_call([sys.executable, "-m", "venv", str(VENV)])
    pip = VENV / "bin" / "pip"
    subprocess.check_call([str(pip), "install", "--quiet", "python-pptx", "Pillow"])
    os.execv(str(VENV / "bin" / "python"), [str(VENV / "bin" / "python"), *sys.argv])


def render_badge(n: int, size: int = 256):
    from PIL import Image, ImageDraw, ImageFont

    bg, fg = PALETTE[(n - 1) // 10]
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    inset = 2
    draw.ellipse([inset, inset, size - 1 - inset, size - 1 - inset], fill=hex_rgb(bg) + (255,))
    font_size = 118 if n < 100 else 96
    font = None
    for candidate in (
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/Library/Fonts/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
    ):
        if Path(candidate).exists():
            try:
                font = ImageFont.truetype(candidate, font_size)
                break
            except OSError:
                continue
    if font is None:
        font = ImageFont.load_default()
    text = str(n)
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1]
    draw.text((x, y), text, fill=hex_rgb(fg) + (255,), font=font)
    return img


def build_pptx(badge_dir: Path) -> None:
    from pptx import Presentation
    from pptx.dml.color import RGBColor
    from pptx.enum.text import PP_ALIGN
    from pptx.util import Emu, Pt

    # Square canvas similar to the screenshot (~1080×1080 at 96dpi ≈ 11.25in)
    side = Emu(10287000)  # 10.8 inches
    prs = Presentation()
    prs.slide_width = side
    prs.slide_height = side
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # blank

    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = RGBColor(0xFF, 0xFF, 0xFF)

    margin = Emu(457200)  # 0.5 in
    title_h = Emu(548640)  # 0.6 in
    gap = Emu(91440)  # 0.1 in
    usable_w = side - margin * 2
    usable_h = side - margin - title_h
    cell = min((usable_w - gap * 9) // 10, (usable_h - gap * 9) // 10)

    box = slide.shapes.add_textbox(margin, Emu(182880), usable_w, title_h)
    tf = box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "1–100  ·  each number grouped with its circle"
    p.alignment = PP_ALIGN.CENTER
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = RGBColor(0x33, 0x41, 0x55)

    for n in range(1, 101):
        img_path = badge_dir / f"{n:03d}.png"
        col = (n - 1) % 10
        row = (n - 1) // 10
        left = margin + col * (cell + gap)
        top = title_h + row * (cell + gap)
        pic = slide.shapes.add_picture(str(img_path), left, top, cell, cell)
        pic.name = f"Number {n}"

    prs.save(str(PPTX_PATH))


def build_preview(badge_dir: Path) -> None:
    from PIL import Image, ImageDraw, ImageFont

    canvas = 1200
    img = Image.new("RGB", (canvas, canvas), (255, 255, 255))
    draw = ImageDraw.Draw(img)
    try:
        font = ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 22)
    except OSError:
        font = ImageFont.load_default()
    draw.text((canvas // 2, 28), "1–100  ·  each number grouped with its circle", fill=(51, 65, 85), font=font, anchor="mt")
    margin, title_h, gap = 48, 64, 10
    size = (canvas - margin * 2 - gap * 9) // 10
    for n in range(1, 101):
        badge = Image.open(badge_dir / f"{n:03d}.png").convert("RGBA").resize((size, size))
        col = (n - 1) % 10
        row = (n - 1) // 10
        x = margin + col * (size + gap)
        y = title_h + row * (size + gap)
        img.paste(badge, (x, y), badge)
    img.save(PREVIEW_PATH)


def http_json(method: str, url: str, *, headers: dict, data: bytes | None = None) -> dict:
    req = urllib.request.Request(url, data=data, method=method, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            body = resp.read().decode()
            return json.loads(body) if body else {}
    except urllib.error.HTTPError as exc:
        err = exc.read().decode()
        raise SystemExit(f"HTTP {exc.code} {url}: {err[:500]}") from exc


def refresh_token(env: dict[str, str]) -> dict[str, str]:
    client_id = env["CANVA_CLIENT_ID"]
    client_secret = env["CANVA_CLIENT_SECRET"]
    refresh = env["CANVA_REFRESH_TOKEN"]
    basic = base64.b64encode(f"{client_id}:{client_secret}".encode()).decode()
    payload = urllib.parse.urlencode(
        {"grant_type": "refresh_token", "refresh_token": refresh}
    ).encode()
    data = http_json(
        "POST",
        "https://api.canva.com/rest/v1/oauth/token",
        headers={
            "Authorization": f"Basic {basic}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data=payload,
    )
    if "access_token" not in data:
        raise SystemExit(f"token refresh failed: keys={list(data)}")
    print(
        f"token refresh ok: expires_in={data.get('expires_in')} "
        f"scope={data.get('scope')} access_len={len(data['access_token'])}"
    )
    return data


def import_pptx(access_token: str) -> dict:
    title = "Numbers 1-100 grouped"
    meta = json.dumps(
        {
            "title_base64": base64.b64encode(title.encode()).decode(),
            "mime_type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        }
    )
    body = PPTX_PATH.read_bytes()
    data = http_json(
        "POST",
        "https://api.canva.com/rest/v1/imports",
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/octet-stream",
            "Import-Metadata": meta,
        },
        data=body,
    )
    job = data.get("job") or {}
    job_id = job.get("id")
    if not job_id:
        raise SystemExit(f"import did not return job id: {data}")
    print(f"import job {job_id} status={job.get('status')}")
    for _ in range(40):
        if job.get("status") in ("success", "failed"):
            break
        time.sleep(1.5)
        data = http_json(
            "GET",
            f"https://api.canva.com/rest/v1/imports/{job_id}",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        job = data.get("job") or {}
        print(f"  poll status={job.get('status')}")
    if job.get("status") != "success":
        raise SystemExit(f"import failed: {json.dumps(job)[:800]}")
    return job


def main() -> None:
    ensure_pptx()
    if not ENV_PATH.exists():
        raise SystemExit(f"missing gitignored env: {ENV_PATH}")
    env = load_env(ENV_PATH)
    required = ("CANVA_CLIENT_ID", "CANVA_CLIENT_SECRET", "CANVA_REFRESH_TOKEN")
    missing = [k for k in required if not env.get(k)]
    if missing:
        raise SystemExit(f"missing keys in {ENV_PATH}: {missing}")
    print(f"using gitignored env {ENV_PATH.relative_to(ROOT)}")
    print(f"CANVA_CLIENT_ID prefix={env['CANVA_CLIENT_ID'][:6]}…")

    tokens = refresh_token(env)
    write_env_keys(
        ENV_PATH,
        {
            "CANVA_ACCESS_TOKEN": tokens["access_token"],
            "CANVA_REFRESH_TOKEN": tokens.get("refresh_token") or env["CANVA_REFRESH_TOKEN"],
        },
    )
    print("wrote rotated tokens back to gitignored .env (values not logged)")

    SIM.mkdir(parents=True, exist_ok=True)
    badge_dir = SIM / "_badge_pngs"
    badge_dir.mkdir(exist_ok=True)
    for n in range(1, 101):
        render_badge(n).save(badge_dir / f"{n:03d}.png")
    build_pptx(badge_dir)
    build_preview(badge_dir)
    print(f"wrote {PPTX_PATH.relative_to(ROOT)} ({PPTX_PATH.stat().st_size} bytes)")
    print(f"wrote {PREVIEW_PATH.relative_to(ROOT)}")

    job = import_pptx(tokens["access_token"])
    designs = (job.get("result") or {}).get("designs") or []
    if not designs:
        raise SystemExit(f"import success but no designs: {job}")
    design = designs[0]
    design_id = design.get("id")
    url = design.get("url") or f"https://www.canva.com/design/{design_id}/edit"
    edit = (design.get("urls") or {}).get("edit_url") or url
    print(f"DESIGN_ID={design_id}")
    print(f"TITLE={design.get('title')}")
    print(f"EDIT_URL={edit}")
    print(f"PERM_URL=https://www.canva.com/design/{design_id}/edit")
    (SIM / "numbers_1_100_atomic_import.json").write_text(
        json.dumps(
            {
                "design_id": design_id,
                "title": design.get("title"),
                "url": f"https://www.canva.com/design/{design_id}/edit",
            },
            indent=2,
        )
        + "\n"
    )


if __name__ == "__main__":
    main()
