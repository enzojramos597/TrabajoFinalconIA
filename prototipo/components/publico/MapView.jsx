"use client";

import { useState } from "react";
import { argentinaProvinces } from "../../lib/constants";
import { mapsUrl } from "../../lib/utils";

// SVG viewBox: "0 0 210 470"
// Provincias dibujadas como polígonos aproximados, no solapados
const PROVINCE_DATA = {
  Jujuy:                 { points: "92,2 116,2 122,20 114,34 94,33 87,17",                                           pin: [104, 18] },
  Salta:                 { points: "34,0 92,0 87,17 94,33 114,34 122,20 116,2 128,2 132,34 120,64 90,72 50,64 30,48 22,30 30,12", pin: [76, 38] },
  Formosa:               { points: "128,2 168,0 178,26 168,55 124,60 132,34",                                        pin: [150, 30] },
  Chaco:                 { points: "132,34 168,50 170,88 148,92 124,88 124,64 132,34",                               pin: [146, 66] },
  Misiones:              { points: "168,50 194,38 196,90 168,88",                                                    pin: [180, 66] },
  Corrientes:            { points: "148,88 168,88 180,102 174,138 145,144 122,133 122,110",                          pin: [150, 114] },
  Tucuman:               { points: "78,62 100,60 102,84 93,94 77,90",                                               pin: [88, 76] },
  Catamarca:             { points: "22,62 78,62 77,90 73,114 30,112 16,90 18,66",                                   pin: [48, 88] },
  "Santiago del Estero": { points: "100,60 124,58 148,63 147,108 123,120 94,117 80,96",                             pin: [116, 88] },
  "Entre Rios":          { points: "122,133 174,138 175,168 154,188 122,178 116,156",                               pin: [144, 158] },
  "La Rioja":            { points: "16,110 73,114 80,135 80,160 58,172 26,166 13,140",                              pin: [48, 140] },
  Cordoba:               { points: "52,120 123,120 147,135 144,185 116,196 78,188 50,168",                          pin: [100, 156] },
  "Santa Fe":            { points: "147,108 168,104 175,138 175,180 144,185 147,136",                               pin: [158, 146] },
  "San Juan":            { points: "10,156 58,172 70,178 64,204 35,210 9,190",                                      pin: [38, 182] },
  Mendoza:               { points: "8,188 64,204 74,194 78,234 68,258 40,267 10,254 5,222",                         pin: [44, 226] },
  "San Luis":            { points: "50,188 116,196 120,228 96,242 50,230 44,206",                                   pin: [82, 212] },
  "La Pampa":            { points: "78,248 148,236 158,248 154,282 124,292 78,284",                                 pin: [116, 264] },
  "Buenos Aires":        { points: "110,196 175,180 198,196 204,222 196,271 174,291 128,294 106,273",               pin: [160, 244] },
  CABA:                  { points: "174,240 183,240 183,252 174,252",                                               pin: [178, 246] },
  Neuquen:               { points: "5,254 40,266 78,284 70,316 30,324 5,296",                                       pin: [40, 290] },
  "Rio Negro":           { points: "5,296 70,314 148,306 158,320 126,326 46,330 5,318",                             pin: [80, 314] },
  Chubut:                { points: "4,328 126,325 158,332 152,378 122,384 42,380 4,366",                            pin: [78, 355] },
  "Santa Cruz":          { points: "3,368 122,382 153,388 142,433 110,440 38,434 3,420",                            pin: [74, 405] },
  "Tierra del Fuego":    { points: "30,436 105,435 98,458 32,458",                                                  pin: [65, 446] },
};

// Orden de renderizado: provincias grandes primero, pequeñas encima
const RENDER_ORDER = [
  "Buenos Aires", "La Pampa", "Santa Cruz", "Chubut", "Rio Negro",
  "Salta", "Cordoba", "Mendoza", "Neuquen", "Corrientes",
  "Santiago del Estero", "Chaco", "Formosa", "Santa Fe", "Entre Rios",
  "San Juan", "Catamarca", "La Rioja", "San Luis", "Misiones",
  "Jujuy", "Tucuman", "CABA", "Tierra del Fuego",
];

export default function MapView({ goToProfessional, professionals }) {
  const [selectedProvince, setSelectedProvince] = useState("Todas");

  const publicProfessionals = professionals.filter((p) => p.active);
  const activeProvinces = new Set(publicProfessionals.map((p) => p.province));
  const visibleProfessionals =
    selectedProvince === "Todas"
      ? publicProfessionals
      : publicProfessionals.filter((p) => p.province === selectedProvince);

  function handleProvinceClick(province) {
    setSelectedProvince((current) => (current === province ? "Todas" : province));
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

          <svg
            className="argentina-svg"
            viewBox="0 0 210 470"
            aria-label="Mapa interactivo de Argentina"
          >
            {RENDER_ORDER.map((province) => {
              const data = PROVINCE_DATA[province];
              if (!data) return null;
              const isSelected = selectedProvince === province;
              const hasProf = activeProvinces.has(province);
              return (
                <polygon
                  key={province}
                  points={data.points}
                  fill={isSelected ? "#d74c5d" : hasProf ? "#c2d8de" : "#cdd8db"}
                  stroke="#8fa6ae"
                  strokeWidth={isSelected ? 1.5 : 0.6}
                  style={{ cursor: "pointer", transition: "fill 0.18s" }}
                  onClick={() => handleProvinceClick(province)}
                >
                  <title>{province}{hasProf ? " · tiene profesionales" : ""}</title>
                </polygon>
              );
            })}

            {visibleProfessionals.map((professional) => {
              const data = PROVINCE_DATA[professional.province];
              if (!data) return null;
              const [cx, cy] = data.pin;
              return (
                <g
                  key={professional.id}
                  onClick={() => goToProfessional(professional)}
                  style={{ cursor: "pointer" }}
                  aria-label={professional.name}
                >
                  <circle cx={cx} cy={cy} r={9} fill="#d74c5d" stroke="white" strokeWidth={1.8} />
                  <text
                    x={cx}
                    y={cy + 3.5}
                    textAnchor="middle"
                    fill="white"
                    fontSize={7}
                    fontWeight="bold"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {professional.initials.slice(0, 1)}
                  </text>
                </g>
              );
            })}
          </svg>

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
                onClick={() => handleProvinceClick(province)}
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
                <button className="primary-btn" onClick={() => goToProfessional(professional)}>
                  Reservar
                </button>
                <a className="ghost-btn" href={mapsUrl(professional)} target="_blank" rel="noreferrer">
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
