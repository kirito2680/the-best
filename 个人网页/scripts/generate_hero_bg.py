"""生成首屏动画背景占位（暗色流动光晕，循环无缝的 WebP）。"""

import os

import numpy as np
from PIL import Image, ImageFilter

W, H = 960, 540
FPS = 8
DURATION = 10  # 秒
N_FRAMES = FPS * DURATION
OUT = os.path.join(
    os.path.dirname(__file__), "..", "public", "assets", "hero-bg.webp"
)


def make_frame(t: float) -> Image.Image:
    """t in [0, 1)，全部运动用整数频率保证首尾无缝。"""
    x = np.linspace(0, 1, W, dtype=np.float32)[None, :, None]
    y = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]

    # 基础近黑底色，带轻微纵向渐变
    img = np.empty((H, W, 3), dtype=np.float32)
    img[:] = 9 + 5 * y

    def glow(cx, cy, rx, ry, color, strength):
        nonlocal img
        d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
        img += np.asarray(color, dtype=np.float32).reshape(1, 1, 3) * strength * np.exp(
            -4.0 * d
        )

    # 三个光晕沿 Lissajous 轨迹缓慢漂移
    glow(
        0.5 + 0.34 * np.sin(2 * np.pi * (1 * t + 0.25)),
        0.4 + 0.28 * np.cos(2 * np.pi * (1 * t + 0.1)),
        0.48,
        0.36,
        (62, 190, 110),
        0.9,
    )
    glow(
        0.72 + 0.22 * np.cos(2 * np.pi * (2 * t + 0.6)),
        0.66 + 0.26 * np.sin(2 * np.pi * (1 * t + 0.8)),
        0.4,
        0.3,
        (140, 214, 60),
        0.75,
    )
    glow(
        0.3 + 0.2 * np.sin(2 * np.pi * (2 * t + 0.9)),
        0.78 + 0.16 * np.cos(2 * np.pi * (2 * t + 0.3)),
        0.34,
        0.26,
        (40, 130, 105),
        0.55,
    )

    # 暗角
    d = np.sqrt(((x - 0.5) * 1.5) ** 2 + (y - 0.5) ** 2)
    vignette = 1.0 - 0.42 * np.clip(d / 1.05, 0, 1)
    img *= vignette

    # 细颗粒噪点
    rng = np.random.default_rng(int(t * 100000))
    noise = rng.normal(0, 4.2, (H, W, 1)).astype(np.float32)
    img += noise

    frame = np.clip(img, 0, 255).astype(np.uint8)
    pil = Image.fromarray(frame, "RGB")
    return pil.filter(ImageFilter.GaussianBlur(1.0))


def main():
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    frames = [make_frame(i / N_FRAMES) for i in range(N_FRAMES)]
    frames[0].save(
        OUT,
        save_all=True,
        append_images=frames[1:],
        duration=1000 // FPS,
        loop=0,
        quality=50,
        method=6,
    )
    size_kb = os.path.getsize(OUT) / 1024
    print(f"written: {os.path.abspath(OUT)} ({size_kb:.0f} KB, {N_FRAMES} frames)")


if __name__ == "__main__":
    main()
