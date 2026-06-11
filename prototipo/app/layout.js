import "./globals.css";

export const metadata = {
  title: "Psico-Puente",
  description: "Prototipo navegable para el trabajo final integrador.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
