// import React from "react";
// import { Card, CardContent, Typography } from "@mui/material";

// const AdjustedDailyTargets = ({ targets, monthlyGoal }) => {
//   console.log("📌 AdjustedDailyTargets received targets:", targets);
//   console.log("📌 MonthlyGoal for reference:", monthlyGoal);

//   if (!targets || !monthlyGoal) {
//     return <Typography>Loading data...</Typography>;
//   }

//   // Get total days in the month
//   const today = new Date();
//   const year = today.getFullYear();
//   const month = today.getMonth() + 1;
//   const daysInMonth = new Date(year, month, 0).getDate();
//   const daysCompleted = today.getDate() - 1;  // 👈 Days that have been entered (yesterday's latest)
//   const daysLeft = daysInMonth - daysCompleted;  // 👈 Adjusted correctly

// console.log(`📆 Days Completed: ${daysCompleted}, Days Left: ${daysLeft}`);


//   // ✅ Order of categories to display
//   const categoryOrder = [
//     "total_sales",
//     "service_sales",
//     "cfna_sales",
//     "total_units",
//     "branded_units",
//     "boss_count",
//     "rubber_gp"
//   ];

//   // ✅ Calculate original daily targets based on the **total** monthly goal
//   const originalDailyTargets = categoryOrder.reduce((acc, key) => {
//     acc[key] = (monthlyGoal[key] || 0) / daysInMonth; // Original daily goal
//     return acc;
//   }, {});

//   // ✅ Determines color based on whether the adjusted goal is higher or lower
//   const getColor = (adjusted, original) => {
//     if (adjusted > original) return "red"; // 🚨 Falling behind, must increase effort
//     if (adjusted < original) return "green"; // ✅ Ahead of pace
//     return "black"; // ⚖ On track
//   };

//   return (
//     <Card sx={{ border: "3px solid #C8102E", backgroundColor: "#F4F4F4", marginBottom: "20px" }}>
//       <CardContent>
//         <Typography variant="h5" sx={{ color: "#0047BA", mb: 2 }}>
//           🔥 Adjusted Daily Targets (Performance-Based)
//         </Typography>
//         <Typography variant="h6" sx={{ color: "#C8102E", mb: 2 }}>
//   📆 Work Days Completed: {daysCompleted} / {daysInMonth} | ⏳ Work Days Left: {daysLeft}
// </Typography>
//         <table className="adjusted-targets-table">
//           <thead>
//             <tr>
//               <th>Category</th>
//               <th>Original Daily Goal</th>
//               <th>Adjusted Daily Goal</th>
//             </tr>
//           </thead>
//           <tbody>
//             {categoryOrder.map((key) => {
//               const original = originalDailyTargets[key] || 0;
//               const adjusted = targets[key] || 0;

//               return (
//                 <tr key={key}>
//                   <td>{key.replace("_", " ").toUpperCase()}</td>
//                   <td>{original.toFixed(2)}</td>
//                   <td style={{ color: getColor(adjusted, original), fontWeight: "bold" }}>
//                     {adjusted.toFixed(2)}
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>

//         {/* ✅ Legend Section */}
//         <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#FFFFFF", borderRadius: "5px", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)" }}>
//           <Typography variant="subtitle1" sx={{ fontWeight: "bold", textDecoration: "underline" }}>
//             Legend:
//           </Typography>
//           <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
//             <li style={{ color: "red", fontWeight: "bold" }}>⬆ Higher than Original → Need to push harder</li>
//             <li style={{ color: "green", fontWeight: "bold" }}>⬇ Lower than Original → Ahead of pace</li>
//             <li style={{ color: "black", fontWeight: "bold" }}>⚖ Same as Original → On track</li>
//           </ul>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default AdjustedDailyTargets;


import React from "react";
import { Card, CardContent, Typography } from "@mui/material";




