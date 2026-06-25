# Informe del Trabajo Final Integrador

## Proyecto

**Nombre:** Psico-Puente — Centro de Asistencia Psicopedagogico

**Curso:** Desarrollo de Aplicaciones Web con Inteligencia Artificial

**Tipo de entrega:** Aplicacion web funcional, repositorio, documentacion breve, despliegue y defensa final.

**Enlace desplegado:** https://prototipo-alpha-cyan.vercel.app

**Repositorio:** https://github.com/enzojramos597/TrabajoFinalconIA

---

## 1. Presentacion del proyecto

El proyecto consiste en el desarrollo de una aplicacion web para un Centro de Asistencia Psicopedagogico llamado Psico-Puente. La plataforma facilita el vinculo entre familias y profesionales psicopedagogicos, centralizando informacion, busqueda de especialistas, reserva de turnos, recursos para familias y seguimiento basico de consultas.

La propuesta resuelve una necesidad concreta: muchas familias necesitan orientacion psicopedagogica para sus hijos o hijas, pero encuentran dificultades para identificar profesionales disponibles, conocer sus especialidades y reservar un turno de manera ordenada.

---

## 2. Problema identificado

Muchas familias detectan dificultades escolares, problemas de atencion, retrasos en aprendizajes o recomendaciones de la escuela, pero no siempre saben a que profesional recurrir ni como iniciar una consulta.

La informacion suele estar dispersa en recomendaciones informales, contactos por WhatsApp o agendas manuales. Esto genera demoras, confusion y poca claridad sobre disponibilidad, especialidades y seguimiento posterior.

Ademas, los profesionales necesitan herramientas para organizar su agenda, registrar pacientes y cargar informes de sesion de manera centralizada.

---

## 3. Usuarios destinatarios

### Familias, padres, madres o tutores

Son los usuarios principales. Necesitan encontrar profesionales, conocer sus especialidades, reservar turnos y acceder al seguimiento basico del proceso de su hijo o hija.

### Profesionales psicopedagogicos

Necesitan publicar su perfil, mostrar disponibilidad, recibir solicitudes de turnos, organizar su agenda y cargar informes de sesion.

### Administrador del centro

Necesita gestionar los profesionales registrados, activar o desactivar perfiles y consultar estadisticas generales del funcionamiento de la plataforma.

---

## 4. Contexto de uso

La aplicacion esta pensada para ser utilizada desde celulares y computadoras. Una familia puede ingresar al sitio luego de notar una dificultad de aprendizaje o recibir una recomendacion de la escuela.

Desde la zona publica, cualquier persona puede informarse sobre el centro, consultar recursos orientados a familias y buscar profesionales por provincia mediante un mapa interactivo de Argentina.

Luego, al iniciar sesion, la familia puede reservar un turno, ver proximas consultas e historial de sesiones.

---

## 5. Objetivo general

Desarrollar una aplicacion web para un Centro de Asistencia Psicopedagogico que permita a las familias encontrar profesionales, reservar turnos y acceder a un seguimiento basico de las consultas, mientras los profesionales pueden gestionar agenda, pacientes e informes.

---

## 6. Objetivos especificos

- Presentar publicamente el centro, su mision y sus servicios.
- Permitir la busqueda de profesionales por provincia mediante un mapa interactivo de Argentina.
- Mostrar fichas de profesionales con informacion relevante para las familias.
- Facilitar la reserva de turnos desde la web, con calendario de disponibilidad real.
- Generar mensajes automaticos de confirmacion mediante WhatsApp.
- Incorporar enlaces de ubicacion mediante Google Maps.
- Brindar a las familias un panel con proximos turnos, historial y evolucion.
- Permitir que los profesionales carguen informes de sesion y registros de seguimiento.
- Incluir una zona de administracion para gestionar profesionales y consultar estadisticas.
- Publicar la aplicacion en Vercel con acceso publico.

---

## 7. Valor de la solucion

Para las familias, la aplicacion reduce la incertidumbre inicial, facilita el acceso a profesionales psicopedagogicos y ordena el seguimiento del proceso.

Para los profesionales, centraliza la agenda, los pacientes y los informes, mejorando la organizacion cotidiana.

Para el centro, permite profesionalizar la gestion digital y ofrecer una experiencia clara y accesible desde cualquier dispositivo.

