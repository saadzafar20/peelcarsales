import { WIZARD_STEPS, type WizardStepKey } from "@/lib/financing/state";
import { cn } from "@/lib/utils";

type Props = {
  current: WizardStepKey;
  completed: ReadonlyArray<WizardStepKey>;
};

export function WizardProgress({ current, completed }: Props) {
  return (
    <ol className="flex flex-wrap items-center gap-3">
      {WIZARD_STEPS.map((step, i) => {
        const isCurrent = step.key === current;
        const isDone = completed.includes(step.key);
        return (
          <li
            key={step.key}
            className={cn(
              "flex items-center gap-3 rounded-md border px-3 py-2 text-sm",
              isCurrent
                ? "border-primary bg-primary/5"
                : isDone
                  ? "border-border bg-muted/40"
                  : "border-border bg-card",
            )}
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                isCurrent
                  ? "bg-primary text-primary-foreground"
                  : isDone
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground",
              )}
            >
              {isDone ? "✓" : i + 1}
            </span>
            <span className="font-medium">{step.title}</span>
          </li>
        );
      })}
    </ol>
  );
}
