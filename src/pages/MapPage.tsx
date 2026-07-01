import { Lock, Trees, Mountain, Gem, Sun, type LucideIcon } from 'lucide-react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { AvatarBlock } from '../components/ui/AvatarBlock';
import { BlockButton } from '../components/ui/BlockButton';
import { BlockProgress } from '../components/ui/BlockProgress';
import { useGameStore } from '../store/gameStore';
import {
  BLOQUES_DESBLOQUEO_BIOMA,
  usePlayerStore,
} from '../store/playerStore';
import type { DificultadDivision } from '../types/division';

type Biome = {
  id: string;
  dificultad: DificultadDivision;
  name: string;
  subtitle: string;
  icon: LucideIcon;
  colors: string;
  cta: string;
  desbloqueo?: string;
};

const biomes: Biome[] = [
  {
    id: 'forest',
    dificultad: 'bosque',
    name: 'Bosque',
    subtitle: 'Divisiones exactas',
    icon: Trees,
    colors: 'bg-block-grass text-white',
    cta: 'Entrar al bosque',
  },
  {
    id: 'desert',
    dificultad: 'desierto',
    name: 'Desierto',
    subtitle: 'Divisiones con resto',
    icon: Sun,
    colors: 'bg-block-sand text-block-ink',
    cta: 'Entrar al desierto',
    desbloqueo: `${BLOQUES_DESBLOQUEO_BIOMA} bloques del Bosque`,
  },
  {
    id: 'mountain',
    dificultad: 'montana',
    name: 'Montaña',
    subtitle: 'Divisor de dos cifras',
    icon: Mountain,
    colors: 'bg-block-stone text-white',
    cta: 'Subir a montaña',
    desbloqueo: `${BLOQUES_DESBLOQUEO_BIOMA} bloques del Desierto`,
  },
  {
    id: 'cave',
    dificultad: 'cueva',
    name: 'Cueva',
    subtitle: 'Retos mixtos',
    icon: Gem,
    colors: 'bg-block-cave text-white',
    cta: 'Entrar a cueva',
    desbloqueo: `${BLOQUES_DESBLOQUEO_BIOMA} bloques de Montaña`,
  },
];

export function MapPage() {
  const navigate = useNavigate();
  const playerName = usePlayerStore((state) => state.playerName);
  const avatarTone = usePlayerStore((state) => state.avatarTone);
  const totalBloques = usePlayerStore((state) => state.totalBloques);
  const nivelesDesbloqueados = usePlayerStore((state) => state.nivelesDesbloqueados);
  const setBiomaActivo = usePlayerStore((state) => state.setBiomaActivo);
  const iniciarProblema = useGameStore((state) => state.iniciarProblema);

  if (!playerName.trim()) {
    return <Navigate to="/" replace />;
  }

  const handleEntrarBioma = (dificultad: DificultadDivision) => {
    setBiomaActivo(dificultad);
    iniciarProblema(dificultad);
    navigate('/juego');
  };

  return (
    <main className="min-h-screen bg-block-sky bg-pixel-grid bg-[length:36px_36px] font-rounded text-block-ink">
      <div className="min-h-screen bg-gradient-to-b from-transparent via-block-sky/40 to-block-grass px-4 py-6 sm:px-6 lg:px-8">
        <header className="mx-auto flex max-w-6xl flex-col gap-4 border-4 border-block-ink bg-block-parchment p-4 shadow-block sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <AvatarBlock tone={avatarTone} size="sm" selected />
            <div>
              <p className="font-pixel text-xs font-black uppercase text-block-stoneDark">Mapa de mundos</p>
              <h1 className="mt-1 text-2xl font-black sm:text-3xl">Hola, {playerName.trim()}</h1>
            </div>
          </div>
          <div className="grid w-full gap-3 sm:w-auto sm:min-w-72">
            <div className="border-4 border-block-ink bg-white px-4 py-3 text-right shadow-insetBlock">
              <p className="font-pixel text-xs font-black uppercase text-block-stoneDark">Bloques</p>
              <p className="mt-1 text-2xl font-black">{totalBloques}</p>
            </div>
            <BlockProgress value={nivelesDesbloqueados.length} max={4} label="Biomas" />
          </div>
        </header>

        <section className="mx-auto mt-8 max-w-6xl">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-pixel text-xs font-black uppercase text-white [text-shadow:2px_2px_0_#172033]">
                Elige portal
              </p>
              <h2 className="mt-2 font-pixel text-3xl font-black uppercase text-white [text-shadow:4px_4px_0_#172033]">
                Mundo de bloques
              </h2>
            </div>
            <Link to="/">
              <BlockButton variant="stone" className="w-full sm:w-auto">
                Cambiar avatar
              </BlockButton>
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {biomes.map((biome, index) => {
              const Icon = biome.icon;
              const desbloqueado = nivelesDesbloqueados.includes(biome.dificultad);

              return (
                <motion.article
                  key={biome.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className={[
                    'relative min-h-64 overflow-hidden border-4 border-block-ink p-5 shadow-block',
                    biome.colors,
                    desbloqueado ? '' : 'opacity-55 grayscale',
                  ].join(' ')}
                >
                  <div className="absolute inset-0 bg-pixel-grid bg-[length:28px_28px] opacity-30" />
                  <div className="absolute bottom-0 left-0 right-0 grid h-12 grid-cols-8">
                    {Array.from({ length: 8 }, (_, blockIndex) => (
                      <span
                        key={blockIndex}
                        className="border-r-4 border-t-4 border-block-ink bg-black/15 shadow-insetBlock"
                      />
                    ))}
                  </div>

                  {!desbloqueado ? (
                    <div className="absolute right-4 top-4 grid size-14 place-items-center border-4 border-block-ink bg-block-parchment text-block-ink shadow-block-sm">
                      <Lock strokeWidth={3} />
                    </div>
                  ) : null}

                  <div className="relative z-10 flex h-full min-h-52 flex-col justify-between">
                    <div>
                      <div className="mb-5 grid size-20 place-items-center border-4 border-block-ink bg-white/25 shadow-insetBlock">
                        <Icon size={42} strokeWidth={3} />
                      </div>
                      <h3 className="font-pixel text-2xl font-black uppercase [text-shadow:3px_3px_0_rgba(23,32,51,0.55)]">
                        {biome.name}
                      </h3>
                      <p className="mt-3 max-w-sm border-4 border-block-ink bg-block-parchment p-3 text-base font-black text-block-ink shadow-block-sm">
                        {biome.subtitle}
                      </p>
                      {!desbloqueado && biome.desbloqueo ? (
                        <p className="mt-3 inline-flex border-4 border-block-ink bg-white/90 px-3 py-2 font-pixel text-xs font-black uppercase text-block-ink shadow-block-sm">
                          {biome.desbloqueo}
                        </p>
                      ) : null}
                    </div>

                    <BlockButton
                      className="mt-6 w-full sm:w-fit"
                      variant={desbloqueado ? 'gold' : 'stone'}
                      disabled={!desbloqueado}
                      onClick={desbloqueado ? () => handleEntrarBioma(biome.dificultad) : undefined}
                    >
                      {desbloqueado ? biome.cta : 'Bloqueado'}
                    </BlockButton>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
