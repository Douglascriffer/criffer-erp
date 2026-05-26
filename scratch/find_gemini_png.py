import os
from datetime import datetime, timedelta

def find_gemini_pngs():
    base_dir = r"C:\Users\douglas.bitencourt\.gemini\antigravity-ide"
    now = datetime.now()
    cutoff = now - timedelta(minutes=45)
    
    print(f"Buscando arquivos PNG modificados em {base_dir} desde {cutoff.strftime('%Y-%m-%d %H:%M:%S')}...")
    
    if os.path.exists(base_dir):
        for root, dirs, files in os.walk(base_dir):
            for file in files:
                if file.lower().endswith('.png') or file.lower().endswith('.jpg') or file.lower().endswith('.jpeg'):
                    path = os.path.join(root, file)
                    try:
                        mtime = datetime.fromtimestamp(os.path.getmtime(path))
                        if mtime > cutoff:
                            size = os.path.getsize(path)
                            print(f"ENCONTRADO: {path} | Modificado: {mtime} | Tamanho: {size} bytes")
                    except Exception as e:
                        pass
    else:
        print("Diretório não existe.")

if __name__ == "__main__":
    find_gemini_pngs()
