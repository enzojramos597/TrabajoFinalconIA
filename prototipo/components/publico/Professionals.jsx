"use client";

import { useState, useMemo } from "react";
import { mapsUrl } from "../../lib/utils";

function ProfessionalCard({ professional, onBook }) {
  return (
    <article className="card professional-card">
      <div className="avatar">{professional.initials}</div>
      <div>
        <h3>{professional.name}</h3>
        <p className="muted">{professional.formation}</p>
        <div className="tags">
          <span className="tag">{professional.province}</span>
          <span className="tag blue">{professional.specialty}</span>
          <span className="tag warn">{professional.availability}</span>
        </div>
        <p className="muted">{professional.licenseNumber ? `Matricula: ${professional.licenseNumber}` : "Matricula pendiente"} - {professional.modality}</p>
        <p className="muted">{professional.address}</p>
        <div className="actions">
          <button className="primary-btn" onClick={onBook}>Reservar turno</button>
          <a className="ghost-btn" href={mapsUrl(professional)} target="_blank">Como llegar</a>
        </div>
      </div>
    </article>
  );
}

export default function Professionals({ goToProfessional, professionals }) {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("Todas");
  const [specialty, setSpecialty] = useState("Todas");
  const [availability, setAvailability] = useState("Todas");

  const filtered = useMemo(() => {
    return professionals.filter((professional) => {
      const textMatch = professional.name.toLowerCase().includes(query.toLowerCase()) ||
        professional.specialty.toLowerCase().includes(query.toLowerCase());
      return professional.active &&
        textMatch &&
        (province === "Todas" || professional.province === province) &&
        (specialty === "Todas" || professional.specialty === specialty) &&
        (availability === "Todas" || professional.availability === availability);
    });
  }, [query, province, specialty, availability, professionals]);

  return (
    <main className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">Directorio</p>
          <h2>Profesionales disponibles</h2>
          <p>Filtra por provincia, especialidad o disponibilidad para encontrar una opcion adecuada.</p>
        </div>
      </div>
      <section className="filters">
        <label className="field">
          <span>Buscar</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre o especialidad" />
        </label>
        <label className="field">
          <span>Provincia</span>
          <select value={province} onChange={(event) => setProvince(event.target.value)}>
            {["Todas", ...new Set(professionals.map((item) => item.province))].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Especialidad</span>
          <select value={specialty} onChange={(event) => setSpecialty(event.target.value)}>
            {["Todas", ...new Set(professionals.map((item) => item.specialty))].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Disponibilidad</span>
          <select value={availability} onChange={(event) => setAvailability(event.target.value)}>
            {["Todas", "Manana", "Esta semana", "Proxima semana"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </section>
      <section className="grid two">
        {filtered.map((professional) => (
          <ProfessionalCard key={professional.id} professional={professional} onBook={() => goToProfessional(professional)} />
        ))}
      </section>
      {filtered.length === 0 && <div className="empty">No se encontraron profesionales con esos filtros.</div>}
    </main>
  );
}
