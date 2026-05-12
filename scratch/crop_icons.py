import os
from PIL import Image

# Caminho da imagem original enviada pelo usuário
img_path = r"C:\Users\douglas.bitencourt\.gemini\antigravity\brain\5de3ce39-2b19-4b20-81d4-3b512d18ec74\media__1778605765199.png"
output_dir = r"c:\Douglas\Projeto Antigravity\criffer\public\assets\regioes"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

img = Image.open(img_path)
w, h = img.size

# Coordenadas estimadas para cada ícone (baseado na proporção da imagem original)
# A imagem tem 1024x463 aproximadamente
crops = {
    "sudeste": (45, 230, 160, 580),   # x1, y1, x2, y2
    "sul": (200, 230, 320, 580),
    "exterior": (350, 180, 650, 880),
    "centro-oeste": (670, 230, 980, 920),
    "nordeste": (45, 620, 160, 900),
    "norte": (200, 620, 320, 950)
}

# Invertendo se necessário (PIL usa left, top, right, bottom)
# Ajuste fino das coordenadas
crops_final = {
    "sudeste": (45, 225, 165, 575),
    "sul": (205, 225, 330, 575),
    "nordeste": (45, 600, 165, 950),
    "norte": (205, 600, 330, 950),
    "exterior": (370, 320, 630, 880),
    "centro-oeste": (680, 230, 970, 920)
}

# Na verdade, a imagem parece ser organizada assim:
# SUDESTE | SUL | EXTERIOR | CENTRO-OESTE
# NORDESTE | NORTE

# Vou recalcular baseado no tamanho real 1024x463
# y: 0-150 (títulos), 150-500 (icones)
# x: Sudeste(50-160), Sul(200-330), Exterior(380-620), Centro-Oeste(680-980)

final_coords = {
    "sudeste": (40, 240, 165, 580),
    "sul": (200, 240, 330, 580),
    "nordeste": (40, 640, 165, 950),
    "norte": (200, 640, 330, 950),
    "exterior": (370, 330, 630, 870),
    "centro-oeste": (675, 240, 975, 920)
}

# Corrigindo ordem PIL: (left, top, right, bottom)
# A imagem enviada tem 1024 de largura e 463 de altura.
# Os icones estão lado a lado.

crops_pil = {
    "sudeste": (40, 240, 165, 580), # Sudeste (top left)
    "sul": (200, 240, 330, 580), # Sul (top next)
    "nordeste": (40, 640, 165, 920), # Nordeste (bottom left)
    "norte": (200, 640, 330, 920), # Norte (bottom next)
    "exterior": (370, 330, 630, 870), # Exterior (center)
    "centro_oeste": (675, 240, 975, 920) # Centro-Oeste (right)
}

# Espera, a imagem tem 463 de altura. y não pode ser 640.
# A imagem original que eu vejo no chat é:
# Títulos em cima.
# Linha 1: SUDESTE, SUL, EXTERIOR, CENTRO-OESTE
# Linha 2: NORDESTE, NORTE (abaixo de SUDESTE e SUL)

# Vou usar proporções percentuais para ser mais seguro
w, h = img.size
def p(lx, ty, rx, by):
    return (int(lx * w / 100), int(ty * h / 100), int(rx * w / 100), int(by * h / 100))

crops_pct = {
    "sudeste": p(4, 25, 16, 56),
    "sul": p(20, 25, 32, 56),
    "nordeste": p(4, 64, 16, 92),
    "norte": p(20, 64, 32, 92),
    "exterior": p(37, 32, 62, 85),
    "centro_oeste": p(67, 24, 96, 92)
}

for name, box in crops_pct.items():
    icon = img.crop(box)
    icon.save(os.path.join(output_dir, f"{name}.png"))
    print(f"Salvo: {name}.png")
