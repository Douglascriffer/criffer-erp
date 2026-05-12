import os
from PIL import Image

# Caminho da imagem dos badges empresariais
img_path = r"C:\Users\douglas.bitencourt\.gemini\antigravity\brain\5de3ce39-2b19-4b20-81d4-3b512d18ec74\criffer_enterprise_badges_1778616375814.png"
output_dir = r"c:\Douglas\Projeto Antigravity\criffer\public\assets\regioes"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

img = Image.open(img_path)
w, h = img.size

# Função para coordenadas percentuais
def p(lx, ty, rx, by):
    return (int(lx * w / 100), int(ty * h / 100), int(rx * w / 100), int(by * h / 100))

# Ordem baseada no grid 2x3 gerado:
# Linha 1: Sudeste (Growth), Centro-Oeste (Agro), Nordeste (Sun)
# Linha 2: Norte (Forest), Sul (Infra), Exterior (Global)

crops_pct = {
    "sudeste": p(10, 10, 30, 45),
    "centro_oeste": p(40, 10, 60, 45),
    "nordeste": p(70, 10, 90, 45),
    "norte": p(10, 55, 30, 90),
    "sul": p(40, 55, 60, 90),
    "exterior": p(70, 55, 90, 90)
}

for name, box in crops_pct.items():
    icon = img.crop(box)
    icon.save(os.path.join(output_dir, f"{name}.png"))
    print(f"Badge salvo: {name}.png - {icon.size}")
