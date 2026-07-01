import { create } from 'zustand';
import type { DificultadDivision } from '../types/division';

export type AvatarTone = 'emerald' | 'aqua' | 'sun';

export const BLOQUES_DESBLOQUEO_BIOMA = 50;

const progresoInicialPorBioma: Record<DificultadDivision, number> = {
  bosque: 0,
  desierto: 0,
  montana: 0,
  cueva: 0,
};

type PlayerState = {
  playerName: string;
  avatarTone: AvatarTone;
  totalBloques: number;
  biomaActivo: DificultadDivision;
  bloquesPorBioma: Record<DificultadDivision, number>;
  nivelesDesbloqueados: DificultadDivision[];
  setPlayerName: (name: string) => void;
  setAvatarTone: (tone: AvatarTone) => void;
  setBiomaActivo: (dificultad: DificultadDivision) => void;
  sumarBloques: (cantidad: number) => void;
  verificarDesbloqueos: () => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  playerName: '',
  avatarTone: 'emerald',
  totalBloques: 0,
  biomaActivo: 'bosque',
  bloquesPorBioma: progresoInicialPorBioma,
  nivelesDesbloqueados: ['bosque'],
  setPlayerName: (playerName) => set({ playerName }),
  setAvatarTone: (avatarTone) => set({ avatarTone }),
  setBiomaActivo: (biomaActivo) => set({ biomaActivo }),
  sumarBloques: (cantidad) => {
    const cantidadSegura = Math.max(0, Math.trunc(cantidad));

    if (cantidadSegura === 0) {
      return;
    }

    set((state) => ({
      totalBloques: state.totalBloques + cantidadSegura,
      bloquesPorBioma: {
        ...state.bloquesPorBioma,
        [state.biomaActivo]: state.bloquesPorBioma[state.biomaActivo] + cantidadSegura,
      },
    }));
  },
  verificarDesbloqueos: () => {
    const { bloquesPorBioma, nivelesDesbloqueados } = get();
    const desbloqueados = new Set<DificultadDivision>(nivelesDesbloqueados);

    if (bloquesPorBioma.bosque >= BLOQUES_DESBLOQUEO_BIOMA) {
      desbloqueados.add('desierto');
    }

    if (bloquesPorBioma.desierto >= BLOQUES_DESBLOQUEO_BIOMA) {
      desbloqueados.add('montana');
    }

    if (bloquesPorBioma.montana >= BLOQUES_DESBLOQUEO_BIOMA) {
      desbloqueados.add('cueva');
    }

    set({ nivelesDesbloqueados: Array.from(desbloqueados) });
  },
}));
