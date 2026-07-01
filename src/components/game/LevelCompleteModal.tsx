import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Gem, Map, RotateCcw } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import { usePlayerStore } from '../../store/playerStore';
import { BlockButton } from '../ui/BlockButton';

const BLOQUES_RECOMPENSA = 10;

const nombreBioma = {
  bosque: 'Bosque',
  desierto: 'Desierto',
  montana: 'Montaña',
  cueva: 'Cueva',
};

export function LevelCompleteModal() {
  const navigate = useNavigate();
  const problemaActual = useGameStore((state) => state.problemaActual);
  const pasoActualIndex = useGameStore((state) => state.pasoActualIndex);
  const iniciarProblema = useGameStore((state) => state.iniciarProblema);
  const marcarProblemaRecompensado = useGameStore((state) => state.marcarProblemaRecompensado);
  const setBiomaActivo = usePlayerStore((state) => state.setBiomaActivo);
  const sumarBloques = usePlayerStore((state) => state.sumarBloques);
  const verificarDesbloqueos = usePlayerStore((state) => state.verificarDesbloqueos);

  const estaCompletado = Boolean(problemaActual && pasoActualIndex >= problemaActual.pasosEsperados.length);
  const dificultad = problemaActual?.dificultad ?? 'bosque';

  useEffect(() => {
    if (!problemaActual || !estaCompletado) {
      return;
    }

    setBiomaActivo(problemaActual.dificultad);

    if (marcarProblemaRecompensado(problemaActual.id)) {
      sumarBloques(BLOQUES_RECOMPENSA);
      verificarDesbloqueos();
    }
  }, [
    estaCompletado,
    marcarProblemaRecompensado,
    problemaActual,
    setBiomaActivo,
    sumarBloques,
    verificarDesbloqueos,
  ]);

  const handleSiguienteReto = () => {
    setBiomaActivo(dificultad);
    iniciarProblema(dificultad);
  };

  const handleVolverMapa = () => {
    navigate('/mapa');
  };

  return (
    <AnimatePresence>
      {estaCompletado ? (
        <motion.div
          className="fixed inset-0 z-50 grid place-items-center bg-block-ink/70 px-4 py-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Reto superado"
            className="relative w-full max-w-xl border-4 border-block-ink bg-block-parchment p-5 text-center shadow-block sm:p-7"
            initial={{ y: 120, scale: 0.82, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 80, scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          >
            <div className="absolute inset-x-0 top-0 grid h-5 grid-cols-10">
              {Array.from({ length: 10 }, (_, index) => (
                <span
                  key={index}
                  className={index % 2 === 0 ? 'bg-block-gold' : 'bg-block-sandDark'}
                />
              ))}
            </div>

            <p className="mt-4 font-pixel text-xs font-black uppercase text-block-stoneDark">
              {nombreBioma[dificultad]} completado
            </p>
            <h2 className="mt-2 font-pixel text-3xl font-black uppercase leading-tight text-block-ink sm:text-4xl">
              ¡Reto superado!
            </h2>

            <motion.div
              className="mx-auto my-7 grid size-28 place-items-center border-4 border-block-ink bg-block-gem shadow-block"
              animate={{ rotate: [-4, 4, -4], scale: [1, 1.08, 1] }}
              transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Gem size={54} strokeWidth={3} className="text-white drop-shadow" />
            </motion.div>

            <div className="mx-auto mb-6 max-w-xs border-4 border-block-ink bg-white p-4 font-pixel text-2xl font-black uppercase shadow-insetBlock">
              +{BLOQUES_RECOMPENSA} Bloques
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <BlockButton variant="gold" onClick={handleSiguienteReto} icon={<RotateCcw strokeWidth={3} />}>
                Siguiente reto
              </BlockButton>
              <BlockButton variant="stone" onClick={handleVolverMapa} icon={<Map strokeWidth={3} />}>
                Volver al mapa
              </BlockButton>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
