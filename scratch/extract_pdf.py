import pypdf

pdf_path = r"C:\Douglas\Projeto Antigravity\ADAPTA - PDF GABARITO.pdf"
reader = pypdf.PdfReader(pdf_path)

print(f"Total Pages: {len(reader.pages)}")

full_text = []
for i, page in enumerate(reader.pages):
    text = page.extract_text()
    full_text.append(f"--- PAGE {i+1} ---")
    full_text.append(text)

with open(r"c:\Douglas\Projeto Antigravity\criffer\scratch\pdf_content.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(full_text))

print("Successfully extracted PDF text to scratch/pdf_content.txt")
