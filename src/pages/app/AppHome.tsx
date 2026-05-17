import type { PageProps } from "../../types";
import {
  MessageCircle,
  Package,
  Wrench,
  Store,
  GraduationCap,
  Heart,
  MapPin,
  ShoppingBag,
  Crown,
  User,
} from "lucide-react";

export default function AppHome({ goPage }: PageProps) {
  return (
    <div className="p-4">

      {/* ========== 1. 用户问候卡片 ========== */}
      <div className="mb-5 flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <User size={24} className="text-blue-600" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-slate-800">用户1</span>
            <span className="rounded-full bg-amber-50 px-2 py-0.5 text-sm text-amber-600">
              黄金会员
            </span>
          </div>
          <span className="text-sm text-slate-400">2张优惠券 · 128积分</span>
        </div>
      </div>

      {/* ========== 2. Banner 区域 ========== */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-rose-500 to-orange-400 p-4 text-white">
          <p className="text-sm font-semibold">直播专场</p>
          <p className="mt-1 text-sm">爆款好物限时抢</p>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 p-4 text-white">
          <p className="text-sm font-semibold">今日权益</p>
          <p className="mt-1 text-sm">会员专属福利</p>
        </div>
      </div>

      {/* ========== 3. AI客服快捷入口 ========== */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => goPage?.("ai-service")}
          className="flex items-center gap-3 rounded-2xl bg-blue-50 p-4 text-left hover:bg-blue-100 transition-colors"
        >
          <MessageCircle size={20} className="text-blue-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-800">智能客服</p>
            <p className="text-sm text-slate-400">随时为您解答</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => goPage?.("orders")}
          className="flex items-center gap-3 rounded-2xl bg-indigo-50 p-4 text-left hover:bg-indigo-100 transition-colors"
        >
          <Package size={20} className="text-indigo-600 shrink-0" />
          <div>
            <p className="text-sm font-medium text-slate-800">订单查询</p>
            <p className="text-sm text-slate-400">跟踪物流状态</p>
          </div>
        </button>
      </div>

      {/* ========== 4. 订单/售后提醒 ========== */}
      <div className="mb-5">
        <h3 className="mb-3 text-base font-semibold text-slate-800">订单动态</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => goPage?.("orders")}
            className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-left text-sm text-slate-700 hover:bg-amber-100 transition-colors"
          >
            1个订单运输中
          </button>
          <button
            type="button"
            onClick={() => goPage?.("after-sales")}
            className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-left text-sm text-slate-700 hover:bg-rose-100 transition-colors"
          >
            售后待确认 1条
          </button>
        </div>
      </div>

      {/* ========== 5. 服务入口 ========== */}
      <div className="mb-5">
        <h3 className="mb-3 text-base font-semibold text-slate-800">服务入口</h3>
        <div className="grid grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => goPage?.("stores")}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
              <Store size={20} className="text-emerald-600" />
            </div>
            <span className="text-sm text-slate-600">门店服务</span>
          </button>
          <button
            type="button"
            onClick={() => goPage?.("courses")}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50">
              <GraduationCap size={20} className="text-violet-600" />
            </div>
            <span className="text-sm text-slate-600">课程中心</span>
          </button>
          <button
            type="button"
            onClick={() => goPage?.("health")}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50">
              <Heart size={20} className="text-rose-600" />
            </div>
            <span className="text-sm text-slate-600">大健康</span>
          </button>
          <button
            type="button"
            onClick={() => goPage?.("profile")}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
              <Crown size={20} className="text-amber-600" />
            </div>
            <span className="text-sm text-slate-600">会员中心</span>
          </button>
        </div>
      </div>

      {/* ========== 6. 推荐内容 ========== */}
      <div>
        <h3 className="mb-3 text-base font-semibold text-slate-800">为您推荐</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
              <ShoppingBag size={20} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">推荐商品</p>
              <p className="text-sm text-slate-400">基于您的浏览历史精选</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <MapPin size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">附近门店</p>
              <p className="text-sm text-slate-400">查看距离您最近的门店</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
