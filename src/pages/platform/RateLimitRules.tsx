import type { PageProps } from "../../types";
import { Gauge } from "lucide-react";
import { useState } from "react";

const mockRules = [
  { id: "rl-1", name: "API全局限流", scope: "全平台", limit: "2000次/分钟", burst: "200次", status: "已启用", updatedAt: "2026-05-16" },
  { id: "rl-2", name: "模型调用限流", scope: "按租户", limit: "200次/分钟", burst: "50次", status: "已启用", updatedAt: "2026-05-15" },
  { id: "rl-3", name: "知识库上传限流", scope: "按租户", limit: "50次/小时", burst: "10次", status: "已启用", updatedAt: "2026-05-14" },
  { id: "rl-4", name: "会话创建限流", scope: "按渠道", limit: "500次/分钟", burst: "100次", status: "草稿", updatedAt: "2026-05-17" },
];

export default function RateLimitRules({}: PageProps) {
  const [rules] = useState(mockRules);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50">
            <Gauge size={20} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">限流规则</h2>
            <p className="text-sm text-slate-500 mt-1">管理平台及各租户的API调用限流规则，防止过载和滥用</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 h-10">
          + 新增规则
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">规则名称</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">适用范围</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">限制额度</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">突发容量</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">状态</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 48 }}>
                <td className="px-5 py-3 text-sm font-medium text-slate-800">{r.name}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{r.scope}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{r.limit}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{r.burst}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${r.status === "已启用" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{r.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="text-sm text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  {r.status === "已启用" ? (
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
