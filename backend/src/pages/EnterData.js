import React, { useState } from "react";
import axios from "axios";
import { Container, Button, TextField, Typography } from "@mui/material";

const EnterData = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [formData, setFormData] = useState({
    total_sales: "",
    service_sales: "",
    cfna_sales: "",
    total_units: "",
    branded_units: "",
    boss_count: "",
    rubber_gp: ""
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Fetch a specific day's entry
  const handleFetchEntry = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    try {
      const res = await axios.get(`http://127.0.0.1:8000/get-budget/${selectedDate}`);
      setFormData(res.data);
      setIsEditing(true);
    } catch (error) {
      alert("No entry found for this date.");
      setFormData({
        total_sales: "",
        service_sales: "",
        cfna_sales: "",
        total_units: "",
        branded_units: "",
        boss_count: "",
        rubber_gp: ""
      });
      setIsEditing(false);
    }
  };

  // Submit or update an entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    try {
      const url = isEditing
        ? `http://127.0.0.1:8000/update-budget/${selectedDate}`
        : "http://127.0.0.1:8000/update-budget";
      const method = isEditing ? "put" : "post";

      await axios[method](url, { date: selectedDate, ...formData });
      alert(`Entry ${isEditing ? "updated" : "added"} successfully!`);
      setIsEditing(false);
    } catch (error) {
      alert("Error submitting data.");
      console.error(error);
    }
  };

  // Delete an entry
  const handleDelete = async () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete the entry for ${selectedDate}?`)) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/delete-budget/${selectedDate}`);
      alert("Entry deleted successfully!");
      setFormData({
        total_sales: "",
        service_sales: "",
        cfna_sales: "",
        total_units: "",
        branded_units: "",
        boss_count: "",
        rubber_gp: ""
      });
      setIsEditing(false);
    } catch (error) {
      alert("Error deleting entry.");
      console.error(error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ my: 3 }}>Enter or Edit Daily Budget Data</Typography>

      {/* Date Picker */}
      <TextField
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        required
      />
      <Button variant="contained" sx={{ ml: 2 }} onClick={handleFetchEntry}>Fetch Entry</Button>

      {/* Entry Form */}
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        {Object.keys(formData).map((key) => (
          <TextField
            key={key}
            label={key.replace("_", " ").toUpperCase()}
            type="number"
            name={key}
            value={formData[key]}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
        ))}
        <Button type="submit" variant="contained" color="primary">{isEditing ? "Update" : "Submit"}</Button>
        {isEditing && (
          <Button variant="contained" color="error" sx={{ ml: 2 }} onClick={handleDelete}>Delete</Button>
        )}
      </form>
    </Container>
  );
};

export default EnterData;



