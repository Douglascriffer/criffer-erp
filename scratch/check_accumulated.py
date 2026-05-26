import json

with open("public/data/dados.json", "r", encoding="utf-8") as f:
    data = json.load(f)

mensal = data.get("orcamento", {}).get("mensal", {})

# We want to sum from month_1 to month_4
cc_totals = {}

for m in range(1, 5):
    key = f"month_{m}"
    centros = mensal.get(key, {}).get("centros", [])
    for c in centros:
        cc_name = c["cc"]
        if cc_name not in cc_totals:
            cc_totals[cc_name] = {"orc": 0.0, "real": 0.0}
        cc_totals[cc_name]["orc"] += c["orc"]
        cc_totals[cc_name]["real"] += c["real"]

print("=== ACCUMULATED UP TO APRIL ===")
total_orc = 0
total_real = 0
for name, val in cc_totals.items():
    print(f"  CC: {name:20s} | Orc: {val['orc']:12.2f} | Real: {val['real']:12.2f}")
    total_orc += val["orc"]
    total_real += val["real"]

print(f"  TOTAL GERAL: {total_orc:12.2f} | {total_real:12.2f}")
