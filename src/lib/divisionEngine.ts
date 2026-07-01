import type {
  DificultadDivision,
  PasoDivision,
  ProblemaDivision,
  ResultadoValidacionPaso,
  TipoErrorDivision,
  TipoPasoDivision,
} from '../types/division';

type RandomFn = () => number;

const tipoErrorPorPaso: Record<TipoPasoDivision, TipoErrorDivision> = {
  dividir: 'cociente_incorrecto',
  multiplicar: 'multiplicacion_incorrecta',
  restar: 'resta_incorrecta',
  bajarCifra: 'no_bajo_cifra',
};

function enteroAleatorio(min: number, max: number, rng: RandomFn): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function crearPaso(tipo: TipoPasoDivision, valorEsperado: number, cifraPosicion: number): PasoDivision {
  return {
    tipo,
    valorEsperado,
    valorIngresado: null,
    esCorrecto: false,
    cifraPosicion,
  };
}

function calcularPasosEsperados(dividendo: number, divisor: number): PasoDivision[] {
  const cifras = String(dividendo).split('').map(Number);
  const pasos: PasoDivision[] = [];
  let valorTrabajo = 0;
  let divisionIniciada = false;

  cifras.forEach((cifra, indice) => {
    valorTrabajo = valorTrabajo * 10 + cifra;

    if (!divisionIniciada && valorTrabajo < divisor && indice < cifras.length - 1) {
      return;
    }

    divisionIniciada = true;

    const cocienteParcial = Math.floor(valorTrabajo / divisor);
    const producto = cocienteParcial * divisor;
    const restoParcial = valorTrabajo - producto;

    pasos.push(crearPaso('dividir', cocienteParcial, indice));
    pasos.push(crearPaso('multiplicar', producto, indice));
    pasos.push(crearPaso('restar', restoParcial, indice));

    if (indice < cifras.length - 1) {
      pasos.push(crearPaso('bajarCifra', cifras[indice + 1], indice + 1));
    }

    valorTrabajo = restoParcial;
  });

  return pasos;
}

function validarNumerosDivision(dividendo: number, divisor: number): void {
  if (!Number.isInteger(dividendo) || !Number.isInteger(divisor)) {
    throw new Error('El dividendo y el divisor deben ser números enteros.');
  }

  if (dividendo < 0 || divisor <= 0) {
    throw new Error('El dividendo debe ser positivo o cero y el divisor debe ser mayor que cero.');
  }
}

function normalizarValor(valorIngresado: number | string): number | null {
  const valor =
    typeof valorIngresado === 'number' ? valorIngresado : Number.parseInt(valorIngresado.trim(), 10);

  return Number.isInteger(valor) ? valor : null;
}

export function crearProblemaDivision(
  dividendo: number,
  divisor: number,
  dificultad: DificultadDivision,
  id = `${dificultad}-${dividendo}-${divisor}`,
): ProblemaDivision {
  validarNumerosDivision(dividendo, divisor);

  return {
    id,
    dividendo,
    divisor,
    cocienteEsperado: Math.floor(dividendo / divisor),
    restoEsperado: dividendo % divisor,
    dificultad,
    pasosEsperados: calcularPasosEsperados(dividendo, divisor),
    pasoActualIndex: 0,
  };
}

export function generarProblema(dificultad: DificultadDivision, rng: RandomFn = Math.random): ProblemaDivision {
  if (dificultad === 'bosque') {
    const divisor = enteroAleatorio(2, 9, rng);
    const cociente = enteroAleatorio(2, 99, rng);

    return crearProblemaDivision(divisor * cociente, divisor, dificultad);
  }

  if (dificultad === 'desierto') {
    const divisor = enteroAleatorio(2, 9, rng);
    const cociente = enteroAleatorio(3, 99, rng);
    const resto = enteroAleatorio(1, divisor - 1, rng);

    return crearProblemaDivision(divisor * cociente + resto, divisor, dificultad);
  }

  if (dificultad === 'montana') {
    const divisor = enteroAleatorio(10, 25, rng);
    const cociente = enteroAleatorio(2, 99, rng);
    const resto = enteroAleatorio(0, divisor - 1, rng);

    return crearProblemaDivision(divisor * cociente + resto, divisor, dificultad);
  }

  const divisor = rng() < 0.55 ? enteroAleatorio(2, 9, rng) : enteroAleatorio(10, 25, rng);
  const cociente = enteroAleatorio(8, 120, rng);
  const resto = enteroAleatorio(0, divisor - 1, rng);

  return crearProblemaDivision(divisor * cociente + resto, divisor, dificultad);
}

export function validarPaso(
  problema: ProblemaDivision,
  pasoIndex: number,
  valorIngresado: number | string,
): ResultadoValidacionPaso {
  const paso = problema.pasosEsperados[pasoIndex];

  if (!paso) {
    throw new RangeError(`No existe el paso de división con índice ${pasoIndex}.`);
  }

  const valorNormalizado = normalizarValor(valorIngresado);
  const esCorrecto = valorNormalizado === paso.valorEsperado;

  return {
    esCorrecto,
    pasoIndex,
    tipoPaso: paso.tipo,
    valorEsperado: paso.valorEsperado,
    valorIngresado: valorNormalizado,
    tipoError: esCorrecto ? undefined : tipoErrorPorPaso[paso.tipo],
  };
}

export function obtenerPista(problema: ProblemaDivision, pasoIndex: number, nivelPista: number): string {
  const paso = problema.pasosEsperados[pasoIndex];

  if (!paso) {
    throw new RangeError(`No existe el paso de división con índice ${pasoIndex}.`);
  }

  const nivel = Math.min(Math.max(Math.trunc(nivelPista), 1), 3);

  if (paso.tipo === 'dividir') {
    const pistas = [
      `Mira cuántas veces cabe ${problema.divisor} en el número que estás trabajando.`,
      `Prueba un número que, al multiplicarlo por ${problema.divisor}, no se pase.`,
      `El cociente parcial de este bloque es ${paso.valorEsperado}.`,
    ];

    return pistas[nivel - 1];
  }

  if (paso.tipo === 'multiplicar') {
    const pasosAnteriores = problema.pasosEsperados.slice(0, pasoIndex).reverse();
    const cocienteParcial = pasosAnteriores.find((pasoAnterior) => pasoAnterior.tipo === 'dividir')?.valorEsperado;
    const pistas = [
      'Mira el cociente parcial que acabas de colocar.',
      `Prueba multiplicar ${problema.divisor} por ${cocienteParcial ?? 'ese número'}.`,
      `La multiplicación esperada es ${paso.valorEsperado}.`,
    ];

    return pistas[nivel - 1];
  }

  if (paso.tipo === 'restar') {
    const pistas = [
      'Ahora resta la multiplicación al número del bloque actual.',
      'Comprueba que el resultado sea menor que el divisor antes de seguir.',
      `La resta de este paso debe dejar ${paso.valorEsperado}.`,
    ];

    return pistas[nivel - 1];
  }

  const pistas = [
    'Ahora baja la siguiente cifra del dividendo.',
    'Coloca esa cifra junto al resto para formar el próximo bloque.',
    `La cifra que toca bajar es ${paso.valorEsperado}.`,
  ];

  return pistas[nivel - 1];
}
