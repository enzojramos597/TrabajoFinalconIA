# Psico-Puente

Prototipo funcional navegable desarrollado con Next.js y React para el Trabajo Final Integrador del curso Desarrollo de Aplicaciones Web con Inteligencia Artificial.

## Funcionalidades del prototipo

- Pagina publica de presentacion del centro.
- Directorio de profesionales con filtros.
- Reserva de turnos con login familiar simulado.
- Calendario de lunes a viernes, con sesiones de 1 hora entre 9 a 12 y 17 a 20.
- Bloqueo de turnos ocupados.
- ABM de profesionales con alta, edicion, desactivacion y reactivacion.
- Generacion de mensaje automatico para WhatsApp.
- Acceso a Google Maps desde la direccion del profesional.
- Panel familiar con turnos, historial y evolucion.
- Panel profesional para agenda e informes.
- Panel administrador con estadisticas simuladas.
- Seccion de recursos y preguntas frecuentes.
- Integracion opcional con Supabase para persistir profesionales y turnos.

## Ejecutar localmente

Instalar dependencias:

```bash
npm install
```

Iniciar el servidor de desarrollo:

```bash
npm run dev
```

Luego abrir:

```text
http://localhost:3000
```

## Configurar Supabase

1. Crear un proyecto en Supabase.
2. Abrir SQL Editor y ejecutar el archivo `supabase/schema.sql`.
3. Copiar `.env.example` como `.env.local`.
4. Completar las variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_publica
```

5. Reiniciar el servidor local.

Si estas variables no estan cargadas, el sitio sigue funcionando en modo demo local.

## Desplegar en Vercel

1. Subir los cambios a GitHub.
2. Crear un proyecto en Vercel conectado al repositorio.
3. Configurar `prototipo` como Root Directory.
4. Agregar en Vercel las mismas variables de entorno de Supabase.
5. Deploy.

## Tecnologias

- Next.js
- React
- HTML, CSS y JavaScript
- Supabase Cloud
- Vercel para despliegue
