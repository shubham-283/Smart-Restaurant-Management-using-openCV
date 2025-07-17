import torch
from ultralytics import YOLO
import cv2

# Load the trained YOLOv8 model
model = YOLO(r"C:\Users\satwi\Downloads\HackJNUThon\models\M_Till_best.pt")  # Update this path to your trained model

# Check if GPU is available
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

def test_image(image_path):
    results = model(image_path, device=device)  # Run inference 
    annotated_image = results[0].plot()  # Get the image with detections
    # Display the image
    cv2.imshow("YOLOv8 Detection", annotated_image)
    cv2.waitKey(0)  # Wait for a key press
    cv2.destroyAllWindows()

    # Save the output image
    output_path = "output.jpg"
    cv2.imwrite(output_path, annotated_image)
    print(f"Output saved as {output_path}")

# Set image path
image_path = r"C:\Users\satwi\Downloads\HackJNUThon\test\tomato1.webp"# Change this to your test image path
test_image(image_path)
