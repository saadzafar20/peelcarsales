type Props = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

export function AdminPageHeader({ title, subtitle, actions }: Props) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </header>
  );
}
