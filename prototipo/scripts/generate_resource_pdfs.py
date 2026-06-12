from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    Image,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
OUT_DIR = PUBLIC / "recursos"
LOGO = PUBLIC / "psico-puente-icon.png"


RESOURCES = [
    {
        "filename": "rutina-visual-tareas.pdf",
        "title": "Rutina visual para organizar tareas",
        "age": "6 a 12 anos",
        "area": "Organizacion y autonomia",
        "objective": "Ayudar al nino a anticipar pasos, sostener la atencion y terminar tareas escolares con menos acompanamiento adulto.",
        "materials": ["Hoja A4", "Lapices de colores", "Reloj o temporizador", "Stickers o marcas de avance"],
        "steps": [
            "Dibujar tres casilleros: preparar, hacer y revisar.",
            "Escribir o dibujar una tarea pequena en cada casillero.",
            "Usar un temporizador de 15 minutos para el momento de trabajo.",
            "Al finalizar, marcar que paso resulto mas facil y cual necesita ayuda.",
        ],
        "family_tip": "Evitar corregir todo junto. Primero reconocer el avance y luego elegir una sola mejora para trabajar.",
    },
    {
        "filename": "juego-atencion-consignas.pdf",
        "title": "Juego de atencion y seguimiento de consignas",
        "age": "7 a 12 anos",
        "area": "Atencion y funciones ejecutivas",
        "objective": "Entrenar escucha, memoria de trabajo y control de impulsos mediante consignas breves y progresivas.",
        "materials": ["Tarjetas de colores", "Objetos de la casa", "Mesa despejada", "Cronometro opcional"],
        "steps": [
            "Comenzar con una consigna de dos pasos, por ejemplo: tomar el lapiz rojo y ponerlo sobre el cuaderno.",
            "Aumentar a tres pasos cuando el nino logre hacerlo sin repetir la consigna.",
            "Intercalar consignas con movimiento para sostener motivacion.",
            "Cerrar preguntando: que estrategia te ayudo a recordar?",
        ],
        "family_tip": "Dar la consigna una vez, esperar unos segundos y permitir que el nino pida repeticion si la necesita.",
    },
    {
        "filename": "lectura-compartida-comprension.pdf",
        "title": "Lectura compartida para mejorar comprension",
        "age": "6 a 10 anos",
        "area": "Lectura y comprension",
        "objective": "Fortalecer comprension lectora, vocabulario y expresion oral en un momento breve de lectura familiar.",
        "materials": ["Cuento breve", "Marcador o senalador", "Hoja para dibujar", "Lapiz"],
        "steps": [
            "Leer un parrafo corto y detenerse para anticipar que puede pasar.",
            "Subrayar o repetir tres palabras importantes.",
            "Pedir al nino que dibuje la escena principal.",
            "Cerrar con tres preguntas: quien, que paso y por que.",
        ],
        "family_tip": "No convertir la lectura en examen. Alternar lectura del adulto con pequenas partes leidas por el nino.",
    },
    {
        "filename": "semaforo-emocional-aprendizaje.pdf",
        "title": "Semaforo emocional antes de estudiar",
        "age": "Todas las edades",
        "area": "Emociones y aprendizaje",
        "objective": "Reconocer el estado emocional antes de iniciar tareas para elegir una estrategia de regulacion.",
        "materials": ["Tres circulos de color rojo, amarillo y verde", "Hoja de registro", "Lapices"],
        "steps": [
            "Antes de comenzar, elegir un color: rojo si necesita pausa, amarillo si necesita ayuda, verde si puede empezar.",
            "Si marca rojo, hacer respiracion o descanso de tres minutos.",
            "Si marca amarillo, definir que ayuda necesita y en que paso.",
            "Al terminar, volver a elegir color y comparar como cambio.",
        ],
        "family_tip": "Validar la emocion antes de pedir rendimiento. Un nino regulado aprende con mas disponibilidad.",
    },
]


def paragraph(text, style):
    return Paragraph(text, style)


def build_pdf(resource):
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    output = OUT_DIR / resource["filename"]
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="Brand",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=28,
            textColor=colors.HexColor("#676990"),
            spaceAfter=2,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Subtitle",
            parent=styles["Normal"],
            fontSize=13,
            leading=16,
            textColor=colors.HexColor("#75766c"),
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionTitle",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#676990"),
            spaceBefore=10,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Body",
            parent=styles["BodyText"],
            fontSize=11,
            leading=15,
            textColor=colors.HexColor("#3f423d"),
            spaceAfter=6,
        )
    )

    doc = SimpleDocTemplate(
        str(output),
        pagesize=A4,
        rightMargin=1.7 * cm,
        leftMargin=1.7 * cm,
        topMargin=1.4 * cm,
        bottomMargin=1.4 * cm,
        title=resource["title"],
    )

    logo = Image(str(LOGO), width=3.2 * cm, height=2.4 * cm)
    brand = [
        paragraph("PSICO-PUENTE", styles["Brand"]),
        paragraph("Orientación y seguimiento familiar", styles["Subtitle"]),
        paragraph("Centro Psicopedagógico", styles["Subtitle"]),
    ]
    header = Table([[logo, brand]], colWidths=[3.8 * cm, 13 * cm])
    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#f4f3fb")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#d9d9e8")),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )

    story = [header, Spacer(1, 16)]
    story.append(paragraph(resource["title"], styles["Title"]))
    story.append(paragraph(f"Edad sugerida: {resource['age']} | Area: {resource['area']}", styles["Subtitle"]))
    story.append(Spacer(1, 10))
    story.append(paragraph("Objetivo", styles["SectionTitle"]))
    story.append(paragraph(resource["objective"], styles["Body"]))
    story.append(paragraph("Materiales", styles["SectionTitle"]))
    story.append(
        ListFlowable(
            [ListItem(paragraph(item, styles["Body"])) for item in resource["materials"]],
            bulletType="bullet",
            leftIndent=16,
        )
    )
    story.append(paragraph("Paso a paso", styles["SectionTitle"]))
    story.append(
        ListFlowable(
            [ListItem(paragraph(item, styles["Body"])) for item in resource["steps"]],
            bulletType="1",
            leftIndent=18,
        )
    )
    story.append(paragraph("Sugerencia para la familia", styles["SectionTitle"]))
    story.append(paragraph(resource["family_tip"], styles["Body"]))
    story.append(Spacer(1, 16))
    story.append(paragraph("Este material es orientativo y no reemplaza la evaluacion profesional.", styles["Subtitle"]))
    doc.build(story)


def main():
    for resource in RESOURCES:
        build_pdf(resource)


if __name__ == "__main__":
    main()
