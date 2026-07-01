import { beforeEach, describe, expect, it } from 'vitest';
import {
  BLOQUES_DESBLOQUEO_BIOMA,
  usePlayerStore,
} from './playerStore';

const progresoInicial = {
  bosque: 0,
  desierto: 0,
  montana: 0,
  cueva: 0,
};

describe('playerStore', () => {
  beforeEach(() => {
    usePlayerStore.setState({
      totalBloques: 0,
      biomaActivo: 'bosque',
      bloquesPorBioma: progresoInicial,
      nivelesDesbloqueados: ['bosque'],
    });
  });

  it('suma bloques al total y al bioma activo', () => {
    usePlayerStore.getState().sumarBloques(10);

    expect(usePlayerStore.getState().totalBloques).toBe(10);
    expect(usePlayerStore.getState().bloquesPorBioma.bosque).toBe(10);
  });

  it('desbloquea Desierto con 50 bloques del Bosque', () => {
    usePlayerStore.getState().sumarBloques(BLOQUES_DESBLOQUEO_BIOMA);
    usePlayerStore.getState().verificarDesbloqueos();

    expect(usePlayerStore.getState().nivelesDesbloqueados).toContain('desierto');
  });

  it('desbloquea Montaña con 50 bloques del Desierto', () => {
    usePlayerStore.setState({
      nivelesDesbloqueados: ['bosque', 'desierto'],
      biomaActivo: 'desierto',
    });

    usePlayerStore.getState().sumarBloques(BLOQUES_DESBLOQUEO_BIOMA);
    usePlayerStore.getState().verificarDesbloqueos();

    expect(usePlayerStore.getState().nivelesDesbloqueados).toContain('montana');
  });
});
