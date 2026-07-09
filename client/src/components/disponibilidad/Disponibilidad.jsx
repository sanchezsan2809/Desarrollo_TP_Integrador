import { useState, useEffect } from "react";
import { medicoService } from "../../services/api";
import "./Disponibilidad.css";



// ID simulado para la cursada/desarrollo local sacado de tus logs de consola
const ID_MEDICO_MOCK = "64a111111111111111111111";
// Datos mínimos exigidos por el esquema de Zod en el GET
const SERVICIO_CONTESTO_MOCK = {
  tipo: "practica",
  idServicio: "1236" // Un ID que tu médico tenga asignado
};

const DIAS = [
  { value: "LUNES",     label: "Lunes" },
  { value: "MARTES",    label: "Martes" },
  { value: "MIERCOLES", label: "Miércoles" },
  { value: "JUEVES",    label: "Jueves" },
  { value: "VIERNES",   label: "Viernes" },
  { value: "SABADO",    label: "Sábado" },
  { value: "DOMINGO",   label: "Domingo" },
];

const HORARIOS = (() => {
  const slots = [];
  for (let h = 6; h <= 22; h++) {
    slots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 22) slots.push(`${String(h).padStart(2, "0")}:30`);
  }
  return slots;
})();

const filaVacia = () => ({ diaSemana: "", horaDesde: "", horaHasta: "" });
const labelDia = (value) => DIAS.find((d) => d.value === value)?.label ?? value;

const horasHasta = (horaDesde) => { 
  if (!horaDesde) return HORARIOS;
  return HORARIOS.filter((h) => h > horaDesde);
};

