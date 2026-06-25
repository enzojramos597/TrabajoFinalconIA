"use client";

import { useState } from "react";
import { argentinaProvinces } from "../../lib/constants";
import { mapsUrl } from "../../lib/utils";

export default function MapView({ goToProfessional, professionals }) {
  const [selectedProvince, setSelectedProvince] = useState("Todas");
  const publicProfessionals = professionals.filter((professional) => professional.active);
  const activeProvinces = new Set(publicProfessionals.map((professional) => professional.province));
  const visibleProfessionals = selectedProvince === "Todas"
    ? publicProfessionals
    : publicProfessionals.filter((professional) => professional.province === selectedProvince);

  return (
    <main className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">Mapa interactivo</p>
          <h2>Profesionales por provincia en Argentina</h2>
          <p>Vista nacional con provincias disponibles, pines de profesionales y accesos a Google Maps para iniciar la navegacion.</p>
        </div>
      </div>
      <section className="map-shell">
        <div className="map-visual">
          <iframe
            className="argentina-iframe"
            title="Mapa de Argentina"
            src="https://www.google.com/maps?q=Argentina&z=4&output=embed"
            loading="lazy"
          />
          <div className="map-overlay">
            <div className="argentina-title">
              <strong>República Argentina</strong>
              <span>Seleccion por provincia</span>
            </div>
            <div className="province-grid" aria-label="Provincias de Argentina">
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
                  onClick={() => setSelectedProvince(province)}
                >
                  {province}
                </button>
              ))}
            </div>
          </div>
          {visibleProfessionals.map((professional) => (
            <button
              key={professional.id}
              className="pin"
              style={{ top: professional.coords.top, left: professional.coords.left }}
              onClick={() => goToProfessional(professional)}
              title={professional.name}
            >
              {professional.initials.slice(0, 1)}
            </button>
          ))}
        </div>
        <div className="map-list">
          {visibleProfessionals.map((professional) => (
            <article key={professional.id}>
              <h3>{professional.name}</h3>
              <p className="muted">{professional.address}</p>
              <div className="actions">
                <button className="primary-btn" onClick={() => goToProfessional(professional)}>Reservar</button>
                <a className="ghost-btn" href={mapsUrl(professional)} target="_blank">Como llegar</a>
              </div>
            </article>
          ))}
          {visibleProfessionals.length === 0 && (
            <div className="empty">Todavia no hay profesionales cargados en esta provincia.</div>
          )}
        </div>
      </section>
    </main>
  );
}
