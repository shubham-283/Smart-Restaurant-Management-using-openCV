import pandas as pd
from prophet import Prophet
from Connect_MySQL import *

def predict_sales():
    # Fetch sales data excluding today's sales
    query = """
    SELECT date, dish_name, sales FROM sales_data
    WHERE date < CURDATE();
    """
    df = pd.read_sql(query, db)

    # Prepare data for Prophet
    def prepare_data(df, dish):
        df_dish = df[df['dish_name'] == dish][['date', 'sales']]
        df_dish = df_dish.rename(columns={'date': 'ds', 'sales': 'y'})
        return df_dish

    # Get unique dish names
    dishes = df['dish_name'].unique()

    # Store predictions
    predictions = {}

    for dish in dishes:
        data = prepare_data(df, dish)
        model = Prophet()
        model.fit(data)
        
        # Predict next 10 days
        future = model.make_future_dataframe(periods=10)
        forecast = model.predict(future)
        
        # Store predictions
        predictions[dish] = forecast[['ds', 'yhat']].tail(10)

        # Insert predictions into MySQL
        for index, row in forecast.tail(10).iterrows():
            cursor.execute("""
            INSERT INTO sales_predictions (date, dish_name, predicted_sales)
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE predicted_sales = VALUES(predicted_sales);
            """, (row['ds'], dish, row['yhat']))
        db.commit()

    # Display predictions
    for dish, forecast in predictions.items():
        print(f"Predicted sales for {dish} in the next 10 days:")
        print(forecast)
        print("-" * 50)

    db.close()
