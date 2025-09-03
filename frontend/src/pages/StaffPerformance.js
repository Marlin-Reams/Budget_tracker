import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TeammateCalendar from '../components/TeammateCalendar';
import { Typography } from "@mui/material";
import { db } from "../firebaseConfig";
import { Button } from "@mui/material";
import useNotificationSetup from "../hooks/useNotificationSetup"; // ✅ NEW

import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "firebase/firestore";

const currencyFields = ["total_sales", "service_sales"];
const unitFields = ["total_units", "branded_units"];

// ❌ These categories should not be shown
const hiddenCategories = ["cfna_sales", "boss_count"];

const StaffPerformance = () => {
  const location = useLocation();
  const { staff, progress, monthlyGoal, staffMonthlyGoals: passedStaffMonthlyGoals } = location.state || {};
  useNotificationSetup(staff?.name); // ✅ Register this staff member's device


const staffMonthlyGoals = passedStaffMonthlyGoals || Object.keys(staff.allocation).reduce((acc, key) => {
  acc[key] = ((monthlyGoal[key] || 0) * (staff.allocation[key] / 100)).toFixed(2);
  return acc;
}, {});


  const [date, setDate] = useState("");
  const [totalSales, setTotalSales] = useState("");
  const [serviceSales, setServiceSales] = useState("");
  const [dailyTotals, setDailyTotals] = useState({});
  const [totalUnits, setTotalUnits] = useState("");
  const [brandedUnits, setBrandedUnits] = useState("");
  const [workedToday, setWorkedToday] = useState(true);


  const fetchDailyProgress = async () => {
  const q = query(
    collection(db, "staff_daily_sales"),
    where("staffName", "==", staff.name)
  );

  const querySnapshot = await getDocs(q);
  const totals = {
    total_sales: 0,
    service_sales: 0,
    total_units: 0,
    branded_units: 0,
    days_worked: 0,  // 👈 NEW: track how many days worked
  };

  querySnapshot.forEach((doc) => {
    const data = doc.data();

    // 🧠 Only count as a worked day if `worked` is true or undefined
    if (data.worked !== false) {
      totals.days_worked += 1;
    }

    totals.total_sales += data.totalSales || 0;
    totals.service_sales += data.serviceSales || 0;
    totals.total_units += data.totalUnits || 0;
    totals.branded_units += data.brandedUnits || 0;
  });

  setDailyTotals(totals);
};


  useEffect(() => {
    fetchDailyProgress();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, "staff_daily_sales"), {
        staffName: staff.name,
        date,
        totalSales: parseFloat(totalSales),
        serviceSales: parseFloat(serviceSales),
        totalUnits: parseFloat(totalUnits),
        brandedUnits: parseFloat(brandedUnits),
        worked: workedToday,
      });

      console.log("✅ Daily sales saved to Firestore!");
      setDate("");
      setTotalSales("");
      setServiceSales("");
      setTotalUnits("");
      setBrandedUnits("");

      fetchDailyProgress();
    } catch (error) {
      console.error("❌ Error saving to Firestore:", error);
    }
  };

  const handleSendGoalsText = async () => {
  const response = await fetch("https://your-api-url.com/send-goals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      staffName: staff.name,
      phoneNumber: staff.phone,  // Make sure this exists!
      dailyGoals: staffDailyGoals,
      monthlyGoals: monthlyGoal,
    }),
  });

  const data = await response.json();
  if (data.success) {
    alert("✅ Daily and Monthly Goals texted successfully!");
  } else {
    alert("❌ Failed to send text.");
  }
};


 
  const progressToUse = Object.keys(dailyTotals).length ? dailyTotals : progress;
  const staffAdjustedDailyGoals = {};
  const staffDailyGoals = {};

    const workingDays = staff?.workingDays || 21;

  Object.keys(staffMonthlyGoals || {}).forEach((key) => {
    if (!hiddenCategories.includes(key)) {
      const monthly = staffMonthlyGoals[key];
      staffDailyGoals[key] = Math.round(monthly / workingDays);
      staffAdjustedDailyGoals[key] = Math.round((monthly - (progressToUse[key] || 0)) / workingDays);
    }
  });


  return (
    <div>
      
      <Typography variant="h4">📊 {staff.name}'s Performance</Typography>

      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <label>
  Worked Today?
  <input
    type="checkbox"
    checked={workedToday}
    onChange={(e) => setWorkedToday(e.target.checked)}
  />
</label>

        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
        <label>
          Total Sales:
          <input
            type="number"
            value={totalSales}
            onChange={(e) => setTotalSales(e.target.value)}
            required
          />
        </label>
        <label>
          Service Sales:
          <input
            type="number"
            value={serviceSales}
            onChange={(e) => setServiceSales(e.target.value)}
            required
          />
        </label>
        <label>
          Total Units:
          <input
            type="number"
            value={totalUnits}
            onChange={(e) => setTotalUnits(e.target.value)}
            required
          />
        </label>
        <label>
          Branded Units:
          <input
            type="number"
            value={brandedUnits}
            onChange={(e) => setBrandedUnits(e.target.value)}
            required
          />
        </label>

        <button type="submit">Submit Daily Sales</button>
      </form>

      <Typography variant="h6" sx={{ mt: 2 }}>📈 Progress So Far</Typography>
      <table className="goals-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Actual</th>
            <th>% Complete</th>
          </tr>
        </thead>
        <tbody>
  {["total_sales", "service_sales", "total_units", "branded_units"].map((key) => {
    const actual = progressToUse[key] || 0;
    const goal = staffMonthlyGoals[key];
    const percent = ((actual / goal) * 100).toFixed(1);
    const isCurrency = currencyFields.includes(key);

    return (
      <tr key={key}>
        <td>{key.replace("_", " ").toUpperCase()}</td>
        <td>{isCurrency ? `$${Math.round(actual)}` : Math.round(actual)}</td>
        <td>{percent}%</td>
      </tr>
    );
  })}
</tbody>
      </table>

      <Typography variant="h6" sx={{ mt: 2 }}>📆 Daily Goals</Typography>
      <table className="goals-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Original Daily Goal</th>
            <th>Adjusted Daily Goal</th>
          </tr>
        </thead>
        <tbody>
  {["total_sales", "service_sales", "total_units", "branded_units"].map((key) => (
    <tr key={key}>
      <td>{key.replace("_", " ").toUpperCase()}</td>
      <td>
        {currencyFields.includes(key)
          ? `$${staffDailyGoals[key]}`
          : staffDailyGoals[key]}
      </td>
      <td style={{ fontWeight: "bold" }}>
        {currencyFields.includes(key)
          ? `$${staffAdjustedDailyGoals[key]}`
          : staffAdjustedDailyGoals[key]}
      </td>
    </tr>
  ))}
</tbody>

      </table>
      
        <TeammateCalendar staffName={staff.name} />
        <Button
  variant="outlined"
  sx={{ mt: 2, color: "#0047BA", borderColor: "#0047BA" }}
  onClick={handleSendGoalsText}
>
  📤 Text Daily & Monthly Goals
</Button>
    </div>
    
  );
};

export default StaffPerformance;