// import { useState, useEffect } from "react";
// import SpoilagePrediction from "./spoilage-prediction";
// import { InventoryTracker } from "./inventory-trackor";
// import { OperationsOptimizer } from "./operation-optimizer";
// import FoodRecommendation from "./FoodRecommendation";
// import MenuSection from "./menu";
// import InventoryChart from "./inventoryChart";
// import Logo from "../assets/logo.png";
// import Reports from "./reports";
// import InitialPopup from "./initialPopup";
// import { Bell } from "lucide-react";
// import FoodOrderPopup from "./order";

// // Enhanced Header Component for the Dashboard
// const DashboardHeader = ({
//   activeTab,
//   setActiveTab,
//   tabs,
//   expiringToday = 5,
//   recommendationsCount = 8,
// }) => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showPopup, setShowPopup] = useState(false);
//   // Show popup automatically when user first visits the page
//   useEffect(() => {
//     setShowPopup(true);
//   }, []);

//   // Function to open popup when button is clicked

//   const handleOpenPopup = () => {
//     setShowPopup(true);
//   };

//   // Function to close popup

//   const handleClosePopup = () => {
//     setShowPopup(false);
//   };

//   // Update time every minute
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 60000);

//     return () => clearInterval(timer);
//   }, []);



//   const [isFoodPopupOpen, setIsFoodPopupOpen] = useState(false);

//   const foodOpenPopup = () => {
//     setIsFoodPopupOpen(true);
//   };

//   const foodClosePopup = () => {
//     setIsFoodPopupOpen(false);
//   };



//   // Format the current date
//   const formattedDate = new Intl.DateTimeFormat("en-US", {
//     weekday: "long",
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   }).format(currentTime);

//   // Format last update time
//   const lastUpdateTime = new Intl.DateTimeFormat("en-US", {
//     hour: "2-digit",
//     minute: "2-digit",
//   }).format(currentTime);

//   return (
//     <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
//       {/* Top section with search and user info */}
//       <div className="px-6 py-4 flex items-center justify-between">
//         <div className="flex items-center">
//           <img src={Logo} alt="Dashboard Icon" className="w-[100px] h-8 mr-2" />
//           <h1 className="text-2xl font-bold text-gray-800 mr-4">Dashboard</h1>
//           <div className="text-sm text-gray-500">{formattedDate}</div>
//         </div>

//         <div className="flex items-center space-x-4">
//           {/* User Profile */}
//           <div className="flex items-center cursor-pointer">
//             <div className="text-gray-500 float-right relative px-5">

//               <button
//                 onClick={foodOpenPopup}
//                 className="py-2 px-6 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//               >
//                 Order Food
//               </button>

//               <FoodOrderPopup isOpen={isFoodPopupOpen} onClose={foodClosePopup} />
//             </div>

//             <div className="text-gray-500 float-right relative px-5">
//               <button
//                 onClick={handleOpenPopup}
//                 className="flex items-center space-x-2"
//               >
//                 <Bell size={20} />
//               </button>
//             </div>
//             <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
//               KM
//             </div>
//             <span className="ml-2 font-medium text-gray-700">
//               Kitchen Manager
//             </span>
//             <svg
//               className="w-5 h-5 ml-1 text-gray-400"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M19 9l-7 7-7-7"
//               />
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* Tabs Navigation */}
//       <div className="px-6 flex items-center border-t border-gray-100 overflow-x-auto mt-6">
//         {tabs.map((tab) => (
//           <button
//             key={tab}
//             onClick={() => setActiveTab(tab)}
//             className={`py-4 px-5 font-medium text-sm relative whitespace-nowrap ${activeTab === tab
//                 ? "text-blue-600"
//                 : "text-gray-500 hover:text-gray-700"
//               }`}
//           >
//             {tab}
//             {activeTab === tab && (
//               <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-md"></div>
//             )}
//           </button>
//         ))}
//       </div>
//       <InitialPopup isOpen={showPopup} onClose={handleClosePopup} />

