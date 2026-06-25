"use client";

import { useState } from "react";
import {
  isUpcomingAppointment,
  appointmentDateTime,
  isAcceptedAppointment,
  sortClinicalSessions,
  labelFor,
} from "../../lib/utils";
import ClinicalReportViewer from "../shared/ClinicalReportViewer";

export default function FamilyPanel({ family, setFamily, appointments, setAppointments, sessions }) {
  const [tab, setTab] = useState("turnos");
  const upcomingFamilyAppointments = appointments
    .filter((appointment) => appointment.status !== "Cancelado")
    .filter(isUpcomingAppointment)
    .sort((a, b) => appointmentDateTime(a) - appointmentDateTime(b));
  const childSessions = sortClinicalSessions(
    sessions.filter((item) => !item.childName || item.childName === family.childName)
  );

  function cancelAppointment(id) {
    setAppointments(appointments.map((item) => item.id === id ? { ...item, status: "Cancelado" } : item));
  }

  return (
    <main className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">Panel familiar</p>
          <h2>Hola, {family.parentName}!</h2>
          <p>Consulta turnos, historial de sesiones y evolución de {family.childName}.</p>
        </div>
      </div>
      <div className="tabs">
        {["turnos", "historial", "evolucion", "perfil"].map((item) => (
          <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{labelFor(item)}</button>
        ))}
      </div>

      {tab === "turnos" && (
        <section>
          {upcomingFamilyAppointments.length === 0 && (
            <div className="empty">No tenes turnos próximos activos.</div>
          )}
          {upcomingFamilyAppointments.map((appointment) => (
            <article className="appointment-card" key={appointment.id}>
              <header>
                <div>
                  <h3>{appointment.professionalName}</h3>
                  <p className="muted">{appointment.date} · {appointment.childName}</p>
                </div>
                <span className={isAcceptedAppointment(appointment) ? "tag" : "tag warn"}>{appointment.status}</span>
              </header>
              {appointment.status === "Reservado" && (
                <p className="muted">El turno esta reservado y pendiente de aceptacion por el profesional.</p>
              )}
              {isAcceptedAppointment(appointment) && (
                <p className="muted">El profesional acepto el turno. Ya no se puede reprogramar ni cancelar desde el panel familiar.</p>
              )}
              {appointment.status === "Reservado" && (
                <div className="actions">
                  <button className="soft-btn">Reprogramar</button>
                  <button className="danger-btn" onClick={() => cancelAppointment(appointment.id)}>Cancelar</button>
                </div>
              )}
            </article>
          ))}
        </section>
      )}

      {tab === "historial" && (
        <section>
          <ClinicalReportViewer
            sessions={childSessions}
            title={`Informe clinico de ${family.childName}`}
            emptyText="Todavia no hay informes cargados por el profesional."
          />
        </section>
      )}

      {tab === "evolucion" && (
        <section className="grid two">
          <article className="card">
            <h3>Progreso general</h3>
            <p className="muted">Gráfico simple construido con los registros de sesión.</p>
            <div className="chart">
              {childSessions.map((session) => <div key={`${session.date}-${session.objectives}`} className="bar" style={{ height: `${session.progress}%` }} title={`${session.progress}%`} />)}
            </div>
          </article>
          <article className="card">
            <h3>Ultimo avance</h3>
            {childSessions[0] ? (
              <>
                <p className="muted">{childSessions[0].date} - {childSessions[0].professional}</p>
                <p>{childSessions[0].notes}</p>
                <div className="progress"><span style={{ width: `${childSessions[0].progress}%` }} /></div>
              </>
            ) : (
              <p className="muted">Sin informes clinicos cargados.</p>
            )}
          </article>
        </section>
      )}

      {tab === "perfil" && (
        <section className="form-panel">
          <h3>Datos registrados</h3>
          <div className="form-grid">
            {Object.entries({
              parentName: "Adulto responsable",
              email: "Correo",
              whatsapp: "WhatsApp",
              childName: "Hijo/a",
              childAge: "Edad",
            }).map(([field, label]) => (
              <label className="field" key={field}>
                <span>{label}</span>
                <input value={family[field]} onChange={(event) => setFamily({ ...family, [field]: event.target.value })} />
              </label>
            ))}
            <label className="field wide">
              <span>Motivo</span>
              <textarea value={family.reason} onChange={(event) => setFamily({ ...family, reason: event.target.value })} />
            </label>
          </div>
        </section>
      )}
    </main>
  );
}
