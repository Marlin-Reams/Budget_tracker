import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const StaffMemberGoals = () => {
  const { staffName } = useParams();
  const location = useLocation();
  const stateData = location.state || {}; // ✅ Extract state safely
  const { staff, progress, monthlyGoal } = location.state || {}; // ✅ Fix to extract correctly

  console.log("📌 Location State Data:", stateData); // ✅ Debugging

  if (!staff || !monthlyGoal || !progress) {
    return <Typography>Loading staff goal data...</Typography>;
  }

  // ✅ Get current month & remaining days dynamically
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const remainingDays = Math.max(1, daysInMonth - today.getDate());

  // ✅ Calculate Monthly Goals based on staff allocation
  const staffMonthlyGoals = Object.keys(staff.allocation).reduce((acc, key) => {
    acc[key] = ((monthlyGoal[key] || 0) * (staff.allocation[key] / 100)).toFixed(2);
    return acc;
  }, {});

  // ✅ Calculate Daily Goals (Fixed)
  const staffDailyGoals = Object.keys(staffMonthlyGoals).reduce((acc, key) => {
    acc[key] = (staffMonthlyGoals[key] / daysInMonth).toFixed(2);
    return acc;
  }, {});

  // ✅ Calculate Adjusted Daily Goals based on store's current performance
  const staffAdjustedDailyGoals = Object.keys(staffMonthlyGoals).reduce((acc, key) => {
    const remaining = Math.max(0, staffMonthlyGoals[key] - (progress[key] || 0)); // Prevent negative values
    acc[key] = (remaining / remainingDays).toFixed(2);
    return acc;
  }, {});

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ border: "3px solid #C8102E", backgroundColor: "#F4F4F4", padding: "15px" }}>
          <CardContent>
            <Typography variant="h4" sx={{ color: "#0047BA", mb: 2 }}>
              {staff.name} - Sales Goals
            </Typography>

            {/* ✅ Monthly Goals */}
            <Typography variant="h6" sx={{ mt: 2 }}>📊 Monthly Goals</Typography>
            <table className="goals-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Goal</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(staffMonthlyGoals).map((key) => (
                  <tr key={key}>
                    <td>{key.replace("_", " ").toUpperCase()}</td>
                    <td>${Number(staffMonthlyGoals[key]).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ✅ Daily Goals */}
            <Typography variant="h6" sx={{ mt: 2 }}>📆 Daily Goals</Typography>
            <table className="goals-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Original Daily Goal</th>
                  <th>Adjusted Daily Goal</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(staffDailyGoals).map((key) => (
                  <tr key={key}>
                    <td>{key.replace("_", " ").toUpperCase()}</td>
                    <td>${Number(staffDailyGoals[key]).toLocaleString()}</td>
                    <td style={{ fontWeight: "bold" }}>
                      ${Number(staffAdjustedDailyGoals[key]).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StaffMemberGoals;


