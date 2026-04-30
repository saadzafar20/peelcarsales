"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatPriceCAD } from "@/lib/utils";

const HST_RATE = 0.13;

export function Calculator() {
  const [priceDollars, setPriceDollars] = useState(24_995);
  const [downDollars, setDownDollars] = useState(2_000);
  const [termMonths, setTermMonths] = useState(72);
  const [aprPct, setAprPct] = useState(7.99);

  const result = useMemo(() => {
    const principal = priceDollars * (1 + HST_RATE) - downDollars;
    if (principal <= 0 || termMonths <= 0)
      return { monthly: 0, biweekly: 0, totalInterest: 0, totalPaid: 0 };
    const monthlyRate = aprPct / 100 / 12;
    const monthly =
      monthlyRate === 0
        ? principal / termMonths
        : (principal * monthlyRate) / (1 - (1 + monthlyRate) ** -termMonths);
    const biweekly = (monthly * 12) / 26;
    const totalPaid = monthly * termMonths;
    const totalInterest = totalPaid - principal;
    return { monthly, biweekly, totalInterest, totalPaid };
  }, [priceDollars, downDollars, termMonths, aprPct]);

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1fr_380px]">
      {/* Inputs */}
      <Card>
        <CardContent className="space-y-7 p-7">
          <SliderField
            label="Vehicle price"
            value={priceDollars}
            onChange={setPriceDollars}
            min={5000}
            max={80000}
            step={500}
            format={(v) => formatPriceCAD(v * 100)}
          />
          <SliderField
            label="Down payment"
            value={downDollars}
            onChange={setDownDollars}
            min={0}
            max={Math.min(priceDollars, 30_000)}
            step={250}
            format={(v) => formatPriceCAD(v * 100)}
          />
          <SliderField
            label="Term (months)"
            value={termMonths}
            onChange={setTermMonths}
            min={24}
            max={96}
            step={12}
            format={(v) => `${v} months`}
          />
          <SliderField
            label="Annual interest rate"
            value={aprPct}
            onChange={setAprPct}
            min={3}
            max={29.95}
            step={0.05}
            format={(v) => `${v.toFixed(2)}%`}
          />
        </CardContent>
      </Card>

      {/* Output */}
      <Card className="bg-secondary text-secondary-foreground">
        <CardContent className="space-y-5 p-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent">Bi-weekly</p>
            <p className="font-display text-4xl font-bold tracking-tight">
              {formatPriceCAD(Math.ceil(result.biweekly) * 100)}
            </p>
          </div>
          <div className="border-t border-secondary-foreground/15 pt-4">
            <p className="text-xs uppercase tracking-wider text-secondary-foreground/65">Monthly</p>
            <p className="font-display text-2xl font-bold">
              {formatPriceCAD(Math.ceil(result.monthly) * 100)}
            </p>
          </div>
          <div className="border-t border-secondary-foreground/15 pt-4">
            <p className="text-xs uppercase tracking-wider text-secondary-foreground/65">
              Total interest
            </p>
            <p className="font-display text-xl font-bold">
              {formatPriceCAD(Math.round(result.totalInterest) * 100)}
            </p>
          </div>
          <div className="border-t border-secondary-foreground/15 pt-4">
            <p className="text-xs uppercase tracking-wider text-secondary-foreground/65">
              Total cost (with HST)
            </p>
            <p className="font-display text-xl font-bold">
              {formatPriceCAD(Math.round(result.totalPaid + downDollars) * 100)}
            </p>
          </div>
          <p className="border-t border-secondary-foreground/15 pt-4 text-[11px] text-secondary-foreground/60">
            Estimate only. HST 13% applied. Real rate comes back with pre-qualification.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

type SliderFieldProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
};

function SliderField({ label, value, onChange, min, max, step, format }: SliderFieldProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{label}</span>
        <span className="font-display text-base font-bold">{format(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
        aria-label={label}
      />
      <div className="flex items-center gap-3">
        <Input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="max-w-[140px]"
          aria-label={`${label} (numeric input)`}
        />
        <span className="text-xs text-muted-foreground">
          {format(min)} – {format(max)}
        </span>
      </div>
    </div>
  );
}
