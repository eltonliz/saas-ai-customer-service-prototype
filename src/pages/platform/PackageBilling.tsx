import { useState } from "react";
import type { PageProps } from "../../types";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { Plus, Pencil } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

interface BillingPackage {
  id: string;
  name: string;
  price: string;
  aiCalls: string;
  tokens: string;
  seats: number;
  knowledge: string;
  channels: string[];
  industries: string[];
  overage: string;
  seatLimit: number;
  tokenLimit: number;
  knowledgeCapacity: number;
  description: string;
}

const defaultPackages: BillingPackage[] = [
  {
    id: "pkg-1", name: "基础版", price: "￥999/月", aiCalls: "5万次/月", tokens: "50万/月", seats: 3, knowledge: "1000条",
    channels: ["APP","小程序"], industries: ["通用"], overage: "停用",
    seatLimit: 3, tokenLimit: 500000, knowledgeCapacity: 1000, description: "适用于小微商家，基础客服功能",
  },
  {
    id: "pkg-2", name: "专业版", price: "￥2,999/月", aiCalls: "15万次/月", tokens: "120万/月", seats: 15, knowledge: "5000条",
    channels: ["APP","小程序","H5","企业微信"], industries: ["直播","商城"], overage: "超额降级",
    seatLimit: 15, tokenLimit: 1200000, knowledgeCapacity: 5000, description: "适用于中型商家，完善的客服和售后",
  },
  {
    id: "pkg-3", name: "行业版", price: "￥4,999/月", aiCalls: "30万次/月", tokens: "200万/月", seats: 25, knowledge: "10000条",
    channels: ["APP","小程序","H5","商家后台","企业微信"], industries: ["门店","直播","商城"], overage: "超额计费",
    seatLimit: 25, tokenLimit: 2000000, knowledgeCapacity: 10000, description: "适用于大型商家，全渠道覆盖",
  },
  {
    id: "pkg-4", name: "旗舰版", price: "￥8,999/月", aiCalls: "50万次/月", tokens: "500万/月", seats: 50, knowledge: "20000条",
    channels: ["全部渠道"], industries: ["全部行业"], overage: "超额计费",
    seatLimit: 50, tokenLimit: 5000000, knowledgeCapacity: 20000, description: "适用于头部商家，不限渠道与行业",
  },
];

