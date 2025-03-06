import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const StaffPerformance = () => {
  const { staffName } = useParams();
  const location = useLocation();
  const { staff, progress, monthlyGoal } = location.state || {};

  console.log("📌 StaffPerformance - State Data:", location.state);

  // If data is still undefined, prevent crash and show message
  if (!staff || !monthlyGoal || !progress) {
    return <Typography sx={{ color: "red" }}>⚠️ Missing data: Please go back and try again.</Typography>;
  }

  // Get current month & remaining days
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const remainingDays = Math.max(1, daysInMonth - today.getDate());

  // Remove days off from the calculation
  const workingDays = daysInMonth - (staff.daysOff?.length || 0);
  const remainingWorkingDays = remainingDays - (staff.daysOff?.filter(day => day >= today.getDate()).length || 0);

  // Calculate Monthly Goals based on allocation
  const staffMonthlyGoals = Object.keys(staff.allocation).reduce((acc, key) => {
    acc[key] = ((monthlyGoal[key] || 0) * (staff.allocation[key] / 100)).toFixed(2);
    return acc;
  }, {});

  // Calculate Daily Goals
  const staffDailyGoals = Object.keys(staffMonthlyGoals).reduce((acc, key) => {
    acc[key] = (staffMonthlyGoals[key] / workingDays).toFixed(2);
    return acc;
  }, {});

  // Adjusted Daily Goals (based on store's actual progress)
  const staffAdjustedDailyGoals = Object.keys(staffMonthlyGoals).reduce((acc, key) => {
    const remaining = (staffMonthlyGoals[key] - (progress[key] || 0)).toFixed(2);
    acc[key] = (remaining / remainingWorkingDays).toFixed(2);
    return acc;
  }, {});

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ border: "3px solid #C8102E", backgroundColor: "#F4F4F4", padding: "15px" }}>
          <CardContent>
            <Typography variant="h4" sx={{ color: "#0047BA", mb: 2 }}>
              {staff.name} - Sales Performance
            </Typography>

            {/* Monthly Goals */}
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
                    <td>${staffMonthlyGoals[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Daily Goals */}
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
                    <td>${staffDailyGoals[key]}</td>
                    <td style={{ fontWeight: "bold" }}>${staffAdjustedDailyGoals[key]}</td>
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

export default StaffPerformance;

