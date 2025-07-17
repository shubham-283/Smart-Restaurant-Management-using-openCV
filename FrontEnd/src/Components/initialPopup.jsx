import React, { useState, useEffect } from "react";
import { X, AlertTriangle, ShoppingCart } from "lucide-react";

const InventoryAlertPopup = ({ isOpen, onClose }) => {
  // State for controlling popup visibility and storing inventory data
  const [showPopup, setShowPopup] = useState(isOpen);
  const [inventoryData, setInventoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("quality"); // New state for tab control: 'quality' or 'stock'

  // Constants
  const STOCK_LOW = 10;
  const API_URL = process.env.REACT_APP_API_URL;
  // Fetch inventory data from API
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${API_URL}/get_inventory_item`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch inventory data");
        }
        const data = await response.json();
        setInventoryData(data);
        setError(null);
      } catch (err) {
        setError("Failed to load inventory data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryData();
  }, []);

  // Filter bad and rotten items
  const badItems = inventoryData.filter((item) => item.quality === "Bad");
  const rottenItems = inventoryData.filter((item) => item.quality === "Rotten");

  // Filter low stock items (less than 10)
  const lowStockItems = inventoryData.filter(
    (item) => item.quantity < STOCK_LOW
  );

  // Calculate totals for badge display
  const totalBadItems = badItems.length;
  const totalRottenItems = rottenItems.length;
  const totalLowStockItems = lowStockItems.length;

  // Update the showPopup state when isOpen prop changes
  useEffect(() => {
    setShowPopup(isOpen);
  }, [isOpen]);

  // Only show popup if there are issues to report
  const hasQualityIssues = totalBadItems > 0 || totalRottenItems > 0;
  const hasStockIssues = totalLowStockItems > 0;
  const hasIssues = hasQualityIssues || hasStockIssues;

  // Function to close the popup
  const handleClose = () => {
    setShowPopup(false);
    if (onClose) onClose();
  };

  // Calculate percent of life remaining for progress bar
  const getLifePercentage = (remaining, max) => {
    return (remaining / max) * 100;
  };

  // Get appropriate color class based on percentage
  const getLifeColorClass = (percentage) => {
    if (percentage <= 25) return "bg-red-500";
    if (percentage <= 50) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (!showPopup || (!hasIssues && !loading)) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        ></div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                {activeTab === "quality" ? (
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                ) : (
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {activeTab === "quality"
                    ? "Inventory Quality Alert"
                    : "Low Stock Alert"}
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    {activeTab === "quality"
                      ? "Some items in your inventory require immediate attention:"
                      : "The following items are running low on stock:"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tab navigation */}
            <div className="border-b border-gray-200 mt-4">
              <nav className="flex -mb-px">
                <button
                  onClick={() => handleTabChange("quality")}
                  className={`mr-8 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "quality"
                      ? "border-red-500 text-red-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Quality Issues
                  {hasQualityIssues && (
                    <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                      {totalBadItems + totalRottenItems}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => handleTabChange("stock")}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "stock"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  Low Stock
                  {hasStockIssues && (
                    <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                      {totalLowStockItems}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="mt-4 p-4 bg-red-50 rounded-md text-red-600 text-sm">
                {error}
              </div>
            ) : (
              <div className="mt-4 max-h-96 overflow-y-auto">
                {/* Quality Issues Tab Content */}
                {activeTab === "quality" && (
                  <>
                    {totalBadItems > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium text-yellow-600 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Bad Quality Items ({totalBadItems})
                        </h4>
                        <ul className="mt-2 space-y-3">
                          {badItems.map((item) => (
                            <li
                              key={`bad-${item.ingredient}`}
                              className="text-sm bg-yellow-50 rounded-md p-3"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">
                                  {item.ingredient}
                                </span>
                                <span className="font-medium text-yellow-600">
                                  {item.quality}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>{item.category}</span>
                                <span>
                                  Updated: {item.time_since_last_update}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs w-24">
                                  Life remaining:
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                                  <div
                                    className={`${getLifeColorClass(
                                      getLifePercentage(
                                        item.remaining_life,
                                        item.max_life
                                      )
                                    )} h-2 rounded-full`}
                                    style={{
                                      width: `${getLifePercentage(
                                        item.remaining_life,
                                        item.max_life
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs ml-2 w-16 text-right">
                                  {item.remaining_life}/{item.max_life} days
                                </span>
                              </div>
                              <div className="flex justify-between mt-2">
                                <span className="text-xs">
                                  Quantity: {item.quantity} units
                                </span>
                                <span className="text-xs">
                                  Price: ${item.price}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {totalRottenItems > 0 && (
                      <div>
                        <h4 className="font-medium text-red-600 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Rotten Items ({totalRottenItems})
                        </h4>
                        <ul className="mt-2 space-y-3">
                          {rottenItems.map((item) => (
                            <li
                              key={`rotten-${item.ingredient}`}
                              className="text-sm bg-red-50 rounded-md p-3"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">
                                  {item.ingredient}
                                </span>
                                <span className="font-medium text-red-600">
                                  {item.quality}
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>{item.category}</span>
                                <span>
                                  Updated: {item.time_since_last_update}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs w-24">
                                  Life remaining:
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                                  <div
                                    className="bg-red-500 h-2 rounded-full"
                                    style={{
                                      width: `${getLifePercentage(
                                        item.remaining_life,
                                        item.max_life
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs ml-2 w-16 text-right">
                                  {item.remaining_life}/{item.max_life} days
                                </span>
                              </div>
                              <div className="flex justify-between mt-2">
                                <span className="text-xs">
                                  Quantity: {item.quantity} units
                                </span>
                                <span className="text-xs">
                                  Price: ${item.price}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {!hasQualityIssues && (
                      <div className="p-4 text-center text-green-600">
                        No quality issues found in inventory.
                      </div>
                    )}
                  </>
                )}

                {/* Low Stock Tab Content */}
                {activeTab === "stock" && (
                  <>
                    {totalLowStockItems > 0 ? (
                      <div>
                        <h4 className="font-medium text-blue-600 flex items-center">
                          <ShoppingCart className="w-4 h-4 mr-1" />
                          Low Stock Items ({totalLowStockItems})
                        </h4>
                        <ul className="mt-2 space-y-3">
                          {lowStockItems.map((item) => (
                            <li
                              key={`stock-${item.ingredient}`}
                              className="text-sm bg-blue-50 rounded-md p-3"
                            >
                              <div className="flex justify-between items-center mb-1">
                                <span className="font-medium">
                                  {item.ingredient}
                                </span>
                                <span className="font-medium text-blue-600">
                                  {item.quantity} / {STOCK_LOW} units
                                </span>
                              </div>
                              <div className="flex justify-between text-xs text-gray-500 mb-2">
                                <span>{item.category}</span>
                                <span>
                                  Updated: {item.time_since_last_update}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-xs w-24">
                                  Stock level:
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-2 ml-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{
                                      width: `${
                                        (item.quantity / STOCK_LOW) * 100
                                      }%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-xs ml-2 w-16 text-right">
                                  {Math.round(
                                    (item.quantity / STOCK_LOW) * 100
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="flex justify-between mt-2">
                                <span className="text-xs">
                                  Quality: {item.quality}
                                </span>
                                <span className="text-xs">
                                  Price: ${item.price}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-green-600">
                        All items have adequate stock levels.
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleClose}
            >
              Close
            </button>
          </div>

          {/* Close button at top right */}
          <button
            className="absolute top-0 right-0 m-4 text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={handleClose}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InventoryAlertPopup;