export default function PackageBilling({}: PageProps) {
  const [list, setList] = useState<BillingPackage[]>(defaultPackages);
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editingPkg, setEditingPkg] = useState<BillingPackage | null>(null);
  const allBadges = reqs.PackageBilling.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);
  const [form, setForm] = useState({
    name: "", price: "", seatLimit: 5, tokenLimit: 100000, knowledgeCapacity: 1000, description: "",
  });

  function handleCreate() {
    if (!form.name.trim()) return;
    setList((prev) => [
      ...prev,
      {
        id: `pkg-new-${Date.now()}`,
        name: form.name,
        price: form.price || "￥--/月",
        aiCalls: `${(form.tokenLimit / 10000).toFixed(0)}万次/月`,
        tokens: `${(form.tokenLimit / 10000).toFixed(0)}万/月`,
        seats: form.seatLimit,
        knowledge: `${form.knowledgeCapacity}条`,
        channels: ["APP"],
        industries: ["通用"],
        overage: "停用",
        seatLimit: form.seatLimit,
        tokenLimit: form.tokenLimit,
        knowledgeCapacity: form.knowledgeCapacity,
        description: form.description,
      },
    ]);
    setCreateModal(false);
    setForm({ name: "", price: "", seatLimit: 5, tokenLimit: 100000, knowledgeCapacity: 1000, description: "" });
  }

  const [editForm, setEditForm] = useState({
    name: "", price: "", seatLimit: 5, tokenLimit: 100000, knowledgeCapacity: 1000, description: "",
  });

  function handleEdit() {
    if (!editingPkg || !editForm.name.trim()) return;
    setList((prev) =>
      prev.map((p) =>
        p.id === editingPkg.id
          ? {
              ...p,
              name: editForm.name,
              price: editForm.price || p.price,
              seats: editForm.seatLimit,
              seatLimit: editForm.seatLimit,
              tokenLimit: editForm.tokenLimit,
              tokens: `${(editForm.tokenLimit / 10000).toFixed(0)}万/月`,
              knowledgeCapacity: editForm.knowledgeCapacity,
              knowledge: `${editForm.knowledgeCapacity}条`,
              description: editForm.description,
            }
          : p,
      ),
    );
    setEditModal(false);
    setEditingPkg(null);
  }

  function openEdit(pkg: BillingPackage) {
    setEditingPkg(pkg);
    setEditForm({
      name: pkg.name,
      price: pkg.price,
      seatLimit: pkg.seatLimit,
      tokenLimit: pkg.tokenLimit,
      knowledgeCapacity: pkg.knowledgeCapacity,
      description: pkg.description,
    });
    setEditModal(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
      {allBadges}
        <h2 className="text-2xl font-bold text-slate-900">套餐与计费</h2>
        <button
          type="button"
          onClick={() => setCreateModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700"
        >
          <Plus size={14} />新增套餐
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 mb-6">
        {list.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-8 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-800">{p.name}</h3>
              <button
                type="button"
                onClick={() => openEdit(p)}
                className="flex items-center gap-0.5 rounded-md border border-slate-200 px-2 py-1 text-base text-slate-500 hover:bg-slate-50"
              >
                <Pencil size={12} />编辑
              </button>
            </div>
            <p className="text-xl font-bold text-blue-600 mb-3">{p.price}</p>
            <div className="space-y-1.5 text-base text-slate-600">
              <div className="flex justify-between"><span>AI调用</span><span>{p.aiCalls}</span></div>
              <div className="flex justify-between"><span>Token额度</span><span>{p.tokens}</span></div>
              <div className="flex justify-between"><span>坐席</span><span>{p.seats}个</span></div>
              <div className="flex justify-between"><span>知识库容量</span><span>{p.knowledge}</span></div>
              <div className="flex justify-between"><span>超额策略</span><span className="text-amber-600">{p.overage}</span></div>
            </div>
            {p.description && (
              <p className="mt-2 text-base text-slate-400">{p.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <h3 className="text-base font-semibold text-slate-700 mb-3">到期提醒配置</h3>
        <div className="space-y-2 text-base text-slate-500">
          <p>· 到期前30天发送续费提醒</p>
          <p>· 到期前7天发送续费提醒</p>
          <p>· 到期后7天未续费自动停用</p>
          <p>· 超额使用后降级或按量计费</p>
        </div>
      </div>

      {/* Create Modal */}
      <Modal open={createModal} title="新增套餐" onClose={() => setCreateModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">套餐名称</label>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="输入套餐名称"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">价格</label>
            <input
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              placeholder="如：￥1,999/月"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-base font-medium text-slate-500 mb-1">坐席数</label>
              <input
                type="number"
                value={form.seatLimit}
                onChange={(e) => setForm((f) => ({ ...f, seatLimit: +e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-500 mb-1">Token上限</label>
              <input
                type="number"
                value={form.tokenLimit}
                onChange={(e) => setForm((f) => ({ ...f, tokenLimit: +e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">知识库容量（条）</label>
            <input
              type="number"
              value={form.knowledgeCapacity}
              onChange={(e) => setForm((f) => ({ ...f, knowledgeCapacity: +e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">描述</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="输入套餐描述..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
              rows={2}
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
      <Modal open={editModal} title="编辑套餐" onClose={() => setEditModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">套餐名称</label>
            <input
              value={editForm.name}
              onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="输入套餐名称"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">价格</label>
            <input
              value={editForm.price}
              onChange={(e) => setEditForm((f) => ({ ...f, price: e.target.value }))}
              placeholder="如：￥1,999/月"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-base font-medium text-slate-500 mb-1">坐席数</label>
              <input
                type="number"
                value={editForm.seatLimit}
                onChange={(e) => setEditForm((f) => ({ ...f, seatLimit: +e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-500 mb-1">Token上限</label>
              <input
                type="number"
                value={editForm.tokenLimit}
                onChange={(e) => setEditForm((f) => ({ ...f, tokenLimit: +e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">知识库容量（条）</label>
            <input
              type="number"
              value={editForm.knowledgeCapacity}
              onChange={(e) => setEditForm((f) => ({ ...f, knowledgeCapacity: +e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">描述</label>
            <textarea
              value={editForm.description}
              onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="输入套餐描述..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
              rows={2}
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
    </div>
  );
}
