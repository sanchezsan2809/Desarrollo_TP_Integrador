import "./ComoFuncionaPage.css";

const ComoFuncionaPage = () => {
  const pasos = [
    {
      numero: "1",
      titulo: "Buscá y Filtrá 🔎",
      descripcion: "Explorá por servicio, sede o tu médico de confianza. Elegí la fecha que mejor se adapte a tu agenda.",
    },
    {
      numero: "2",
      titulo: "Armá tu Preselección 🛒",
      descripcion: "Agregá los turnos que necesites al carrito. Podés seleccionar varias prácticas o consultas a la vez antes de confirmar.",
    },
    {
      numero: "3",
      titulo: "Confirmá y Asistí ✅",
      descripcion: "Revisá el costo total en tu preselección, confirmá la operación y ¡listo! Tus turnos quedarán guardados en tu Historial.",
    }
  ];

  return (
    <div className="como-funciona-page">
      <h1 className="cf-titulo">¿Cómo sacar tu turno en OSECROACK?</h1>
      <p className="cf-subtitulo">Es rápido, fácil y sin demoras. Seguí estos 3 pasos:</p>

      <div className="cf-grid">
        {pasos.map((paso, index) => (
          <div key={index} className="cf-card">
            <div className="cf-numero">{paso.numero}</div>
            <h3>{paso.titulo}</h3>
            <p>{paso.descripcion}</p>
          </div>
        ))}
      </div>

      <div className="cf-footer-box">
        <h3>¿Tenés alguna duda extra?</h3>
        <p>Recordá que siempre podés revisar tus turnos confirmados en la pestaña <strong>Mis turnos</strong> o comunicarte con atención al cliente.</p>
      </div>
    </div>
  );
};

export default ComoFuncionaPage;