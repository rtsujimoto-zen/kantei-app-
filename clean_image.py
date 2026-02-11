from PIL import Image, ImageDraw

def clean_image(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    width, height = img.size
    
    # ピクセルデータを取得
    datas = img.getdata()
    newData = []
    
    # 1. 閾値処理（念のため再実行）
    # 黒(0,0,0)〜暗いグレー(80,80,80)以外は透明にする
    for item in datas:
        if item[3] > 0 and item[0] > 80 and item[1] > 80 and item[2] > 80:
            newData.append((255, 255, 255, 0)) # 透明
        else:
            newData.append(item) # 元のピクセル
            
    img.putdata(newData)
    
    # 2. 外周の強制透明化
    # 上下左右30ピクセルを透明にする（枠線を消すため）
    draw = ImageDraw.Draw(img)
    margin = 30
    draw.rectangle([(0, 0), (margin, height)], fill=(255, 255, 255, 0))
    draw.rectangle([(width - margin, 0), (width, height)], fill=(255, 255, 255, 0))
    draw.rectangle([(0, 0), (width, margin)], fill=(255, 255, 255, 0))
    draw.rectangle([(0, height - margin), (width, height)], fill=(255, 255, 255, 0))
    
    img.save(output_path, "PNG")
    print(f"Saved cleaned image to {output_path}")

input_path = "/Users/r_tsuji/Documents/開発/算命学算出/webapp/frontend/public/body-silhouette-final.png"
# 同じファイルに上書き
output_path = "/Users/r_tsuji/Documents/開発/算命学算出/webapp/frontend/public/body-silhouette-final.png"

clean_image(input_path, output_path)
