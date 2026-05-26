import shutil
import os

src = r"C:\Users\douglas.bitencourt\AppData\Local\Temp\media__1779719165957.png"
# Mas o arquivo está em C:\Users\douglas.bitencourt\.gemini\antigravity-ide\brain\682c75d3-56b8-4602-a0aa-9957c9a2d4ae\media__1779719165957.png
# Vamos usar o caminho correto encontrado na busca
src = r"C:\Users\douglas.bitencourt\.gemini\antigravity-ide\brain\682c75d3-56b8-4602-a0aa-9957c9a2d4ae\media__1779719165957.png"

dest1 = r"C:\Douglas\Projeto Antigravity\criffer\public\logo-base.png"
dest2 = r"C:\Douglas\Projeto Antigravity\LOGO CRIFFER.png"

try:
    if os.path.exists(src):
        # Fazer backup do original primeiro
        if os.path.exists(dest1):
            shutil.copy2(dest1, dest1 + ".bak")
            print("Backup de dest1 criado.")
        if os.path.exists(dest2):
            shutil.copy2(dest2, dest2 + ".bak")
            print("Backup de dest2 criado.")
            
        shutil.copy2(src, dest1)
        print(f"Copiado com sucesso para {dest1}")
        shutil.copy2(src, dest2)
        print(f"Copiado com sucesso para {dest2}")
    else:
        print(f"Erro: Arquivo de origem não encontrado em {src}")
except Exception as e:
    print(f"Erro ao copiar arquivo: {str(e)}")
