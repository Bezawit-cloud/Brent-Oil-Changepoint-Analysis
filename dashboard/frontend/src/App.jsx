import React, { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceDot } from "recharts";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [prices, setPrices] = useState([]);
  const [events, setEvents] = useState([]);
  const [changePoint, setChangePoint] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch data from backend
  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/prices").then((res) => {
      const formatted = res.data.map((d) => ({
        date: new Date(d.Date),
        price: d.Price,
      }));
      setPrices(formatted);
    });
    axios.get("http://127.0.0.1:5000/api/events").then((res) => setEvents(res.data));
    axios.get("http://127.0.0.1:5000/api/change-point").then((res) => setChangePoint(res.data));
  }, []);

  // Filter prices by date range
  const filteredPrices = prices.filter((d) => {
    if (!startDate && !endDate) return true;
    if (startDate && endDate) return d.date >= startDate && d.date <= endDate;
    if (startDate) return d.date >= startDate;
    if (endDate) return d.date <= endDate;
    return true;
  });

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Brent Oil Price Analysis Dashboard</h1>

      {/* Date Filters */}
      <div style={{ marginBottom: "20px" }}>
        <label>Start Date: </label>
        <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
        <label style={{ marginLeft: "10px" }}>End Date: </label>
        <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
      </div>

      {/* Line Chart */}
      <LineChart
        width={900}
        height={400}
        data={filteredPrices}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis
          dataKey="date"
          tickFormatter={(tick) => tick.toISOString().split("T")[0]}
          type="number"
          domain={["auto", "auto"]}
          scale="time"
        />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip labelFormatter={(label) => new Date(label).toDateString()} />
        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />

        {/* Change Point */}
        {changePoint && (
          <ReferenceDot
            x={new Date(changePoint.change_point_date).getTime()}
            y={changePoint.mean_after}
            r={6}
            fill="red"
            label="Change Point"
          />
        )}
      </LineChart>

      {/* Event List */}
      <div style={{ marginTop: "30px" }}>
        <h2>Key Events</h2>
        <ul>
          {events.map((event, idx) => (
            <li key={idx}>
              {event.Date} — {event.Description}
            </li>
          ))}
        </ul>
      </div>

      {/* Change Point Summary */}
      {changePoint && (
        <div style={{ marginTop: "30px" }}>
          <h2>Change Point Summary</h2>
          <p>Date: {changePoint.change_point_date}</p>
          <p>Mean Before: ${changePoint.mean_before.toFixed(2)}</p>
          <p>Mean After: ${changePoint.mean_after.toFixed(2)}</p>
          <p>Percent Change: {changePoint.percent_change.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

export default App;