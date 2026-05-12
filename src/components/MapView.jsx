import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
} from "react-leaflet";

import { useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import "./MapView.css";

export default function MapView({ data }) {
  const navigate = useNavigate();

  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    fetch("/wards.geojson")
      .then((res) => res.json())
      .then((json) => setGeoData(json));
  }, []);

  // 🔥 COLORS
  const getColor = (level) => {
    if (level === "HIGH") return "#dc2626";
    if (level === "MEDIUM") return "#f59e0b";
    if (level === "LOW") return "#16a34a";

    return "#dbe4ee";
  };

  // 🔥 STYLE
  const styleFeature = (feature) => {
    const wardNo = feature.properties.Ward_No;

    const wardData = data.find(
      (w) => Number(w.ward_no) === Number(wardNo)
    );

    const level = wardData?.level;

    return {
      fillColor: getColor(level),

      weight: 1,

      color: "#374151",

      fillOpacity: level ? 0.75 : 0.25,
    };
  };

  return (
    <div className="map-wrapper">
      {/* 🔥 LEGEND */}
      <div className="map-legend">
        <h4>Risk Levels</h4>

        <div>
          <span className="legend-color red"></span>
          High
        </div>

        <div>
          <span className="legend-color yellow"></span>
          Medium
        </div>

        <div>
          <span className="legend-color green"></span>
          Low
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={[13.12, 80.23]}
          zoom={10.5}
          minZoom={10}
          maxZoom={16}
          zoomControl={true}
          maxBounds={[
            [12.75, 79.95],
            [13.35, 80.45],
          ]}
          maxBoundsViscosity={1.0}
        >
          {/* BASE MAP */}
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 🔥 WARDS */}
          {geoData && (
            <GeoJSON
              data={geoData}
              style={styleFeature}
              onEachFeature={(feature, layer) => {
                const wardNo = feature.properties.Ward_No;

                const wardData = data.find(
                  (w) =>
                    Number(w.ward_no) === Number(wardNo)
                );

                // 🔥 TOOLTIP
                layer.bindTooltip(
                  `
                    <div class="tooltip-content">
                      <h4>Ward ${wardNo}</h4>

                      <p>
                        Risk:
                        <strong>
                          ${wardData?.level || "UNKNOWN"}
                        </strong>
                      </p>

                      <p>
                        Rainfall:
                        <strong>
                          ${wardData?.rainfall || 0} mm
                        </strong>
                      </p>

                      <p>
                        Score:
                        <strong>
                          ${wardData?.score || "N/A"}
                        </strong>
                      </p>
                    </div>
                  `,
                  {
                    sticky: true,
                    direction: "top",
                    opacity: 1,
                  }
                );

                // 🔥 EVENTS
                layer.on({
                  mouseover: (e) => {
                    e.target.setStyle({
                      weight: 2,
                      fillOpacity: 0.95,
                    });
                  },

                  mouseout: (e) => {
                    e.target.setStyle({
                      weight: 1,
                      fillOpacity: wardData
                        ? 0.75
                        : 0.25,
                    });
                  },

                  click: () => {
                    if (!wardData) return;

                    // 🔥 CLICK FEEDBACK
                    layer.setStyle({
                      weight: 3,
                      color: "#111827",
                      fillOpacity: 1,
                    });

                    // 🔥 STORE
                    localStorage.setItem(
                      "selectedWard",
                      JSON.stringify(wardData)
                    );

                    // 🔥 REDIRECT
                    navigate("/analysis");
                  },
                });
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}