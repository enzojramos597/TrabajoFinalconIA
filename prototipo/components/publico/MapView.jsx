"use client";

import { useState } from "react";
import { argentinaProvinces } from "../../lib/constants";
import { mapsUrl } from "../../lib/utils";

const provinceMapAreas = {
  Jujuy: {
    label: { top: "4%", left: "40%" },
    region: { top: "0.8%", left: "30%", width: "19%", height: "9%", clipPath: "polygon(42% 0%, 100% 10%, 85% 100%, 0% 88%, 8% 22%)" },
  },
  Salta: {
    label: { top: "9%", left: "37%" },
    region: { top: "6.5%", left: "20%", width: "33%", height: "16%", clipPath: "polygon(18% 0%, 100% 8%, 78% 100%, 0% 88%, 4% 26%)" },
  },
  Formosa: {
    label: { top: "8%", left: "69%" },
    region: { top: "5%", left: "53%", width: "22%", height: "13%", clipPath: "polygon(0% 24%, 78% 0%, 100% 30%, 62% 100%, 7% 80%)" },
  },
  Chaco: {
    label: { top: "16%", left: "57%" },
    region: { top: "13%", left: "48%", width: "18%", height: "14%", clipPath: "polygon(10% 0%, 100% 7%, 92% 100%, 0% 89%)" },
  },
  Catamarca: {
    label: { top: "10.5%", left: "11%" },
    region: { top: "11.2%", left: "13%", width: "18%", height: "12%", clipPath: "polygon(25% 0%, 100% 13%, 75% 100%, 0% 84%, 0% 26%)" },
  },
  Tucuman: {
    label: { top: "9.8%", left: "6.8%" },
    region: { top: "13%", left: "28%", width: "9%", height: "8%", clipPath: "polygon(24% 0%, 100% 10%, 87% 100%, 0% 86%, 8% 16%)" },
  },
  "Santiago del Estero": {
    label: { top: "16%", left: "44%" },
    region: { top: "14%", left: "35%", width: "18%", height: "16%", clipPath: "polygon(8% 0%, 100% 4%, 92% 100%, 0% 92%)" },
  },
  Corrientes: {
    label: { top: "22.5%", left: "74%" },
    region: { top: "18%", left: "66%", width: "15%", height: "14%", clipPath: "polygon(14% 0%, 100% 16%, 81% 100%, 0% 84%)" },
  },
  Misiones: {
    label: { top: "8.2%", left: "92%" },
    region: { top: "8%", left: "81%", width: "10%", height: "12%", clipPath: "polygon(18% 0%, 100% 12%, 80% 100%, 0% 86%)" },
  },
  "La Rioja": {
    label: { top: "22.5%", left: "28%" },
    region: { top: "18%", left: "20%", width: "15%", height: "14%", clipPath: "polygon(20% 0%, 100% 10%, 88% 100%, 0% 90%, 5% 16%)" },
  },
  Cordoba: {
    label: { top: "28.5%", left: "42%" },
    region: { top: "24%", left: "34%", width: "18%", height: "14%", clipPath: "polygon(18% 0%, 100% 6%, 92% 100%, 0% 88%)" },
  },
  "Santa Fe": {
    label: { top: "22.5%", left: "56%" },
    region: { top: "22%", left: "52%", width: "12%", height: "16%", clipPath: "polygon(12% 0%, 100% 6%, 90% 100%, 0% 92%)" },
  },
  "Entre Rios": {
    label: { top: "24.8%", left: "66%" },
    region: { top: "25.5%", left: "63%", width: "10%", height: "13%", clipPath: "polygon(22% 0%, 100% 20%, 82% 100%, 0% 88%, 8% 12%)" },
  },
  "San Juan": {
    label: { top: "24.8%", left: "18%" },
    region: { top: "22%", left: "13%", width: "11%", height: "15%", clipPath: "polygon(28% 0%, 100% 12%, 82% 100%, 0% 88%, 6% 22%)" },
  },
  Mendoza: {
    label: { top: "35.5%", left: "22%" },
    region: { top: "30%", left: "13%", width: "16%", height: "17%", clipPath: "polygon(24% 0%, 100% 10%, 92% 100%, 0% 92%, 4% 16%)" },
  },
  "San Luis": {
    label: { top: "33.2%", left: "34%" },
    region: { top: "31.5%", left: "31%", width: "12%", height: "12%", clipPath: "polygon(18% 0%, 100% 8%, 88% 100%, 0% 90%)" },
  },
  "La Pampa": {
    label: { top: "46.5%", left: "27%" },
    region: { top: "42%", left: "19%", width: "26%", height: "14%", clipPath: "polygon(10% 0%, 100% 0%, 90% 100%, 0% 92%)" },
  },
  "Buenos Aires": {
    label: { top: "39%", left: "52%" },
    region: { top: "33.5%", left: "40%", width: "30%", height: "24%", clipPath: "polygon(8% 0%, 88% 2%, 100% 40%, 82% 100%, 24% 86%, 0% 42%)" },
  },
  CABA: {
    label: { top: "46%", left: "59%" },
    region: { top: "45.5%", left: "57%", width: "2.6%", height: "3.2%", clipPath: "circle(48% at 50% 50%)" },
  },
  Neuquen: {
    label: { top: "54%", left: "14%" },
    region: { top: "49%", left: "9%", width: "16%", height: "12%", clipPath: "polygon(8% 12%, 100% 0%, 82% 100%, 0% 92%)" },
  },
  "Rio Negro": {
    label: { top: "63.5%", left: "22%" },
    region: { top: "59%", left: "12%", width: "28%", height: "10%", clipPath: "polygon(5% 8%, 100% 0%, 92% 100%, 0% 88%)" },
  },
  Chubut: {
    label: { top: "79.5%", left: "22%" },
    region: { top: "72%", left: "8%", width: "28%", height: "14%", clipPath: "polygon(12% 0%, 100% 0%, 92% 100%, 0% 92%)" },
  },
  "Santa Cruz": {
    label: { top: "94%", left: "13%" },
    region: { top: "85.5%", left: "0.8%", width: "32%", height: "17%", clipPath: "polygon(20% 0%, 100% 4%, 78% 100%, 0% 90%, 4% 24%)" },
  },
  "Tierra del Fuego": {
    label: { top: "98%", left: "36%" },
    region: { top: "96.2%", left: "21%", width: "15%", height: "6%", clipPath: "polygon(26% 0%, 100% 10%, 74% 100%, 0% 84%)" },
  },
};

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
          <p>Vista nacional propia con seleccion por provincia, resaltado visual y acceso directo a la reserva.</p>
        </div>
      </div>
      <section className="map-shell">
        <div className="map-visual">
          <div className="map-canvas" aria-label="Mapa interactivo de la Argentina">
            <img
              className="argentina-map-image"
              src="/argentina-map-reference.png"
              alt="Mapa de Argentina con division por provincias"
            />
            <div className="map-overlay">
              <div className="argentina-title">
                <strong>Republica Argentina</strong>
                <span>Elegi una provincia para verla destacada en rojo</span>
              </div>
            </div>
            <div className="province-map-layer">
              {argentinaProvinces.map((province) => {
                const area = provinceMapAreas[province];
                if (!area) return null;

                return (
                  <button
                    key={province}
                    type="button"
                    className={[
                      "province-region-button",
                      activeProvinces.has(province) ? "has-professional" : "",
                      selectedProvince === province ? "active" : "",
                    ].join(" ")}
                    style={area.label}
                    onClick={() => setSelectedProvince(province)}
                    title={province}
                  >
                    <span
                      className="province-region-fill"
                      style={area.region}
                      aria-hidden="true"
                    />
                    <span className="province-region-label">{province}</span>
                  </button>
                );
              })}
            </div>
          </div>
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
                onClick={() => setSelectedProvince(province)}
              >
                {province}
              </button>
            ))}
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
