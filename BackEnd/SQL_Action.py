from Connect_MySQL import * 
from datetime import datetime

def Get_Menu():
    query = "SELECT dish_name, price, ingredients, category, vegetarian, img_link FROM menu;"
    cursor.execute(query)
    results = cursor.fetchall()
    
    # Fetch column names dynamically from the cursor description
    column_names = [desc[0] for desc in cursor.description]
    
    # Convert each row into a dictionary
    dict_results = []
    for row in results:
        row_dict = dict(zip(column_names, row))
        # Parse the ingredients JSON string into a list of keys
        row_dict['ingredients'] = list(eval(row_dict['ingredients']).keys())
        dict_results.append(row_dict)
    
    return dict_results

def get_Weekly_sales():
    query = """
    SELECT date, dish_name, sales 
    FROM sales_data 
    WHERE date >= CURDATE() - INTERVAL 7 DAY;
    """
    cursor.execute(query)
    results = cursor.fetchall()
    
    # Fetch column names dynamically from the cursor description
    column_names = [desc[0] for desc in cursor.description]
    
    # Convert each row into a dictionary
    dict_results = [dict(zip(column_names, row)) for row in results]
    
    # print(dict_results)
    return dict_results

def get_monthly_sales():
    query = """
    SELECT date, dish_name, sales 
    FROM sales_data 
    WHERE MONTH(date) = MONTH(CURDATE()) AND YEAR(date) = YEAR(CURDATE());
    """
    cursor.execute(query)
    results = cursor.fetchall()
    
    # Fetch column names dynamically from the cursor description
    column_names = [desc[0] for desc in cursor.description]
    
    # Convert each row into a dictionary
    dict_results = [dict(zip(column_names, row)) for row in results]
    
    # print(dict_results)
    return dict_results

def get_sales_last_n_months(n):
    query = f"""
    SELECT date, dish_name, sales 
    FROM sales_data 
    WHERE date >= DATE_SUB(CURDATE(), INTERVAL {n} MONTH);
    """
    cursor.execute(query)
    results = cursor.fetchall()
    
    # Fetch column names dynamically from the cursor description
    column_names = [desc[0] for desc in cursor.description]
    
    # Convert each row into a dictionary
    dict_results = [dict(zip(column_names, row)) for row in results]
    
    return dict_results

def get_inventory():
    query = "SELECT *, TIMESTAMPDIFF(SECOND, last_updated, NOW()) AS time_diff_seconds FROM inventory;"
    cursor.execute(query)
    results = cursor.fetchall()
    
    # Fetch column names dynamically from the cursor description
    column_names = [desc[0] for desc in cursor.description]
    
    # Convert each row into a dictionary
    dict_results = []
    for row in results:
        row_dict = dict(zip(column_names, row))
        
        # Calculate human-readable time difference
        seconds = row_dict.pop('time_diff_seconds', 0)
        if seconds < 60:
            time_diff = f"{seconds} seconds ago"
        elif seconds < 3600:
            time_diff = f"{seconds // 60} minutes ago"
        elif seconds < 86400:
            time_diff = f"{seconds // 3600} hours ago"
        else:
            time_diff = f"{seconds // 86400} days ago"
        
        row_dict['time_since_last_update'] = time_diff
        dict_results.append(row_dict)
    
    return dict_results


def get_Prediction():
    query = """
    SELECT * 
    FROM sales_predictions 
    """
    cursor.execute(query)
    results = cursor.fetchall()
    
    # Fetch column names dynamically from the cursor description
    column_names = [desc[0] for desc in cursor.description]
    
    # Convert each row into a dictionary
    dict_results = [dict(zip(column_names, row)) for row in results]
    
    # print(dict_results)
    return dict_results

def update_inventory_for_dish(dish_name, servings):
    # Fetch the ingredients and their quantities for the dish
    query = "SELECT ingredients FROM menu WHERE dish_name = %s;"
    cursor.execute(query, (dish_name,))
    result = cursor.fetchone()
    
    if not result:
        raise ValueError(f"Dish '{dish_name}' not found in the menu.")
    
    ingredients = eval(result[0])  # Parse the JSON string into a dictionary
    
    # Calculate the total quantity needed for the given servings
    required_ingredients = {key: value * servings for key, value in ingredients.items()}
    
    # Fetch the current inventory
    query = "SELECT ingredient, quantity FROM inventory;"
    cursor.execute(query)
    inventory = {row[0]: row[1] for row in cursor.fetchall()}
    
    # Check if there is enough inventory and update it
    for ingredient, required_quantity in required_ingredients.items():
        if ingredient not in inventory:
            raise ValueError(f"Ingredient '{ingredient}' not found in inventory.")
        if inventory[ingredient] < required_quantity:
            raise ValueError(f"Not enough '{ingredient}' in inventory. Required: {required_quantity}, Available: {inventory[ingredient]}")
        inventory[ingredient] -= required_quantity
    
    # Update the inventory in the database
    for ingredient, new_quantity in inventory.items():
        query = "UPDATE inventory SET quantity = %s WHERE ingredient = %s;"
        cursor.execute(query, (new_quantity, ingredient))
    
    # Get current date
    current_date = datetime.today().date()
    day = current_date.weekday() + 1  # Monday=1, Sunday=7
    month = current_date.month
    is_weekend = 1 if day in [6, 7] else 0
    is_holiday = 0  # Modify this if you have a holiday list
    
    # Check if the dish already has sales data for today
    query = "SELECT id, sales FROM sales_data WHERE date = %s AND dish_name = %s;"
    cursor.execute(query, (current_date, dish_name))
    result = cursor.fetchone()
    
    if result:
        # If the dish is already in sales_data for today, update sales count
        sales_id, current_sales = result
        new_sales = current_sales + servings
        query = "UPDATE sales_data SET sales = %s WHERE id = %s;"
        cursor.execute(query, (new_sales, sales_id))
    else:
        # Insert new record if no entry exists for today
        query = """
        INSERT INTO sales_data (date, day, month, is_weekend, is_holiday, dish_name, sales)
        VALUES (%s, %s, %s, %s, %s, %s, %s);
        """
        cursor.execute(query, (current_date, day, month, is_weekend, is_holiday, dish_name, servings))
    
    # Commit the changes
    db.commit()
    
    return f"Inventory updated and sales data recorded for {servings} servings of '{dish_name}'."

# print(update_inventory_for_dish("Crispy Veggie Delight", 2))  # Example usage, replace with actual dish name and servings