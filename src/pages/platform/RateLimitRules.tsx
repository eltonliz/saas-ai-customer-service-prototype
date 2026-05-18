import { useState } from "react";
import type { PageProps } from "../../types";
import { Gauge } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";
import { Modal } from "../../components/Modal";

const defaultRules = [
  { id: "rl-1", name: "API全局限流", scope: "全平台", limit: "2000次/分钟", burst: "200次", status: "已启用", updatedAt: "2026-05-16" },
  { id: "rl-2", name: "模型调用限流", scope: "按租户", limit: "200次/分钟", burst: "50次", status: "已启用", updatedAt: "2026-05-15" },
  { id: "rl-3", name: "知识库上传限流", scope: "按租户", limit: "50次/小时", burst: "10次", status: "已启用", updatedAt: "2026-05-14" },
  { id: "rl-4", name: "会话创建限流", scope: "按渠道", limit: "500次/分钟", burst: "100次", status: "草稿", updatedAt: "2026-05-17" },
];

export default function RateLimitRules({}: PageProps) {
  const [rules, setRules] = useState(defaultRules);
  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editScope, setEditScope] = useState("");
  const [editLimit, setEditLimit] = useState("");
  const [editBurst, setEditBurst] = useState("");
  const allBadges = reqs.RateLimitRules.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);
  const editingRule = rules.find((r) => r.id === editOpen);

  function openEdit(id: string) {
    const r = rules.find((rule) => rule.id === id);
    if (r) {
      setEditName(r.name);
      setEditScope(r.scope);
      setEditLimit(r.limit);
      setEditBurst(r.burst);
    }
    setEditOpen(id);
  }

  function saveEdit() {
    setRules((prev) => prev.map((r) => r.id === editOpen ? { ...r, name: editName, scope: editScope, limit: editLimit, burst: editBurst } : r));
    setEditOpen(null);
  }

  function toggleStatus(id: string) {
    setRules((prev) => prev.map((r) => r.id === id ? { ...r, status: r.status === "已启用" ? "草稿" : "已启用" } : r));
  }

  function openCreate() {
    setEditName("");
    setEditScope("");
    setEditLimit("");
    setEditBurst("");
    setCreateOpen(true);
  }

  function handleCreate() {
    const newId = "rl-" + (rules.length + 1);
    setRules((prev) => [...prev, { id: newId, name: editName || "新规则", scope: editScope || "—", limit: editLimit || "—", burst: editBurst || "—", status: "草稿", updatedAt: new Date().toISOString().slice(0, 10) }]);
    setCreateOpen(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
      {allBadges}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
            <Gauge size={20} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">限流规则</h2>
            <p className="text-base text-slate-500 mt-1">管理平台及各租户的API调用限流规则，防止过载和滥用</p>
          </div>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 h-10">
          + 新增规则
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">规则名称</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">适用范围</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">限制额度</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">突发容量</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">状态</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 56 }}>
                <td className="px-5 py-3 text-base font-medium text-slate-800">{r.name}</td>
                <td className="px-5 py-3 text-base text-slate-600">{r.scope}</td>
                <td className="px-5 py-3 text-base text-slate-600">{r.limit}</td>
                <td className="px-5 py-3 text-base text-slate-600">{r.burst}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${r.status === "已启用" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{r.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => openEdit(r.id)} className="text-base text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button onClick={() => toggleStatus(r.id)} className={`text-base ${r.status === "已启用" ? "text-amber-600 hover:text-amber-800" : "text-emerald-600 hover:text-emerald-800"}`}>{r.status === "已启用" ? "停用" : "启用"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!editOpen} title="编辑限流规则" onClose={() => setEditOpen(null)}>
        {editingRule && (
          <div className="space-y-4">
            <div><label className="text-base font-medium text-slate-700">规则名称</label><input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div><label className="text-base font-medium text-slate-700">适用范围</label><input value={editScope} onChange={(e) => setEditScope(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div><label className="text-base font-medium text-slate-700">限制额度</label><input value={editLimit} onChange={(e) => setEditLimit(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div><label className="text-base font-medium text-slate-700">突发容量</label><input value={editBurst} onChange={(e) => setEditBurst(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div className="flex justify-end gap-3"><button onClick={() => setEditOpen(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">取消</button><button onClick={saveEdit} className="rounded-lg bg-blue-600 px-4 py-2 text-white">保存</button></div>
          </div>
        )}
      </Modal>

      <Modal open={createOpen} title="新增限流规则" onClose={() => setCreateOpen(false)}>
        <div className="space-y-4">
          <div><label className="text-base font-medium text-slate-700">规则名称</label><input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
          <div><label className="text-base font-medium text-slate-700">适用范围</label><input value={editScope} onChange={(e) => setEditScope(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
          <div><label className="text-base font-medium text-slate-700">限制额度</label><input value={editLimit} onChange={(e) => setEditLimit(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
          <div><label className="text-base font-medium text-slate-700">突发容量</label><input value={editBurst} onChange={(e) => setEditBurst(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
          <div className="flex justify-end gap-3"><button onClick={() => setCreateOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">取消</button><button onClick={handleCreate} className="rounded-lg bg-blue-600 px-4 py-2 text-white">创建</button></div>
        </div>
      </Modal>
    </div>
  );
}
