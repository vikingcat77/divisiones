import { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { BlockLandscape } from '../components/layout/BlockLandscape';
import { AvatarBlock } from '../components/ui/AvatarBlock';
import { BlockButton } from '../components/ui/BlockButton';
import { BlockProgress } from '../components/ui/BlockProgress';
import { AvatarTone, usePlayerStore } from '../store/playerStore';

const avatars: Array<{ tone: AvatarTone; label: string }> = [
  { tone: 'emerald', label: 'Explorador verde' },
  { tone: 'aqua', label: 'Minero azul' },
  { tone: 'sun', label: 'Constructor sol' },
];

export function HomePage() {
  const navigate = useNavigate();
  const playerName = usePlayerStore((state) => state.playerName);
  const avatarTone = usePlayerStore((state) => state.avatarTone);
  const setPlayerName = usePlayerStore((state) => state.setPlayerName);
  const setAvatarTone = usePlayerStore((state) => state.setAvatarTone);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!playerName.trim()) {
      return;
    }
    navigate('/mapa');
  };

  return (
    <main className="relative min-h-screen overflow-hidden font-rounded text-block-ink">
      <BlockLandscape />
      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex border-4 border-block-ink bg-block-parchment px-4 py-2 font-pixel text-xs font-black uppercase shadow-block-sm">
              Aventura de divisiones
            </div>
            <h1 className="font-pixel text-4xl font-black uppercase leading-tight text-white [text-shadow:4px_4px_0_#172033] sm:text-5xl lg:text-6xl">
              Divide y vencerás
            </h1>
            <p className="mt-5 max-w-xl border-4 border-block-ink bg-block-parchment p-4 text-lg font-black leading-relaxed shadow-block-sm">
              Construye tu mundo bloque a bloque mientras preparas tu próxima misión matemática.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-4 border-block-ink bg-block-parchment p-5 shadow-block sm:p-6"
          >
            <div className="mb-6 flex items-center gap-4">
              <AvatarBlock tone={avatarTone} size="md" selected />
              <div>
                <p className="font-pixel text-xs font-black uppercase text-block-stoneDark">Jugador</p>
                <p className="mt-2 text-2xl font-black">{playerName.trim() || 'Nuevo héroe'}</p>
              </div>
            </div>

            <label className="mb-3 block font-pixel text-xs font-black uppercase" htmlFor="player-name">
              Nombre del jugador
            </label>
            <input
              id="player-name"
              value={playerName}
              onChange={(event) => setPlayerName(event.target.value)}
              maxLength={18}
              className="mb-6 min-h-14 w-full border-4 border-block-ink bg-white px-4 text-xl font-black shadow-insetBlock outline-none focus:ring-4 focus:ring-block-gold"
              placeholder="Escribe tu nombre"
            />

            <fieldset>
              <legend className="mb-3 font-pixel text-xs font-black uppercase">Avatar de bloque</legend>
              <div className="grid grid-cols-3 gap-3">
                {avatars.map((avatar) => (
                  <button
                    key={avatar.tone}
                    type="button"
                    onClick={() => setAvatarTone(avatar.tone)}
                    className="grid place-items-center gap-2 border-4 border-block-ink bg-white p-2 shadow-block-sm transition-transform active:translate-y-1"
                    aria-pressed={avatarTone === avatar.tone}
                  >
                    <AvatarBlock tone={avatar.tone} selected={avatarTone === avatar.tone} size="sm" />
                    <span className="text-center text-xs font-black leading-tight">{avatar.label}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <BlockButton
              className="mt-7 w-full"
              type="submit"
              variant="gold"
              icon={<ChevronRight strokeWidth={3} />}
              disabled={!playerName.trim()}
            >
              Empezar aventura
            </BlockButton>

            <div className="mt-6">
              <BlockProgress value={2} max={10} label="Preparación" />
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
