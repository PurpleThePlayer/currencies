import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import type { RateData } from "../types/currency";


type Props = {
  data: RateData[];
  currency: string;
  color: string;
  hideXAxis?: boolean;
};

export default function ChartCard({ data, currency, color, hideXAxis }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4" aria-label={`${currency} currency chart`}>
      <h2 className="text-xl font-semibold mb-2">{currency}</h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" hide={hideXAxis} />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={currency} stroke={color} dot={false} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
