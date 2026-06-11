const { useMemo, useState } = React;

const professionals = [
  {
    id: 1,
    name: "Lic. Mariana Torres",
    initials: "MT",
    province: "Buenos Aires",
    specialty: "Dificultades de aprendizaje",
    availability: "Esta semana",
    address: "Av. Rivadavia 1845, CABA",
    phone: "5491134567890",
    formation: "Licenciada en Psicopedagogia. Orientacion en alfabetizacion inicial y apoyo escolar.",
    schedule: ["Lunes 10:00", "Lunes 11:30", "Miercoles 15:00", "Viernes 09:30"],
    progress: 76,
    coords: { top: "58%", left: "48%" },
  },
  {
    id: 2,
    name: "Lic. Pablo Sosa",
    initials: "PS",
    province: "Cordoba",
    specialty: "Orientacion vocacional",
    availability: "Manana",
    address: "Bv. San Juan 720, Cordoba",
    phone: "5493514567890",
    formation: "Psicopedagogo especializado en adolescentes, proyectos escolares y orientacion vocacional.",
    schedule: ["Martes 09:00", "Martes 17:00", "Jueves 10:30", "Viernes 16:00"],
    progress: 64,
    coords: { top: "52%", left: "45%" },
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
    formation: "Especialista en procesos atencionales, planificacion y estrategias de estudio.",
    schedule: ["Lunes 14:00", "Miercoles 09:00", "Jueves 15:30", "Viernes 11:00"],
    progress: 82,
    coords: { top: "63%", left: "39%" },
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
    schedule: ["Martes 10:00", "Miercoles 16:30", "Jueves 12:00", "Sabado 09:00"],
    progress: 71,
    coords: { top: "49%", left: "50%" },
  },
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
    area: "Orientacion",
    image: "url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80')",
  },
];

const initialFamily = {
  parentName: "Carolina Ruiz",
  email: "carolina@email.com",
  whatsapp: "5491122233344",
  childName: "Mateo",
  childAge: "8",
  reason: "Dificultades para sostener la atencion y organizar tareas escolares.",
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
    objectives: "Planificacion de tareas y seguimiento de instrucciones.",
    notes: "La familia aplico rutina semanal. Se recomienda sostener el mismo formato.",
    progress: 76,
  },
];

function App() {
  const [page, setPage] = useState("inicio");
  const [selectedProfessional, setSelectedProfessional] = useState(professionals[0]);
  const [family, setFamily] = useState(initialFamily);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      professionalId: 1,
      professionalName: "Lic. Mariana Torres",
      date: "Miercoles 15:00",
      childName: "Mateo",
      status: "Confirmado",
    },
  ]);
  const [sessions, setSessions] = useState(initialSessions);

  const navItems = [
    ["inicio", "Inicio"],
    ["profesionales", "Profesionales"],
    ["mapa", "Mapa"],
    ["recursos", "Recursos"],
    ["familia", "Familia"],
    ["profesional", "Profesional"],
    ["admin", "Admin"],
    ["faq", "FAQ"],
  ];

  function goToProfessional(professional) {
    setSelectedProfessional(professional);
    setPage("reserva");
  }

  function renderPage() {
    const shared = {
      family,
      setFamily,
      appointments,
      setAppointments,
      sessions,
      setSessions,
      selectedProfessional,
      setSelectedProfessional,
      goToProfessional,
      setPage,
    };

    if (page === "inicio") return <Home setPage={setPage} goToProfessional={goToProfessional} />;
    if (page === "profesionales") return <Professionals {...shared} />;
    if (page === "reserva") return <Booking {...shared} />;
    if (page === "mapa") return <MapView goToProfessional={goToProfessional} />;
    if (page === "recursos") return <Resources />;
    if (page === "familia") return <FamilyPanel {...shared} />;
    if (page === "profesional") return <ProfessionalPanel {...shared} />;
    if (page === "admin") return <AdminPanel appointments={appointments} />;
    if (page === "faq") return <Faq />;
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand ghost-btn" onClick={() => setPage("inicio")} aria-label="Ir al inicio">
          <span className="brand-mark">CP</span>
          <span className="brand-text">
            <strong>Centro Psicopedagogico</strong>
            <span>Orientacion y seguimiento familiar</span>
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
          <button className="soft-btn" onClick={() => setPage("familia")}>Mi panel</button>
          <button className="primary-btn" onClick={() => setPage("profesionales")}>Reservar</button>
        </div>
      </header>
      {renderPage()}
    </div>
  );
}

