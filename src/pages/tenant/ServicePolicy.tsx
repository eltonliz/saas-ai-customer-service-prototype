import { useState } from "react";
import type { PageProps } from "../../types";
import { RotateCcw, Shield } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";
import { Modal } from "../../components/Modal";

const defaultPolicies = [
  { id: "p-1", title: "7天无理由退货", scope: "全品类", status: "已启用", updatedAt: "2026-05-10", content: "用户在收到商品后7天内可申请无理由退货，商品需保持完好不影响二次销售。" },
  { id: "p-2", title: "大健康品类特殊退货", scope: "大健康", status: "已启用", updatedAt: "2026-04-28", content: "大健康品类商品拆封后不支持退货，如有质量问题可在48小时内联系客服处理。" },
  { id: "p-3", title: "课程退款规则", scope: "课程", status: "已启用", updatedAt: "2026-05-01", content: "课程购买后7天内未观看超过30%可申请全额退款，超过30%按比例退款。" },
  { id: "p-4", title: "直播商品退换规则", scope: "直播", status: "草稿", updatedAt: "2026-05-15", content: "直播专属商品支持48小时内退换，需保留直播截图和订单信息。" },
];

export default function ServicePolicy({}: PageProps) {
  const [policies, setPolicies] = useState(defaultPolicies);
  const [detailOpen, setDetailOpen] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", scope: "", content: "" });
  const pageReqs = reqs.ServicePolicy.find(r => r.badgeLabel === "policy-mgmt")?.reqs;

  const selectedPolicy = policies.find((p) => p.id === detailOpen);
  const editingPolicy = policies.find((p) => p.id === editOpen);

  function openEdit(id: string) {
    const p = policies.find((p) => p.id === id);
    if (p) setEditForm({ title: p.title, scope: p.scope, content: p.content || "" });
    setEditOpen(id);
  }

  function saveEdit() {
    setPolicies((prev) => prev.map((p) => p.id === editOpen ? { ...p, title: editForm.title, scope: editForm.scope, content: editForm.content, updatedAt: new Date().toISOString().slice(0, 10) } : p));
    setEditOpen(null);
  }

  function toggleStatus(id: string) {
    setPolicies((prev) => prev.map((p) => p.id === id ? { ...p, status: p.status === "已启用" ? "草稿" : "已启用", updatedAt: new Date().toISOString().slice(0, 10) } : p));
  }

  function createPolicy() {
    const id = `p-${Date.now()}`;
    setPolicies((prev) => [{ id, title: editForm.title || "新政策", scope: editForm.scope || "全品类", status: "草稿", updatedAt: new Date().toISOString().slice(0, 10), content: editForm.content || "" }, ...prev]);
    setCreateOpen(false);
    setEditForm({ title: "", scope: "", content: "" });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
      {pageReqs?.map((req, i) => (<RequirementBadge key={req.id} req={req} index={i} />))}
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
          <button onClick={() => { setEditForm({ title: "", scope: "", content: "" }); setCreateOpen(true); }} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 h-10">
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
            {policies.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 56 }}>
                <td className="px-5 py-3 text-base font-medium text-slate-800">{p.title}</td>
                <td className="px-5 py-3 text-base text-slate-600">{p.scope}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${p.status === "已启用" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{p.status}</span>
                </td>
                <td className="px-5 py-3 text-base text-slate-600">{p.updatedAt}</td>
                <td className="px-5 py-3">
                  <button onClick={() => openEdit(p.id)} className="text-base text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button onClick={() => setDetailOpen(p.id)} className="text-base text-slate-400 hover:text-slate-600 mr-3">详情</button>
                  <button onClick={() => toggleStatus(p.id)} className={`text-base ${p.status === "已启用" ? "text-amber-600 hover:text-amber-800" : "text-emerald-600 hover:text-emerald-800"}`}>{p.status === "已启用" ? "停用" : "启用"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!detailOpen} title="政策详情" onClose={() => setDetailOpen(null)}>
        {selectedPolicy && (
          <div className="space-y-3 text-base">
            <div><span className="text-slate-400">标题：</span><span className="font-medium">{selectedPolicy.title}</span></div>
            <div><span className="text-slate-400">适用范围：</span>{selectedPolicy.scope}</div>
            <div><span className="text-slate-400">状态：</span>{selectedPolicy.status}</div>
            <div><span className="text-slate-400">更新时间：</span>{selectedPolicy.updatedAt}</div>
            <div><span className="text-slate-400">内容：</span><p className="mt-1 text-slate-600">{selectedPolicy.content}</p></div>
          </div>
        )}
      </Modal>

      <Modal open={!!editOpen} title="编辑政策" onClose={() => setEditOpen(null)}>
        <div className="space-y-4">
          <div><label className="text-base font-medium text-slate-700">标题</label><input value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
          <div><label className="text-base font-medium text-slate-700">适用范围</label><input value={editForm.scope} onChange={(e) => setEditForm((p) => ({ ...p, scope: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
          <div><label className="text-base font-medium text-slate-700">内容</label><textarea value={editForm.content} onChange={(e) => setEditForm((p) => ({ ...p, content: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400 h-24 resize-none" /></div>
          <div className="flex justify-end gap-3"><button onClick={() => setEditOpen(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">取消</button><button onClick={saveEdit} className="rounded-lg bg-blue-600 px-4 py-2 text-white">保存</button></div>
        </div>
      </Modal>

      <Modal open={createOpen} title="新增政策" onClose={() => setCreateOpen(false)}>
        <div className="space-y-4">
          <div><label className="text-base font-medium text-slate-700">标题</label><input value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" placeholder="政策标题" /></div>
          <div><label className="text-base font-medium text-slate-700">适用范围</label><input value={editForm.scope} onChange={(e) => setEditForm((p) => ({ ...p, scope: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" placeholder="如：全品类" /></div>
          <div><label className="text-base font-medium text-slate-700">内容</label><textarea value={editForm.content} onChange={(e) => setEditForm((p) => ({ ...p, content: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400 h-24 resize-none" placeholder="政策内容" /></div>
          <div className="flex justify-end gap-3"><button onClick={() => setCreateOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">取消</button><button onClick={createPolicy} className="rounded-lg bg-blue-600 px-4 py-2 text-white">创建</button></div>
        </div>
      </Modal>
    </div>
  );
}
