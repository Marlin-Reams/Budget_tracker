import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
// import "./TeammateCalendar.css"; // Optional custom styling

const TeammateCalendar = ({ staffName }) => {
  const [submittedDates, setSubmittedDates] = useState([]);

  useEffect(() => {
    const fetchDates = async () => {
      const q = query(
        collection(db, "staff_daily_sales"),
        where("staffName", "==", staffName)
      );
      const snapshot = await getDocs(q);

      const dates = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.date) {
          dates.push(new Date(data.date));
        }
      });

      setSubmittedDates(dates);
    };

    fetchDates();
  }, [staffName]);

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const isMarked = submittedDates.some(d =>
        d.getFullYear() === date.getFullYear() &&
        d.getMonth() === date.getMonth() &&
        d.getDate() === date.getDate()
      );
      return isMarked ? <div className="dot" /> : null;
    }
  };

  return (
    <div>
      <h3>📅 Days {staffName} Has Worked</h3>
      <Calendar tileContent={tileContent} />
    </div>
  );
};

export default TeammateCalendar;
