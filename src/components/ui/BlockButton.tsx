import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

type BlockButtonVariant = 'grass' | 'gold' | 'stone' | 'water';

type BlockButtonProps = HTMLMotionProps<'button'> & {
  children: ReactNode;
  variant?: BlockButtonVariant;
  icon?: ReactNode;
};

const variantClass: Record<BlockButtonVariant, string> = {
  grass: 'bg-block-grass text-white border-block-ink hover:bg-block-grassDark',
  gold: 'bg-block-gold text-block-ink border-block-ink hover:bg-block-sand',
  stone: 'bg-block-stone text-white border-block-ink hover:bg-block-stoneDark',
  water: 'bg-block-water text-white border-block-ink hover:bg-block-skyDeep',
};

export function BlockButton({
  children,
  className = '',
  variant = 'grass',
  icon,
  type = 'button',
  ...props
}: BlockButtonProps) {
  return (
    <motion.button
      whileTap={{ y: 5, scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      type={type}
      className={[
        'inline-flex min-h-14 items-center justify-center gap-3 border-4 px-6 py-3',
        'font-pixel text-sm font-black uppercase leading-relaxed tracking-normal shadow-block',
        'focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-block-gold',
        'disabled:cursor-not-allowed disabled:opacity-55',
        'active:translate-y-1 active:shadow-block-sm',
        'transition-colors',
        variantClass[variant],
        className,
      ].join(' ')}
      {...props}
    >
      {icon ? <span className="grid size-5 place-items-center">{icon}</span> : null}
      <span>{children}</span>
    </motion.button>
  );
}
