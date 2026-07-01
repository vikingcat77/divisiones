export function BlockLandscape() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-block-sky">
      <div className="absolute inset-0 bg-pixel-grid bg-[length:32px_32px] opacity-35" />
      <div className="absolute left-[8%] top-[12%] h-10 w-36 bg-block-cloud shadow-insetBlock" />
      <div className="absolute left-[15%] top-[17%] h-10 w-24 bg-block-cloud shadow-insetBlock" />
      <div className="absolute right-[10%] top-[9%] h-12 w-44 bg-block-cloud shadow-insetBlock" />
      <div className="absolute bottom-28 left-[4%] h-36 w-36 rotate-45 border-4 border-block-ink bg-block-stone shadow-insetBlock" />
      <div className="absolute bottom-28 left-[18%] h-44 w-44 rotate-45 border-4 border-block-ink bg-block-stoneDark shadow-insetBlock" />
      <div className="absolute bottom-24 right-[10%] h-48 w-48 rotate-45 border-4 border-block-ink bg-block-stone shadow-insetBlock" />
      <div className="absolute bottom-0 h-28 w-full border-t-4 border-block-ink bg-block-grass shadow-insetBlock" />
      <div className="absolute bottom-0 grid h-16 w-full grid-cols-12">
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            className={[
              'border-r-4 border-t-4 border-block-ink shadow-insetBlock',
              index % 2 === 0 ? 'bg-block-dirt' : 'bg-block-dirtDark',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  );
}
