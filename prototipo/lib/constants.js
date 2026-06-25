export const initialProfessionals = [
  {
    id: 1,
    name: "Lic. Mariana Torres",
    initials: "MT",
    province: "Buenos Aires",
    city: "CABA",
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
    city: "Cordoba",
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
    city: "Mendoza",
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
    city: "Rosario",
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

export const workHours = ["09:00", "10:00", "11:00", "17:00", "18:00", "19:00"];

export const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export const argentinaProvinces = [
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

export const resources = [
  {
    title: "Rutina visual para organizar tareas",
    age: "6 a 12 anos",
    area: "Organizacion y autonomia",
    image: "url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80')",
    summary: "Herramienta para anticipar pasos, sostener la atencion y terminar tareas escolares con menos acompanamiento adulto.",
    pdf: "/recursos/rutina-visual-tareas.pdf",
    bullets: [
      "Preparar tres momentos: preparar, hacer y revisar.",
      "Usar un temporizador de 15 minutos.",
      "Cerrar marcando que paso fue mas facil y cual necesita ayuda.",
    ],
  },
  {
    title: "Juego de atencion y seguimiento de consignas",
    age: "7 a 12 anos",
    area: "Atencion y funciones ejecutivas",
    image: "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80')",
    summary: "Ejercicio ludico para entrenar escucha, memoria de trabajo y control de impulsos con consignas breves.",
    pdf: "/recursos/juego-atencion-consignas.pdf",
    bullets: [
      "Comenzar con consignas de dos pasos.",
      "Aumentar dificultad cuando logra resolver sin repetir.",
      "Cerrar preguntando que estrategia ayudo a recordar.",
    ],
  },
  {
    title: "Lectura compartida para mejorar comprension",
    age: "6 a 10 anos",
    area: "Lectura y comprension",
    image: "url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80')",
    summary: "Actividad para fortalecer comprension lectora, vocabulario y expresion oral en un momento breve de lectura familiar.",
    pdf: "/recursos/lectura-compartida-comprension.pdf",
    bullets: [
      "Leer un parrafo corto y anticipar que puede pasar.",
      "Elegir tres palabras importantes.",
      "Dibujar la escena principal y responder quien, que y por que.",
    ],
  },
  {
    title: "Semaforo emocional antes de estudiar",
    age: "Todas las edades",
    area: "Emociones y aprendizaje",
    image: "url('https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&w=900&q=80')",
    summary: "Herramienta para reconocer el estado emocional antes de iniciar tareas y elegir una estrategia de regulacion.",
    pdf: "/recursos/semaforo-emocional-aprendizaje.pdf",
    bullets: [
      "Elegir rojo, amarillo o verde antes de estudiar.",
      "Aplicar pausa, pedido de ayuda o inicio segun el color.",
      "Volver a elegir color al terminar para comparar cambios.",
    ],
  },
];

export const initialFamily = {
  parentName: "Carolina Ruiz",
  email: "carolina@email.com",
  whatsapp: "5491122233344",
  childName: "Mateo",
  childAge: "8",
  reason: "Dificultades para sostener la atención y organizar tareas escolares.",
};

export const initialSessions = [
  {
    date: "04/06/2026",
    dateISO: "2026-06-04",
    professional: "Lic. Mariana Torres",
    childName: "Mateo",
    objectives: "Organizacion de consignas y lectura comprensiva.",
    notes: "Se observo buena respuesta a apoyos visuales y pausas breves.",
    progress: 62,
  },
  {
    date: "09/06/2026",
    dateISO: "2026-06-09",
    professional: "Lic. Mariana Torres",
    childName: "Mateo",
    objectives: "Planificación de tareas y seguimiento de instrucciones.",
    notes: "La familia aplico rutina semanal. Se recomienda sostener el mismo formato.",
    progress: 76,
  },
];

export const loginProfiles = [
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

export const roleConfig = {
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
