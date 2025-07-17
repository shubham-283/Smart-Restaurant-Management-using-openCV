import { useState, useEffect } from "react";
import TablePagination from "@mui/material/TablePagination";

import {
  Box,
  Card,
  Chip,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Grid,
  Tooltip,
  Slider,
} from "@mui/material";
import { Search, Download, Refresh, CameraAlt } from "@mui/icons-material";
import Scan from "./Scan";
import DownloadIcon from "@mui/icons-material/Download";

// Small Grid Item Component
const SmallGridItem = ({ item, onMouseEnter, onMouseLeave, isHovered }) => {
  // Function to get placeholder image based on category
  const getPlaceholderImage = (category) => {
    if (category === "Fruits") return item.img_link;
    if (category === "Vegetables") return item.img_link;
    if (category === "Meat") return item.img_link;
    if (category === "Dairy") return item.img_link;
    return item.img_link;
  };

  return (
    <Paper
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        cursor: "pointer",
        overflow: "hidden",
      }}
      onMouseEnter={() => onMouseEnter(item.ingredient)}
      onMouseLeave={onMouseLeave}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 120,
          p: 2,
        }}
      >
        <img
          src={getPlaceholderImage(item.img_link)}
          alt={item.ingredient}
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",
          }}
        />
      </Box>
      <Box
        sx={{
          p: 2,
          textAlign: "center",
          mt: "auto",
        }}
      >
        <Typography
          variant="subtitle1"
          align="center"
          sx={{
            fontWeight: "medium",
          }}
        >
          {item.ingredient}
        </Typography>
      </Box>

      {/* Info overlay on hover */}
      {isHovered && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(50, 50, 50, 0.85)",
            color: "white",
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Quality:</strong> {item.quality}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Quantity:</strong> {item.quantity}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Last Updated:</strong> {item.time_since_last_update}
          </Typography>
          <Typography variant="body2">
            <strong>Category:</strong> {item.category}
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// Featured Item Component
const FeaturedItem = ({ item }) => {
  // Function to get placeholder image based on category
  const getPlaceholderImage = (category) => {
    if (category === "Fruits") return "/api/placeholder/400/350";
    if (category === "Vegetables") return "/api/placeholder/400/350";
    if (category === "Meat") return "/api/placeholder/400/350";
    if (category === "Dairy") return "/api/placeholder/400/350";
    return "/api/placeholder/400/350";
  };

  return (
    // <Paper
    //   elevation={2}
    //   sx={{
    //     height: "100%",
    //     display: "flex",
    //     flexDirection: "column",
    //     position: "relative",
    //   }}
    // >
    //   <Box
    //     sx={{
    //       display: "flex",
    //       justifyContent: "center",
    //       alignItems: "center",
    //       p: 2,
    //       height: 350,
    //       overflow: "hidden",
    //     }}
    //   >
    //     <img
    //       src={getPlaceholderImage(item.category)}
    //       alt={item.ingredient}
    //       style={{
    //         maxWidth: "100%",
    //         maxHeight: "100%",
    //         objectFit: "contain",
    //       }}
    //     />
    //   </Box>
    //   <Box
    //     sx={{
    //       p: 2,
    //       textAlign: "center",
    //       borderTop: "1px solid #eee",
    //     }}
    //   >
    //     <Typography variant="h5" gutterBottom>
    //       {item.ingredient}
    //     </Typography>
    //     <Box
    //       sx={{
    //         display: "flex",
    //         justifyContent: "space-between",
    //         alignItems: "center",
    //       }}
    //     >
    //       <Typography variant="body1">{item.quantity} units</Typography>
    //       <Badge
    //         color={
    //           item.quality === "Poor"
    //             ? "error"
    //             : item.quality === "Fair"
    //             ? "warning"
    //             : "success"
    //         }
    //         badgeContent={item.quality}
    //       />
    //     </Box>
    //   </Box>
    // </Paper>
    <></>
  );
};

export function InventoryTracker() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [open, setOpen] = useState(false);
  const [tabValue, setTabValue] = useState(1); // Default to grid view
  const [hoveredItem, setHoveredItem] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [inventory, setInventory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [months, setMonths] = useState(12);
  const API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    // Fetch data from the API
    async function fetchInventory() {
      try {
        const response = await fetch(
          `${API_URL}/get_inventory_item`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setInventory(data); // Set the fetched data to state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    }

    fetchInventory();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleItemHover = (id) => {
    setHoveredItem(id);
  };

  const handleItemLeave = () => {
    setHoveredItem(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMonthChange = (event, value) => {
    setMonths(value);
  };

  const initiateDownload = () => {
    setDialogOpen(true);
  };

  const handleCancel = () => {
    setDialogOpen(false);
  };
  
  const handleDownload = async () => {
    setLoading(true);
    try {
      // Call the specific API endpoint with the selected months parameter
      const response = await fetch(
        `${API_URL}/Get_Sales_Last_N_Months`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Month: months }),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch sales data");

      // Parse the JSON response
      const jsonData = await response.json();

      // Convert JSON to CSV
      const csvData = convertJsonToCsv(jsonData);

      // Create a Blob with the correct MIME type for CSV
      const csvBlob = new Blob([csvData], { type: "text/csv;charset=utf-8" });

      // Create download URL
      const url = window.URL.createObjectURL(csvBlob);

      // Create an anchor tag and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `sales_last_${months}_months.csv`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Close the dialog once download is complete
      setDialogOpen(false);
    } catch (error) {
      console.error("Error downloading sales data:", error);
      alert("Failed to download sales data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert JSON to CSV
  const convertJsonToCsv = (jsonData) => {
    if (!Array.isArray(jsonData)) {
      throw new Error("Expected an array of objects for JSON data");
    }

    // Extract headers from keys of the first object
    const headers = Object.keys(jsonData[0]).join(",");

    // Map each object to a comma-separated string
    const rows = jsonData.map((obj) =>
      Object.values(obj)
        .map((value) => `"${value}"`)
        .join(",")
    );

    // Combine headers and rows into a single CSV string
    return [headers, ...rows].join("\n");
  };

  // Add filter for inventory items
  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.ingredient
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "All" || item.quality === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const paginatedInventory = filteredInventory.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Separate the first item for featured display
  const featuredItem =
    filteredInventory.length > 0 ? filteredInventory[0] : null;
  const gridItems =
    filteredInventory.length > 1 ? filteredInventory.slice(0) : [];

  return (
    <Box
      sx={{
        p: 1,
        border: "1px solid #D3D3D3",
        borderRadius: "8px",
      }}
    >
      <CardHeader
        title="Inventory Tracking"
        subheader="Real-time inventory management powered by computer vision"
        sx={{ textAlign: "left", alignItems: "flex-start", color: "black" }}
      />

      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            gap: 2,
            mb: 3,
          }}
        >
          {/* Top Center - Search and Filters */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <TextField
              label="Search inventory"
              variant="outlined"
              size="small"
              sx={{ width: "250px", flexGrow: 1 }}
              InputProps={{ startAdornment: <Search /> }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel className="bg-white" sx={{ padding: "0px 7px" }}>
                Category
              </InputLabel>
              <Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <MenuItem value="All">All Categories</MenuItem>
                <MenuItem value="Fruits">Fruits</MenuItem>
                <MenuItem value="Vegetables">Vegetables</MenuItem>
                <MenuItem value="Meat">Meat</MenuItem>
                <MenuItem value="Dairy">Dairy</MenuItem>
                <MenuItem value="Spices & Condiments">
                  Spices & Condiments
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel className="bg-white" sx={{ padding: "0px 7px" }}>
                Quality
              </InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="All">All Quality</MenuItem>
                <MenuItem value="Fresh">Fresh</MenuItem>
                <MenuItem value="Bad">Bad</MenuItem>
                <MenuItem value="Rotten">Rotten</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            {/* Left Side - Typography (Item Count) */}
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              {loading
                ? "Loading inventory..."
                : `Showing ${filteredInventory.length} of ${inventory.length} items`}
            </Typography>

            {/* Right Side - Buttons */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <>
                <Button
                  variant="outlined"
                  startIcon={<DownloadIcon />}
                  onClick={initiateDownload}
                >
                  Download Sales Data
                </Button>

                <Dialog
                  open={dialogOpen}
                  onClose={handleCancel}
                  maxWidth="sm"
                  fullWidth
                >
                  <DialogTitle>Download Sales Data</DialogTitle>
                  <DialogContent>
                    <Box sx={{ my: 3 }}>
                      <Typography gutterBottom>
                        Select number of months: <strong>{months}</strong>
                      </Typography>
                      <Slider
                        value={months}
                        min={1}
                        max={12}
                        step={1}
                        marks
                        onChange={handleMonthChange}
                        disabled={loading}
                        valueLabelDisplay="auto"
                      />
                    </Box>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleCancel} disabled={loading}>
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleDownload}
                      disabled={loading}
                      startIcon={<DownloadIcon />}
                    >
                      {loading ? "Downloading..." : `Download ${months} Months`}
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => window.location.reload()}
                >
                  Refresh
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CameraAlt />}
                  onClick={() => setOpen(true)}
                >
                  Scan New Item
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* View Tabs */}
        <Box sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="GRID VIEW" value={1} />
            <Tab label="TABLE VIEW" value={0} />
          </Tabs>
        </Box>

        {/* Display error message if there's an error */}
        {error && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="error">
              Error loading inventory: {error}
            </Typography>
          </Box>
        )}

        {/* Display loading message while fetching data */}
        {loading && (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography>Loading inventory data...</Typography>
          </Box>
        )}

        {/* Table View */}
        {!loading && !error && tabValue === 0 && (
          <TableContainer
            component={Paper}
            sx={{ border: "1px solid #D3D3D3", borderRadius: "8px" }}
          >
            <Table>
              <TableHead>
                <TableRow className="bg-gray-200">
                  <TableCell>Image</TableCell>
                  <TableCell>Ingredient</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Remaining Life</TableCell>
                  <TableCell>Last Updated</TableCell>
                  <TableCell>Quality</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedInventory.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor:
                        index % 2 === 0 ? "rgba(240, 248, 255, 0.7)" : "white",
                      transition: "background-color 0.3s",
                      "&:hover": {
                        backgroundColor:
                          index % 2 === 0
                            ? "rgba(230, 244, 255, 0.9)"
                            : "rgba(249, 249, 249, 0.9)",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <TableCell>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "4px",
                          border: "1px solid #eaeaea",
                          padding: "4px",
                          backgroundColor: "#ffffff",
                        }}
                      >
                        <img
                          src={item.img_link}
                          alt={item.ingredient}
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: index % 2 === 0 ? "500" : "normal" }}
                    >
                      {item.ingredient}
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell
                      sx={{
                        fontWeight: item.quantity < 10 ? "bold" : "normal",
                        color:
                          item.quantity < 10
                            ? "rgba(220, 38, 38, 0.9)"
                            : "inherit",
                      }}
                    >
                      {item.quantity} units
                    </TableCell>
                    <TableCell>{item.remaining_life} days</TableCell>
                    <TableCell>{item.time_since_last_update}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.quality}
                        variant="outlined"
                        sx={{
                          color:
                            item.quality === "Fresh"
                              ? "green"
                              : item.quality === "Bad"
                              ? "orange"
                              : item.quality === "Rotten"
                              ? "red"
                              : "gray",
                          borderColor:
                            item.quality === "Fresh"
                              ? "green"
                              : item.quality === "Bad"
                              ? "orange"
                              : item.quality === "Rotten"
                              ? "red"
                              : "gray",
                          backgroundColor:
                            item.quality === "Fresh"
                              ? "rgba(0, 128, 0, 0.1)"
                              : item.quality === "Bad"
                              ? "rgba(255, 165, 0, 0.1)"
                              : item.quality === "Rotten"
                              ? "rgba(255, 0, 0, 0.1)"
                              : "rgba(128, 128, 128, 0.1)",
                          fontWeight: "normal",
                          borderRadius: "16px",
                          fontSize: "14px",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredInventory.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: "1px solid #eaeaea",
                backgroundColor: "#fafafa",
              }}
            />
          </TableContainer>
        )}

        {/* Grid View with Featured Item */}
        {!loading && !error && tabValue === 1 && featuredItem && (
          <Grid container spacing={3}>
            {/* Featured Item - left side */}
            <Grid item xs={12} md={7} lg={8}>
              <FeaturedItem item={featuredItem} />
            </Grid>

            {/* Right side grid items */}
            <Grid item xs={12} md={5} lg={4}>
              <Grid container spacing={3}>
                {gridItems.map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <SmallGridItem
                      item={item}
                      onMouseEnter={handleItemHover}
                      onMouseLeave={handleItemLeave}
                      isHovered={hoveredItem === item.ingredient}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}

        {/* Popup Dialog */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Scan Item</DialogTitle>
          <DialogContent>
            <Scan />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Box>
  );
}
