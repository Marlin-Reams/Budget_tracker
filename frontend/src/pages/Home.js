import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Typography } from "@mui/material";
import BudgetTable from "../components/BudgetTable";
import ProgressCharts from "../components/ProgressCharts";
import MonthSelector from "../components/MonthSelector";
import AdjustedDailyTargets from "../components/AdjustedDailyTargets";
import DailyMessage from "../components/DailyMessage";
import { Link } from "react-router-dom";

const Home = () => {
  const [progress, setProgress] = useState({});
  const [monthlyGoal, setMonthlyGoal] = useState({});
  const [month, setMonth] = useState("2025-02");
  const [targets, setTargets] = useState(null);

  useEffect(() => {
    console.log("Fetching data for month:", month);
    const fetchData = async () => {
      try {
        const progressRes = await axios.get(`https://budget-tracker-okow.onrender.com/get-progress?month=${month}`);
        console.log("Progress Data:", progressRes.data.progress);
  
        const targetsRes = await axios.get(`https://budget-tracker-okow.onrender.com/calculate-targets?month=${month}`);
        console.log("Targets Data:", targetsRes.data.daily_targets);
  
        const goalRes = await axios.get(`https://budget-tracker-okow.onrender.com/get-monthly-budget?month=${month}`);
        console.log("Monthly Goal Data:", goalRes.data);
  
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
      <Typography variant="h4" sx={{ my: 3, color: "#C8102E" }}>
        🔥 Firestone Budget Dashboard - {month}
      </Typography>
      
      <MonthSelector month={month} setMonth={setMonth} />
      <DailyMessage progress={progress} monthlyGoal={monthlyGoal} />

      <BudgetTable progress={progress} monthlyGoal={monthlyGoal} />
      <AdjustedDailyTargets progress={progress} monthlyGoal={monthlyGoal} />
      <ProgressCharts progress={progress} monthlyGoal={monthlyGoal} />

      {/* Navigate to the Staff Goals Page */}
      <div style={{ marginTop: "20px" }}>
        <h2>🏆 Staff Goals</h2>
        <Link 
  to={{
    pathname: "/staff-goals",
    state: { monthlyGoal, progress } // ✅ Pass data as state
  }} 
  style={{ fontSize: "18px", textDecoration: "underline", color: "#0047BA" }}
>
  ➡️ Click Here to View Staff Goals
</Link>
      </div>
    </Container>
  );
};

export default Home;



