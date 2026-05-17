import type { PageProps } from "../../types";
import { Smartphone } from "lucide-react";
import { useState } from "react";

const mockChannels = [
  { id: "ch-1", name: "APP渠道", type: "APP", status: "已启用", dailySessions: 3200, conversionRate: "12.5%" },
  { id: "ch-2", name: "小程序渠道", type: "小程序", status: "已启用", dailySessions: 2100, conversionRate: "9.8%" },
  { id: "ch-3", name: "企业微信渠道", type: "企微", status: "已启用", dailySessions: 850, conversionRate: "18.2%" },
  { id: "ch-4", name: "抖音渠道", type: "抖音", status: "配置中", dailySessions: 0, conversionRate: "—" },
];

export default function TenantChannelConfig({}: PageProps) {
  const [channels] = useState(mockChannels);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
            <Smartphone size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">渠道配置</h2>
            <p className="text-base text-slate-500 mt-1">管理各接入渠道的参数配置、开关状态及会话分配规则</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 h-10">
          + 新增渠道
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">渠道名称</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">类型</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">状态</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">日会话量</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">转化率</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((ch) => (
              <tr key={ch.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 56 }}>
                <td className="px-5 py-3 text-base font-medium text-slate-800">{ch.name}</td>
                <td className="px-5 py-3 text-base text-slate-600">{ch.type}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${ch.status === "已启用" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{ch.status}</span>
                </td>
                <td className="px-5 py-3 text-base text-slate-600">{ch.dailySessions.toLocaleString()}</td>
                <td className="px-5 py-3 text-base text-slate-600">{ch.conversionRate}</td>
                <td className="px-5 py-3">
                  <button className="text-base text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  {ch.status === "已启用" ? (
                    <button className="text-base text-amber-600 hover:text-amber-800">停用</button>
                  ) : (
                    <button className="text-base text-emerald-600 hover:text-emerald-800">启用</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
