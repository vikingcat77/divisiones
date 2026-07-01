import type { AvatarTone } from '../../store/playerStore';

type AvatarBlockProps = {
  tone: AvatarTone;
  selected?: boolean;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
};

const toneClasses: Record<AvatarTone, { face: string; hair: string; shirt: string }> = {
  emerald: {
    face: 'bg-block-grass',
    hair: 'bg-block-leaf',
    shirt: 'bg-block-dirt',
  },
  aqua: {
    face: 'bg-block-water',
    hair: 'bg-block-skyDeep',
    shirt: 'bg-block-stone',
  },
  sun: {
    face: 'bg-block-gold',
    hair: 'bg-block-sandDark',
    shirt: 'bg-block-lava',
  },
};

const sizeClasses = {
  sm: 'size-16',
  md: 'size-24',
  lg: 'size-32',
};

export function AvatarBlock({ tone, selected = false, name, size = 'md' }: AvatarBlockProps) {
  const colors = toneClasses[tone];

  return (
    <div
      className={[
        'relative grid place-items-center border-4 bg-block-parchment p-2 shadow-block-sm',
        selected ? 'border-block-gold ring-4 ring-block-gold/35' : 'border-block-ink',
        sizeClasses[size],
      ].join(' ')}
      aria-label={name ?? `Avatar ${tone}`}
    >
      <div className="relative size-full border-4 border-block-ink bg-block-ink shadow-insetBlock">
        <div className={`absolute inset-x-0 top-0 h-1/4 ${colors.hair}`} />
        <div className={`absolute inset-x-2 top-1/4 h-1/2 border-2 border-block-ink ${colors.face}`} />
        <div className="absolute left-1/4 top-[42%] size-2 bg-block-ink" />
        <div className="absolute right-1/4 top-[42%] size-2 bg-block-ink" />
        <div className="absolute left-[38%] top-[58%] h-1 w-6 bg-block-ink" />
        <div className={`absolute inset-x-1 bottom-0 h-1/4 border-t-4 border-block-ink ${colors.shirt}`} />
      </div>
    </div>
  );
}
