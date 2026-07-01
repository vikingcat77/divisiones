import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { DivisionHouse } from '../components/game/DivisionHouse';
import { HintPanel } from '../components/game/HintPanel';
import { LevelCompleteModal } from '../components/game/LevelCompleteModal';
import { NumberPad } from '../components/game/NumberPad';
import { AvatarBlock } from '../components/ui/AvatarBlock';
import { BlockButton } from '../components/ui/BlockButton';
import { BlockProgress } from '../components/ui/BlockProgress';
import { useGameStore } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';

const nombreBioma = {
  bosque: 'Bosque',
  desierto: 'Desierto',
  montana: 'Montaña',
  cueva: 'Cueva',
};

export function GamePage() {
  const avatarTone = usePlayerStore((state) => state.avatarTone);
  const playerName = usePlayerStore((state) => state.playerName);
  const setBiomaActivo = usePlayerStore((state) => state.setBiomaActivo);
  const problemaActual = useGameStore((state) => state.problemaActual);
  const pasoActualIndex = useGameStore((state) => state.pasoActualIndex);
  const iniciarProblema = useGameStore((state) => state.iniciarProblema);
  const enviarRespuestaPaso = useGameStore((state) => state.enviarRespuestaPaso);
  const reiniciarPaso = useGameStore((state) => state.reiniciarPaso);
  const [activeValue, setActiveValue] = useState('');

  useEffect(() => {
    if (!problemaActual) {
      setBiomaActivo('bosque');
      iniciarProblema('bosque');
    }
  }, [iniciarProblema, problemaActual, setBiomaActivo]);

  useEffect(() => {
    setActiveValue('');
  }, [problemaActual?.id, pasoActualIndex]);

  const totalPasos = problemaActual?.pasosEsperados.length ?? 1;
  const estaCompletado = Boolean(problemaActual && pasoActualIndex >= problemaActual.pasosEsperados.length);
  const dificultadActual = problemaActual?.dificultad ?? 'bosque';

  const handleSubmit = () => {
    if (!activeValue || estaCompletado) {
      return;
    }

    const resultado = enviarRespuestaPaso(activeValue);

    if (resultado?.esCorrecto) {
      setActiveValue('');
    }
  };

  const handleClear = () => {
    setActiveValue('');
    reiniciarPaso();
  };

  return (
    <main className="min-h-screen bg-block-sky bg-pixel-grid bg-[length:36px_36px] font-rounded text-block-ink">
      <div className="min-h-screen bg-gradient-to-b from-transparent via-block-sky/40 to-block-grass px-4 py-6 sm:px-6 lg:px-8">
        <header className="mx-auto flex max-w-7xl flex-col gap-4 border-4 border-block-ink bg-block-parchment p-4 shadow-block lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <AvatarBlock tone={avatarTone} size="sm" selected />
            <div>
              <p className="font-pixel text-xs font-black uppercase text-block-stoneDark">
                {nombreBioma[dificultadActual]}
              </p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl">
                {playerName.trim() || 'Jugador'} en misión
              </h1>
            </div>
          </div>

          <div className="w-full lg:max-w-md">
            <BlockProgress value={pasoActualIndex} max={totalPasos} label="Pasos" />
          </div>

          <Link to="/mapa">
            <BlockButton variant="stone" className="w-full lg:w-auto" icon={<ArrowLeft strokeWidth={3} />}>
              Mapa
            </BlockButton>
          </Link>
        </header>

        <section className="mx-auto mt-8 grid max-w-7xl gap-6 xl:grid-cols-[1fr_22rem]">
          <DivisionHouse activeValue={activeValue} />

          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-1">
            <NumberPad
              value={activeValue}
              disabled={!problemaActual || estaCompletado}
              onChange={setActiveValue}
              onClear={handleClear}
              onSubmit={handleSubmit}
            />
            <HintPanel />
          </div>
        </section>
        <LevelCompleteModal />
      </div>
    </main>
  );
}
