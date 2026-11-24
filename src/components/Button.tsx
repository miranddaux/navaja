import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

// Estados: Default · Hover · Active (pressed) · Disabled · Loading — como no Figma.
const VARIANTES = {
  primary:
    "bg-brand border border-brand-pressed text-bg hover:brightness-110 active:bg-brand-pressed active:brightness-100 disabled:bg-surface-3 disabled:border-line disabled:text-text-off disabled:brightness-100",
  secondary:
    "bg-[rgba(245,245,245,0.08)] border border-line text-text hover:bg-[rgba(245,245,245,0.14)] active:bg-[rgba(245,245,245,0.2)] disabled:text-text-off disabled:bg-transparent",
  danger:
    "bg-error-bg border border-error-line text-error hover:brightness-125 active:brightness-90 disabled:text-text-off disabled:bg-transparent disabled:border-line",
  ghost: "text-text-2 hover:text-text active:text-brand disabled:text-text-off",
} as const;

const TAMANHOS = { lg: "h-[52px] px-4", md: "h-[44px] px-8" } as const;

type Estilo = { variant?: keyof typeof VARIANTES; size?: keyof typeof TAMANHOS; className?: string };

const base =
  "inline-flex items-center justify-center gap-2 rounded-full text-button select-none transition active:scale-[0.99] disabled:cursor-not-allowed";

function classes({ variant = "primary", size = "lg", className = "" }: Estilo) {
  return `${base} ${VARIANTES[variant]} ${TAMANHOS[size]} ${className}`;
}

export function Spinner() {
  return <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />;
}

export function Button({
  variant,
  size,
  className,
  loading,
  children,
  disabled,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & Estilo & { loading?: boolean; children: ReactNode }) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes({ variant, size, className })}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...rest
}: { href: string; children: ReactNode; target?: string; rel?: string } & Estilo) {
  return (
    <Link href={href} {...rest} className={classes({ variant, size, className })}>
      {children}
    </Link>
  );
}
