import { useState } from "react";
import type { PageProps } from "../../types";
import type { Tenant } from "../../types";
import { tenants } from "../../data/mockData";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { Plus, Pencil } from "lucide-react";

export default function TenantManagement({}: PageProps) {
  const [list, setList] = useState(tenants);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [viewingTenant, setViewingTenant] = useState<Tenant | null>(null);
  const [form, setForm] = useState({ name: "", industry: "", packageName: "专业版" });
  const [editForm, setEditForm] = useState({ name: "", industry: "", packageName: "专业版", expiresAt: "" });

  function handleCreate() {
    if (!form.name.trim()) return;
    setList((prev) => [
      ...prev,
      {
        id: `tenant-new-${Date.now()}`,
        name: form.name,
        industry: form.industry || "通用",
        status: "启用",
        packageName: form.packageName,
        expiresAt: "2027-06-01",
        channels: ["APP"],
        tokenUsed: 0,
        tokenLimit: 1000000,
        seatLimit: 10,
        knowledgeCapacity: 3000,
      },
    ]);
    setCreateModal(false);
    setForm({ name: "", industry: "", packageName: "专业版" });
  }

  function handleEdit() {
    if (!editingTenant || !editForm.name.trim()) return;
    setList((prev) =>
      prev.map((t) =>
        t.id === editingTenant.id
          ? { ...t, name: editForm.name, industry: editForm.industry, packageName: editForm.packageName, expiresAt: editForm.expiresAt || t.expiresAt }
          : t,
      ),
    );
    setEditModal(false);
    setEditingTenant(null);
  }

  function openEdit(tenant: Tenant) {
    setEditingTenant(tenant);
    setEditForm({
      name: tenant.name,
      industry: tenant.industry,
      packageName: tenant.packageName,
      expiresAt: tenant.expiresAt,
    });
    setEditModal(true);
  }

  function toggleStatus(id: string) {
    setList((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "启用" ? ("停用" as const) : ("启用" as const) } : t,
      ),
    );
  }

  return (
    <div data-annotation-target="platform-tenant-list">
      <div className="flex items-center justify-between mb-4" data-annotation-target="platform-tenant-filters">
        <h2 className="text-2xl font-bold text-slate-900">租户管理</h2>
        <button
          type="button"
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700"
        >
          <Plus size={14} />新增租户
        </button>
      </div>
      <div data-annotation-target="platform-tenant-table">
        <DataTable
        data={list}
        rowKey={(r) => r.id}
        onRowClick={(r) => {
          setViewingTenant(r);
          setDetailModal(true);
        }}
        columns={[
          { key: "name", header: "租户名称", render: (r) => <span className="font-medium text-base">{r.name}</span> },
          { key: "industry", header: "行业", render: (r) => <span className="text-base">{r.industry}</span> },
          {
            key: "status",
            header: "状态",
            render: (r) => (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleStatus(r.id);
                }}
              >
                <StatusBadge status={r.status} />
              </button>
            ),
          },
          { key: "package", header: "套餐", render: (r) => <span className="text-base">{r.packageName}</span> },
          {
            key: "expires",
            header: "到期时间",
            render: (r) => (
              <span className={`text-base ${r.expiresAt < "2026-08-01" ? "text-red-500" : "text-slate-600"}`}>
                {r.expiresAt}
              </span>
            ),
          },
          { key: "channels", header: "已接入渠道", render: (r) => <span className="text-base">{r.channels.join("、")}</span> },
          {
            key: "token",
            header: "Token额度",
            render: (r) => (
              <span className="text-base">
                {(r.tokenUsed / 10000).toFixed(1)}万 / {(r.tokenLimit / 10000).toFixed(1)}万
              </span>
            ),
          },
          {
            key: "actions",
            header: "操作",
            render: (r) => (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openEdit(r);
                }}
                className="flex items-center gap-0.5 rounded-md border border-slate-200 px-2 py-1 text-base text-slate-500 hover:bg-slate-50"
              >
                <Pencil size={12} />编辑
              </button>
            ),
          },
        ]}
      />
      </div>

      {/* Create Modal */}
      <Modal open={createModal} title="新增租户" onClose={() => setCreateModal(false)} size="md" data-annotation-target="platform-tenant-modals">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">租户名称</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="输入租户名称"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">行业</label>
            <input
              value={form.industry}
              onChange={(e) => setForm((f) => ({ ...f, industry: e.target.value }))}
              placeholder="输入行业"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">套餐版本</label>
            <select
              value={form.packageName}
              onChange={(e) => setForm((f) => ({ ...f, packageName: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            >
              {["基础版", "专业版", "行业版", "旗舰版"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setCreateModal(false)} className="rounded-lg border px-4 py-2 text-base">
            取消
          </button>
          <button type="button" onClick={handleCreate} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">
            创建
          </button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editModal} title="编辑租户" onClose={() => setEditModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">租户名称</label>
            <input
              value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="输入租户名称"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">行业</label>
            <input
              value={editForm.industry}
              onChange={(e) => setEditForm((f) => ({ ...f, industry: e.target.value }))}
              placeholder="输入行业"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">套餐版本</label>
            <select
              value={editForm.packageName}
              onChange={(e) => setEditForm((f) => ({ ...f, packageName: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            >
              {["基础版", "专业版", "行业版", "旗舰版"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">到期时间</label>
            <input
              value={editForm.expiresAt}
              onChange={(e) => setEditForm((f) => ({ ...f, expiresAt: e.target.value }))}
              placeholder="YYYY-MM-DD"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setEditModal(false)} className="rounded-lg border px-4 py-2 text-base">
            取消
          </button>
          <button type="button" onClick={handleEdit} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">
            保存
          </button>
        </div>
      </Modal>

      {/* Detail Modal */}
      <Modal open={detailModal} title="租户详情" onClose={() => setDetailModal(false)} size="lg">
        {viewingTenant && (
          <div className="space-y-4 text-base">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-base text-slate-400">租户名称</span>
                <p className="font-medium text-slate-900">{viewingTenant.name}</p>
              </div>
              <div>
                <span className="text-base text-slate-400">行业</span>
                <p className="text-slate-700">{viewingTenant.industry}</p>
              </div>
              <div>
                <span className="text-base text-slate-400">状态</span>
                <div className="mt-0.5">
                  <StatusBadge status={viewingTenant.status} />
                </div>
              </div>
              <div>
                <span className="text-base text-slate-400">套餐</span>
                <p className="text-slate-700">{viewingTenant.packageName}</p>
              </div>
              <div>
                <span className="text-base text-slate-400">到期时间</span>
                <p className="text-slate-700">{viewingTenant.expiresAt}</p>
              </div>
              <div>
                <span className="text-base text-slate-400">坐席数</span>
                <p className="text-slate-700">{viewingTenant.seatLimit} 个</p>
              </div>
              <div>
                <span className="text-base text-slate-400">知识库容量</span>
                <p className="text-slate-700">{viewingTenant.knowledgeCapacity} 条</p>
              </div>
              <div>
                <span className="text-base text-slate-400">已接入渠道</span>
                <p className="text-slate-700">{viewingTenant.channels.length ? viewingTenant.channels.join("、") : "暂无"}</p>
              </div>
            </div>
            <div>
              <span className="text-base text-slate-400">Token使用情况</span>
              <div className="mt-2">
                <div className="flex justify-between text-base text-slate-500 mb-1">
                  <span>已用 {(viewingTenant.tokenUsed / 10000).toFixed(1)}万</span>
                  <span>上限 {(viewingTenant.tokenLimit / 10000).toFixed(1)}万</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${Math.min(100, (viewingTenant.tokenUsed / viewingTenant.tokenLimit) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
