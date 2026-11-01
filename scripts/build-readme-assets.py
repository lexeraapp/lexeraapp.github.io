#!/usr/bin/env python3
"""Generates every SVG used by README.md into ./assets.

Text is converted to outlines from the project's own Fontsource fonts, so the artwork renders the same on GitHub
as it does in the app (GitHub blocks web fonts inside images). Run after `npm install`:

    pip install fonttools
    python3 scripts/build-readme-assets.py
"""
import math
import os
import random
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / "node_modules" / "@fontsource"
OUT = ROOT / "assets"
for sub in ("", "badges", "icons"):
    (OUT / sub).mkdir(parents=True, exist_ok=True)

# ---- tokens (mirror src/styles/tokens.css) ---------------------------------------------------------------
BG, BG2, BG3 = "#08090b", "#0d1013", "#12161a"
TEXT, TEXT2, TEXT3 = "#e6e3da", "#9aa3a8", "#7f8589"
ACC, ACCB = "#7c8891", "#c9cfd2"
OK, NEAR, BAD = "#9dbba9", "#cdbb8c", "#c88f86"
LINE, LINEH = "rgba(214,219,222,0.09)", "rgba(214,219,222,0.2)"
SURF = "rgba(214,219,222,0.035)"
EASE = "cubic-bezier(.16,.4,.15,1)"


class Font:
    def __init__(self, family, name):
        self.fonts = []
        for subset in ("latin", "latin-ext"):
            p = FONTS / family / "files" / f"{family}-{subset}-{name}.woff"
            if p.exists():
                self.fonts.append(TTFont(str(p)))

    def _find(self, ch):
        for f in self.fonts:
            cm = f.getBestCmap()
            if ord(ch) in cm:
                return f, cm[ord(ch)]
        return self.fonts[0], ".notdef"

    def width(self, s, size, ls=0.0):
        w = 0.0
        for ch in s:
            f, g = self._find(ch)
            w += f["hmtx"][g][0] * size / f["head"].unitsPerEm + ls
        return w

    def path(self, s, size, x, y, ls=0.0):
        d = ""
        cur = x
        for ch in s:
            f, g = self._find(ch)
            k = size / f["head"].unitsPerEm
            pen = SVGPathPen(f.getGlyphSet(), ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
            f.getGlyphSet()[g].draw(TransformPen(pen, (k, 0, 0, -k, cur, y)))
            d += pen.getCommands()
            cur += f["hmtx"][g][0] * k + ls
        return d


DISP_I = Font("cormorant-garamond", "300-italic")
DISP = Font("cormorant-garamond", "500-normal")
DISP4 = Font("cormorant-garamond", "400-normal")
BODY = Font("jost", "400-normal")
BODYM = Font("jost", "500-normal")
MONO = Font("jetbrains-mono", "400-normal")


def T(s, font, size, x, y, fill=TEXT, anchor="start", ls=0.0, op=None, cls=None, extra=""):
    w = font.width(s, size, ls)
    if anchor == "middle":
        x -= w / 2
    elif anchor == "end":
        x -= w
    o = f' opacity="{op}"' if op is not None else ""
    c = f' class="{cls}"' if cls else ""
    return f'<path{c} fill="{fill}"{o}{extra} d="{font.path(s, size, x, y, ls)}"/>'


def wrap(s, font, size, maxw):
    lines, cur = [], ""
    for word in s.split():
        t = (cur + " " + word).strip()
        if font.width(t, size) <= maxw:
            cur = t
        else:
            lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def para(s, font, size, x, y, maxw, fill=TEXT2, lh=1.5, cls=None):
    return "".join(T(l, font, size, x, y + i * size * lh, fill, cls=cls) for i, l in enumerate(wrap(s, font, size, maxw)))


COMMON_DEFS = f"""
<linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{BG}"/><stop offset=".5" stop-color="{BG2}"/><stop offset="1" stop-color="{BG}"/></linearGradient>
<radialGradient id="glow" cx=".5" cy="0" r=".8"><stop offset="0" stop-color="{ACC}" stop-opacity=".11"/><stop offset="1" stop-color="{BG}" stop-opacity="0"/></radialGradient>
<filter id="noise" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="matrix" values="0 0 0 0 .55  0 0 0 0 .58  0 0 0 0 .6  0 0 0 .5 0"/></filter>
"""
BASE_CSS = f"""
@keyframes up{{from{{opacity:0;transform:translateY(14px)}}to{{opacity:1;transform:none}}}}
@keyframes fade{{from{{opacity:0}}to{{opacity:1}}}}
@keyframes draw{{from{{stroke-dashoffset:1}}to{{stroke-dashoffset:0}}}}
@keyframes breathe{{0%,100%{{opacity:.35}}50%{{opacity:.9}}}}
@keyframes rot{{to{{transform:rotate(360deg)}}}}
.u{{animation:up 1s {EASE} backwards}}
.f{{animation:fade 1.2s ease-out backwards}}
.dr{{stroke-dasharray:1;animation:draw 1.8s cubic-bezier(.65,0,.35,1) backwards}}
.br{{animation:breathe 7s ease-in-out infinite}}
@media (prefers-reduced-motion:reduce){{*{{animation:none!important}}}}
"""


def svg(w, h, title, desc, body, css="", defs="", frame=True):
    fr = f'<rect x=".5" y=".5" width="{w-1}" height="{h-1}" fill="none" stroke="{LINE}"/>' if frame else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img">'
        f"<title>{title}</title><desc>{desc}</desc><defs>{COMMON_DEFS}{defs}<style>{BASE_CSS}{css}</style></defs>"
        f'<rect width="{w}" height="{h}" fill="url(#bgGrad)"/><rect width="{w}" height="{h}" fill="url(#glow)"/>'
        f'<rect width="{w}" height="{h}" filter="url(#noise)" opacity=".05"/>{fr}{body}</svg>'
    )


def save(name, s):
    (OUT / name).write_text(s, encoding="utf8")


