import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Home,
  BarChart2,
  Shield,
  Info,
  AlertTriangle,
  Cloud,
  Clock,
  MapPin,
  ChevronRight,
  ArrowLeft,
  Download,
  Droplets,
  Users,
  Truck,
  Anchor,
  Bell,
  Zap,
  Layers,
  Package,
  HelpCircle,
} from "lucide-react";

import "../styles/Decision.css";

const RECOMMENDED_ACTIONS = [
  {
    id: 1,
    icon: <Zap size={22} />,
    title: "Immediate Actions",
    color: "red",
    actions: [
      "Deploy emergency response teams",
      "Set up mobile pumps in critical spots",
      "Ensure availability of rescue equipment",
    ],
  },
  {
    id: 2,
    icon: <Bell size={22} />,
    title: "Alert & Communication",
    color: "orange",
    actions: [
      "Issue flood alerts to all high-risk wards",
      "Notify local authorities & residents",
      "Use SMS and public announcement systems",
    ],
  },
  {
    id: 3,
    icon: <Layers size={22} />,
    title: "Preventive & Mitigation",
    color: "blue",
    actions: [
      "Clear stormwater drains & blockages",
      "Check & strengthen temporary barriers",
      "Monitor water levels continuously",
    ],
  },
  {
    id: 4,
    icon: <Package size={22} />,
    title: "Resource Mobilization",
    color: "green",
    actions: [
      "Deploy additional pumps & staff",
      "Coordinate with NDRF / SDRF if needed",
      "Ensure medical & relief supplies ready",
    ],
  },
];

