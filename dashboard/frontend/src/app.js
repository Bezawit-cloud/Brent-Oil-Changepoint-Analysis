import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceDot, Label
} from "recharts";
import "./App.css";

function App() {
  const [prices, setPrices] = useState([]);
  const [changePoint, setChangePoint] = useState({});
  const [events, setEvents] = useState([]);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/api/prices").then(res => setPrices(res.data));
    axios.get("http://127.0.0.1:5000/api/change-point").then(res => setChangePoint(res.data));
    axios.get("http://127.0.0.1:5000/api/events").then(res => setEvents(res.data));
  }, []);

  const filteredPrices = prices.filter(p => {
    const date = new Date(p.Date);
    const afterStart = startDate ? date >= new Date(startDate) : true;
    const beforeEnd = endDate ? date <= new Date(endDate) : true;
    return afterStart && beforeEnd;
  });

  return (
    <div style={{ background: "#eef2f7", minHeight: "100vh", padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", color: "#1a3e5b", marginBottom: "20px" }}>
        Brent Oil Price Analysis Dashboard
      </h1>

      {/* Date Filters */}
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <span style={{ margin: "0 10px" }}>to</span>
        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
      </div>

      {/* Chart */}
      <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", marginBottom: "30px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={filteredPrices}>
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
            <XAxis dataKey="Date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="Price" stroke="#ff6f61" strokeWidth={2} dot={false} />
            {changePoint.change_point_index && (
              <ReferenceDot
                x={prices[changePoint.change_point_index]?.Date}
                y={changePoint.mean_after}
                r={10}
                fill="#007acc"
                stroke="#003366"
                strokeWidth={2}
                label={{ value: "Change Point", position: "top", fill: "#003366", fontWeight: "bold" }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
        <div style={{ flex: 1, background: "#ffd6d6", padding: "15px", borderRadius: "10px", textAlign: "center" }}>
          <h3>Mean Before</h3>
          <p style={{ fontSize: "22px", fontWeight: "bold" }}>${changePoint.mean_before}</p>
        </div>
        <div style={{ flex: 1, background: "#d6f7d6", padding: "15px", borderRadius: "10px", textAlign: "center" }}>
          <h3>Mean After</h3>
          <p style={{ fontSize: "22px", fontWeight: "bold" }}>${changePoint.mean_after}</p>
        </div>
        <div style={{ flex: 1, background: "#d6e0ff", padding: "15px", borderRadius: "10px", textAlign: "center" }}>
          <h3>Percent Change</h3>
          <p style={{ fontSize: "22px", fontWeight: "bold" }}>{changePoint.percent_change}%</p>
        </div>
      </div>

      {/* Events */}
      <div style={{ background: "#ffffff", padding: "20px", borderRadius: "12px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" }}>
        <h2 style={{ color: "#1a3e5b" }}>Key Events</h2>
        <ul style={{ maxHeight: showAllEvents ? "none" : "250px", overflowY: "auto" }}>
          {events.map((e, i) => (
            <li key={i}><strong>{e.Date}</strong> — {e.Event}</li>
          ))}
        </ul>
        <button
          onClick={() => setShowAllEvents(!showAllEvents)}
          style={{ marginTop: "10px", padding: "8px 12px", borderRadius: "5px", border: "none", background: "#007acc", color: "white", cursor: "pointer" }}
        >
          {showAllEvents ? "Collapse Events" : "Show All Events"}
        </button>
      </div>
    </div>
  );
}

export default App;