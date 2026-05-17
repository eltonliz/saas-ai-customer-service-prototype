import { useState, useMemo } from "react";
import type { SidebarCategory } from "../types";
import { ChevronDown, LayoutDashboard, Headset, Cpu, FolderOpen, Shield, BarChart3, Settings, Building2, Users, CreditCard, BookOpen, FileText, MonitorCog, Search, AlertTriangle, Server, ClipboardCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SidebarProps {
  categories: SidebarCategory[];
  active: string;
  onChange: (id: string) => void;
  title: string;
}

const iconMap: Record<string, LucideIcon> = {
  "工作台": LayoutDashboard,
  "客服中心": Headset,
  "AI能力中心": Cpu,
  "业务资料中心": FolderOpen,
  "风控与质检": Shield,
  "数据中心": BarChart3,
  "系统设置": Settings,
  "平台总览": LayoutDashboard,
  "客户资产": Building2,
  "AI能力平台": Cpu,
  "风控与评测": ClipboardCheck,
  "平台客服": Users,
  "运维与安全": MonitorCog,
};

export function Sidebar({ categories, active, onChange, title }: SidebarProps) {
  const initialExpanded = useMemo(() => {
    const set = new Set<string>();
    categories.forEach((cat) => {
      if (cat.children.some((c) => c.id === active)) {
        set.add(cat.id);
      }
    });
    // Default expand first category
    if (set.size === 0 && categories.length > 0) {
      set.add(categories[0].id);
    }
    return set;
  }, [categories, active]);

  const [expanded, setExpanded] = useState<Set<string>>(initialExpanded);

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <aside className="sticky top-16 h-[calc(100vh-64px)] w-60 shrink-0 overflow-y-auto border-r border-slate-200 bg-white/80 px-2 py-4">
      <p className="mb-3 px-3 text-sm font-semibold text-slate-500">{title}</p>
      <nav className="flex flex-col gap-0.5">
        {categories.map((cat) => {
          const Icon = iconMap[cat.label] ?? LayoutDashboard;
          const isExpanded = expanded.has(cat.id);
          const hasActiveChild = cat.children.some((c) => c.id === active);
          return (
            <div key={cat.id}>
              <button
                type="button"
                onClick={() => toggle(cat.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  hasActiveChild
                    ? "text-blue-700"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon size={16} className={hasActiveChild ? "text-blue-600" : "text-slate-400"} />
                <span className="flex-1">{cat.label}</span>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                />
              </button>
              {isExpanded && (
                <div className="ml-4 mt-0.5 flex flex-col gap-0.5 border-l border-slate-200 pl-3">
                  {cat.children.map((item) => {
                    const isActive = item.id === active;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onChange(item.id)}
                        className={`rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          isActive
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
