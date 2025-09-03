import React from "react";
import { useLocation, useParams } from "react-router-dom";
import { Card, CardContent, Typography, Grid } from "@mui/material";

const StaffMemberGoals = () => {
  const { staffName } = useParams();
  const location = useLocation();
  const stateData = location.state || {};
  const { staff, progress } = location.state || {};

  console.log("📌 Location State Data:", stateData);
  if (!staff || !staff.expectedMonthly || !progress) {
    console.log("📌 staff:", staff);
    console.log("📌 expectedMonthly:", staff?.expectedMonthly);
    console.log("📌 progress:", progress);
    return <Typography>Loading staff goal data...</Typography>;
  }

  // ✅ Get current month & remaining days dynamically
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const remainingDays = Math.max(1, daysInMonth - today.getDate());

  // ✅ Use expectedMonthly directly
  const staffMonthlyGoals = staff.expectedMonthly;

  // ✅ Calculate Daily Goals
  const workingDays = staff?.workingDays || 22; // default to 22 if not provided

const staffDailyGoals = Object.keys(staffMonthlyGoals).reduce((acc, key) => {
  acc[key] = (staffMonthlyGoals[key] / workingDays).toFixed(2);
  return acc;
}, {});

  // ✅ Adjusted Daily Goals
  const staffAdjustedDailyGoals = Object.keys(staffMonthlyGoals).reduce((acc, key) => {
    const remaining = Math.max(0, staffMonthlyGoals[key] - (progress[key] || 0));
    acc[key] = (remaining / remainingDays).toFixed(2);
    return acc;
  }, {});

  // ✅ Only show these keys
  const allowedKeys = ["TOTAL SALES", "SERVICE SALES", "BRANDED UNITS", "TOTAL UNITS"];

  // ✅ Format
  const formatValue = (key, value) => {
    const unitKeys = ["BRANDED UNITS", "TOTAL UNITS"];
    const formatted = Number(value).toLocaleString();
    return unitKeys.includes(key.toUpperCase()) ? formatted : `$${formatted}`;
  };

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
                {Object.keys(staffMonthlyGoals)
                  .filter((key) => allowedKeys.includes(key.toUpperCase()))
                  .map((key) => (
                    <tr key={key}>
                      <td>{key.replace("_", " ").toUpperCase()}</td>
                      <td>{formatValue(key, staffMonthlyGoals[key])}</td>
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
                {Object.keys(staffDailyGoals)
                  .filter((key) => allowedKeys.includes(key.toUpperCase()))
                  .map((key) => (
                    <tr key={key}>
                      <td>{key.replace("_", " ").toUpperCase()}</td>
                      <td>{formatValue(key, staffDailyGoals[key])}</td>
                      <td style={{ fontWeight: "bold" }}>
                        {formatValue(key, staffAdjustedDailyGoals[key])}
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



