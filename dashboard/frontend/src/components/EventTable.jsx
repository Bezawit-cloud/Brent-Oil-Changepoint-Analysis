import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { getPrices } from "../api";

const PriceChart = () => {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    getPrices().then(res => {
      const formatted = res.data.map(d => ({ date: d.Date, price: d.Price }));
      setPrices(formatted);
    });
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={prices}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis domain={["auto", "auto"]} />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#007bff" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default PriceChart;