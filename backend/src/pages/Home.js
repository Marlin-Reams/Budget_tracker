// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import { Container, Grid, Card, CardContent, Typography, Select, MenuItem } from "@mui/material";
// // import { Bar } from "react-chartjs-2";
// // import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// // // Register chart.js components
// // ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// // const Home = () => {
// //   const [progress, setProgress] = useState(null);
// //   const [targets, setTargets] = useState(null);
// //   const [monthlyGoal, setMonthlyGoal] = useState(null);
// //   const [month, setMonth] = useState("2025-02");

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const progressRes = await axios.get(`https://budget-tracker-okow.onrender.com/get-progress?month=${month}`);
// //         const targetsRes = await axios.get(`https://budget-tracker-okow.onrender.com/calculate-targets?month=${month}`);
// //         const goalRes = await axios.get(`https://budget-tracker-okow.onrender.com/get-monthly-budget?month=${month}`);

// //         setProgress(progressRes.data.progress);
// //         setTargets(targetsRes.data.daily_targets);
// //         setMonthlyGoal(goalRes.data);
// //       } catch (error) {
// //         console.error("Error fetching data", error);
// //       }
// //     };

// //     fetchData();
// //   }, [month]);

// //   const salesCategories = ["total_sales", "service_sales", "cfna_sales", "rubber_gp"];
// //   const unitCategories = ["total_units", "branded_units"];
// //   const bossCategory = ["boss_count"];

// //   return (
// //     <Container>
// //       <Typography variant="h4" sx={{ my: 3, color: "#C8102E" }}>🔥 Firestone Budget Dashboard - {month}</Typography>

// //       {/* Month Selector */}
// //       <Select value={month} onChange={(e) => setMonth(e.target.value)}>
// //         <MenuItem value="2025-01">January 2025</MenuItem>
// //         <MenuItem value="2025-02">February 2025</MenuItem>
// //         <MenuItem value="2025-03">March 2025</MenuItem>
// //       </Select>

// //       <Grid container spacing={3} sx={{ mt: 2 }}>
// //        {/* 🔥 Monthly Budget Overview with Correct Order & Formatting */}
// // <Grid item xs={12}>
// //   <Card sx={{ border: "3px solid #C8102E", backgroundColor: "#F4F4F4" }}>
// //     <CardContent>
// //       <Typography variant="h5" sx={{ color: "#0047BA", mb: 2 }}>📊 Monthly Budget Goals</Typography>
// //       {monthlyGoal ? (
// //         <table style={{
// //           width: "100%",
// //           borderCollapse: "collapse",
// //           backgroundColor: "#FFFFFF",
// //           borderRadius: "8px",
// //           overflow: "hidden",
// //           boxShadow: "0px 2px 5px rgba(0,0,0,0.1)"
// //         }}>
// //           <thead>
// //             <tr style={{
// //               backgroundColor: "#C8102E",
// //               color: "#FFFFFF",
// //               borderBottom: "2px solid #FFFFFF"
// //             }}>
// //               <th style={{ padding: "12px", textAlign: "left", width: "40%" }}>Category</th>
// //               <th style={{ padding: "12px", textAlign: "left", width: "20%" }}>Goal</th>
// //               <th style={{ padding: "12px", textAlign: "left", width: "20%" }}>Progress</th>
// //               <th style={{ padding: "12px", textAlign: "left", width: "20%" }}>Remaining</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {/* ✅ Correct Order Based on Firestone Paperwork */}
// //             {[
// //               "total_sales",
// //               "service_sales",
// //               "cfna_sales",
// //               "total_units",
// //               "branded_units",
// //               "boss_count",
// //               "rubber_gp"
// //             ].map((key, index) => {
// //               const value = monthlyGoal[key] || 0;
// //               const progressValue = progress?.[key] || 0;
// //               const remainingValue = Math.max(0, value - progressValue);

// //               // Fields that should be formatted as currency
// //               const isCurrency = ["total_sales", "service_sales", "cfna_sales", "rubber_gp"].includes(key);

// //               return (
// //                 <tr key={key} style={{
// //                   backgroundColor: index % 2 === 0 ? "#FAFAFA" : "#FFFFFF",
// //                   borderBottom: "1px solid #DDDDDD"
// //                 }}>
// //                   <td style={{ padding: "12px", textAlign: "left", fontWeight: "bold", borderRight: "1px solid #DDDDDD" }}>
// //                     {key.replace("_", " ").toUpperCase()}
// //                   </td>
// //                   <td style={{ padding: "12px", textAlign: "left", fontSize: "16px", fontWeight: "bold", borderRight: "1px solid #DDDDDD" }}>
// //                     {isCurrency ? `$${value.toLocaleString()}` : value.toLocaleString()}
// //                   </td>
// //                   <td style={{ padding: "12px", textAlign: "left", fontSize: "16px", fontWeight: "bold", color: "#0047BA", borderRight: "1px solid #DDDDDD" }}>
// //                     {isCurrency ? `$${progressValue.toLocaleString()}` : progressValue.toLocaleString()}
// //                   </td>
// //                   <td style={{ padding: "12px", textAlign: "left", fontSize: "16px", fontWeight: "bold", color: "#C8102E" }}>
// //                     {isCurrency ? `$${remainingValue.toLocaleString()}` : remainingValue.toLocaleString()}
// //                   </td>
// //                 </tr>
// //               );
// //             })}
// //           </tbody>
// //         </table>
// //       ) : <Typography>Loading...</Typography>}
// //     </CardContent>
// //   </Card>
// // </Grid>
// //         {/* 🔵 Sales & Revenue Chart */}
// //         <Grid item xs={12}>
// //           <Card sx={{ border: "2px solid #0047BA" }}>
// //             <CardContent>
// //               <Typography variant="h5" sx={{ color: "#C8102E" }}>Sales & Revenue Progress</Typography>
// //               {progress && targets && monthlyGoal ? (
// //                 <Bar
// //                   data={{
// //                     labels: salesCategories.map((key) => key.replace("_", " ")),
// //                     datasets: [
// //                       {
// //                         label: "Progress",
// //                         data: salesCategories.map((key) => progress[key] || 0),
// //                         backgroundColor: "#0047BA", // 🔵 Firestone Blue
// //                       },
// //                       {
// //                         label: "Goal",
// //                         data: salesCategories.map((key) => monthlyGoal[key] || 0),
// //                         backgroundColor: "#000000", // ⚫ Firestone Black
// //                       },
// //                       {
// //                         label: "Remaining",
// //                         data: salesCategories.map((key) => Math.max(0, (monthlyGoal[key] || 0) - (progress[key] || 0))),
// //                         backgroundColor: "#C8102E", // 🔴 Firestone Red
// //                       },
// //                     ],
// //                   }}
// //                 />
// //               ) : <Typography>Loading Chart...</Typography>}
// //             </CardContent>
// //           </Card>
// //         </Grid>

