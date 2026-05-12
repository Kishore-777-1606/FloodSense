import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  BarChart2,
  Shield,
  Bell,
  FileText,
  Info,
  ArrowLeft,
  CloudRain,
  Clock,
  MapPin,
  Mountain,
  Waves,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import WardMiniMap from "../components/WardMiniMap";
import "../styles/Analysis.css";

const NAV_ITEMS = [
  { label: "Dashboard", icon: Home, path: "/dashboard" },
  { label: "Analysis", icon: BarChart2, path: "/analysis" },
  { label: "Decision Support", icon: Shield, path: "/decision" },
  { label: "About", icon: Info, path: "/about" },
];

function getRiskColor(level) {
  if (!level) return "#64748b";
  const l = level.toUpperCase();
  if (l === "HIGH") return "#ef4444";
  if (l === "VERY HIGH") return "#b91c1c";
  if (l === "MEDIUM") return "#f97316";
  return "#22c55e";
}

function getBarColor(score) {
  if (score >= 80) return "#ef4444";
  if (score >= 60) return "#f97316";
  if (score >= 40) return "#eab308";
  return "#22c55e";
}

function getBarLabel(score) {
  if (score >= 80) return "Very High";
  if (score >= 60) return "High";
  if (score >= 40) return "Medium";
  return "Low";
}

function getRainfallImpact(rainfall) {
  return Math.min(100, Math.round((rainfall / 300) * 100));
}

function getElevationImpact(elevation) {
  if (elevation <= 1) return 95;
  if (elevation <= 3) return 80;
  if (elevation <= 6) return 60;
  if (elevation <= 10) return 40;
  return 20;
}

function getProximityImpact(distance) {
  if (distance <= 0.2) return 90;
  if (distance <= 0.5) return 75;
  if (distance <= 1) return 55;
  if (distance <= 2) return 35;
  return 20;
}

function getComparisonPercent(score) {
  return Math.min(99, Math.round((score / 200) * 100) + 20);
}

