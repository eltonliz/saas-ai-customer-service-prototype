import { useState } from "react";
import type { PageProps } from "../../types";
import { Radio } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";
import { Modal } from "../../components/Modal";

const defaultChannels = [
  { id: "pch-1", name: "APP通用渠道", type: "APP", scope: "全平台", status: "已启用", tenants: 3 },
  { id: "pch-2", name: "小程序渠道", type: "小程序", scope: "全平台", status: "已启用", tenants: 2 },
  { id: "pch-3", name: "企微渠道", type: "企微", scope: "按需开通", status: "已启用", tenants: 1 },
  { id: "pch-4", name: "抖音渠道", type: "抖音", scope: "灰度中", status: "已停用", tenants: 0 },
];

export default function PlatformChannelConfig({}: PageProps) {
  const [channels, setChannels] = useState(defaultChannels);
  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editType, setEditType] = useState("");
  const [editScope, setEditScope] = useState("");
  const pageReqs = reqs.PlatformChannelConfig.find(r => r.badgeLabel === "platform-channel")?.reqs;
  const editingChannel = channels.find((c) => c.id === editOpen);

  function openEdit(id: string) {
    const c = channels.find((ch) => ch.id === id);
    if (c) {
      setEditName(c.name);
      setEditType(c.type);
      setEditScope(c.scope);
    }
    setEditOpen(id);
  }

  function saveEdit() {
    setChannels((prev) => prev.map((c) => c.id === editOpen ? { ...c, name: editName, type: editType, scope: editScope } : c));
    setEditOpen(null);
  }

  function toggleStatus(id: string) {
    setChannels((prev) => prev.map((c) => c.id === id ? { ...c, status: c.status === "已启用" ? "已停用" : "已启用" } : c));
  }

  function openCreate() {
    setEditName("");
    setEditType("");
    setEditScope("");
    setCreateOpen(true);
  }

  function handleCreate() {
    const newId = "pch-" + (channels.length + 1);
    setChannels((prev) => [...prev, { id: newId, name: editName || "新渠道", type: editType || "—", scope: editScope || "全平台", status: "已停用", tenants: 0 }]);
    setCreateOpen(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
      {pageReqs?.map((req, i) => (<RequirementBadge key={req.id} req={req} index={i} />))}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50">
            <Radio size={20} className="text-sky-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">平台渠道配置</h2>
            <p className="text-base text-slate-500 mt-1">管理平台级渠道定义、开关分发及租户接入配置</p>
          </div>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 h-10">
          + 新增渠道
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">渠道名称</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">类型</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">分发范围</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">接入租户</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">状态</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {channels.map((ch) => (
              <tr key={ch.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 56 }}>
                <td className="px-5 py-3 text-base font-medium text-slate-800">{ch.name}</td>
                <td className="px-5 py-3 text-base text-slate-600">{ch.type}</td>
                <td className="px-5 py-3 text-base text-slate-600">{ch.scope}</td>
                <td className="px-5 py-3 text-base text-slate-600">{ch.tenants}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${ch.status === "已启用" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{ch.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => openEdit(ch.id)} className="text-base text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button onClick={() => toggleStatus(ch.id)} className={`text-base ${ch.status === "已启用" ? "text-amber-600 hover:text-amber-800" : "text-emerald-600 hover:text-emerald-800"}`}>{ch.status === "已启用" ? "停用" : "启用"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!editOpen} title="编辑渠道" onClose={() => setEditOpen(null)}>
        {editingChannel && (
          <div className="space-y-4">
            <div><label className="text-base font-medium text-slate-700">渠道名称</label><input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div><label className="text-base font-medium text-slate-700">类型</label><input value={editType} onChange={(e) => setEditType(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div><label className="text-base font-medium text-slate-700">分发范围</label><input value={editScope} onChange={(e) => setEditScope(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div className="flex justify-end gap-3"><button onClick={() => setEditOpen(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">取消</button><button onClick={saveEdit} className="rounded-lg bg-blue-600 px-4 py-2 text-white">保存</button></div>
          </div>
        )}
      </Modal>

      <Modal open={createOpen} title="新增渠道" onClose={() => setCreateOpen(false)}>
        <div className="space-y-4">
          <div><label className="text-base font-medium text-slate-700">渠道名称</label><input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
          <div><label className="text-base font-medium text-slate-700">类型</label><input value={editType} onChange={(e) => setEditType(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
          <div><label className="text-base font-medium text-slate-700">分发范围</label><input value={editScope} onChange={(e) => setEditScope(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
          <div className="flex justify-end gap-3"><button onClick={() => setCreateOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">取消</button><button onClick={handleCreate} className="rounded-lg bg-blue-600 px-4 py-2 text-white">创建</button></div>
        </div>
      </Modal>
    </div>
  );
}
