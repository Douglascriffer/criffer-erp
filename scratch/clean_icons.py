import os
from PIL import Image

# Pasta onde salvei os seus recortes
base_dir = r"c:\Douglas\Projeto Antigravity\criffer\public\assets\regioes"

files = {
    "sudeste.png": (0, 30, 100, 100), # (left, top, right, bottom) em porcentagem
    "nordeste.png": (0, 30, 100, 100),
    "sul.png": (0, 30, 100, 100),
    "norte.png": (0, 30, 100, 100),
    "exterior.png": (0, 20, 100, 85), # Exterior é mais alto
    "centro_oeste.png": (0, 15, 100, 100) # Centro-oeste é bem grande
}

for filename, pct in files.items():
    path = os.path.join(base_dir, filename)
    if os.path.exists(path):
        img = Image.open(path)
        w, h = img.size
        # Recortando para remover o título (os primeiros 30% da altura geralmente)
        box = (int(pct[0]*w/100), int(pct[1]*h/100), int(pct[2]*w/100), int(pct[3]*h/100))
        img_cropped = img.crop(box)
        img_cropped.save(path)
        print(f"Limpando {filename}: Novo tamanho {img_cropped.size}")
