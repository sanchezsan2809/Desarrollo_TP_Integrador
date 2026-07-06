import { disponibilidadHorariaMapper } from "../middlewares/mappers/disponibilidadHorariaMapper.js";
import { medicoMapper } from "../middlewares/mappers/medicoMapper.js";
import { Practica } from "../domain/practica.js";
import { Especialidad } from "../domain/especialidad.js";
import { turnoMapper } from "../middlewares/mappers/turnoMapper.js";

export class MedicoController {
  
  constructor(medicoService) {
    this.medicoService = medicoService;
  }

  consultarTurnos = async (req, res) => {
    const { idMedico } = req.params
    const { idPaciente, 
      page, 
      limit } = req.query

      const { turnos, totalPages, total } = await this.medicoService.consultarTurnos({
        idMedico,
        idPaciente,
        page, 
        limit
      })

      res.status(200).json({
        data: turnos.map(turno => turnoMapper.turnoToDTO(turno)),
        paginacion: {
          page,
          limit, 
          total: total,
          totalPages: totalPages
        }
      })

  }

  consultarDisponibilidades = async (req, res) => {

    const { idMedico } = req.params;
    const { tipoServicio, idServicio } = req.body;

    const disponibilidades =
      await this.medicoService.consultarDisponibilidades({
        idMedico,
        tipoServicio,
        idServicio,
      });

    const disponibilidadesDTO = disponibilidades.map((disponibilidad) =>
      disponibilidadHorariaMapper.disponibilidadHorariaToDTO(disponibilidad),
    );

    res.status(200).json(disponibilidadesDTO);

  };

  modificarDisponibilidades = async (req, res) => {
    const { idMedico } = req.params;
    const { nuevasDisponibilidadesDTO } = req.body;

    const nuevasDisponibilidades = nuevasDisponibilidadesDTO.map((dto) =>
      disponibilidadHorariaMapper.dtoToDisponibilidadHoraria(dto),
    );

    const medicoActualizado =
      await this.medicoService.modificarDisponibilidades({
        idMedico,
        nuevasDisponibilidades,
      });

    const medicoDTO = medicoMapper.medicoToDTO(medicoActualizado);

    res.status(200).json(medicoDTO);

  };

  agregarServicio = async (req, res) => {

    const { idMedico } = req.params;
    const { tipoServicio, nuevoServicioDTO } = req.body;

    let nuevoServicio

    if (tipoServicio === "practica") {
      nuevoServicio = new Practica(
        nuevoServicioDTO.id,
        nuevoServicioDTO.codigo,
        nuevoServicioDTO.nombre,
        nuevoServicioDTO.duracionTurnoEnMins,
        nuevoServicioDTO.costo,
      );
    } else {
      nuevoServicio = new Especialidad(
        nuevoServicioDTO.id,
        nuevoServicioDTO.nombre,
        nuevoServicioDTO.duracionTurnoEnMins,
        nuevoServicioDTO.costo,
      );
    }

    const medicoActualizado = await this.medicoService.agregarServicio({
      idMedico,
      tipoServicio,
      nuevoServicio,
    });

    const medicoDTO = medicoMapper.medicoToDTO(medicoActualizado);

    res.status(200).json(medicoDTO);

  };

  eliminarServicio = async (req, res) => {

    const { idMedico, tipo, idServicio } = req.params;

    const medicoActualizado = await this.medicoService.eliminarServicio({
      idMedico,
      tipoServicio: tipo,
      idServicio,
    });
    const medicoDTO = medicoMapper.medicoToDTO(medicoActualizado);

    res.status(200).json(medicoDTO);

  };

  modificarServicio = async (req, res) => {
    const { idMedico, tipo, idServicio } = req.params;
    const servicioModificado = req.body;

    const medicoActualizado = await this.medicoService.modificarServicio({
      idMedico,
      tipoServicio: tipo,
      idServicio,
      servicioModificado,
    });
    res.status(200).json(medicoActualizado);

  };
}
