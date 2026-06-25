"use client";

import { resources } from "../../lib/constants";

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

export default function Resources() {
  return (
    <main className="page">
      <section className="resource-brand">
        <img src="/psico-puente-icon.png" alt="" aria-hidden="true" />
        <div>
          <strong>PSICO-PUENTE</strong>
          <span>Orientación y seguimiento familiar</span>
        </div>
      </section>
      <div className="section-head">
        <div>
          <p className="eyebrow">Herramientas y ejercicios</p>
          <h2>Actividades para realizar en casa</h2>
          <p>Ejercicios descargables en PDF para que el nino pueda trabajar con sus padres o tutores.</p>
        </div>
      </div>
      <section className="grid">
        {resources.map((resource) => (
          <article className="resource-card" key={resource.title}>
            <div className="resource-media" style={{ "--image": resource.image }} />
            <div className="content">
              <div className="resource-card-brand">
                <img src="/psico-puente-icon.png" alt="" aria-hidden="true" />
                <span>PSICO-PUENTE</span>
              </div>
              <h3>{resource.title}</h3>
              <p className="muted">{resource.summary}</p>
              <div className="tags">
                <span className="tag">{resource.age}</span>
                <span className="tag blue">{resource.area}</span>
              </div>
              <ul className="guide-list">
                {resource.bullets.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <a
                className="soft-btn"
                href={resource.pdf}
                download
              >
                Descargar PDF
              </a>
            </div>
          </article>
        ))}
      </section>
      <Faq embedded />
    </main>
  );
}
