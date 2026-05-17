import { useAppStore } from "../data/AppStore";
import { tenants, merchants, stores } from "../data/mockData";
import { Building2, MapPin, Store } from "lucide-react";

export function TenantServiceContextBar() {
  const ctx = useAppStore().appContext;
  const tenant = tenants.find((t) => t.id === ctx.currentTenantId);
  const merchant = merchants.find((m) => m.id === ctx.currentMerchantId);
  const store = stores.find((s) => s.id === ctx.currentStoreId);

  return (
    <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">
      <div className="flex items-center gap-2 text-sm text-blue-800">
        <Building2 size={14} />
        <span className="font-medium">{tenant?.name ?? "—"}</span>
        <span className="text-blue-400">/</span>
        <MapPin size={14} />
        <span>{merchant?.name ?? "—"}</span>
        <span className="text-blue-400">/</span>
        <Store size={14} />
        <span>{store?.name ?? "—"}</span>
      </div>
      <p className="mt-1 text-sm text-blue-600">
        当前数据范围：本租户 · 本商家 · 本门店 · 业务线：{ctx.currentBusinessLine} · 渠道：{ctx.currentChannel}
      </p>
    </div>
  );
}
