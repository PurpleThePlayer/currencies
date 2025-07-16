import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const ALL_CURRENCIES = ["EUR", "USD", "SEK", "JPY", "GBP"] as const;
type Currency = typeof ALL_CURRENCIES[number];

const RANGES = {
  "1 Day": 1,
  "1 Week": 7,
  "1 Month": 30,
  "6 Months": 180,
  "1 Year": 365,
} as const;
type Range = keyof typeof RANGES;

type RateData = {
  date: string;
  [key: string]: number | string;
};

export default function CurrencyGraphApp(): JSX.Element {
  const [data, setData] = useState<RateData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [range, setRange] = useState<Range>("1 Month");
  const [base, setBase] = useState<Currency>("USD");

  const currenciesToCompare = ALL_CURRENCIES.filter((c) => c !== base);

  useEffect(() => {
    setLoading(true);
    const days = RANGES[range];
    const end = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - days * 86400000)
      .toISOString()
      .split("T")[0];

    const url = `https://api.frankfurter.app/${startDate}..${end}?from=${base}&to=${currenciesToCompare.join(
      ","
    )}`;

    fetch(url)
      .then((res) => res.json())
      .then((resData) => {
        const chartData: RateData[] = Object.entries(resData.rates).map(
          ([date, rates]) => ({
            date,
            ...rates,
          })
        );
        setData(chartData);
        setLoading(false);
      });
  }, [range, base]);

  // Calculate % changes from first to last available date for each currency
  const percentageChanges: Record<Currency, number> = {} as Record<
    Currency,
    number
  >;
  if (data.length >= 2) {
    const first = data[0];
    const last = data[data.length - 1];
    currenciesToCompare.forEach((curr) => {
      if (
        typeof first[curr] === "number" &&
        typeof last[curr] === "number"
      ) {
        percentageChanges[curr] =
          ((last[curr] as number) - (first[curr] as number)) /
          (first[curr] as number) *
          100;
      }
    });
  }

  const colors = ["#8884d8", "#82ca9d", "#ff7300", "#ff4081"];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">
        Currency Comparison (Base: {base})
      </h1>

      <div className="flex gap-4 flex-wrap mb-4">
        <div>
          <label className="mr-2 font-medium" htmlFor="range-select">
            Time Range:
          </label>
          <select
            id="range-select"
            className="border rounded px-2 py-1"
            value={range}
            onChange={(e) => setRange(e.target.value as Range)}
          >
            {Object.keys(RANGES).map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium" htmlFor="base-select">
            Base Currency:
          </label>
          <select
            id="base-select"
            className="border rounded px-2 py-1"
            value={base}
            onChange={(e) => setBase(e.target.value as Currency)}
          >
            {ALL_CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currenciesToCompare.map((curr, index) => (
              <div
                key={curr}
                className="bg-white rounded-lg shadow p-4"
                aria-label={`${curr} currency chart`}
              >
                <h2 className="text-xl font-semibold mb-2">{curr}</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart
                    data={data}
                    margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" hide={range === "1 Day"} />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey={curr}
                      stroke={colors[index % colors.length]}
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}
          </div>

          <div
            className="bg-gray-100 rounded-lg p-4 mt-8 shadow"
            aria-label="Percentage changes table"
          >
            <h2 className="text-xl font-bold mb-4">
              Percentage Change Over {range}
            </h2>
            {Object.keys(percentageChanges).length === 0 ? (
              <p>Not enough data to calculate percentage changes.</p>
            ) : (
              <table className="w-full text-left table-auto border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Currency</th>
                    <th className="border border-gray-300 px-4 py-2">% Change</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(percentageChanges).map(([curr, pct]) => (
                    <tr key={curr}>
                      <td className="border border-gray-300 px-4 py-2">{curr}</td>
                      <td
                        className={`border border-gray-300 px-4 py-2 ${
                          pct > 0
                            ? "text-green-600"
                            : pct < 0
                            ? "text-red-600"
                            : ""
                        }`}
                      >
                        {pct.toFixed(2)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
