export function mapProfessionalFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    email: row.email || "",
    licenseNumber: row.license_number || "",
    province: row.province,
    city: row.city || "",
    specialty: row.specialty,
    availability: row.availability,
    address: row.address,
    phone: row.phone,
    modality: row.modality || "Presencial",
    workDays: row.work_days || "Lunes a viernes",
    scheduleNotes: row.schedule_notes || "9 a 12 y 17 a 20",
    formation: row.formation,
    active: row.active,
    progress: row.progress,
    coords: row.coords || { top: "49%", left: "66%" },
  };
}

export function mapProfessionalToDb(professional) {
  return {
    name: professional.name,
    initials: professional.initials || "PR",
    email: professional.email || "",
    license_number: professional.licenseNumber || "",
    province: professional.province,
    city: professional.city || "",
    specialty: professional.specialty,
    availability: professional.availability,
    address: professional.address,
    phone: professional.phone,
    modality: professional.modality || "Presencial",
    work_days: professional.workDays || "Lunes a viernes",
    schedule_notes: professional.scheduleNotes || "9 a 12 y 17 a 20",
    formation: professional.formation,
    active: professional.active,
    progress: Number(professional.progress) || 60,
    coords: professional.coords || { top: "49%", left: "66%" },
  };
}

export function mapAppointmentFromDb(row) {
  return {
    id: row.id,
    professionalId: row.professional_id,
    professionalName: row.professional_name,
    date: row.date_label,
    dateISO: row.date_iso,
    time: row.time,
    childName: row.child_name,
    parentName: row.parent_name,
    parentEmail: row.parent_email,
    whatsapp: row.whatsapp,
    reason: row.reason,
    status: row.status,
  };
}

export function mapAppointmentToDb(appointment, family) {
  return {
    professional_id: appointment.professionalId,
    professional_name: appointment.professionalName,
    date_label: appointment.date,
    date_iso: appointment.dateISO,
    time: appointment.time,
    child_name: appointment.childName,
    parent_name: family.parentName,
    parent_email: family.email,
    whatsapp: family.whatsapp,
    reason: family.reason,
    status: appointment.status,
  };
}