def delay(i, base=0.0, step=0.12):
    return f' style="animation-delay:{base + i * step:.2f}s"'


# ---- icons (24 grid, same family as the in-app icon set) -----------------------------------------------------
def circ(cx, cy, r):
    return f"M{cx - r} {cy}a{r} {r} 0 1 0 {2 * r} 0a{r} {r} 0 1 0 {-2 * r} 0"


ICONS = {
    "tulip": ["M12 3c-3 4-3 8 0 11 3-3 3-7 0-11z", "M11 14c-4-1-6-5-5.5-8.5 2.5 1.5 4 4 4.5 6.5", "M13 14c4-1 6-5 5.5-8.5-2.5 1.5-4 4-4.5 6.5", "M12 14v7"],
    "path": ["M7 21c0-5 10-4 10-9S8 8 8 3", circ(7, 21, 1.2), circ(8, 3, 1.2)],
    "practice": [circ(12, 12, 9), circ(12, 12, 5), circ(12, 12, 1)],
    "atlas": ["M3 5.5c3-1 6-1 9 1 3-2 6-2 9-1V19c-3-1-6-1-9 1-3-2-6-2-9-1z", "M12 6.5V20"],
    "you": ["M4.5 20c1-4 4-6 7.5-6s6.5 2 7.5 6", circ(12, 8, 4)],
    "ember": ["M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-6 1-9z"],
    "star": ["M12 3c.6 4.6 3.4 7.4 9 9-5.6 1.6-8.4 4.4-9 9-.6-4.6-3.4-7.4-9-9 5.6-1.6 8.4-4.4 9-9z"],
    "lock": ["M6 11h12v9H6z", "M8.5 11V8a3.5 3.5 0 0 1 7 0v3"],
    "check": ["M5 12.5l4.5 4.5L19 7"],
    "speaker": ["M4 9.5h3.5L12 6v12l-4.5-3.5H4z", "M15.5 9a4 4 0 0 1 0 6", "M18 6.5a8 8 0 0 1 0 11"],
    "shield": ["M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z", "M9 12l2.2 2.2L15.2 10"],
    "bolt": ["M13 3L5 13h6l-1 8 8-10h-6z"],
    "repeat": ["M17 7H8a4 4 0 0 0-4 4", "M7 17h9a4 4 0 0 0 4-4", "M15 4l3 3-3 3", "M9 20l-3-3 3-3"],
    "headphones": ["M4 14v-2a8 8 0 0 1 16 0v2", "M4 14h3v6H4z", "M17 14h3v6h-3z"],
    "pen": ["M4 20l1-4L16 5l3 3L8 19z", "M14 7l3 3"],
    "grid": ["M4 4h7v7H4z", "M13 4h7v7h-7z", "M4 13h7v7H4z", "M13 13h7v7h-7z"],
    "harmony": ["M3 9c3-4 6 4 9 0s6-4 9 0", "M3 15c3-4 6 4 9 0s6-4 9 0"],
    "target": [circ(12, 12, 9), circ(12, 12, 4.5), circ(12, 12, .8)],
    "build": ["M4 8h6v4H4z", "M14 8h6v4h-6z", "M9 15h6v4H9z"],
    "flag": ["M6 21V4", "M6 5h11l-2 4 2 4H6"],
    "download": ["M12 4v11", "M7 11l5 5 5-5", "M5 20h14"],
    "layers": ["M12 3l9 5-9 5-9-5z", "M3 13l9 5 9-5", "M3 17.5l9 5 9-5"],
    "terminal": ["M4 5h16v14H4z", "M7.5 9.5l3 2.5-3 2.5", "M13 15h4"],
    "cloud": ["M7 18a4 4 0 0 1-.5-7.9A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 9.5z"],
    "palette": ["M12 3a9 9 0 1 0 0 18c1.5 0 2-1 1.5-2-.6-1.2.2-2.500 1.700-2.500H17a4 4 0 0 0 4-4C21 6.500 17 3 12 3z", circ(7.5, 11, 1), circ(10, 7, 1), circ(15, 7.5, 1)],
    "book": ["M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z", "M5 17a3 3 0 0 1 3-3h11"],
    "phone": ["M7 3h10v18H7z", "M11 18h2"],
    "scale": ["M12 4v16", "M6 20h12", "M5 8h14", "M5 8l-2.500 6a3 3 0 0 0 5 0z", "M19 8l-2.500 6a3 3 0 0 0 5 0z"],
    "code": ["M8 7l-5 5 5 5", "M16 7l5 5-5 5", "M14 5l-4 14"],
    "blocks": ["M4 14h7v6H4z", "M13 14h7v6h-7z", "M8.5 4h7v6h-7z"],
    "user": ["M4.5 20c1-4 4-6 7.5-6s6.5 2 7.5 6", circ(12, 8, 4)],
    "info": ["M12 11v6", "M12 7.5v.2", circ(12, 12, 9)],
    "bell": ["M6 17V11a6 6 0 0 1 12 0v6l1.500 2h-15z", "M10 21h4"],
}


def icon_group(name, x, y, size, color=ACC, sw=1.4, anim_delay=None):
    k = size / 24
    cls = ' class="dr"' if anim_delay is not None else ""
    st = f' style="animation-delay:{anim_delay:.2f}s"' if anim_delay is not None else ""
    ps = "".join(f'<path{cls}{st} pathLength="1" d="{d}"/>' for d in ICONS[name])
    return f'<g transform="translate({x} {y}) scale({k:.4f})" fill="none" stroke="{color}" stroke-width="{sw / k:.3f}" stroke-linecap="round" stroke-linejoin="round">{ps}</g>'


