from PIL import Image

def make_transparent(image_path, output_path):
    img = Image.open(image_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # 白に近い色（R,G,B > 220）を透明にする
        if item[0] > 220 and item[1] > 220 and item[2] > 220:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved transparent image to {output_path}")

input_path = "/Users/r_tsuji/Documents/開発/算命学算出/webapp/frontend/public/body-silhouette.png"
output_path = "/Users/r_tsuji/Documents/開発/算命学算出/webapp/frontend/public/body-silhouette-transparent.png"

make_transparent(input_path, output_path)
