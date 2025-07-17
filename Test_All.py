import torch
from ultralytics import YOLO
import cv2
import os
import glob

# Load the trained YOLOv8 model
model = YOLO(r"C:\Users\satwi\Downloads\HackJNUThon\models\M_Till_best.pt")  # Update this path to your trained model

# Check if GPU is available
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

# Set directory containing images
image_dir = r"C:\Users\satwi\Downloads\HackJNUThon\test"

# Get all image paths from the directory
image_paths = glob.glob(os.path.join(image_dir, "*.*"))  # Supports various image formats

def test_image(image_path):
    results = model(image_path, device=device)  # Run inference
    annotated_image = results[0].plot()  # Get the image with detections

    # Display the image
    cv2.imshow("YOLOv8 Detection", annotated_image)
    key = cv2.waitKey(0)  # Wait for a key press

    # Save the output image
    save_dir = r"C:\Users\satwi\Downloads\HackJNUThon\Output"
    output_path = os.path.join(save_dir, "output_" + os.path.basename(image_path))
    cv2.imwrite(output_path, annotated_image)
    print(f"Output saved as {output_path}")

    cv2.destroyAllWindows()
    
    return key

# Iterate through all images in the directory
for image_path in image_paths:
    key = test_image(image_path)
    if key == ord('q'):  # Exit if 'q' is pressed
        break