export default function Disponibilidad() {
  const { user } = useAuth()

  const [disponibilidades, setDisponibilidades] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  const [editando, setEditando] = useState(false);
  const [filas, setFilas] = useState([]);
  const [errores, setErrores] = useState([]);
  const [errorGlobal, setErrorGlobal] = useState(null);
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    async function cargarDatos() {
      try {
        setCargando(true);
        const data = await medicoService.consultarDisponibilidades(
          ID_MEDICO_MOCK,
          SERVICIO_CONTESTO_MOCK.tipo,
          SERVICIO_CONTESTO_MOCK.idServicio
        );
        
        const normalizadas = data.map(d => ({
          diaSemana: d.diaSemana || d.dia,
          horaDesde: d.horaDesde,
          horaHasta: d.horaHasta
        }));
        
        setDisponibilidades(normalizadas);
      } catch (error) {
        setErrorGlobal(error.message || "Error al cargar las disponibilidades.");
      } finally {
        setCargando(false);
      }
    }
    cargarDatos();
  }, []);

  const mostrarAlerta = (mensaje, variante = "exito") => {
    setAlerta({ mensaje, variante });
    setTimeout(() => setAlerta(null), 3000);
  };

  const abrirEdicion = () => {
    setFilas(disponibilidades.map((d) => ({ ...d })));
    setErrores(disponibilidades.map(() => ({})));
    setErrorGlobal(null);
    setEditando(true);
  };

  const cerrarEdicion = () => {
    setEditando(false);
    setFilas([]);
    setErrores([]);
    setErrorGlobal(null);
  };

  const agregarFila = () => {
    setFilas((prev) => [...prev, filaVacia()]);
    setErrores((prev) => [...prev, {}]);
  };

  const eliminarFila = (idx) => {
    setFilas((prev) => prev.filter((_, i) => i !== idx));
    setErrores((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleChange = (idx, campo, valor) => {
    setFilas((prev) => {
      const copia = prev.map((f) => ({ ...f }));
      copia[idx][campo] = valor;
      
      // 🌟 Corrección que aplicamos antes
      if (campo === "horaDesde" && copia[idx].horaHasta && copia[idx].horaHasta <= valor) {
        copia[idx].horaHasta = "";
      }
      return copia;
    });

    setErrores((prev) => {
      const copia = prev.map((e) => ({ ...e }));
      if (copia[idx]) delete copia[idx][campo];
      return copia;
    });
    setErrorGlobal(null);
  };

  const validar = () => {
    if (filas.length === 0) {
      setErrorGlobal("Agregá al menos una disponibilidad.");
      return false;
    }
    
    const nuevosErrores = filas.map((f) => {
      const e = {};
      if (!f.diaSemana) e.diaSemana = "Requerido";
      if (!f.horaDesde) e.horaDesde = "Requerido";
      if (!f.horaHasta) e.horaHasta = "Requerido";
      return e;
    });

    const hayErrores = nuevosErrores.some((e) => Object.keys(e).length > 0);
    if (hayErrores) {
      setErrores(nuevosErrores);
      setErrorGlobal("Completá todos los campos antes de confirmar.");
      return false;
    }

    return true;
  };

  const handleConfirmar = async () => {
    if (!validar()) return;
    setErrorGlobal(null);

    try {
      const dataActualizada = await medicoService.modificarDisponibilidades(ID_MEDICO_MOCK, filas);
      
      if (dataActualizada && dataActualizada.disponibilidades) {
        setDisponibilidades(dataActualizada.disponibilidades.map(d => ({
          diaSemana: d.diaSemana || d.dia,
          horaDesde: d.horaDesde,
          horaHasta: d.horaHasta
        })));
      } else {
        setDisponibilidades(filas.map((f) => ({ ...f })));
      }

      cerrarEdicion();
      mostrarAlerta("Disponibilidad actualizada correctamente en el servidor.");
    } catch (error) {
      setErrorGlobal(error.message || "No se pudieron guardar las disponibilidades.");
      mostrarAlerta("Error al guardar.", "advertencia");
    }
  };

  if (cargando) {
    return <div className="gs-page"><p className="gs-vacio">Cargando disponibilidades...</p></div>;
  }

  return (
    <div className="gs-page">
      {alerta && (
        <div className={`gs-toast gs-toast--${alerta.variante}`}>
          {alerta.variante === "exito" ? "✓" : "⚠"} {alerta.mensaje}
        </div>
      )}

      <h1 className="gs-titulo">Disponibilidad horaria</h1>

      {/* ── Tarjetas actuales ── */}
      {disponibilidades.length === 0 ? (
        <p className="gs-vacio">No hay disponibilidades registradas.</p>
      ) : (
        <div className="gs-cards">
          {disponibilidades.map((d, i) => (
            <div className="gs-card" key={i}>
              <span className="gs-card__dia">{labelDia(d.diaSemana)}</span>
              <span className="gs-card__horario">
                <span>{d.horaDesde}</span> — <span>{d.horaHasta}</span>
              </span>
              <span className="gs-card__icono">🕐</span>
            </div>
          ))}
        </div>
      )}

      {/* ── Botón de acción ── */}
      {!editando && (
        <div className="gs-acciones">
          <button className="gs-btn gs-btn--activo" onClick={abrirEdicion}>
            ✎ Modificar disponibilidades
          </button>
        </div>
      )}

      {/* ── Formulario de edición ── */}
      {editando && (
        <div className="gs-form">
          <h2 className="gs-form__titulo">Modificar disponibilidades</h2>
          <p className="gs-form__subtitulo">
            Definí la nueva lista completa. Al confirmar se reemplaza la anterior y se sincronizarán los turnos futuros.
          </p>

          {filas.length > 0 && (
            <>
              <div className="gs-disp-header">
                <span>Día</span>
                <span>Desde</span>
                <span>Hasta</span>
                <span>·</span>
              </div>

              <div className="gs-disp-lista">
                {filas.map((fila, idx) => (
                  <div className="gs-disp-fila" key={idx}>
                    {/* Día */}
                    <select
                      value={fila.diaSemana}
                      onChange={(e) => handleChange(idx, "diaSemana", e.target.value)}
                      className={errores[idx]?.diaSemana ? "gs-input--error" : ""}
                    >
                      <option value="">Día</option>
                      {DIAS.map((d) => (
                        <option key={d.value} value={d.value}>{d.label}</option>
                      ))}
                    </select>

                    {/* Hora desde */}
                    <select
                      value={fila.horaDesde}
                      onChange={(e) => handleChange(idx, "horaDesde", e.target.value)}
                      className={errores[idx]?.horaDesde ? "gs-input--error" : ""}
                    >
                      <option value="">Desde</option>
                      {HORARIOS.map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>

                    {/* Hora hasta */}
                    <select
                      value={fila.horaHasta}
                      onChange={(e) => handleChange(idx, "horaHasta", e.target.value)}
                      className={errores[idx]?.horaHasta ? "gs-input--error" : ""}
                      disabled={!fila.horaDesde}
                    >
                      <option value="">Hasta</option>
                      {horasHasta(fila.horaDesde).map((h) => (
                        <option key={h} value={h}>{h}</option>
                      ))}
                    </select>

                    {/* Eliminar fila */}
                    <button
                      type="button"
                      className="gs-btn--icono"
                      onClick={() => eliminarFila(idx)}
                      title="Eliminar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Agregar fila */}
          <button type="button" className="gs-btn--secundario" onClick={agregarFila}>
            + Agregar franja horaria
          </button>

          {errorGlobal && (
            <p className="gs-error-global">⚠ {errorGlobal}</p>
          )}

          {/* Acciones del form */}
          <div className="gs-acciones" style={{ marginBottom: 0 }}>
            <button className="gs-btn gs-btn--primario" onClick={handleConfirmar}>
              Confirmar cambios
            </button>
            <button className="gs-btn" onClick={cerrarEdicion}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}