
import React, { useState, useEffect } from 'react';

const FoodRecommendationApp = () => {
  const [menu, setMenu] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // List of all possible ingredients
  const allIngredients = [
    'apple', 'artichoke', 'banana', 'beef', 'broccoli', 'cabbage', 'carrot', 
    'cauliflower', 'chicken', 'corn', 'cucumber', 'egg', 'eggplant', 'garlic', 
    'ginger', 'green beans', 'lettuce', 'limon', 'mushroom', 'okra', 'onion', 
    'parsley', 'pea', 'capsicum', 'potato', 'pumpkin', 'red cabbage', 'spinach', 
    'spring onion', 'tomato'
  ];
  const API_URL = process.env.REACT_APP_API_URL;
  // Fetch menu and inventory data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch menu data
        const menuResponse = await fetch(`${API_URL}/Get_Menu`);
        if (!menuResponse.ok) {
          throw new Error('Failed to fetch menu data');
        }
        const menuData = await menuResponse.json();
        setMenu(Array.isArray(menuData) ? menuData : [menuData]);
        
        // Fetch inventory data
        const inventoryResponse = await fetch(`${API_URL}/get_inventory_item`);
        if (!inventoryResponse.ok) {
          throw new Error('Failed to fetch inventory data');
        }
        const inventoryData = await inventoryResponse.json();
        setInventory(Array.isArray(inventoryData) ? inventoryData : [inventoryData]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle ingredient selection
  const handleIngredientToggle = (ingredient) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient) 
        ? prev.filter(item => item !== ingredient) 
        : [...prev, ingredient]
    );
  };

  // Calculate discount based on remaining life
  const calculateDiscount = (ingredient) => {
    const inventoryItem = inventory.find(item => 
      item.ingredient.toLowerCase() === ingredient.toLowerCase()
    );
    
    if (!inventoryItem) return 0;
    
    // If remaining life is less than half of max life, apply discount
    if (inventoryItem.remaining_life < 5) {
      // Higher discount for items closer to expiration
      const lifePercentage = inventoryItem.remaining_life / inventoryItem.max_life;
      return Math.round((1 - lifePercentage) * 30); // Up to 30% discount
    }
    
    return 0;
  };

  // Get recommendation score for each dish
  const getRecommendationScore = (dish) => {
    if (!dish.ingredients) return 0;
    
    const matchedIngredients = dish.ingredients.filter(ingredient => 
      selectedIngredients.includes(ingredient.toLowerCase())
    );
    
    const urgentIngredients = dish.ingredients.filter(ingredient => {
      const inventoryItem = inventory.find(item => 
        item.ingredient.toLowerCase() === ingredient.toLowerCase()
      );
      return inventoryItem && inventoryItem.remaining_life < 5;
    });
    
    // Score based on matched ingredients and urgent ingredients
    return (matchedIngredients.length * 2) + (urgentIngredients.length * 3);
  };

  // Sort menu items by recommendation score
  const sortedMenu = [...menu].sort((a, b) => 
    getRecommendationScore(b) - getRecommendationScore(a)
  );

  // Get urgent ingredients that need to be used soon
  const urgentIngredients = inventory
    .filter(item => item.remaining_life < 5)
    .map(item => item.ingredient.toLowerCase());

  if (loading) return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold text-center mb-8">Food Recommendation System</h1>
      
      {/* Ingredients Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select Your Ingredients:</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {allIngredients.map(ingredient => {
            const isUrgent = urgentIngredients.includes(ingredient);
            return (
              <div 
                key={ingredient}
                className={`
                  flex items-center p-2 border rounded cursor-pointer
                  ${selectedIngredients.includes(ingredient) ? 'bg-green-100 border-green-500' : 'bg-white'}
                  ${isUrgent ? 'border-red-500' : 'border-gray-300'}
                `}
                onClick={() => handleIngredientToggle(ingredient)}
              >
                <input
                  type="checkbox"
                  checked={selectedIngredients.includes(ingredient)}
                  onChange={() => {}}
                  className="mr-2"
                />
                <span className="capitalize">
                  {ingredient}
                  {isUrgent && 
                    <span className="ml-1 text-xs text-red-500 font-bold">
                      (Use soon!)
                    </span>
                  }
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Urgent Ingredients Alert */}
      {urgentIngredients.length > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-8">
          <p className="font-bold">Ingredients to use soon:</p>
          <p>
            {inventory
              .filter(item => item.remaining_life < 5)
              .map(item => `${item.ingredient} (${item.remaining_life} days left)`)
              .join(', ')}
          </p>
        </div>
      )}
      
      {/* Dish Recommendations */}
      <h2 className="text-xl font-semibold mb-4">Recommended Dishes:</h2>
      
      {selectedIngredients.length === 0 && (
        <p className="text-gray-500 mb-4">Select ingredients to see recommendations</p>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedMenu
          .filter(dish => getRecommendationScore(dish) > 0)
          .map((dish, index) => {
            const matchedIngredients = dish.ingredients.filter(ingredient => 
              selectedIngredients.includes(ingredient.toLowerCase())
            );
            
            const dishUrgentIngredients = dish.ingredients.filter(ingredient => 
              urgentIngredients.includes(ingredient.toLowerCase())
            );
            
            const totalDiscount = dishUrgentIngredients.reduce(
              (total, ingredient) => total + calculateDiscount(ingredient), 
              0
            );
            
            // Average discount rounded to nearest 5%
            const finalDiscount = dishUrgentIngredients.length 
              ? Math.round(totalDiscount / dishUrgentIngredients.length / 5) * 5 
              : 0;
              
            const discountedPrice = dish.price - (dish.price * finalDiscount / 100);
            
            return (
              <div 
                key={`${dish.dish_name}-${index}`} 
                className="border rounded-lg shadow-md overflow-hidden bg-white hover:shadow-lg transition-shadow"
              >
                {dish.img_link && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={dish.img_link} 
                      alt={dish.dish_name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold">{dish.dish_name}</h3>
                    <div className="flex flex-col items-end">
                      {finalDiscount > 0 ? (
                        <>
                          <span className="text-gray-500 line-through">₹{dish.price}</span>
                          <span className="text-lg font-bold text-green-600">
                            ₹{discountedPrice.toFixed(2)}
                          </span>
                          <span className="text-sm bg-red-500 text-white px-2 py-1 rounded">
                            {finalDiscount}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold">₹{dish.price}</span>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{dish.category}</span>
                    {dish.vegetarian ? ' • Vegetarian' : ' • Non-Vegetarian'}
                  </p>
                  
                  <div className="mb-3">
                    <p className="font-medium mb-1">Ingredients:</p>
                    <div className="flex flex-wrap gap-1">
                      {dish.ingredients.map(ingredient => (
                        <span 
                          key={ingredient}
                          className={`
                            text-xs px-2 py-1 rounded-full capitalize
                            ${selectedIngredients.includes(ingredient.toLowerCase()) 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'}
                            ${urgentIngredients.includes(ingredient.toLowerCase()) 
                              ? 'border border-red-500' 
                              : ''}
                          `}
                        >
                          {ingredient}
                          {urgentIngredients.includes(ingredient.toLowerCase()) && 
                            <span className="ml-1 text-red-500">★</span>
                          }
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {dishUrgentIngredients.length > 0 && (
                    <div className="text-sm text-red-600 mb-2">
                      Uses {dishUrgentIngredients.length} ingredient(s) that need to be used soon!
                    </div>
                  )}
                  
                    
                </div>
              </div>
            );
          })}
      </div>
      
      {selectedIngredients.length > 0 && sortedMenu.filter(dish => getRecommendationScore(dish) > 0).length === 0 && (
        <p className="text-gray-500">No matching dishes found with your selected ingredients.</p>
      )}
    </div>
  );
};

export default FoodRecommendationApp;