type BlockProgressProps = {
  value: number;
  max?: number;
  label?: string;
};

export function BlockProgress({ value, max = 10, label = 'Progreso' }: BlockProgressProps) {
  const safeMax = Math.max(max, 1);
  const safeValue = Math.min(Math.max(value, 0), safeMax);
  const blocks = Array.from({ length: safeMax }, (_, index) => index < safeValue);

  return (
    <div className="w-full" aria-label={`${label}: ${safeValue} de ${safeMax}`}>
      <div className="mb-2 flex items-center justify-between font-pixel text-xs font-black uppercase text-block-ink">
        <span>{label}</span>
        <span>
          {safeValue}/{safeMax}
        </span>
      </div>
      <div className="grid grid-cols-10 gap-1 border-4 border-block-ink bg-block-cave p-2 shadow-insetBlock">
        {blocks.map((isFilled, index) => (
          <span
            key={index}
            className={[
              'h-4 border-2 border-block-ink shadow-insetBlock',
              isFilled ? 'bg-block-gold' : 'bg-block-stoneDark',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}
