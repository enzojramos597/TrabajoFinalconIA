"use client";

import { useEffect, useMemo, useState } from "react";
import { hasSupabaseConfig, supabase } from "../lib/supabaseClient";

const initialProfessionals = [
  {
    id: 1,
    name: "Lic. Mariana Torres",
    initials: "MT",
    province: "Buenos Aires",
    specialty: "Dificultades de aprendizaje",
    availability: "Esta semana",
    address: "Av. Rivadavia 1845, CABA",
    phone: "5491134567890",
    formation: "Licenciada en Psicopedagogía. Orientación en alfabetización inicial y apoyo escolar.",
    active: true,
    progress: 76,
    coords: { top: "49%", left: "66%" },
  },
  {
    id: 2,
    name: "Lic. Pablo Sosa",
    initials: "PS",
    province: "Cordoba",
    specialty: "Orientación vocacional",
    availability: "Manana",
    address: "Bv. San Juan 720, Cordoba",
    phone: "5493514567890",
    formation: "Psicopedagogo especializado en adolescentes, proyectos escolares y orientacion vocacional.",
    active: true,
    progress: 64,
    coords: { top: "43%", left: "48%" },
  },
  {
    id: 3,
    name: "Lic. Sofia Pereyra",
    initials: "SP",
    province: "Mendoza",
    specialty: "Atencion y funciones ejecutivas",
    availability: "Proxima semana",
    address: "San Martin 1120, Mendoza",
    phone: "5492614567890",
    formation: "Especialista en procesos atencionales, planificación y estrategias de estudio.",
    active: true,
    progress: 82,
    coords: { top: "52%", left: "34%" },
  },
  {
    id: 4,
    name: "Lic. Valeria Gomez",
    initials: "VG",
    province: "Santa Fe",
    specialty: "Primera infancia",
    availability: "Esta semana",
    address: "Pellegrini 890, Rosario",
    phone: "5493414567890",
    formation: "Acompanamiento temprano, desarrollo infantil y trabajo con familias.",
    active: true,
    progress: 71,
    coords: { top: "39%", left: "58%" },
  },
];

const workHours = ["09:00", "10:00", "11:00", "17:00", "18:00", "19:00"];

