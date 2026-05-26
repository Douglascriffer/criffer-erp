import os
import glob
from datetime import datetime, timedelta

def find_recent_pngs():
    search_dirs = [
        r"C:\Users\douglas.bitencourt\Downloads",
        r"C:\Users\douglas.bitencourt\Desktop",
        r"C:\Douglas"
    ]
    
    now = datetime.now()
    cutoff = now - timedelta(minutes=45)
    
    print(f"Buscando arquivos PNG modificados desde {cutoff.strftime('%Y-%m-%d %H:%M:%S')}...")
    
    for base_dir in search_dirs:
        if not os.path.exists(base_dir):
            continue
        print(f"Procurando em: {base_dir}")
        for root, dirs, files in os.walk(base_dir):
            for file in files:
                if file.lower().endswith('.png'):
                    path = os.path.join(root, file)
                    try:
                        mtime = datetime.fromtimestamp(os.path.getmtime(path))
                        if mtime > cutoff:
                            size = os.path.getsize(path)
                            print(f"ENCONTRADO: {path} | Modificado: {mtime} | Tamanho: {size} bytes")
                    except Exception as e:
                        pass

if __name__ == "__main__":
    find_recent_pngs()
