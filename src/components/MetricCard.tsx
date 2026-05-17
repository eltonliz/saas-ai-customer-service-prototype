interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: string;
  trendUp?: boolean;
  color?: "blue" | "green" | "red" | "orange" | "slate";
  onClick?: () => void;
}

const colorStyles: Record<string, { bg: string; text: string }> = {
  blue: { bg: "bg-blue-50 border-blue-100", text: "text-blue-700" },
  green: { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700" },
  red: { bg: "bg-red-50 border-red-100", text: "text-red-700" },
  orange: { bg: "bg-amber-50 border-amber-100", text: "text-amber-700" },
  slate: { bg: "bg-slate-50 border-slate-100", text: "text-slate-700" },
};

export function MetricCard({ label, value, trend, trendUp, color = "slate", onClick }: MetricCardProps) {
  const cs = colorStyles[color] ?? colorStyles.slate;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`flex flex-col gap-1 rounded-xl border p-4 text-left transition-shadow hover:shadow-md ${cs.bg} ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <span className="text-base font-medium text-slate-500">{label}</span>
      <span className={`text-3xl font-bold ${cs.text}`}>{value}</span>
      {trend && (
        <span className={`text-base ${trendUp ? "text-emerald-600" : "text-red-500"}`}>
          {trendUp ? "↑" : "↓"} {trend}
        </span>
      )}
    </button>
  );
}
