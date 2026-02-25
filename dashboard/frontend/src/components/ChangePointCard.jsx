import React, { useEffect, useState } from "react";
import { getChangePoint } from "../api";

const ChangePointCard = () => {
  const [changePoint, setChangePoint] = useState(null);

  useEffect(() => {
    getChangePoint().then(res => setChangePoint(res.data));
  }, []);

  if (!changePoint) return <p>Loading change point...</p>;

  return (
    <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
      <h2>Change Point Analysis</h2>
      <p><strong>Date of Change:</strong> {changePoint.change_point_date}</p>
      <p><strong>Average Price Before:</strong> ${changePoint.mean_before.toFixed(2)}</p>
      <p><strong>Average Price After:</strong> ${changePoint.mean_after.toFixed(2)}</p>
      <p><strong>Percent Change:</strong> {changePoint.percent_change.toFixed(2)}%</p>
      <p><strong>Volatility:</strong> {changePoint.volatility.toFixed(2)}</p>
    </div>
  );
};

export default ChangePointCard;