// Ícones 24x24 (traço 1.75) no estilo do design: simples e herdam a cor do texto.
const base = { width: 24, height: 24, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export function IconEstilos() {
  return (<svg {...base}><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12" /></svg>);
}
export function IconPainel() {
  return (<svg {...base}><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></svg>);
}
export function IconDono() {
  return (<svg {...base}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>);
}
export function IconCopiar() {
  return (<svg {...base}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 012-2h9" /></svg>);
}
export function IconCheck() {
  return (<svg {...base}><path d="M4 12.5l5 5 11-11" /></svg>);
}
