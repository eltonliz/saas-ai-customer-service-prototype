import { useState } from "react";
import type { AfterSale, PageProps } from "../../types";
import { useAppStore } from "../../data/AppStore";
import { Timeline } from "../../components/Timeline";
import { StatusBadge } from "../../components/StatusBadge";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";
import { Wrench, RefreshCw, ArrowLeftRight, RotateCcw, Check } from "lucide-react";

export default function AppAfterSales({ context, goPage }: PageProps) {
  const store = useAppStore();
  const myAfterSales = store.afterSales.filter((a) => a.userId === context.currentUserId);
  const aftersaleReqs = reqs.AppAfterSales.find(r => r.badgeLabel === "aftersale-rules")?.reqs;
  const [selected, setSelected] = useState<AfterSale | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"退款申请" | "退货申请" | "换货申请">("退款申请");
  const [formReason, setFormReason] = useState("");

  function handleSubmit() {
    if (!formReason.trim()) return;
    const newId = `after-new-${Date.now()}`;
    store.addAfterSale({
      id: newId,
      orderId: "order-1",
      tenantId: context.currentTenantId,
      merchantId: context.currentMerchantId,
      userId: context.currentUserId,
      type: formType,
      status: "已提交",
      progress: ["用户提交申请", "AI说明规则", "等待商家处理"],
      result: "商家将在24小时内处理",
      records: [`用户发起${formType}`, `原因: ${formReason}`],
      needUserConfirm: false,
    });
    setShowForm(false);
    setFormReason("");
  }

  function handleConfirm(id: string) {
    store.updateAfterSale(id, { status: "已完成", needUserConfirm: false, userConfirmed: "用户认可处理结果" });
  }

  return (
    <div className="p-4 relative">
      {aftersaleReqs?.map((req, i) => (<RequirementBadge key={req.id} req={req} index={i} />))}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">售后服务</h2>
        <button type="button" onClick={() => setShowForm(true)} className="rounded-xl bg-blue-600 px-4 py-2.5 text-base font-medium text-white hover:bg-blue-700">
          新建售后
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100 mb-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">申请售后服务</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {(["退款申请", "退货申请", "换货申请"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setFormType(t)} className={`rounded-xl border px-3 py-2.5 text-base font-medium transition-colors ${formType === t ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                {t === "退款申请" && <RefreshCw size={16} className="inline mr-1" />}
                {t === "退货申请" && <ArrowLeftRight size={16} className="inline mr-1" />}
                {t === "换货申请" && <RotateCcw size={16} className="inline mr-1" />}
                {t}
              </button>
            ))}
          </div>
          <textarea value={formReason} onChange={(e) => setFormReason(e.target.value)} placeholder="请描述您的售后原因..." className="w-full rounded-xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-blue-400 mb-3" rows={4} />
          <div className="flex gap-3">
            <button type="button" onClick={handleSubmit} className="rounded-xl bg-blue-600 px-5 py-2.5 text-base font-medium text-white hover:bg-blue-700">提交申请</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-slate-200 px-5 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-50">取消</button>
          </div>
        </div>
      )}

      {selected ? (
        <div>
          <button type="button" onClick={() => setSelected(null)} className="mb-4 text-base text-blue-600 hover:text-blue-700">&larr; 返回列表</button>
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">{selected.type}</h3>
              <StatusBadge status={selected.status} />
            </div>
            <div className="mb-4">
              <p className="text-base font-medium text-slate-700 mb-3">处理进度</p>
              <Timeline items={selected.progress.map((p) => ({ time: "", title: p, state: "done" as const }))} />
            </div>
            {selected.result && <p className="text-base text-slate-600 bg-slate-50 rounded-xl p-4 mb-4">{selected.result}</p>}
            {selected.needUserConfirm && (
              <button type="button" onClick={() => handleConfirm(selected.id)} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-base font-medium text-white hover:bg-emerald-700">
                <Check size={16} />确认处理结果
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {myAfterSales.length === 0 && <p className="text-base text-slate-400 text-center py-8">暂无售后记录</p>}
          {myAfterSales.map((a) => (
            <button key={a.id} type="button" onClick={() => setSelected(a)} className="w-full rounded-2xl bg-white p-4 shadow-sm border border-slate-100 text-left transition-shadow hover:shadow-md">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {a.type === "退款申请" && <RefreshCw size={16} className="text-rose-500" />}
                  {a.type === "退货申请" && <ArrowLeftRight size={16} className="text-amber-500" />}
                  {a.type === "换货申请" && <RotateCcw size={16} className="text-blue-500" />}
                  <span className="text-base font-medium text-slate-800">{a.type}</span>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <p className="text-base text-slate-400">订单号: {a.orderId}</p>
              {a.result && <p className="text-base text-slate-500 mt-1 truncate">{a.result}</p>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