//       {/* Summary bar */}
//       <div className="bg-gray-50 px-6 py-2 flex items-center text-sm text-gray-600 border-t border-gray-200 overflow-x-auto">
//         <div className="flex items-center mr-5">
//           <svg
//             className="w-4 h-4 mr-1 text-amber-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//             />
//           </svg>
//           <span>{expiringToday} items expiring today</span>
//         </div>
//         <div className="flex items-center mr-5">
//           <svg
//             className="w-4 h-4 mr-1 text-green-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
//             />
//           </svg>
//           <span>Last update: Today, {lastUpdateTime}</span>
//         </div>
//         <div className="flex items-center">
//           <svg
//             className="w-4 h-4 mr-1 text-blue-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//             />
//           </svg>
//           <span>{recommendationsCount} food recommendations available</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// function Dashboard({ activeTab }) {
//   const [inventoryItems, setInventoryItems] = useState([]);
//   const [expiringItems, setExpiringItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const API_URL = process.env.REACT_APP_API_URL;
//   // Fetch inventory data from API
//   useEffect(() => {
//     const fetchInventory = async () => {
//       try {
//         setIsLoading(true);
//         const response = await fetch(
//           `${API_URL}/get_inventory_item`
//         );

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }

//         const data = await response.json();
//         setInventoryItems(data);

//         // Process items with remaining life span of 7 days or less
//         const itemsExpiringWithinWeek = data
//           .filter((item) => item.remaining_life <= 7)
//           .sort((a, b) => a.remaining_life - b.remaining_life); // Sort by soonest expiring

//         setExpiringItems(itemsExpiringWithinWeek);
//         setIsLoading(false);
//       } catch (err) {
//         console.error("Error fetching inventory data:", err);
//         setError(err.message);
//         setIsLoading(false);
//       }
//     };

//     fetchInventory();
//   }, []);

//   // Function to determine expiration text based on remaining life
//   const getExpirationText = (remainingLife) => {
//     if (remainingLife <= 0) return "Today";
//     if (remainingLife === 1) return "Tomorrow";
//     return `In ${remainingLife} days`;
//   };

//   // Function to determine urgency level
//   const getUrgencyLevel = (remainingLife) => {
//     if (remainingLife <= 2) return "high";
//     if (remainingLife <= 4) return "medium";
//     return "low";
//   };

//   // Calculate total inventory count
//   const totalInventoryCount = inventoryItems.length || 0;

//   // Calculate items near expiry (items with remaining life <= 7)
//   const nearExpiryCount = expiringItems.length || 0;

//   return (
//     <div className="flex flex-col">
//       {/* Dashboard Content */}
//       <div>
//         {activeTab === "Overview" && (
//           <div className="p-7">
//             {/* Stats Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 ">
//               <StatCard
//                 title="Total Inventory Items"
//                 value={totalInventoryCount.toString()}
//                 change="+2.5% from last week"
//                 positive={true}
//                 icon="inventory"
//               />
//               <StatCard
//                 title="Items Near Expiry"
//                 value={nearExpiryCount.toString()}
//                 change={`${nearExpiryCount}/${totalInventoryCount} items`}
//                 positive={false}
//                 icon="warning"
//               />
//               <StatCard
//                 title="Waste Reduction"
//                 value="24%"
//                 change="+5.2% improvement"
//                 positive={true}
//                 icon="recycle"
//               />
//               <StatCard
//                 title="Efficiency Score"
//                 value="86%"
//                 change="+2.1% from last month"
//                 positive={true}
//                 icon="chart"
//               />
//             </div>

