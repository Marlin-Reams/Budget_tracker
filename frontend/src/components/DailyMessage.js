import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const DailyMessage = ({ progress, monthlyGoal }) => {
  if (!progress || !monthlyGoal) {
    return <Typography>Loading daily report...</Typography>;
  }

  const today = new Date().getDate();
  const month = new Date().getMonth() + 1;
  const year = new Date().getFullYear();
  const daysInMonth = new Date(year, month, 0).getDate();
  const expectedProgressPercent = (today / daysInMonth) * 100;
  

  const budgetCategories = [
    "total_sales",
    "service_sales",
    "cfna_sales",
    "total_units",
    "branded_units",
    "boss_count",
    "rubber_gp"
  ];

  let good = [];
  let bad = [];
  let ugly = [];

  budgetCategories.forEach((key) => {
    const goalValue = monthlyGoal[key] || 0;
    const progressValue = progress[key] || 0;

    if (goalValue === 0) return; // Prevent divide by zero

    const progressPercentage = (progressValue / goalValue) * 100;

    if (progressPercentage >= expectedProgressPercent) {
      good.push(key.replace("_", " ").toUpperCase());
    } else if (progressPercentage >= expectedProgressPercent * 0.8) {
      bad.push(key.replace("_", " ").toUpperCase());
    } else {
      ugly.push(key.replace("_", " ").toUpperCase());
    }
  });

  return (
    <Card sx={{ border: "3px solid #C8102E", backgroundColor: "#F4F4F4", marginBottom: "20px" }}>
      <CardContent>
        <Typography variant="h5" sx={{ color: "#0047BA", mb: 2 }}>📊 Daily Performance Summary</Typography>
        
        <Typography variant="body1">
          {good.length > 0 && (
            <span style={{ color: "green", fontWeight: "bold" }}>
              ✅ The Good: {good.join(", ")} are on track! Keep pushing!
            </span>
          )}
        </Typography>
        <Typography variant="body1">
          {bad.length > 0 && (
            <span style={{ color: "orange", fontWeight: "bold" }}>
              ⚠️ The Bad: {bad.join(", ")} need a little extra effort to stay on pace.
            </span>
          )}
        </Typography>
        <Typography variant="body1">
          {ugly.length > 0 && (
            <span style={{ color: "red", fontWeight: "bold" }}>
              🚨 The Ugly: {ugly.join(", ")} are falling behind! Focus on these today!
            </span>
          )}
        </Typography>
        <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic", color: "#C8102E" }}>
          "Let's seize the day and close the gap!"
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DailyMessage;
