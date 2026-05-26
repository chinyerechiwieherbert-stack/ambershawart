import cv2
import numpy as np
import os
import glob

def auto_crop_art(image_path, output_path):
    # Only process files > 0 bytes natively
    img = cv2.imread(image_path)
    if img is None:
        return

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Edge detection to find the border of the painting
    edges = cv2.Canny(gray, 50, 150)
    
    # Dilate edges to connect broken lines
    kernel = np.ones((5,5), np.uint8)
    dilated = cv2.dilate(edges, kernel, iterations=2)
    
    # Find contours
    contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    max_area = 0
    best_rect = None
    h_img, w_img = img.shape[:2]
    
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        if w < 50 or h < 50: continue
        
        area = w * h
        # We assume the painting is at least 15% of the screenshot
        if area > (h_img * w_img * 0.15):
            if area > max_area:
                max_area = area
                best_rect = (x, y, w, h)
                
    if best_rect:
        x, y, w, h = best_rect
        margin = 3
        # If the detected contour is essentially the whole image (less than 5% was cropped), skip
        if area > h_img * w_img * 0.90:
            return

        x = max(0, x + margin)
        y = max(0, y + margin)
        w = max(10, w - 2*margin)
        h = max(10, h - 2*margin)
        
        cropped = img[y:y+h, x:x+w]
        cv2.imwrite(output_path, cropped)
        print(f"  -> Cropped {image_path}: {w}x{h}")
    else:
        pass

files = glob.glob("*.jpg")
for f in files:
    auto_crop_art(f, f)

print("Done processing JPG artworks.")
