"use client";

import { useState, useEffect } from "react";
import { sortClinicalSessions } from "../../lib/utils";

function SessionRow({ session }) {
  return (
    <article className="session-row">
      <header>
        <div>
          <h3>{session.date}</h3>
          <p className="muted">{session.professional}{session.childName ? ` - ${session.childName}` : ""}</p>
        </div>
        <span className="tag">{session.progress}% progreso</span>
      </header>
      <p><strong>Objetivos:</strong> {session.objectives}</p>
      <p className="muted">{session.notes}</p>
      <div className="progress"><span style={{ width: `${session.progress}%` }} /></div>
    </article>
  );
}

export default function ClinicalReportViewer({ sessions, title, emptyText }) {
  const [page, setPage] = useState(0);
  const orderedSessions = sortClinicalSessions(sessions);
  const currentPage = Math.min(page, Math.max(orderedSessions.length - 1, 0));
  const currentSession = orderedSessions[currentPage];

  useEffect(() => {
    if (page > Math.max(orderedSessions.length - 1, 0)) {
      setPage(0);
    }
  }, [orderedSessions.length, page]);

  if (orderedSessions.length === 0) {
    return (
      <article className="clinical-report empty">
        <h3>{title}</h3>
        <p className="muted">{emptyText}</p>
      </article>
    );
  }

  return (
    <article className="clinical-report">
      <header>
        <div>
          <h3>{title}</h3>
          <p className="muted">Informe {currentPage + 1} de {orderedSessions.length}, ordenado por fecha.</p>
        </div>
        <div className="pagination-controls">
          <button className="soft-btn" onClick={() => setPage(Math.max(currentPage - 1, 0))} disabled={currentPage === 0}>Anterior</button>
          <button className="soft-btn" onClick={() => setPage(Math.min(currentPage + 1, orderedSessions.length - 1))} disabled={currentPage === orderedSessions.length - 1}>Siguiente</button>
        </div>
      </header>
      <SessionRow session={currentSession} />
      <div className="clinical-timeline">
        {orderedSessions.map((sessionItem, index) => (
          <button
            key={`${sessionItem.date}-${index}`}
            className={index === currentPage ? "active" : ""}
            onClick={() => setPage(index)}
            aria-label={`Ver informe ${sessionItem.date}`}
          >
            {sessionItem.date}
          </button>
        ))}
      </div>
    </article>
  );
}
