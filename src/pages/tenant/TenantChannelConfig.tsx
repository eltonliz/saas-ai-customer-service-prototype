import { useState } from "react";
import type { PageProps } from "../../types";
import { Smartphone } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";
import { Modal } from "../../components/Modal";

const defaultChannels = [
  { id: "ch-1", name: "APP渠道", type: "APP", status: "已启用", dailySessions: 3200, conversionRate: "12.5%", description: "APP端客户服务入口，支持图文消息和订单查询" },
  { id: "ch-2", name: "小程序渠道", type: "小程序", status: "已启用", dailySessions: 2100, conversionRate: "9.8%", description: "微信小程序内嵌客服入口" },
  { id: "ch-3", name: "企业微信渠道", type: "企微", status: "已启用", dailySessions: 850, conversionRate: "18.2%", description: "企业微信侧边栏客服入口" },
  { id: "ch-4", name: "抖音渠道", type: "抖音", status: "配置中", dailySessions: 0, conversionRate: "—", description: "抖音小程序客服入口，需配置抖音开放平台参数" },
];

export default function TenantChannelConfig({}: PageProps) {
  const [channels, setChannels] = useState(defaultChannels);
  const [detailOpen, setDetailOpen] = useState<string | null>(null);
  const allBadges = reqs.TenantChannelConfig.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);
  const selected = channels.find((c) => c.id === detailOpen);

  function toggleStatus(id: string) {
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === "已启用" ? "配置中" : "已启用" } : c));
  }

  return (
    <div className="channel-config-page">
      <div className="flex items-center justify-between mb-6">
      {allBadges}
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
                  <button onClick={() => setDetailOpen(ch.id)} className="text-base text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button onClick={() => toggleStatus(ch.id)} className={`text-base ${ch.status === "已启用" ? "text-amber-600 hover:text-amber-800" : "text-emerald-600 hover:text-emerald-800"}`}>{ch.status === "已启用" ? "停用" : "启用"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!detailOpen} title="渠道配置" onClose={() => setDetailOpen(null)}>
        {selected && (
          <div className="space-y-3 text-base">
            <div><label className="text-base font-medium text-slate-700">渠道名称</label><input defaultValue={selected.name} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div><label className="text-base font-medium text-slate-700">类型</label><input defaultValue={selected.type} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div><label className="text-base font-medium text-slate-700">描述</label><textarea defaultValue={selected.description} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400 h-20 resize-none" /></div>
            <div className="flex justify-end gap-3"><button onClick={() => setDetailOpen(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">取消</button><button onClick={() => setDetailOpen(null)} className="rounded-lg bg-blue-600 px-4 py-2 text-white">保存</button></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
