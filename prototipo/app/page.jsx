"use client";

import { useEffect, useState } from "react";
import { hasSupabaseConfig, supabase } from "../lib/supabaseClient";
import {
  initialProfessionals,
  initialFamily,
  initialSessions,
  roleConfig,
} from "../lib/constants";
import {
  mapProfessionalFromDb,
  mapProfessionalToDb,
  mapAppointmentFromDb,
  mapAppointmentToDb,
} from "../lib/mappers";

// Componentes compartidos
import LoginModal from "../components/shared/LoginModal";

// Páginas públicas (sin login requerido)
import Home from "../components/publico/Home";
import Professionals from "../components/publico/Professionals";
import Booking from "../components/publico/Booking";
import MapView from "../components/publico/MapView";
import Resources from "../components/publico/Resources";

// Paneles por rol
import FamilyPanel from "../components/familia/FamilyPanel";
import ProfessionalPanel from "../components/profesional/ProfessionalPanel";
import AdminPanel from "../components/admin/AdminPanel";

export default function App() {
  const [page, setPage] = useState("inicio");
  const [professionals, setProfessionals] = useState(initialProfessionals);
  const [selectedProfessional, setSelectedProfessional] = useState(initialProfessionals[0]);
  const [isFamilyLoggedIn, setIsFamilyLoggedIn] = useState(false);
  const [session, setSession] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [pendingReservation, setPendingReservation] = useState(false);
  const [appToast, setAppToast] = useState(null);
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

  async function updateAppointmentStatus(appointmentId, status) {
    const previousAppointments = appointments;
    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, status } : appointment
      )
    );

    if (!supabase) {
      setDataNotice(`Turno marcado como ${status.toLowerCase()} en modo demo local.`);
      return;
    }

    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", appointmentId);

    if (error) {
      setAppointments(previousAppointments);
      setDataNotice("No se pudo actualizar el estado del turno en Supabase.");
      throw error;
    }

    setDataNotice(`Turno marcado como ${status.toLowerCase()} en Supabase.`);
  }

  async function updateAppointmentRecord(appointmentId, changes) {
    const previousAppointments = appointments;
    setAppointments((currentAppointments) =>
      currentAppointments.map((appointment) =>
        appointment.id === appointmentId ? { ...appointment, ...changes } : appointment
      )
    );

    if (!supabase) {
      setDataNotice("Turno actualizado en modo demo local.");
      return;
    }

    const updatePayload = {};
    if (changes.date !== undefined) updatePayload.date_label = changes.date;
    if (changes.dateISO !== undefined) updatePayload.date_iso = changes.dateISO;
    if (changes.time !== undefined) updatePayload.time = changes.time;
    if (changes.status !== undefined) updatePayload.status = changes.status;

    const { error } = await supabase
      .from("appointments")
      .update(updatePayload)
      .eq("id", appointmentId);

    if (error) {
      setAppointments(previousAppointments);
      setDataNotice("No se pudo reprogramar el turno en Supabase.");
      throw error;
    }

    setDataNotice("Turno reprogramado en Supabase.");
  }

  async function saveProfessionalRecord(professional) {
    const previousProfessionals = professionals;
    const isExistingProfessional = Boolean(
      professional.id && professionals.some((item) => item.id === professional.id)
    );
    const optimisticId = isExistingProfessional ? professional.id : Date.now();
    const optimisticProfessional = { ...professional, id: optimisticId };

    if (isExistingProfessional) {
      setProfessionals((currentProfessionals) =>
        currentProfessionals.map((item) => item.id === professional.id ? optimisticProfessional : item)
      );
    } else {
      setProfessionals((currentProfessionals) => [...currentProfessionals, optimisticProfessional]);
    }

    if (!supabase) {
      setDataNotice("Profesional guardado en modo demo local.");
      return optimisticProfessional;
    }

    const payload = mapProfessionalToDb(professional);
    if (!isExistingProfessional) {
      payload.id = optimisticId;
    }

    const query = isExistingProfessional
      ? supabase.from("professionals").update(payload).eq("id", professional.id).select().single()
      : supabase.from("professionals").insert(payload).select().single();

    const { data, error } = await query;

    if (error) {
      setProfessionals(previousProfessionals);
      setDataNotice(`Supabase no pudo guardar el profesional: ${error.message}`);
      throw error;
    }

    const savedProfessional = mapProfessionalFromDb(data);
    if (savedProfessional.email && supabase) {
      const { error: userError } = await supabase
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
          ...(professional.password ? { password_hash: professional.password } : {}),
        }, { onConflict: "role,email" });

      if (userError) throw userError;
    }

    setProfessionals((currentProfessionals) =>
      currentProfessionals.map((item) => item.id === optimisticId ? savedProfessional : item)
    );
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
      password_hash: data.password || "",
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

      if (userAccount.password_hash && userAccount.password_hash !== data.password) {
        throw new Error("Contrasena incorrecta");
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
      setAppToast({
        type: "success",
        title: `Bienvenido, ${accountName}`,
        text: "Ingresaste correctamente al panel familiar.",
      });
      window.setTimeout(() => setAppToast(null), 4200);
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
    updateAppointmentStatus,
    updateAppointmentRecord,
    saveProfessionalRecord,
    toggleProfessionalRecord,
    updateUserStatus,
    appUsers,
    setPage,
  };

  function renderPage() {
    if (page === "inicio") return <Home setPage={setPage} goToProfessional={goToProfessional} professionals={professionals} appointments={appointments} />;
    if (page === "profesionales") return <Professionals {...shared} />;
    if (page === "reserva") return <Booking {...shared} />;
    if (page === "mapa") return <MapView goToProfessional={goToProfessional} professionals={professionals} />;
    if (page === "recursos") return <Resources />;
    if (page === "familia") return <FamilyPanel {...shared} />;
    if (page === "profesional") return <ProfessionalPanel {...shared} />;
    if (page === "admin") return <AdminPanel appointments={appointments} professionals={professionals} appUsers={appUsers} setPage={setPage} toggleProfessionalRecord={toggleProfessionalRecord} updateUserStatus={updateUserStatus} />;
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
      {appToast && (
        <div className={`toast ${appToast.type}`}>
          <span className="toast-icon">{appToast.type === "success" ? "OK" : "!"}</span>
          <div>
            <strong>{appToast.title}</strong>
            <p>{appToast.text}</p>
          </div>
        </div>
      )}
      {renderPage()}
      {showLogin && (
        <LoginModal
          session={session}
          appUsers={appUsers}
          onClose={() => setShowLogin(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}