// //         {/* ⚫ Units Chart */}
// //         <Grid item xs={12}>
// //           <Card sx={{ border: "2px solid #000000" }}>
// //             <CardContent>
// //               <Typography variant="h5" sx={{ color: "#C8102E" }}>Units Progress</Typography>
// //               {progress && targets && monthlyGoal ? (
// //                 <Bar
// //                   data={{
// //                     labels: unitCategories.map((key) => key.replace("_", " ")),
// //                     datasets: [
// //                       {
// //                         label: "Progress",
// //                         data: unitCategories.map((key) => progress[key] || 0),
// //                         backgroundColor: "#0047BA",
// //                       },
// //                       {
// //                         label: "Goal",
// //                         data: unitCategories.map((key) => monthlyGoal[key] || 0),
// //                         backgroundColor: "#000000",
// //                       },
// //                       {
// //                         label: "Remaining",
// //                         data: unitCategories.map((key) => Math.max(0, (monthlyGoal[key] || 0) - (progress[key] || 0))),
// //                         backgroundColor: "#C8102E",
// //                       },
// //                     ],
// //                   }}
// //                 />
// //               ) : <Typography>Loading Chart...</Typography>}
// //             </CardContent>
// //           </Card>
// //         </Grid>

// //         {/* 🔴 Boss Count Chart */}
// //         <Grid item xs={12}>
// //           <Card sx={{ border: "2px solid #C8102E" }}>
// //             <CardContent>
// //               <Typography variant="h5" sx={{ color: "#0047BA" }}>Boss Count Progress</Typography>
// //               {progress && targets && monthlyGoal ? (
// //                 <Bar
// //                   data={{
// //                     labels: ["Boss Count"],
// //                     datasets: [
// //                       {
// //                         label: "Progress",
// //                         data: [progress["boss_count"] || 0],
// //                         backgroundColor: "#0047BA",
// //                       },
// //                       {
// //                         label: "Goal",
// //                         data: [monthlyGoal["boss_count"] || 0],
// //                         backgroundColor: "#000000",
// //                       },
// //                       {
// //                         label: "Remaining",
// //                         data: [Math.max(0, (monthlyGoal["boss_count"] || 0) - (progress["boss_count"] || 0))],
// //                         backgroundColor: "#C8102E",
// //                       },
// //                     ],
// //                   }}
// //                 />
// //               ) : <Typography>Loading Chart...</Typography>}
// //             </CardContent>
// //           </Card>
// //         </Grid>

// //       </Grid>
// //     </Container>
// //   );
// // };

// // export default Home;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography } from "@mui/material";
import BudgetTable from "../components/BudgetTable";
import ProgressCharts from "../components/ProgressCharts";
import MonthSelector from "../components/MonthSelector";

const Home = () => {
  const [progress, setProgress] = useState({});
  const [monthlyGoal, setMonthlyGoal] = useState({});
  const [month, setMonth] = useState("2025-02");

  useEffect(() => {
    // console.log("Fetching data for month:", month);
    const fetchData = async () => {
      try {
        // console.log("Fetching progress...");
        const progressRes = await axios.get(`https://budget-tracker-okow.onrender.com/get-progress?month=${month}`);
        // console.log("Progress Data:", progressRes.data.progress);
  
        // console.log("Fetching targets...");
        const targetsRes = await axios.get(`https://budget-tracker-okow.onrender.com/calculate-targets?month=${month}`);
        // console.log("Targets Data:", targetsRes.data.daily_targets);
  
        // console.log("Fetching monthly budget...");
        const goalRes = await axios.get(`https://budget-tracker-okow.onrender.com/get-monthly-budget?month=${month}`);
        // console.log("Monthly Goal Data:", goalRes.data);
  
        setProgress(progressRes.data.progress);
        setTargets(targetsRes.data.daily_targets);
        setMonthlyGoal(goalRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [month]);
  
  
  return (
    <Container>
      <Typography variant="h4" sx={{ my: 3, color: "#C8102E" }}>🔥 Firestone Budget Dashboard - {month}</Typography>
      <MonthSelector month={month} setMonth={setMonth} />
      <BudgetTable progress={progress} monthlyGoal={monthlyGoal} />
      <ProgressCharts progress={progress} monthlyGoal={monthlyGoal} />
    </Container>
  );
};

export default Home;


