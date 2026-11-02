"""Generate PWA and Apple touch icons during a clean build."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "icons"
OUTPUT.mkdir(parents=True, exist_ok=True)
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

for size in (192, 512):
    image = Image.new("RGB", (size, size), "#fafaf7")
    draw = ImageDraw.Draw(image)
    margin = int(size * 0.09)
    draw.rounded_rectangle((margin, margin, size - margin, size - margin), radius=int(size * 0.22), fill="#1d1e1b")
    draw.ellipse((size * 0.25, size * 0.25, size * 0.75, size * 0.75), fill="#ffd600")
    font = ImageFont.truetype(FONT, int(size * 0.31))
    draw.text((size / 2, size / 2 - 2), "С", font=font, fill="#1d1e1b", anchor="mm")
    image.save(OUTPUT / f"icon-{size}.png")
    print(f"Generated icon-{size}.png")
