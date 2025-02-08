import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const AdjustedDailyTargets = ({ progress, monthlyGoal }) => {
  if (!progress || !monthlyGoal) {
    return <Typography>Loading data...</Typography>;
  }

  

  // Get current month & dynamically determine the number of days
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // JS months are 0-based, so add 1
  const daysInMonth = new Date(year, month, 0).getDate();
  const remainingDays = Math.max(1, daysInMonth - today.getDate()); // Avoid divide by zero

  const categoryOrder = [
    "total_sales",
    "service_sales",
    "cfna_sales",
    "total_units",
    "branded_units",
    "boss_count",
    "rubber_gp"
  ];
  

  // Calculate **original** daily targets based on the total goal
  const originalDailyTargets = Object.keys(monthlyGoal).reduce((acc, key) => {
    acc[key] = (monthlyGoal[key] || 0) / daysInMonth;
    return acc;
  }, {});

  // Calculate **adjusted** daily targets based on the remaining goal
  const adjustedDailyTargets = Object.keys(progress).reduce((acc, key) => {
    const remaining = (monthlyGoal[key] || 0) - (progress[key] || 0);
    acc[key] = remaining / remainingDays; // Adjust based on remaining days
    return acc;
  }, {});

  // Determines color based on whether the adjusted goal is higher or lower
  const getColor = (adjusted, original) => {
    if (adjusted > original) return "red"; // 🔴 Need to work harder
    if (adjusted < original) return "green"; // 🟢 Ahead of pace
    return "black"; // ⚫ On track
  };

  return (
    <Card sx={{ border: "3px solid #C8102E", backgroundColor: "#F4F4F4", marginBottom: "20px" }}>
      <CardContent>
        <Typography variant="h5" sx={{ color: "#0047BA", mb: 2 }}>
          📊 Adjusted Daily Targets (Remaining Days: {remainingDays})
        </Typography>
        <table className="adjusted-targets-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Original Daily Goal</th>
              <th>Adjusted Daily Goal</th>
            </tr>
          </thead>
          <tbody>
          {categoryOrder.map((key) => {
              const original = originalDailyTargets[key] || 0;
              const adjusted = adjustedDailyTargets[key] || 0;
              return (
                <tr key={key}>
                  <td>{key.replace("_", " ").toUpperCase()}</td>
                  <td>{original.toFixed(2)}</td>
                  <td style={{ color: getColor(adjusted, original), fontWeight: "bold" }}>
                    {adjusted.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* 🔹 Legend Section */}
        <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#FFFFFF", borderRadius: "5px", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", textDecoration: "underline" }}>
            Legend:
          </Typography>
          <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
            <li style={{ color: "red", fontWeight: "bold" }}>🔴 Higher than Original → Need to push harder</li>
            <li style={{ color: "green", fontWeight: "bold" }}>🟢 Lower than Original → Ahead of pace</li>
            <li style={{ color: "black", fontWeight: "bold" }}>⚫ Same as Original → On track</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdjustedDailyTargets;




