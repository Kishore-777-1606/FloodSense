import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">

      {/* LEFT */}
      <div className="footer-section">
        <h3>Team Information</h3>

        <p>Flood Risk Dashboard System</p>

        <p>Frontend Development Team</p>

        <p>Built using React + Leaflet</p>
      </div>

      {/* RIGHT */}
      <div className="footer-section">
        <h3>About This Project</h3>

        <p>
          This dashboard visualizes flood-prone wards
          across Chennai using rainfall-based risk
          analysis and geospatial mapping.
        </p>

        <p>
          The system helps identify high-risk regions
          and supports emergency planning decisions.
        </p>
      </div>

    </footer>
  );
}