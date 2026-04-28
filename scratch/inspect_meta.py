import json

with open('public/data/dados.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print("Estrutura byPeriod:")
print(data.get('byPeriod', [])[0] if data.get('byPeriod') else "None")

print("\nEstrutura Meta:")
meta_2026 = data.get('meta', {}).get('2026', [])
print(meta_2026[:2] if meta_2026 else "None")
