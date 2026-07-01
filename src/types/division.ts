export type TipoPasoDivision = 'dividir' | 'multiplicar' | 'restar' | 'bajarCifra';

export type DificultadDivision = 'bosque' | 'desierto' | 'montana' | 'cueva';

export type TipoErrorDivision =
  | 'cociente_incorrecto'
  | 'multiplicacion_incorrecta'
  | 'resta_incorrecta'
  | 'no_bajo_cifra';

export type PasoDivision = {
  tipo: TipoPasoDivision;
  valorEsperado: number;
  valorIngresado: number | null;
  esCorrecto: boolean;
  cifraPosicion: number;
};

export type ProblemaDivision = {
  id: string;
  dividendo: number;
  divisor: number;
  cocienteEsperado: number;
  restoEsperado: number;
  dificultad: DificultadDivision;
  pasosEsperados: PasoDivision[];
  pasoActualIndex: number;
};

export type ResultadoValidacionPaso = {
  esCorrecto: boolean;
  pasoIndex: number;
  tipoPaso: TipoPasoDivision;
  valorEsperado: number;
  valorIngresado: number | null;
  tipoError?: TipoErrorDivision;
};
