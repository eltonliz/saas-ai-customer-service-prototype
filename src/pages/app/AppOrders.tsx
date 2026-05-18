import { useState } from "react";
import type { PageProps } from "../../types";
import { orders } from "../../data/mockData";
import { StatusBadge } from "../../components/StatusBadge";
import { Timeline } from "../../components/Timeline";
import { Package, Headphones, Wrench } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

export default function AppOrders({ context, goPage }: PageProps) {
  const myOrders = orders.filter((o) => o.userId === context.currentUserId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? myOrders.find((o) => o.id === selectedId) : null;

  const allBadges = reqs.AppOrders.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);

  return (
    <div className="p-4 relative">
      {allBadges}
      <h2 className="text-2xl font-bold text-slate-900 mb-4">我的订单</h2>
      {!selected ? (
        <div className="space-y-3">
          {myOrders.map((o) => (
            <button key={o.id} type="button" onClick={() => setSelectedId(o.id)} className="w-full rounded-2xl bg-white p-4 shadow-sm border border-slate-100 text-left transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <Package size={20} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-base font-medium text-slate-800 block truncate">{o.productName}</span>
                  <p className="text-base text-slate-400 mt-0.5">{o.spec} · ￥{o.amount}</p>
                </div>
                <StatusBadge status={o.status} />
              </div>
              <p className="text-base text-slate-400">{o.createdAt}</p>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button type="button" onClick={() => setSelectedId(null)} className="mb-4 text-base text-blue-600 hover:text-blue-700">&larr; 返回列表</button>
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{selected.productName}</h3>
              <StatusBadge status={selected.status} />
            </div>
            <div className="space-y-3 text-base text-slate-600 mb-4">
              <div className="flex justify-between"><span className="text-slate-400">规格</span><span>{selected.spec}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">金额</span><span className="font-semibold text-slate-800">￥{selected.amount}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">支付方式</span><span>{selected.paymentInfo}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">收货信息</span><span className="text-base">{selected.receiverInfo}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">物流状态</span><span className="text-blue-600 font-medium">{selected.logistics}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">下单时间</span><span>{selected.createdAt}</span></div>
            </div>
            <div className="mb-4">
              <p className="text-base font-medium text-slate-700 mb-3">物流详情</p>
              <Timeline items={selected.logisticsTimeline.map((t) => ({ time: "", title: t, state: "done" as const }))} />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => goPage?.("after-sales", { afterSaleOrderId: selected.id })} className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-base font-medium text-amber-700 hover:bg-amber-100">
                <Wrench size={16} />申请售后
              </button>
              <button type="button" onClick={() => goPage?.("ai-service", { chatPrompt: `咨询订单 ${selected.id}` })} className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-base font-medium text-blue-700 hover:bg-blue-100">
                <Headphones size={16} />联系客服
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
