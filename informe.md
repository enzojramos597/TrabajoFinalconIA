# Informe del Trabajo Final Integrador

## Proyecto

**Nombre tentativo:** Centro de Asistencia Psicopedagogico

**Curso:** Desarrollo de Aplicaciones Web con Inteligencia Artificial

**Tipo de entrega:** Aplicacion web funcional, repositorio, documentacion breve, despliegue y defensa final.

## 1. Presentacion del proyecto

El proyecto consiste en el desarrollo de una aplicacion web para un Centro de Asistencia Psicopedagogico. La plataforma busca facilitar el vinculo entre familias y profesionales psicopedagogicos, centralizando informacion, busqueda de especialistas, reserva de turnos, recursos para familias y seguimiento basico de consultas.

La propuesta se orienta a resolver una necesidad concreta: muchas familias necesitan orientacion psicopedagogica para sus hijos o hijas, pero encuentran dificultades para identificar profesionales disponibles, conocer sus especialidades, saber donde atienden, pedir un turno y mantener un registro ordenado del proceso de acompanamiento.

La aplicacion sera desarrollada como una version inicial funcional, con alcance viable para el trabajo final, priorizando el flujo principal de busqueda, reserva y seguimiento.

## 2. Problema identificado

Muchas familias detectan dificultades escolares, problemas de atencion, retrasos en aprendizajes, dudas sobre conducta o recomendaciones de la escuela, pero no siempre saben a que profesional recurrir ni como iniciar una consulta psicopedagogica.

La informacion suele estar dispersa en recomendaciones informales, contactos por WhatsApp, publicaciones aisladas o agendas manuales. Esto genera demoras, confusion y poca claridad sobre disponibilidad, especialidades, ubicacion y seguimiento posterior de las sesiones.

Ademas, los profesionales tambien necesitan herramientas para organizar su agenda, registrar pacientes, cargar informes y mantener una comunicacion clara con las familias.

## 3. Usuarios destinatarios

### Familias, padres, madres o tutores

Son los usuarios principales de la plataforma. Necesitan encontrar profesionales, conocer sus especialidades, consultar ubicacion y disponibilidad, reservar turnos, recibir confirmaciones y acceder al seguimiento basico del proceso de su hijo o hija.

### Profesionales psicopedagogicos

Necesitan publicar su perfil profesional, mostrar especialidades y disponibilidad, recibir solicitudes de turnos, organizar su agenda, acceder al historial de pacientes y cargar informes de sesion.

### Administrador del centro

Necesita gestionar los profesionales registrados, verificar informacion basica, administrar provincias o zonas activas y consultar estadisticas generales del funcionamiento de la plataforma.

## 4. Contexto de uso

La aplicacion esta pensada para ser utilizada desde celulares y computadoras. Una familia podria ingresar al sitio luego de notar una dificultad de aprendizaje, recibir una recomendacion de la escuela o buscar orientacion profesional.

Desde la zona publica, cualquier persona podria informarse sobre el centro, consultar preguntas frecuentes, leer recursos orientados a familias y buscar profesionales por provincia, especialidad o disponibilidad.

Luego, al registrarse, la familia podria reservar un turno, consultar proximas consultas, ver historial de sesiones y acceder a informes compartidos por el profesional.

## 5. Objetivo general

Desarrollar una aplicacion web para un Centro de Asistencia Psicopedagogico que permita a las familias encontrar profesionales, reservar turnos y acceder a un seguimiento basico de las consultas, mientras los profesionales pueden gestionar agenda, pacientes e informes.

## 6. Objetivos especificos

- Presentar publicamente el centro, su mision y sus servicios.
- Permitir la busqueda de profesionales por provincia, especialidad y disponibilidad.
- Mostrar fichas de profesionales con informacion relevante para las familias.
- Facilitar la reserva de turnos desde la web.
- Generar mensajes automaticos de confirmacion mediante WhatsApp.
- Incorporar enlaces de ubicacion mediante Google Maps.
- Brindar a las familias un panel con proximos turnos e historial de consultas.
- Permitir que los profesionales carguen informes de sesion y registros de seguimiento.
- Mostrar una evolucion basica del proceso mediante registros o graficos simples.
- Incluir una zona de administracion para gestionar profesionales y consultar estadisticas generales.

## 7. Valor de la solucion

Para las familias, la aplicacion reduce la incertidumbre inicial, facilita el acceso a profesionales psicopedagogicos, ordena la informacion y permite consultar el seguimiento del proceso.

