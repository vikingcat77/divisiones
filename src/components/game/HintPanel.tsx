import { useEffect, useState } from 'react';
import { Lightbulb } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';

export function HintPanel() {
  const problemaActual = useGameStore((state) => state.problemaActual);
  const pasoActualIndex = useGameStore((state) => state.pasoActualIndex);
  const pistasUsadas = useGameStore((state) => state.pistasUsadas);
  const pedirPista = useGameStore((state) => state.pedirPista);
  const [pistaActual, setPistaActual] = useState<string | null>(null);

  const nivelPista = pistasUsadas[pasoActualIndex] ?? 0;
  const estaCompletado = Boolean(problemaActual && pasoActualIndex >= problemaActual.pasosEsperados.length);
  const sinProblema = !problemaActual || estaCompletado;

  useEffect(() => {
    setPistaActual(null);
  }, [problemaActual?.id, pasoActualIndex]);

  const handlePedirPista = () => {
    const pista = pedirPista();

    if (pista) {
      setPistaActual(pista);
    }
  };

  return (
    <aside className="border-4 border-block-ink bg-block-parchment p-4 shadow-block" aria-label="Panel de pistas">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid size-12 place-items-center border-4 border-block-ink bg-block-gold shadow-insetBlock">
          <Lightbulb strokeWidth={3} />
        </div>
        <div>
          <p className="font-pixel text-xs font-black uppercase text-block-stoneDark">Pistas</p>
          <p className="font-black">Nivel {nivelPista}/3</p>
        </div>
      </div>

      <div className="mb-4 min-h-28 border-4 border-block-ink bg-white p-4 text-lg font-black leading-relaxed shadow-insetBlock">
        {pistaActual ?? 'Tu ayudante espera en este bloque.'}
      </div>

      <button
        type="button"
        disabled={sinProblema}
        onClick={handlePedirPista}
        className={[
          'inline-flex min-h-14 w-full items-center justify-center gap-3 border-4 border-block-ink',
          'bg-block-water px-5 py-3 font-pixel text-sm font-black uppercase text-white shadow-block-sm',
          'focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-block-gold',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'active:translate-y-1 active:shadow-none',
        ].join(' ')}
      >
        <Lightbulb size={20} strokeWidth={3} />
        Necesito una pista
      </button>
    </aside>
  );
}
