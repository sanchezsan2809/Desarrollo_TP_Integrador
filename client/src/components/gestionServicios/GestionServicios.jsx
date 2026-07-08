import { useState, useEffect } from "react";
import "./GestionServicios.css";
import { medicoService } from "../../services/api";
import { SEED_IDS } from "../../mockdata/seedIDs";

const formVacio = { tipo: "", nombre: "", duracionTurnoEnMins: "", costo: "" };
const ID_RESPALDO_MONGO = "64a111111111111111111111";

export default function GestionServicios() {
  const idMedico = SEED_IDS.MILK?.id || SEED_IDS.MEDICO_MILK || ID_RESPALDO_MONGO;
  
  const [listas, setListas] = useState({ especialidad: [], practica: [] });
  const [accion, setAccion] = useState(null); 
  const [form, setForm] = useState(formVacio);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    async function cargarServicios() {
      // 🌟 CLÁUSULA DE GUARDA: Evita mandar 'undefined' al backend
      if (!idMedico || idMedico === "undefined") {
        console.warn("⚠️ idMedico no está definido aún en el sistema.");
        return;
      }

      try {
        const data = await medicoService.obtenerServicios(idMedico);
        if (data) {
          setListas(data);
        }
      } catch (error) {
        mostrarAlerta("Error al conectar con el servidor y cargar servicios.", "advertencia");
      }
    }
    cargarServicios();
  }, [idMedico]);

  const todosLosServicios = [
    ...listas.especialidad.map((s) => ({ ...s, tipo: "especialidad" })),
    ...listas.practica.map((s) => ({ ...s, tipo: "practica" })),
  ];

  const mostrarAlerta = (mensaje, variante = "exito") => {
    setAlerta({ mensaje, variante });
    setTimeout(() => setAlerta(null), 3000);
  };

  const seleccionarAccion = (nueva) => {
    setAccion(nueva === accion ? null : nueva);
    setForm(formVacio);
    setErrores({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errores[name]) setErrores((p) => ({ ...p, [name]: null }));
  };

  // ALTA
  const handleAlta = async () => {
    const e = {};
    if (!form.id || form.id <= 0) e.id = "El ID es obligatorio.";
    if (!form.tipo) e.tipo = "Seleccioná un tipo.";
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!form.duracionTurnoEnMins || form.duracionTurnoEnMins <= 0) e.duracionTurnoEnMins = "Ingresá una duración válida.";
    if (!form.costo || form.costo <= 0) e.costo = "Ingresá un costo válido.";
    if (Object.keys(e).length) { setErrores(e); return; }

    const nuevo = {
      id: String(form.id),
      nombre: form.nombre.trim(),
      duracionTurnoEnMins: Number(form.duracionTurnoEnMins),
      costo: Number(form.costo),
      ...(form.tipo === "practica" && { codigo: `PRAC-${form.id}` })
    };

    try {
      await medicoService.agregarServicio(idMedico, form.tipo, nuevo);
      setListas((p) => ({ ...p, [form.tipo]: [...p[form.tipo], nuevo] }));
      setForm(formVacio);
      mostrarAlerta("Servicio dado de alta correctamente.");
    } catch (error) {
      const msgError = error.error?.[0]?.message || error.message || "No se pudo dar de alta el servicio";
      mostrarAlerta(msgError, "advertencia");
    }
  };

  // MODIFICAR
  const handleModificar = async () => {
    const e = {};
    if (!form.id) e.id = "Seleccioná un servicio.";
    if (!form.nombre.trim()) e.nombre = "El nombre es obligatorio.";
    if (!form.duracionTurnoEnMins || form.duracionTurnoEnMins <= 0) e.duracionTurnoEnMins = "Ingresá una duración válida.";
    if (!form.costo || form.costo <= 0) e.costo = "Ingresá un costo válido.";
    if (Object.keys(e).length) { setErrores(e); return; }

    const tipo = form.tipo;
    const actualizado = {
      id: form.id,
      nombre: form.nombre.trim(),
      duracionTurnoEnMins: Number(form.duracionTurnoEnMins),
      costo: Number(form.costo),
    };

    try {
      const tipoBackend = tipo.toUpperCase();
      await medicoService.modificarServicio(idMedico, tipoBackend, actualizado.id, actualizado);

      setListas((p) => ({
        ...p,
        [tipo]: p[tipo].map((s) => 
          s.id.toString() === actualizado.id.toString() ? { ...s, ...actualizado } : s
        ),
      }));
      setForm(formVacio);
      mostrarAlerta("Servicio modificado correctamente.");
    } catch (error) {
      mostrarAlerta(error.message || "No se pudo modificar el servicio", "advertencia");
    }
  };

  // BAJA
  const handleBaja = async () => {
    if (!form.id) { setErrores({ id: "Seleccioná un servicio." }); return; }
    const tipo = form.tipo;
    const idServicio = form.id;

    try {
      const tipoBackend = tipo.toUpperCase();
      await medicoService.eliminarServicio(idMedico, tipoBackend, idServicio);

      setListas((p) => ({
        ...p,
        [tipo]: p[tipo].filter((s) => s.id.toString() !== idServicio.toString()),
      }));
      setForm(formVacio);
      mostrarAlerta("Servicio dado de baja.", "advertencia");
    } catch (error) {
      mostrarAlerta(error.message || "No se pudo eliminar el servicio", "advertencia");
    }
  };

  const seleccionarServicio = (e) => {
    const valorSeleccionado = e.target.value; // formato: "tipo-id"
    if (!valorSeleccionado) {
      setForm(formVacio);
      return;
    }

    const [tipo, id] = valorSeleccionado.split("-");
    const servicio = todosLosServicios.find(
      (s) => s.tipo === tipo && s.id.toString() === id.toString()
    );

    if (!servicio) {
      setForm(formVacio);
      return;
    }

    setForm({
      id: servicio.id,
      tipo: servicio.tipo,
      nombre: servicio.nombre,
      duracionTurnoEnMins: servicio.duracionTurnoEnMins,
      costo: servicio.costo,
    });

    if (errores.id) setErrores((p) => ({ ...p, id: null }));
  };

  return (
    <div className="gs-page">
      {alerta && (
        <div className={`gs-toast gs-toast--${alerta.variante}`}>
          {alerta.variante === "exito" ? "✓" : "⚠"} {alerta.mensaje}
        </div>
      )}

      <h1 className="gs-titulo">Gestión de Servicios</h1>

      <div className="gs-tabla-wrapper">
        {todosLosServicios.length === 0 ? (
          <p className="gs-vacio">No hay servicios registrados.</p>
        ) : (
          <table className="gs-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Duración</th>
                <th>Costo</th>
              </tr>
            </thead>
            <tbody>
              {todosLosServicios.map((s) => (
                <tr key={`${s.tipo}-${s.id}`}>
                  <td>{s.nombre}</td>
                  <td>
                    <span className={`gs-badge gs-badge--${s.tipo}`}>
                      {s.tipo === "especialidad" ? "Especialidad" : "Práctica"}
                    </span>
                  </td>
                  <td>{s.duracionTurnoEnMins} min</td>
                  <td>${s.costo.toLocaleString("es-AR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="gs-acciones">
        <button
          className={`gs-btn ${accion === "alta" ? "gs-btn--activo" : ""}`}
          onClick={() => seleccionarAccion("alta")}
        >
          + Alta de servicio
        </button>
        <button
          className={`gs-btn ${accion === "modificar" ? "gs-btn--activo" : ""}`}
          onClick={() => seleccionarAccion("modificar")}
        >
          ✎ Modificar servicio
        </button>
        <button
          className={`gs-btn gs-btn--peligro-outline ${accion === "baja" ? "gs-btn--peligro-activo" : ""}`}
          onClick={() => seleccionarAccion("baja")}
        >
          ✕ Baja de servicio
        </button>
      </div>

      {accion === "alta" && (
        <div className="gs-form">
          <h2 className="gs-form__titulo">Alta de servicio</h2>

          <div className="gs-campo">
            <label>Tipo</label>
            <div className="gs-toggle">
              <button type="button"
                className={`gs-toggle__btn ${form.tipo === "especialidad" ? "gs-toggle__btn--activo" : ""}`}
                onClick={() => { setForm((p) => ({ ...p, tipo: "especialidad" })); setErrores((p) => ({ ...p, tipo: null })); }}
              >Especialidad</button>
              <button type="button"
                className={`gs-toggle__btn ${form.tipo === "practica" ? "gs-toggle__btn--activo" : ""}`}
                onClick={() => { setForm((p) => ({ ...p, tipo: "practica" })); setErrores((p) => ({ ...p, tipo: null })); }}
              >Práctica</button>
            </div>
            {errores.tipo && <span className="gs-error">{errores.tipo}</span>}
          </div>

          <div className="gs-campo">
            <label htmlFor="alta-id">ID</label>
            <input id="alta-id" name="id" type="number" min="1" placeholder="Ej: 10"
              value={form.id || ""} onChange={handleChange}
              className={errores.id ? "gs-input--error" : ""} />
            {errores.id && <span className="gs-error">{errores.id}</span>}
          </div>

          <div className="gs-campo">
            <label htmlFor="nombre">Nombre</label>
            <input id="nombre" name="nombre" type="text" placeholder="Ej: Ecocardiograma"
              value={form.nombre} onChange={handleChange}
              className={errores.nombre ? "gs-input--error" : ""} />
            {errores.nombre && <span className="gs-error">{errores.nombre}</span>}
          </div>

          <div className="gs-fila-dos">
            <div className="gs-campo">
              <label htmlFor="duracionTurnoEnMins">Duración (min)</label>
              <input id="duracionTurnoEnMins" name="duracionTurnoEnMins" type="number" min="1" placeholder="30"
                value={form.duracionTurnoEnMins} onChange={handleChange}
                className={errores.duracionTurnoEnMins ? "gs-input--error" : ""} />
              {errores.duracionTurnoEnMins && <span className="gs-error">{errores.duracionTurnoEnMins}</span>}
            </div>
            <div className="gs-campo">
              <label htmlFor="costo">Costo ($)</label>
              <input id="costo" name="costo" type="number" min="0" placeholder="5000"
                value={form.costo} onChange={handleChange}
                className={errores.costo ? "gs-input--error" : ""} />
              {errores.costo && <span className="gs-error">{errores.costo}</span>}
            </div>
          </div>

          <button className="gs-btn gs-btn--primario" onClick={handleAlta}>Confirmar alta</button>
        </div>
      )}

      {accion === "modificar" && (
        <div className="gs-form">
          <h2 className="gs-form__titulo">Modificar servicio</h2>

          <div className="gs-campo">
            <label htmlFor="sel-modificar">Servicio a modificar</label>
            <select id="sel-modificar" value={`${form.tipo}-${form.id}`.includes("undefined") ? "" : `${form.tipo}-${form.id}`} onChange={seleccionarServicio}
              className={errores.id ? "gs-input--error" : ""}>
              <option value="">Seleccioná un servicio</option>
              {todosLosServicios.map((s) => (
                <option key={`${s.tipo}-${s.id}`} value={`${s.tipo}-${s.id}`}>
                  {s.nombre} ({s.tipo === "especialidad" ? "Especialidad" : "Práctica"})
                </option>
              ))}
            </select>
            {errores.id && <span className="gs-error">{errores.id}</span>}
          </div>

          {form.id && (
            <>
              <div className="gs-campo">
                <label htmlFor="mod-id">ID</label>
                <input id="mod-id" type="number" value={form.id} disabled />
              </div>

              <div className="gs-campo">
                <label htmlFor="mod-nombre">Nombre</label>
                <input id="mod-nombre" name="nombre" type="text"
                  value={form.nombre} onChange={handleChange}
                  className={errores.nombre ? "gs-input--error" : ""} />
                {errores.nombre && <span className="gs-error">{errores.nombre}</span>}
              </div>

              <div className="gs-fila-dos">
                <div className="gs-campo">
                  <label htmlFor="mod-duracion">Duración (min)</label>
                  <input id="mod-duracion" name="duracionTurnoEnMins" type="number" min="1"
                    value={form.duracionTurnoEnMins} onChange={handleChange}
                    className={errores.duracionTurnoEnMins ? "gs-input--error" : ""} />
                  {errores.duracionTurnoEnMins && <span className="gs-error">{errores.duracionTurnoEnMins}</span>}
                </div>
                <div className="gs-campo">
                  <label htmlFor="mod-costo">Costo ($)</label>
                  <input id="mod-costo" name="costo" type="number" min="0"
                    value={form.costo} onChange={handleChange}
                    className={errores.costo ? "gs-input--error" : ""} />
                  {errores.costo && <span className="gs-error">{errores.costo}</span>}
                </div>
              </div>
            </>
          )}

          <button className="gs-btn gs-btn--primario" onClick={handleModificar}>Confirmar modificación</button>
        </div>
      )}

      {accion === "baja" && (
        <div className="gs-form gs-form--baja">
          <h2 className="gs-form__titulo">Baja de servicio</h2>

          <div className="gs-campo">
            <label htmlFor="sel-baja">Servicio a dar de baja</label>
            <select id="sel-baja" value={`${form.tipo}-${form.id}`.includes("undefined") ? "" : `${form.tipo}-${form.id}`} onChange={seleccionarServicio}
              className={errores.id ? "gs-input--error" : ""}>
              <option value="">Seleccioná un servicio</option>
              {todosLosServicios.map((s) => (
                <option key={`${s.tipo}-${s.id}`} value={`${s.tipo}-${s.id}`}>
                  {s.nombre} ({s.tipo === "especialidad" ? "Especialidad" : "Práctica"})
                </option>
              ))}
            </select>
            {errores.id && <span className="gs-error">{errores.id}</span>}
          </div>

          {form.id && (
            <p className="gs-baja__aviso">
              ⚠ Vas a dar de baja <strong>{form.nombre}</strong>. Esta acción no se puede deshacer.
            </p>
          )}

          <button className="gs-btn gs-btn--peligro" onClick={handleBaja}>Confirmar baja</button>
        </div>
      )}
    </div>
  );
}