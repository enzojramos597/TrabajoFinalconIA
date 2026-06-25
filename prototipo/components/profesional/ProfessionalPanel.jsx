"use client";

import { useState } from "react";
import { workHours, argentinaProvinces } from "../../lib/constants";
import {
  sortClinicalSessions,
  formatClinicalDate,
  clampProgress,
  toDateInputValue,
  isWeekday,
  formatAppointmentLabel,
  isAcceptedAppointment,
  whatsappLink,
  getInitialBookingDate,
  buildAddressQuery,
} from "../../lib/utils";
import ClinicalReportViewer from "../shared/ClinicalReportViewer";

export default function ProfessionalPanel({ appointments, sessions, setSessions, session, professionals, saveProfessionalRecord, toggleProfessionalRecord, updateAppointmentStatus, updateAppointmentRecord }) {
  const visibleAppointments = session?.role === "professional"
    ? appointments.filter((appointment) => appointment.professionalName === session.name)
    : appointments;
  const patientOptions = [...new Set(visibleAppointments.map((appointment) => appointment.childName).filter(Boolean))];
  const [selectedPatient, setSelectedPatient] = useState("");
  const activePatient = selectedPatient || patientOptions[0] || "";
  const clinicalSessions = sortClinicalSessions(
    sessions.filter((item) => !activePatient || item.childName === activePatient)
  );
  const emptyProfessional = {
    id: null,
    name: "",
    initials: "",
    email: "",
    password: "",
    passwordConfirm: "",
    licenseNumber: "",
    province: "Buenos Aires",
    city: "",
    specialty: "",
    availability: "Esta semana",
    address: "",
    phone: "",
    modality: "Presencial",
    workDays: "Lunes a viernes",
    scheduleNotes: "9 a 12 y 17 a 20",
    formation: "",
    active: true,
    progress: 60,
    coords: { top: "49%", left: "66%" },
  };
  const [editingProfessional, setEditingProfessional] = useState(null);
  const [isSavingProfessional, setIsSavingProfessional] = useState(false);
  const [professionalErrors, setProfessionalErrors] = useState({});
  const [rescheduleDraft, setRescheduleDraft] = useState(null);
  const [toast, setToast] = useState(null);
  const [report, setReport] = useState({
    date: "2026-06-10",
    professional: "Lic. Mariana Torres",
    objectives: "Comprension de consignas y planificacion semanal.",
    notes: "Se trabajo con agenda visual y consignas divididas en pasos.",
    progress: 80,
  });

  function saveReport() {
    if (!activePatient) {
      showToast("error", "Selecciona un paciente", "Necesitas tener un paciente asignado para guardar el informe.");
      return;
    }

    if (!report.date || !report.objectives.trim() || !report.notes.trim()) {
      showToast("error", "Faltan datos", "Completa fecha, objetivos y observaciones para guardar el informe clinico.");
      return;
    }

    const nextReport = {
      ...report,
      id: Date.now(),
      date: formatClinicalDate(report.date),
      dateISO: report.date,
      childName: activePatient,
      professional: session?.name || report.professional,
      progress: clampProgress(report.progress),
    };

    setSessions([nextReport, ...sessions]);
    showToast("success", "Informe guardado", `El informe clinico de ${activePatient} fue agregado al historial.`);
    setReport({
      date: toDateInputValue(new Date()),
      professional: session?.name || report.professional,
      objectives: "",
      notes: "",
      progress: nextReport.progress,
    });
  }

  function startNewProfessional() {
    setEditingProfessional(emptyProfessional);
    setProfessionalErrors({});
  }

  function startEditProfessional(professional) {
    setEditingProfessional({ ...professional, password: "", passwordConfirm: "" });
    setProfessionalErrors({});
  }

  function updateProfessionalField(field, value) {
    const updated = { ...editingProfessional, [field]: value };
    if (field === "name") {
      updated.initials = value
        .split(" ")
        .filter(Boolean)
        .slice(-2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "PR";
    }
    setEditingProfessional(updated);
    setProfessionalErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
  }

  function showToast(type, title, text) {
    setToast({ type, title, text });
    window.setTimeout(() => setToast(null), 4200);
  }

  function validateProfessional(professional) {
    const nextErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!professional.name.trim()) nextErrors.name = "Ingresa el nombre completo.";
    if (!professional.email.trim()) nextErrors.email = "Ingresa el email de acceso.";
    if (professional.email && !emailPattern.test(professional.email)) nextErrors.email = "Ingresa un email valido.";
    if (!professional.id && !professional.password) nextErrors.password = "Ingresa una contrasena inicial.";
    if (professional.password && professional.password.length < 6) nextErrors.password = "La contrasena debe tener al menos 6 caracteres.";
    if (professional.password !== professional.passwordConfirm) nextErrors.passwordConfirm = "Las contrasenas no coinciden.";
    if (!professional.specialty.trim()) nextErrors.specialty = "Ingresa la especialidad.";
    if (!professional.licenseNumber.trim()) nextErrors.licenseNumber = "Ingresa la matricula profesional.";
    if (!professional.province) nextErrors.province = "Selecciona una provincia.";
    if (!professional.city.trim()) nextErrors.city = "Ingresa la ciudad o localidad.";
    if (!professional.address.trim()) nextErrors.address = "Ingresa la direccion del consultorio.";
    if (!professional.phone.trim()) nextErrors.phone = "Ingresa el telefono o WhatsApp.";
    if (!professional.workDays.trim()) nextErrors.workDays = "Ingresa los dias de atencion.";
    if (!professional.scheduleNotes.trim()) nextErrors.scheduleNotes = "Ingresa los horarios de atencion.";

    return nextErrors;
  }

  async function saveProfessional() {
    const nextErrors = validateProfessional(editingProfessional);

    if (Object.keys(nextErrors).length > 0) {
      setProfessionalErrors(nextErrors);
      showToast("error", "Faltan datos", "Revisa los campos marcados para poder guardar el medico.");
      return;
    }

    const professionalToSave = editingProfessional.id
      ? editingProfessional
      : {
          ...editingProfessional,
          initials: editingProfessional.initials || "PR",
        };

    try {
      setIsSavingProfessional(true);
      await saveProfessionalRecord(professionalToSave);
      setEditingProfessional(null);
      setProfessionalErrors({});
      showToast("success", "Medico cargado exitosamente", "El profesional fue guardado y ya queda disponible para gestionar su agenda.");
    } catch (error) {
      showToast("error", "No se pudo guardar", error?.message || "Ocurrio un error desconocido.");
    } finally {
      setIsSavingProfessional(false);
    }
  }

  async function toggleProfessionalStatus(professional) {
    await toggleProfessionalRecord(professional);
  }

  async function handleAppointmentStatus(appointmentId, status) {
    try {
      await updateAppointmentStatus(appointmentId, status);
      showToast(
        "success",
        status === "Aceptado" ? "Turno aceptado" : "Turno cancelado",
        status === "Aceptado"
          ? "El turno quedo confirmado en tu agenda profesional."
          : "El turno fue cancelado y ya no queda activo para la atencion."
      );
    } catch (error) {
      showToast("error", "No se pudo actualizar", error?.message || "Revisa la conexion con Supabase.");
    }
  }

  function startReschedule(appointment) {
    setRescheduleDraft({
      appointmentId: appointment.id,
      dateISO: appointment.dateISO || getInitialBookingDate(),
      time: appointment.time || workHours[0],
    });
  }

  function isProfessionalSlotReserved(professionalId, dateISO, time, currentAppointmentId) {
    return appointments.some((appointment) =>
      appointment.id !== currentAppointmentId &&
      appointment.professionalId === professionalId &&
      appointment.dateISO === dateISO &&
      appointment.time === time &&
      appointment.status !== "Cancelado"
    );
  }

  function updateRescheduleDraft(field, value) {
    setRescheduleDraft((currentDraft) => ({ ...currentDraft, [field]: value }));
  }

  async function confirmReschedule(appointment) {
    if (!rescheduleDraft || rescheduleDraft.appointmentId !== appointment.id) return;

    if (!isWeekday(rescheduleDraft.dateISO)) {
      showToast("error", "Dia no disponible", "Selecciona una fecha de lunes a viernes.");
      return;
    }

    if (isProfessionalSlotReserved(appointment.professionalId, rescheduleDraft.dateISO, rescheduleDraft.time, appointment.id)) {
      showToast("error", "Horario ocupado", "Ese horario ya esta reservado para este profesional.");
      return;
    }

    const nextDate = formatAppointmentLabel(rescheduleDraft.dateISO, rescheduleDraft.time);

    try {
      await updateAppointmentRecord(appointment.id, {
        date: nextDate,
        dateISO: rescheduleDraft.dateISO,
        time: rescheduleDraft.time,
        status: "Aceptado",
      });
      setRescheduleDraft(null);
      showToast("success", "Turno reprogramado", "El nuevo horario quedo actualizado para la familia y el profesional.");
    } catch (error) {
      showToast("error", "No se pudo reprogramar", error?.message || "Revisa la conexion con Supabase.");
    }
  }

  if (session?.role === "professional") {
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
            <p className="eyebrow">Panel medico</p>
            <h2>Agenda de turnos</h2>
            <p>Consulta los turnos asignados a tu perfil y gestiona cada solicitud.</p>
          </div>
          <span className="role-pill">Sesion: {session.email}</span>
        </div>
        <section className="dashboard-layout">
          <div>
            <h3>Turnos de pacientes</h3>
            {visibleAppointments.length === 0 && <p className="muted">No tenes turnos asignados por el momento.</p>}
            {visibleAppointments.map((appointment) => {
              const professional = professionals.find((item) => item.id === appointment.professionalId || item.name === appointment.professionalName);
              const parentMessage = `Hola ${appointment.parentName || "familia"}, el turno de ${appointment.childName} con ${appointment.professionalName} fue confirmado/reprogramado para ${appointment.date}. Direccion: ${professional?.address || "consultorio informado"}.`;
              const professionalMessage = `Turno aceptado: ${appointment.childName} el ${appointment.date}. Padre/tutor: ${appointment.parentName || "sin datos"}. WhatsApp: ${appointment.whatsapp || "sin datos"}. Motivo: ${appointment.reason || "sin detalle"}.`;
              const parentWhatsapp = whatsappLink(appointment.whatsapp, parentMessage);
              const professionalWhatsapp = whatsappLink(professional?.phone, professionalMessage);
              const isRescheduling = rescheduleDraft?.appointmentId === appointment.id;

              return (
                <article className="appointment-card" key={appointment.id}>
                  <header>
                    <div>
                      <h3>{appointment.childName}</h3>
                      <p className="muted">{appointment.date} - {appointment.time}</p>
                    </div>
                    <span className={appointment.status === "Cancelado" ? "tag warn" : "tag"}>{appointment.status}</span>
                  </header>
                  <p><strong>Padre / Tutor:</strong> {appointment.parentName || "Sin datos cargados"}</p>
                  {appointment.whatsapp && <p><strong>WhatsApp:</strong> {appointment.whatsapp}</p>}
                  {appointment.reason && <p className="muted">{appointment.reason}</p>}
                  {appointment.status === "Reservado" && (
                    <div className="actions">
                      <button className="primary-btn" onClick={() => handleAppointmentStatus(appointment.id, "Aceptado")}>
                        Aceptar turno
                      </button>
                      <button className="danger-btn" onClick={() => handleAppointmentStatus(appointment.id, "Cancelado")}>
                        Cancelar turno
                      </button>
                    </div>
                  )}
                  {isAcceptedAppointment(appointment) && (
                    <div className="actions">
                      <button className="soft-btn" onClick={() => startReschedule(appointment)}>
                        Reprogramar turno
                      </button>
                    </div>
                  )}
                  {appointment.status === "Cancelado" && (
                    <p className="muted">Este turno fue cancelado y no admite nuevas acciones.</p>
                  )}
                  {isRescheduling && (
                    <div className="reschedule-panel">
                      <h4>Reprogramar turno</h4>
                      <div className="form-grid">
                        <label className="field">
                          <span>Fecha</span>
                          <input type="date" value={rescheduleDraft.dateISO} onChange={(event) => updateRescheduleDraft("dateISO", event.target.value)} />
                        </label>
                        <label className="field">
                          <span>Horario</span>
                          <select value={rescheduleDraft.time} onChange={(event) => updateRescheduleDraft("time", event.target.value)}>
                            {workHours.map((time) => {
                              const reserved = isProfessionalSlotReserved(appointment.professionalId, rescheduleDraft.dateISO, time, appointment.id);
                              return (
                                <option key={time} value={time} disabled={reserved}>
                                  {time}{reserved ? " - ocupado" : ""}
                                </option>
                              );
                            })}
                          </select>
                        </label>
                      </div>
                      {!isWeekday(rescheduleDraft.dateISO) && (
                        <p className="muted">Selecciona una fecha de lunes a viernes.</p>
                      )}
                      <div className="actions">
                        <button className="primary-btn" onClick={() => confirmReschedule(appointment)}>Guardar reprogramacion</button>
                        <button className="ghost-btn" onClick={() => setRescheduleDraft(null)}>Cerrar</button>
                      </div>
                    </div>
                  )}
                  {isAcceptedAppointment(appointment) && (
                    <div className="notice whatsapp-notice">
                      <strong>Confirmacion habilitada</strong>
                      <p>El turno esta aceptado. Si fue reprogramado, avisa al padre/tutor por WhatsApp con la nueva fecha.</p>
                      <div className="actions">
                        {parentWhatsapp ? (
                          <a className="soft-btn" href={parentWhatsapp} target="_blank">WhatsApp al padre/tutor</a>
                        ) : (
                          <button className="soft-btn" disabled>Sin WhatsApp del padre</button>
                        )}
                        {professionalWhatsapp ? (
                          <a className="ghost-btn" href={professionalWhatsapp} target="_blank">WhatsApp al profesional</a>
                        ) : (
                          <button className="ghost-btn" disabled>Sin WhatsApp profesional</button>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          <div className="form-panel">
            <h3>Cargar informe de sesion</h3>
            <div className="form-grid">
              <label className="field wide">
                <span>Paciente</span>
                <select value={activePatient} onChange={(event) => setSelectedPatient(event.target.value)}>
                  {patientOptions.length === 0 && <option value="">Sin pacientes asignados</option>}
                  {patientOptions.map((patient) => <option key={patient} value={patient}>{patient}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Fecha</span>
                <input type="date" value={report.date} onChange={(event) => setReport({ ...report, date: event.target.value })} />
              </label>
              <label className="field">
                <span>Progreso</span>
                <input type="number" min="0" max="100" value={report.progress} onChange={(event) => setReport({ ...report, progress: Number(event.target.value) })} />
                <input type="range" min="0" max="100" value={report.progress} onChange={(event) => setReport({ ...report, progress: Number(event.target.value) })} />
              </label>
              <label className="field wide">
                <span>Objetivos trabajados</span>
                <textarea value={report.objectives} onChange={(event) => setReport({ ...report, objectives: event.target.value })} />
              </label>
              <label className="field wide">
                <span>Observaciones</span>
                <textarea value={report.notes} onChange={(event) => setReport({ ...report, notes: event.target.value })} />
              </label>
            </div>
            <button className="primary-btn" onClick={saveReport}>Guardar informe</button>
            <ClinicalReportViewer
              sessions={clinicalSessions}
              title={activePatient ? `Evolucion clinica de ${activePatient}` : "Evolucion clinica"}
              emptyText="Todavia no hay informes cargados para este paciente."
            />
          </div>
        </section>
      </main>
    );
  }

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
          <p className="eyebrow">Panel profesional</p>
          <h2>ABM de profesionales, agenda e informes</h2>
          <p>Vista privada simulada para altas, bajas, modificaciones, reservas y registros de sesión.</p>
        </div>
        {session?.role === "professional" && <span className="role-pill">Sesion: {session.email}</span>}
      </div>
      <section className="card abm-panel">
        <div className="section-head compact">
          <div>
            <h3>Profesionales registrados</h3>
            <p>ABM simulado para administrar perfiles, especialidades y disponibilidad.</p>
          </div>
          <button className="primary-btn" onClick={startNewProfessional}>Nuevo profesional</button>
        </div>
        {editingProfessional && (
          <div className="abm-editor">
            <h3>{editingProfessional.id ? "Editar profesional" : "Nuevo profesional"}</h3>
            <div className="form-grid">
              <label className="field">
                <span>Nombre</span>
                <input value={editingProfessional.name} onChange={(event) => updateProfessionalField("name", event.target.value)} />
                {professionalErrors.name && <small className="field-error">{professionalErrors.name}</small>}
              </label>
              <label className="field">
                <span>Email de acceso</span>
                <input type="email" value={editingProfessional.email} onChange={(event) => updateProfessionalField("email", event.target.value)} placeholder="Ej: profesional@psicopuente.com" />
                {professionalErrors.email && <small className="field-error">{professionalErrors.email}</small>}
              </label>
              <label className="field">
                <span>Contrasena inicial</span>
                <input type="password" value={editingProfessional.password || ""} onChange={(event) => updateProfessionalField("password", event.target.value)} placeholder={editingProfessional.id ? "Completar solo si desea cambiarla" : "Minimo 6 caracteres"} />
                {professionalErrors.password && <small className="field-error">{professionalErrors.password}</small>}
              </label>
              <label className="field">
                <span>Repetir contrasena</span>
                <input type="password" value={editingProfessional.passwordConfirm || ""} onChange={(event) => updateProfessionalField("passwordConfirm", event.target.value)} placeholder="Repetir contrasena" />
                {professionalErrors.passwordConfirm && <small className="field-error">{professionalErrors.passwordConfirm}</small>}
              </label>
              <label className="field">
                <span>Especialidad</span>
                <input value={editingProfessional.specialty} onChange={(event) => updateProfessionalField("specialty", event.target.value)} />
                {professionalErrors.specialty && <small className="field-error">{professionalErrors.specialty}</small>}
              </label>
              <label className="field">
                <span>Matricula profesional (MP)</span>
                <input value={editingProfessional.licenseNumber} onChange={(event) => updateProfessionalField("licenseNumber", event.target.value)} placeholder="Ej: MP 12345" />
                {professionalErrors.licenseNumber && <small className="field-error">{professionalErrors.licenseNumber}</small>}
              </label>
              <label className="field">
                <span>Provincia</span>
                <select value={editingProfessional.province} onChange={(event) => updateProfessionalField("province", event.target.value)}>
                  {argentinaProvinces.map((province) => <option key={province}>{province}</option>)}
                </select>
                {professionalErrors.province && <small className="field-error">{professionalErrors.province}</small>}
              </label>
              <label className="field">
                <span>Ciudad / Localidad</span>
                <input value={editingProfessional.city} onChange={(event) => updateProfessionalField("city", event.target.value)} placeholder="Ej: San Salvador de Jujuy" />
                {professionalErrors.city && <small className="field-error">{professionalErrors.city}</small>}
              </label>
              <label className="field">
                <span>Estado de agenda publica</span>
                <select value={editingProfessional.availability} onChange={(event) => updateProfessionalField("availability", event.target.value)}>
                  {["Manana", "Esta semana", "Proxima semana"].map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Direccion</span>
                <input value={editingProfessional.address} onChange={(event) => updateProfessionalField("address", event.target.value)} />
                {professionalErrors.address && <small className="field-error">{professionalErrors.address}</small>}
              </label>
              <div className="map-query-preview">
                <strong>Google Maps buscara:</strong>
                <span>{buildAddressQuery(editingProfessional) || "Completa direccion, ciudad y provincia."}</span>
              </div>
              <label className="field">
                <span>Telefono</span>
                <input value={editingProfessional.phone} onChange={(event) => updateProfessionalField("phone", event.target.value)} />
                {professionalErrors.phone && <small className="field-error">{professionalErrors.phone}</small>}
              </label>
              <label className="field">
                <span>Modalidad</span>
                <select value={editingProfessional.modality} onChange={(event) => updateProfessionalField("modality", event.target.value)}>
                  {["Presencial", "Virtual", "Presencial y virtual"].map((option) => <option key={option}>{option}</option>)}
                </select>
              </label>
              <label className="field">
                <span>Dias de atencion</span>
                <input value={editingProfessional.workDays} onChange={(event) => updateProfessionalField("workDays", event.target.value)} placeholder="Ej: Lunes, miercoles y viernes" />
                {professionalErrors.workDays && <small className="field-error">{professionalErrors.workDays}</small>}
              </label>
              <label className="field wide">
                <span>Horarios de atencion</span>
                <input value={editingProfessional.scheduleNotes} onChange={(event) => updateProfessionalField("scheduleNotes", event.target.value)} placeholder="Ej: 9 a 12 y 17 a 20" />
                {professionalErrors.scheduleNotes && <small className="field-error">{professionalErrors.scheduleNotes}</small>}
              </label>
              <label className="field wide">
                <span>Formacion</span>
                <textarea value={editingProfessional.formation} onChange={(event) => updateProfessionalField("formation", event.target.value)} />
              </label>
            </div>
            <div className="actions">
              <button className="primary-btn" onClick={saveProfessional} disabled={isSavingProfessional}>
                {isSavingProfessional ? "Guardando..." : "Guardar cambios"}
              </button>
              <button className="ghost-btn" onClick={() => setEditingProfessional(null)}>Cancelar</button>
            </div>
          </div>
        )}
        <div className="abm-list">
          {professionals.map((professional) => (
            <article key={professional.id} className="abm-row">
              <div>
                <strong>{professional.name}</strong>
                <p className="muted">{professional.specialty} - {professional.province}</p>
                <p className="muted">{professional.licenseNumber || "MP sin cargar"} - {professional.email || "Sin email de acceso"}</p>
              </div>
              <span className={professional.active ? "tag" : "tag warn"}>
                {professional.active ? "Activo" : "Inactivo"}
              </span>
              <div className="actions">
                <button className="soft-btn" onClick={() => startEditProfessional(professional)}>Editar</button>
                <button className={professional.active ? "danger-btn" : "soft-btn"} onClick={() => toggleProfessionalStatus(professional)}>
                  {professional.active ? "Desactivar" : "Reactivar"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="dashboard-layout">
        <div>
          <h3>Agenda semanal</h3>
          {visibleAppointments.length === 0 && <p className="muted">No tenes turnos asignados por el momento.</p>}
          {visibleAppointments.map((appointment) => (
            <article className="appointment-card" key={appointment.id}>
              <header>
                <div>
                  <h3>{appointment.childName}</h3>
                  <p className="muted">{appointment.date} · {appointment.professionalName}</p>
                </div>
                <span className="tag">{appointment.status}</span>
              </header>
            </article>
          ))}
        </div>
        <div className="form-panel">
          <h3>Cargar informe de sesión</h3>
          <div className="form-grid">
            <label className="field">
              <span>Fecha</span>
              <input value={report.date} onChange={(event) => setReport({ ...report, date: event.target.value })} />
            </label>
            <label className="field">
              <span>Progreso</span>
              <input type="number" min="0" max="100" value={report.progress} onChange={(event) => setReport({ ...report, progress: Number(event.target.value) })} />
            </label>
            <label className="field wide">
              <span>Objetivos trabajados</span>
              <textarea value={report.objectives} onChange={(event) => setReport({ ...report, objectives: event.target.value })} />
            </label>
            <label className="field wide">
              <span>Observaciones</span>
              <textarea value={report.notes} onChange={(event) => setReport({ ...report, notes: event.target.value })} />
            </label>
          </div>
          <button className="primary-btn" onClick={saveReport}>Guardar informe</button>
        </div>
      </section>
    </main>
  );
}
