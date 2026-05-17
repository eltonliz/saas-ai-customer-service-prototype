import type { PageProps } from "../../types";
import { ScrollText } from "lucide-react";
import { useState } from "react";

const mockLogs = [
  { id: "al-1", operator: "平台管理员", action: "新增租户", target: "星选私域零售", time: "2026-05-17 14:30:00", ip: "10.0.0.1", detail: "创建租户并分配专业版套餐" },
  { id: "al-2", operator: "系统", action: "套餐自动续费", target: "租户-知养健康课堂", time: "2026-05-17 00:00:05", ip: "—", detail: "旗舰版月度续费 ¥2999" },
  { id: "al-3", operator: "安全审计员", action: "查看敏感操作", target: "租户-同城门店联盟", time: "2026-05-16 16:22:10", ip: "10.0.0.50", detail: "审计风控规则变更记录" },
  { id: "al-4", operator: "平台管理员", action: "修改限流规则", target: "全局限流-API", time: "2026-05-16 11:05:33", ip: "10.0.0.1", detail: "API调用上限从1000调整为2000/分钟" },
  { id: "al-5", operator: "系统", action: "自动降级", target: "模型路由-gpt-4o", time: "2026-05-16 09:45:18", ip: "—", detail: "主模型错误率超阈值，自动切换至备用模型" },
  { id: "al-6", operator: "运维工程师", action: "重启向量库服务", target: "Milvus-生产集群", time: "2026-05-15 22:10:00", ip: "10.0.0.99", detail: "计划内维护窗口" },
];

export default function PlatformAuditLog({}: PageProps) {
  const [logs] = useState(mockLogs);
  const [search, setSearch] = useState("");
  const filtered = logs.filter((l) => !search || l.operator.includes(search) || l.action.includes(search) || l.target.includes(search));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
            <ScrollText size={20} className="text-slate-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">审计日志</h2>
            <p className="text-sm text-slate-500 mt-1">记录平台级所有管理操作，支持按操作人、操作类型、操作对象筛选查询</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索操作人或操作类型..."
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-300 w-64"
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
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">详情</th>
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
                <td className="px-5 py-3 text-sm text-slate-600 max-w-[200px] truncate">{l.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