for i, name in enumerate(ICONS):
    paths = "".join(f'<path pathLength="1" class="d" d="{d}"/>' for d in ICONS[name])
    save(
        f"icons/{name}.svg",
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="{ACC}" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">'
        f"<style>@keyframes dr{{0%{{opacity:0;stroke-dasharray:1;stroke-dashoffset:1}}6%{{opacity:1}}13%{{stroke-dasharray:1;stroke-dashoffset:0}}13.01%{{stroke-dasharray:none;stroke-dashoffset:0;opacity:1}}100%{{stroke-dasharray:none;stroke-dashoffset:0;opacity:1}}}}"
        f".d{{animation:dr 9s cubic-bezier(.65,0,.35,1) -{(i * 0.7) % 9:.1f}s infinite}}@media (prefers-reduced-motion:reduce){{.d{{animation:none}}}}</style>{paths}</svg>",
    )

# ---- badges ---------------------------------------------------------------------------------------------------
BADGES = [
    ("version", "VERSION", "1.0.0", ACC, "tag"), ("license", "LICENSE", "MIT", ACC, "scale"),
    ("react", "REACT", "19", "#5a8fd4", "atlas"), ("typescript", "TYPESCRIPT", "5.9 strict", "#5a8fd4", "code"),
    ("vite", "VITE", "7", "#c9a45a", "bolt"), ("vitest", "VITEST", "3", OK, "check"),
    ("tests", "TESTS", "23 passing", OK, "shield"), ("oop", "ARCHITECTURE", "OOP TypeScript", ACC, "blocks"),
    ("pwa", "PWA", "Installable", ACC, "download"), ("offline", "OFFLINE", "Ready", OK, "cloud"),
    ("mobile-first", "LAYOUT", "Mobile-first", ACC, "phone"), ("no-account", "ACCOUNT", "None needed", ACC, "user"),
    ("spaced", "REVIEW", "Spaced retrieval", NEAR, "repeat"), ("turkish", "LANGUAGE", "Turkish", NEAR, "book"),
    ("levels", "LEVELS", "A1 to B1", NEAR, "layers"), ("github-pages", "DEPLOYED ON", "GitHub Pages", ACC, "cloud"),
]
ICONS["tag"] = ["M3 12V4h8l10 10-8 8z", circ(7.5, 8.5, 1.2)]
for name, label, value, color, ic in BADGES:
    lw, vw = BODY.width(label, 9.5, 0.9), BODYM.width(value, 12.5)
    w = round(14 + 18 + 8 + lw + 14 + vw + 14)
    dvx = round(14 + 18 + 8 + lw + 7)
    body = (
        f'<clipPath id="pc"><rect x=".5" y=".5" width="{w - 1}" height="31" rx="2"/></clipPath>'
        f'<rect class="f" x=".5" y=".5" width="{w - 1}" height="31" rx="2" fill="{BG2}" stroke="{color}" stroke-opacity=".45"/>'
        f'<g class="f">{icon_group(ic, 13, 8, 15, ACCB, 1.5)}</g>'
        f'{T(label, BODY, 9.5, 14 + 18 + 4, 20.2, TEXT3, ls=0.9)}'
        f'<rect x="{dvx}" y="9" width="1" height="14" fill="{LINEH}"/>'
        f'{T(value, BODYM, 12.5, dvx + 7, 20.6, TEXT)}'
        f'<g clip-path="url(#pc)"><g class="sh"><rect x="-30" y="-4" width="22" height="40" fill="#fff" fill-opacity=".1" transform="skewX(-18)"/></g></g>'
    )
    css = f"@keyframes sh{{0%,86%{{transform:translateX(0);opacity:0}}88%{{opacity:1}}100%{{transform:translateX({w + 50}px);opacity:0}}}}.sh{{animation:sh 9s linear {(len(name) % 5) * 1.3:.1f}s infinite}}"
    save(
        f"badges/{name}.svg",
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} 32" width="{w}" height="32" role="img"><title>{label.title()}: {value}</title>'
        f"<style>@keyframes fade{{from{{opacity:0}}}}.f{{animation:fade .8s ease-out backwards}}{css}@media (prefers-reduced-motion:reduce){{*{{animation:none!important}}}}</style>{body}</svg>",
    )

# ---- banner -------------------------------------------------------------------------------------------------
def logo(x, y, size, animate=True):
    k = size / 64
    a = ' class="dr"' if animate else ""
    return (
        f'<g transform="translate({x} {y}) scale({k:.4f})" fill="none" stroke-linecap="round" stroke-linejoin="round">'
        f'<circle cx="32" cy="32" r="26" stroke="{ACC}" stroke-width="1.2" opacity=".7"/>'
        f'<g stroke="{TEXT}" stroke-width="1.7"><path{a} pathLength="1" d="M32 13c-7 9-7 20 0 28 7-8 7-19 0-28z" fill="{TEXT}" fill-opacity=".14"/>'
        f'<path{a} pathLength="1" d="M30 40C21 37 17 28 18 20c6 3 10 9 11.5 15"/><path{a} pathLength="1" d="M34 40c9-3 13-12 12-20-6 3-10 9-11.5 15"/>'
        f'<path{a} pathLength="1" d="M32 41v14"/><path{a} pathLength="1" d="M32 50c-5 0-8-2.5-9-6 5 0 8 2 9 6z"/></g></g>'
    )


