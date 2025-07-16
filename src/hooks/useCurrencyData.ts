import { useEffect, useState } from "react";
import { ALL_CURRENCIES, RANGES } from "../types/currency";
import type { Currency, RateData, Range } from "../types/currency";

export function useCurrencyData(range: Range, base: Currency) {
  const [data, setData] = useState<RateData[]>([]);
  const [loading, setLoading] = useState(true);

  const currenciesToCompare = ALL_CURRENCIES.filter((c) => c !== base);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const days = RANGES[range];
      const end = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - days * 86400000).toISOString().split("T")[0];

      const url = `https://api.frankfurter.app/${startDate}..${end}?from=${base}&to=${currenciesToCompare.join(",")}`;
      const res = await fetch(url);
      const json = await res.json();
      
      const entries = Object.entries(json.rates) as [string, Record<string, number>][];
      const chartData: RateData[] = entries.map(([date, rates]) => ({
        date,
        ...rates,
      }));


      setData(chartData);
      setLoading(false);
    };


    
    fetchData();
  }, [range, base]);

  return { data, loading, currenciesToCompare };
}
