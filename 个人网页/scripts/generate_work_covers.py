"""为精选项目生成抽象占位封面（600x400），供 DriftWall 使用。"""

import os

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 600, 400
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "works")

FONTS = {
    "title": [
        r"C:\Windows\Fonts\msyhbd.ttc",
        r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\simhei.ttf",
    ],
    "body": [
        r"C:\Windows\Fonts\msyh.ttc",
        r"C:\Windows\Fonts\msyhbd.ttc",
        r"C:\Windows\Fonts\simhei.ttf",
    ],
    "mono": [
        r"C:\Windows\Fonts\consola.ttf",
        r"C:\Windows\Fonts\cour.ttf",
    ],
}


def pick_font(kind, size):
    for path in FONTS[kind]:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def make_cover(palette, index, title, tags, year):
    bg = palette["bg"]
    img = Image.new("RGB", (W, H), bg)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # 光晕
    for (cx, cy, rx, ry, color, alpha) in palette["glows"]:
        layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        d = ImageDraw.Draw(layer)
        d.ellipse(
            [cx - rx, cy - ry, cx + rx, cy + ry],
            fill=color + (alpha,),
        )
        layer = layer.filter(ImageFilter.GaussianBlur(70))
        overlay.alpha_composite(layer)

    # 网格线
    grid = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    for x in range(0, W, 60):
        gd.line([(x, 0), (x, H)], fill=(244, 244, 242, 14))
    for y in range(0, H, 60):
        gd.line([(0, y), (W, y)], fill=(244, 244, 242, 14))
    overlay.alpha_composite(grid)

    # 文字
    title_font = pick_font("title", 44)
    tags_font = pick_font("body", 20)
    mono_font = pick_font("mono", 17)
    idx_font = pick_font("mono", 118)

    draw.text((34, H - 74), title, font=title_font, fill=(242, 242, 238, 255))
    draw.text((36, H - 36), f"{tags} · {year}", font=tags_font, fill=(158, 158, 166, 220))
    draw.text((34, 28), f"FANG YU / {year}", font=mono_font, fill=(158, 158, 166, 150))
    draw.text(
        (W - 130, 26),
        index,
        font=idx_font,
        fill=(242, 242, 238, 46),
        stroke_width=1,
        stroke_fill=(242, 242, 238, 60),
    )

    img = Image.alpha_composite(img.convert("RGBA"), overlay)

    # 噪点与暗角
    arr = np.asarray(img).astype(np.float32)
    rng = np.random.default_rng(int(index))
    arr += rng.normal(0, 4.0, (H, W, 1))
    y = np.linspace(0, 1, H)[:, None, None]
    x = np.linspace(0, 1, W)[None, :, None]
    d = np.sqrt(((x - 0.5) * 1.45) ** 2 + (y - 0.5) ** 2)
    arr *= (1.0 - 0.42 * np.clip(d / 1.05, 0, 1))
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGBA").convert("RGB")
    return img


PALETTES = [
    {
        "bg": (13, 13, 24),
        "glows": [
            (120, 70, 300, 190, (74, 222, 128), 150),
            (520, 420, 280, 180, (30, 169, 124), 120),
        ],
    },
    {
        "bg": (21, 16, 14),
        "glows": [
            (120, 90, 290, 190, (233, 138, 94), 140),
            (510, 410, 260, 170, (141, 91, 214), 110),
        ],
    },
    {
        "bg": (12, 20, 18),
        "glows": [
            (130, 80, 300, 190, (53, 217, 141), 140),
            (500, 400, 270, 180, (31, 122, 156), 110),
        ],
    },
]

WORKS = [
    ("01", "AI 视觉系统实验", "生成式视觉 / 工具链", "2026"),
    ("02", "智能装备品牌重塑", "VI 系统 / 品牌策略", "2026"),
    ("03", "未来界面概念设计", "UI 概念 / 动效", "2026"),
]


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for i, ((idx, title, tags, year), palette) in enumerate(zip(WORKS, PALETTES)):
        cover = make_cover(palette, idx, title, tags, year)
        path = os.path.join(OUT_DIR, f"w{i + 1}.jpg")
        cover.save(path, quality=88)
        print(f"written: {os.path.abspath(path)}")


if __name__ == "__main__":
    main()