export default function Decision() {

  const navigate = useNavigate();

  const [ward, setWard] = useState(null);

  // 🔥 REAL DATA
  const allWards = JSON.parse(
    localStorage.getItem("riskData")
  ) || [];

  // 🔥 REAL COUNTS
  const totalWards = allWards.length;

  const highRisk = allWards.filter(
    (w) => w.level === "HIGH"
  );

  const mediumRisk = allWards.filter(
    (w) => w.level === "MEDIUM"
  );

  const lowRisk = allWards.filter(
    (w) => w.level === "LOW"
  );

  // 🔥 TOP HIGH RISK WARDS
  const topHighRisk = [...highRisk]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  useEffect(() => {
    const stored = localStorage.getItem("selectedWard");

    if (stored) {
      setWard(JSON.parse(stored));
    }
  }, []);

  const now = new Date();

  const formattedDate = now.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );

  const formattedTime = now
    .toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    .toUpperCase();

  const rainfall = ward?.rainfall ?? 0;

  return (
    <div className="decision-layout">

      {/* SIDEBAR */}
      <aside className="decision-sidebar">

        <div className="decision-sidebar-brand">
          <div className="decision-brand-icon">
            <Droplets size={20} />
          </div>

          <span className="decision-brand-name">
            FloodSense
          </span>
        </div>

        <nav className="decision-sidebar-nav">

          <button
            className="decision-nav-item"
            onClick={() => navigate("/")}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className="decision-nav-item"
            onClick={() => navigate("/analysis")}
          >
            <BarChart2 size={18} />
            <span>Analysis</span>
          </button>

          <button className="decision-nav-item decision-nav-active">
            <Shield size={18} />
            <span>Decision Support</span>
          </button>

          <button className="decision-nav-item">
            <Info size={18} />
            <span>About</span>
          </button>

        </nav>

        <div className="decision-sidebar-emergency">

          <div className="decision-emergency-icon">
            <Bell size={16} />
          </div>

          <p className="decision-emergency-title">
            Stay Prepared, Stay Safe.
          </p>

          <p className="decision-emergency-text">
            Timely decisions save lives and reduce impact.
          </p>

        </div>

      </aside>

      {/* MAIN */}
      <main className="decision-main">

        {/* HEADER */}
        <div className="decision-header">

          <div className="decision-header-left">
            <h1 className="decision-title">
              Decision Support
            </h1>

            <p className="decision-subtitle">
              Prioritized actions for high-risk flood situations
            </p>
          </div>

          <div className="decision-header-cards">

            <div className="decision-info-card">
              <div className="decision-info-icon decision-info-icon--blue">
                <Cloud size={20} />
              </div>

              <div className="decision-info-text">
                <span className="decision-info-label">
                  Rainfall Input
                </span>

                <span className="decision-info-value">
                  {rainfall}
                  <span className="decision-info-unit">
                    mm
                  </span>
                </span>

                <span className="decision-info-sub">
                  {formattedDate}, {formattedTime}
                </span>
              </div>
            </div>

            <div className="decision-info-card">
              <div className="decision-info-icon decision-info-icon--teal">
                <Clock size={20} />
              </div>

              <div className="decision-info-text">
                <span className="decision-info-label">
                  Analysis Time
                </span>

                <span className="decision-info-value decision-info-value--sm">
                  {formattedDate}, {formattedTime}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* KPI ROW */}
        <div className="decision-kpi-row">

          {/* HIGH */}
          <div className="decision-kpi-card decision-kpi-card--red">

            <div className="decision-kpi-icon-wrap decision-kpi-icon-wrap--red">
              <AlertTriangle size={22} />
            </div>

            <div className="decision-kpi-body">

              <span className="decision-kpi-label">
                High Risk Wards
              </span>

              <div className="decision-kpi-count">
                <span className="decision-kpi-num decision-kpi-num--red">
                  {highRisk.length}
                </span>

                <span className="decision-kpi-denom">
                  / {totalWards}
                </span>
              </div>

              <span className="decision-kpi-sub">
                Require Immediate Attention
              </span>

            </div>
          </div>

          {/* MEDIUM */}
          <div className="decision-kpi-card decision-kpi-card--orange">

            <div className="decision-kpi-icon-wrap decision-kpi-icon-wrap--orange">
              <AlertTriangle size={22} />
            </div>

            <div className="decision-kpi-body">

              <span className="decision-kpi-label">
                Medium Risk Wards
              </span>

              <div className="decision-kpi-count">
                <span className="decision-kpi-num decision-kpi-num--orange">
                  {mediumRisk.length}
                </span>

                <span className="decision-kpi-denom">
                  / {totalWards}
                </span>
              </div>

              <span className="decision-kpi-sub">
                Monitor & Be Prepared
              </span>

            </div>
          </div>

          {/* LOW */}
          <div className="decision-kpi-card decision-kpi-card--green">

            <div className="decision-kpi-icon-wrap decision-kpi-icon-wrap--green">
              <Shield size={22} />
            </div>

            <div className="decision-kpi-body">

              <span className="decision-kpi-label">
                Low Risk Wards
              </span>

              <div className="decision-kpi-count">
                <span className="decision-kpi-num decision-kpi-num--green">
                  {lowRisk.length}
                </span>

                <span className="decision-kpi-denom">
                  / {totalWards}
                </span>
              </div>

              <span className="decision-kpi-sub">
                No Immediate Action
              </span>

            </div>
          </div>

          {/* TOTAL */}
          <div className="decision-kpi-card decision-kpi-card--blue">

            <div className="decision-kpi-icon-wrap decision-kpi-icon-wrap--blue">
              <Users size={22} />
            </div>

            <div className="decision-kpi-body">

              <span className="decision-kpi-label">
                Total Wards
              </span>

              <div className="decision-kpi-count">
                <span className="decision-kpi-num decision-kpi-num--blue">
                  {totalWards}
                </span>
              </div>

              <span className="decision-kpi-sub">
                Backend Prediction Results
              </span>

            </div>
          </div>

        </div>

        {/* LOWER GRID */}
        <div className="decision-lower-grid">

          {/* LEFT */}
          <div className="decision-left-col">

            {/* TABLE */}
            <div className="decision-table-card">

              <div className="decision-table-header">

                <div className="decision-table-title-wrap">
                  <AlertTriangle size={18} className="decision-table-title-icon" />

                  <span className="decision-table-title">
                    HIGH RISK WARDS – PRIORITY LIST
                  </span>
                </div>

              </div>

              <div className="decision-table-wrapper">

                <table className="decision-table">

                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Ward</th>
                      <th>Risk Score</th>
                      <th>Key Reason</th>
                      <th>Priority</th>
                    </tr>
                  </thead>

                  <tbody>

                    {topHighRisk.map((w, index) => (

                      <tr key={w.ward_no}>

                        <td className="decision-td-num">
                          {index + 1}
                        </td>

                        <td>

                          <div className="decision-ward-cell">

                            <MapPin
                              size={14}
                              className="decision-ward-pin"
                            />

                            <div>

                              <div className="decision-ward-name">
                                {w.ward_name}
                              </div>

                              <div className="decision-ward-id">
                                Ward ID: {w.ward_no}
                              </div>

                            </div>

                          </div>

                        </td>

                        <td>

                          <span className="decision-score">

                            <span className="decision-score-num">
                              {Math.round(w.score)}
                            </span>

                            <span className="decision-score-denom">
                              / 200
                            </span>

                          </span>

                        </td>

                        <td className="decision-reason-cell">
                          {w.reason}
                        </td>

                        <td>

                          <span
                            className={`decision-priority-badge ${
                              w.score > 150
                                ? "decision-priority-badge--critical"
                                : "decision-priority-badge--high"
                            }`}
                          >
                            {w.score > 150
                              ? "CRITICAL"
                              : "HIGH"}
                          </span>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

              <div className="decision-table-warning">

                <AlertTriangle
                  size={15}
                  className="decision-warning-icon"
                />

                <span>
                  These wards are at high risk of flooding based on current rainfall and geographic factors.
                </span>

              </div>

            </div>

            {/* ACTION ROW */}
            <div className="decision-action-row">

              <button
                className="decision-btn-back"
                onClick={() => navigate("/analysis")}
              >
                <ArrowLeft size={16} />
                Back to Analysis
              </button>

              <p className="decision-action-warning">
                <AlertTriangle size={15} />
                Timely action and coordination can significantly reduce flood impact and ensure public safety.
              </p>

              <button className="decision-btn-download">
                <Download size={16} />
                Download Action Plan (PDF)
              </button>

            </div>

          </div>

          {/* RIGHT */}
          <div className="decision-right-col">

            {/* ACTIONS */}
            <div className="decision-actions-card">

              <div className="decision-actions-header">

                <div className="decision-actions-title-icon">
                  <Shield size={16} />
                </div>

                <span className="decision-actions-title">
                  RECOMMENDED ACTIONS
                </span>

              </div>

              <div className="decision-actions-list">

                {RECOMMENDED_ACTIONS.map((action) => (

                  <div
                    key={action.id}
                    className={`decision-action-item decision-action-item--${action.color}`}
                  >

                    <div
                      className={`decision-action-icon decision-action-icon--${action.color}`}
                    >
                      {action.icon}
                    </div>

                    <div className="decision-action-body">

                      <div className="decision-action-name">
                        {action.title}
                      </div>

                      <ul className="decision-action-bullets">

                        {action.actions.map((a, i) => (
                          <li key={i}>{a}</li>
                        ))}

                      </ul>

                    </div>

                    <ChevronRight
                      size={18}
                      className="decision-action-arrow"
                    />

                  </div>

                ))}

              </div>

            </div>

            {/* RESOURCE SUMMARY */}
            <div className="decision-resource-card">

              <h3 className="decision-resource-title">
                RESOURCE SUMMARY
              </h3>

              <div className="decision-resource-grid">

                <div className="decision-resource-item">
                  <div className="decision-resource-icon decision-resource-icon--blue">
                    <Truck size={18} />
                  </div>

                  <div className="decision-resource-body">
                    <span className="decision-resource-count">
                      {Math.max(1, highRisk.length)}
                    </span>

                    <span className="decision-resource-label">
                      Pumps Needed
                    </span>

                    <span className="decision-resource-unit">
                      Units
                    </span>
                  </div>
                </div>

                <div className="decision-resource-item">
                  <div className="decision-resource-icon decision-resource-icon--orange">
                    <Users size={18} />
                  </div>

                  <div className="decision-resource-body">
                    <span className="decision-resource-count">
                      {Math.max(1, Math.ceil(highRisk.length / 2))}
                    </span>

                    <span className="decision-resource-label">
                      Teams Needed
                    </span>

                    <span className="decision-resource-unit">
                      Teams
                    </span>
                  </div>
                </div>

                <div className="decision-resource-item">
                  <div className="decision-resource-icon decision-resource-icon--teal">
                    <Anchor size={18} />
                  </div>

                  <div className="decision-resource-body">
                    <span className="decision-resource-count">
                      {Math.max(1, mediumRisk.length)}
                    </span>

                    <span className="decision-resource-label">
                      Rescue Boats
                    </span>

                    <span className="decision-resource-unit">
                      Units
                    </span>
                  </div>
                </div>

                <div className="decision-resource-item">
                  <div className="decision-resource-icon decision-resource-icon--green">
                    <Users size={18} />
                  </div>

                  <div className="decision-resource-body">
                    <span className="decision-resource-count">
                      {totalWards * 5}+
                    </span>

                    <span className="decision-resource-label">
                      Volunteers
                    </span>

                    <span className="decision-resource-unit">
                      People
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}