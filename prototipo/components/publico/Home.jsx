"use client";

import { workHours } from "../../lib/constants";

export default function Home({ setPage, goToProfessional, professionals, appointments }) {
  const activeProfessionals = professionals.filter((professional) => professional.active);
  const firstActiveProfessional = activeProfessionals[0] || professionals[0];
  const activeProvinceCount = new Set(activeProfessionals.map((professional) => professional.province)).size;
  const totalWeeklySlots = activeProfessionals.length * workHours.length * 5;
  const reservedSlots = appointments.filter((appointment) => appointment.status !== "Cancelado").length;
  const availableWeeklySlots = Math.max(0, totalWeeklySlots - reservedSlots);
  const specialtyCount = new Set(activeProfessionals.map((professional) => professional.specialty)).size;
  const serviceContent = {
    "*": {
      title: "Diagnóstico y orientación",
      text: "Primera entrevista, análisis del motivo de consulta y recomendación de pasos a seguir.",
      image: "/servicios/diagnostico-orientacion.png",
    },
    "+": {
      title: "Seguimiento familiar",
      text: "Informes de sesión, objetivos trabajados y evolución del proceso.",
      image: "/servicios/seguimiento-familiar.png",
    },
    "#": {
      title: "Recursos para familias",
      text: "Guías y ejercicios descargables ordenados por edad y área de trabajo.",
      image: "/servicios/recursos-familias.png",
    },
  };

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Centro Psicopedagógico</p>
          <div className="hero-brand">
            <img className="hero-brand-icon" src="/psico-puente-icon.png" alt="" aria-hidden="true" />
            <div>
              <h1>PSICO-PUENTE</h1>
              <p>Orientación y seguimiento familiar</p>
            </div>
          </div>
          <p className="lead">
            Orientación, turnos y seguimiento familiar para acompañar los procesos de aprendizaje desde un mismo lugar.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setPage("profesionales")}>Buscar profesional</button>
            <button className="ghost-btn" onClick={() => setPage("recursos")}>Ver recursos</button>
          </div>
          <div className="stats">
            <div className="stat"><strong>{activeProvinceCount}</strong><span>provincias activas</span></div>
            <div className="stat"><strong>{availableWeeklySlots}</strong><span>turnos semanales disponibles</span></div>
            <div className="stat"><strong>{specialtyCount}</strong><span>áreas de trabajo</span></div>
          </div>
        </div>
        <div className="hero-panel" role="img" aria-label="Profesional psicopedagógico trabajando con un paciente en consultorio">
          <div className="floating-note">
            <strong>Flujo principal del prototipo</strong>
            <p className="muted">Buscar profesional, elegir horario, confirmar turno y generar mensaje automatico por WhatsApp.</p>
            <button className="soft-btn" onClick={() => goToProfessional(firstActiveProfessional)}>Probar reserva</button>
          </div>
        </div>
      </section>

      <section className="page">
        <div className="section-head">
          <div>
            <p className="eyebrow">Servicios</p>
            <h2>Atención organizada por necesidades reales</h2>
          </div>
        </div>
        <div className="grid">
          {[
            ["Diagnostico y orientacion", "Primera entrevista, analisis del motivo de consulta y recomendacion de pasos a seguir.", "*"],
            ["Seguimiento familiar", "Informes de sesión, objetivos trabajados y evolución del proceso.", "+"],
            ["Recursos para familias", "Guías y ejercicios descargables ordenados por edad y área de trabajo.", "#"],
          ].map(([title, text, icon]) => (
            <article className="card service-card" key={title}>
              <img className="service-image" src={serviceContent[icon].image} alt={serviceContent[icon].title} />
              <h3>{serviceContent[icon].title}</h3>
              <p className="muted">{serviceContent[icon].text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
