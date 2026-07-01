import { Fragment, type CSSProperties } from 'react';
import { useGameStore } from '../../store/gameStore';
import type { PasoDivision } from '../../types/division';

type DivisionHouseProps = {
  activeValue: string;
};

type StepWithIndex = {
  paso: PasoDivision;
  index: number;
};

type DivisionCycle = {
  dividir: StepWithIndex;
  multiplicar?: StepWithIndex;
  restar?: StepWithIndex;
  bajarCifra?: StepWithIndex;
};

type PositionedValueBlockProps = {
  step: StepWithIndex;
  activeValue: string;
  pasoActualIndex: number;
  hasError: boolean;
  totalColumns: number;
  row: number;
  endColumn?: number;
  compact?: boolean;
};

const columnWidth = 'minmax(3.5rem, 4.75rem)';

function buildCycles(pasos: PasoDivision[]): DivisionCycle[] {
  const cycles: DivisionCycle[] = [];

  pasos.forEach((paso, index) => {
    const step = { paso, index };
    const currentCycle = cycles[cycles.length - 1];

    if (paso.tipo === 'dividir') {
      cycles.push({ dividir: step });
      return;
    }

    if (!currentCycle) {
      return;
    }

    if (paso.tipo === 'multiplicar') {
      currentCycle.multiplicar = step;
      return;
    }

    if (paso.tipo === 'restar') {
      currentCycle.restar = step;
      return;
    }

    currentCycle.bajarCifra = step;
  });

  return cycles;
}

function valueLength(value: number) {
  return String(Math.abs(value)).length;
}

function getSpan(value: number, endColumn: number, totalColumns: number) {
  const safeEnd = Math.min(Math.max(endColumn, 0), totalColumns - 1);
  const start = Math.max(0, safeEnd - valueLength(value) + 1);

  return {
    start,
    end: safeEnd,
  };
}

function getVisibleValue(step: StepWithIndex, pasoActualIndex: number, activeValue: string) {
  if (step.index === pasoActualIndex) {
    return activeValue || (step.paso.valorIngresado === null ? '' : String(step.paso.valorIngresado));
  }

  if (step.index < pasoActualIndex) {
    return String(step.paso.valorIngresado ?? step.paso.valorEsperado);
  }

  return '';
}

function isVisible(step: StepWithIndex | undefined, pasoActualIndex: number) {
  return Boolean(step && step.index <= pasoActualIndex);
}

function PositionedValueBlock({
  step,
  activeValue,
  pasoActualIndex,
  hasError,
  totalColumns,
  row,
  endColumn = step.paso.cifraPosicion,
  compact = false,
}: PositionedValueBlockProps) {
  const active = step.index === pasoActualIndex;
  const complete = step.index < pasoActualIndex;
  const span = getSpan(step.paso.valorEsperado, endColumn, totalColumns);
  const value = getVisibleValue(step, pasoActualIndex, activeValue);

  const style: CSSProperties = {
    gridColumn: `${span.start + 1} / ${span.end + 2}`,
    gridRow: row,
  };

  return (
    <span
      style={style}
      aria-label={active ? 'Casilla activa' : undefined}
      className={[
        'mx-1 grid place-items-center border-4 font-pixel font-black shadow-insetBlock',
        compact ? 'min-h-12 px-2 text-xl' : 'min-h-14 px-3 text-2xl',
        hasError && active
          ? 'border-block-lava bg-orange-100 text-block-ink ring-4 ring-orange-300/40'
          : active
            ? 'border-block-gold bg-white text-block-ink ring-4 ring-block-gold/30'
            : complete
              ? 'border-block-ink bg-block-gem/20 text-block-ink'
              : 'border-block-ink bg-white/70 text-block-stoneDark',
      ].join(' ')}
    >
      {value}
    </span>
  );
}

function SubtractionLine({
  visible,
  row,
  startColumn,
  endColumn,
}: {
  visible: boolean;
  row: number;
  startColumn: number;
  endColumn: number;
}) {
  if (!visible) {
    return null;
  }

  const blockCount = endColumn - startColumn + 1;

  return (
    <div
      style={{
        gridColumn: `${startColumn + 1} / ${endColumn + 2}`,
        gridRow: row,
      }}
      className="mx-1 grid items-center gap-[2px]"
    >
      <div className="grid grid-cols-[repeat(var(--line-blocks),minmax(0,1fr))] gap-[2px]" style={{ '--line-blocks': blockCount } as CSSProperties}>
        {Array.from({ length: blockCount }, (_, index) => (
          <span key={index} className="h-2 border-2 border-block-ink bg-block-ink shadow-block-sm" />
        ))}
      </div>
    </div>
  );
}

