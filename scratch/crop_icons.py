import os
from PIL import Image

img_path = r"C:\Users\douglas.bitencourt\.gemini\antigravity\brain\5de3ce39-2b19-4b20-81d4-3b512d18ec74\media__1778605765199.png"
output_dir = r"c:\Douglas\Projeto Antigravity\criffer\public\assets\regioes"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

img = Image.open(img_path)
w, h = img.size

# Coordenadas aprimoradas para capturar o ícone completo com margem
def p(lx, ty, rx, by):
    return (int(lx * w / 100), int(ty * h / 100), int(rx * w / 100), int(by * h / 100))

crops_pct = {
    "sudeste": p(2, 20, 18, 60),
    "sul": p(19, 20, 35, 60),
    "nordeste": p(2, 60, 18, 98),
    "norte": p(19, 60, 35, 98),
    "exterior": p(36, 20, 65, 95),
    "centro_oeste": p(66, 20, 98, 98)
}

for name, box in crops_pct.items():
    icon = img.crop(box)
    icon.save(os.path.join(output_dir, f"{name}.png"))
    print(f"Refeito: {name}.png - Tamanho: {icon.size}")
