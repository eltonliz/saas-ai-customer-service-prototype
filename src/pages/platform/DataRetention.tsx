import { useState } from "react";
import type { PageProps } from "../../types";
import { Database } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";
import { Modal } from "../../components/Modal";

const defaultPolicies = [
  { id: "dp-1", name: "会话记录保留", dataType: "会话消息", retentionDays: 180, status: "已启用", updatedAt: "2026-04-01" },
  { id: "dp-2", name: "操作日志保留", dataType: "操作日志", retentionDays: 365, status: "已启用", updatedAt: "2026-04-01" },
  { id: "dp-3", name: "向量索引保留", dataType: "向量数据", retentionDays: 0, status: "已启用", updatedAt: "2026-03-15", note: "0=永久保留" },
  { id: "dp-4", name: "用户反馈保留", dataType: "满意度评价", retentionDays: 90, status: "草稿", updatedAt: "2026-05-10" },
];

export default function DataRetention({}: PageProps) {
  const [policies, setPolicies] = useState(defaultPolicies);
  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDataType, setEditDataType] = useState("");
  const [editRetentionDays, setEditRetentionDays] = useState("");
  const allBadges = reqs.DataRetention.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);
  const editingPolicy = policies.find((p) => p.id === editOpen);

  function openEdit(id: string) {
    const p = policies.find((p) => p.id === id);
    if (p) {
      setEditName(p.name);
      setEditDataType(p.dataType);
      setEditRetentionDays(String(p.retentionDays));
    }
    setEditOpen(id);
  }

  function saveEdit() {
    setPolicies((prev) => prev.map((p) => p.id === editOpen ? { ...p, name: editName, dataType: editDataType, retentionDays: Number(editRetentionDays) || 0 } : p));
    setEditOpen(null);
  }

  function toggleStatus(id: string) {
    setPolicies((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === "已启用" ? "草稿" : "已启用" } : p));
  }

  function handleCreate() {
    const newId = "dp-" + (policies.length + 1);
    setPolicies((prev) => [...prev, { id: newId, name: editName || "新策略", dataType: editDataType || "—", retentionDays: Number(editRetentionDays) || 0, status: "草稿", updatedAt: new Date().toISOString().slice(0, 10) }]);
    setCreateOpen(false);
    setEditName("");
    setEditDataType("");
    setEditRetentionDays("");
  }

  function openCreate() {
    setEditName("");
    setEditDataType("");
    setEditRetentionDays("");
    setCreateOpen(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
      {allBadges}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50">
            <Database size={20} className="text-teal-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">数据保留策略</h2>
            <p className="text-base text-slate-500 mt-1">管理平台各数据类型的保留周期、归档规则及合规要求</p>
          </div>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 h-10">
          + 新增策略
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">策略名称</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">数据类型</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">保留天数</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">状态</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">更新时间</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 56 }}>
                <td className="px-5 py-3 text-base font-medium text-slate-800">{p.name}</td>
                <td className="px-5 py-3 text-base text-slate-600">{p.dataType}</td>
                <td className="px-5 py-3 text-base text-slate-600">{p.retentionDays === 0 ? "永久" : `${p.retentionDays}天`}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${p.status === "已启用" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{p.status}</span>
                </td>
                <td className="px-5 py-3 text-base text-slate-600">{p.updatedAt}</td>
                <td className="px-5 py-3">
                  <button onClick={() => openEdit(p.id)} className="text-base text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button onClick={() => toggleStatus(p.id)} className={`text-base ${p.status === "已启用" ? "text-amber-600 hover:text-amber-800" : "text-emerald-600 hover:text-emerald-800"}`}>{p.status === "已启用" ? "停用" : "启用"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!editOpen} title="编辑策略" onClose={() => setEditOpen(null)}>
        {editingPolicy && (
          <div className="space-y-4">
            <div><label className="text-base font-medium text-slate-700">策略名称</label><input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div><label className="text-base font-medium text-slate-700">数据类型</label><input value={editDataType} onChange={(e) => setEditDataType(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div><label className="text-base font-medium text-slate-700">保留天数（0=永久）</label><input value={editRetentionDays} onChange={(e) => setEditRetentionDays(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div className="flex justify-end gap-3"><button onClick={() => setEditOpen(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">取消</button><button onClick={saveEdit} className="rounded-lg bg-blue-600 px-4 py-2 text-white">保存</button></div>
          </div>
        )}
      </Modal>

      <Modal open={createOpen} title="新增策略" onClose={() => setCreateOpen(false)}>
        <div className="space-y-4">
          <div><label className="text-base font-medium text-slate-700">策略名称</label><input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
          <div><label className="text-base font-medium text-slate-700">数据类型</label><input value={editDataType} onChange={(e) => setEditDataType(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
          <div><label className="text-base font-medium text-slate-700">保留天数（0=永久）</label><input value={editRetentionDays} onChange={(e) => setEditRetentionDays(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
          <div className="flex justify-end gap-3"><button onClick={() => setCreateOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">取消</button><button onClick={handleCreate} className="rounded-lg bg-blue-600 px-4 py-2 text-white">创建</button></div>
        </div>
      </Modal>
    </div>
  );
}
