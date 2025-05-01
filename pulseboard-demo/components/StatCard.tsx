// components/StatCard.tsx
interface Props {
  label: string;
  value: string | number;
  sub?: string;
}
export default function StatCard({ label, value, sub }: Props) {
  return (
    <div className="flex flex-col justify-between bg-accent rounded-xl2 shadow-card p-5">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <span className="text-3xl font-bold text-secondary">{value}</span>
      {sub && <span className="text-xs text-gray-400 mt-1">{sub}</span>}
    </div>
  );
}

