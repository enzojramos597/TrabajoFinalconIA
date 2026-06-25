# Psico-Puente — Centro de Asistencia Psicopedagogico

Aplicacion web funcional desarrollada como Trabajo Final Integrador del curso **Desarrollo de Aplicaciones Web con Inteligencia Artificial**.

**Aplicacion desplegada:** https://prototipo-alpha-cyan.vercel.app

**Repositorio:** https://github.com/enzojramos597/TrabajoFinalconIA

**Documentacion visual con capturas:** [docs/DOCUMENTACION.md](../docs/DOCUMENTACION.md)

---

## Descripcion del proyecto

Psico-Puente es una plataforma que conecta familias con profesionales psicopedagogicos. Permite buscar profesionales por provincia en un mapa interactivo de Argentina, reservar turnos con calendario real, confirmar via WhatsApp y acceder a paneles personalizados segun el rol del usuario (familia, profesional o administrador).

---

## Funcionalidades principales

### Zona publica (sin login requerido)

- Pagina de inicio con presentacion del centro y servicios.
- Directorio de profesionales con filtros por especialidad y disponibilidad.
- **Mapa interactivo de Argentina:** las 24 provincias son clickeables y filtran profesionales por zona.
- Seccion de recursos educativos para familias.
- Preguntas frecuentes.

### Autenticacion y roles

- Login real con Supabase (familia, profesional, administrador).
- Modal de login accesible desde cualquier pantalla.
- Proteccion de acceso: la reserva de turnos requiere sesion activa de tipo familia.

### Reserva de turnos

- Calendario de lunes a viernes con horarios de 9 a 12 y de 17 a 20.
- Turnos ocupados bloqueados automaticamente.
- Confirmacion automatica via WhatsApp con datos del turno prearmados.
- Reprogramacion de turnos aceptados.

### Panel familiar

- Proximos turnos e historial de consultas.
- Seguimiento del proceso con indicador de progreso.

### Panel profesional

- Agenda con solicitudes pendientes y aceptadas.
- Historial de pacientes.
- Carga de informes de sesion con objetivos y notas.

### Panel administrador

- ABM de profesionales (alta, edicion, activacion, desactivacion).
- Estadisticas generales del centro.

---

## Tecnologias utilizadas

| Tecnologia | Uso |
|---|---|
| Next.js 16 (App Router) | Framework principal |
| React | Componentes e interfaces |
| JavaScript | Logica de negocio |
| CSS (custom properties) | Sistema de diseno responsive |
| Supabase | Autenticacion y base de datos en la nube |
| react-simple-maps | Mapa SVG interactivo de Argentina |
| GeoJSON Natural Earth | Datos geograficos de las 24 provincias |
| WhatsApp Web | Mensajes automaticos de confirmacion |
| Google Maps | Ubicacion de consultorios |
| Vercel | Hosting y despliegue |

---

## Ejecutar localmente

```bash
cd prototipo
npm install
npm run dev
```

Abrir: http://localhost:3000

La aplicacion funciona completamente en **modo demo** sin configuracion adicional.

---

## Configurar Supabase (opcional)

1. Crear un proyecto en Supabase.
2. Abrir SQL Editor y ejecutar `supabase/schema.sql`.
3. Copiar `.env.example` como `.env.local` y completar:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_publica
```

4. Reiniciar el servidor. Sin estas variables la app funciona en modo demo local.

---

## Usuarios de prueba (modo demo)

| Rol | Email |
|---|---|
| Familia | familia@email.com |
| Profesional | profesional@centro.com |
| Administrador | admin@psicopuente.com |

---

## Estructura del proyecto

```
prototipo/
  app/
    page.jsx          # Punto de entrada, enrutamiento y estado global
    layout.jsx        # Layout raiz
  components/
    publico/          # Home, Professionals, MapView, Booking, Resources
    familia/          # FamilyPanel
    profesional/      # ProfessionalPanel
    admin/            # AdminPanel
    shared/           # LoginModal, ClinicalReportViewer
  lib/
    constants.js      # Datos de profesionales, turnos y configuracion
    supabase.js       # Cliente Supabase
    utils.js          # Funciones auxiliares
  public/
    argentina-provinces.json  # GeoJSON con las 24 provincias (Natural Earth)
  styles.css          # Sistema de diseno global
```

---

## Desplegar en Vercel

```bash
cd prototipo
vercel deploy --prod
```

O conectar el repositorio de GitHub en Vercel con `prototipo` como Root Directory.
