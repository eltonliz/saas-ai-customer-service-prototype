import { useState } from "react";
import type { PageProps } from "../../types";
import { users, conversations } from "../../data/mockData";
import {
  Search,
  User,
  Crown,
  Ticket,
  Coins,
  MessageCircle,
  Package,
  HelpCircle,
  Heart,
  Truck,
  Wrench,
  Store,
  GraduationCap,
  ShoppingBag,
  MapPin,
  ChevronRight,
  Radio,
  Sparkles,
  Stethoscope,
} from "lucide-react";

export default function AppHome({ context, goPage }: PageProps) {
  const [searchText, setSearchText] = useState("");
  const user = users.find((u) => u.id === context.currentUserId);
  const myConversations = conversations.filter((c) => c.userId === context.currentUserId);

  function handleSearch() {
    if (!searchText.trim()) return;
    goPage?.("ai-service", { chatPrompt: searchText.trim() });
  }

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="pb-4">
      {/* ========== 1. Search Bar ========== */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2.5">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="搜索商品、课程、门店..."
            className="flex-1 bg-transparent text-base text-slate-700 placeholder-slate-400 outline-none"
          />
        </div>
      </div>

      {/* ========== 2. User Info Card ========== */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20">
              <User size={22} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{user?.name ?? "用户"}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/20 px-2 py-0.5 text-base text-amber-200">
                  <Crown size={12} />
                  {user?.level ?? "普通会员"}
                </span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white/10 py-2.5 text-center">
              <p className="text-xl font-bold">{user?.coupons ?? 0}</p>
              <p className="text-base text-blue-200 mt-0.5">优惠券</p>
            </div>
            <div className="rounded-xl bg-white/10 py-2.5 text-center">
              <p className="text-xl font-bold">{user?.points ?? 0}</p>
              <p className="text-base text-blue-200 mt-0.5">积分</p>
            </div>
            <div className="rounded-xl bg-white/10 py-2.5 text-center">
              <p className="text-xl font-bold">{myConversations.length}</p>
              <p className="text-base text-blue-200 mt-0.5">历史咨询</p>
            </div>
          </div>
        </div>
      </div>

      {/* ========== 3. Banner Carousel ========== */}
      <div className="mb-4">
        <div className="flex gap-3 overflow-x-auto px-4 snap-x scrollbar-hide">
          <div className="shrink-0 w-64 rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 p-4 text-white snap-start">
            <div className="flex items-center gap-2 mb-2">
              <Radio size={20} />
              <span className="text-base font-semibold">直播专场</span>
            </div>
            <p className="text-base text-white/80 mb-3">爆款好物限时抢</p>
            <button
              type="button"
              onClick={() => goPage?.("ai-service", { chatPrompt: "直播好物咨询" })}
              className="rounded-full bg-white/20 px-3 py-1.5 text-base text-white hover:bg-white/30 transition-colors"
            >
              立即查看
            </button>
          </div>
          <div className="shrink-0 w-64 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 p-4 text-white snap-start">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={20} />
              <span className="text-base font-semibold">今日权益</span>
            </div>
            <p className="text-base text-white/80 mb-3">会员专属福利等你领</p>
            <button
              type="button"
              onClick={() => goPage?.("profile")}
              className="rounded-full bg-white/20 px-3 py-1.5 text-base text-white hover:bg-white/30 transition-colors"
            >
              立即查看
            </button>
          </div>
          <div className="shrink-0 w-64 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 p-4 text-white snap-start">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope size={20} />
              <span className="text-base font-semibold">大健康服务</span>
            </div>
            <p className="text-base text-white/80 mb-3">AI健康顾问在线答疑</p>
            <button
              type="button"
              onClick={() => goPage?.("ai-service", { chatPrompt: "大健康咨询" })}
              className="rounded-full bg-white/20 px-3 py-1.5 text-base text-white hover:bg-white/30 transition-colors"
            >
              立即查看
            </button>
          </div>
        </div>
      </div>

      {/* ========== 4. AI客服快捷入口 ========== */}
      <div className="px-4 mb-4">
        <h3 className="text-xl font-semibold text-slate-800 mb-3">AI客服</h3>
        <div className="grid grid-cols-2 gap-3" data-annotation-target="app-home-entries">
          <button
            type="button"
            onClick={() => goPage?.("ai-service", { chatPrompt: "订单问题，查物流、改地址" })}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 text-left shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
              <Package size={20} className="text-blue-500" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-medium text-slate-800">订单问题</p>
              <p className="text-base text-slate-400 truncate">查物流、改地址</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => goPage?.("ai-service", { chatPrompt: "售后问题，退换货、退款" })}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 text-left shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50">
              <Wrench size={20} className="text-amber-500" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-medium text-slate-800">售后问题</p>
              <p className="text-base text-slate-400 truncate">退换货、退款</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => goPage?.("ai-service", { chatPrompt: "商品咨询，比价格、问功效" })}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 text-left shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
              <HelpCircle size={20} className="text-violet-500" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-medium text-slate-800">商品咨询</p>
              <p className="text-base text-slate-400 truncate">比价格、问功效</p>
            </div>
          </button>
          <button
            type="button"
            onClick={() => goPage?.("ai-service", { chatPrompt: "大健康咨询，健康科普、产品说明" })}
            className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 text-left shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50">
              <Heart size={20} className="text-rose-500" />
            </div>
            <div className="min-w-0">
              <p className="text-base font-medium text-slate-800">大健康咨询</p>
              <p className="text-base text-slate-400 truncate">健康科普、产品说明</p>
            </div>
          </button>
        </div>
      </div>

      {/* ========== 5. 订单提醒 ========== */}
      <div className="px-4 mb-4">
        <h3 className="text-xl font-semibold text-slate-800 mb-3">订单动态</h3>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => goPage?.("orders")}
            className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 p-3 text-left hover:bg-amber-100 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Truck size={18} className="text-amber-600" />
            </div>
            <span className="flex-1 text-base font-medium text-slate-700">1个订单运输中</span>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
          <button
            type="button"
            onClick={() => goPage?.("after-sales")}
            className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 p-3 text-left hover:bg-rose-100 transition-colors"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100">
              <Wrench size={18} className="text-rose-600" />
            </div>
            <span className="flex-1 text-base font-medium text-slate-700">售后待确认 1条</span>
            <ChevronRight size={18} className="text-slate-300" />
          </button>
        </div>
      </div>

      {/* ========== 6. 服务入口 ========== */}
      <div className="px-4 mb-4">
        <h3 className="text-xl font-semibold text-slate-800 mb-3">我的服务</h3>
        <div className="grid grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => goPage?.("stores")}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <Store size={20} className="text-emerald-600" />
            </div>
            <span className="text-base text-slate-600">门店</span>
          </button>
          <button
            type="button"
            onClick={() => goPage?.("courses")}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50">
              <GraduationCap size={20} className="text-violet-600" />
            </div>
            <span className="text-base text-slate-600">课程</span>
          </button>
          <button
            type="button"
            onClick={() => goPage?.("health")}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50">
              <Heart size={20} className="text-rose-600" />
            </div>
            <span className="text-base text-slate-600">大健康</span>
          </button>
          <button
            type="button"
            onClick={() => goPage?.("profile")}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <Crown size={20} className="text-amber-600" />
            </div>
            <span className="text-base text-slate-600">会员</span>
          </button>
        </div>
      </div>

      {/* ========== 7. 推荐内容 ========== */}
      <div className="px-4">
        <h3 className="text-xl font-semibold text-slate-800 mb-3">为你推荐</h3>
        <div className="flex flex-col gap-3">
          {/* 推荐商品 */}
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50">
                <ShoppingBag size={20} className="text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-slate-800">直播营养套装</p>
                <p className="text-base text-slate-400">精选营养组合，直播专享价</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => goPage?.("ai-service", { chatPrompt: "推荐商品 直播营养套装" })}
              className="text-base text-blue-600 font-medium hover:text-blue-700"
            >
              去看看
            </button>
          </div>

          {/* 推荐课程 */}
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                <GraduationCap size={20} className="text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-slate-800">直播带货实战</p>
                <p className="text-base text-slate-400">讲师：李老师</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => goPage?.("courses")}
              className="text-base text-blue-600 font-medium hover:text-blue-700"
            >
              去学习
            </button>
          </div>

          {/* 附近门店 */}
          <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <MapPin size={20} className="text-emerald-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-slate-800">星选旗舰店</p>
                <p className="text-base text-slate-400">西湖区服务中心 | 1.2km</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => goPage?.("stores")}
              className="text-base text-blue-600 font-medium hover:text-blue-700"
            >
              去逛逛
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
