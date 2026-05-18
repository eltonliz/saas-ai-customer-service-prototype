import { useState } from "react";
import type { PageProps } from "../../types";
import type { Merchant } from "../../types";
import { merchants } from "../../data/mockData";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { Plus, Pencil } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

type MerchantWithExtras = Merchant & { contact?: string; phone?: string };

export default function MerchantManagement({}: PageProps) {
  const [list, setList] = useState<MerchantWithExtras[]>(merchants);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<MerchantWithExtras | null>(null);
  const [viewingMerchant, setViewingMerchant] = useState<MerchantWithExtras | null>(null);
  const [form, setForm] = useState({ name: "", contact: "", phone: "" });
  const [editForm, setEditForm] = useState({ name: "", contact: "", phone: "" });
  const pageReqs = reqs.MerchantManagement.find(r => r.badgeLabel === "merchant-mgmt")?.reqs;

  function handleCreate() {
    if (!form.name.trim()) return;
    setList((prev) => [
      ...prev,
      {
        id: `merchant-new-${Date.now()}`,
        tenantId: "tenant-1",
        name: form.name,
        industry: "通用",
        status: "营业中",
        storeCount: 0,
        consultationCount: 0,
        ticketCount: 0,
        contact: form.contact,
        phone: form.phone,
      },
    ]);
    setCreateModal(false);
    setForm({ name: "", contact: "", phone: "" });
  }

  function handleEdit() {
    if (!editingMerchant || !editForm.name.trim()) return;
    setList((prev) =>
      prev.map((m) =>
        m.id === editingMerchant.id
          ? { ...m, name: editForm.name, contact: editForm.contact, phone: editForm.phone }
          : m,
      ),
    );
    setEditModal(false);
    setEditingMerchant(null);
  }

  function openEdit(merchant: MerchantWithExtras) {
    setEditingMerchant(merchant);
    setEditForm({
      name: merchant.name,
      contact: merchant.contact || "",
      phone: merchant.phone || "",
    });
    setEditModal(true);
  }

  function toggleStatus(id: string) {
    setList((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "营业中" ? ("暂停服务" as const) : ("营业中" as const) }
          : m,
      ),
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
      {pageReqs?.map((req, i) => (<RequirementBadge key={req.id} req={req} index={i} />))}
        <h2 className="text-2xl font-bold text-slate-900">商家管理</h2>
        <button
          type="button"
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700"
        >
          <Plus size={14} />新增商家
        </button>
      </div>
      <DataTable
        data={list}
        rowKey={(r) => r.id}
        onRowClick={(r) => {
          setViewingMerchant(r);
          setDetailModal(true);
        }}
        columns={[
          { key: "name", header: "商家名称", render: (r) => <span className="font-medium text-base">{r.name}</span> },
          { key: "tenant", header: "所属租户", render: (r) => <span className="text-base">{r.tenantId}</span> },
          { key: "industry", header: "行业类型", render: (r) => <span className="text-base">{r.industry}</span> },
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
          { key: "stores", header: "门店数量", render: (r) => <span className="text-base">{r.storeCount}</span> },
          { key: "consults", header: "咨询量", render: (r) => <span className="text-base">{r.consultationCount}</span> },
          { key: "tickets", header: "工单量", render: (r) => <span className="text-base">{r.ticketCount}</span> },
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

      {/* Create Modal */}
      <Modal open={createModal} title="新增商家" onClose={() => setCreateModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">商家名称</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="输入商家名称"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">联系人</label>
            <input
              value={form.contact}
              onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
              placeholder="输入联系人"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">联系电话</label>
            <input
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="输入联系电话"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
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
      <Modal open={editModal} title="编辑商家" onClose={() => setEditModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">商家名称</label>
            <input
              value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="输入商家名称"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">联系人</label>
            <input
              value={editForm.contact}
              onChange={(e) => setEditForm((f) => ({ ...f, contact: e.target.value }))}
              placeholder="输入联系人"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">联系电话</label>
            <input
              value={editForm.phone}
              onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="输入联系电话"
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
      <Modal open={detailModal} title="商家详情" onClose={() => setDetailModal(false)} size="lg">
        {viewingMerchant && (
          <div className="space-y-4 text-base">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-base text-slate-400">商家名称</span>
                <p className="font-medium text-slate-900">{viewingMerchant.name}</p>
              </div>
              <div>
                <span className="text-base text-slate-400">所属租户</span>
                <p className="text-slate-700">{viewingMerchant.tenantId}</p>
              </div>
              <div>
                <span className="text-base text-slate-400">行业类型</span>
                <p className="text-slate-700">{viewingMerchant.industry}</p>
              </div>
              <div>
                <span className="text-base text-slate-400">状态</span>
                <div className="mt-0.5">
                  <StatusBadge status={viewingMerchant.status} />
                </div>
              </div>
              <div>
                <span className="text-base text-slate-400">门店数量</span>
                <p className="text-slate-700">{viewingMerchant.storeCount}</p>
              </div>
              <div>
                <span className="text-base text-slate-400">咨询量</span>
                <p className="text-slate-700">{viewingMerchant.consultationCount}</p>
              </div>
              <div>
                <span className="text-base text-slate-400">工单量</span>
                <p className="text-slate-700">{viewingMerchant.ticketCount}</p>
              </div>
              <div>
                <span className="text-base text-slate-400">联系人</span>
                <p className="text-slate-700">{viewingMerchant.contact || "-"}</p>
              </div>
              <div>
                <span className="text-base text-slate-400">联系电话</span>
                <p className="text-slate-700">{viewingMerchant.phone || "-"}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
