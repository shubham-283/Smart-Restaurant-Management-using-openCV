import torch
from ultralytics import YOLO
import cv2
from collections import Counter
from Connect_MySQL import *  # Ensure this imports db and cursor
from SQL_Action import get_inventory

device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"Using device: {device}")

def detect(image_path):
    # Load YOLO model
    model = YOLO("./Models/M_Till_best.pt")  # Update with actual model path
    
    # Run detection
    results = model(image_path, device=device)
    annotated_image = results[0].plot()
    class_indices = results[0].boxes.cls.cpu().numpy().astype(int)
    labels = [model.names[idx] for idx in class_indices]
    label_counts = dict(Counter(labels))  # Count occurrences
    
    # Save annotated output
    output_path = "output.jpg"
    cv2.imwrite(output_path, annotated_image)
    print(f"Output saved as {output_path}")
    
    # Fetch inventory
    inventory = get_inventory()
    inventory_dict = {item['ingredient'].lower(): item for item in inventory}
    
    # Update inventory
    for item, count in label_counts.items():
        item_lower = item.lower()
        
        if item_lower in inventory_dict:
            new_quantity = inventory_dict[item_lower]['quantity'] + count
            update_query = f"""
                UPDATE inventory
                SET quantity = {new_quantity}
                WHERE ingredient = '{item}';
            """
            cursor.execute(update_query)
            print(f"Updated {item}: New quantity = {new_quantity}")
        else:
            insert_query = f"""
                INSERT INTO inventory (ingredient, quantity, remaining_life, quality, category, price)
                VALUES ('{item}', {count}, 7, 'Fresh', 'Unknown', 10);
            """
            cursor.execute(insert_query)
            print(f"Inserted {item} with quantity {count}")
    
    db.commit()  # Commit changes to database
    print("Inventory updated successfully!")
    
    return label_counts
