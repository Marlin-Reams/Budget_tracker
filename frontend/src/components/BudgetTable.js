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

  const today = new Date().getDate(); // Get current day of the month
  const month = new Date().getMonth() + 1; // Get current month (1-based)
  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, month, 0).getDate(); // Dynamically get days in month

  const expectedDaysCompleted = Math.max(1, today - 1); // ✅ Ensure at least 1 day is counted
  const expectedProgressPercent = (expectedDaysCompleted / daysInMonth) * 100; // ✅ EXCLUDES TODAY

  // console.log("📌 Expected Days Completed (Excluding Today):", expectedDaysCompleted);
  // console.log("📌 Expected Progress %:", expectedProgressPercent.toFixed(2));

  // Determines "At Risk" status
  const getRiskStatus = (progress, goal) => {
    if (!goal || goal === 0) return { status: "N/A", color: "black" }; // Prevent divide-by-zero

    const progressPercentage = (progress / goal) * 100;

    if (progressPercentage >= expectedProgressPercent) return { status: "✅ On Track", color: "green" };
    if (progressPercentage >= expectedProgressPercent * 0.8) return { status: "⚠️ Warning", color: "orange" };
    return { status: "❌ At Risk", color: "red" };
  };

  return (
    <Card sx={{ border: "3px solid #C8102E", backgroundColor: "#F4F4F4", padding: "15px", marginBottom: "20px" }}>
      <CardContent>
        <Typography variant="h5" sx={{ color: "#0047BA", mb: 2 }}>📊 Monthly Budget Goals</Typography>
        

        {/* 🏆 Legend Section */}
        <div style={{ marginBottom: "10px", fontSize: "14px" }}>
          <strong>Legend:</strong>
          <span style={{ color: "green", marginLeft: "10px" }}>✅ On Track</span>
          <span style={{ color: "orange", marginLeft: "10px" }}>⚠️ Warning</span>
          <span style={{ color: "red", marginLeft: "10px" }}>❌ At Risk</span>
        </div>

        {monthlyGoal ? (
          <table className="budget-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Budget</th>
                <th>Progress</th>
                <th>Remaining</th>
                <th>Progress %</th>
                <th>At Risk</th> {/* New Column */}
              </tr>
            </thead>
            <tbody>
              {budgetCategories.map((key) => {
                const goalValue = monthlyGoal[key] || 0;
                const progressValue = progress?.[key] || 0;
                const remainingValue = Math.max(0, goalValue - progressValue);
                const isCurrency = ["total_sales", "service_sales", "cfna_sales", "rubber_gp"].includes(key);

                // Calculate percentage progress
                const percentage = goalValue > 0 ? ((progressValue / goalValue) * 100).toFixed(1) : 0;
                const riskStatus = getRiskStatus(progressValue, goalValue);

                return (
                  <tr key={key}>
                    <td>{key.replace("_", " ").toUpperCase()}</td>
                    <td>{isCurrency ? `$${goalValue.toLocaleString()}` : goalValue.toLocaleString()}</td>
                    <td style={{ color: "#0047BA" }}>{isCurrency ? `$${progressValue.toLocaleString()}` : progressValue.toLocaleString()}</td>
                    <td style={{ color: "#C8102E" }}>{isCurrency ? `$${remainingValue.toLocaleString()}` : remainingValue.toLocaleString()}</td>
                    <td>{percentage}%</td>
                    <td style={{ color: riskStatus.color, fontWeight: "bold" }}>{riskStatus.status}</td> {/* Colored Risk Status */}
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