const AdjustedDailyTargets = ({ progress, monthlyGoal, targets }) => {
  console.log("?? AdjustedDailyTargets - Progress Data:", progress);
  console.log("?? AdjustedDailyTargets - Monthly Goal Data:", monthlyGoal);
  if (!progress || !monthlyGoal || !targets) {
    return <Typography>Loading data...</Typography>;
  }

  // Get current month & dynamically determine the number of days
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // JS months are 0-based, so add 1
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysCompleted = today.getDate() - 1;  // ✅ Days that have reported data
  const daysLeft = daysInMonth - daysCompleted;  // ✅ Future days left for adjustments

  const categoryOrder = [
    "total_sales",
    "service_sales",
    "cfna_sales",
    "total_units",
    "branded_units",
    "boss_count",
    "rubber_gp"
  ];

  // ✅ Calculate **original** daily targets (initial plan)
  const originalDailyTargets = Object.keys(monthlyGoal).reduce((acc, key) => {
    acc[key] = (monthlyGoal[key] || 0) / daysInMonth;
    return acc;
  }, {});

  // ✅ Calculate **adjusted** daily targets (based on current progress)
  const adjustedDailyTargets = Object.keys(progress).reduce((acc, key) => {
    const remaining = (monthlyGoal[key] || 0) - (progress[key] || 0);
    acc[key] = remaining / daysLeft; // Adjust based on remaining days
    return acc;
  }, {});

  // ✅ Set margin for "on track" range (3% threshold)
  const marginPercent = 0.03; // Can be increased to 5% if needed

  // ✅ Determines **legend status** based on difference between adjusted & original targets
  const getLegendStatus = (adjusted, original) => {
    const difference = adjusted - original;
    const margin = original * marginPercent; // 3% margin

    if (Math.abs(difference) <= margin) return { label: "👌 On Track", color: "goldenrod" };
    if (adjusted > original + margin) return { label: "🔴 Higher than Original", color: "red" };
    if (adjusted < original - margin) return { label: "🟢 Lower than Original", color: "green" };
    return { label: "⚪ Undefined", color: "gray" }; // Fallback
  };

 
  


  return (
    <Card sx={{ border: "3px solid #C8102E", backgroundColor: "#F4F4F4", marginBottom: "20px" }}>
      <CardContent>
        <Typography variant="h5" sx={{ color: "#0047BA", mb: 2 }}>
          🔥 Adjusted Daily Targets (Remaining Days: {daysLeft})
        </Typography>
        <table className="adjusted-targets-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Original Daily Goal</th>
              <th>Adjusted Daily Goal</th>
              <th>Status</th> {/* ✅ New Column for Status */}
            </tr>
          </thead>
          <tbody>
          {categoryOrder.map((key) => {
              const original = originalDailyTargets[key] || 0;
              const adjusted = adjustedDailyTargets[key] || 0;
              const { label, color } = getLegendStatus(adjusted, original);

              return (
                <tr key={key}>
                  <td>{key.replace("_", " ").toUpperCase()}</td>
                  <td>{original.toFixed(2)}</td>
                  <td>{adjusted.toFixed(2)}</td>
                  <td style={{ color: color, fontWeight: "bold" }}>{label}</td> {/* ✅ Legend Applied Here */}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* ✅ Legend Explanation */}
        <div style={{ marginTop: "15px", padding: "10px", backgroundColor: "#FFFFFF", borderRadius: "5px", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold", textDecoration: "underline" }}>
            Legend:
          </Typography>
          <ul style={{ paddingLeft: "20px", margin: "5px 0" }}>
            <li style={{ color: "goldenrod", fontWeight: "bold" }}>👌 On Track (±3%)</li>
            <li style={{ color: "red", fontWeight: "bold" }}>🔴 Higher than Original (Need to push harder)</li>
            <li style={{ color: "green", fontWeight: "bold" }}>🟢 Lower than Original (Ahead of pace)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdjustedDailyTargets;



