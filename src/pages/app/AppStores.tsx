import { useState } from "react";
import type { PageProps } from "../../types";
import { useAppStore } from "../../data/AppStore";
import { stores } from "../../data/mockData";
import { MapPin, Clock, Phone, Package, Calendar, Headphones } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

export default function AppStores({ context, goPage }: PageProps) {
  const myStores = stores.filter((s) => s.merchantId === context.currentMerchantId);
  const [selected, setSelected] = useState<string | null>(null);
  const store = selected ? myStores.find((s) => s.id === selected) : null;

  const allBadges = reqs.AppStores.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);

  return (
    <div className="p-4 relative store-page">
      {allBadges}
      <h2 className="text-2xl font-bold text-slate-900 mb-4">门店服务</h2>
      {!store ? (
        <div className="space-y-3">
          {myStores.map((s) => (
            <button key={s.id} type="button" onClick={() => setSelected(s.id)} className="w-full rounded-2xl bg-white p-4 shadow-sm border border-slate-100 text-left transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50">
                  <MapPin size={20} className="text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-800">{s.name}</h3>
                  <p className="text-base text-slate-400 mt-0.5">{s.city}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-base text-slate-500">
                <div className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-300" />{s.address}</div>
                <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-300" />{s.hours}</div>
                <div className="flex items-center gap-1.5"><Phone size={14} className="text-slate-300" />{s.phone}</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.serviceTags.map((t) => (
                  <span key={t} className="rounded-lg bg-blue-50 px-2.5 py-1 text-base text-blue-600">{t}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button type="button" onClick={() => setSelected(null)} className="mb-4 text-base text-blue-600 hover:text-blue-700">&larr; 返回列表</button>
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">{store.name}</h3>
            <div className="space-y-3 text-base text-slate-600">
              <div className="flex items-center gap-2"><MapPin size={16} className="text-slate-400" /><span>{store.address} · {store.city}</span></div>
              <div className="flex items-center gap-2"><Clock size={16} className="text-slate-400" /><span>{store.hours}</span></div>
              <div className="flex items-center gap-2"><Phone size={16} className="text-slate-400" /><span>{store.phone}</span></div>
              <div className="flex items-center gap-2"><Package size={16} className="text-slate-400" /><span>{store.inventory}</span></div>
            </div>
            <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 p-3 text-base text-amber-700">
              到店核销说明：到店时请出示订单二维码，门店工作人员扫码验证后即可核销。
            </div>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => alert("预约已提交")} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-base font-medium text-white hover:bg-emerald-700">
                <Calendar size={16} />预约到店
              </button>
              <button type="button" onClick={() => goPage?.("ai-service", { chatPrompt: `咨询门店 ${store.name}` })} className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-base font-medium text-blue-700 hover:bg-blue-100">
                <Headphones size={16} />联系门店客服
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