export function DivisionHouse({ activeValue }: DivisionHouseProps) {
  const problemaActual = useGameStore((state) => state.problemaActual);
  const pasoActualIndex = useGameStore((state) => state.pasoActualIndex);
  const historialErrores = useGameStore((state) => state.historialErrores);

  if (!problemaActual) {
    return (
      <section className="border-4 border-block-ink bg-block-parchment p-6 text-center shadow-block">
        <p className="font-pixel text-xl font-black uppercase">Preparando reto...</p>
      </section>
    );
  }

  const dividendDigits = String(problemaActual.dividendo).split('');
  const totalColumns = dividendDigits.length;
  const gridColumns = `repeat(${totalColumns}, ${columnWidth})`;
  const cycles = buildCycles(problemaActual.pasosEsperados);
  const estaCompletado = pasoActualIndex >= problemaActual.pasosEsperados.length;
  const tieneErrorActivo = historialErrores.some((error) => error.pasoIndex === pasoActualIndex);
  const visibleQuotientSteps = cycles
    .map((cycle) => cycle.dividir)
    .filter((step) => isVisible(step, pasoActualIndex));

  const workRows = cycles.flatMap(() => ['minmax(3.75rem,auto)', '0.8rem', 'minmax(3.75rem,auto)']).join(' ');

  return (
    <section className="border-4 border-block-ink bg-block-parchment p-4 shadow-block sm:p-6" aria-label="Casita de división">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-pixel text-xs font-black uppercase text-block-stoneDark">Casita de división</p>
          <h2 className="mt-1 text-2xl font-black">
            {problemaActual.dividendo} ÷ {problemaActual.divisor}
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          {estaCompletado ? (
            <div className="border-4 border-block-ink bg-block-gold px-4 py-2 font-pixel text-sm font-black uppercase shadow-block-sm">
              Completado
            </div>
          ) : null}
          <div className="border-4 border-block-ink bg-white px-4 py-2 font-pixel text-sm font-black uppercase shadow-insetBlock">
            Paso {Math.min(pasoActualIndex + 1, problemaActual.pasosEsperados.length)}/
            {problemaActual.pasosEsperados.length}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto border-4 border-block-ink bg-white p-4 shadow-insetBlock">
        <div className="min-w-max">
          <div className="grid" style={{ gridTemplateColumns: '5.5rem max-content' }}>
            <div />
            <div className="grid min-h-16 items-end pb-2" style={{ gridTemplateColumns: gridColumns }}>
              {visibleQuotientSteps.map((step) => (
                <PositionedValueBlock
                  key={`quotient-${step.index}`}
                  step={step}
                  activeValue={activeValue}
                  pasoActualIndex={pasoActualIndex}
                  hasError={tieneErrorActivo}
                  totalColumns={totalColumns}
                  row={1}
                  compact
                />
              ))}
            </div>

            <div className="grid min-h-20 place-items-center border-r-4 border-block-ink bg-block-stone px-3 text-center font-pixel text-3xl font-black text-white shadow-insetBlock">
              {problemaActual.divisor}
            </div>
            <div
              className="grid min-h-20 border-l-4 border-t-4 border-block-ink bg-block-cloud font-pixel text-4xl font-black shadow-insetBlock"
              style={{ gridTemplateColumns: gridColumns }}
            >
              {dividendDigits.map((digit, index) => (
                <span key={`${digit}-${index}`} className="grid place-items-center border-r-2 border-block-ink/15 px-2">
                  {digit}
                </span>
              ))}
            </div>

            <div />
            <div
              className="grid border-l-4 border-block-ink py-4"
              style={{
                gridTemplateColumns: gridColumns,
                gridTemplateRows: workRows,
              }}
            >
              {cycles.map((cycle, cycleIndex) => {
                const productRow = cycleIndex * 3 + 1;
                const lineRow = productRow + 1;
                const remainderRow = productRow + 2;
                const multiplicationSpan = cycle.multiplicar
                  ? getSpan(cycle.multiplicar.paso.valorEsperado, cycle.multiplicar.paso.cifraPosicion, totalColumns)
                  : null;

                return (
                  <Fragment key={`cycle-${cycle.dividir.index}`}>
                    {isVisible(cycle.multiplicar, pasoActualIndex) && cycle.multiplicar ? (
                      <PositionedValueBlock
                        step={cycle.multiplicar}
                        activeValue={activeValue}
                        pasoActualIndex={pasoActualIndex}
                        hasError={tieneErrorActivo}
                        totalColumns={totalColumns}
                        row={productRow}
                      />
                    ) : null}

                    {multiplicationSpan ? (
                      <SubtractionLine
                        visible={isVisible(cycle.multiplicar, pasoActualIndex)}
                        row={lineRow}
                        startColumn={multiplicationSpan.start}
                        endColumn={multiplicationSpan.end}
                      />
                    ) : null}

                    {isVisible(cycle.restar, pasoActualIndex) && cycle.restar ? (
                      <PositionedValueBlock
                        step={cycle.restar}
                        activeValue={activeValue}
                        pasoActualIndex={pasoActualIndex}
                        hasError={tieneErrorActivo}
                        totalColumns={totalColumns}
                        row={remainderRow}
                      />
                    ) : null}

                    {isVisible(cycle.bajarCifra, pasoActualIndex) && cycle.bajarCifra ? (
                      <PositionedValueBlock
                        step={cycle.bajarCifra}
                        activeValue={activeValue}
                        pasoActualIndex={pasoActualIndex}
                        hasError={tieneErrorActivo}
                        totalColumns={totalColumns}
                        row={remainderRow}
                        endColumn={cycle.bajarCifra.paso.cifraPosicion}
                      />
                    ) : null}
                  </Fragment>
                );
              })}
            </div>
          </div>

          {estaCompletado ? (
            <div className="mt-5 border-4 border-block-ink bg-block-gold p-4 font-black shadow-block-sm">
              Cociente: {problemaActual.cocienteEsperado} · Resto: {problemaActual.restoEsperado}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
