import cv2
import numpy as np
import os

img = cv2.imread('roof_png.png', cv2.IMREAD_UNCHANGED)
if img is not None and img.shape[2] == 4:
    # Get alpha mask
    alpha = img[:,:,3]
    
    # Calculate bounding box from alpha
    coords = cv2.findNonZero(alpha)
    if coords is not None:
        x, y, w, h = cv2.boundingRect(coords)
        cropped = img[y:y+h, x:x+w]
        
        b, g, r, a = cv2.split(cropped)
        
        # Turn it into a flat, crisp vector-style illustration (pure crisp OFF-WHITE)
        r.fill(253)
        g.fill(252)
        b.fill(249)
        
        vectorized = cv2.merge([b, g, r, a])
        cv2.imwrite('canopy_overlay.png', vectorized)
        print("Successfully generated isolated architectural vector illustration!")
    else:
        print("No alpha found in the image.")
else:
    print("Image not found or not transparent.")
