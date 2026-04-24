import pandas as pd

file_path = r"C:\Douglas\Projeto Antigravity\RESULTADOS.xlsx"

df = pd.read_excel(file_path, sheet_name='BASE DE DADOS')
utilizacao = df['Utilização'].value_counts()
print("Unique 'Utilização' values:")
print(utilizacao)