function mapProfessionalFromDb(row) {
  return {
    id: row.id,
    name: row.name,
    initials: row.initials,
    email: row.email || "",
    licenseNumber: row.license_number || "",
    province: row.province,
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

function mapProfessionalToDb(professional) {
  return {
    name: professional.name,
    initials: professional.initials || "PR",
    email: professional.email || "",
    license_number: professional.licenseNumber || "",
    province: professional.province,
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

function mapAppointmentFromDb(row) {
  return {
    id: row.id,
    professionalId: row.professional_id,
    professionalName: row.professional_name,
    date: row.date_label,
    dateISO: row.date_iso,
    time: row.time,
    childName: row.child_name,
    status: row.status,
  };
}

function mapAppointmentToDb(appointment, family) {
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
const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

function toDateInputValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInput(value) {
  return new Date(`${value}T00:00:00`);
}

function addDays(date, amount) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + amount);
  return nextDate;
}

function isWeekday(dateISO) {
  const day = parseDateInput(dateISO).getDay();
  return day >= 1 && day <= 5;
}

function getInitialBookingDate() {
  let date = new Date();
  for (let index = 0; index < 7; index += 1) {
    const candidate = addDays(date, index);
    const value = toDateInputValue(candidate);
    if (isWeekday(value)) return value;
  }
  return toDateInputValue(date);
}

function getUpcomingWeekdays(fromDateISO) {
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

function formatDateLabel(dateISO) {
  const date = parseDateInput(dateISO);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${dayNames[date.getDay()]} ${day}/${month}`;
}

function formatAppointmentLabel(dateISO, time) {
  const date = parseDateInput(dateISO);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${dayNames[date.getDay()]} ${day}/${month}/${year} ${time}`;
}

const argentinaProvinces = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Cordoba",
  "Corrientes",
  "Entre Rios",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquen",
  "Rio Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucuman",
];

const resources = [
  {
    title: "Senales de alerta en edad escolar",
    age: "6 a 12 anos",
    area: "Aprendizaje",
    image: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80')",
  },
  {
    title: "Ejercicios para organizar rutinas",
    age: "Familias",
    area: "Habitos",
    image: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80')",
  },
  {
    title: "Guia para preparar la primera consulta",
    age: "Todas las edades",
    area: "Orientación",
    image: "url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80')",
  },
];

const initialFamily = {
  parentName: "Carolina Ruiz",
  email: "carolina@email.com",
  whatsapp: "5491122233344",
  childName: "Mateo",
  childAge: "8",
  reason: "Dificultades para sostener la atención y organizar tareas escolares.",
};

const initialSessions = [
  {
    date: "04/06/2026",
    professional: "Lic. Mariana Torres",
    objectives: "Organizacion de consignas y lectura comprensiva.",
    notes: "Se observo buena respuesta a apoyos visuales y pausas breves.",
    progress: 62,
  },
  {
    date: "09/06/2026",
    professional: "Lic. Mariana Torres",
    objectives: "Planificación de tareas y seguimiento de instrucciones.",
    notes: "La familia aplico rutina semanal. Se recomienda sostener el mismo formato.",
    progress: 76,
  },
];

const loginProfiles = [
  {
    id: "family",
    title: "Padre / Tutor",
    description: "Familias que buscan profesionales, reservan turnos y consultan el seguimiento del hijo/a.",
    email: "familia@email.com",
    targetPage: "profesionales",
  },
  {
    id: "professional",
    title: "Profesional",
    description: "Profesionales que gestionan agenda, pacientes, informes y disponibilidad.",
    email: "profesional@centro.com",
    targetPage: "profesional",
  },
];

const roleConfig = {
  family: {
    id: "family",
    title: "Padre / Tutor",
    targetPage: "familia",
  },
  professional: {
    id: "professional",
    title: "Profesional",
    targetPage: "profesional",
  },
  admin: {
    id: "admin",
    title: "Administrador",
    targetPage: "admin",
  },
};

function App() {
  const [page, setPage] = useState("inicio");
  const [professionals, setProfessionals] = useState(initialProfessionals);
  const [selectedProfessional, setSelectedProfessional] = useState(initialProfessionals[0]);
  const [isFamilyLoggedIn, setIsFamilyLoggedIn] = useState(false);
  const [session, setSession] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingReservation, setPendingReservation] = useState(false);
  const [family, setFamily] = useState(initialFamily);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      professionalId: 1,
      professionalName: "Lic. Mariana Torres",
      date: "Miércoles 10/06/2026 10:00",
      dateISO: "2026-06-10",
      time: "10:00",
      childName: "Mateo",
      status: "Confirmado",
    },
  ]);
  const [sessions, setSessions] = useState(initialSessions);
  const [appUsers, setAppUsers] = useState([]);
  const [dataNotice, setDataNotice] = useState(hasSupabaseConfig ? "Conectando con Supabase..." : "Modo demo local: falta configurar Supabase.");

  const navItems = [
    ["inicio", "Inicio"],
    ["profesionales", "Profesionales"],
    ["mapa", "Mapa"],
    ["recursos", "Recursos"],
    ...(session?.role === "family" ? [["familia", "Familia"]] : []),
    ...(session?.role === "professional" ? [["profesional", "Profesional"]] : []),
    ...(session?.role === "admin" ? [["admin", "Admin"]] : []),
  ];

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) return;

    let isMounted = true;

    async function loadSupabaseData() {
      const [professionalsResult, appointmentsResult, usersResult] = await Promise.all([
        supabase.from("professionals").select("*").order("id", { ascending: true }),
        supabase.from("appointments").select("*").order("date_iso", { ascending: true }).order("time", { ascending: true }),
        supabase.from("app_users").select("*").order("created_at", { ascending: false }),
      ]);

      if (!isMounted) return;

      if (professionalsResult.error || appointmentsResult.error || usersResult.error) {
        setDataNotice("No se pudo leer Supabase. El prototipo sigue en modo local.");
        return;
      }

      const nextProfessionals = professionalsResult.data.map(mapProfessionalFromDb);
      if (nextProfessionals.length > 0) {
        setProfessionals(nextProfessionals);
        setSelectedProfessional((current) =>
          nextProfessionals.find((professional) => professional.id === current.id) || nextProfessionals[0]
        );
      }

      setAppointments(appointmentsResult.data.map(mapAppointmentFromDb));
      setAppUsers(usersResult.data || []);
      setDataNotice("Datos sincronizados con Supabase.");
    }

    loadSupabaseData();

    return () => {
      isMounted = false;
    };
  }, []);

  async function saveAppointment(appointment) {
    setAppointments((currentAppointments) => [appointment, ...currentAppointments]);

    if (!supabase) {
      setDataNotice("Turno guardado en modo demo local.");
      return appointment;
    }

    const { data, error } = await supabase
      .from("appointments")
      .insert(mapAppointmentToDb(appointment, family))
      .select()
      .single();

    if (error) {
      setDataNotice("El horario ya estaba ocupado o Supabase no pudo guardar el turno.");
      setAppointments((currentAppointments) => currentAppointments.filter((item) => item.id !== appointment.id));
      throw error;
    }

    const savedAppointment = mapAppointmentFromDb(data);
    setAppointments((currentAppointments) =>
      currentAppointments.map((item) => item.id === appointment.id ? savedAppointment : item)
    );
    setDataNotice("Turno guardado en Supabase.");
    return savedAppointment;
  }

  async function saveProfessionalRecord(professional) {
    if (professional.id) {
      setProfessionals((currentProfessionals) =>
        currentProfessionals.map((item) => item.id === professional.id ? professional : item)
      );
    } else {
      setProfessionals((currentProfessionals) => [...currentProfessionals, professional]);
    }

    if (!supabase) {
      setDataNotice("Profesional guardado en modo demo local.");
      return professional;
    }

    const payload = mapProfessionalToDb(professional);
    const query = professional.id
      ? supabase.from("professionals").update(payload).eq("id", professional.id).select().single()
      : supabase.from("professionals").insert(payload).select().single();

    const { data, error } = await query;

    if (error) {
      setDataNotice("Supabase no pudo guardar el profesional.");
      throw error;
    }

    const savedProfessional = mapProfessionalFromDb(data);
    if (savedProfessional.email && supabase) {
      await supabase
        .from("app_users")
        .upsert({
          role: "professional",
          name: savedProfessional.name,
          email: savedProfessional.email,
          whatsapp: savedProfessional.phone,
          specialty: savedProfessional.specialty,
          license_number: savedProfessional.licenseNumber,
          province: savedProfessional.province,
          status: savedProfessional.active ? "Activo" : "Inactivo",
        }, { onConflict: "role,email" });
    }

    setProfessionals((currentProfessionals) => {
      const exists = currentProfessionals.some((item) => item.id === professional.id);
      return exists
        ? currentProfessionals.map((item) => item.id === professional.id ? savedProfessional : item)
        : currentProfessionals.map((item) => item.id === professional.id ? savedProfessional : item);
    });
    setSelectedProfessional((current) => current.id === professional.id ? savedProfessional : current);
    setDataNotice("Profesional guardado en Supabase.");
    return savedProfessional;
  }

  async function toggleProfessionalRecord(professional) {
    const nextProfessional = { ...professional, active: !professional.active };
    setProfessionals((currentProfessionals) =>
      currentProfessionals.map((item) => item.id === professional.id ? nextProfessional : item)
    );

    if (!supabase) {
      setDataNotice("Estado actualizado en modo demo local.");
      return;
    }

    const { error } = await supabase
      .from("professionals")
      .update({ active: nextProfessional.active })
      .eq("id", professional.id);

    if (error) {
      setDataNotice("Supabase no pudo actualizar el estado del profesional.");
      setProfessionals((currentProfessionals) =>
        currentProfessionals.map((item) => item.id === professional.id ? professional : item)
      );
      throw error;
    }

    setDataNotice("Estado del profesional actualizado en Supabase.");
  }

  async function saveUserAccount(profile, data) {
    const newUser = {
      role: profile.id,
      name: data.name,
      email: data.email,
      whatsapp: data.whatsapp || "",
      child_name: data.childName || "",
      child_age: data.childAge || "",
      consultation_reason: data.reason || "",
      specialty: data.specialty || "",
      license_number: data.licenseNumber || "",
      province: data.province || "",
      internal_code: data.internalCode || "",
      status: profile.id === "family" ? "Activo" : "Pendiente",
    };

    if (!supabase) {
      setDataNotice("Usuario registrado en modo demo local.");
      setAppUsers((currentUsers) => [{ ...newUser, id: Date.now() }, ...currentUsers]);
      return;
    }

    const { data: savedUser, error } = await supabase
      .from("app_users")
      .insert(newUser)
      .select()
      .single();

    if (error) {
      setDataNotice("Supabase no pudo registrar el usuario. Revisa si ya existe o falta ejecutar el SQL actualizado.");
      throw error;
    }

    setAppUsers((currentUsers) => [savedUser, ...currentUsers]);
    setDataNotice(`Usuario ${profile.title} registrado en Supabase.`);
  }

  async function findUserAccount(data) {
    if (!supabase) return null;

    const { data: userAccounts, error } = await supabase
      .from("app_users")
      .select("*")
      .eq("email", data.email)
      .limit(1);

    if (error) {
      setDataNotice("No se pudo consultar el usuario en Supabase.");
      throw error;
    }

    return userAccounts?.[0] || null;
  }

  async function updateUserStatus(user, status) {
    setAppUsers((currentUsers) =>
      currentUsers.map((item) => item.id === user.id ? { ...item, status } : item)
    );

    if (!supabase) {
      setDataNotice("Estado de usuario actualizado en modo demo local.");
      return;
    }

    const { error } = await supabase
      .from("app_users")
      .update({ status })
      .eq("id", user.id);

    if (error) {
      setDataNotice("Supabase no pudo actualizar el usuario.");
      throw error;
    }

    setDataNotice("Usuario actualizado en Supabase.");
  }

  function goToProfessional(professional) {
    if (session?.role && session.role !== "family") {
      setDataNotice("Solo los padres o tutores pueden seleccionar profesionales y reservar turnos.");
      return;
    }

    if (!session) {
      setSelectedProfessional(professional);
      setPendingReservation(true);
      setShowLogin(true);
      return;
    }

    setSelectedProfessional(professional);
    setPage("reserva");
  }

  function renderPage() {
    const shared = {
      family,
      setFamily,
      isFamilyLoggedIn,
      setIsFamilyLoggedIn,
      appointments,
      setAppointments,
      sessions,
      setSessions,
      professionals,
      setProfessionals,
      selectedProfessional,
      setSelectedProfessional,
      session,
      goToProfessional,
      saveAppointment,
      saveProfessionalRecord,
      toggleProfessionalRecord,
      updateUserStatus,
      appUsers,
      setPage,
    };

    if (page === "inicio") return <Home setPage={setPage} goToProfessional={goToProfessional} professionals={professionals} />;
    if (page === "profesionales") return <Professionals {...shared} />;
    if (page === "reserva") return <Booking {...shared} />;
    if (page === "mapa") return <MapView goToProfessional={goToProfessional} professionals={professionals} />;
    if (page === "recursos") return <Resources />;
    if (page === "familia") return <FamilyPanel {...shared} />;
    if (page === "profesional") return <ProfessionalPanel {...shared} />;
    if (page === "admin") return <AdminPanel appointments={appointments} professionals={professionals} appUsers={appUsers} setPage={setPage} toggleProfessionalRecord={toggleProfessionalRecord} updateUserStatus={updateUserStatus} />;
  }

  async function handleLogin(profile, data, mode) {
    let userAccount = null;

    if (mode === "register") {
      profile = roleConfig.family;
      await saveUserAccount(profile, data);
    } else {
      userAccount = await findUserAccount(data);

      if (!userAccount) {
        throw new Error("Cuenta no registrada");
      }

      profile = roleConfig[userAccount.role] || roleConfig.family;
    }

    const accountName = userAccount?.name || data.name || profile.title;

    const nextSession = {
      role: profile.id,
      roleLabel: profile.title,
      name: accountName,
      email: userAccount?.email || data.email || profile.email,
    };

    setSession(nextSession);
    setShowLogin(false);

    if (profile.id === "family") {
      setIsFamilyLoggedIn(true);
      setFamily({
        ...family,
        parentName: accountName,
        email: userAccount?.email || data.email || family.email,
        whatsapp: userAccount?.whatsapp || data.whatsapp || family.whatsapp,
        childName: userAccount?.child_name || data.childName || family.childName,
        childAge: userAccount?.child_age || data.childAge || family.childAge,
        reason: userAccount?.consultation_reason || data.reason || family.reason,
      });
    }

    setPage(profile.id === "family" && pendingReservation ? "reserva" : profile.targetPage);
    setPendingReservation(false);
  }

  function handleLogout() {
    setSession(null);
    setIsFamilyLoggedIn(false);
    setPendingReservation(false);
    setPage("inicio");
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand ghost-btn" onClick={() => setPage("inicio")} aria-label="Ir al inicio">
          <img className="brand-icon" src="/psico-puente-icon.png" alt="" aria-hidden="true" />
          <span className="brand-text">
            <strong>Psico-Puente</strong>
            <span>Centro Psicopedagógico</span>
          </span>
        </button>
        <nav className="nav" aria-label="Navegacion principal">
          {navItems.map(([key, label]) => (
            <button key={key} className={page === key ? "active" : ""} onClick={() => setPage(key)}>
              {label}
            </button>
          ))}
        </nav>
        <div className="top-actions">
          {session && <span className="role-pill">{session.name}</span>}
          {!session && <button className="ghost-btn" onClick={() => setShowLogin(true)}>Login</button>}
          {session && <button className="soft-btn" onClick={handleLogout}>Salir</button>}
          {session && <button className="soft-btn" onClick={() => setPage(session.role === "professional" ? "profesional" : session.role === "admin" ? "admin" : "familia")}>Mi panel</button>}
          {(!session || session.role === "family") && <button className="primary-btn" onClick={() => setPage("profesionales")}>Reservar</button>}
        </div>
      </header>
      <div className={hasSupabaseConfig ? "data-status synced" : "data-status"}>
        {dataNotice}
      </div>
      {renderPage()}
      {showLogin && (
        <LoginModal
          session={session}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

function LoginModal({ onClose, onLogin }) {
  const [mode, setMode] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [data, setData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    password: "",
    passwordConfirm: "",
    childName: "",
    childAge: "",
    reason: "",
    specialty: "",
    licenseNumber: "",
    province: "Buenos Aires",
    internalCode: "",
  });

  function updateData(field, value) {
    setData({ ...data, [field]: value });
  }

  async function submitAccess() {
    if (!data.email || !data.password) {
      setMessage("Completa correo y contrasena para continuar.");
      return;
    }

    if (mode === "register" && !data.name) {
      setMessage("Completa el nombre completo para registrarte.");
      return;
    }

    if (mode === "register" && data.password !== data.passwordConfirm) {
      setMessage("Las claves no coinciden.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");
      await onLogin(roleConfig.family, data, mode);
    } catch {
      setMessage(mode === "login"
        ? "No encontramos una cuenta con ese correo y perfil. Usa Registrarse para crearla."
        : "No se pudo completar el registro. Verifica Supabase o intenta con otro email.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Login por perfil">
      <section className="login-modal">
        <header className="modal-head">
          <div>
            <p className="eyebrow">Acceso al sistema</p>
            <h2>{mode === "login" ? "Iniciar sesion" : "Crear cuenta"}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar login">x</button>
        </header>

        <p className="login-intro">
          {mode === "login"
            ? "Ingresa con tu correo y contrasena. El sistema detecta si sos padre/tutor, profesional o administrador."
            : "Registro exclusivo para padres y tutores que necesitan reservar turnos."}
        </p>

        <div className="form-grid">
          {mode === "register" && (
            <label className="field">
              <span>Nombre completo</span>
              <input value={data.name} onChange={(event) => updateData("name", event.target.value)} placeholder="Ej: Enzo Ramos" />
            </label>
          )}
          <label className="field">
            <span>Correo electronico</span>
            <input type="email" value={data.email} onChange={(event) => updateData("email", event.target.value)} placeholder="Ej: enzo.j.ramos@gmail.com" />
          </label>
          <label className="field">
            <span>Contrasena</span>
            <input type="password" value={data.password} onChange={(event) => updateData("password", event.target.value)} placeholder="********" />
          </label>
          {mode === "register" && (
            <label className="field">
              <span>Repetir contrasena</span>
              <input type="password" value={data.passwordConfirm} onChange={(event) => updateData("passwordConfirm", event.target.value)} placeholder="********" />
            </label>
          )}

          {mode === "register" && (
            <>
              <label className="field">
                <span>WhatsApp</span>
                <input value={data.whatsapp} onChange={(event) => updateData("whatsapp", event.target.value)} placeholder="Ej: 5491122233344" />
              </label>
              <label className="field">
                <span>Nombre del hijo/a</span>
                <input value={data.childName} onChange={(event) => updateData("childName", event.target.value)} placeholder="Ej: Martina" />
              </label>
              <label className="field">
                <span>Edad</span>
                <input value={data.childAge} onChange={(event) => updateData("childAge", event.target.value)} placeholder="Ej: 8" />
              </label>
              <label className="field wide">
                <span>Motivo de consulta</span>
                <textarea value={data.reason} onChange={(event) => updateData("reason", event.target.value)} placeholder="Ej: Dificultades para sostener la atencion y organizar tareas escolares." />
              </label>
            </>
          )}
        </div>

        <div className="login-helper">
          {mode === "login" ? (
            <p>No tenes cuenta? <button onClick={() => setMode("register")}>Registrarse</button></p>
          ) : (
            <p>Ya tenes cuenta? <button onClick={() => setMode("login")}>Iniciar sesion</button></p>
          )}
        </div>

        <div className="notice">
          <strong>Prototipo de autenticacion</strong>
          <p>{mode === "login"
            ? "Los profesionales y administradores deben estar dados de alta previamente por administracion."
            : "El registro guarda una cuenta familiar en Supabase. La clave no se persiste en texto plano."}</p>
        </div>

        {message && (
          <div className="notice warn-notice">
            <strong>Atencion</strong>
            <p>{message}</p>
          </div>
        )}

        <div className="actions">
          <button className="primary-btn" onClick={submitAccess} disabled={isSubmitting}>
            {isSubmitting
              ? "Procesando..."
              : mode === "login"
                ? "Ingresar"
                : "Registrarme como padre/tutor"}
          </button>
          <button className="ghost-btn" onClick={onClose}>Cancelar</button>
        </div>
      </section>
    </div>
  );
}

function Home({ setPage, goToProfessional, professionals }) {
  const firstActiveProfessional = professionals.find((professional) => professional.active) || professionals[0];
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
            <div className="stat"><strong>4</strong><span>provincias activas</span></div>
            <div className="stat"><strong>12</strong><span>turnos semanales</span></div>
            <div className="stat"><strong>3</strong><span>áreas de trabajo</span></div>
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

function Professionals({ goToProfessional, professionals }) {
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
  }, [query, province, specialty, availability]);

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
          <a className="ghost-btn" href={mapsUrl(professional.address)} target="_blank">Como llegar</a>
        </div>
      </div>
    </article>
  );
}

function Booking({ selectedProfessional, family, setFamily, isFamilyLoggedIn, setIsFamilyLoggedIn, appointments, saveAppointment, setPage }) {
  const [selectedDate, setSelectedDate] = useState(getInitialBookingDate());
  const [slot, setSlot] = useState(workHours[0]);
  const [confirmed, setConfirmed] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authData, setAuthData] = useState({
    parentName: family.parentName,
    email: family.email,
    whatsapp: family.whatsapp,
    password: "",
  });

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
      status: "Confirmado",
    };

    try {
      setIsSaving(true);
      const savedAppointment = await saveAppointment(appointment);
      setConfirmed(savedAppointment);
    } catch {
      setConfirmed(null);
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

  function updateAuth(field, value) {
    setAuthData({ ...authData, [field]: value });
  }

  function accessFamilyAccount() {
    setFamily({
      ...family,
      parentName: authData.parentName || family.parentName,
      email: authData.email || family.email,
      whatsapp: authData.whatsapp || family.whatsapp,
    });
    setIsFamilyLoggedIn(true);
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

  const message = confirmed
    ? `Hola ${family.parentName}. Confirmamos el turno para ${family.childName} con ${confirmed.professionalName} el ${confirmed.date} en ${selectedProfessional.address}.`
    : "";

  return (
    <main className="page">
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
          <a className="ghost-btn" href={mapsUrl(selectedProfessional.address)} target="_blank">Abrir Google Maps</a>
        </aside>

        <section className="form-panel">
          {!isFamilyLoggedIn ? (
            <>
              <div className="auth-head">
                <div>
                  <h3>Acceso de padre o tutor</h3>
                  <p className="muted">Para reservar un turno, primero ingresa con una cuenta familiar.</p>
                </div>
                <div className="auth-switch" aria-label="Modo de acceso">
                  <button className={authMode === "login" ? "active" : ""} onClick={() => setAuthMode("login")}>
                    Ingresar
                  </button>
                  <button className={authMode === "register" ? "active" : ""} onClick={() => setAuthMode("register")}>
                    Registrarse
                  </button>
                </div>
              </div>

              <div className="form-grid">
                <label className="field">
                  <span>Nombre del padre/tutor</span>
                  <input value={authData.parentName} onChange={(event) => updateAuth("parentName", event.target.value)} />
                </label>
                <label className="field">
                  <span>Email</span>
                  <input type="email" value={authData.email} onChange={(event) => updateAuth("email", event.target.value)} />
                </label>
                <label className="field">
                  <span>WhatsApp</span>
                  <input value={authData.whatsapp} onChange={(event) => updateAuth("whatsapp", event.target.value)} />
                </label>
                <label className="field">
                  <span>Contraseña</span>
                  <input type="password" value={authData.password} onChange={(event) => updateAuth("password", event.target.value)} placeholder="********" />
                </label>
              </div>

              {authMode === "register" && (
                <div className="notice">
                  <strong>Cuenta familiar</strong>
                  <p>Con esta cuenta se guardaran los turnos, el historial y los informes del hijo/a.</p>
                </div>
              )}

              <div className="actions">
                <button className="primary-btn" onClick={accessFamilyAccount}>
                  {authMode === "login" ? "Ingresar y continuar" : "Crear cuenta y continuar"}
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
            <button className="ghost-btn" onClick={() => setPage("familia")}>Ir al panel</button>
          </div>

          {confirmed && (
            <div className="notice">
              <strong>Turno confirmado.</strong>
              <p>Se genero un mensaje automatico para enviar por WhatsApp.</p>
              <a className="soft-btn" href={`https://wa.me/${family.whatsapp}?text=${encodeURIComponent(message)}`} target="_blank">
                Enviar confirmacion
              </a>
            </div>
          )}
            </>
          )}
        </section>
      </section>
    </main>
  );
}

function FamilyPanel({ family, setFamily, appointments, setAppointments, sessions }) {
  const [tab, setTab] = useState("turnos");

  function cancelAppointment(id) {
    setAppointments(appointments.map((item) => item.id === id ? { ...item, status: "Cancelado" } : item));
  }

  return (
    <main className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">Panel familiar</p>
          <h2>Hola, {family.parentName}</h2>
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
          {appointments.map((appointment) => (
            <article className="appointment-card" key={appointment.id}>
              <header>
                <div>
                  <h3>{appointment.professionalName}</h3>
                  <p className="muted">{appointment.date} · {appointment.childName}</p>
                </div>
                <span className={appointment.status === "Confirmado" ? "tag" : "tag warn"}>{appointment.status}</span>
              </header>
              <div className="actions">
                <button className="soft-btn">Reprogramar</button>
                <button className="danger-btn" onClick={() => cancelAppointment(appointment.id)}>Cancelar</button>
              </div>
            </article>
          ))}
        </section>
      )}

      {tab === "historial" && (
        <section>
          {sessions.map((session) => <SessionRow key={session.date} session={session} />)}
        </section>
      )}

      {tab === "evolucion" && (
        <section className="grid two">
          <article className="card">
            <h3>Progreso general</h3>
            <p className="muted">Gráfico simple construido con los registros de sesión.</p>
            <div className="chart">
              {sessions.map((session) => <div key={session.date} className="bar" style={{ height: `${session.progress}%` }} title={`${session.progress}%`} />)}
            </div>
          </article>
          <article className="card">
            <h3>Proximos pasos</h3>
            <p>Continuar con rutinas visuales, pausas activas y seguimiento semanal de consignas escolares.</p>
            <div className="progress"><span style={{ width: "76%" }} /></div>
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

function ProfessionalPanel({ appointments, sessions, setSessions, session, professionals, saveProfessionalRecord, toggleProfessionalRecord }) {
  const visibleAppointments = session?.role === "professional"
    ? appointments.filter((appointment) => appointment.professionalName === session.name)
    : appointments;
  const emptyProfessional = {
    id: null,
    name: "",
    initials: "",
    email: "",
    licenseNumber: "",
    province: "Buenos Aires",
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
  const [report, setReport] = useState({
    date: "10/06/2026",
    professional: "Lic. Mariana Torres",
    objectives: "Comprension de consignas y planificacion semanal.",
    notes: "Se trabajo con agenda visual y consignas divididas en pasos.",
    progress: 80,
  });

  function saveReport() {
    setSessions([report, ...sessions]);
  }

  function startNewProfessional() {
    setEditingProfessional(emptyProfessional);
  }

  function startEditProfessional(professional) {
    setEditingProfessional({ ...professional });
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
  }

  async function saveProfessional() {
    if (!editingProfessional.name || !editingProfessional.specialty || !editingProfessional.province || !editingProfessional.licenseNumber) return;

    const professionalToSave = editingProfessional.id
      ? editingProfessional
      : {
          ...editingProfessional,
          id: Date.now(),
          initials: editingProfessional.initials || "PR",
        };

    try {
      setIsSavingProfessional(true);
      await saveProfessionalRecord(professionalToSave);
      setEditingProfessional(null);
    } finally {
      setIsSavingProfessional(false);
    }
  }

  async function toggleProfessionalStatus(professional) {
    await toggleProfessionalRecord(professional);
  }

  return (
    <main className="page">
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
              </label>
              <label className="field">
                <span>Email de acceso</span>
                <input type="email" value={editingProfessional.email} onChange={(event) => updateProfessionalField("email", event.target.value)} placeholder="Ej: profesional@psicopuente.com" />
              </label>
              <label className="field">
                <span>Especialidad</span>
                <input value={editingProfessional.specialty} onChange={(event) => updateProfessionalField("specialty", event.target.value)} />
              </label>
              <label className="field">
                <span>Matricula profesional (MP)</span>
                <input value={editingProfessional.licenseNumber} onChange={(event) => updateProfessionalField("licenseNumber", event.target.value)} placeholder="Ej: MP 12345" />
              </label>
              <label className="field">
                <span>Provincia</span>
                <select value={editingProfessional.province} onChange={(event) => updateProfessionalField("province", event.target.value)}>
                  {argentinaProvinces.map((province) => <option key={province}>{province}</option>)}
                </select>
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
              </label>
              <label className="field">
                <span>Telefono</span>
                <input value={editingProfessional.phone} onChange={(event) => updateProfessionalField("phone", event.target.value)} />
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
              </label>
              <label className="field wide">
                <span>Horarios de atencion</span>
                <input value={editingProfessional.scheduleNotes} onChange={(event) => updateProfessionalField("scheduleNotes", event.target.value)} placeholder="Ej: 9 a 12 y 17 a 20" />
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

function AdminPanel({ appointments, professionals, appUsers, setPage, toggleProfessionalRecord, updateUserStatus }) {
  const familyUsers = appUsers.filter((user) => user.role === "family");
  const professionalUsers = appUsers.filter((user) => user.role === "professional");

  return (
    <main className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">Administracion</p>
          <h2>Gestion general del centro</h2>
          <p>Panel para administrar medicos, padres/tutores, turnos e indicadores principales.</p>
        </div>
      </div>
      <section className="admin-stats">
        <div className="stat"><strong>{professionals.length}</strong><span>profesionales</span></div>
        <div className="stat"><strong>{familyUsers.length}</strong><span>padres/tutores</span></div>
        <div className="stat"><strong>{appointments.length}</strong><span>turnos registrados</span></div>
        <div className="stat"><strong>{professionalUsers.length}</strong><span>usuarios medicos</span></div>
      </section>
      <section className="grid two">
        {professionals.map((professional, index) => (
          <article className="card" key={professional.id}>
            <h3>{professional.name}</h3>
            <p className="muted">{professional.specialty} · {professional.province}</p>
            <div className="tags">
              <span className={index === 2 ? "tag warn" : "tag"}>{index === 2 ? "Pendiente de verificacion" : "Matricula verificada"}</span>
            </div>
            <div className="actions">
              <button className="soft-btn">Aprobar</button>
              <button className="ghost-btn">Revisar perfil</button>
            </div>
          </article>
        ))}
      </section>
      <section className="card abm-panel">
        <div className="section-head compact">
          <div>
            <h3>ABM de medicos</h3>
            <p>Alta, edicion y activacion se gestionan desde el panel profesional.</p>
          </div>
          <button className="primary-btn" onClick={() => setPage("profesional")}>Abrir ABM medicos</button>
        </div>
        <div className="abm-list">
          {professionals.map((professional) => (
            <article key={professional.id} className="abm-row">
              <div>
                <strong>{professional.name}</strong>
                <p className="muted">{professional.specialty} · {professional.province}</p>
              </div>
              <span className={professional.active ? "tag" : "tag warn"}>{professional.active ? "Activo" : "Inactivo"}</span>
              <div className="actions">
                <button className={professional.active ? "danger-btn" : "soft-btn"} onClick={() => toggleProfessionalRecord(professional)}>
                  {professional.active ? "Desactivar" : "Reactivar"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card abm-panel">
        <div className="section-head compact">
          <div>
            <h3>Padres y tutores registrados</h3>
            <p>Usuarios finales habilitados para seleccionar profesional y reservar turnos.</p>
          </div>
        </div>
        <div className="abm-list">
          {familyUsers.length === 0 && <p className="muted">Todavia no hay padres o tutores registrados.</p>}
          {familyUsers.map((user) => (
            <article key={user.id} className="abm-row">
              <div>
                <strong>{user.name}</strong>
                <p className="muted">{user.email} - {user.child_name || "Sin hijo/a cargado"}</p>
              </div>
              <span className={user.status === "Activo" ? "tag" : "tag warn"}>{user.status}</span>
              <div className="actions">
                <button className="soft-btn" onClick={() => updateUserStatus(user, "Activo")}>Activar</button>
                <button className="danger-btn" onClick={() => updateUserStatus(user, "Inactivo")}>Desactivar</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="card abm-panel">
        <div className="section-head compact">
          <div>
            <h3>Usuarios profesionales</h3>
            <p>Los profesionales no se registran publicamente: los da de alta administracion.</p>
          </div>
        </div>
        <div className="abm-list">
          {professionalUsers.length === 0 && <p className="muted">No hay usuarios profesionales cargados como login.</p>}
          {professionalUsers.map((user) => (
            <article key={user.id} className="abm-row">
              <div>
                <strong>{user.name}</strong>
                <p className="muted">{user.email} - {user.specialty || "Sin especialidad"}</p>
              </div>
              <span className={user.status === "Activo" ? "tag" : "tag warn"}>{user.status}</span>
              <div className="actions">
                <button className="soft-btn" onClick={() => updateUserStatus(user, "Activo")}>Aprobar</button>
                <button className="danger-btn" onClick={() => updateUserStatus(user, "Inactivo")}>Desactivar</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function MapView({ goToProfessional, professionals }) {
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
                <a className="ghost-btn" href={mapsUrl(professional.address)} target="_blank">Como llegar</a>
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

function Resources() {
  return (
    <main className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">Actividades y recursos</p>
          <h2>Guías para acompañar desde casa</h2>
          <p>Material orientativo ordenado por edad y area de trabajo.</p>
        </div>
      </div>
      <section className="grid">
        {resources.map((resource) => (
          <article className="resource-card" key={resource.title}>
            <div className="resource-media" style={{ "--image": resource.image }} />
            <div className="content">
              <h3>{resource.title}</h3>
              <div className="tags">
                <span className="tag">{resource.age}</span>
                <span className="tag blue">{resource.area}</span>
              </div>
              <button className="soft-btn">Descargar guia</button>
            </div>
          </article>
        ))}
      </section>
      <Faq embedded />
    </main>
  );
}

function Faq({ embedded = false }) {
  const questions = [
    ["¿Qué es la psicopedagogía?", "Es una disciplina que acompaña procesos de aprendizaje, detecta dificultades y propone estrategias para mejorar la trayectoria escolar y personal."],
    ["¿Cuándo conviene consultar?", "Cuando aparecen dificultades persistentes en lectura, escritura, atención, organización, comprensión de consignas o adaptación escolar."],
    ["La primera consulta requiere diagnostico previo?", "No necesariamente. La primera entrevista ayuda a ordenar la situacion, escuchar a la familia y definir proximos pasos."],
    ["Quien carga la historia clinica?", "En este prototipo, los informes y observaciones son cargados por el profesional desde su panel privado. La familia solo puede leerlos."],
  ];

  return (
    <section className={embedded ? "faq embedded-faq" : "page faq"}>
      <div className="section-head">
        <div>
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2>Orientación inicial para familias</h2>
        </div>
      </div>
      {questions.map(([question, answer]) => (
        <details key={question}>
          <summary>{question}</summary>
          <p className="muted">{answer}</p>
        </details>
      ))}
    </section>
  );
}

function SessionRow({ session }) {
  return (
    <article className="session-row">
      <header>
        <div>
          <h3>{session.date}</h3>
          <p className="muted">{session.professional}</p>
        </div>
        <span className="tag">{session.progress}% progreso</span>
      </header>
      <p><strong>Objetivos:</strong> {session.objectives}</p>
      <p className="muted">{session.notes}</p>
      <div className="progress"><span style={{ width: `${session.progress}%` }} /></div>
    </article>
  );
}

function labelFor(value) {
  return {
    turnos: "Turnos",
    historial: "Historial",
    evolucion: "Evolución",
    perfil: "Perfil",
  }[value] || value;
}

function mapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

export default App;