def banner(animated):
    W, H = 1280, 436
    rnd = random.Random(7)
    motes = "".join(
        f'<circle class="m" cx="{rnd.uniform(40, 1240):.0f}" cy="{rnd.uniform(40, 400):.0f}" r="{rnd.uniform(.6, 1.6):.1f}" fill="{TEXT if rnd.random() > .15 else ACCB}" opacity=".3" style="animation-delay:-{rnd.uniform(0, 14):.1f}s;animation-duration:{rnd.uniform(11, 20):.0f}s"/>'
        for _ in range(34)
    )
    cx, cy = 930, 190
    halo = "".join(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="none" stroke="rgba(214,219,222,{o})" stroke-width="1"{d}/>' for r, o, d in [(210, .07, ""), (165, .06, ' stroke-dasharray="2 9"'), (120, .08, ""), (78, .06, ' stroke-dasharray="2 9"')])
    states = [
        ("ev", "", "house", "the base word", "", ACC),
        ("ev", "ler", "houses", "-lAr: last vowel e is front, so -ler", "plural", ACCB),
        ("evler", "de", "in the houses", "-DA: voiced r, front vowel, so -de", "locative", ACCB),
    ]
    groups = ""
    for i, (stem, suf, gloss, rule, tag, col) in enumerate(states):
        size = 132
        ws, wf = DISP.width(stem, size), DISP.width(suf, size)
        x0 = cx - (ws + wf) / 2
        word = T(stem, DISP, size, x0, cy + 40, TEXT) + (T(suf, DISP, size, x0 + ws, cy + 40, col) if suf else "")
        ul = f'<rect x="{x0 + ws:.0f}" y="{cy + 56}" width="{wf:.0f}" height="2" fill="{ACCB}" opacity=".7"/>' if suf else ""
        cap = T(gloss, DISP_I, 34, cx, cy + 118, TEXT2, "middle") + T(rule.upper() if animated else rule.upper(), MONO, 12, cx, cy + 148, TEXT3, "middle", ls=0.8)
        cls = f' class="sw" style="animation-delay:{i * 4}s"' if animated else ""
        if not animated and i != 2:
            continue
        groups += f"<g{cls}>{word}{ul}{cap}</g>"
    pills = ""
    px = 72
    for i, (name, lvl) in enumerate([("Beginner", "A1"), ("Intermediate", "A2"), ("Advanced", "B1")]):
        w = BODY.width(name, 15) + MONO.width(lvl, 12) + 52
        pills += (
            f'<g class="u"{delay(i, 1.3, .15)}><rect x="{px}" y="360" width="{w:.0f}" height="36" rx="2" fill="{SURF}" stroke="{LINEH}"/>'
            f'{T(name, BODY, 15, px + 16, 383, TEXT)}{T(lvl, MONO, 12, px + w - 16, 382, ACC, "end")}</g>'
        )
        px += w + 12
    css = (
        "@keyframes sw{0%{opacity:0;transform:translateY(10px)}5%{opacity:1;transform:none}29%{opacity:1}34%{opacity:0;transform:translateY(-6px)}100%{opacity:0}}"
        ".sw{animation:sw 12s cubic-bezier(.16,.4,.15,1) infinite;opacity:0}"
        "@keyframes mt{0%,100%{transform:translateY(0);opacity:.1}50%{transform:translateY(-26px);opacity:.5}}.m{animation:mt 14s ease-in-out infinite}"
        ".h{transform-origin:930px 190px;animation:rot 160s linear infinite}"
    ) if animated else ""
    body = (
        f'<g{" class=\"h\"" if animated else ""}>{halo}</g>{motes if animated else ""}'
        f'<g class="u">{logo(72, 58, 76, animated)}</g>'
        f'{T("TURKISH FOR ENGLISH SPEAKERS", MONO, 12.5, 72, 176, TEXT3, ls=2.2)}'
        f'<g class="u"{delay(1, .2)}>{T("Lexera", DISP_I, 118, 66, 282, TEXT)}</g>'
        f'<g class="u"{delay(2, .35)}>{T("Learn Turkish the way it is built.", BODY, 23, 72, 330, TEXT2)}</g>'
        f"{pills}{groups}"
        f'<rect x="72" y="420" width="1136" height="1" fill="{LINE}"/>'
    )
    return svg(W, H, "Lexera: Turkish for English speakers.", "Lexera banner. A tulip inside a halo, the wordmark, and an animated word that grows from ev, to evler, to evlerde, showing how Turkish adds suffixes. Three phases below: Beginner, Intermediate, Advanced.", body, css)


save("banner.svg", banner(True))
save("banner-static.svg", banner(False))

# ---- shared diagram helpers -----------------------------------------------------------------------------------
def card(x, y, w, h, i=0, base=0.0, fill=SURF, stroke=LINE):
    return f'<rect class="u" x="{x}" y="{y}" width="{w}" height="{h}" rx="2" fill="{fill}" stroke="{stroke}"{delay(i, base)}/>'


def eyebrow(s, x, y, fill=TEXT3):
    return T(s.upper(), MONO, 11.5, x, y, fill, ls=1.8)


def heading(s, x, y, size=40, fill=TEXT, anchor="start"):
    return T(s, DISP_I, size, x, y, fill, anchor)


# ---- game modes ----------------------------------------------------------------------------------------------
MODES = [
    ("check", "Choose", "Pick the meaning", "Recognise a word and choose from three or four options. Wrong options get closer to the answer as you improve."),
    ("headphones", "Listen", "Hear it, then choose", "Turkish text to speech plays the word at normal or slow speed. Skipped automatically when no voice exists."),
    ("grid", "Match", "Pairs that face each other", "Turkish on the left, meanings on the right, in one grid, so every card shares a row with a candidate."),
    ("pen", "Type", "Write it from memory", "A Turkish letter row sits above the keyboard. A missing accent counts as almost right, never plain wrong."),
    ("build", "Build", "Order the tiles", "Rebuild the sentence word by word. Higher tiers add decoy tiles taken from other sentences."),
    ("harmony", "Harmony", "Pick the suffix", "The engine generates the correct ending and explains the vowel or consonant rule behind it."),
]
body = eyebrow("Six game types", 72, 70) + heading("Every answer is a different kind of recall.", 72, 118, 46)
for i, (ic, name, sub, desc) in enumerate(MODES):
    x, y = 72 + (i % 3) * 378, 160 + (i // 3) * 218
    body += card(x, y, 358, 198, i)
    body += f'<g class="f"{delay(i)}>{icon_group(ic, x + 24, y + 24, 30, ACCB, 1.3, i * .12)}</g>'
    body += T(name, DISP_I, 34, x + 70, y + 52, TEXT) + T(sub.upper(), MONO, 10.5, x + 24, y + 92, TEXT3, ls=1.4)
    body += para(desc, BODY, 14.5, x + 24, y + 120, 310, TEXT2, 1.5)
save("modes.svg", svg(1280, 620, "Six game types", "Choose, Listen, Match, Type, Build and Harmony: six exercise formats, each practising a different kind of recall.", body))

# ---- curriculum ---------------------------------------------------------------------------------------------
PH = [
    ("Beginner", "A1", "Sounds, greetings, home, food, time, questions and the core present tense.", [
        ("Sounds and greetings", "alphabet, politeness"), ("I am, you are", "-(y)Im  -sIn  -(y)Iz"), ("Things and numbers", "-lAr  -DA  var  yok"),
        ("Everyday actions", "-(I)yor  mI"), ("Colors and describing", "adjectives  değil"), ("Days and numbers", "-mIyor  time with -DA"),
        ("At home", "-DA with to be"), ("Food and restaurants", "-lI  -sIz"), ("Daily routine and school", "-mAk  verbs of the day"), ("Asking questions", "kim  ne  neden  nasıl")]),
    ("Intermediate", "A2", "Past tense, cases, possession, health, travel, hobbies and habits.", [
        ("Yesterday and today", "-DI"), ("Places and directions", "-(y)A  -DA  -DAn  -(y)I"), ("People and shopping", "-(I)m  -In  -(s)I"),
        ("Plans and abilities", "-(y)AcAk  -(y)Abil"), ("Body and health", "-mA-DI  ağrımak"), ("Clothes and shopping", "-(s)I  consonant softening"),
        ("Months and seasons", "dates with -DA"), ("Hobbies and invitations", "-(y)AlIm  -mAyI"), ("Getting around town", "-(n)In  ile"), ("Habits and routines", "aorist  -Ar  -Ir")]),
    ("Advanced", "B1", "Hearsay past, conditionals, voice, reported speech, storytelling and formal style.", [
        ("Hearsay and opinion", "-mIş"), ("If, weather and work", "-sA  -sAydI"), ("Voice and linking", "-Il  -DIr  -ken"),
        ("Ideas and etiquette", "-(y)An  -DIK"), ("Discussion and decisions", "-mAlI"), ("Culture and travel", "etmek  olmak"),
        ("Work and technology", "-DIğInI söyledi"), ("Nature and the news", "-lI  -sIz  participles"), ("Telling stories", "-(I)yordu  -mIştI  -Ip"), ("Formal language", "siz  -(y)In  -(y)Abilir")]),
]
body = eyebrow("Curriculum", 72, 70) + heading("Three phases, thirty units, sixty lessons.", 72, 118, 46)
for i, (name, lvl, blurb, units) in enumerate(PH):
    x, y, w, h = 72 + i * 384, 160, 368, 724
    body += card(x, y, w, h, i, 0.1)
    body += T(name, DISP_I, 44, x + 24, y + 62, TEXT) + T(lvl, MONO, 12, x + w - 24, y + 40, ACC, "end", ls=1)
    body += para(blurb, BODY, 14.5, x + 24, y + 94, w - 48, TEXT2, 1.5)
    body += f'<rect x="{x + 24}" y="{y + 142}" width="{w - 48}" height="1" fill="{LINE}"/>'
    for j, (u, g) in enumerate(units):
        uy = y + 176 + j * 50
        body += f'<g class="u"{delay(j, 0.5 + i * .2, .08)}>{T(f"{j + 1:02d}", MONO, 11.5, x + 24, uy, ACC)}{T(u, BODY, 16, x + 62, uy + 1, TEXT)}{T(g, MONO, 10.5, x + 62, uy + 19, TEXT3)}</g>'
    body += T("20 lessons  /  160 words", MONO, 11, x + 24, y + h - 20, TEXT3, ls=.4)
    if i < 2:
        body += f'<path d="M{x + w + 3} {y + 220}h10" stroke="{ACC}" stroke-width="1" stroke-dasharray="3 4"/>'
save("curriculum.svg", svg(1280, 924, "Curriculum", "Three phases, Beginner A1, Intermediate A2 and Advanced B1, each with ten units and the grammar they teach.", body))

# ---- session arc ------------------------------------------------------------------------------------------------
x0, x1, yb, yt = 110, 1170, 420, 210
pts = [(0, .12), (.1, .2), (.22, .34), (.36, .45), (.5, .6), (.64, .76), (.74, .92), (.82, .7), (.9, .35), (1, .22)]
P = [(x0 + (x1 - x0) * a, yb - (yb - yt) * b) for a, b in pts]
d = f"M{P[0][0]:.0f} {P[0][1]:.0f}"
for i in range(1, len(P)):
    mx = (P[i - 1][0] + P[i][0]) / 2
    d += f"C{mx:.0f} {P[i - 1][1]:.0f} {mx:.0f} {P[i][1]:.0f} {P[i][0]:.0f} {P[i][1]:.0f}"
stages = [("Warm up", "Intro cards, easy recognition", 0, .2), ("Build", "Mixed formats, due words return", .2, .62), ("Peak", "Typing and long sentences", .62, .84), ("Cool down", "Finish on a strong word", .84, 1)]
body = eyebrow("Session arc", 72, 70) + heading("Hard enough to grow. Ending on a win.", 72, 118, 46)
for i, (n, s, a, b) in enumerate(stages):
    sx, ex = x0 + (x1 - x0) * a, x0 + (x1 - x0) * b
    body += f'<rect class="f" x="{sx:.0f}" y="{yt - 20}" width="{ex - sx:.0f}" height="{yb - yt + 40}" fill="{ACC}" fill-opacity="{0.035 if i % 2 == 0 else 0.07}"/>'
    body += T(n.upper(), MONO, 11.5, (sx + ex) / 2, yb + 62, ACCB, "middle", ls=1.6) + T(s, BODY, 13, (sx + ex) / 2, yb + 84, TEXT3, "middle")
body += f'<path d="M{x0} {yb}H{x1}M{x0} {yt - 20}V{yb}" stroke="{LINEH}" stroke-width="1" fill="none"/>'
body += T("difficulty", MONO, 11, x0 - 14, yt - 28, TEXT3, "end") + T("time in session", MONO, 11, x1, yb + 28, TEXT3, "end")
body += T("The director shifts the curve so you stay right about four times in five.", BODY, 15, 72, 160, TEXT2)
body += f'<path class="dr" pathLength="1" d="{d}" fill="none" stroke="{ACCB}" stroke-width="2.2" stroke-linecap="round" style="animation-duration:3.4s"/>'
body += f'<circle r="5" fill="{TEXT}"><animateMotion dur="9s" repeatCount="indefinite" path="{d}" keyPoints="0;1" keyTimes="0;1" calcMode="spline" keySplines=".4 0 .6 1"/></circle>'
body += T("peak", MONO, 11.5, P[6][0], P[6][1] - 16, TEXT, "middle") + T("end", MONO, 11.5, P[9][0], P[9][1] - 16, TEXT, "middle")
save("session-arc.svg", svg(1280, 580, "Session arc", "Difficulty over one session rises from a warm-up through a build phase to a peak, then eases for a cool-down that ends on a strong word.", body))

# ---- spaced retrieval ----------------------------------------------------------------------------------------------
ivs = ["0.8 days", "2 days", "4 days", "8 days", "16 days", "32 days"]
body = eyebrow("Spaced retrieval", 72, 70) + heading("Each word returns just before you would forget it.", 72, 118, 46)
bw = 150
for i, iv in enumerate(ivs):
    x = 72 + i * 188
    body += card(x, 170, bw, 118, i, 0.1, SURF, LINEH if i < 5 else ACC)
    body += T(f"BOX {i + 1}", MONO, 11, x + 18, 200, TEXT3, ls=1.5) + T(iv, DISP4, 30, x + 18, 246, TEXT)
    body += T("next review", BODY, 12.5, x + 18, 272, TEXT3)
    if i < 5:
        body += f'<path class="dr" pathLength="1" d="M{x + bw + 6} 229h26" stroke="{OK}" stroke-width="1.4" fill="none" style="animation-delay:{.6 + i * .2:.1f}s"/><path d="M{x + bw + 26} 224l6 5-6 5" stroke="{OK}" stroke-width="1.4" fill="none" stroke-linecap="round"/>'
body += f'<path d="M{72 + 5 * 188 + 75} 300v38H{72 + 75}v-32" stroke="{BAD}" stroke-width="1.2" fill="none" stroke-dasharray="4 5" opacity=".8"/><path d="M{72 + 69} 314l6-8 6 8" stroke="{BAD}" stroke-width="1.2" fill="none"/>'
body += T("A miss sends the word back to box 1 (two boxes down from box 4 or higher), and it returns within ten minutes.", BODY, 14, 72, 372, TEXT2)
body += T("Correct on the first try: up one box", BODY, 14, 72, 412, OK) + T("Almost right (accent missing): stays", BODY, 14, 470, 412, NEAR) + T("Wrong: back down", BODY, 14, 870, 412, BAD)
save("spaced-retrieval.svg", svg(1280, 460, "Spaced retrieval", "Six Leitner boxes with intervals of 0.8, 2, 4, 8, 16 and 32 days. Correct answers move a word forward, misses send it back.", body))

# ---- harmony ---------------------------------------------------------------------------------------------------------
body = eyebrow("Vowel harmony", 72, 70) + heading("Two rules decide almost every ending.", 72, 118, 46)
body += card(72, 160, 520, 392, 0, 0.1)
body += T("LAST VOWEL OF THE WORD", MONO, 11, 96, 192, TEXT3, ls=1.6)
cells = [("a", "back"), ("ı", "back"), ("o", "back"), ("u", "back"), ("e", "front"), ("i", "front"), ("ö", "front"), ("ü", "front")]
two = {"a": "a", "ı": "a", "o": "a", "u": "a", "e": "e", "i": "e", "ö": "e", "ü": "e"}
four = {"a": "ı", "ı": "ı", "e": "i", "i": "i", "o": "u", "u": "u", "ö": "ü", "ü": "ü"}
body += T("2-way", MONO, 11, 322, 236, ACC, "middle", ls=1) + T("4-way", MONO, 11, 456, 236, ACC, "middle", ls=1) + T("vowel", MONO, 11, 130, 236, ACC, "middle", ls=1)
for i, (v, side) in enumerate(cells):
    y = 270 + i * 26 + (14 if i >= 4 else 0)
    body += f'<g class="u"{delay(i, .4, .07)}>' + T(v, DISP, 28, 130, y + 6, TEXT, "middle") + T(side, BODY, 13, 190, y + 3, TEXT3)
    body += T(two[v], DISP, 28, 322, y + 6, OK, "middle") + T(four[v], DISP, 28, 456, y + 6, NEAR, "middle") + "</g>"
body += T("Back pairs with back, front with front. Round vowels round the ending.", BODY, 13, 96, 520, TEXT2)
ex = [("ev", "-lAr", "evler", "e is front, so -ler"), ("okul", "-lAr", "okullar", "u is back, so -lar"), ("kitap", "-DA", "kitapta", "p is hard, so d becomes t"), ("öğrenci", "-(y)Im", "öğrenciyim", "vowel ending adds y, i gives -im"), ("çalış", "-DIm", "çalıştım", "ş is hard, ı gives -tım"), ("oku", "-DIğIm", "okuduğum", "u gives -duğum"), ("gönder", "-Il -DI", "gönderildi", "e gives -il, then -di")]
body += eyebrow("Generated by the suffix engine", 640, 192)
for i, (s, suf, form, why) in enumerate(ex):
    y = 232 + i * 40
    body += f'<g class="u"{delay(i, .5, .1)}><rect x="640" y="{y - 22}" width="568" height="34" rx="2" fill="{SURF}" stroke="{LINE}"/>' + T(s, DISP, 22, 656, y, TEXT) + T(suf, MONO, 12, 770, y - 2, TEXT3) + T(form, DISP, 22, 870, y, ACCB) + T(why, BODY, 12.5, 1020, y - 1, TEXT3) + "</g>"
save("harmony.svg", svg(1280, 590, "Vowel harmony", "A chart of the eight Turkish vowels with their two-way and four-way harmony partners, next to seven real suffix examples.", body))

# ---- architecture -----------------------------------------------------------------------------------------------------
def row(label, items, y, h, base, color=LINEH):
    out = T(label.upper(), MONO, 11, 72, y - 14, TEXT3, ls=1.6)
    n = len(items)
    gap = 14
    w = (1136 - gap * (n - 1)) / n
    for i, (name, sub) in enumerate(items):
        x = 72 + i * (w + gap)
        out += card(round(x), y, round(w), h, i, base, SURF, color)
        sz = 23
        while DISP.width(name, sz) > w - 28: sz -= 1
        out += T(name, DISP, sz, x + 16, y + 34, TEXT) + para(sub, BODY, 12.5, x + 16, y + 56, w - 30, TEXT3, 1.4)
    return out


body = eyebrow("Architecture", 72, 62) + heading("Classes hold the logic. React only draws it.", 72, 108, 44)
body += row("React UI", [("Path", "lesson map, phases, test out"), ("Practice", "review, harmony gym, speed"), ("Atlas", "words, grammar, sounds, method"), ("You", "level, streak, badges, settings"), ("Play", "six exercise views, feedback")], 168, 78, .0, ACC)
body += row("State", [("AppStore", "observable save data, sessions, rewards, backup code, settings")], 292, 66, .5, ACCB)
body += row("Engine", [("SessionPlanner", "arc: warm, build, peak, cool"), ("ExerciseFactory", "item plus tier becomes an exercise"), ("PracticeSession", "queue, retries, XP, summary"), ("DifficultyDirector", "holds about 82 percent"), ("ReviewScheduler", "Leitner boxes"), ("StreakKeeper", "freezes, daily goal")], 398, 92, .8)
body += row("Foundation", [("Harmony and SuffixBook", "43 suffix families, vowel and consonant rules"), ("TurkishText", "i and dotless i safe, folding"), ("ContentLibrary", "30 units, 480 words, 236 sentences"), ("Services", "Speech, SoundFx, Haptics, Storage")], 538, 84, 1.1)
for i, (ya, yb2) in enumerate([(246, 288), (358, 394), (490, 534)]):
    body += f'<path d="M640 {ya}V{yb2}" stroke="{ACC}" stroke-width="1.2" stroke-dasharray="3 5" fill="none"><animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.6s" repeatCount="indefinite"/></path>'
save("architecture.svg", svg(1280, 670, "Architecture", "Four layers: React UI, the AppStore, the engine classes, and the foundation of harmony rules, content and services.", body))

# ---- progression ------------------------------------------------------------------------------------------------------------
body = eyebrow("Progress system", 72, 70) + heading("Craft titles, quiet medals, forgiving streaks.", 72, 118, 46)
LV = [("Acemi", "novice", "level 1", "0 xp"), ("Çırak", "apprentice", "level 5", "400 xp"), ("Kalfa", "journeyman", "level 10", "1,350 xp"), ("Usta", "master", "level 15", "2,619 xp"), ("Üstat", "grand master", "level 20", "4,141 xp")]
for i, (tr, en, lv, xp) in enumerate(LV):
    x = 72 + i * 228
    r = 34
    body += f'<g class="u"{delay(i, .1, .15)}>{card(x, 160, 212, 170, 0, 0, SURF, LINE)}'
    body += f'<circle cx="{x + 52}" cy="232" r="{r}" fill="none" stroke="{LINEH}" stroke-width="1.5"/><circle cx="{x + 52}" cy="232" r="{r}" fill="none" stroke="{ACCB}" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="{2 * math.pi * r:.0f}" stroke-dashoffset="{2 * math.pi * r * (1 - (i + 1) / 5):.0f}" transform="rotate(-90 {x + 52} 232)"/>'
    body += T(str(1 if i == 0 else i * 5), DISP_I, 34, x + 52, 244, TEXT, "middle") + T(tr, DISP_I, 32, x + 104, 228, TEXT) + T(en, BODY, 13, x + 104, 250, TEXT3)
    body += T(lv.upper(), MONO, 10.5, x + 18, 296, ACC, ls=1.2) + T(xp, MONO, 10.5, x + 194, 296, TEXT3, "end") + "</g>"
body += T("XP TO REACH A LEVEL:  50 x (level - 1) ^ 1.5", MONO, 11.5, 72, 372, TEXT3, ls=1.2)
for i, (tier, nm) in enumerate([(1, "Tier 1"), (2, "Tier 2"), (3, "Tier 3")]):
    cx = 140 + i * 150
    for r in [34, 30, 26][:tier]:
        body += f'<circle cx="{cx}" cy="448" r="{r}" fill="none" stroke="{[ACC, TEXT2, ACCB][tier - 1]}" stroke-width="1"/>'
    body += icon_group("star", cx - 14, 434, 28, TEXT, 1.4) + T(nm.upper(), MONO, 10.5, cx, 508, TEXT3, "middle", ls=1.2)
body += para("Medal rings count the tier. Locked medals are dashed. There are 19 badges across streaks, vocabulary, grammar, listening and phases.", BODY, 15, 560, 430, 340, TEXT2)
body += card(940, 396, 268, 130, 0, .6, SURF, LINE) + icon_group("shield", 960, 414, 26, OK, 1.4) + T("Streak freeze", DISP_I, 28, 998, 436, TEXT)
body += para("Missed a day? A freeze covers it. Earn one every 7 days, hold up to 2. No lives, no hard fails.", BODY, 13.5, 960, 474, 230, TEXT2, 1.45)
save("progression.svg", svg(1280, 560, "Progress system", "Five level titles from Acemi to Üstat with XP thresholds, three medal tiers, and the streak freeze.", body))

# ---- design system -----------------------------------------------------------------------------------------------------------
body = eyebrow("Design system: Abyssal Liturgy", 72, 70) + heading("One void. One light source.", 72, 118, 46)
SW = [("--bg", BG, "#08090b"), ("--bg-2", BG2, "#0d1013"), ("--text", TEXT, "#e6e3da"), ("--text-2", TEXT2, "#9aa3a8"), ("--accent", ACC, "#7c8891"), ("--accent-bright", ACCB, "#c9cfd2"), ("--ok", OK, "#9dbba9"), ("--near", NEAR, "#cdbb8c"), ("--bad", BAD, "#c88f86")]
for i, (n, c, hx) in enumerate(SW):
    x = 72 + i * 126
    body += f'<g class="u"{delay(i, .1, .08)}><rect x="{x}" y="160" width="112" height="96" rx="2" fill="{c}" stroke="{LINEH}"/>' + T(n, MONO, 10.5, x, 282, TEXT2) + T(hx, MONO, 10.5, x, 300, TEXT3) + "</g>"
body += card(72, 336, 372, 200, 0, .5) + eyebrow("Cormorant Garamond", 96, 370, ACC) + T("Merhaba", DISP_I, 62, 96, 440, TEXT) + T("Display, italic 300. Turkish words in 500.", BODY, 13, 96, 480, TEXT3) + T("ğ ı İ ş ç ö ü", DISP, 26, 96, 516, TEXT2)
body += card(458, 336, 372, 200, 1, .5) + eyebrow("Jost", 482, 370, ACC) + T("Interface copy", BODY, 36, 482, 424, TEXT) + para("Weights 300, 400 and 500. Calm, geometric, readable at small sizes on a phone.", BODY, 13.5, 482, 458, 320, TEXT3, 1.5)
body += card(844, 336, 364, 200, 2, .5) + eyebrow("Motion and light", 868, 370, ACC)
body += f'<path d="M868 500C900 500 905 430 948 424C1000 418 1000 420 1052 420" stroke="{ACCB}" stroke-width="1.6" fill="none"/>' + T("--ease-liturgy", MONO, 11, 868, 520, TEXT3)
for i, (lbl, tint) in enumerate([("A1", "rgba(124,136,145,.5)"), ("A2", "rgba(118,150,158,.55)"), ("B1", "rgba(201,191,166,.5)")]):
    cx = 1090 + i * 38
    body += f'<circle cx="{cx}" cy="470" r="15" fill="{tint}" opacity=".6"/>' + T(lbl, MONO, 10, cx, 505, TEXT3, "middle")
body += T("PHASE LIGHT", MONO, 10, 1128, 400, TEXT3, "middle", ls=1.4)
save("design-system.svg", svg(1280, 600, "Design system", "Colour tokens, the type pairing of Cormorant Garamond and Jost, the signature easing curve and the three phase tints.", body))

# ---- deploy ---------------------------------------------------------------------------------------------------------------------
steps = [("push", "main", "git"), ("npm ci", "locked install", "download"), ("vitest", "20 tests", "check"), ("tsc + vite", "typed build", "code"), ("upload", "Pages artifact", "layers"), ("deploy", "GitHub Pages", "cloud")]
body = eyebrow("Deployment", 72, 70) + heading("Push to main. It is live.", 72, 118, 46)
ICONS["git"] = ["M6 3v12", circ(6, 18, 3), circ(18, 6, 3), "M18 9a9 9 0 0 1-9 9"]
for i, (a, b, ic) in enumerate(steps):
    x = 72 + i * 190
    body += card(x, 170, 168, 116, i, .1, SURF, LINEH) + f'<g class="f"{delay(i)}>{icon_group(ic, x + 18, 190, 24, ACCB, 1.3, i * .15)}</g>' + T(a, DISP, 28, x + 18, 250, TEXT) + T(b.upper(), MONO, 10.5, x + 18, 272, TEXT3, ls=1)
    if i < 5:
        body += f'<path d="M{x + 172} 228h14" stroke="{ACC}" stroke-width="1.2"/>'
body += f'<path id="rail" d="M156 228H1136" stroke="none" fill="none"/><circle r="4" cy="0" fill="{TEXT}"><animateMotion dur="7s" repeatCount="indefinite" path="M156 156H1136"/></circle>'
body += card(72, 330, 1136, 64, 0, .9) + T("lexeraapp.github.io", MONO, 16, 100, 370, ACCB, ls=.5) + T("Settings, Pages, Source: GitHub Actions", BODY, 14, 1180, 368, TEXT3, "end")
save("deploy.svg", svg(1280, 430, "Deployment pipeline", "On every push to main GitHub Actions installs, tests, builds, uploads and deploys Lexera to GitHub Pages.", body))

# ---- footer ---------------------------------------------------------------------------------------------------------------------
body = f'<g class="u">{logo(604, 40, 72)}</g>' + T("Lexera", DISP_I, 56, 640, 168, TEXT, "middle") + T("Turkish, built from the ground up.", BODY, 17, 640, 204, TEXT2, "middle")
stack = ["React 19", "TypeScript", "Vite", "Vitest", "PWA", "GitHub Pages"]
tw = [MONO.width(s, 11.5) + 28 for s in stack]
x = 640 - (sum(tw) + 10 * (len(tw) - 1)) / 2
for s, w in zip(stack, tw):
    body += f'<rect x="{x:.0f}" y="236" width="{w:.0f}" height="28" rx="2" fill="none" stroke="{LINEH}"/>' + T(s, MONO, 11.5, x + w / 2, 255, TEXT3, "middle")
    x += w + 10
save("footer.svg", svg(1280, 300, "Lexera", "Lexera footer with the tulip mark, tagline and technology stack.", body))
print("assets written:", len(list(OUT.rglob("*.svg"))))
