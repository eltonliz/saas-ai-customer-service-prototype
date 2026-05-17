interface TimelineItem {
  time: string;
  title: string;
  detail?: string;
  state?: "done" | "active" | "error" | "pending";
}

interface TimelineProps {
  items: TimelineItem[];
}

const stateColors: Record<string, string> = {
  done: "border-blue-500 bg-white",
  active: "border-amber-500 bg-amber-50",
  error: "border-red-500 bg-red-50",
  pending: "border-slate-300 bg-white",
};

const stateDots: Record<string, string> = {
  done: "bg-blue-500",
  active: "bg-amber-500 animate-pulse",
  error: "bg-red-500",
  pending: "bg-slate-300",
};

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="space-y-0">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const color = stateColors[item.state ?? "done"];
        const dot = stateDots[item.state ?? "done"];
        return (
          <div key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`mt-1 h-3 w-3 rounded-full border-2 ${dot} ${color.split(" ")[0]} ${color.split(" ")[1] || ""}`} />
              {!isLast && <div className="my-0.5 w-0.5 flex-1 bg-slate-200" />}
            </div>
            <div className={`pb-5 ${isLast ? "" : ""}`}>
              <p className="text-sm font-semibold text-slate-700">{item.title}</p>
              <p className="text-sm text-slate-400">{item.time}</p>
              {item.detail && <p className="mt-1 text-sm text-slate-500">{item.detail}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
