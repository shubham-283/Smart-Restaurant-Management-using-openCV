import React, { useState, useEffect } from 'react';

const FoodOrderPopup = ({ isOpen, onClose }) => {
  const [dishes, setDishes] = useState([]);
  const [selectedDish, setSelectedDish] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState({ message: '', isError: false });

  useEffect(() => {
    if (isOpen) {
      fetchDishes();
    }
  }, [isOpen]);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://0.0.0.0:8000/Get_Menu');
      const data = await response.json();
      setDishes(data);
      if (data.length > 0) {
        setSelectedDish(data[0].dish_name);
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      setOrderStatus({
        message: 'Failed to load menu. Please try again later.',
        isError: true
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setOrderStatus({ message: '', isError: false });

    try {
      const response = await fetch('http://0.0.0.0:8000/add_order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dish_name: selectedDish,
          quantity: Number(quantity)
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setOrderStatus({
          message: 'Order placed successfully!',
          isError: false
        });
        setQuantity(1); // Reset quantity after successful order
      } else {
        setOrderStatus({
          message: data.message || 'Failed to place order. Please try again.',
          isError: true
        });
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setOrderStatus({
        message: 'Network error. Please check your connection and try again.',
        isError: true
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Food Order System</h1>
        
        {loading && !dishes.length ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading menu...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="dish" className="block text-sm font-medium text-gray-700 mb-1">
                Select Dish
              </label>
              <select
                id="dish"
                value={selectedDish}
                onChange={(e) => setSelectedDish(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                {dishes.map((dish) => (
                  <option key={dish.dish_name} value={dish.dish_name}>
                    {dish.dish_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2 px-4 rounded-md text-gray-700 font-medium border border-gray-300 hover:bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-1/2 py-2 px-4 rounded-md text-white font-medium ${
                  loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </form>
        )}
        
        {orderStatus.message && (
          <div className={`mt-4 p-3 rounded-md ${orderStatus.isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {orderStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodOrderPopup;