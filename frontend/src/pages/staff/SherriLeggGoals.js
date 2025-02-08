// import React from "react";
// import { useLocation } from "react-router-dom";
// import { Card, CardContent, Typography, Grid } from "@mui/material";

// const SherriLeggGoals = () => {
//     const location = useLocation();
//     const { monthlyGoal, progress } = location.state || {}; // ✅ Extract passed data
  
//     if (!monthlyGoal || !progress) {
//       return <Typography>Loading Sherri's goals...</Typography>;
//     }
  
//     console.log("SherriLeggGoals - Monthly Goal Data:", monthlyGoal);
//     console.log("SherriLeggGoals - Progress Data:", progress);

//   // Get the number of days in the current month
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = today.getMonth() + 1;
//   const daysInMonth = new Date(year, month, 0).getDate();
//   const remainingDays = Math.max(1, daysInMonth - today.getDate());

//   // **Weights for Sherri's contribution**
//   const weightDistribution = {
//     total_sales: 0.25,
//     service_sales: 0.2,
//     cfna_sales: 0.3,
//     total_units: 0.4,
//     branded_units: 0.45,
//     boss_count: 0.25,
//     rubber_gp: 0.45,
//   };

//   // **Ensure Categories Are in the Correct Order**
//   const orderedCategories = [
//     "total_sales",
//     "service_sales",
//     "cfna_sales",
//     "total_units",
//     "branded_units",
//     "boss_count",
//     "rubber_gp"
//   ];

//   // **Calculate Monthly Goals for Sherri (5% buffer applied)**
//   const sherriMonthlyGoals = orderedCategories.reduce((acc, key) => {
//     acc[key] = (monthlyGoal[key] || 0) * weightDistribution[key] * 1.05;
//     return acc;
//   }, {});

//   // **Calculate Daily Goals for Sherri**
//   const sherriDailyGoals = orderedCategories.reduce((acc, key) => {
//     acc[key] = sherriMonthlyGoals[key] / daysInMonth;
//     return acc;
//   }, {});

//   // **Calculate Adjusted Daily Goals (based on remaining budget)**
//   const sherriAdjustedDailyGoals = orderedCategories.reduce((acc, key) => {
//     const remaining = (sherriMonthlyGoals[key] || 0) - (progress[key] || 0);
//     acc[key] = remaining / remainingDays;
//     return acc;
//   }, {});

//   // **Get color indicators**
//   const getColor = (adjusted, original) => {
//     if (adjusted > original) return "red"; // 🔴 Need to push harder
//     if (adjusted < original) return "green"; // 🟢 Ahead of schedule
//     return "black"; // ⚫ On track
//   };

//   // **Check if a category should be formatted as currency**
//   const isCurrency = (key) => ["total_sales", "service_sales", "cfna_sales", "rubber_gp"].includes(key);

//   return (
//     <Grid container spacing={3}>
//       <Grid item xs={12}>
//         <Card sx={{ border: "3px solid #C8102E", backgroundColor: "#F4F4F4", padding: "15px", marginBottom: "20px" }}>
//           <CardContent>
//             <Typography variant="h4" sx={{ color: "#0047BA", mb: 2 }}>Sherri Legg - Sales Goals</Typography>

//             {/* Monthly Goals Table */}
//             <Typography variant="h6" sx={{ mt: 2, color: "#C8102E" }}>📊 Monthly Goals</Typography>
//             <table className="goals-table" style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
//               <thead>
//                 <tr style={{ backgroundColor: "#C8102E", color: "white", textAlign: "left" }}>
//                   <th style={{ padding: "10px" }}>Category</th>
//                   <th style={{ padding: "10px" }}>Goal</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orderedCategories.map((key, index) => (
//                   <tr key={key} style={{ backgroundColor: index % 2 === 0 ? "#FAFAFA" : "#FFFFFF" }}>
//                     <td style={{ padding: "10px", fontWeight: "bold" }}>{key.replace("_", " ").toUpperCase()}</td>
//                     <td style={{ padding: "10px", textAlign: "right" }}>
//                       {isCurrency(key) ? `$${sherriMonthlyGoals[key].toFixed(2)}` : sherriMonthlyGoals[key].toFixed(0)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {/* Daily Goals Table */}
//             <Typography variant="h6" sx={{ mt: 2, color: "#0047BA" }}>📆 Daily Goals</Typography>
//             <table className="goals-table" style={{ width: "100%", borderCollapse: "collapse" }}>
//               <thead>
//                 <tr style={{ backgroundColor: "#0047BA", color: "white", textAlign: "left" }}>
//                   <th style={{ padding: "10px" }}>Category</th>
//                   <th style={{ padding: "10px" }}>Original Daily Goal</th>
//                   <th style={{ padding: "10px" }}>Adjusted Daily Goal</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orderedCategories.map((key, index) => (
//                   <tr key={key} style={{ backgroundColor: index % 2 === 0 ? "#FAFAFA" : "#FFFFFF" }}>
//                     <td style={{ padding: "10px", fontWeight: "bold" }}>{key.replace("_", " ").toUpperCase()}</td>
//                     <td style={{ padding: "10px", textAlign: "right" }}>
//                       {isCurrency(key) ? `$${sherriDailyGoals[key].toFixed(2)}` : sherriDailyGoals[key].toFixed(0)}
//                     </td>
//                     <td style={{ padding: "10px", textAlign: "right", fontWeight: "bold", color: getColor(sherriAdjustedDailyGoals[key], sherriDailyGoals[key]) }}>
//                       {isCurrency(key) ? `$${sherriAdjustedDailyGoals[key].toFixed(2)}` : sherriAdjustedDailyGoals[key].toFixed(0)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//           </CardContent>
//         </Card>
//       </Grid>
//     </Grid>
//   );
// };

// export default SherriLeggGoals;



