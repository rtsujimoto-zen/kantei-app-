from pypdf import PdfReader
import sys

file_path = "/Users/r_tsuji/Documents/開発/算命学算出/辻本さん宿命 (1).pdf"

try:
    reader = PdfReader(file_path)
    print(f"Number of pages: {len(reader.pages)}")
    
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"
        
    print("--- PDF Content ---")
    print(text)
    
except Exception as e:
    print(f"Error reading PDF: {e}")
