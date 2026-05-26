import subprocess
import json

def compare():
    # Ler arquivo físico
    with open("public/data/dados.json", "r", encoding="utf-8") as f:
        physical_content = f.read()
    
    # Ler arquivo no git (HEAD)
    try:
        git_content = subprocess.check_output(
            ["git", "show", "HEAD:public/data/dados.json"],
            stderr=subprocess.STDOUT
        ).decode("utf-8")
    except Exception as e:
        print("Erro ao ler do git HEAD:", e)
        return

    if physical_content == git_content:
        print("Os arquivos no disco e no git HEAD são 100% IDENTICOS.")
    else:
        print("ATENÇÃO: Os arquivos no disco e no git HEAD são DIFERENTES!")
        
        # Comparar como objetos JSON para ver se há diferenças estruturais
        obj_phy = json.loads(physical_content)
        obj_git = json.loads(git_content)
        
        if obj_phy == obj_git:
            print("Eles são logicamente idênticos (talvez apenas formatação/espaços sejam diferentes).")
        else:
            print("Eles são logicamente DIFERENTES. Há mudanças nos dados!")

if __name__ == "__main__":
    compare()
