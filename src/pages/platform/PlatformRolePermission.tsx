import type { PageProps } from "../../types";
import { Shield } from "lucide-react";
import { useState } from "react";

const mockRoles = [
  { id: "pr-1", name: "平台超级管理员", members: 2, permissions: "全部平台权限", status: "已启用" },
  { id: "pr-2", name: "平台运营", members: 3, permissions: "客户资产管理、AI能力查看", status: "已启用" },
  { id: "pr-3", name: "平台安全审计", members: 1, permissions: "审计日志、风控与评测", status: "已启用" },
  { id: "pr-4", name: "平台运维", members: 2, permissions: "运维监控、限流、数据保留", status: "已启用" },
  { id: "pr-5", name: "平台客服主管", members: 1, permissions: "平台客服工作台", status: "已停用" },
];

export default function PlatformRolePermission({}: PageProps) {
  const [roles] = useState(mockRoles);
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
            <Shield size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">平台角色权限</h2>
            <p className="text-base text-slate-500 mt-1">管理平台级角色定义、成员分配及跨租户功能权限矩阵</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 h-10">
          + 新增角色
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">角色名称</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">成员数</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">权限范围</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">状态</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 56 }}>
                <td className="px-5 py-3 text-base font-medium text-slate-800">{r.name}</td>
                <td className="px-5 py-3 text-base text-slate-600">{r.members}</td>
                <td className="px-5 py-3 text-base text-slate-600">{r.permissions}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${r.status === "已启用" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{r.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="text-base text-blue-600 hover:text-blue-800 mr-3">编辑权限</button>
                  <button className="text-base text-slate-400 hover:text-slate-600">查看成员</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