---

## 8. Alcance del proyecto

Se definio un MVP (producto minimo viable) con las siguientes decisiones:

**Incluido en esta version:**
- Interfaz publica completa (inicio, profesionales, mapa, recursos).
- Sistema de autenticacion con roles: familia, profesional y administrador.
- Reserva de turnos con calendario de disponibilidad real.
- Panel familiar con turnos, historial de sesiones y progreso.
- Panel profesional con agenda, pacientes e informes.
- Panel administrador con gestion de profesionales y estadisticas.
- Integracion con WhatsApp para confirmaciones automaticas.
- Integracion con Google Maps para ubicacion de profesionales.
- Mapa interactivo de Argentina por provincias.
- Persistencia de datos con Supabase (y modo demo local sin configuracion).

**Quedara para mejoras futuras:**
- Mensajeria interna entre familias y profesionales.
- Subida real de archivos adjuntos.
- Recordatorios automaticos programados.
- Validacion formal de matriculas profesionales.
- Estadisticas avanzadas con graficos dinamicos.

---

## 9. Funcionalidades implementadas

### Zona publica (sin login)

- **Pagina de inicio:** presentacion del centro, mision, servicios y llamada a la accion.
- **Directorio de profesionales:** listado con filtros por especialidad y disponibilidad, ficha de cada profesional con enlace a Google Maps.
- **Mapa interactivo de Argentina:** mapa SVG geografico real con las 24 provincias, donde cada provincia se pinta al hacer clic y filtra los profesionales activos en esa zona. Construido con `react-simple-maps` y datos GeoJSON de Natural Earth.
- **Seccion de recursos:** materiales descargables y orientaciones para familias con hijos con dificultades de aprendizaje.
- **Preguntas frecuentes:** respuestas a dudas comunes sobre psicopedagogia y el proceso de consulta.

### Autenticacion

- **Login con Supabase:** sistema de sesiones real con roles diferenciados (familia, profesional, administrador).
- **Modal de login global:** accesible desde cualquier pantalla, sin redireccionamiento.
- **Proteccion de rutas:** la reserva de turnos requiere sesion activa de tipo familia. Los paneles de profesional y administrador requieren el rol correspondiente.

### Reserva de turnos

- **Calendario de disponibilidad:** muestra lunes a viernes con horarios de 9 a 12 y de 17 a 20.
- **Bloqueo de turnos ocupados:** los turnos ya reservados no se pueden seleccionar.
- **Confirmacion por WhatsApp:** al reservar se genera un mensaje prearmado con los datos del turno listo para enviar.
- **Reprogramacion:** los turnos aceptados pueden ser reprogramados.

### Panel familiar

- **Resumen de proximos turnos.**
- **Historial de sesiones** con profesional, objetivos y notas.
- **Indicador de progreso** del proceso terapeutico.

### Panel profesional

- **Agenda de turnos:** vista de solicitudes pendientes, aceptadas y pasadas.
- **Registro de pacientes** con informacion de cada familia.
- **Carga de informes de sesion** con objetivos, notas y evolucion.

### Panel administrador

- **ABM de profesionales:** alta, edicion, desactivacion y reactivacion de perfiles.
- **Estadisticas generales:** turnos, profesionales activos, familias registradas.
- **Gestion de disponibilidad** por profesional.

---

## 10. Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| Next.js 16 (App Router) | Framework principal con renderizado del lado del cliente |
| React | Biblioteca de interfaces y componentes |
| JavaScript (ES2022) | Logica de negocio y estado |
| CSS (global, custom properties) | Sistema de diseno, responsive, animaciones |
| Supabase | Autenticacion, base de datos y sesiones en la nube |
| react-simple-maps | Mapa SVG interactivo de Argentina (proyeccion geoMercator) |
| GeoJSON Natural Earth | Datos geograficos de las 24 provincias argentinas |
| WhatsApp Web API | Generacion de mensajes automaticos de confirmacion |
| Google Maps | Ubicacion y navegacion a consultorios |
| Vercel | Despliegue y hosting de la aplicacion |
| GitHub | Control de versiones y repositorio del codigo |

---

## 11. Manejo de datos

La aplicacion utiliza dos modos de datos:

