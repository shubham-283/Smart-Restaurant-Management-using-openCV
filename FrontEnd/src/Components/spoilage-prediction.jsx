import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AlertTriangle, RefreshCw, Camera } from "lucide-react";

// Component to show the freshness indicator
const FreshnessIndicator = ({ value }) => {
  // Function to determine color based on freshness level
  const getColor = (val) => {
    if (val < 40) return "bg-red-500";
    if (val < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm">Freshness</span>
        <span className="text-sm font-medium">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${getColor(value)} h-2 rounded-full`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

// Main component
const SpoilagePrediction = () => {
  const [activeTab, setActiveTab] = useState("at-risk");
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [predictionData, setPredictionData] = useState([]);
  const [trendsData, setTrendsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  // Function to fetch data from API
  const fetchInventoryData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_URL}/get_inventory_item`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Process the data to include freshness calculation
      const processedData = data.map((item, index) => {
        // Calculate freshness as a percentage based on remaining_life and max_life
        const freshness = Math.round(
          (item.remaining_life / item.max_life) * 100
        );

        // Calculate estimated days left (rounding to nearest day)
        const estimatedDaysLeft = Math.ceil(item.remaining_life);

        return {
          id: index + 1,
          name: item.ingredient || `Item ${index + 1}`,
          category: item.category || "Uncategorized",
          freshness: freshness,
          estimatedDaysLeft: estimatedDaysLeft,
          remaining_life: item.remaining_life,
          max_life: item.max_life,
        };
      });

      setPredictionData(processedData);

      // Generate trends data based on the most at-risk items
      generateTrendsData(processedData);
    } catch (err) {
      console.error("Error fetching inventory data:", err);
      setError("Failed to load inventory data. Please try again later.");

      // Fallback to sample data in case of error
      const fallbackData = [
        {
          id: 1,
          name: "Fresh Salmon",
          category: "Seafood",
          freshness: 25,
          estimatedDaysLeft: 1,
          confidence: 92,
        },
        {
          id: 2,
          name: "Organic Spinach",
          category: "Produce",
          freshness: 30,
          estimatedDaysLeft: 1,
          confidence: 89,
        },
        {
          id: 3,
          name: "Heavy Cream",
          category: "Dairy",
          freshness: 45,
          estimatedDaysLeft: 2,
          confidence: 94,
        },
        {
          id: 4,
          name: "Ground Beef",
          category: "Meat",
          freshness: 60,
          estimatedDaysLeft: 2,
          confidence: 91,
        },
        {
          id: 5,
          name: "Tomatoes",
          category: "Produce",
          freshness: 70,
          estimatedDaysLeft: 3,
          confidence: 88,
        },
        {
          id: 6,
          name: "Chicken Breast",
          category: "Meat",
          freshness: 75,
          estimatedDaysLeft: 3,
          confidence: 93,
        },
      ];

      setPredictionData(fallbackData);
      generateTrendsData(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  // Function to generate trends data based on the current items
  const generateTrendsData = (items) => {
    // Filter items with 7 days or less remaining
    const itemsWithin7Days = items.filter(
      (item) => item.estimatedDaysLeft <= 7
    );

    // Choose up to 4 items with the lowest freshness for trend visualization
    const itemsToTrack = [...itemsWithin7Days]
      .sort((a, b) => a.freshness - b.freshness)
      .slice(0, 4);

    if (itemsToTrack.length === 0) {
      setTrendsData([]);
      return;
    }

    // Generate data points for each day (up to the max days left or 7, whichever is less)
    const trendsDataArray = [];
    const maxDaysToProject = Math.min(
      7,
      Math.max(...itemsToTrack.map((item) => item.estimatedDaysLeft))
    );

    for (let day = 0; day < maxDaysToProject; day++) {
      const dataPoint = { day: `Day ${day + 1}` };

      itemsToTrack.forEach((item) => {
        // Calculate expected freshness for each day
        // Starting from current freshness and decreasing based on remaining life
        const daysLeft = item.estimatedDaysLeft;
        const decayRate = item.freshness / daysLeft;

        // Ensure freshness doesn't go below 0
        const projectedFreshness = Math.max(
          0,
          Math.round(item.freshness - day * decayRate)
        );

        // Use item name as the key for the data point
        const cleanName = item.name.toLowerCase().replace(/\s+/g, "_");
        dataPoint[cleanName] = projectedFreshness;
        dataPoint[`${cleanName}_label`] = item.name; // Store original name for display
      });

      trendsDataArray.push(dataPoint);
    }

    setTrendsData(trendsDataArray);
  };

  // Fetch data on component mount and when refresh is clicked
  useEffect(() => {
    fetchInventoryData();
  }, []);

  // Create count of items expiring soon
  const expiringItemsCount = predictionData.filter(
    (item) => item.estimatedDaysLeft <= 2
  ).length;

  // Get line colors for the chart
  const getLineColor = (index) => {
    const colors = ["#ef4444", "#22c55e", "#3b82f6", "#f59e0b"];
    return colors[index % colors.length];
  };

  // Extract unique items from trends data for generating chart lines
  const trendItems =
    trendsData.length > 0
      ? Object.keys(trendsData[0]).filter(
          (key) => !key.includes("_label") && key !== "day"
        )
      : [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">
            Spoilage Prediction
          </h1>
          <p className="text-gray-500 mt-1">
            AI-powered freshness monitoring and spoilage prediction
          </p>
        </div>

        <div className="p-6">
          {/* Alert */}
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md mb-6">
            <div className="flex items-start">
              <AlertTriangle className="text-yellow-500 mr-3 flex-shrink-0 mt-0.5 " />
              <div>
                <h3 className="font-medium text-yellow-800 text-left">
                  Attention Required
                </h3>
                <p className="text-yellow-700 mt-1">
                  {expiringItemsCount} items are predicted to expire within the
                  next 48 hours. Take action to reduce waste.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 mb-6">
            <button
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={fetchInventoryData}
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh Analysis
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex -mb-px space-x-8">
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "at-risk"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("at-risk")}
              >
                At Risk Items
              </button>
              <button
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "trends"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab("trends")}
              >
                Freshness Trends
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-96">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center">
                  <RefreshCw
                    size={24}
                    className="text-blue-500 animate-spin mr-3"
                  />
                  <p className="text-gray-600">Loading inventory data...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        className="text-sm font-medium text-red-600 hover:text-red-500"
                        onClick={fetchInventoryData}
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* At Risk Items */}
            {!loading && !error && activeTab === "at-risk" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {predictionData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          {item.name}
                        </h3>
                      </div>

                      <FreshnessIndicator value={item.freshness} />

                      <div className="grid grid-cols-2 gap-4 mt-5">
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-gray-500 mb-1">
                            Est. Days Left
                          </p>
                          <p
                            className={`text-xl font-bold ${
                              item.estimatedDaysLeft <= 1
                                ? "text-red-600"
                                : item.estimatedDaysLeft <= 2
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {item.estimatedDaysLeft} Days
                          </p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg text-center">
                          <p className="text-xs text-gray-500 mb-1">
                            Max Lifespan
                          </p>
                          <p className="text-xl font-bold text-blue-600">
                            {item.max_life} Days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Freshness Trends */}
            {!loading && !error && activeTab === "trends" && (
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Freshness Trends (≤ 7 Days)
                  </h3>
                  <p className="text-sm text-gray-500">
                    Projected freshness levels for items expiring within 7 days
                  </p>
                </div>
                {trendsData.length > 0 ? (
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="day"
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                        />
                        <YAxis
                          label={{
                            value: "Freshness %",
                            angle: -90,
                            position: "insideLeft",
                            style: { textAnchor: "middle", fontSize: 12 },
                          }}
                          tick={{ fontSize: 12 }}
                          tickLine={false}
                          domain={[0, 100]}
                        />
                        <Tooltip
                          contentStyle={{
                            borderRadius: "4px",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
                          }}
                          formatter={(value, name) => {
                            // Find the original item name for display in tooltip
                            const dayData = trendsData[0];
                            const label = dayData[`${name}_label`] || name;
                            return [`${value}%`, label];
                          }}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: 20 }}
                          iconType="circle"
                          formatter={(value) => {
                            // Find the original item name for display in legend
                            const dayData = trendsData[0];
                            return dayData[`${value}_label`] || value;
                          }}
                        />
                        {trendItems.map((item, index) => (
                          <Line
                            key={item}
                            type="monotone"
                            dataKey={item}
                            stroke={getLineColor(index)}
                            name={item}
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <p className="text-gray-500">
                        No items expiring within 7 days
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpoilagePrediction;
