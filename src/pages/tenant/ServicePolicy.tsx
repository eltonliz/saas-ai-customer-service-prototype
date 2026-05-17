import type { PageProps } from "../../types";
import { RotateCcw, Shield } from "lucide-react";

const mockPolicies = [
  { id: "p-1", title: "7天无理由退货", scope: "全品类", status: "已启用", updatedAt: "2026-05-10" },
  { id: "p-2", title: "大健康品类特殊退货", scope: "大健康", status: "已启用", updatedAt: "2026-04-28" },
  { id: "p-3", title: "课程退款规则", scope: "课程", status: "已启用", updatedAt: "2026-05-01" },
  { id: "p-4", title: "直播商品退换规则", scope: "直播", status: "草稿", updatedAt: "2026-05-15" },
];

export default function ServicePolicy({ goPage }: PageProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50">
            <Shield size={20} className="text-amber-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">售后政策管理</h2>
            <p className="text-base text-slate-500 mt-1">配置和管理各业务线的售后、退款、退换货规则</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 h-10">
            + 新增政策
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">政策标题</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">适用范围</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">状态</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">更新时间</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {mockPolicies.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 56 }}>
                <td className="px-5 py-3 text-base font-medium text-slate-800">{p.title}</td>
                <td className="px-5 py-3 text-base text-slate-600">{p.scope}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${p.status === "已启用" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{p.status}</span>
                </td>
                <td className="px-5 py-3 text-base text-slate-600">{p.updatedAt}</td>
                <td className="px-5 py-3">
                  <button className="text-base text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button className="text-base text-slate-400 hover:text-slate-600 mr-3">详情</button>
                  {p.status === "已启用" ? (
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
