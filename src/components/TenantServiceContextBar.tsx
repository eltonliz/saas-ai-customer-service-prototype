import { useAppStore } from "../data/AppStore";
import { tenants, merchants, stores } from "../data/mockData";
import type { BusinessLine, Channel } from "../types";
import { Building2, MapPin, Store, ChevronDown } from "lucide-react";

const businessLines: BusinessLine[] = ["直播", "商城", "门店", "课程/知识付费", "大健康"];
const channels: Channel[] = ["APP", "小程序", "H5", "商家后台", "企业微信", "公众号/微信客服"];

export function TenantServiceContextBar() {
  const store = useAppStore();
  const ctx = store.appContext;

  const tenant = tenants.find((t) => t.id === ctx.currentTenantId);
  const tenantMerchants = merchants.filter((m) => m.tenantId === ctx.currentTenantId);
  const merchant = merchants.find((m) => m.id === ctx.currentMerchantId);
  const merchantStores = stores.filter((s) => s.merchantId === ctx.currentMerchantId);
  const currentStore = stores.find((s) => s.id === ctx.currentStoreId);

  return (
    <div className="mb-4 rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-3">
      <div className="flex flex-wrap items-center gap-3 text-base text-blue-800">
        {/* Tenant — display only */}
        <div className="flex items-center gap-1.5">
          <Building2 size={14} />
          <span className="font-medium">{tenant?.name ?? "—"}</span>
        </div>
        <span className="text-blue-300">/</span>

        {/* Merchant selector */}
        <div className="flex items-center gap-1.5">
          <MapPin size={14} />
          <div className="relative">
            <select
              value={ctx.currentMerchantId}
              onChange={(e) => store.setMerchantId(e.target.value)}
              className="appearance-none rounded-md border border-blue-200 bg-white py-1 pl-2 pr-7 text-base font-medium text-blue-800 outline-none hover:border-blue-400 focus:border-blue-500 cursor-pointer"
            >
              {tenantMerchants.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1.5 text-blue-400" size={12} />
          </div>
        </div>
        <span className="text-blue-300">/</span>

        {/* Store selector */}
        <div className="flex items-center gap-1.5">
          <Store size={14} />
          <div className="relative">
            <select
              value={ctx.currentStoreId}
              onChange={(e) => store.setStoreId(e.target.value)}
              className="appearance-none rounded-md border border-blue-200 bg-white py-1 pl-2 pr-7 text-base font-medium text-blue-800 outline-none hover:border-blue-400 focus:border-blue-500 cursor-pointer"
            >
              {merchantStores.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-1.5 top-1.5 text-blue-400" size={12} />
          </div>
        </div>
        <span className="text-blue-300">/</span>

        {/* Business line selector */}
        <div className="relative">
          <select
            value={ctx.currentBusinessLine}
            onChange={(e) => store.setBusinessLine(e.target.value as BusinessLine)}
            className="appearance-none rounded-md border border-blue-200 bg-white py-1 pl-2 pr-7 text-base font-medium text-blue-800 outline-none hover:border-blue-400 focus:border-blue-500 cursor-pointer"
          >
            {businessLines.map((bl) => (
              <option key={bl} value={bl}>{bl}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1.5 top-1.5 text-blue-400" size={12} />
        </div>
        <span className="text-blue-300">/</span>

        {/* Channel selector */}
        <div className="relative">
          <select
            value={ctx.currentChannel}
            onChange={(e) => store.setChannel(e.target.value as Channel)}
            className="appearance-none rounded-md border border-blue-200 bg-white py-1 pl-2 pr-7 text-base font-medium text-blue-800 outline-none hover:border-blue-400 focus:border-blue-500 cursor-pointer"
          >
            {channels.map((ch) => (
              <option key={ch} value={ch}>{ch}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-1.5 top-1.5 text-blue-400" size={12} />
        </div>
      </div>
      <p className="mt-1.5 text-base text-blue-600">
        当前数据范围按所选上下文过滤：会话、工单、知识库、数据看板
      </p>
    </div>
  );
}
