import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Grid, Button, TextField, MenuItem } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

const skillLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
const focuses = ["service", "units/branded", "balanced"];
const roles = ["Sales Associate", "Service Manager", "Store Manager"];
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Default allocation template
const defaultAllocation = {
  total_sales: 25,
  service_sales: 25,
  total_units: 25,
  branded_units: 25,
};

const StaffGoals = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Extract state safely from location
  const { monthlyGoal, progress } = location.state || {};

  console.log("📌 StaffGoals - Monthly Goal Data:", monthlyGoal);
  console.log("📌 StaffGoals - Progress Data:", progress);

  const [staffList, setStaffList] = useState([]);
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "Sales Associate",
    focus: "balanced",
    skillLevel: "Intermediate",
    allocation: { ...defaultAllocation },
    daysOff: [], // Added for tracking days off
  });

  const [allocationErrors, setAllocationErrors] = useState({});

  useEffect(() => {
    const savedStaff = JSON.parse(localStorage.getItem("staffList")) || [];
    setStaffList(savedStaff);
    validateAllocation(savedStaff);
  }, []);

  const handleAddStaff = () => {
    if (newStaff.name.trim() === "") return;

    const updatedList = [...staffList, newStaff];
    setStaffList(updatedList);
    localStorage.setItem("staffList", JSON.stringify(updatedList));

    setNewStaff({
      name: "",
      role: "Sales Associate",
      focus: "balanced",
      skillLevel: "Intermediate",
      allocation: { ...defaultAllocation },
      daysOff: [],
    });

    validateAllocation(updatedList);
  };

  const handleDeleteStaff = (index) => {
    const updatedList = staffList.filter((_, i) => i !== index);
    setStaffList(updatedList);
    localStorage.setItem("staffList", JSON.stringify(updatedList));
    validateAllocation(updatedList);
  };

  const handleAllocationChange = (index, category, value) => {
    const updatedList = [...staffList];
    updatedList[index].allocation[category] = Number(value);
    setStaffList(updatedList);
    localStorage.setItem("staffList", JSON.stringify(updatedList));
    validateAllocation(updatedList);
  };

  // Validate total allocation per category
  const validateAllocation = (staffData) => {
    const totals = staffData.reduce((acc, staff) => {
      Object.keys(staff.allocation).forEach((key) => {
        acc[key] = (acc[key] || 0) + staff.allocation[key];
      });
      return acc;
    }, {});

    const errors = {};
    Object.keys(totals).forEach((key) => {
      if (totals[key] !== 110) { // ✅ Fix to ensure each category totals 100%
        errors[key] = `⚠️ ${key.replace("_", " ")} must total 110% (Currently: ${totals[key]}%)`;
      }
    });

    setAllocationErrors(errors);
  };

  const handleDaysOffChange = (index, day) => {
    const updatedList = [...staffList];
    const staffMember = updatedList[index];

    if (staffMember.daysOff.includes(day)) {
      staffMember.daysOff = staffMember.daysOff.filter((d) => d !== day);
    } else {
      staffMember.daysOff.push(day);
    }

    setStaffList(updatedList);
    localStorage.setItem("staffList", JSON.stringify(updatedList));
  };


  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ border: "3px solid #C8102E", backgroundColor: "#F4F4F4", padding: "15px" }}>
          <CardContent>
            <Typography variant="h5" sx={{ color: "#0047BA", mb: 2 }}>Manage Sales Team</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  label="Role"
                  variant="outlined"
                  fullWidth
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                >
                  {roles.map((role) => (
                    <MenuItem key={role} value={role}>{role}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  label="Focus"
                  variant="outlined"
                  fullWidth
                  value={newStaff.focus}
                  onChange={(e) => setNewStaff({ ...newStaff, focus: e.target.value })}
                >
                  {focuses.map((focus) => (
                    <MenuItem key={focus} value={focus}>{focus}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  label="Skill Level"
                  variant="outlined"
                  fullWidth
                  value={newStaff.skillLevel}
                  onChange={(e) => setNewStaff({ ...newStaff, skillLevel: e.target.value })}
                >
                  {skillLevels.map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" sx={{ backgroundColor: "#0047BA" }} onClick={handleAddStaff}>
                  Add Staff Member
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Allocation Errors */}
      {Object.keys(allocationErrors).length > 0 && (
        <Grid item xs={12}>
          <Card sx={{ border: "3px solid red", backgroundColor: "#FFF3F3", padding: "10px" }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: "red" }}>⚠️ Allocation Errors</Typography>
              {Object.values(allocationErrors).map((error, index) => (
                <Typography key={index} sx={{ color: "red" }}>{error}</Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      )}

      {/* Staff List */}
      {staffList.length > 0 ? (
        staffList.map((staff, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ border: "3px solid #C8102E", backgroundColor: "#F4F4F4" }}>
              <CardContent>
                <Typography variant="h5" sx={{ color: "#0047BA", mb: 2 }}>{staff.name}</Typography>
                <Typography variant="body1">Role: {staff.role}</Typography>
                <Typography variant="body1">Focus: {staff.focus}</Typography>
                <Typography variant="body2">Skill Level: {staff.skillLevel}</Typography>



                {/* Allocation Fields */}
                {Object.keys(defaultAllocation).map((category) => (
                  <TextField
                    key={category}
                    label={category.replace("_", " ")}
                    type="number"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={staff.allocation[category] || 0}
                    onChange={(e) => handleAllocationChange(index, category, e.target.value)}
                  />
                ))}

                <Button
                  variant="contained"
                  sx={{ mt: 2, backgroundColor: "#0047BA" }}
                  onClick={() => {
                    console.log("📌 Navigating to StaffPerformance - Data Being Sent:", { staff, progress, monthlyGoal });
                    navigate(`/staff-performance/${staff.name.replace(/\s+/g, "-")}`, {
                      state: { staff, progress, monthlyGoal },
                    });
                  }}
                >
                  View Goals
                </Button>

                <Button
                  variant="contained"
                  sx={{ mt: 2, ml: 1, backgroundColor: "#C8102E" }}
                  onClick={() => handleDeleteStaff(index)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Typography sx={{ color: "#C8102E", ml: 2 }}>No team members added yet.</Typography>
      )}
    </Grid>
  );
};

export default StaffGoals;