**Modo demo (sin configuracion de Supabase):** los datos iniciales de profesionales, turnos y recursos estan definidos en `constants.js` y persisten en memoria durante la sesion. Permite usar y presentar toda la aplicacion sin necesidad de infraestructura externa.

**Modo conectado (con Supabase):** al configurar las variables de entorno, los profesionales y turnos se leen y escriben en Supabase Cloud. La autenticacion usa el sistema de usuarios de Supabase con soporte de roles.

Datos manejados: profesionales, familias, hijos/hijas, turnos, informes de sesion, sesiones de autenticacion y recursos.

---

## 12. Integraciones y automatizaciones

- **Supabase Cloud:** autenticacion real con roles, persistencia de profesionales y turnos.
- **WhatsApp:** al confirmar un turno se genera un enlace `wa.me` con el mensaje ya redactado, incluyendo nombre del profesional, fecha, hora y direccion.
- **Google Maps:** cada ficha de profesional incluye un enlace que abre la direccion en Google Maps para navegacion.
- **react-simple-maps:** mapa geografico interactivo que consume datos GeoJSON y permite seleccionar provincias para filtrar profesionales.

---

## 13. Uso de inteligencia artificial durante el desarrollo

Durante todo el proyecto se utilizo Claude Code (Anthropic) como copiloto de desarrollo. A continuacion se detalla el proceso real.

### Etapa de ideacion y planificacion

- Se analizo el enunciado del trabajo final con IA para identificar los requisitos minimos.
- La IA propuso la estructura del proyecto: Next.js App Router, separacion por roles, Supabase como backend.
- Se genero la estructura inicial del informe.md como documento vivo del proyecto.

**Prompts clave:**
- "Analiza el enunciado y armame un plan para cumplir todos los puntos del trabajo final."
- "Que tecnologias me recomiendas para hacer esto funcionar en Vercel sin configuracion compleja?"

### Etapa de diseno e interfaz

- La IA genero el sistema de diseno completo: paleta de colores, tipografia, componentes visuales y `styles.css`.
- Se usaron prompts iterativos para ajustar el diseño responsive, los estados visuales y la coherencia entre pantallas.
- La estructura de componentes (un componente por panel, un componente por seccion publica) fue sugerida y validada con IA.

**Prompts clave:**
- "Crea un diseno profesional para una app de psicopedagogia, sin emojis, con tipografia monospace."
- "Hace que el panel familiar muestre los turnos, el historial y un indicador de progreso."

### Etapa de implementacion: mapa interactivo

Este fue el mayor desafio tecnico del proyecto. El proceso tuvo varias iteraciones:

1. **Primer intento:** imagen estatica de Argentina con pines superpuestos. Funcionaba pero no era interactivo.
2. **Segundo intento:** poligonos SVG dibujados manualmente. No representaban correctamente el territorio.
3. **Solucion final:** se integro `react-simple-maps` con datos GeoJSON reales de Natural Earth (24 provincias). La IA descargo el archivo, filtro las features de Argentina y lo guardo en `/public/argentina-provinces.json`.

**Problema critico resuelto con IA:** los datos GeoJSON remotos devolvian 404. La IA propuso descargar el archivo localmente usando Node.js y un script de filtrado.

**Error de proyeccion resuelto:** el mapa aparecia desplazado a la derecha. La IA diagnostico que faltaban los props `width` y `height` en `ComposableMap`, lo que causaba que el centro de proyeccion quedara en (400, 300) en lugar de (250, 450) dentro del SVG. El fix fue agregar `width={500} height={900}` y ajustar `center` al centro geografico real de Argentina: `[-63, -38]`.

### Etapa de autenticacion

- Se implemento el login con Supabase reemplazando un formulario inline que simulaba autenticacion.
- La IA detecto que el flujo de reserva se podia completar sin login real y propuso reemplazarlo por una verificacion de sesion: `!session || session.role !== "family"`.
- Se agrego `setShowLogin` al objeto `shared` para que `Booking.jsx` pudiera abrir el modal global.

**Prompt clave:**
- "La reserva se puede hacer sin login, eso esta mal. Que haya sesion real antes de mostrar el formulario de turno."

### Etapa de despliegue

- Se configuro Vercel CLI desde el subdirectorio `prototipo/` para que detectara el proyecto Next.js correctamente.
- La IA guio el proceso de creacion del token de Vercel, la asociacion con el proyecto y los comandos de deploy.
- Se resolvio un problema donde el ultimo commit no aparecia en Vercel porque el deploy previo era manual (sin vinculo GitHub automatico).

