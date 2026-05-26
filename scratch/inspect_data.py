import json

with open("public/data/dados.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Let's inspect Month 4 (April)
month_4 = data.get("orcamento", {}).get("mensal", {}).get("month_4", {})
centros = month_4.get("centros", [])

for c in centros:
    if c["cc"] in ["Financeiro", "ADM", "Administrativo"]:
        print(f"CC: {c['cc']}, Orc: {c['orc']}, Real: {c['real']}")
        print("Categories:")
        for cat in c.get("categories", []):
            print(f"  - {cat['name']}: Orc: {cat['orc']}, Real: {cat['real']}")
