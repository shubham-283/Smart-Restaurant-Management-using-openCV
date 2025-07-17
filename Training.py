import os
from ultralytics import YOLO

if __name__ == '__main__':
    # Set the environment variable to avoid KMP_DUPLICATE_LIB_OK error
    os.environ["KMP_DUPLICATE_LIB_OK"] = "TRUE"

    datasets = r"C:\Users\satwi\Downloads\HackJNUThon\Dataset\data.yaml"
    model = YOLO("yolov8n.pt")  # Load pre-trained model

    model.train(data=datasets, epochs=50)
