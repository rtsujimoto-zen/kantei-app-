import pypdf
import os
import subprocess
import io
from PIL import Image

pdf_path = "小池康仁_「自分」の生き方.pdf"
md_path = "小池康仁_「自分」の生き方.md"
tessdata_dir = os.path.abspath("tessdata")

try:
    print(f"Opening {pdf_path}...")
    reader = pypdf.PdfReader(pdf_path)
    num_pages = len(reader.pages)
    print(f"Total pages: {num_pages}")
    
    with open(md_path, "w", encoding="utf-8") as f:
        title = os.path.splitext(os.path.basename(pdf_path))[0]
        f.write(f"# {title}\n\n")
        f.flush()
        
        for i, page in enumerate(reader.pages):
            # Check if we should log progress
            if (i + 1) % 5 == 0 or i == 0:
                print(f"Processing page {i+1}/{num_pages}...")

            # 1. Try normal text extraction
            text = page.extract_text()
            if text and len(text.strip()) > 50:
                # If we got substantial text, assume it's good (mix of text/images?)
                # But sometimes hidden text layer is bad. 
                # Given previous attempt failed (41 bytes total), we assume almost no text.
                print(f"  Found text layer on page {i+1}, using it.")
                f.write(text)
                f.write("\n\n")
                continue

            # 2. OCR Images
            if not page.images:
                # No text and no images?
                # Maybe vector graphics or something else pypdf doesn't see as images?
                # Or just blank.
                continue
                
            for j, image_file in enumerate(page.images):
                try:
                    image_data = image_file.data
                    image = Image.open(io.BytesIO(image_data))
                    
                    # Convert to RGB to ensure compatibility
                    if image.mode != 'RGB':
                        image = image.convert('RGB')

                    temp_img_path = f"temp_page_{i+1}_{j}.png"
                    image.save(temp_img_path)
                    
                    # Run tesseract
                    # --psm 6Assume a single uniform block of text. (Good for pages)
                    # --psm 3 Fully automatic page segmentation, but no OSD. (Default)
                    cmd = [
                        "tesseract",
                        temp_img_path,
                        "stdout",
                        "-l", "jpn",
                        "--tessdata-dir", tessdata_dir,
                        "--psm", "3" 
                    ]
                    
                    result = subprocess.run(cmd, capture_output=True, text=True)
                    if result.returncode == 0:
                        ocr_text = result.stdout
                        # Filter out empty or garbage (optional)
                        if len(ocr_text.strip()) > 0:
                            f.write(ocr_text)
                            f.write("\n\n")
                    else:
                        print(f"  Tesseract error on page {i+1} img {j}: {result.stderr}")
                    
                    # Cleanup
                    if os.path.exists(temp_img_path):
                        os.remove(temp_img_path)
                        
                except Exception as e_img:
                     print(f"  Error processing image {j} on page {i+1}: {e_img}")
            
            f.flush()

    print(f"Completed. Saved to {md_path}")

except Exception as e:
    print(f"Fatal Error: {e}")
