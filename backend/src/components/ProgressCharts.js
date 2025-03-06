import React from "react";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { Bar } from "react-chartjs-2";

const ProgressCharts = ({ progress, monthlyGoal }) => {
  const chartData = (labels, keys) => ({
    labels: labels.map((key) => key.replace("_", " ")),
    datasets: [
      { label: "Progress", data: keys.map((key) => progress[key] || 0), backgroundColor: "#0047BA" },
      { label: "Goal", data: keys.map((key) => monthlyGoal[key] || 0), backgroundColor: "#000000" },
      { label: "Remaining", data: keys.map((key) => Math.max(0, (monthlyGoal[key] || 0) - (progress[key] || 0))), backgroundColor: "#C8102E" },
    ],
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ border: "2px solid #0047BA" }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: "#C8102E" }}>Sales & Revenue Progress</Typography>
            <Bar data={chartData(["total_sales", "service_sales", "cfna_sales", "rubber_gp"], ["total_sales", "service_sales", "cfna_sales", "rubber_gp"])} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ border: "2px solid #000000" }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: "#C8102E" }}>Units Progress</Typography>
            <Bar data={chartData(["total_units", "branded_units"], ["total_units", "branded_units"])} />
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12}>
        <Card sx={{ border: "2px solid #C8102E" }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: "#0047BA" }}>Boss Count Progress</Typography>
            <Bar data={chartData(["boss_count"], ["boss_count"])} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ProgressCharts;
