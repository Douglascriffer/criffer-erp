import json

with open("public/data/dados.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# Let's inspect Month 4 (April) and month 'all'
for key in ["month_4", "all"]:
    print(f"=== {key} ===")
    month_data = data.get("orcamento", {}).get("mensal", {}).get(key, {})
    if key == "all":
        # Wait, 'all' is calculated dynamically or stored in json?
        # Let's look at what is stored in json:
        month_data = data.get("orcamento", {}).get("mensal", {}).get("month_4", {}) # we saw it's month_4
    centros = month_data.get("centros", [])
    total_orc = 0
    total_real = 0
    for c in centros:
        print(f"  CC: {c['cc']:20s} | Orc: {c['orc']:12.2f} | Real: {c['real']:12.2f}")
        total_orc += c["orc"]
        total_real += c["real"]
    print(f"  TOTAL: {total_orc:12.2f} | {total_real:12.2f}")
