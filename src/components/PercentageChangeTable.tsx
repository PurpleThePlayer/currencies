type Props = {
  changes: Record<string, number>;
  range: string;
};

export default function PercentageChangeTable({ changes, range }: Props) {
  if (Object.keys(changes).length === 0) {
    return <p>Not enough data to calculate percentage changes.</p>;
  }

  return (
    <div className="bg-gray-100 rounded-lg p-4 mt-8 shadow" aria-label="Percentage changes table">
      <h2 className="text-xl font-bold mb-4">Percentage Change Over {range}</h2>
      <table className="w-full text-left table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Currency</th>
            <th className="border border-gray-300 px-4 py-2">% Change</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(changes).map(([curr, pct]) => (
            <tr key={curr}>
              <td className="border border-gray-300 px-4 py-2">{curr}</td>
              <td className={`border border-gray-300 px-4 py-2 ${pct > 0 ? "text-green-600" : pct < 0 ? "text-red-600" : ""}`}>
                {pct.toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
