import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { Download, RotateCw } from "lucide-react";

// Mock Data
const wasteData = [
  { name: "Produce", value: 35, color: "#4ade80" },
  { name: "Meat", value: 25, color: "#f87171" },
  { name: "Dairy", value: 20, color: "#60a5fa" },
  { name: "Seafood", value: 15, color: "#c084fc" },
  { name: "Other", value: 5, color: "#fbbf24" },
];

const recommendationsData = [
  {
    id: 1,
    title: "Reduce Produce Order Volume",
    impact: "High",
    savings: "$320/week",
    difficulty: "Low",
    status: "New",
  },
  {
    id: 2,
    title: "Adjust Storage Temperature for Dairy",
    impact: "Medium",
    savings: "$150/week",
    difficulty: "Medium",
    status: "In Progress",
  },
  {
    id: 3,
    title: "Reorganize Freezer Layout",
    impact: "Medium",
    savings: "$180/week",
    difficulty: "Medium",
    status: "Completed",
  },
  {
    id: 4,
    title: "Implement FIFO System for Seafood",
    impact: "High",
    savings: "$275/week",
    difficulty: "Medium",
    status: "New",
  },
  {
    id: 5,
    title: "Staff Training on Inventory Handling",
    impact: "Medium",
    savings: "$200/week",
    difficulty: "Low",
    status: "Planned",
  },
];

export function OperationsOptimizer() {
  const [tabIndex, setTabIndex] = useState(0);

  const getStatusChip = (status) => {
    const colors = {
      New: "primary",
      "In Progress": "warning",
      Completed: "success",
      Planned: "secondary",
    };
    return <Chip label={status} color={colors[status] || "default"} />;
  };

  const getImpactChip = (impact) => {
    const colors = {
      High: "success",
      Medium: "primary",
      Low: "default",
    };
    return <Chip label={impact} color={colors[impact] || "default"} />;
  };

  return (
    <Box>
      <Card sx={{ p: 2 }}>
        <Typography variant="h5" fontWeight="bold">
          Operations Optimizer
        </Typography>
        <Typography variant="body2" color="text.secondary">
          AI-powered recommendations to optimize kitchen operations and reduce
          waste
        </Typography>

        {/* Tabs */}
        <Tabs
          value={tabIndex}
          onChange={(_, newIndex) => setTabIndex(newIndex)}
          sx={{ mt: 2 }}
        >
          <Tab label="Waste Analysis" />
          <Tab label="Recommendations" />
        </Tabs>

        <CardContent>
          {/* Waste Analysis Tab */}
          {tabIndex === 0 && (
            <Box
              display="grid"
              gap={2}
              gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
            >
              <Card sx={{ p: 2 }}>
                <Typography variant="h6">Waste Distribution</Typography>
                <Typography variant="body2" color="text.secondary">
                  Breakdown of waste by food category
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={wasteData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {wasteData.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Card>

              <Card sx={{ p: 2 }}>
                <Typography variant="h6">
                  Waste Reduction Opportunity
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Potential savings through waste reduction
                </Typography>
                <Box textAlign="center" my={2}>
                  <Typography variant="h4" color="green">
                    {" "}
                    $24,800
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estimated Annual Savings
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1">Key Insights</Typography>
                  <Typography variant="body2">
                    • Produce accounts for 35% of total waste by value
                  </Typography>
                  <Typography variant="body2">
                    • Weekend waste is 40% higher than weekday waste
                  </Typography>
                  <Typography variant="body2">
                    • Improper storage causes 28% of premature spoilage
                  </Typography>
                  <Typography variant="body2">
                    • Ordering optimization could reduce waste by 22%
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="flex-end" mt={2}>
                  <Button variant="outlined" startIcon={<Download size={18} />}>
                    Export Report
                  </Button>
                </Box>
              </Card>
            </Box>
          )}

          {/* Recommendations Tab */}
          {tabIndex === 1 && (
            <Card sx={{ p: 2 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">AI Recommendations</Typography>
                <Button variant="outlined" startIcon={<RotateCw size={18} />}>
                  Refresh
                </Button>
              </Box>

              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>Recommendation</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Impact</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Est. Savings</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Difficulty</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Status</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recommendationsData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.title}</TableCell>
                        <TableCell>{getImpactChip(item.impact)}</TableCell>
                        <TableCell>{item.savings}</TableCell>
                        <TableCell>{item.difficulty}</TableCell>
                        <TableCell>{getStatusChip(item.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
