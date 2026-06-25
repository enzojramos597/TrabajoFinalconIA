"use client";

import { useState } from "react";
import { roleConfig } from "../../lib/constants";

export default function LoginModal({ onClose, onLogin, appUsers = [] }) {
  const [mode, setMode] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    password: "",
    passwordConfirm: "",
    childName: "",
    childAge: "",
    reason: "",
    specialty: "",
    licenseNumber: "",
    province: "Buenos Aires",
    internalCode: "",
  });

  function updateData(field, value) {
    setData({ ...data, [field]: value });
    setErrors((currentErrors) => ({ ...currentErrors, [field]: "" }));
    setMessage("");
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setMessage("");
    setErrors({});
  }

  function emailIsValid(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function emailIsRegistered(value) {
    return appUsers.some((user) => user.email?.toLowerCase() === value.toLowerCase());
  }

  function fieldClass(field) {
    const base = "field";
    if (errors[field]) return `${base} invalid`;
    if (field === "email" && data.email && emailIsValid(data.email) && (mode === "register" || emailIsRegistered(data.email))) return `${base} valid`;
    if (field === "password" && data.password.length >= 6) return `${base} valid`;
    if (field === "passwordConfirm" && data.passwordConfirm && data.passwordConfirm === data.password) return `${base} valid`;
    if (field === "name" && data.name.trim()) return `${base} valid`;
    return base;
  }

  function validateAccess() {
    const nextErrors = {};

    if (!data.email.trim()) nextErrors.email = "Ingresa tu correo electronico.";
    else if (!emailIsValid(data.email)) nextErrors.email = "Ingresa un correo valido.";
    else if (mode === "login" && appUsers.length > 0 && !emailIsRegistered(data.email)) nextErrors.email = "Ese correo no esta registrado.";

    if (!data.password) nextErrors.password = "Ingresa tu contrasena.";
    else if (data.password.length < 6) nextErrors.password = "La contrasena debe tener al menos 6 caracteres.";

    if (mode === "register") {
      if (!data.name.trim()) nextErrors.name = "Completa el nombre completo.";
      if (!data.passwordConfirm) nextErrors.passwordConfirm = "Repite la contrasena.";
      else if (data.password !== data.passwordConfirm) nextErrors.passwordConfirm = "Las claves no coinciden.";
    }

    setErrors(nextErrors);
    return nextErrors;
  }

  async function submitAccess() {
    const nextErrors = validateAccess();
    if (Object.keys(nextErrors).length > 0) {
      setMessage("Revisa los campos marcados para continuar.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");
      await onLogin(roleConfig.family, data, mode);
    } catch (error) {
      if (mode === "login") {
        const text = error?.message || "";
        setErrors(text.includes("Contrasena") ? { password: "Contrasena incorrecta." } : { email: "Cuenta no registrada." });
      }
      setMessage(mode === "login"
        ? "No encontramos una cuenta con ese correo y perfil. Usa Registrarse para crearla."
        : "No se pudo completar el registro. Verifica Supabase o intenta con otro email.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Login por perfil">
      <form className="login-modal" onSubmit={(event) => { event.preventDefault(); submitAccess(); }}>
        <header className="modal-head">
          <div>
            <p className="eyebrow">Acceso al sistema</p>
            <h2>{mode === "login" ? "Iniciar sesion" : "Crear cuenta"}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Cerrar login">x</button>
        </header>

        <p className="login-intro">
          {mode === "login"
            ? "Ingresa con tu correo y contrasena. El sistema detecta si sos padre/tutor, profesional o administrador."
            : "Registro exclusivo para padres y tutores que necesitan reservar turnos."}
        </p>

        <div className="form-grid">
          {mode === "register" && (
            <label className={fieldClass("name")}>
              <span>Nombre completo</span>
              <input value={data.name} onChange={(event) => updateData("name", event.target.value)} placeholder="Ej: Enzo Ramos" />
              {errors.name && <small className="field-error">{errors.name}</small>}
            </label>
          )}
          <label className={fieldClass("email")}>
            <span>Correo electronico</span>
            <input type="email" value={data.email} onChange={(event) => updateData("email", event.target.value)} placeholder="Ej: enzo.j.ramos@gmail.com" />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </label>
          <label className={fieldClass("password")}>
            <span>Contrasena</span>
            <input type="password" value={data.password} onChange={(event) => updateData("password", event.target.value)} placeholder="********" />
            {errors.password && <small className="field-error">{errors.password}</small>}
          </label>
          {mode === "register" && (
            <label className={fieldClass("passwordConfirm")}>
              <span>Repetir contrasena</span>
              <input type="password" value={data.passwordConfirm} onChange={(event) => updateData("passwordConfirm", event.target.value)} placeholder="********" />
              {errors.passwordConfirm && <small className="field-error">{errors.passwordConfirm}</small>}
            </label>
          )}

          {mode === "register" && (
            <>
              <label className="field">
                <span>WhatsApp</span>
                <input value={data.whatsapp} onChange={(event) => updateData("whatsapp", event.target.value)} placeholder="Ej: 5491122233344" />
              </label>
              <label className="field">
                <span>Nombre del hijo/a</span>
                <input value={data.childName} onChange={(event) => updateData("childName", event.target.value)} placeholder="Ej: Martina" />
              </label>
              <label className="field">
                <span>Edad</span>
                <input value={data.childAge} onChange={(event) => updateData("childAge", event.target.value)} placeholder="Ej: 8" />
              </label>
              <label className="field wide">
                <span>Motivo de consulta</span>
                <textarea value={data.reason} onChange={(event) => updateData("reason", event.target.value)} placeholder="Ej: Dificultades para sostener la atencion y organizar tareas escolares." />
              </label>
            </>
          )}
        </div>

        <div className="login-helper">
          {mode === "login" ? (
            <p>No tenes cuenta? <button type="button" onClick={() => changeMode("register")}>Registrarse</button></p>
          ) : (
            <p>Ya tenes cuenta? <button type="button" onClick={() => changeMode("login")}>Iniciar sesion</button></p>
          )}
        </div>

        <div className="notice">
          <strong>Prototipo de autenticacion</strong>
          <p>{mode === "login"
            ? "Los profesionales y administradores deben estar dados de alta previamente por administracion."
            : "El registro guarda una cuenta familiar en Supabase. La clave no se persiste en texto plano."}</p>
        </div>

        {message && (
          <div className="notice warn-notice">
            <strong>Atencion</strong>
            <p>{message}</p>
          </div>
        )}

        <div className="actions">
          <button type="submit" className="primary-btn" disabled={isSubmitting}>
            {isSubmitting
              ? "Procesando..."
              : mode === "login"
                ? "Ingresar"
                : "Registrarme como padre/tutor"}
          </button>
          <button type="button" className="ghost-btn" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
