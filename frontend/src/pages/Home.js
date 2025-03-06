// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Container, Typography, Button } from "@mui/material";
// import BudgetTable from "../components/BudgetTable";
// import ProgressCharts from "../components/ProgressCharts";
// import MonthSelector from "../components/MonthSelector";
// import AdjustedDailyTargets from "../components/AdjustedDailyTargets";
// import DailyMessage from "../components/DailyMessage";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://budget-tracker-okow.onrender.com";


// const Home = () => {
//   const [progress, setProgress] = useState({});
//   const [monthlyGoal, setMonthlyGoal] = useState({});
//   const [targets, setTargets] = useState(null);
//   const getCurrentMonth = () => {
//     const today = new Date();
//     const year = today.getFullYear();
//     const month = String(today.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit format
//     return `${year}-${month}`;
//   };
  
//   const [month, setMonth] = useState(getCurrentMonth());
  

//   useEffect(() => {
//     console.log("Fetching data for month:", month);
//     const fetchData = async () => {
//       try {
//         const progressRes = await axios.get(`${API_BASE_URL}/get-progress?month=${month}`);
//         console.log("Progress Data:", progressRes.data.progress);
    
//         const targetsRes = await axios.get(`${API_BASE_URL}/calculate-targets?month=${month}`);
//         console.log("?? Targets Data from API:", targetsRes.data.daily_targets);
    
//         const goalRes = await axios.get(`${API_BASE_URL}/get-monthly-budget?month=${month}`);
//         console.log("Monthly Goal Data:", goalRes.data);
    
//         setProgress(progressRes.data.progress);
//         setTargets(targetsRes.data.daily_targets);  // ? This must be valid
//         setMonthlyGoal(goalRes.data);
//       } catch (error) {
//         console.error("? Error fetching data:", error);
//       }
//     };
  
//     fetchData();
//   }, [month]);
  

//   const navigate = useNavigate();

//   const handleFetchAndInsert = async () => {
//     try {
//       const res = await fetch(`${API_BASE_URL}/fetch-and-insert`, {
//             method: "POST",
//         });
//         const data = await res.json();
//         alert(data.message);
//     } catch (error) {
//         alert("Error fetching or inserting data.");
//     }
// };



//   return (
//     <Container>
//       <Typography variant="h4" sx={{ my: 3, color: "#C8102E" }}>
//         🔥 Firestone Budget Dashboard - {month}
//       </Typography>
      
//       <MonthSelector month={month} setMonth={setMonth} />
//       <DailyMessage progress={progress} monthlyGoal={monthlyGoal} />

//       <BudgetTable progress={progress} monthlyGoal={monthlyGoal} />
//       <AdjustedDailyTargets targets={targets} monthlyGoal={monthlyGoal} />
//       <ProgressCharts progress={progress} monthlyGoal={monthlyGoal} />

//       {/* Navigate to the Staff Goals Page */}
//       <div style={{ marginTop: "20px" }}>
//     <h2>🏆 Staff Goals</h2>
//     <Button 
//       variant="contained"
//       onClick={() => navigate("/staff-goals", { state: { monthlyGoal, progress } })} // ✅ Correctly pass state
//       sx={{ fontSize: "18px", backgroundColor: "#0047BA", color: "white" }}
//     >
//       ➡️ Click Here to View Staff Goals
//     </Button>
//     <Button
//     variant="contained"
//     sx={{ backgroundColor: "#0047BA", mt: 2 }}
//     onClick={handleFetchAndInsert}
// >
//     Fetch Latest Report
// </Button>
    
//   </div>
//     </Container>
//   );
// };

// export default Home;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography, Button } from "@mui/material";
import BudgetTable from "../components/BudgetTable";
import ProgressCharts from "../components/ProgressCharts";
import MonthSelector from "../components/MonthSelector";
import AdjustedDailyTargets from "../components/AdjustedDailyTargets";
import DailyMessage from "../components/DailyMessage";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://budget-tracker-okow.onrender.com";

const Home = () => {
  const [progress, setProgress] = useState({});
  const [monthlyGoal, setMonthlyGoal] = useState({});
  const [targets, setTargets] = useState(null);

  const getCurrentMonth = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Ensure 2-digit format
    return `${year}-${month}`;
  };

  const [month, setMonth] = useState(getCurrentMonth());

  useEffect(() => {
    console.log("?? Fetching data for month:", month);
    
    const fetchData = async () => {
      try {
        const progressRes = await axios.get(`${API_BASE_URL}/get-progress?month=${month}`);
        const targetsRes = await axios.get(`${API_BASE_URL}/calculate-targets?month=${month}`);
        const goalRes = await axios.get(`${API_BASE_URL}/get-monthly-budget?month=${month}`);

        setProgress(progressRes.data.progress);
        setTargets(targetsRes.data.daily_targets);
        setMonthlyGoal(goalRes.data);

        console.log("? Progress Data:", progressRes.data.progress);
        console.log("?? Targets Data:", targetsRes.data.daily_targets);
        console.log("?? Monthly Goal Data:", goalRes.data);
      } catch (error) {
        console.error("? Error fetching data:", error);
      }
    };

    fetchData();
  }, [month]);

  const navigate = useNavigate();

  const handleFetchAndInsert = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/fetch-and-insert`, { method: "POST" });
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      alert("? Error fetching or inserting data.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 3, color: "#C8102E" }}>
      🏎 Firestone Budget Dashboard - {month}
      </Typography>

      <MonthSelector month={month} setMonth={setMonth} />
      <DailyMessage progress={progress} monthlyGoal={monthlyGoal} />

      <BudgetTable progress={progress} monthlyGoal={monthlyGoal} />
      <AdjustedDailyTargets progress={progress} targets={targets} monthlyGoal={monthlyGoal} />
      <ProgressCharts progress={progress} monthlyGoal={monthlyGoal} />

      {/* Navigate to the Staff Goals Page */}
      <div style={{ marginTop: "20px" }}>
        <h2>🏆 Staff Goals</h2>
        <Button 
          variant="contained"
          onClick={() => navigate("/staff-goals", { state: { monthlyGoal, progress } })}
          sx={{ fontSize: "18px", backgroundColor: "#0047BA", color: "white" }}
        >
          🥅 Click Here to View Staff Goals
        </Button>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#0047BA", mt: 2 }}
          onClick={handleFetchAndInsert}
        >
          🗟 Fetch Latest Report
        </Button>
      </div>
    </Container>
  );
};

export default Home;



