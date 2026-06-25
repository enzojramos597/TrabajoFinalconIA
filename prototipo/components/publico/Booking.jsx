"use client";

import { useState } from "react";
import { workHours } from "../../lib/constants";
import {
  isWeekday,
  getInitialBookingDate,
  getUpcomingWeekdays,
  formatDateLabel,
  formatAppointmentLabel,
  mapsUrl,
} from "../../lib/utils";

export default function Booking({ selectedProfessional, family, setFamily, session, setShowLogin, appointments, saveAppointment, setPage }) {
  const [selectedDate, setSelectedDate] = useState(getInitialBookingDate());
  const [slot, setSlot] = useState(workHours[0]);
  const [confirmed, setConfirmed] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState(null);

  function showToast(type, title, text) {
    setToast({ type, title, text });
    window.setTimeout(() => setToast(null), 4200);
  }

  function updateFamily(field, value) {
    setFamily({ ...family, [field]: value });
  }

  async function confirmBooking() {
    if (!isWeekday(selectedDate) || isSlotReserved(selectedDate, slot)) return;

    const appointment = {
      id: Date.now(),
      professionalId: selectedProfessional.id,
      professionalName: selectedProfessional.name,
      date: formatAppointmentLabel(selectedDate, slot),
      dateISO: selectedDate,
      time: slot,
      childName: family.childName || "Hijo/a",
      status: "Reservado",
    };

    try {
      setIsSaving(true);
      const savedAppointment = await saveAppointment(appointment);
      setConfirmed(savedAppointment);
      showToast("success", "Turno en reserva", "El profesional debera aceptar el turno antes de enviar la confirmacion por WhatsApp.");
    } catch {
      setConfirmed(null);
      showToast("error", "No se pudo reservar", "El horario ya estaba ocupado o no se pudo guardar el turno.");
    } finally {
      setIsSaving(false);
    }
  }

  function isSlotReserved(dateISO, time) {
    return appointments.some((appointment) =>
      appointment.professionalId === selectedProfessional.id &&
      appointment.dateISO === dateISO &&
      appointment.time === time &&
      appointment.status !== "Cancelado"
    );
  }

  function updateSelectedDate(dateISO) {
    setSelectedDate(dateISO);
    setConfirmed(null);
    const firstAvailableTime = workHours.find((time) => !isSlotReserved(dateISO, time));
    setSlot(firstAvailableTime || workHours[0]);
  }

  const selectedDateIsWeekday = isWeekday(selectedDate);
  const selectedDateHasAvailableSlots = workHours.some((time) => !isSlotReserved(selectedDate, time));
  const upcomingWeekdays = getUpcomingWeekdays(selectedDate);

  return (
    <main className="page">
      {toast && (
        <div className={`toast ${toast.type}`}>
          <span className="toast-icon">{toast.type === "success" ? "OK" : "!"}</span>
          <div>
            <strong>{toast.title}</strong>
            <p>{toast.text}</p>
          </div>
        </div>
      )}
      <div className="section-head">
        <div>
          <p className="eyebrow">Reserva de turno</p>
          <h2>Confirmar consulta</h2>
          <p>Completa los datos de la familia y selecciona un horario disponible.</p>
        </div>
      </div>
      <section className="detail-layout">
        <aside className="profile-card">
          <div className="profile-head">
            <div className="avatar">{selectedProfessional.initials}</div>
            <div>
              <h3>{selectedProfessional.name}</h3>
              <p className="muted">{selectedProfessional.specialty}</p>
            </div>
          </div>
          <p>{selectedProfessional.formation}</p>
          <p className="muted">{selectedProfessional.address}</p>
          <div className="tags">
            <span className="tag">{selectedProfessional.province}</span>
            <span className="tag warn">{selectedProfessional.availability}</span>
          </div>
          <a className="ghost-btn" href={mapsUrl(selectedProfessional)} target="_blank">Abrir Google Maps</a>
        </aside>

        <section className="form-panel">
          {(!session || session.role !== "family") ? (
            <>
              <div className="notice">
                <strong>Iniciá sesión para continuar</strong>
                <p>Para reservar un turno necesitás ingresar con una cuenta de padre o tutor.</p>
              </div>
              <div className="actions">
                <button className="primary-btn" onClick={() => setShowLogin(true)}>
                  Iniciar sesión / Registrarse
                </button>
                <button className="ghost-btn" onClick={() => setPage("profesionales")}>Volver</button>
              </div>
            </>
          ) : (
            <>
              <div className="notice account-notice">
                <strong>Sesion familiar activa</strong>
                <p>{family.parentName} · {family.email}</p>
              </div>
              <h3>Datos de la familia</h3>
              <div className="form-grid">
                <label className="field">
                  <span>Nombre del adulto</span>
                  <input value={family.parentName} onChange={(event) => updateFamily("parentName", event.target.value)} />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input value={family.email} onChange={(event) => updateFamily("email", event.target.value)} />
                </label>
                <label className="field">
                  <span>WhatsApp</span>
                  <input value={family.whatsapp} onChange={(event) => updateFamily("whatsapp", event.target.value)} />
                </label>
                <label className="field">
                  <span>Nombre del hijo/a</span>
                  <input value={family.childName} onChange={(event) => updateFamily("childName", event.target.value)} />
                </label>
                <label className="field">
                  <span>Edad</span>
                  <input value={family.childAge} onChange={(event) => updateFamily("childAge", event.target.value)} />
                </label>
                <label className="field wide">
                  <span>Motivo de consulta</span>
                  <textarea value={family.reason} onChange={(event) => updateFamily("reason", event.target.value)} />
                </label>
              </div>

              <h3>Calendario de turnos</h3>
              <p className="muted">Cada sesión dura 1 hora. El profesional atiende de lunes a viernes, de 9 a 12 y de 17 a 20.</p>
              <div className="calendar-picker">
                <label className="field">
                  <span>Seleccionar fecha</span>
                  <input type="date" value={selectedDate} onChange={(event) => updateSelectedDate(event.target.value)} />
                </label>
                <div className="date-strip" aria-label="Dias disponibles">
                  {upcomingWeekdays.map((dateISO) => (
                    <button
                      key={dateISO}
                      className={selectedDate === dateISO ? "date-chip active" : "date-chip"}
                      onClick={() => updateSelectedDate(dateISO)}
                    >
                      {formatDateLabel(dateISO)}
                    </button>
                  ))}
                </div>
              </div>

              {!selectedDateIsWeekday && (
                <div className="notice warn-notice">
                  <strong>Dia no disponible</strong>
                  <p>Los profesionales atienden de lunes a viernes. Selecciona una fecha habil.</p>
                </div>
              )}

              {selectedDateIsWeekday && (
                <div className="schedule calendar-slots">
                  {workHours.map((time) => {
                    const reserved = isSlotReserved(selectedDate, time);
                    return (
                      <button
                        key={time}
                        className={[slot === time ? "slot selected" : "slot", reserved ? "disabled" : ""].join(" ")}
                        disabled={reserved}
                        onClick={() => setSlot(time)}
                      >
                        <span>{time}</span>
                        {reserved ? <small>Reservado</small> : <small>Disponible</small>}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedDateIsWeekday && !selectedDateHasAvailableSlots && (
                <div className="notice warn-notice">
                  <strong>Dia completo</strong>
                  <p>Todos los horarios de esta fecha ya se encuentran reservados.</p>
                </div>
              )}

              <div className="actions">
                <button className="primary-btn" onClick={confirmBooking} disabled={isSaving || !selectedDateIsWeekday || isSlotReserved(selectedDate, slot)}>
                  {isSaving ? "Guardando..." : "Confirmar turno"}
                </button>
                <button className="ghost-btn" onClick={() => setPage("familia")}>Ir a mi panel</button>
              </div>

              {confirmed && (
                <div className="notice">
                  <strong>Turno en reserva.</strong>
                  <p>El profesional debera aceptar el turno. Cuando lo acepte, se habilitara el mensaje de confirmacion por WhatsApp para el padre/tutor y el profesional.</p>
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  );
}