//             {/* Main Content */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div className="md:col-span-2">
//                 <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
//                   <div className="p-4 h-96">
//                     <InventoryChart />
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-y-auto max-h-96">
//                 <div>
//                   <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
//                     <h2 className="text-lg font-semibold">
//                       Upcoming Expirations
//                     </h2>
//                     <p className="text-sm text-gray-500">
//                       Items with 7 days or less remaining life
//                     </p>
//                   </div>
//                   <div className="p-4">
//                     {isLoading ? (
//                       <p className="text-gray-500">
//                         Loading expiration data...
//                       </p>
//                     ) : error ? (
//                       <p className="text-red-500">
//                         Error loading data: {error}
//                       </p>
//                     ) : expiringItems.length === 0 ? (
//                       <p className="text-gray-500">
//                         No items expiring within 7 days.
//                       </p>
//                     ) : (
//                       expiringItems.map((item, index) => {
//                         const urgencyLevel = getUrgencyLevel(
//                           item.remaining_life
//                         );
//                         return (
//                           <ExpirationItem
//                             key={index}
//                             name={item.ingredient}
//                             quantity={`${item.quantity} units`}
//                             expires={getExpirationText(item.remaining_life)}
//                             urgencyLevel={urgencyLevel}
//                             percentageLife={
//                               (item.remaining_life / item.max_life) * 100
//                             }
//                             remainingDays={item.remaining_life}
//                             maxLife={item.max_life}
//                           />
//                         );
//                       })
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {activeTab === "Inventory Tracking" && (
//           <div className="text-center p-7 text-gray-500">
//             <InventoryTracker />
//           </div>
//         )}
//         {activeTab === "Spoilage Prediction" && (
//           <div className="text-center p-7 text-gray-500">
//             <SpoilagePrediction />
//           </div>
//         )}
//         {activeTab === "Waste Analysis" && (
//           <div className="text-center p-7 text-gray-500">
//             <OperationsOptimizer />
//           </div>
//         )}
//         {activeTab === "Food Recommendation" && (
//           <div className="text-center p-7 text-gray-500">
//             <FoodRecommendation />
//           </div>
//         )}
//         {activeTab === "Menu Section" && (
//           <div className="text-center p-7 text-gray-500">
//             <MenuSection />
//           </div>
//         )}
//         {activeTab === "Reports" && (
//           <div className="text-center p-7 text-gray-500">
//             <Reports />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Enhanced Stat Card Component
// const StatCard = ({ title, value, change, positive, icon }) => {
//   // Function to render appropriate icon based on category
//   const renderIcon = () => {
//     switch (icon) {
//       case "inventory":
//         return (
//           <svg
//             className="w-8 h-8 text-blue-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
//             />
//           </svg>
//         );
//       case "warning":
//         return (
//           <svg
//             className="w-8 h-8 text-amber-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//             />
//           </svg>
//         );
//       case "recycle":
//         return (
//           <svg
//             className="w-8 h-8 text-green-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
//             />
//           </svg>
//         );
//       case "chart":
//         return (
//           <svg
//             className="w-8 h-8 text-indigo-500"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
//             />
//           </svg>
//         );
//       default:
//         return null;
//     }
//   };

//   // Get color based on positive/negative status
//   const getColorClass = () => {
//     return positive ? "bg-green-500" : "bg-blue-500";
//   };

//   // Get trend color and icon
//   const getTrendColor = () => {
//     return positive ? "text-green-600" : "text-gray-600";
//   };

//   const renderTrendIcon = () => {
//     if (positive) {
//       return (
//         <svg
//           className="w-5 h-5 mr-1"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M5 10l7-7m0 0l7 7m-7-7v18"
//           />
//         </svg>
//       );
//     } else {
//       return (
//         <svg
//           className="w-5 h-5 mr-1"
//           fill="none"
//           stroke="currentColor"
//           viewBox="0 0 24 24"
//           xmlns="http://www.w3.org/2000/svg"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//           />
//         </svg>
//       );
//     }
//   };

//   return (
//     <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
//       {/* Decorative top bar with appropriate color */}
//       <div
//         className={`absolute top-0 left-0 w-full h-2 ${getColorClass()}`}
//       ></div>

//       {/* Background decoration that appears on hover */}
//       <div
//         className={`absolute -right-16 -bottom-16 w-32 h-32 rounded-full ${getColorClass()} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
//       ></div>

//       {/* Card content with improved layout */}
//       <div className="flex flex-col h-full">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-sm font-medium text-gray-500 flex items-center">
//             {title}
//           </h3>
//           {renderIcon()}
//         </div>

//         {/* Value with larger font and better spacing */}
//         <p className="text-4xl font-bold mb-3">{value}</p>

//         {/* Change indicator with icon */}
//         <div className="mt-auto pt-2">
//           <p className={`text-sm flex items-center ${getTrendColor()}`}>
//             {renderTrendIcon()}
//             {change}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Enhanced Expiration Item Component
// const ExpirationItem = ({
//   name,
//   quantity,
//   expires,
//   urgencyLevel,
//   percentageLife,
//   remainingDays,
//   maxLife,
// }) => {
//   // Define urgency colors
//   const urgencyColors = {
//     high: "bg-red-500",
//     medium: "bg-yellow-500",
//     low: "bg-blue-500",
//   };

//   // Define progress bar colors
//   const progressBarColor =
//     percentageLife < 20
//       ? "bg-red-500"
//       : percentageLife < 50
//         ? "bg-yellow-500"
//         : "bg-green-500";

//   return (
//     <div className="flex items-start p-3 mb-2 border border-gray-100 rounded-md hover:bg-gray-50">
//       <div
//         className={`mt-1.5 w-3 h-3 rounded-full ${urgencyColors[urgencyLevel]} mr-3 flex-shrink-0`}
//       />
//       <div className="flex-1">
//         <div className="flex justify-between items-start">
//           <p className="font-medium">{name}</p>
//           <span
//             className={`text-xs px-2 py-1 rounded-full ${remainingDays <= 2
//                 ? "bg-red-100 text-red-800"
//                 : remainingDays <= 4
//                   ? "bg-yellow-100 text-yellow-800"
//                   : "bg-blue-100 text-blue-800"
//               }`}
//           >
//             {expires}
//           </span>
//         </div>
//         <p className="text-sm text-gray-500 mt-1">{quantity}</p>
//         <div className="mt-2 flex items-center">
//           <div className="flex-1 bg-gray-200 rounded-full h-2">
//             <div
//               className={`h-2 rounded-full ${progressBarColor}`}
//               style={{ width: `${Math.max(percentageLife, 3)}%` }}
//             ></div>
//           </div>
//           <span className="text-xs text-gray-500 ml-2">
//             {remainingDays}/{maxLife} days
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// // Main App Component
// export default function EnhancedDashboard() {
//   const [activeTab, setActiveTab] = useState("Overview");
//   const tabs = [
//     "Overview",
//     "Inventory Tracking",
//     "Spoilage Prediction",
//     "Waste Analysis",
//     "Food Recommendation",
//     "Menu Section",
//     "Reports",
//   ];

//   // Calculate dynamic metrics for header
//   const [expiringToday, setExpiringToday] = useState(5);
//   const [recommendationsCount, setRecommendationsCount] = useState(8);

//   return (
//     <div className="flex flex-col min-h-screen bg-gray-50">
//       <DashboardHeader
//         activeTab={activeTab}
//         setActiveTab={setActiveTab}
//         tabs={tabs}
//         expiringToday={expiringToday}
//         recommendationsCount={recommendationsCount}
//       />

//       {/* Pass the activeTab to your Dashboard component */}
//       <Dashboard activeTab={activeTab} />
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import SpoilagePrediction from "./spoilage-prediction";
import { InventoryTracker } from "./inventory-trackor";
import { OperationsOptimizer } from "./operation-optimizer";
import FoodRecommendation from "./FoodRecommendation";
import MenuSection from "./menu";
import InventoryChart from "./inventoryChart";
import Logo from "../assets/logo.png";
import Reports from "./reports";
import InitialPopup from "./initialPopup";
import { Bell } from "lucide-react";
import FoodOrderPopup from "./order";

// Enhanced Header Component for the Dashboard
const DashboardHeader = ({
  activeTab,
  setActiveTab,
  tabs,
  expiringToday = 5,
  recommendationsCount = 8,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  
  // Separate state for initial popup
  const [showInitialPopup, setShowInitialPopup] = useState(false);
  
  // Separate state for food order popup
  const [isFoodPopupOpen, setIsFoodPopupOpen] = useState(false);

  // Show initial popup automatically when user first visits the page
  useEffect(() => {
    // Set a small delay to prevent immediate closing
    const timer = setTimeout(() => {
      setShowInitialPopup(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to open initial popup when button is clicked
  const handleOpenInitialPopup = () => {
    setShowInitialPopup(true);
  };

  // Function to close initial popup
  const handleCloseInitialPopup = () => {
    setShowInitialPopup(false);
  };

  // Function to open food order popup
  const foodOpenPopup = () => {
    setIsFoodPopupOpen(true);
  };

  // Function to close food order popup
  const foodClosePopup = () => {
    setIsFoodPopupOpen(false);
  };

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Format the current date
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(currentTime);

  // Format last update time
  const lastUpdateTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(currentTime);

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* Top section with search and user info */}
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <img src={Logo} alt="Dashboard Icon" className="w-[100px] h-8 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800 mr-4">Dashboard</h1>
          <div className="text-sm text-gray-500">{formattedDate}</div>
        </div>

        <div className="flex items-center space-x-4">
          {/* User Profile */}
          <div className="flex items-center cursor-pointer">
            <div className="text-gray-500 float-right relative px-5">

              <button
                onClick={foodOpenPopup}
                className="py-2 px-6 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Order Food
              </button>

              {/* Food Order Popup */}
              <FoodOrderPopup isOpen={isFoodPopupOpen} onClose={foodClosePopup} />
            </div>

            <div className="text-gray-500 float-right relative px-5">
              <button
                onClick={handleOpenInitialPopup}
                className="flex items-center space-x-2"
              >
                <Bell size={20} />
              </button>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              KM
            </div>
            <span className="ml-2 font-medium text-gray-700">
              Kitchen Manager
            </span>
            <svg
              className="w-5 h-5 ml-1 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="px-6 flex items-center border-t border-gray-100 overflow-x-auto mt-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-4 px-5 font-medium text-sm relative whitespace-nowrap ${activeTab === tab
                ? "text-blue-600"
                : "text-gray-500 hover:text-gray-700"
              }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-md"></div>
            )}
          </button>
        ))}
      </div>
      
      {/* Initial Popup - Now with separate state */}
      <InitialPopup isOpen={showInitialPopup} onClose={handleCloseInitialPopup} />

      {/* Summary bar */}
      <div className="bg-gray-50 px-6 py-2 flex items-center text-sm text-gray-600 border-t border-gray-200 overflow-x-auto">
        <div className="flex items-center mr-5">
          <svg
            className="w-4 h-4 mr-1 text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{expiringToday} items expiring today</span>
        </div>
        <div className="flex items-center mr-5">
          <svg
            className="w-4 h-4 mr-1 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <span>Last update: Today, {lastUpdateTime}</span>
        </div>
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-1 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{recommendationsCount} food recommendations available</span>
        </div>
      </div>
    </div>
  );
};

// Rest of the code remains the same...
function Dashboard({ activeTab }) {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [expiringItems, setExpiringItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  // Fetch inventory data from API
  useEffect(() => {
    // const fetchInventory = async () => {
    //   try {
    //     setIsLoading(true);
    //     const response = await fetch(
    //       `${API_URL}/get_inventory_item`,
    //       {
    //         method: 'GET',
    //         headers: {
    //           'Accept': 'application/json',
    //           'Content-Type': 'application/json',
    //         },
    //         // Add CORS mode - try with credentials if your API requires authentication
    //         credentials: 'include', // Or use 'same-origin' if not using cookies across domains
    //         mode: 'cors' // Explicitly request CORS mode
    //       }
    //     );

    //     if (!response.ok) {
    //       throw new Error(`HTTP error! Status: ${response.status}`);
    //     }

    //     const data = await response.json();
    //     setInventoryItems(data);

    //     // Process items with remaining life span of 7 days or less
    //     const itemsExpiringWithinWeek = data
    //       .filter((item) => item.remaining_life <= 7)
    //       .sort((a, b) => a.remaining_life - b.remaining_life); // Sort by soonest expiring

    //     setExpiringItems(itemsExpiringWithinWeek);
    //     setIsLoading(false);
    //   } catch (err) {
    //     console.error("Error fetching inventory data:", err);
    //     setError(err.message);
    //     setIsLoading(false);
    //   }
    // };
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${API_URL}/get_inventory_item`,
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            // Remove credentials to fix the CORS error
            credentials: 'omit', // Changed from 'include' to 'omit'
            mode: 'cors' // Explicitly request CORS mode
          }
        );
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        setInventoryItems(data);
    
        // Process items with remaining life span of 7 days or less
        const itemsExpiringWithinWeek = data
          .filter((item) => item.remaining_life <= 7)
          .sort((a, b) => a.remaining_life - b.remaining_life); // Sort by soonest expiring
    
        setExpiringItems(itemsExpiringWithinWeek);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching inventory data:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, []);

  // Function to determine expiration text based on remaining life
  const getExpirationText = (remainingLife) => {
    if (remainingLife <= 0) return "Today";
    if (remainingLife === 1) return "Tomorrow";
    return `In ${remainingLife} days`;
  };

  // Function to determine urgency level
  const getUrgencyLevel = (remainingLife) => {
    if (remainingLife <= 2) return "high";
    if (remainingLife <= 4) return "medium";
    return "low";
  };

  // Calculate total inventory count
  const totalInventoryCount = inventoryItems.length || 0;

  // Calculate items near expiry (items with remaining life <= 7)
  const nearExpiryCount = expiringItems.length || 0;

  return (
    <div className="flex flex-col">
      {/* Dashboard Content */}
      <div>
        {activeTab === "Overview" && (
          <div className="p-7">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 ">
              <StatCard
                title="Total Inventory Items"
                value={totalInventoryCount.toString()}
                change="+2.5% from last week"
                positive={true}
                icon="inventory"
              />
              <StatCard
                title="Items Near Expiry"
                value={nearExpiryCount.toString()}
                change={`${nearExpiryCount}/${totalInventoryCount} items`}
                positive={false}
                icon="warning"
              />
              <StatCard
                title="Waste Reduction"
                value="24%"
                change="+5.2% improvement"
                positive={true}
                icon="recycle"
              />
              <StatCard
                title="Efficiency Score"
                value="86%"
                change="+2.1% from last month"
                positive={true}
                icon="chart"
              />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="p-4 h-96">
                    <InventoryChart />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-y-auto max-h-96">
                <div>
                  <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-lg font-semibold">
                      Upcoming Expirations
                    </h2>
                    <p className="text-sm text-gray-500">
                      Items with 7 days or less remaining life
                    </p>
                  </div>
                  <div className="p-4">
                    {isLoading ? (
                      <p className="text-gray-500">
                        Loading expiration data...
                      </p>
                    ) : error ? (
                      <p className="text-red-500">
                        Error loading data: {error}
                      </p>
                    ) : expiringItems.length === 0 ? (
                      <p className="text-gray-500">
                        No items expiring within 7 days.
                      </p>
                    ) : (
                      expiringItems.map((item, index) => {
                        const urgencyLevel = getUrgencyLevel(
                          item.remaining_life
                        );
                        return (
                          <ExpirationItem
                            key={index}
                            name={item.ingredient}
                            quantity={`${item.quantity} units`}
                            expires={getExpirationText(item.remaining_life)}
                            urgencyLevel={urgencyLevel}
                            percentageLife={
                              (item.remaining_life / item.max_life) * 100
                            }
                            remainingDays={item.remaining_life}
                            maxLife={item.max_life}
                          />
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Inventory Tracking" && (
          <div className="text-center p-7 text-gray-500">
            <InventoryTracker />
          </div>
        )}
        {activeTab === "Spoilage Prediction" && (
          <div className="text-center p-7 text-gray-500">
            <SpoilagePrediction />
          </div>
        )}
        {activeTab === "Waste Analysis" && (
          <div className="text-center p-7 text-gray-500">
            <OperationsOptimizer />
          </div>
        )}
        {activeTab === "Food Recommendation" && (
          <div className="text-center p-7 text-gray-500">
            <FoodRecommendation />
          </div>
        )}
        {activeTab === "Menu Section" && (
          <div className="text-center p-7 text-gray-500">
            <MenuSection />
          </div>
        )}
        {activeTab === "Reports" && (
          <div className="text-center p-7 text-gray-500">
            <Reports />
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Stat Card Component
const StatCard = ({ title, value, change, positive, icon }) => {
  // Function to render appropriate icon based on category
  const renderIcon = () => {
    switch (icon) {
      case "inventory":
        return (
          <svg
            className="w-8 h-8 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className="w-8 h-8 text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        );
      case "recycle":
        return (
          <svg
            className="w-8 h-8 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        );
      case "chart":
        return (
          <svg
            className="w-8 h-8 text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  // Get color based on positive/negative status
  const getColorClass = () => {
    return positive ? "bg-green-500" : "bg-blue-500";
  };

  // Get trend color and icon
  const getTrendColor = () => {
    return positive ? "text-green-600" : "text-gray-600";
  };

  const renderTrendIcon = () => {
    if (positive) {
      return (
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      );
    } else {
      return (
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      {/* Decorative top bar with appropriate color */}
      <div
        className={`absolute top-0 left-0 w-full h-2 ${getColorClass()}`}
      ></div>

      {/* Background decoration that appears on hover */}
      <div
        className={`absolute -right-16 -bottom-16 w-32 h-32 rounded-full ${getColorClass()} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
      ></div>

      {/* Card content with improved layout */}
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-500 flex items-center">
            {title}
          </h3>
          {renderIcon()}
        </div>

        {/* Value with larger font and better spacing */}
        <p className="text-4xl font-bold mb-3">{value}</p>

        {/* Change indicator with icon */}
        <div className="mt-auto pt-2">
          <p className={`text-sm flex items-center ${getTrendColor()}`}>
            {renderTrendIcon()}
            {change}
          </p>
        </div>
      </div>
    </div>
  );
};

// Enhanced Expiration Item Component
const ExpirationItem = ({
  name,
  quantity,
  expires,
  urgencyLevel,
  percentageLife,
  remainingDays,
  maxLife,
}) => {
  // Define urgency colors
  const urgencyColors = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-blue-500",
  };

  // Define progress bar colors
  const progressBarColor =
    percentageLife < 20
      ? "bg-red-500"
      : percentageLife < 50
        ? "bg-yellow-500"
        : "bg-green-500";

  return (
    <div className="flex items-start p-3 mb-2 border border-gray-100 rounded-md hover:bg-gray-50">
      <div
        className={`mt-1.5 w-3 h-3 rounded-full ${urgencyColors[urgencyLevel]} mr-3 flex-shrink-0`}
      />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <p className="font-medium">{name}</p>
          <span
            className={`text-xs px-2 py-1 rounded-full ${remainingDays <= 2
                ? "bg-red-100 text-red-800"
                : remainingDays <= 4
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
              }`}
          >
            {expires}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{quantity}</p>
        <div className="mt-2 flex items-center">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${progressBarColor}`}
              style={{ width: `${Math.max(percentageLife, 3)}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">
            {remainingDays}/{maxLife} days
          </span>
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function EnhancedDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  const tabs = [
    "Overview",
    "Inventory Tracking",
    "Spoilage Prediction",
    "Waste Analysis",
    "Food Recommendation",
    "Menu Section",
    "Reports",
  ];

  // Calculate dynamic metrics for header
  const [expiringToday, setExpiringToday] = useState(5);
  const [recommendationsCount, setRecommendationsCount] = useState(8);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <DashboardHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabs={tabs}
        expiringToday={expiringToday}
        recommendationsCount={recommendationsCount}
      />

      {/* Pass the activeTab to your Dashboard component */}
      <Dashboard activeTab={activeTab} />
    </div>
  );
}