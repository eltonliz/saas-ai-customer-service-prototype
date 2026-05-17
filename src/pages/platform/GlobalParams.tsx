import type { PageProps } from "../../types";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const mockParams = [
  { id: "gp-1", key: "session_timeout", value: "1800", unit: "秒", description: "会话超时自动关闭时间", status: "已启用" },
  { id: "gp-2", key: "max_ticket_per_user", value: "10", unit: "个", description: "单个用户同时打开的工单上限", status: "已启用" },
  { id: "gp-3", key: "rag_recall_topk", value: "20", unit: "条", description: "RAG粗召回默认Top-K", status: "已启用" },
  { id: "gp-4", key: "auto_close_hours", value: "72", unit: "小时", description: "AI会话无响应自动关闭时长", status: "已启用" },
  { id: "gp-5", key: "rate_limit_enabled", value: "true", unit: "—", description: "是否启用全局限流", status: "已停用" },
];

export default function GlobalParams({}: PageProps) {
  const [params] = useState(mockParams);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
            <SlidersHorizontal size={20} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">全局参数配置</h2>
            <p className="text-sm text-slate-500 mt-1">管理系统级运行时参数，修改后全平台实时生效</p>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">参数键</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">当前值</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">单位</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">描述</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">状态</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {params.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 48 }}>
                <td className="px-5 py-3 text-sm font-mono text-slate-700">{p.key}</td>
                <td className="px-5 py-3 text-sm font-medium text-slate-800">{p.value}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{p.unit}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{p.description}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${p.status === "已启用" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{p.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="text-sm text-blue-600 hover:text-blue-800">编辑</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