**Prompt clave:**
- "La app en Vercel tiene un commit menos que el repositorio, como lo actualizo?"

### Limites encontrados

- La IA no pudo generar automaticamente las coordenadas geoespecificas de todas las provincias argentinas con precision. Se verificaron manualmente.
- En algunos ciclos de ajuste visual (posicion del mapa) se requirieron varias iteraciones porque la IA no tenia acceso directo al resultado visual. El usuario compartio capturas de pantalla para guiar los ajustes.
- Los errores de proyeccion geografica requirieron conocimiento tecnico de d3-geo que la IA explico paso a paso.

---

## 14. Mejoras futuras

- Integracion real con API oficial de WhatsApp Business.
- Login social con Google o redes educativas.
- Subida y gestion real de archivos adjuntos (informes en PDF).
- Validacion formal de matriculas profesionales.
- Recordatorios automaticos de turno por email o WhatsApp.
- Mensajeria interna entre familias y profesionales.
- Estadisticas avanzadas con graficos interactivos para administracion.
- Notificaciones push para nuevas solicitudes de turno.

---

## 15. Despliegue

La aplicacion esta publicada en Vercel:

**URL publica:** https://prototipo-alpha-cyan.vercel.app

**Repositorio:** https://github.com/enzojramos597/TrabajoFinalconIA

### Ejecutar localmente

```bash
cd prototipo
npm install
npm run dev
```

Abrir: http://localhost:3000

### Variables de entorno (opcional, para conectar Supabase)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

Sin estas variables, la app funciona en modo demo con datos simulados.

### Usuarios de prueba (modo demo)

| Rol | Email | Comportamiento |
|---|---|---|
| Familia | familia@email.com | Accede al panel familiar y puede reservar turnos |
| Profesional | profesional@centro.com | Accede al panel de agenda, pacientes e informes |
| Administrador | admin@psicopuente.com | Accede al ABM de profesionales y estadisticas |

---

## 16. Conclusion

El proyecto Psico-Puente es una aplicacion web funcional, publicada y demostrable que cumple con los requisitos del trabajo final integrador.

### Resultado alcanzado

Se construyo una plataforma completa con zona publica, sistema de autenticacion por roles, reserva de turnos con calendario real, paneles diferenciados para cada tipo de usuario, integraciones con WhatsApp y Google Maps, y un mapa interactivo de Argentina por provincias.

La aplicacion esta desplegada en Vercel con acceso publico y el codigo fuente esta disponible en GitHub.

### Decisiones principales

- **Next.js App Router con componentes cliente:** permite una experiencia de navegacion fluida sin recargas de pagina, ideal para un panel multi-rol.
- **Supabase con fallback local:** la aplicacion funciona completamente en modo demo sin necesidad de configurar variables de entorno, lo que facilita la presentacion.
- **react-simple-maps con GeoJSON local:** se priorizaron los datos geograficos reales sobre soluciones simplificadas, logrando un mapa completamente interactivo.
- **CSS sin framework externo:** se desarrollo un sistema de diseno propio con variables CSS, lo que da control total sobre la identidad visual del producto.

### Uso de IA

Claude Code fue utilizado en todas las etapas del proyecto: ideacion, diseno, generacion de codigo, depuracion de errores complejos y despliegue. El rol del estudiante fue dirigir el proceso, tomar decisiones de producto, evaluar los resultados, detectar errores visuales (mediante capturas de pantalla) y validar que cada funcionalidad cumpliera con el objetivo.

### Limitaciones del producto actual

- Los datos son simulados en modo demo; en produccion real se requiere Supabase configurado.
- No hay envio real de notificaciones; WhatsApp funciona mediante enlace manual.
- El calendario no sincroniza con sistemas externos.

### Aprendizajes

El proyecto demostro que la IA puede acelerar significativamente el desarrollo web, pero requiere un usuario que entienda el problema, pueda evaluar los resultados y guie las decisiones. Los errores mas complejos (proyeccion geografica, autenticacion, despliegue) se resolvieron gracias a la combinacion de conocimiento tecnico explicado por la IA y la capacidad del estudiante de describir con precision lo que estaba fallando.
