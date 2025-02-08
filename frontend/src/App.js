import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Home from "./pages/Home";
import EnterData from "./pages/EnterData";
import SetBudget from "./pages/SetBudget";
import StaffGoals from "./pages/StaffGoals";
import SherriLeggGoals from "./pages/staff/SherriLeggGoals";

const App = () => {
  return (
    <Router>
      <nav>
        <Link to="/">Dashboard</Link> | 
        <Link to="/enter-data">Enter Data</Link> | 
        {/* <Link to="/staff-goals">Staff Goals</Link> |  */}
        <Link to="/set-budget">Set Budget</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enter-data" element={<EnterData />} />
        <Route path="/staff-goals" element={<StaffGoals />} />
        <Route path="/set-budget" element={<SetBudget />} />
        {/* <Route path="/staff-goals/sherri-legg" element={<SherriLeggGoals />} /> */}
      </Routes>
    </Router>
  );
};

export default App;

