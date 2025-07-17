from Connect_MySQL import * 
from Yolo_Prediction import detect
from SQL_Action import get_inventory

def update_inventory(image_path):
    detected_items = detect(image_path)  # Get detected items with counts
    inventory = get_inventory()  # Fetch current inventory

    # Convert inventory list to a dictionary for easy lookup
    inventory_dict = {item['ingredient'].lower(): item for item in inventory}

    for item, count in detected_items.items():
        item_lower = item.lower()  # Normalize case for comparison
        
        if item_lower in inventory_dict:
            # Update existing item quantity
            new_quantity = inventory_dict[item_lower]['quantity'] + count
            update_query = f"""
                UPDATE inventory
                SET quantity = {new_quantity}
                WHERE ingredient = '{item}';
            """
            print(update_query)
            cursor.execute(update_query)
            print(f"Rows affected: {cursor.rowcount}")  # Debugging line

        else:
            # Insert new item into the inventory with default values
            insert_query = f"""
                INSERT INTO inventory (ingredient, quantity, remaining_life, quality, category, price)
                VALUES ('{item}', {count}, 7, 'Fresh', 'Unknown', 10);
            """
            print(insert_query)
            cursor.execute(insert_query)
            print(f"Rows affected: {cursor.rowcount}")  # Debugging line

    db.commit()  # Ensure changes are committed
    print("Inventory updated successfully!")

# update_inventory(r"C:\Users\satwi\Downloads\HackJNUThon\Python\Backend\uploads\corn1.jpg")
