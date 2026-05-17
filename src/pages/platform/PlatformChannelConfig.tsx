import type { PageProps } from "../../types";
import { Radio } from "lucide-react";
import { useState } from "react";

const mockChannels = [
  { id: "pch-1", name: "APP通用渠道", type: "APP", scope: "全平台", status: "已启用", tenants: 3 },
  { id: "pch-2", name: "小程序渠道", type: "小程序", scope: "全平台", status: "已启用", tenants: 2 },
  { id: "pch-3", name: "企微渠道", type: "企微", scope: "按需开通", status: "已启用", tenants: 1 },
  { id: "pch-4", name: "抖音渠道", type: "抖音", scope: "灰度中", status: "已停用", tenants: 0 },
];

export default function PlatformChannelConfig({}: PageProps) {
  const [channels] = useState(mockChannels);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
            <Radio size={20} className="text-sky-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">平台渠道配置</h2>
            <p className="text-sm text-slate-500 mt-1">管理平台级渠道定义、开关分发及租户接入配置</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 h-10">
          + 新增渠道
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">渠道名称</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">类型</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">分发范围</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">接入租户</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">状态</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((ch) => (
              <tr key={ch.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 48 }}>
                <td className="px-5 py-3 text-sm font-medium text-slate-800">{ch.name}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{ch.type}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{ch.scope}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{ch.tenants}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${ch.status === "已启用" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{ch.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="text-sm text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  {ch.status === "已启用" ? (
                    <button className="text-sm text-amber-600 hover:text-amber-800">停用</button>
                  ) : (
                    <button className="text-sm text-emerald-600 hover:text-emerald-800">启用</button>
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
