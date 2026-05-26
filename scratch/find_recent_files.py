import os
from datetime import datetime, timedelta

def find_recent_files():
    base_dir = r"C:\Douglas\Projeto Antigravity"
    now = datetime.now()
    cutoff = now - timedelta(hours=2)
    
    print(f"Buscando arquivos modificados desde {cutoff.strftime('%Y-%m-%d %H:%M:%S')} em {base_dir}...")
    
    for root, dirs, files in os.walk(base_dir):
        # Ignorar node_modules, .next e .git
        if any(ignored in root for ignored in ['node_modules', '.next', '.git']):
            continue
        for file in files:
            path = os.path.join(root, file)
            try:
                mtime = datetime.fromtimestamp(os.path.getmtime(path))
                if mtime > cutoff:
                    size = os.path.getsize(path)
                    print(f"MODIFICADO: {path} | {mtime} | {size} bytes")
            except Exception as e:
                pass

if __name__ == "__main__":
    find_recent_files()