Para los profesionales, centraliza la agenda, los pacientes y los informes, mejorando la organizacion cotidiana.

Para el centro, permite profesionalizar la gestion digital, visualizar informacion general y ofrecer una experiencia mas clara y accesible.

## 8. Alcance inicial del proyecto

Esta seccion se completara durante la etapa de alcance. Se definira que funcionalidades formaran parte de la primera version funcional y cuales quedaran como mejoras futuras.

## 9. Funcionalidades previstas

Esta seccion se completara luego de definir el MVP. Debera incluir las pantallas, flujos principales, validaciones, manejo de datos, integraciones y automatizaciones.

## 10. Tecnologias utilizadas

Para el desarrollo del proyecto se propone construir un prototipo navegable utilizando tecnologias web modernas, priorizando que la aplicacion pueda verse y usarse correctamente tanto en celular como en computadora.

Tecnologias previstas:

- **HTML, CSS y JavaScript:** base de la interfaz web.
- **React:** biblioteca principal para construir una aplicacion navegable por componentes, con vistas reutilizables y una experiencia mas fluida.
- **Diseño responsive:** adaptacion de la interfaz a pantallas moviles y de escritorio.
- **Supabase Cloud:** plataforma prevista para manejar datos, autenticacion y almacenamiento en la nube.
- **Google Maps:** integracion para ubicacion de profesionales y centros.
- **WhatsApp:** generacion automatica de mensajes mediante enlaces personalizados.
- **Vercel:** plataforma prevista para publicar la aplicacion web.

## 11. Manejo de datos

La aplicacion utilizara datos relacionados con familias, profesionales, turnos, informes y recursos. Para la version inicial se podra trabajar con datos simulados durante el prototipo y luego conectarlos a Supabase Cloud para contar con persistencia real.

Supabase permitira organizar la informacion en tablas y facilitar el acceso segun el tipo de usuario: familia, profesional o administrador.

Ejemplos de datos previstos:

- Profesionales.
- Familias registradas.
- Hijos o hijas asociados a una familia.
- Turnos.
- Informes de sesion.
- Recursos para familias.
- Estadisticas generales.

## 12. Integraciones y automatizaciones

Las integraciones previstas son:

- Enlaces de ubicacion y navegacion mediante Google Maps.
- Generacion automatica de mensajes de confirmacion por WhatsApp.
- Persistencia de datos mediante Supabase Cloud.
- Posible generacion de reportes o resumenes internos para administracion.

## 13. Uso de inteligencia artificial durante el desarrollo

Esta seccion registrara como se utilizo la IA durante el proceso de construccion del proyecto.

Usos iniciales:

- Analisis del enunciado del trabajo final.
- Organizacion del proceso recomendado por la catedra.
- Definicion inicial de la idea del proyecto.
- Redaccion del problema, usuarios, contexto de uso y objetivos.

Prompts o pedidos relevantes:

- "Veamos el proceso recomendado para que cumpla el enunciado."
- "Arranquemos por la ideacion."
- "Generar un documento informe.md donde se escriba lo necesario para entregar el trabajo final."

Decisiones tomadas con apoyo de IA:

- Plantear el sistema como una version inicial funcional y no como una plataforma completa.
- Priorizar busqueda de profesionales, reserva de turnos, panel familiar, panel profesional, WhatsApp y Google Maps.
- Documentar el proyecto desde el inicio para facilitar la entrega final.

## 14. Mejoras futuras

Esta seccion se completara al finalizar el alcance. Algunas mejoras posibles son:

- Integracion real con API oficial de WhatsApp.
- Login seguro con roles y autenticacion completa.
- Subida y gestion real de archivos adjuntos.
- Validacion formal de matriculas profesionales.
- Recordatorios automaticos programados.
- Mensajeria interna completa.
- Estadisticas avanzadas para administracion.

## 15. Despliegue

La aplicacion se publicara en Vercel, una plataforma que permite desplegar proyectos web realizados con React de forma simple y accesible mediante un enlace publico.

Cuando el proyecto este terminado, esta seccion incluira:

- Enlace a la aplicacion desplegada.
- Instrucciones para ejecutar el proyecto localmente.
- Aclaraciones sobre variables de entorno necesarias para conectar Supabase, si corresponde.

## 16. Conclusion

Esta seccion se completara al finalizar el desarrollo. Debera resumir el resultado alcanzado, las decisiones principales, las limitaciones del producto y los aprendizajes del proceso.
