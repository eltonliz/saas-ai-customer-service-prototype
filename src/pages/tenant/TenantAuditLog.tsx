import type { PageProps } from "../../types";
import { ScrollText } from "lucide-react";
import { useState } from "react";

const mockLogs = [
  { id: "log-1", operator: "客服主管-张三", action: "修改机器人配置", target: "AI客服机器人-主bot", time: "2026-05-17 14:32:10", ip: "192.168.1.100" },
  { id: "log-2", operator: "一线客服-李四", action: "结束会话", target: "会话 conv-8", time: "2026-05-17 14:28:05", ip: "192.168.1.101" },
  { id: "log-3", operator: "AI运营-王五", action: "发布知识文档", target: "商品FAQ-营养套装", time: "2026-05-17 13:15:42", ip: "192.168.1.102" },
  { id: "log-4", operator: "超级管理员", action: "修改角色权限", target: "客服主管角色", time: "2026-05-17 11:02:18", ip: "192.168.1.1" },
  { id: "log-5", operator: "质检专员-赵六", action: "质检评分", target: "会话 conv-5", time: "2026-05-17 10:45:33", ip: "192.168.1.103" },
  { id: "log-6", operator: "系统", action: "自动转人工", target: "会话 conv-12", time: "2026-05-17 09:18:27", ip: "—" },
];

export default function TenantAuditLog({}: PageProps) {
  const [logs] = useState(mockLogs);
  const [search, setSearch] = useState("");
  const filtered = logs.filter((l) => !search || l.operator.includes(search) || l.action.includes(search));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <ScrollText size={20} className="text-slate-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">操作日志</h2>
            <p className="text-sm text-slate-500 mt-1">记录租户内所有管理操作，支持按操作人、操作类型筛选查询</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索操作人或操作类型..."
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-300 w-56"
          />
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">操作人</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">操作类型</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">操作对象</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">时间</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">IP</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 48 }}>
                <td className="px-5 py-3 text-sm font-medium text-slate-800">{l.operator}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{l.action}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{l.target}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{l.time}</td>
                <td className="px-5 py-3 text-sm text-slate-500 font-mono">{l.ip}</td>
                <td className="px-5 py-3">
                  <button className="text-sm text-blue-600 hover:text-blue-800">详情</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
