import { create } from 'zustand';
import { generarProblema, obtenerPista, validarPaso } from '../lib/divisionEngine';
import type {
  DificultadDivision,
  ProblemaDivision,
  ResultadoValidacionPaso,
  TipoErrorDivision,
  TipoPasoDivision,
} from '../types/division';

type HistorialErrorDivision = {
  pasoIndex: number;
  tipoPaso: TipoPasoDivision;
  tipoError: TipoErrorDivision;
  valorEsperado: number;
  valorIngresado: number | null;
};

type GameState = {
  problemaActual: ProblemaDivision | null;
  pasoActualIndex: number;
  intentosPorPaso: Record<number, number>;
  pistasUsadas: Record<number, number>;
  historialErrores: HistorialErrorDivision[];
  problemasRecompensados: Record<string, true>;
  iniciarProblema: (dificultad: DificultadDivision) => void;
  enviarRespuestaPaso: (valor: number | string) => ResultadoValidacionPaso | null;
  pedirPista: () => string | null;
  reiniciarPaso: () => void;
  marcarProblemaRecompensado: (problemaId: string) => boolean;
};

let problemaSesion = 0;

function crearProblemaSesion(dificultad: DificultadDivision): ProblemaDivision {
  problemaSesion += 1;
  const problema = generarProblema(dificultad);

  return {
    ...problema,
    id: `${problema.id}-reto-${problemaSesion}`,
  };
}

export const useGameStore = create<GameState>((set, get) => ({
  problemaActual: null,
  pasoActualIndex: 0,
  intentosPorPaso: {},
  pistasUsadas: {},
  historialErrores: [],
  problemasRecompensados: {},

  iniciarProblema: (dificultad) => {
    const problemaActual = crearProblemaSesion(dificultad);

    set({
      problemaActual,
      pasoActualIndex: 0,
      intentosPorPaso: {},
      pistasUsadas: {},
      historialErrores: [],
    });
  },

  enviarRespuestaPaso: (valor) => {
    const { problemaActual, pasoActualIndex } = get();

    if (!problemaActual || pasoActualIndex >= problemaActual.pasosEsperados.length) {
      return null;
    }

    const resultado = validarPaso(problemaActual, pasoActualIndex, valor);
    const pasosEsperados = problemaActual.pasosEsperados.map((paso, index) =>
      index === pasoActualIndex
        ? {
            ...paso,
            valorIngresado: resultado.valorIngresado,
            esCorrecto: resultado.esCorrecto,
          }
        : paso,
    );
    const siguientePasoIndex = resultado.esCorrecto
      ? Math.min(pasoActualIndex + 1, problemaActual.pasosEsperados.length)
      : pasoActualIndex;

    set((state) => ({
      problemaActual: {
        ...problemaActual,
        pasosEsperados,
        pasoActualIndex: siguientePasoIndex,
      },
      pasoActualIndex: siguientePasoIndex,
      intentosPorPaso: {
        ...state.intentosPorPaso,
        [pasoActualIndex]: (state.intentosPorPaso[pasoActualIndex] ?? 0) + 1,
      },
      historialErrores:
        resultado.esCorrecto || !resultado.tipoError
          ? state.historialErrores
          : [
              ...state.historialErrores,
              {
                pasoIndex: pasoActualIndex,
                tipoPaso: resultado.tipoPaso,
                tipoError: resultado.tipoError,
                valorEsperado: resultado.valorEsperado,
                valorIngresado: resultado.valorIngresado,
              },
            ],
    }));

    return resultado;
  },

  pedirPista: () => {
    const { problemaActual, pasoActualIndex, pistasUsadas } = get();

    if (!problemaActual || pasoActualIndex >= problemaActual.pasosEsperados.length) {
      return null;
    }

    const siguienteNivelPista = Math.min((pistasUsadas[pasoActualIndex] ?? 0) + 1, 3);
    const pista = obtenerPista(problemaActual, pasoActualIndex, siguienteNivelPista);

    set((state) => ({
      pistasUsadas: {
        ...state.pistasUsadas,
        [pasoActualIndex]: siguienteNivelPista,
      },
    }));

    return pista;
  },

  reiniciarPaso: () => {
    const { problemaActual, pasoActualIndex } = get();

    if (!problemaActual || pasoActualIndex >= problemaActual.pasosEsperados.length) {
      return;
    }

    const pasosEsperados = problemaActual.pasosEsperados.map((paso, index) =>
      index === pasoActualIndex
        ? {
            ...paso,
            valorIngresado: null,
            esCorrecto: false,
          }
        : paso,
    );

    set((state) => ({
      problemaActual: {
        ...problemaActual,
        pasosEsperados,
      },
      intentosPorPaso: {
        ...state.intentosPorPaso,
        [pasoActualIndex]: 0,
      },
      pistasUsadas: {
        ...state.pistasUsadas,
        [pasoActualIndex]: 0,
      },
    }));
  },

  marcarProblemaRecompensado: (problemaId) => {
    if (get().problemasRecompensados[problemaId]) {
      return false;
    }

    set((state) => ({
      problemasRecompensados: {
        ...state.problemasRecompensados,
        [problemaId]: true,
      },
    }));

    return true;
  },
}));
