"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { argentinaProvinces } from "../../lib/constants";
import { mapsUrl } from "../../lib/utils";

const GEO_URL = "/argentina-provinces.json";

// name del GeoJSON (Natural Earth) → nombre interno sin acentos (constants.js)
const GEO_TO_INTERNAL = {
  "Buenos Aires": "Buenos Aires",
  Catamarca: "Catamarca",
  Chaco: "Chaco",
  Chubut: "Chubut",
  "Córdoba": "Cordoba",
  Corrientes: "Corrientes",
  "Entre Ríos": "Entre Rios",
  Formosa: "Formosa",
  Jujuy: "Jujuy",
  "La Pampa": "La Pampa",
  "La Rioja": "La Rioja",
  Mendoza: "Mendoza",
  Misiones: "Misiones",
  "Neuquén": "Neuquen",
  "Río Negro": "Rio Negro",
  Salta: "Salta",
  "San Juan": "San Juan",
  "San Luis": "San Luis",
  "Santa Cruz": "Santa Cruz",
  "Santa Fe": "Santa Fe",
  "Santiago del Estero": "Santiago del Estero",
  "Tierra del Fuego": "Tierra del Fuego",
  "Tucumán": "Tucuman",
  "Ciudad de Buenos Aires": "CABA",
};

function getGeoName(properties) {
  return properties.name || properties.NAME_1 || "";
}

export default function MapView({ goToProfessional, professionals }) {
  const [selectedProvince, setSelectedProvince] = useState("Todas");

  const publicProfessionals = professionals.filter((p) => p.active);
  const activeProvinces = new Set(publicProfessionals.map((p) => p.province));
  const visibleProfessionals =
    selectedProvince === "Todas"
      ? publicProfessionals
      : publicProfessionals.filter((p) => p.province === selectedProvince);

  function handleGeoClick(properties) {
    const geoName = getGeoName(properties);
    const internal = GEO_TO_INTERNAL[geoName] || geoName;
    setSelectedProvince((cur) => (cur === internal ? "Todas" : internal));
  }

  function handleChipClick(province) {
    setSelectedProvince((cur) => (cur === province ? "Todas" : province));
  }

  return (
    <main className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">Mapa interactivo</p>
          <h2>Profesionales por provincia en Argentina</h2>
          <p>Seleccioná una provincia para filtrar los profesionales disponibles.</p>
        </div>
      </div>

      <section className="map-shell">
        <div className="map-visual">
          <div className="argentina-title">
            <strong>República Argentina</strong>
            <span>
              {selectedProvince === "Todas"
                ? "Tocá una provincia para filtrar"
                : `${selectedProvince} · ${visibleProfessionals.length} profesional${visibleProfessionals.length !== 1 ? "es" : ""}`}
            </span>
          </div>

          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 1100, center: [-65, -38] }}
            viewBox="0 0 500 900"
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const geoName = getGeoName(geo.properties);
                  const internal = GEO_TO_INTERNAL[geoName] || geoName;
                  const isSelected = selectedProvince === internal;
                  const hasProf = activeProvinces.has(internal);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isSelected ? "#d74c5d" : hasProf ? "#b8d4da" : "#cdd8db"}
                      stroke="#ffffff"
                      strokeWidth={0.8}
                      style={{
                        default: { outline: "none" },
                        hover: {
                          fill: isSelected ? "#c03a4e" : "#a8c4ca",
                          outline: "none",
                          cursor: "pointer",
                        },
                        pressed: { outline: "none" },
                      }}
                      onClick={() => handleGeoClick(geo.properties)}
                    />
                  );
                })
              }
            </Geographies>

            {visibleProfessionals.map((professional) => (
              <Marker
                key={professional.id}
                coordinates={professional.coords}
                onClick={() => goToProfessional(professional)}
                style={{ cursor: "pointer" }}
              >
                <circle
                  r={10}
                  fill="#d74c5d"
                  stroke="white"
                  strokeWidth={2}
                  style={{ cursor: "pointer" }}
                />
                <text
                  textAnchor="middle"
                  y={4}
                  fill="white"
                  fontSize={8}
                  fontWeight="bold"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {professional.initials.slice(0, 1)}
                </text>
              </Marker>
            ))}
          </ComposableMap>

          <div className="province-grid-panel" aria-label="Provincias de Argentina">
            <button
              className={selectedProvince === "Todas" ? "province-chip active" : "province-chip"}
              onClick={() => setSelectedProvince("Todas")}
            >
              Todas
            </button>
            {argentinaProvinces.map((province) => (
              <button
                key={province}
                className={[
                  "province-chip",
                  activeProvinces.has(province) ? "has-professional" : "",
                  selectedProvince === province ? "active" : "",
                ].join(" ")}
                onClick={() => handleChipClick(province)}
              >
                {province}
              </button>
            ))}
          </div>
        </div>

        <div className="map-list">
          {visibleProfessionals.map((professional) => (
            <article key={professional.id}>
              <h3>{professional.name}</h3>
              <p className="muted">{professional.address}</p>
              <div className="actions">
                <button
                  className="primary-btn"
                  onClick={() => goToProfessional(professional)}
                >
                  Reservar
                </button>
                <a
                  className="ghost-btn"
                  href={mapsUrl(professional)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Cómo llegar
                </a>
              </div>
            </article>
          ))}
          {visibleProfessionals.length === 0 && (
            <div className="empty">
              {selectedProvince === "Todas"
                ? "No hay profesionales activos."
                : `Todavía no hay profesionales en ${selectedProvince}.`}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
