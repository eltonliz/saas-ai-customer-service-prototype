import type { PageProps } from "../../types";
import { users, conversations, tickets, afterSales } from "../../data/mockData";
import { User, Ticket, MessageSquare, Wrench, Settings, ChevronRight, Star, Crown, ShoppingBag, MapPin, Heart, HelpCircle, Info } from "lucide-react";

export default function AppProfile({ context, goPage }: PageProps) {
  const user = users.find((u) => u.id === context.currentUserId);
  const myConversations = conversations.filter((c) => c.userId === context.currentUserId);
  const myTickets = tickets.filter((t) => t.userId === context.currentUserId);
  const myAfterSales = afterSales.filter((a) => a.userId === context.currentUserId);

  const menuItems = [
    { icon: ShoppingBag, label: "我的订单", count: undefined, color: "text-blue-500", onClick: () => goPage?.("orders") },
    { icon: Wrench, label: "我的售后", count: myAfterSales.length, color: "text-amber-500", onClick: () => goPage?.("after-sales") },
    { icon: MessageSquare, label: "历史咨询", count: myConversations.length, color: "text-indigo-500", onClick: () => goPage?.("ai-service") },
    { icon: Ticket, label: "我的工单", count: myTickets.length, color: "text-violet-500", onClick: () => goPage?.("after-sales") },
    { icon: MapPin, label: "地址管理", count: undefined, color: "text-emerald-500", onClick: () => goPage?.("profile") },
    { icon: Heart, label: "我的收藏", count: undefined, color: "text-rose-500", onClick: () => goPage?.("profile") },
    { icon: HelpCircle, label: "帮助中心", count: undefined, color: "text-cyan-500", onClick: () => goPage?.("profile") },
    { icon: Settings, label: "设置", count: undefined, color: "text-slate-500", onClick: () => goPage?.("profile") },
    { icon: Info, label: "关于我们", count: undefined, color: "text-slate-500", onClick: () => goPage?.("profile") },
  ];

  return (
    <div className="p-4">
      {/* User Card */}
      <div className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
            <User size={28} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{user?.name ?? "用户"}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-sm font-medium text-amber-700">
                <Crown size={12} /> {user?.level ?? "普通会员"}
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-amber-50 py-3">
            <p className="text-xl font-bold text-amber-700">{user?.coupons ?? 0}</p>
            <p className="text-sm text-amber-600 mt-0.5">优惠券</p>
          </div>
          <div className="rounded-xl bg-blue-50 py-3">
            <p className="text-xl font-bold text-blue-700">{user?.points ?? 0}</p>
            <p className="text-sm text-blue-600 mt-0.5">积分</p>
          </div>
          <div className="rounded-xl bg-indigo-50 py-3">
            <p className="text-xl font-bold text-indigo-700">{myConversations.length}</p>
            <p className="text-sm text-indigo-600 mt-0.5">历史咨询</p>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="rounded-2xl bg-white shadow-sm border border-slate-100 divide-y divide-slate-50">
        {menuItems.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onClick}
            className="flex w-full items-center justify-between px-5 py-4 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <item.icon size={20} className={item.color} />
              <span className="text-sm font-medium">{item.label}</span>
              {item.count !== undefined && (
                <span className="text-sm text-slate-300">({item.count})</span>
              )}
            </div>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-slate-400 mt-6">SaaS AI客服 v1.0</p>
    </div>
  );
}
