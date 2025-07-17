import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Divider,
  Container,
  Paper,
  Button,
  Chip,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EggAltIcon from "@mui/icons-material/EggAlt";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";

const MenuSection = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL

  // Fetch menu data from API
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/Get_Menu`);

        if (!response.ok) {
          throw new Error("Failed to fetch menu data");
        }

        const data = await response.json();
        setMenuItems(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching menu data:", err);
        setError("Failed to load menu items. Please try again later.");
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  // Get unique categories for filter chips
  const categories =
    menuItems.length > 0
      ? [
          "All",
          ...new Set(menuItems.map((item) => item.category || "Uncategorized")),
        ]
      : ["All"];

  // Filter menu items based on search and category
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      item.dish_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.ingredients &&
        item.ingredients.some((ing) =>
          ing.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    const itemCategory = item.category || "Uncategorized";
    const matchesCategory =
      selectedCategory === "All" || itemCategory === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group items by category for better organization
  const groupedItems = filteredItems.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  // Handle image error
  const handleImageError = (event) => {
    event.target.src = ""; // Clear the src to prevent continuous loading attempts
    event.target.style.display = "none"; // Hide the img element
    event.target.nextSibling.style.display = "flex"; // Show the fallback div
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading menu items...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ px: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#2196f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <RestaurantIcon fontSize="large" /> Our Menu
          </Typography>

          <Divider sx={{ width: "100%", mb: 2 }} />

          <Typography variant="subtitle1" sx={{ color: "text.secondary" }}>
            Explore our selection of delicious dishes made with the finest
            ingredients
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Paper
          elevation={1}
          sx={{
            mb: 4,
            p: 2,
            borderRadius: 2,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by dish name or ingredient"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
            Filter by category:
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
            }}
          >
            {categories.map((category) => (
              <Button
                key={category}
                variant={
                  selectedCategory === category ? "contained" : "outlined"
                }
                color="primary"
                onClick={() => setSelectedCategory(category)}
                sx={{
                  borderRadius: 1,
                  minWidth: "auto",
                }}
              >
                {category}
              </Button>
            ))}
          </Box>
        </Paper>

        {/* Menu Items Display */}
        {Object.keys(groupedItems).length === 0 ? (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No menu items found matching your criteria.
            </Typography>
          </Box>
        ) : (
          Object.entries(groupedItems).map(([category, items]) => (
            <Box key={category} sx={{ mb: 4 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  borderBottom: "2px solid #2196f3",
                  pb: 1,
                }}
              >
                <LocalOfferIcon color="primary" sx={{ mr: 1 }} />
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: "bold" }}
                >
                  {category}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                  justifyContent: "flex-start",
                }}
              >
                {items.map((item, idx) => (
                  <Card
                    key={idx}
                    elevation={2}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "calc(50% - 16px)",
                        md: "calc(33.333% - 16px)",
                      },
                      borderRadius: 2,
                      overflow: "hidden",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-5px)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                      },
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Image Section */}
                    {item.img_link ? (
                      <>
                        <CardMedia
                          component="img"
                          height="180"
                          image={item.img_link}
                          alt={item.dish_name}
                          onError={handleImageError}
                          sx={{ objectFit: "cover" }}
                        />
                        {/* Fallback for image error */}
                        <Box
                          sx={{
                            height: "180px",
                            bgcolor: "#f5f5f5",
                            display: "none", // Hidden by default, shown when image fails
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "column",
                          }}
                        >
                          <BrokenImageIcon
                            fontSize="large"
                            sx={{ color: "#9e9e9e", mb: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Image not available
                          </Typography>
                        </Box>
                      </>
                    ) : (
                      <Box
                        sx={{
                          height: "180px",
                          bgcolor: "#f5f5f5",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                        }}
                      >
                        <BrokenImageIcon
                          fontSize="large"
                          sx={{ color: "#9e9e9e", mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                          No image available
                        </Typography>
                      </Box>
                    )}

                    <CardContent sx={{ flexGrow: 1 }}>
                      {/* Dish Name */}
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{ fontWeight: "bold", mb: 1 }}
                      >
                        {item.dish_name}
                      </Typography>

                      {/* Price with Yellow Background */}
                      <Typography
                        variant="subtitle1"
                        sx={{
                          mb: 2,
                          color: "#000",
                          fontWeight: "bold",
                          bgcolor: "#FFEB3B",
                          display: "inline-block",
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                        }}
                      >
                        Rs {parseFloat(item.price)}
                      </Typography>

                      {/* Category and Vegetarian Tags */}
                      <Box
                        sx={{
                          display: "flex",
                          mb: 2,
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        {item.category && (
                          <Chip
                            size="small"
                            label={item.category}
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                        {item.vegetarian !== undefined && (
                          <Chip
                            icon={<EggAltIcon />}
                            size="small"
                            label={
                              item.vegetarian ? "Vegetarian" : "Non-Vegetarian"
                            }
                            color={item.vegetarian ? "success" : "warning"}
                            variant="outlined"
                          />
                        )}
                      </Box>

                      {/* Ingredients */}
                      <Typography
                        variant="subtitle2"
                        sx={{ fontWeight: "bold" }}
                      >
                        Ingredients:
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 0.5,
                          mt: 0.5,
                        }}
                      >
                        {item.ingredients && item.ingredients.length > 0 ? (
                          item.ingredients.map((ingredient, idx) => (
                            <Chip
                              key={idx}
                              label={ingredient}
                              size="small"
                              variant="outlined"
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No ingredients listed
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Box>
          ))
        )}
      </Paper>
    </Container>
  );
};

export default MenuSection;
