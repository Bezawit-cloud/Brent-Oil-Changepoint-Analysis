import React from "react";
import ChangePointCard from "./src/components/ChangePointCard";
import PriceChart from "./src/components/PriceChart";
import EventTable from "./src/components/EventTable";

function App() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h1>Brent Oil Price Insights Dashboard</h1>
      <ChangePointCard />
      <PriceChart />
      <EventTable />
    </div>
  );
}

export default App;