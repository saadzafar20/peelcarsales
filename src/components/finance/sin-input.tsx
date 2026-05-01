"use client";

import { forwardRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
};

/**
 * Masked SIN input — renders 999-999-999 and accepts user typing in either
 * grouped or unspaced form. We deliberately do not allow paste through the
 * autofill picker (autoComplete="off" + name="sin-no-autofill") because
 * SIN values do not belong in browser autofill caches.
 *
 * Crucially: the input value is held in component state only. It never
 * touches localStorage / sessionStorage / cookies. Submission goes
 * straight to the server action over HTTPS where it's HMAC-tokenized
 * and pgsodium-encrypted before persistence.
 */
export const SinInput = forwardRef<HTMLInputElement, Props>(
  ({ id = "sin", value, onChange, required }, ref) => {
    const [focused, setFocused] = useState(false);

    function format(raw: string): string {
      const digits = raw.replace(/\D/g, "").slice(0, 9);
      const a = digits.slice(0, 3);
      const b = digits.slice(3, 6);
      const c = digits.slice(6, 9);
      if (digits.length <= 3) return a;
      if (digits.length <= 6) return `${a}-${b}`;
      return `${a}-${b}-${c}`;
    }

    return (
      <div>
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider">
          Social Insurance Number (SIN)
        </label>
        <input
          ref={ref}
          id={id}
          name="sin-no-autofill"
          autoComplete="off"
          inputMode="numeric"
          required={required}
          aria-describedby={`${id}-help`}
          placeholder="999-999-999"
          value={focused ? value : value && !focused ? `***-***-${value.slice(-3)}` : ""}
          onChange={(event) => onChange(format(event.target.value))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className={cn(
            "mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm shadow-sm placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        />
        <p id={`${id}-help`} className="mt-2 text-[11px] text-muted-foreground">
          Encrypted with pgsodium envelope encryption before storage. Tokenized via HMAC for
          duplicate-application matching. Never logged. Never displayed in plaintext after submit.
        </p>
      </div>
    );
  },
);
SinInput.displayName = "SinInput";
