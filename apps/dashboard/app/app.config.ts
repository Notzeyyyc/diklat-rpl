export default defineAppConfig({
  ui: {
    button: {
      slots: {
        base: 'neo-border font-display font-bold tracking-wide transition-all duration-100 rounded-lg',
        label: 'font-display font-bold',
      },
      variants: {
        color: {
          primary: {
            base: 'bg-neo-primary text-white neo-shadow-md hover:neo-shadow-lg active:neo-active',
          },
          secondary: {
            base: 'bg-neo-secondary text-white neo-shadow-md hover:neo-shadow-lg active:neo-active',
          },
          success: {
            base: 'bg-neo-success text-neo-ink neo-shadow-md hover:neo-shadow-lg active:neo-active',
          },
          warning: {
            base: 'bg-neo-warning text-neo-ink neo-shadow-md hover:neo-shadow-lg active:neo-active',
          },
          danger: {
            base: 'bg-neo-danger text-white neo-shadow-md hover:neo-shadow-lg active:neo-active',
          },
          neutral: {
            base: 'bg-white text-neo-ink neo-shadow-sm hover:neo-shadow-md active:neo-active',
          },
        },
        size: {
          sm: { base: 'px-3 py-1.5 text-xs', label: 'text-xs' },
          md: { base: 'px-4 py-2 text-sm', label: 'text-sm' },
          lg: { base: 'px-6 py-3 text-base', label: 'text-base' },
        },
      },
    },
    card: {
      slots: {
        root: 'neo-border-thick neo-shadow-lg bg-white rounded-xl',
        header: 'border-b-2 border-neo-ink px-5 py-4',
        footer: 'border-t-2 border-neo-ink px-5 py-4 bg-neo-surface-container',
      },
    },
    input: {
      slots: {
        root: 'neo-border neo-shadow-sm rounded-lg bg-white transition-shadow duration-100',
        base: 'font-body placeholder:text-neo-outline-variant/60',
      },
    },
    badge: {
      slots: {
        base: 'neo-border rounded-md font-mono font-bold uppercase tracking-wider',
      },
      variants: {
        color: {
          primary: { base: 'bg-neo-primary text-white neo-shadow-sm' },
          secondary: { base: 'bg-neo-secondary-container text-neo-ink neo-shadow-sm' },
          success: { base: 'bg-neo-success text-neo-ink neo-shadow-sm' },
          warning: { base: 'bg-neo-warning text-neo-ink neo-shadow-sm' },
          danger: { base: 'bg-neo-danger text-white neo-shadow-sm' },
          neutral: { base: 'bg-neo-surface-container-highest text-neo-ink neo-shadow-sm' },
        },
      },
    },
    table: {
      slots: {
        root: 'neo-border-thick neo-shadow-xl bg-white rounded-xl overflow-hidden',
        thead: 'bg-neo-surface-container border-b-2 border-neo-ink',
        th: 'font-mono font-bold uppercase tracking-wider text-xs text-neo-on-surface-variant',
        td: 'border-b border-neo-outline-variant',
        tr: 'hover:bg-neo-surface-container transition-colors',
      },
    },
    navigationMenu: {
      slots: {
        root: 'font-display font-semibold',
        link: 'rounded-lg font-display font-semibold',
        linkActive: 'bg-neo-primary text-white neo-shadow-sm',
      },
    },
    selectMenu: {
      slots: {
        base: 'neo-border neo-shadow-sm rounded-lg bg-white',
      },
    },
    toggle: {
      slots: {
        base: 'neo-border rounded-full',
        active: 'bg-neo-primary',
      },
    },
  },
})
