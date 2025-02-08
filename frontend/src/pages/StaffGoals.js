// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import { Card, CardContent, Typography, Grid, Button } from "@mui/material";

// const salesStaff = [
//   { name: "Sherri Legg", focus: "units/branded" },
//   { name: "Jason Fine", focus: "service" },
//   { name: "Hannah Haller", focus: "balanced" },
//   { name: "Manager (You)", focus: "balanced" }
// ];

// const StaffGoals = () => {
//   const location = useLocation();
//   const { monthlyGoal, progress } = location.state || {}; // ✅ Get data from `state`

//   if (!monthlyGoal || !progress) {
//     return <Typography>Loading staff goal data...</Typography>;
//   }

//   console.log("StaffGoals - Monthly Goal Data:", monthlyGoal);
//   console.log("StaffGoals - Progress Data:", progress);

//   return (
//     <Grid container spacing={3}>
//       {salesStaff.map((staff) => (
//         <Grid item xs={12} sm={6} md={4} key={staff.name}>
//           <Card sx={{ border: "3px solid #C8102E", backgroundColor: "#F4F4F4" }}>
//             <CardContent>
//               <Typography variant="h5" sx={{ color: "#0047BA", mb: 2 }}>{staff.name}</Typography>
//               <Typography variant="body1">Focus: {staff.focus}</Typography>
//               <Button
//                 variant="contained"
//                 sx={{ mt: 2, backgroundColor: "#0047BA" }}
//                 component={Link}
//                 to={{
//                   pathname: `/staff-goals/${staff.name.replace(/\s+/g, "-")}`,
//                   state: { monthlyGoal, progress } // ✅ Correct way to pass state
//                 }}
//               >
//                 View Goals
//               </Button>
//             </CardContent>
//           </Card>
//         </Grid>
//       ))}
//     </Grid>
//   );
// };

// export default StaffGoals;


