import React, { useState } from "react";
import axios from "axios";

const SetBudget = () => {
  const [month, setMonth] = useState("2025-02");
  const [budget, setBudget] = useState({
    total_sales: "",
    service_sales: "",
    cfna_sales: "",
    total_units: "",
    branded_units: "",
    boss_count: "",
    rubber_gp: ""
  });

  const handleChange = (e) => {
    setBudget({ ...budget, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`https://budget-tracker-okow.onrender.com/set-monthly-budget?month=${month}`, budget);
      alert("Monthly budget set successfully!");
    } catch (error) {
      alert("Error setting budget.");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Set Monthly Budget</h1>
      <label>
        Month: 
        <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
      </label>
      <form onSubmit={handleSubmit}>
        {Object.keys(budget).map((key) => (
          <label key={key}>
            {key.replace("_", " ").toUpperCase()}: 
            <input type="number" name={key} value={budget[key]} onChange={handleChange} required />
          </label>
        ))}
        <button type="submit">Set Budget</button>
      </form>
    </div>
  );
};

export default SetBudget;
