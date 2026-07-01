import { Check, Delete } from 'lucide-react';

type NumberPadProps = {
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
};

const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

function padButtonClass(extraClasses = '') {
  return [
    'min-h-14 border-4 border-block-ink px-3 py-3 font-pixel text-xl font-black shadow-block-sm',
    'focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-block-gold',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'active:translate-y-1 active:shadow-none',
    'transition-transform',
    extraClasses,
  ].join(' ');
}

export function NumberPad({ value, disabled = false, onChange, onSubmit, onClear }: NumberPadProps) {
  const addDigit = (digit: string) => {
    if (disabled || value.length >= 5) {
      return;
    }

    onChange(value === '0' ? digit : `${value}${digit}`);
  };

  return (
    <section className="border-4 border-block-ink bg-block-parchment p-4 shadow-block" aria-label="Teclado numérico">
      <div className="mb-4 min-h-14 border-4 border-block-ink bg-white px-4 py-3 text-right font-pixel text-2xl font-black shadow-insetBlock">
        {value || <span className="text-block-stone">?</span>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {digits.slice(0, 9).map((digit) => (
          <button
            key={digit}
            type="button"
            disabled={disabled}
            onClick={() => addDigit(digit)}
            data-testid={`number-pad-digit-${digit}`}
            className={padButtonClass('bg-white text-block-ink hover:bg-block-cloud')}
          >
            {digit}
          </button>
        ))}

        <span />

        <button
          type="button"
          disabled={disabled}
          onClick={() => addDigit('0')}
          data-testid="number-pad-digit-0"
          className={padButtonClass('bg-white text-block-ink hover:bg-block-cloud')}
        >
          0
        </button>

        <span />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={onClear}
          data-testid="number-pad-clear"
          className={padButtonClass('bg-block-stone text-white hover:bg-block-stoneDark')}
        >
          <Delete className="mx-auto mb-1" size={20} strokeWidth={3} />
          Borrar
        </button>
        <button
          type="button"
          disabled={disabled || value.length === 0}
          onClick={onSubmit}
          data-testid="number-pad-submit"
          className={padButtonClass('bg-block-grass text-white hover:bg-block-grassDark')}
        >
          <Check className="mx-auto mb-1" size={20} strokeWidth={3} />
          Comprobar
        </button>
      </div>
    </section>
  );
}
