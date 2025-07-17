import { useState, useEffect } from "react";
import { Box } from "@mui/material";

export default function Reports() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [predictionData, setPredictionData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState("weekly");
  const [error, setError] = useState(null);

  // Colors for different dishes in the bar chart 17
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
  const API_URL = process.env.REACT_APP_API_URL;
  // Fetch data from APIs
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch weekly sales data
        const weeklyResponse = await fetch(
          `${API_URL}/get_Weekly_sales`
        );
        if (!weeklyResponse.ok) {
          throw new Error("Failed to fetch weekly data");
        }
        const weeklyResult = await weeklyResponse.json();

        // Fetch monthly sales data
        const monthlyResponse = await fetch(
          `${API_URL}/get_Monthly_sales`
        );
        if (!monthlyResponse.ok) {
          throw new Error("Failed to fetch monthly data");
        }
        const monthlyResult = await monthlyResponse.json();

        // Fetch prediction data
        const predictionResponse = await fetch(
          `${API_URL}/get_prediction`
        );
        if (!predictionResponse.ok) {
          throw new Error("Failed to fetch prediction data");
        }
        const predictionResult = await predictionResponse.json();

        // Process the data
        const processedWeeklyData = processWeeklyData(weeklyResult);
        const processedMonthlyData = processMonthlyData(monthlyResult);
        const processedPredictionData = processPredictionData(predictionResult);

        setWeeklyData(processedWeeklyData);
        setMonthlyData(processedMonthlyData);
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

  // Process weekly data to format needed for chart
  const processWeeklyData = (data) => {
    // Group by date
    const groupedByDate = data.reduce((acc, item) => {
      const date = new Date(item.date);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

      if (!acc[dayName]) {
        acc[dayName] = [];
      }

      acc[dayName].push({
        dish_name: item.dish_name,
        sales: item.sales,
      });

      return acc;
    }, {});

    // Convert to array format needed for chart
    return Object.entries(groupedByDate).map(([day, items]) => ({
      day,
      dishes: items,
    }));
  };

  // Process monthly data to format needed for chart
  const processMonthlyData = (data) => {
    // Group by month
    const groupedByMonth = data.reduce((acc, item) => {
      const date = new Date(item.date);
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      if (!acc[monthName]) {
        acc[monthName] = [];
      }

      acc[monthName].push({
        dish_name: item.dish_name,
        sales: item.sales,
      });

      return acc;
    }, {});

    // Convert to array format needed for chart
    return Object.entries(groupedByMonth).map(([month, items]) => ({
      month,
      dishes: items,
    }));
  };

  // Process prediction data to format needed for chart
  const processPredictionData = (data) => {
    // Group by date
    const groupedByDate = data.reduce((acc, item) => {
      const date = new Date(item.date);
      const displayDate = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!acc[displayDate]) {
        acc[displayDate] = [];
      }

      acc[displayDate].push({
        dish_name: item.dish_name,
        predicted_sales: item.predicted_sales,
      });

      return acc;
    }, {});

    // Convert to array format needed for chart
    return Object.entries(groupedByDate).map(([date, items]) => ({
      date,
      dishes: items,
    }));
  };

  // Get maximum sales value for scaling
  const getMaxSales = () => {
    const currentData = activeView === "weekly" ? weeklyData : monthlyData;
    let max = 0;

    currentData.forEach((item) => {
      item.dishes.forEach((dish) => {
        if (dish.sales > max) max = dish.sales;
      });
    });

    return max > 0 ? max : 50; // Default to 50 if no data
  };

  // Get maximum predicted sales value for scaling
  const getMaxPredictedSales = () => {
    let max = 0;

    predictionData.forEach((item) => {
      item.dishes.forEach((dish) => {
        if (dish.predicted_sales > max) max = dish.predicted_sales;
      });
    });

    return max > 0 ? max : 50; // Default to 50 if no data
  };

  // Calculate bar height based on sales value
  const calculateBarHeight = (sales) => {
    const maxSales = getMaxSales();
    // Scale to fit in the chart height (230px max height for bars to leave room for axis)
    return (sales / maxSales) * 230;
  };

  // Calculate bar height based on predicted sales value
  const calculatePredictedBarHeight = (sales) => {
    const maxSales = getMaxPredictedSales();
    // Scale to fit in the chart height (230px max height for bars to leave room for axis)
    return (sales / maxSales) * 230;
  };

  // Generate Y-axis tick values for sales
  const generateYAxisTicks = () => {
    const maxSales = getMaxSales();
    const tickCount = 5; // Number of ticks to display
    const ticks = [];

    for (let i = 0; i <= tickCount; i++) {
      ticks.push(Math.round((maxSales * i) / tickCount));
    }

    return ticks;
  };

  // Generate Y-axis tick values for predicted sales
  const generatePredictionYAxisTicks = () => {
    const maxSales = getMaxPredictedSales();
    const tickCount = 5; // Number of ticks to display
    const ticks = [];

    for (let i = 0; i <= tickCount; i++) {
      ticks.push(Math.round((maxSales * i) / tickCount));
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

  const displayData = activeView === "weekly" ? weeklyData : monthlyData;
  const labelKey = activeView === "weekly" ? "day" : "month";
  const yAxisTicks = generateYAxisTicks();
  const predictionYAxisTicks = generatePredictionYAxisTicks();

  return (
    <div className="pl-7 pt-3 pr-7">
      {/* Sales Data Chart */}
      <Box
        sx={{
          p: 5,
          border: "1px solid #D3D3D3",
          borderRadius: "8px",
          width: "100%",
          mb: 4, // Added margin-bottom to separate the charts
        }}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Sales Data</h3>
            <div className="flex space-x-2">
              <button
                className={`px-3 py-1 rounded ${
                  activeView === "weekly"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setActiveView("weekly")}
              >
                Weekly
              </button>
              <button
                className={`px-3 py-1 rounded ${
                  activeView === "monthly"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setActiveView("monthly")}
              >
                Monthly
              </button>
            </div>
          </div>

          {displayData.length > 0 ? (
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
                  {displayData.map((item, index) => (
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
                              {dish.dish_name}: {dish.sales} sales
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {item[labelKey]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500">
                No {activeView} sales data available
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            {Array.from(
              new Set(
                displayData.flatMap((item) =>
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
      </Box>

      {/* Prediction Data Chart */}
      <Box
        sx={{
          p: 5,
          border: "1px solid #D3D3D3",
          borderRadius: "8px",
          width: "100%",
        }}
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Sales Prediction Data</h3>
          </div>

          {predictionData.length > 0 ? (
            <div className="flex-1 flex pt-4 overflow-x-auto">
              {/* Y-axis */}
              <div className="flex flex-col justify-between h-60 pr-2 text-xs text-gray-500">
                {predictionYAxisTicks.reverse().map((tick, index) => (
                  <div key={index} className="flex items-center">
                    <span className="mr-1">{tick}</span>
                    {index < predictionYAxisTicks.length - 1 && (
                      <div className="w-2 h-px bg-gray-200"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Chart area */}
              <div className="flex-1 flex items-end h-60 border-l border-b border-gray-200 relative">
                {/* Horizontal grid lines */}
                {predictionYAxisTicks.reverse().map((tick, index) => (
                  <div
                    key={index}
                    className="absolute w-full h-px bg-gray-100"
                    style={{
                      bottom: `${
                        (index / (predictionYAxisTicks.length - 1)) * 230
                      }px`,
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
                              height: `${calculatePredictedBarHeight(
                                dish.predicted_sales
                              )}px`,
                            }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-800 text-white text-xs p-1 rounded whitespace-nowrap z-10">
                              {dish.dish_name}:{" "}
                              {dish.predicted_sales.toFixed(2)} predicted sales
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {item.date}
                      </div>
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

          <div className="mt-5 flex flex-wrap gap-2">
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
      </Box>
    </div>
  );
}
