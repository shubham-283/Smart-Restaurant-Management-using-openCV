import React, { useState, useEffect } from "react";

const InventoryChart = () => {
  const [predictionData, setPredictionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  // Colors for different dishes in the bar chart
  const colors = [
    "bg-green-400",
    "bg-blue-400",
    "bg-red-400",
    "bg-yellow-400",
    "bg-purple-400",
    "bg-indigo-400",
    "bg-pink-400",
    "bg-teal-400",
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch prediction data
        const predictionResponse = await fetch(
          `${API_URL}/get_prediction`
        );
        if (!predictionResponse.ok) {
          throw new Error("Failed to fetch prediction data");
        }
        const predictionResult = await predictionResponse.json();

        // Process the data
        const processedPredictionData = processPredictionData(predictionResult);
        setPredictionData(processedPredictionData);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up a refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Process prediction data to format needed for chart
  const processPredictionData = (data) => {
    // Group by date
    const groupedByDate = data.reduce((acc, item) => {
      const date = new Date(item.date);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      if (!acc[dayName]) {
        acc[dayName] = [];
      }

      acc[dayName].push({
        dish_name: item.dish_name,
        sales: item.predicted_sales,
      });

      return acc;
    }, {});

    // Convert to array format needed for chart
    return Object.entries(groupedByDate).map(([day, items]) => ({
      label: day,
      dishes: items,
    }));
  };

  // Get maximum sales value for scaling
  const getMaxSales = () => {
    let max = 0;

    predictionData.forEach((item) => {
      item.dishes.forEach((dish) => {
        if (dish.sales > max) max = dish.sales;
      });
    });

    // Add a 10% buffer to the max value for better visualization
    return max > 0 ? max * 1.1 : 50; // Default to 50 if no data
  };

  // Get minimum sales value for scaling
  const getMinSales = () => {
    if (predictionData.length === 0) return 0;

    let min = Number.MAX_VALUE;

    predictionData.forEach((item) => {
      item.dishes.forEach((dish) => {
        if (dish.sales < min) min = dish.sales;
      });
    });

    // Make the minimum 0 or 80% of the smallest value, whichever is smaller
    // This helps to emphasize the differences between bars
    return Math.max(0, min * 0.8);
  };

  // Calculate bar height based on sales value
  const calculateBarHeight = (sales) => {
    const maxSales = getMaxSales();
    const minSales = getMinSales();
    const range = maxSales - minSales;

    // Scale to fit in the chart height (230px max height for bars to leave room for axis)
    // Adjust the value to be relative to the minimum value
    return ((sales - minSales) / range) * 230;
  };

  // Generate Y-axis tick values
  const generateYAxisTicks = () => {
    const maxSales = getMaxSales();
    const minSales = getMinSales();
    const tickCount = 5; // Number of ticks to display
    const ticks = [];

    const range = maxSales - minSales;

    for (let i = 0; i <= tickCount; i++) {
      // Create evenly distributed ticks between min and max
      const value = minSales + (range * i) / tickCount;
      // Round to 1 decimal place for cleaner display
      ticks.push(Math.round(value * 10) / 10);
    }

    return ticks;
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Loading chart data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-red-500">Error loading data: {error}</p>
        <button
          className="ml-4 px-3 py-1 bg-blue-500 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  const yAxisTicks = generateYAxisTicks();

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Predicted Sales</h3>
      </div>

      {predictionData.length > 0 ? (
        <div className="flex-1 flex pt-4 overflow-x-auto">
          {/* Y-axis */}
          <div className="flex flex-col justify-between h-60 pr-2 text-xs text-gray-500">
            {yAxisTicks.reverse().map((tick, index) => (
              <div key={index} className="flex items-center">
                <span className="mr-1">{tick}</span>
                {index < yAxisTicks.length - 1 && (
                  <div className="w-2 h-px bg-gray-200"></div>
                )}
              </div>
            ))}
          </div>

          {/* Chart area */}
          <div className="flex-1 flex items-end h-60 border-l border-b border-gray-200 relative">
            {/* Horizontal grid lines */}
            {yAxisTicks.reverse().map((tick, index) => (
              <div
                key={index}
                className="absolute w-full h-px bg-gray-100"
                style={{
                  bottom: `${(index / (yAxisTicks.length - 1)) * 230}px`,
                }}
              ></div>
            ))}

            {/* Bars */}
            <div className="flex items-end justify-between pt-6 w-full">
              {predictionData.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center min-w-20"
                >
                  <div className="w-full flex items-end justify-center space-x-1 mb-2">
                    {item.dishes.map((dish, i) => (
                      <div
                        key={i}
                        className={`${
                          colors[i % colors.length]
                        } w-4 transition-all duration-300 relative group`}
                        style={{
                          height: `${calculateBarHeight(dish.sales)}px`,
                        }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs p-1 rounded whitespace-nowrap z-10">
                          {dish.dish_name}: {dish.sales.toFixed(1)} predicted
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">No prediction data available</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        {Array.from(
          new Set(
            predictionData.flatMap((item) =>
              item.dishes.map((dish) => dish.dish_name)
            )
          )
        ).map((dishName, index) => (
          <div key={index} className="flex items-center text-xs">
            <div
              className={`w-3 h-3 ${colors[index % colors.length]} mr-1`}
            ></div>
            <span>{dishName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryChart;
