import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const BudgetTable = ({ progress, monthlyGoal }) => {
  const budgetCategories = [
    "total_sales",
    "service_sales",
    "cfna_sales",
    "total_units",
    "branded_units",
    "boss_count",
    "rubber_gp"
  ];
  // console.log("BudgetTable - Progress Data:", progress);
  // console.log("BudgetTable - Monthly Goal Data:", monthlyGoal);


  const getProgressColor = (percentage) => {
    if (percentage >= 100) return "green"; // ✅ On track
    if (percentage >= 90) return "orange"; // ⚠️ Close
    return "red"; // ❌ Below 90%
  };

  return (
    <Card sx={{ border: "3px solid #C8102E", backgroundColor: "#F4F4F4" }}>
      <CardContent>
        <Typography variant="h5" sx={{ color: "#0047BA", mb: 2 }}>📊 Monthly Budget Goals</Typography>
        {monthlyGoal ? (
          <table className="budget-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Goal</th>
                <th>Progress</th>
                <th>Remaining</th>
                <th>Progress %</th>  {/* New Column */}
              </tr>
            </thead>
            <tbody>
              {budgetCategories.map((key) => {
                const goalValue = monthlyGoal[key] || 0;
                const progressValue = progress?.[key] || 0;
                const remainingValue = Math.max(0, goalValue - progressValue);
                const isCurrency = ["total_sales", "service_sales", "cfna_sales", "rubber_gp"].includes(key);
                // console.log(`Category: ${key}, Goal: ${goalValue}, Progress: ${progressValue}, Percentage: ${percentage}%`);


                // Calculate percentage
                const percentage = goalValue > 0 ? ((progressValue / goalValue) * 100).toFixed(1) : 0;
                const progressColor = getProgressColor(percentage);

                return (
                  <tr key={key}>
                    <td>{key.replace("_", " ").toUpperCase()}</td>
                    <td>{isCurrency ? `$${goalValue.toLocaleString()}` : goalValue.toLocaleString()}</td>
                    <td style={{ color: "#0047BA" }}>{isCurrency ? `$${progressValue.toLocaleString()}` : progressValue.toLocaleString()}</td>
                    <td style={{ color: "#C8102E" }}>{isCurrency ? `$${remainingValue.toLocaleString()}` : remainingValue.toLocaleString()}</td>
                    <td style={{ color: progressColor, fontWeight: "bold" }}>{percentage}%</td>  {/* Colored % Progress */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : <Typography>Loading...</Typography>}
      </CardContent>
    </Card>
  );
};

export default BudgetTable;
