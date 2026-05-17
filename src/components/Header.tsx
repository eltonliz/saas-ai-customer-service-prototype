import type { Portal } from "../types";
import { Building2, ChevronDown, MonitorCog, Smartphone } from "lucide-react";

interface HeaderProps {
  portal: Portal;
  onPortalChange: (portal: Portal) => void;
}

const portalOptions: { id: Portal; label: string; icon: typeof Smartphone }[] = [
  { id: "app", label: "APP用户侧", icon: Smartphone },
  { id: "tenant", label: "租户后台侧", icon: Building2 },
  { id: "platform", label: "平台管理侧", icon: MonitorCog },
];

export function Header({ portal, onPortalChange }: HeaderProps) {
  const current = portalOptions.find((p) => p.id === portal) ?? portalOptions[1];
  const CurrentIcon = current.icon;
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
          <CurrentIcon size={18} />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-950">SaaS AI客服系统 高保真原型</h1>
          <p className="text-base text-slate-500">多租户 · 商家 · 门店 · 渠道 · 业务线 · 权限隔离</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-base font-medium text-blue-700">
          当前端：{current.label}
        </span>
        <label className="relative">
          <span className="sr-only">端切换器</span>
          <select
            value={portal}
            onChange={(e) => onPortalChange(e.target.value as Portal)}
            className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-9 text-base font-medium text-slate-800 shadow-sm outline-none hover:border-blue-300 focus:border-blue-500"
          >
            {portalOptions.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2.5 text-slate-400" size={16} />
        </label>
      </div>
    </header>
  );
}
