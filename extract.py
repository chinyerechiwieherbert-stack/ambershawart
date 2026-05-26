import cv2
import numpy as np

img = cv2.imread('Ref Pillars and Roof.jpeg')
if img is not None:
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # White fretwork is very bright, sky is slightly darker. Threshold!
    # Anything above 200 brightness becomes 255 (white), below becomes 0 (black).
    _, thresh = cv2.threshold(gray, 180, 255, cv2.THRESH_BINARY)
    
    # We want to keep the white parts (fretwork) and make black (sky) transparent.
    # Convert to BGRA
    bgra = cv2.cvtColor(thresh, cv2.COLOR_GRAY2BGRA)
    
    # Set the alpha channel: where the image is black (0), set alpha to 0. 
    # Where it's white (255), set alpha to 255
    bgra[:, :, 3] = thresh
    
    # To make it look like a crisp white overlay styling:
    # Set RGB to pure white/cream always (so shadows are removed)
    bgra[:, :, 0] = 250
    bgra[:, :, 1] = 248
    bgra[:, :, 2] = 245
    
    # Save the beautifully isolated SVG-like canopy
    cv2.imwrite('canopy_overlay.png', bgra)
    print("Mask extracted!")
else:
    print("Could not load image.")
