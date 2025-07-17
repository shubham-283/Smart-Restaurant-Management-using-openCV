import React, { useState, useEffect } from 'react';
import { Search, Filter, Trash2, Bell, ChevronDown, ChevronUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

// Sample data for vegetables
const initialVegetables = [
  { id: 1, name: 'Tomatoes', quantity: 24, quality: 'Good', date: '2025-03-28', category: 'Fruit Vegetables' },
  { id: 2, name: 'Onions', quantity: 40, quality: 'Excellent', date: '2025-03-25', category: 'Root Vegetables' },
  { id: 3, name: 'Lettuce', quantity: 12, quality: 'Fair', date: '2025-03-29', category: 'Leafy Greens' },
  { id: 4, name: 'Carrots', quantity: 8, quality: 'Good', date: '2025-03-26', category: 'Root Vegetables' },
  { id: 5, name: 'Spinach', quantity: 6, quality: 'Poor', date: '2025-03-30', category: 'Leafy Greens' },
  { id: 6, name: 'Bell Peppers', quantity: 18, quality: 'Excellent', date: '2025-03-27', category: 'Fruit Vegetables' },
  { id: 7, name: 'Cucumbers', quantity: 15, quality: 'Good', date: '2025-03-29', category: 'Fruit Vegetables' },
  { id: 8, name: 'Potatoes', quantity: 50, quality: 'Good', date: '2025-03-24', category: 'Root Vegetables' },
  { id: 9, name: 'Broccoli', quantity: 10, quality: 'Fair', date: '2025-03-28', category: 'Brassica' },
  { id: 10, name: 'Mushrooms', quantity: 18, quality: 'Good', date: '2025-03-27', category: 'Fungi' },
  { id: 11, name: 'Eggplant', quantity: 14, quality: 'Good', date: '2025-03-26', category: 'Fruit Vegetables' },
  { id: 12, name: 'Zucchini', quantity: 22, quality: 'Excellent', date: '2025-03-28', category: 'Fruit Vegetables' },
  { id: 13, name: 'Cabbage', quantity: 17, quality: 'Good', date: '2025-03-25', category: 'Brassica' },
  { id: 14, name: 'Cauliflower', quantity: 9, quality: 'Fair', date: '2025-03-29', category: 'Brassica' },
  { id: 15, name: 'Garlic', quantity: 30, quality: 'Excellent', date: '2025-03-24', category: 'Bulbs' },
  { id: 16, name: 'Kale', quantity: 7, quality: 'Poor', date: '2025-03-30', category: 'Leafy Greens' },
  { id: 17, name: 'Sweet Potatoes', quantity: 35, quality: 'Good', date: '2025-03-26', category: 'Root Vegetables' },
  { id: 18, name: 'Radishes', quantity: 12, quality: 'Fair', date: '2025-03-28', category: 'Root Vegetables' },
  { id: 19, name: 'Asparagus', quantity: 8, quality: 'Good', date: '2025-03-29', category: 'Stems' },
  { id: 20, name: 'Green Beans', quantity: 18, quality: 'Excellent', date: '2025-03-27', category: 'Pods' },
];

// Quality color mapping
const qualityColors = {
  'Excellent': 'bg-green-100 text-green-800',
  'Good': 'bg-blue-100 text-blue-800',
  'Fair': 'bg-yellow-100 text-yellow-800',
  'Poor': 'bg-red-100 text-red-800',
};

// Quantity threshold settings
const STOCK_LOW = 10;
const STOCK_HIGH = 30;

// Items per page options
const PAGE_SIZE_OPTIONS = [5, 10, 15, 20];

export default function RestaurentInventory () {
  const [vegetables, setVegetables] = useState(initialVegetables);
  const [filteredVegetables, setFilteredVegetables] = useState(initialVegetables);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedQualities, setSelectedQualities] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [stockFilter, setStockFilter] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [paginatedVegetables, setPaginatedVegetables] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };


  // Categories and qualities derived from data
  const categories = [...new Set(initialVegetables.map(v => v.category))];
  const qualities = [...new Set(initialVegetables.map(v => v.quality))];

  // Effect to apply filters
  useEffect(() => {
    let result = [...vegetables];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(veg => 
        veg.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply date range filter
    if (dateRange.start) {
      result = result.filter(veg => veg.date >= dateRange.start);
    }
    if (dateRange.end) {
      result = result.filter(veg => veg.date <= dateRange.end);
    }
    
    // Apply category filter (multi-select)
    if (selectedCategories.length > 0) {
      result = result.filter(veg => selectedCategories.includes(veg.category));
    }
    
    // Apply quality filter (multi-select)
    if (selectedQualities.length > 0) {
      result = result.filter(veg => selectedQualities.includes(veg.quality));
    }
    
    // Apply stock level filter
    if (stockFilter === 'low') {
      result = result.filter(veg => veg.quantity <= STOCK_LOW);
    } else if (stockFilter === 'high') {
      result = result.filter(veg => veg.quantity >= STOCK_HIGH);
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
    
    setFilteredVegetables(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [vegetables, searchTerm, dateRange, selectedCategories, selectedQualities, sortConfig, stockFilter]);
  
  // Effect to handle pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setPaginatedVegetables(filteredVegetables.slice(startIndex, endIndex));
  }, [filteredVegetables, currentPage, pageSize]);
  
  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Get items that need to be ordered (low stock)
  const lowStockItems = vegetables.filter(veg => veg.quantity <= STOCK_LOW);

  // Toggle category selection
  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // Toggle quality selection
  const toggleQuality = (quality) => {
    if (selectedQualities.includes(quality)) {
      setSelectedQualities(selectedQualities.filter(q => q !== quality));
    } else {
      setSelectedQualities([...selectedQualities, quality]);
    }
  };

  // Function to get stock level class
  const getStockLevelClass = (quantity) => {
    if (quantity <= STOCK_LOW) return 'text-red-600';
    if (quantity >= STOCK_HIGH) return 'text-green-600';
    return 'text-yellow-600';
  };

  const getQualityColorClass = (quality) => {
    switch (quality?.toLowerCase()) {
      case 'excellent':
        return 'text-green-600';
      case 'good':
        return 'text-blue-600';
      case 'fair':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  // Calculate total pages
  const totalPages = Math.ceil(filteredVegetables.length / pageSize);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Restaurant Inventory Management</h1>
          
          {/* Notification Bell */}
          <div className="relative">
      {/* Notification Bell with Counter */}
      <button 
        className="relative p-2 text-gray-700 hover:text-gray-900 focus:outline-none"
        onClick={togglePopup}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-6 w-6" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
          />
        </svg>
        
        {/* Notification Counter Badge */}
        {lowStockItems.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {lowStockItems.length}
          </span>
        )}
      </button>

      {/* Popup for Low Stock Items */}
      {showPopup && lowStockItems.length > 0 && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
          <div className="py-2">
            <div className="px-4 py-2 bg-gray-100 font-semibold">
              Low Stock Vegetables
            </div>
            <div className="max-h-60 overflow-y-auto">
              {lowStockItems.map((item, index) => (
                <div 
                  key={index} 
                  className="px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    Quantity: <span className="font-semibold text-red-600">{item.quantity}</span>
                  </div>
                  {item.quality && (
                    <div className="text-sm text-gray-600">
                      Status: <span className={`font-semibold ${getQualityColorClass(item.quality)}`}>
                        {item.quality}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 flex-grow">
        {/* Low stock alert */}
        {lowStockItems.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <Bell size={20} className="text-red-600 mr-2" />
              <h2 className="text-lg font-semibold text-red-700">Low Stock Alert</h2>
            </div>
            <p className="mt-2 text-sm text-red-600">
              {lowStockItems.length} items need to be ordered: 
              <span className="font-medium"> {lowStockItems.map(item => item.name).join(', ')}</span>
            </p>
          </div>
        )}

        {/* Inventory stats */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Items</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{vegetables.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Low Stock Items</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{lowStockItems.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Categories</dt>
                    <dd className="text-3xl font-semibold text-gray-900">{categories.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and filter bar */}
        <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row justify-between space-y-3 md:space-y-0 md:space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search vegetables..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter button */}
            <button 
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm font-medium text-gray-700"
              onClick={() => setFilterOpen(!filterOpen)}
            >
              <Filter size={18} className="mr-2 text-gray-500" />
              Filters
              {filterOpen ? (
                <ChevronUp size={16} className="ml-2 text-gray-500" />
              ) : (
                <ChevronDown size={16} className="ml-2 text-gray-500" />
              )}
            </button>
          </div>
          
          {/* Filter panel */}
          {filterOpen && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date range */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Date Range</label>
                <div className="mt-1 flex space-x-2">
                  <input
                    type="date"
                    className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="date"
                    className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                  />
                </div>
              </div>
              
              {/* Multi-select Category filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categories (select multiple)</label>
                <div className="max-h-44 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {categories.map(category => (
                    <div key={category} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`category-${category}`}
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleCategory(category)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`category-${category}`} className="ml-2 text-sm text-gray-700">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Multi-select Quality filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualities (select multiple)</label>
                <div className="max-h-44 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {qualities.map(quality => (
                    <div key={quality} className="flex items-center mb-1">
                      <input
                        type="checkbox"
                        id={`quality-${quality}`}
                        checked={selectedQualities.includes(quality)}
                        onChange={() => toggleQuality(quality)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`quality-${quality}`} className="ml-2 text-sm text-gray-700">
                        {quality}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Stock level filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Level</label>
                <div className="mt-1 flex space-x-2">
                  <button
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${stockFilter === 'low' 
                      ? 'bg-red-100 text-red-800 border-red-200' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setStockFilter(stockFilter === 'low' ? '' : 'low')}
                  >
                    Low Stock
                  </button>
                  <button
                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md ${stockFilter === 'high' 
                      ? 'bg-green-100 text-green-800 border-green-200' 
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setStockFilter(stockFilter === 'high' ? '' : 'high')}
                  >
                    High Stock
                  </button>
                </div>
              </div>
              
              {/* Clear filters */}
              <div className="md:col-span-3 flex justify-end">
                <button
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    setSearchTerm('');
                    setDateRange({ start: '', end: '' });
                    setSelectedCategories([]);
                    setSelectedQualities([]);
                    setStockFilter('');
                  }}
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Vegetable inventory table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('name')}>
                    <div className="flex items-center">
                      Vegetable Name
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('quantity')}>
                    <div className="flex items-center">
                      Quantity
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('quality')}>
                    <div className="flex items-center">
                      Quality
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('date')}>
                    <div className="flex items-center">
                      Date Added
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('category')}>
                    <div className="flex items-center">
                      Category
                      <ArrowUpDown size={14} className="ml-1" />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedVegetables.length > 0 ? (
                  paginatedVegetables.map((vegetable) => (
                    <tr key={vegetable.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{vegetable.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${getStockLevelClass(vegetable.quantity)}`}>
                          {vegetable.quantity} kg
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${qualityColors[vegetable.quality]}`}>
                          {vegetable.quality}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{vegetable.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{vegetable.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-red-600 hover:text-red-900" onClick={() => {
                          setVegetables(vegetables.filter(v => v.id !== vegetable.id));
                        }}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No vegetables found matching your filters
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination controls */}
          <div className="px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-3 sm:mb-0">
                <span className="text-sm text-gray-700">
                  Showing
                </span>
                <select
                  className="text-sm border-gray-300 rounded-md"
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                >
                  {PAGE_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
                <span className="text-sm text-gray-700">
                  of {filteredVegetables.length} items
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                    currentPage === 1 
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </button>
                
                <div className="hidden md:flex space-x-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Show limited number of pages
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`inline-flex items-center justify-center w-8 h-8 border ${
                            currentPage === page
                              ? 'bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                          } rounded-md text-sm font-medium`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <span key={page} className="text-gray-500 w-8 text-center">...</span>
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
                
                <div className="md:hidden text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium ${
                    currentPage === totalPages || totalPages === 0
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
      </main>
</div>)}