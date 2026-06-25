import { dayNames } from "./constants";

export function whatsappLink(phone, message) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  return cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}` : "";
}

export function appointmentDateTime(appointment) {
  if (!appointment?.dateISO) return null;
  const time = appointment.time || "00:00";
  const date = new Date(`${appointment.dateISO}T${time}:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isUpcomingAppointment(appointment) {
  const date = appointmentDateTime(appointment);
  return Boolean(date && date >= new Date());
}

export function isAcceptedAppointment(appointment) {
  return appointment?.status === "Aceptado" || appointment?.status === "Confirmado";
}

export function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDateInput(value) {
  return new Date(`${value}T00:00:00`);
}

export function formatClinicalDate(value) {
  if (!value) return "";
  const date = value.includes("/") ? null : parseDateInput(value);
  if (!date || Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-AR");
}

export function sessionDateValue(session) {
  if (session.dateISO) return session.dateISO;
  if (!session.date || !session.date.includes("/")) return session.date || "";
  const [day, month, year] = session.date.split("/");
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

export function sortClinicalSessions(items) {
  return [...items].sort((a, b) => sessionDateValue(b).localeCompare(sessionDateValue(a)));
}

export function clampProgress(value) {
  return Math.max(0, Math.min(100, Number(value) || 0));
}

export function addDays(date, amount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

export function isWeekday(dateISO) {
  const day = parseDateInput(dateISO).getDay();
  return day >= 1 && day <= 5;
}

export function getInitialBookingDate() {
  const date = new Date();
  for (let index = 0; index < 7; index += 1) {
    const candidate = addDays(date, index);
    const value = toDateInputValue(candidate);
    if (isWeekday(value)) return value;
  }
  return toDateInputValue(date);
}

export function getUpcomingWeekdays(fromDateISO) {
  const start = parseDateInput(fromDateISO);
  const days = [];
  let offset = 0;

  while (days.length < 7) {
    const candidate = addDays(start, offset);
    const value = toDateInputValue(candidate);
    if (isWeekday(value)) days.push(value);
    offset += 1;
  }

  return days;
}

export function formatDateLabel(dateISO) {
  const date = parseDateInput(dateISO);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${dayNames[date.getDay()]} ${day}/${month}`;
}

export function formatAppointmentLabel(dateISO, time) {
  const date = parseDateInput(dateISO);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${dayNames[date.getDay()]} ${day}/${month}/${year} ${time}`;
}

export function labelFor(value) {
  return {
    turnos: "Turnos",
    historial: "Historial",
    evolucion: "Evolución",
    perfil: "Perfil",
  }[value] || value;
}

export function buildAddressQuery(professional) {
  if (!professional) return "";
  return [
    professional.address,
    professional.city,
    professional.province,
    "Argentina",
  ]
    .filter(Boolean)
    .join(", ");
}

export function mapsUrl(professional) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(buildAddressQuery(professional))}`;
}
