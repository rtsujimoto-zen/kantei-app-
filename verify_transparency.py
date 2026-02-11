from PIL import Image

def verify_transparency(image_path):
    img = Image.open(image_path)
    img = img.convert("RGBA")
    width, height = img.size
    
    # 四隅および外周のチェック
    # 外周10ピクセル分を全走査
    margin = 10
    has_dirty_pixels = False
    
    dirty_pixels = []
    
    # 上端・下端
    for x in range(width):
        for y in range(margin): # 上端
            r, g, b, a = img.getpixel((x, y))
            if a > 0:
                dirty_pixels.append((x, y, (r, g, b, a)))
                has_dirty_pixels = True
        for y in range(height - margin, height): # 下端
            r, g, b, a = img.getpixel((x, y))
            if a > 0:
                dirty_pixels.append((x, y, (r, g, b, a)))
                has_dirty_pixels = True

    # 左端・右端
    for y in range(height):
        for x in range(margin): # 左端
            r, g, b, a = img.getpixel((x, y))
            if a > 0:
                dirty_pixels.append((x, y, (r, g, b, a)))
                has_dirty_pixels = True
        for x in range(width - margin, width): # 右端
            r, g, b, a = img.getpixel((x, y))
            if a > 0:
                dirty_pixels.append((x, y, (r, g, b, a)))
                has_dirty_pixels = True

    if has_dirty_pixels:
        print(f"FAILED: Found {len(dirty_pixels)} non-transparent pixels in the outer {margin}px margin.")
        print("First 5 dirty pixels:", dirty_pixels[:5])
    else:
        print(f"PASSED: The outer {margin}px margin is completely transparent (Alpha=0).")

    # 全体走査で「薄いグレー」が残っていないかチェック
    # Alpha > 0 かつ RGB > 200 のピクセル数をカウント
    # 本来、シルエットは濃いはずなので、薄い色は残っていないはず
    count_light_pixels = 0
    for item in img.getdata():
        if item[3] > 0 and item[0] > 200 and item[1] > 200 and item[2] > 200:
            count_light_pixels += 1
            
    if count_light_pixels > 0:
         print(f"WARNING: Found {count_light_pixels} light-colored pixels (RGB > 200) inside the image.")
    else:
         print("PASSED: No light-colored artifacts found inside the image.")

image_path = "/Users/r_tsuji/Documents/開発/算命学算出/webapp/frontend/public/body-silhouette-final.png"
verify_transparency(image_path)
