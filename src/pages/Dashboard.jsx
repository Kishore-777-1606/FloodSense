import { useEffect, useState } from "react";

import Header from "../components/Header";
import KpiCards from "../components/KpiCards";
import MapView from "../components/MapView";
import SidePanel from "../components/SidePanel";
import Footer from "../components/Footer";

export default function Dashboard() {

  // 🔥 STATES
  const [data, setData] = useState([]);

  const [rainfall, setRainfall] = useState(0);

  const [loading, setLoading] = useState(true);

  // 🔥 FETCH BACKEND DATA
  useEffect(() => {

    fetch("http://127.0.0.1:5000/get-risk?rainfall=200")

      .then((res) => res.json())

      .then((apiData) => {

        // STORE DATA
        setData(apiData.wards);

        // STORE RAINFALL
        setRainfall(apiData.rainfall);

        // SAVE TO LOCALSTORAGE
        localStorage.setItem(
          "riskData",
          JSON.stringify(apiData.wards)
        );

        setLoading(false);
      })

      .catch((err) => {

        console.error("Backend Fetch Error:", err);

        setLoading(false);
      });

  }, []);

  // 🔥 LOADING SCREEN
  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "20px",
          fontWeight: "600",
        }}
      >
        Loading Dashboard...
      </div>
    );
  }

  // 🔥 KPI CALCULATIONS
  const totalWards = data.length;

  const high = data.filter(
    (w) => w.level === "HIGH"
  ).length;

  const medium = data.filter(
    (w) => w.level === "MEDIUM"
  ).length;

  const low = data.filter(
    (w) => w.level === "LOW"
  ).length;

  return (
    <div>

      {/* HEADER */}
      <Header
        rainfall={rainfall}
        totalWards={totalWards}
        highRiskZones={high}
        lastUpdated={new Date()}
      />

      {/* KPI CARDS */}
      <KpiCards
        high={high}
        medium={medium}
        low={low}
      />

      {/* MAIN SECTION */}
      <div className="dashboard-main">

        <MapView data={data} />

        <SidePanel data={data} />

      </div>

      {/* FOOTER */}
      <Footer />

    </div>
  );
}