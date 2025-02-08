// import React, { useState } from "react";
// import { Card, CardContent, Typography, Button, TextField, Grid } from "@mui/material";

// const salesStaff = [
//   { name: "Sherri Legg", focus: "units/branded", totalSales: 0, serviceSales: 0, totalUnits: 0, brandedUnits: 0 },
//   { name: "Jason Fine", focus: "service", totalSales: 0, serviceSales: 0, totalUnits: 0, brandedUnits: 0 },
//   { name: "Hannah Haller", focus: "balanced", totalSales: 0, serviceSales: 0, totalUnits: 0, brandedUnits: 0 },
//   { name: "Manager (You)", focus: "balanced", totalSales: 0, serviceSales: 0, totalUnits: 0, brandedUnits: 0 }
// ];

// const StaffGoals = () => {
//   const [dailyProgress, setDailyProgress] = useState(
//     salesStaff.reduce((acc, staff) => {
//       acc[staff.name] = { totalSales: "", serviceSales: "", totalUnits: "", brandedUnits: "" };
//       return acc;
//     }, {})
//   );

//   const handleInputChange = (name, field, value) => {
//     setDailyProgress((prev) => ({
//       ...prev,
//       [name]: {
//         ...prev[name],
//         [field]: value,
//       },
//     }));
//   };

//   return (
//     <Grid container spacing={3}>
//       {salesStaff.map((staff) => (
//         <Grid item xs={12} sm={6} md={4} key={staff.name}>
//           <Card sx={{ border: "3px solid #C8102E", backgroundColor: "#F4F4F4" }}>
//             <CardContent>
//               <Typography variant="h5" sx={{ color: "#0047BA", mb: 2 }}>{staff.name}</Typography>
//               <Typography variant="body1">Focus: {staff.focus}</Typography>
//               <TextField
//                 label="Total Sales"
//                 variant="outlined"
//                 fullWidth
//                 margin="dense"
//                 value={dailyProgress[staff.name].totalSales}
//                 onChange={(e) => handleInputChange(staff.name, "totalSales", e.target.value)}
//               />
//               <TextField
//                 label="Service Sales"
//                 variant="outlined"
//                 fullWidth
//                 margin="dense"
//                 value={dailyProgress[staff.name].serviceSales}
//                 onChange={(e) => handleInputChange(staff.name, "serviceSales", e.target.value)}
//               />
//               <TextField
//                 label="Total Units"
//                 variant="outlined"
//                 fullWidth
//                 margin="dense"
//                 value={dailyProgress[staff.name].totalUnits}
//                 onChange={(e) => handleInputChange(staff.name, "totalUnits", e.target.value)}
//               />
//               <TextField
//                 label="Branded Units"
//                 variant="outlined"
//                 fullWidth
//                 margin="dense"
//                 value={dailyProgress[staff.name].brandedUnits}
//                 onChange={(e) => handleInputChange(staff.name, "brandedUnits", e.target.value)}
//               />
//               <Button variant="contained" sx={{ mt: 2, backgroundColor: "#0047BA" }}>
//                 Save Progress
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default StaffGoals;
