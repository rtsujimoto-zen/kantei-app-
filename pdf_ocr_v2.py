#!/usr/bin/env python3
"""
高精度OCR変換スクリプト v2
PDFを高解像度画像に変換してからTesseract OCRを実行
"""

import os
import subprocess
from pdf2image import convert_from_path
from PIL import Image

# 設定
PDF_PATH = "小池康仁_「自分」の生き方.pdf"
OUTPUT_MD = "小池康仁_「自分」の生き方_v2.md"
TESSDATA_DIR = os.path.abspath("tessdata")
DPI = 300  # 高解像度 (デフォルトは200)

def preprocess_image(image):
    """画像の前処理：グレースケール変換、コントラスト調整等"""
    # グレースケールに変換
    gray = image.convert('L')
    
    # 二値化（オプション：テキストのコントラストを上げる）
    # threshold = 180
    # binary = gray.point(lambda x: 255 if x > threshold else 0, '1')
    # return binary
    
    return gray

def run_tesseract(image_path, lang='jpn'):
    """Tesseract OCRを実行"""
    cmd = [
        "tesseract",
        image_path,
        "stdout",
        "-l", lang,
        "--tessdata-dir", TESSDATA_DIR,
        "--psm", "6",  # 単一の均一なテキストブロックとして認識
        "--oem", "1",  # LSTMエンジンのみ使用（より高精度）
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0:
        return result.stdout
    else:
        print(f"OCR Error: {result.stderr}")
        return ""

def main():
    print(f"Opening {PDF_PATH}...")
    print(f"Converting PDF to images at {DPI} DPI (this may take a while)...")
    
    # PDFを画像に変換（高解像度）
    pages = convert_from_path(
        PDF_PATH, 
        dpi=DPI,
        fmt='png',
        thread_count=4  # 並列処理
    )
    
    total_pages = len(pages)
    print(f"Total pages: {total_pages}")
    
    with open(OUTPUT_MD, "w", encoding="utf-8") as f:
        title = os.path.splitext(os.path.basename(PDF_PATH))[0]
        f.write(f"# {title}\n\n")
        
        for i, page_image in enumerate(pages):
            page_num = i + 1
            
            if page_num % 5 == 0 or page_num == 1:
                print(f"Processing page {page_num}/{total_pages}...")
            
            # 前処理
            processed = preprocess_image(page_image)
            
            # 一時ファイルに保存
            temp_path = f"temp_page_{page_num}.png"
            processed.save(temp_path, 'PNG')
            
            # OCR実行
            text = run_tesseract(temp_path)
            
            if text.strip():
                # ページ区切りを追加
                f.write(f"---\n\n## ページ {page_num}\n\n")
                f.write(text)
                f.write("\n\n")
            
            # 一時ファイル削除
            if os.path.exists(temp_path):
                os.remove(temp_path)
            
            f.flush()
    
    print(f"Completed! Saved to {OUTPUT_MD}")

if __name__ == "__main__":
    main()
