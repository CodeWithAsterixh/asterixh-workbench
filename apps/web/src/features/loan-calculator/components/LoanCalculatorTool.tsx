"use client";

import { useMemo, useState } from "react";
import { Copy, RotateCcw } from "lucide-react";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
}

export function LoanCalculatorTool() {
  const [principal, setPrincipal] = useState("250000");
  const [rate, setRate] = useState("6.5");
  const [termYears, setTermYears] = useState("30");

  const data = useMemo(() => {
    const p = Number(principal);
    const r = Number(rate) / 100 / 12;
    const n = Number(termYears) * 12;
    if (!Number.isFinite(p) || !Number.isFinite(r) || !Number.isFinite(n) || p <= 0 || n <= 0) {
      return null;
    }
    const monthly = r === 0 ? p / n : (p * r) / (1 - (1 + r) ** -n);
    const total = monthly * n;
    const interest = total - p;
    return { monthly, total, interest, payments: n };
  }, [principal, rate, termYears]);

  const copySummary = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(
      `Monthly payment ${formatCurrency(data.monthly)}, total ${formatCurrency(data.total)}, interest ${formatCurrency(data.interest)}`,
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copySummary} className="btn btn--primary">
          <Copy size={15} strokeWidth={1.75} />
          Copy summary
        </button>
        <button
          type="button"
          onClick={() => {
            setPrincipal("250000");
            setRate("6.5");
            setTermYears("30");
          }}
          className="btn btn--secondary"
        >
          <RotateCcw size={15} strokeWidth={1.75} />
          Reset
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card">
          <label htmlFor="loan-principal">Loan amount</label>
          <input id="loan-principal" type="number" step="any" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="field" />
        </div>
        <div className="card">
          <label htmlFor="loan-rate">Interest rate %</label>
          <input id="loan-rate" type="number" step="any" value={rate} onChange={(e) => setRate(e.target.value)} className="field" />
        </div>
        <div className="card">
          <label htmlFor="loan-term">Term in years</label>
          <input id="loan-term" type="number" step="any" value={termYears} onChange={(e) => setTermYears(e.target.value)} className="field" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><span className="eyebrow">Monthly payment</span><p className="mt-3 text-sm font-mono">{data ? formatCurrency(data.monthly) : "Enter valid values"}</p></div>
        <div className="card"><span className="eyebrow">Total paid</span><p className="mt-3 text-sm font-mono">{data ? formatCurrency(data.total) : "Enter valid values"}</p></div>
        <div className="card"><span className="eyebrow">Total interest</span><p className="mt-3 text-sm font-mono">{data ? formatCurrency(data.interest) : "Enter valid values"}</p></div>
      </div>

      <div className="card">
        <span className="eyebrow">Loan snapshot</span>
        <p className="mt-3 text-sm text-secondary leading-relaxed">
          {data
            ? `${formatNumber(Number(termYears) * 12)} payments at ${rate}% APR for ${formatCurrency(Number(principal))}.`
            : "Use realistic loan numbers to see the payment breakdown."}
        </p>
      </div>
    </div>
  );
}
