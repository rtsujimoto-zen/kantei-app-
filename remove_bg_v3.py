from PIL import Image

def process_image(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # 閾値を大幅に下げる(100)
        # R, G, B すべてが 100 以上なら透明にする
        # これにより、黒(0,0,0)〜濃いグレー(99,99,99)だけが残る
        if item[0] > 100 and item[1] > 100 and item[2] > 100:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved processed image to {output_path}")

# 元の画像（body-silhouette.png）を入力とする
# 前回上書きしているので注意が必要だが、今回はbody-silhouette.pngを使う（これは元のsipsクロップ後のもののはずだが...）
# いや、Step 6989でsipsで上書きしたのが最後。しかしその後スクリプトでbody-silhouette-transparent.pngを作った。
# 安全のため body-silhouette.png をソースにする。これが残っていれば。
input_path = "/Users/r_tsuji/Documents/開発/算命学算出/webapp/frontend/public/body-silhouette.png"
output_path = "/Users/r_tsuji/Documents/開発/算命学算出/webapp/frontend/public/body-silhouette-transparent.png"

process_image(input_path, output_path)
