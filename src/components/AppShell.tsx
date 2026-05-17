import type { ReactNode } from "react";
import type { MenuItem } from "../types";
import type { LucideIcon } from "lucide-react";
import { Header } from "./Header";
import { PhonePreview } from "./PhonePreview";
import { Home, MessageCircle, Package, LayoutGrid, User } from "lucide-react";

interface AppShellProps {
  pageId: string;
  menus: MenuItem[];
  onPageChange: (pageId: string) => void;
  onPortalChange: (portal: "app" | "tenant" | "platform") => void;
  children: ReactNode;
}

const navIcons: Record<string, LucideIcon> = {
  "app-home": Home,
  "ai-service": MessageCircle,
  "orders": Package,
  "app-service": LayoutGrid,
  "profile": User,
};

const navItems = [
  { id: "app-home", label: "首页" },
  { id: "ai-service", label: "AI客服" },
  { id: "orders", label: "订单" },
  { id: "app-service", label: "服务" },
  { id: "profile", label: "我的" },
];

export function AppShell({ pageId, menus, onPageChange, onPortalChange, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header portal="app" onPortalChange={onPortalChange} />
      <main className="grid-bg min-h-[calc(100vh-64px)] p-4 lg:p-8">
        <PhonePreview>
          <div className="flex min-h-[760px] flex-col">
            <div className="flex-1 overflow-y-auto">{children}</div>
            <nav className="grid grid-cols-5 border-t border-slate-200 bg-white px-1 py-2">
              {navItems.map((item) => {
                const Icon = navIcons[item.id];
                const active = pageId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onPageChange(item.id)}
                    className={`flex flex-col items-center gap-0.5 py-2 text-sm font-medium transition-colors ${
                      active ? "text-blue-600" : "text-slate-400"
                    }`}
                  >
                    {Icon && <Icon size={20} />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </PhonePreview>
      </main>
    </div>
  );
}