function formatTimestamp() {
  const now = new Date();
  return now.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export default function Analysis() {
  const navigate = useNavigate();
  const [ward, setWard] = useState(null);
  const [timestamp] = useState(formatTimestamp());

  useEffect(() => {
    try {
      const stored = localStorage.getItem("selectedWard");
      if (stored) setWard(JSON.parse(stored));
    } catch {
      // ignore parse errors
    }
  }, []);

  if (!ward) {
    return (
      <div className="analysis-layout">
        <Sidebar navigate={navigate} />
        <div className="analysis-main">
          <div className="analysis-no-ward">
            <AlertTriangle size={48} />
            <p>No ward selected. Please go back to the Dashboard and select a ward.</p>
            <button className="btn-back" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const rainfallImpact = getRainfallImpact(ward.rainfall);
  const elevationImpact = getElevationImpact(ward.elevation);
  const proximityImpact = getProximityImpact(ward.water_distance);
  const comparisonPct = getComparisonPercent(ward.score);
  const riskColor = getRiskColor(ward.level);

  return (
    <div className="analysis-layout">
      <Sidebar navigate={navigate} />

      <div className="analysis-main">
        {/* Top Header */}
        <div className="analysis-header">
          <div className="analysis-header-left">
            <button className="btn-back" onClick={() => navigate("/dashboard")}>
              <ArrowLeft size={15} />
              Back to Dashboard
            </button>
            <div className="analysis-title-block">
              <h1 className="analysis-title">Ward Analysis</h1>
              <p className="analysis-subtitle">Detailed flood risk analysis for the selected ward</p>
            </div>
          </div>
          <div className="analysis-header-cards">
            <div className="header-info-card">
              <div className="header-info-icon rainfall-icon-bg">
                <CloudRain size={22} />
              </div>
              <div>
                <p className="header-info-label">Rainfall Input</p>
                <p className="header-info-value">{ward.rainfall} <span>mm</span></p>
                <p className="header-info-sub">{timestamp}</p>
              </div>
            </div>
            <div className="header-info-card">
              <div className="header-info-icon clock-icon-bg">
                <Clock size={22} />
              </div>
              <div>
                <p className="header-info-label">Analysis Time</p>
                <p className="header-info-sub header-time">{timestamp}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 1: Ward Overview + Map */}
        <div className="analysis-row analysis-row-top">
          {/* Ward Overview */}
          <div className="glass-card ward-overview-card">
            <p className="card-section-label">Selected Ward</p>
            <div className="ward-overview-header">
              <div className="ward-name-block">
                <MapPin size={20} className="ward-pin-icon" />
                <div>
                  <h2 className="ward-name">{ward.ward_name}</h2>
                  <p className="ward-id">Ward ID: W-{ward.ward_no}</p>
                </div>
              </div>
              <span
                className="risk-badge"
                style={{ backgroundColor: riskColor }}
              >
                {ward.level} RISK
              </span>
            </div>

            <div className="risk-score-block">
                <p className="risk-score-label">Risk Score</p>

                <p
                  className="risk-score-value"
                  style={{ color: riskColor }}
                >
                  {Math.round(ward.score)}

                  <span className="risk-score-max">
                    / 200
                  </span>
                </p>
              </div>

            <div className="ward-details-list">
              <DetailRow icon={<CloudRain size={18} />} label="Rainfall Input" value={`${ward.rainfall} mm`} />
              <DetailRow icon={<Mountain size={18} />} label="Elevation" value={`${ward.elevation} m`} />
              <DetailRow icon={<Waves size={18} />} label="Distance to Water Bodies" value={`${ward.water_distance} km`} />
              <DetailRow icon={<Clock size={18} />} label="Analysis Time" value={timestamp} />
            </div>
          </div>

          {/* Map */}
          <div className="glass-card ward-map-card">
            <p className="card-section-label">Ward Location</p>
            <div className="ward-map-container">
              <WardMiniMap wardNo={ward.ward_no} wardName={ward.ward_name} />
            </div>
          </div>
        </div>

        {/* Row 2: Risk Breakdown + Risk Summary */}
        <div className="analysis-row analysis-row-mid">
          {/* Risk Factor Breakdown */}
          <div className="glass-card risk-breakdown-card">
            <p className="card-section-label">Risk Factor Breakdown</p>

            <RiskBar
              icon={<CloudRain size={20} />}
              iconBg="rain-icon-bg"
              title="Rainfall Intensity Impact"
              desc="Higher rainfall increases flood risk"
              score={rainfallImpact}
            />
            <RiskBar
              icon={<Mountain size={20} />}
              iconBg="elev-icon-bg"
              title="Low Elevation Impact"
              desc="Lower elevation areas are more prone to flooding"
              score={elevationImpact}
            />
            <RiskBar
              icon={<Waves size={20} />}
              iconBg="water-icon-bg"
              title="Proximity to Water Bodies"
              desc="Closer distance to water bodies increases risk"
              score={proximityImpact}
            />
          </div>

          {/* Risk Summary */}
          <div className="glass-card risk-summary-card">
            <p className="card-section-label">Risk Summary</p>

            <div className="risk-summary-main">
              <div className="risk-summary-icon-wrap" style={{ backgroundColor: riskColor + "22", borderColor: riskColor + "44" }}>
                <Shield size={20} style={{ color: riskColor }} />
              </div>
              <div>
                <p className="risk-summary-title">
                  <strong>{ward.ward_name}</strong> is at{" "}
                  <span style={{ color: riskColor, fontWeight: 700 }}>{ward.level}</span> risk of flooding.
                </p>
                <p className="risk-summary-body">
                  {ward.reason
                    ? ward.reason + `. Combined with the current rainfall of ${ward.rainfall} mm, this results in a high probability of flooding.`
                    : `The ward has conditions that significantly increase flood probability with current rainfall of ${ward.rainfall} mm.`}
                </p>
              </div>
            </div>

            <div className="risk-comparison-card">
              <div className="risk-comparison-icon">
                <Info size={18} />
              </div>
              <div>
                <p className="risk-comparison-label">This ward is riskier than</p>
                <p className="risk-comparison-pct">{comparisonPct}%</p>
                <p className="risk-comparison-sub">of all wards in Chennai</p>
              </div>
            </div>
          </div>
        </div>

        {/* Row 3: Key Insights + Next Step */}
        <div className="analysis-row analysis-row-bottom">
          {/* Key Insights */}
          <div className="glass-card key-insights-card">
            <p className="card-section-label">Key Insights</p>
            <div className="insights-grid">
              <InsightCard
                icon={<CloudRain size={22} />}
                iconBg="rain-icon-bg"
                text={`Heavy rainfall increases surface water accumulation.`}
              />
              <InsightCard
                icon={<Mountain size={22} />}
                iconBg="elev-icon-bg"
                text={`Very low elevation makes the area highly vulnerable.`}
              />
              <InsightCard
                icon={<Waves size={22} />}
                iconBg="water-icon-bg"
                text={`Extreme proximity to water bodies increases overflow risk.`}
              />
            </div>
          </div>

          {/* Next Step */}
          <div className="glass-card next-step-card">
            <div className="next-step-inner">
              <div className="next-step-icon-wrap">
                <ChevronRight size={28} />
              </div>
              <div>
                <p className="next-step-title">Next Step</p>
                <p className="next-step-sub">View recommended actions for this ward.</p>
              </div>
            </div>
            <button
              className="btn-action"
              onClick={() => navigate("/decision")}
            >
              View Recommended Actions <ArrowLeft size={16} className="btn-arrow" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ navigate }) {
  const current = window.location.pathname;

  return (
    <aside className="analysis-sidebar">
      <div className="sidebar-brand" onClick={() => navigate("/dashboard")}>
        <div className="sidebar-logo">
          <Home size={20} />
        </div>
        <span className="sidebar-brand-name">FloodSense</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map(({ label, icon: Icon, path }) => (
          <button
            key={path}
            className={`sidebar-nav-item${current === path ? " active" : ""}`}
            onClick={() => navigate(path)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer-card">
        <div className="sidebar-footer-illustration">
          <CloudRain size={32} />
        </div>
        <p className="sidebar-footer-tagline">Smart insights.</p>
        <p className="sidebar-footer-tagline">Safer communities.</p>
        <p className="sidebar-footer-sub">Data-driven decisions for flood resilience.</p>
      </div>
    </aside>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-icon">{icon}</span>
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value}</span>
    </div>
  );
}

function RiskBar({
  icon,
  iconBg,
  title,
  desc,
  score,
}) {

  const color = getBarColor(score);

  const label = getBarLabel(score);

  return (
    <div className="risk-bar-item">

      <div className="risk-bar-header">

        <div className={`risk-bar-icon ${iconBg}`}>
          {icon}
        </div>

        <div className="risk-bar-info">

          <p className="risk-bar-title">
            {title}
          </p>

          <p className="risk-bar-desc">
            {desc}
          </p>

        </div>

        <div className="risk-bar-score-wrap">

          <span
            className="risk-bar-score"
            style={{ color }}
          >
            {Math.round(score)}
          </span>

          <span className="risk-bar-max">
            /100
          </span>

        </div>

        <span
          className="risk-bar-badge"
          style={{
            color,
            borderColor: color,
          }}
        >
          {label}
        </span>

      </div>

      <div className="risk-bar-track">

        <div
          className="risk-bar-fill"
          style={{
            width: `${score}%`,
            backgroundColor: color,
          }}
        />

      </div>

    </div>
  );
}

function InsightCard({ icon, iconBg, text }) {
  return (
    <div className="insight-card">
      <div className={`insight-icon ${iconBg}`}>{icon}</div>
      <p className="insight-text">{text}</p>
    </div>
  );
}
