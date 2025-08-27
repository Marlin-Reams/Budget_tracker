import React from "react";
import { Select, MenuItem } from "@mui/material";

const MonthSelector = ({ month, setMonth }) => {
  return (
    <Select value={month} onChange={(e) => setMonth(e.target.value)} sx={{ mb: 3 }}>
      <MenuItem value="2025-01">January 2025</MenuItem>
      <MenuItem value="2025-02">February 2025</MenuItem>
      <MenuItem value="2025-03">March 2025</MenuItem>
      <MenuItem value="2025-08">August 2025</MenuItem>
    </Select>
  );
};

export default MonthSelector;