"use client";

export default function AdminPanel({ appointments, professionals, appUsers, setPage, toggleProfessionalRecord, updateUserStatus }) {
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
      <section className="grid two admin-verification-hidden">
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
