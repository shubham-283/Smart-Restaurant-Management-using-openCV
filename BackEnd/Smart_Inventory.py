from Connect_MySQL import *
import json
from datetime import datetime, timedelta

def get_tomorrow_predictions():
    try:        
        # Get tomorrow's date
        tomorrow = (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')

        # Query to fetch predicted sales for tomorrow
        query = """
            SELECT dish_name, ROUND(predicted_sales) AS predicted_sales 
            FROM sales_predictions 
            WHERE date = %s
        """
        cursor.execute(query, (tomorrow,))
        predicted_sales = cursor.fetchall()

        # Fetch ingredients for each dish
        cursor.execute("SELECT dish_name, ingredients FROM menu")
        menu_data = cursor.fetchall()

        # Convert menu data to a dictionary for easy lookup
        menu_ingredients = {dish: json.loads(ingredients) for dish, ingredients in menu_data}

        # Calculate total ingredient needs
        total_ingredients = {}
        sales_summary = []
        
        for dish, sales in predicted_sales:
            sales_summary.append({"dish": dish, "predicted_sales": int(sales)})
            if dish in menu_ingredients:
                for ingredient, qty in menu_ingredients[dish].items():
                    total_ingredients[ingredient] = total_ingredients.get(ingredient, 0) + (qty * int(sales))

        # Fetch available inventory from the inventory table
        cursor.execute("SELECT ingredient, quantity FROM inventory")
        inventory_data = cursor.fetchall()

        # Convert inventory data to a dictionary
        available_inventory = {ingredient: qty for ingredient, qty in inventory_data}

        # Categorize ingredients based on availability
        to_buy = {}
        insufficient = {}
        sufficient = {}

        for ingredient, required_qty in total_ingredients.items():
            available_qty = available_inventory.get(ingredient, 0)

            if available_qty == 0:
                to_buy[ingredient] = required_qty  # No stock available
            elif available_qty < required_qty:
                insufficient[ingredient] = {"available": available_qty, "required": required_qty}  # Partial stock available
            else:
                sufficient[ingredient] = available_qty  # Enough stock available

        # Prepare the output dictionary
        output = {
            "predicted_sales": sales_summary,
            "total_ingredients_needed": total_ingredients,
            "ingredients_to_buy": to_buy,
            "insufficient_ingredients": insufficient,
            "sufficient_ingredients": sufficient
        }

        # Close connection
        cursor.close()
        db.close()

        return output
    
    except mysql.connector.Error as err:
        return {"error": str(err)}

# Example usage
# result = get_tomorrow_predictions()
# print(result)``