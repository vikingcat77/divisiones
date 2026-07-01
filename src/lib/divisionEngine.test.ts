import { describe, expect, it } from 'vitest';
import { crearProblemaDivision, generarProblema, validarPaso } from './divisionEngine';

describe('divisionEngine', () => {
  it('genera una división exacta de 1 cifra para Bosque', () => {
    const problema = generarProblema('bosque', () => 0.25);

    expect(problema.dificultad).toBe('bosque');
    expect(problema.divisor).toBeGreaterThanOrEqual(2);
    expect(problema.divisor).toBeLessThanOrEqual(9);
    expect(problema.restoEsperado).toBe(0);
    expect(problema.divisor * problema.cocienteEsperado).toBe(problema.dividendo);
    expect(problema.pasosEsperados.length).toBeGreaterThan(0);
  });

  it('calcula una división con resto para Desierto', () => {
    const problema = crearProblemaDivision(85, 6, 'desierto', 'desierto-test');

    expect(problema.cocienteEsperado).toBe(14);
    expect(problema.restoEsperado).toBe(1);
    expect(problema.pasosEsperados.map((paso) => paso.tipo)).toEqual([
      'dividir',
      'multiplicar',
      'restar',
      'bajarCifra',
      'dividir',
      'multiplicar',
      'restar',
    ]);
  });

  it('calcula un problema de Montaña con divisor de 2 cifras', () => {
    const problema = crearProblemaDivision(156, 12, 'montana', 'montana-test');

    expect(problema.divisor).toBeGreaterThanOrEqual(10);
    expect(problema.divisor).toBeLessThanOrEqual(99);
    expect(problema.cocienteEsperado).toBe(13);
    expect(problema.restoEsperado).toBe(0);
    expect(problema.pasosEsperados.map((paso) => paso.valorEsperado)).toEqual([
      1,
      12,
      3,
      6,
      3,
      36,
      0,
    ]);
  });

  it('detecta un error de resta', () => {
    const problema = crearProblemaDivision(85, 6, 'desierto', 'resta-test');
    const pasoRestarIndex = problema.pasosEsperados.findIndex((paso) => paso.tipo === 'restar');
    const resultado = validarPaso(problema, pasoRestarIndex, 3);

    expect(resultado.esCorrecto).toBe(false);
    expect(resultado.tipoError).toBe('resta_incorrecta');
    expect(resultado.valorEsperado).toBe(2);
  });

  it('detecta un error de multiplicación', () => {
    const problema = crearProblemaDivision(85, 6, 'desierto', 'multiplicacion-test');
    const pasoMultiplicarIndex = problema.pasosEsperados.findIndex((paso) => paso.tipo === 'multiplicar');
    const resultado = validarPaso(problema, pasoMultiplicarIndex, 7);

    expect(resultado.esCorrecto).toBe(false);
    expect(resultado.tipoError).toBe('multiplicacion_incorrecta');
    expect(resultado.valorEsperado).toBe(6);
  });

  it('detecta un cociente parcial mal elegido', () => {
    const problema = crearProblemaDivision(85, 6, 'desierto', 'cociente-test');
    const resultado = validarPaso(problema, 0, 2);

    expect(resultado.esCorrecto).toBe(false);
    expect(resultado.tipoError).toBe('cociente_incorrecto');
    expect(resultado.valorEsperado).toBe(1);
  });
});