function Home({ setPage, goToProfessional }) {
  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Centro de Asistencia Psicopedagogico</p>
          <h1>Acompanamiento claro para familias y profesionales.</h1>
          <p className="lead">
            Una plataforma para encontrar especialistas, reservar turnos, acceder a recursos y seguir la evolucion de cada consulta desde un mismo lugar.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setPage("profesionales")}>Buscar profesional</button>
            <button className="ghost-btn" onClick={() => setPage("recursos")}>Ver recursos</button>
          </div>
          <div className="stats">
            <div className="stat"><strong>4</strong><span>provincias activas</span></div>
            <div className="stat"><strong>12</strong><span>turnos semanales</span></div>
            <div className="stat"><strong>3</strong><span>areas de trabajo</span></div>
          </div>
        </div>
        <div className="hero-panel" role="img" aria-label="Familia en un espacio educativo">
          <div className="floating-note">
            <strong>Flujo principal del prototipo</strong>
            <p className="muted">Buscar profesional, elegir horario, confirmar turno y generar mensaje automatico por WhatsApp.</p>
            <button className="soft-btn" onClick={() => goToProfessional(professionals[0])}>Probar reserva</button>
          </div>
        </div>
      </section>

      <section className="page">
        <div className="section-head">
          <div>
            <p className="eyebrow">Servicios</p>
            <h2>Atencion organizada por necesidades reales</h2>
          </div>
        </div>
        <div className="grid">
          {[
            ["Diagnostico y orientacion", "Primera entrevista, analisis del motivo de consulta y recomendacion de pasos a seguir.", "*"],
            ["Seguimiento familiar", "Informes de sesion, objetivos trabajados y evolucion del proceso.", "+"],
            ["Recursos para familias", "Guias y ejercicios descargables ordenados por edad y area de trabajo.", "#"],
          ].map(([title, text, icon]) => (
            <article className="card" key={title}>
              <div className="service-icon">{icon}</div>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function Professionals({ goToProfessional }) {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState("Todas");
  const [specialty, setSpecialty] = useState("Todas");
  const [availability, setAvailability] = useState("Todas");

  const filtered = useMemo(() => {
    return professionals.filter((professional) => {
      const textMatch = professional.name.toLowerCase().includes(query.toLowerCase()) ||
        professional.specialty.toLowerCase().includes(query.toLowerCase());
      return textMatch &&
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
        <p className="muted">{professional.address}</p>
        <div className="actions">
          <button className="primary-btn" onClick={onBook}>Reservar turno</button>
          <a className="ghost-btn" href={mapsUrl(professional.address)} target="_blank">Como llegar</a>
        </div>
      </div>
    </article>
  );
}

function Booking({ selectedProfessional, family, setFamily, appointments, setAppointments, setPage }) {
  const [slot, setSlot] = useState(selectedProfessional.schedule[0]);
  const [confirmed, setConfirmed] = useState(null);

  function updateFamily(field, value) {
    setFamily({ ...family, [field]: value });
  }

  function confirmBooking() {
    const appointment = {
      id: Date.now(),
      professionalId: selectedProfessional.id,
      professionalName: selectedProfessional.name,
      date: slot,
      childName: family.childName || "Hijo/a",
      status: "Confirmado",
    };
    setAppointments([appointment, ...appointments]);
    setConfirmed(appointment);
  }

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

          <h3>Horarios disponibles</h3>
          <div className="schedule">
            {selectedProfessional.schedule.map((item) => (
              <button key={item} className={slot === item ? "slot selected" : "slot"} onClick={() => setSlot(item)}>
                {item}
              </button>
            ))}
          </div>

          <div className="actions">
            <button className="primary-btn" onClick={confirmBooking}>Confirmar turno</button>
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
          <p>Consulta turnos, historial de sesiones y evolucion de {family.childName}.</p>
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
            <p className="muted">Grafico simple construido con los registros de sesion.</p>
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

function ProfessionalPanel({ appointments, sessions, setSessions }) {
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

  return (
    <main className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">Panel profesional</p>
          <h2>Agenda, pacientes e informes</h2>
          <p>Vista privada simulada para gestionar reservas y cargar registros de sesion.</p>
        </div>
      </div>
      <section className="dashboard-layout">
        <div>
          <h3>Agenda semanal</h3>
          {appointments.map((appointment) => (
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
          <h3>Cargar informe de sesion</h3>
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

function AdminPanel({ appointments }) {
  return (
    <main className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">Administracion</p>
          <h2>Gestion general del centro</h2>
          <p>Vista simulada para aprobar profesionales y consultar indicadores principales.</p>
        </div>
      </div>
      <section className="admin-stats">
        <div className="stat"><strong>{professionals.length}</strong><span>profesionales</span></div>
        <div className="stat"><strong>{appointments.length}</strong><span>turnos registrados</span></div>
        <div className="stat"><strong>4</strong><span>provincias</span></div>
        <div className="stat"><strong>92%</strong><span>confirmaciones</span></div>
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
    </main>
  );
}

function MapView({ goToProfessional }) {
  return (
    <main className="page">
      <div className="section-head">
        <div>
          <p className="eyebrow">Mapa interactivo</p>
          <h2>Centros y profesionales por provincia</h2>
          <p>Prototipo visual con accesos a Google Maps para iniciar la navegacion.</p>
        </div>
      </div>
      <section className="map-shell">
        <div className="map-visual">
          {professionals.map((professional) => (
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
          {professionals.map((professional) => (
            <article key={professional.id}>
              <h3>{professional.name}</h3>
              <p className="muted">{professional.address}</p>
              <div className="actions">
                <button className="primary-btn" onClick={() => goToProfessional(professional)}>Reservar</button>
                <a className="ghost-btn" href={mapsUrl(professional.address)} target="_blank">Como llegar</a>
              </div>
            </article>
          ))}
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
          <h2>Guias para acompanar desde casa</h2>
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
    </main>
  );
}

function Faq() {
  const questions = [
    ["Que es la psicopedagogia?", "Es una disciplina que acompana procesos de aprendizaje, detecta dificultades y propone estrategias para mejorar la trayectoria escolar y personal."],
    ["Cuando conviene consultar?", "Cuando aparecen dificultades persistentes en lectura, escritura, atencion, organizacion, comprension de consignas o adaptacion escolar."],
    ["La primera consulta requiere diagnostico previo?", "No necesariamente. La primera entrevista ayuda a ordenar la situacion, escuchar a la familia y definir proximos pasos."],
    ["Quien carga la historia clinica?", "En este prototipo, los informes y observaciones son cargados por el profesional desde su panel privado. La familia solo puede leerlos."],
  ];

  return (
    <main className="page faq">
      <div className="section-head">
        <div>
          <p className="eyebrow">Preguntas frecuentes</p>
          <h2>Orientacion inicial para familias</h2>
        </div>
      </div>
      {questions.map(([question, answer]) => (
        <details key={question}>
          <summary>{question}</summary>
          <p className="muted">{answer}</p>
        </details>
      ))}
    </main>
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
    evolucion: "Evolucion",
    perfil: "Perfil",
  }[value] || value;
}

function mapsUrl(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
