import "./SidePanel.css";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function SidePanel({ data }) {
  const high = data.filter((w) => w.level === "HIGH").length;
  const medium = data.filter((w) => w.level === "MEDIUM").length;
  const low = data.filter((w) => w.level === "LOW").length;

  const rainfall = data[0]?.rainfall || 0;

  const chartData = [
    { name: "High", value: high },
    { name: "Medium", value: medium },
    { name: "Low", value: low },
  ];

  const COLORS = ["#dc2626", "#f59e0b", "#16a34a"];

  return (
    <div className="side-panel">
      <h2 className="panel-title">Risk Insights</h2>

      {/* 🔷 PIE CHART */}
      <div className="chart-section">
        <h4>Risk Distribution</h4>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={50}
                outerRadius={70}
              >
                {chartData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 🔷 LEGEND */}
        <div className="legend">
          <div className="legend-item">
            <span className="dot red"></span>
            High Risk ({high})
          </div>
          <div className="legend-item">
            <span className="dot yellow"></span>
            Medium Risk ({medium})
          </div>
          <div className="legend-item">
            <span className="dot green"></span>
            Low Risk ({low})
          </div>
        </div>
      </div>

      {/* 🔷 RAINFALL */}
      <div className="panel-section">
        <h4>Current Rainfall</h4>
        <p className="rainfall">{rainfall} mm</p>
      </div>

      {/* 🔷 INSIGHTS */}
      
    </div>
  );
}