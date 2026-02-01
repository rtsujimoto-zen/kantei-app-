import pypdf
import os

pdf_path = "小池康仁_「自分」の生き方.pdf"
md_path = "小池康仁_「自分」の生き方.md"

try:
    print(f"Opening {pdf_path}...")
    reader = pypdf.PdfReader(pdf_path)
    num_pages = len(reader.pages)
    print(f"Total pages: {num_pages}")
    
    with open(md_path, "w", encoding="utf-8") as f:
        # Title
        title = os.path.splitext(os.path.basename(pdf_path))[0]
        f.write(f"# {title}\n\n")
        
        for i, page in enumerate(reader.pages):
            try:
                text = page.extract_text()
                if text:
                    # Basic cleaning: Remove NULL bytes if any, though pypdf usually handles well
                    text = text.replace('\x00', '')
                    f.write(text)
                    f.write("\n\n")
            except Exception as e_page:
                print(f"Warning: Error reading page {i+1}: {e_page}")
                f.write(f"\n[Error reading page {i+1}]\n\n")

            if (i + 1) % 10 == 0:
                print(f"Processed page {i+1}/{num_pages}")
            
    print(f"Successfully converted {pdf_path} to {md_path}")

except Exception as e:
    print(f"Error: {e}")
    exit(1)
