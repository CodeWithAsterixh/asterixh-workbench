"use client";

import { useMemo, useState } from "react";
import { Copy } from "lucide-react";

function diffYearsMonthsDays(from: Date, to: Date) {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const prev = new Date(to.getFullYear(), to.getMonth(), 0);
    days += prev.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months, days };
}

export function AgeCalculatorTool() {
  const [birthDate, setBirthDate] = useState("1995-07-27");
  const [referenceDate, setReferenceDate] = useState(() => new Date().toISOString().slice(0, 10));

  const data = useMemo(() => {
    const birth = new Date(`${birthDate}T00:00:00`);
    const ref = new Date(`${referenceDate}T00:00:00`);
    if (Number.isNaN(birth.getTime()) || Number.isNaN(ref.getTime()) || ref < birth) return null;
    return diffYearsMonthsDays(birth, ref);
  }, [birthDate, referenceDate]);

  const copySummary = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(`${data.years} years, ${data.months} months, ${data.days} days`);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={copySummary} className="btn btn--primary">
          <Copy size={15} strokeWidth={1.75} />
          Copy age
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card flex flex-col gap-4">
          <label htmlFor="birth-date">Birth date</label>
          <input id="birth-date" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} className="field" />
        </div>
        <div className="card flex flex-col gap-4">
          <label htmlFor="reference-date">Reference date</label>
          <input id="reference-date" type="date" value={referenceDate} onChange={(e) => setReferenceDate(e.target.value)} className="field" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="card"><span className="eyebrow">Years</span><p className="mt-3 text-sm font-mono">{data ? data.years : "Invalid date"}</p></div>
        <div className="card"><span className="eyebrow">Months</span><p className="mt-3 text-sm font-mono">{data ? data.months : "Invalid date"}</p></div>
        <div className="card"><span className="eyebrow">Days</span><p className="mt-3 text-sm font-mono">{data ? data.days : "Invalid date"}</p></div>
      </div>
    </div>
  );
}
