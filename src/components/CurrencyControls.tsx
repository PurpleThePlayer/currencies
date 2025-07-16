import { RANGES, ALL_CURRENCIES } from "../types/currency";
import type { Currency, Range } from "../types/currency";

type Props = {
  range: Range;
  setRange: (value: Range) => void;
  base: Currency;
  setBase: (value: Currency) => void;
};

export default function CurrencyControls({ range, setRange, base, setBase }: Props) {
  return (
    <div className="flex gap-4 flex-wrap mb-4">
      <div>
        <label className="mr-2 font-medium" htmlFor="range-select">Time Range:</label>
        <select
          id="range-select"
          className="border rounded px-2 py-1"
          value={range}
          onChange={(e) => setRange(e.target.value as Range)}
        >
          {Object.keys(RANGES).map((label) => (
            <option key={label} value={label}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mr-2 font-medium" htmlFor="base-select">Base Currency:</label>
        <select
          id="base-select"
          className="border rounded px-2 py-1"
          value={base}
          onChange={(e) => setBase(e.target.value as Currency)}
        >
          {ALL_CURRENCIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
