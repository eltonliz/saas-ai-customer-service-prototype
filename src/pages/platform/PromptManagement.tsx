import { useState } from "react";
import type { PageProps, PromptVersion } from "../../types";
import { promptVersions } from "../../data/mockData";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { Drawer } from "../../components/Drawer";
import { FileText, Play, RotateCcw, Plus, Eye, Pencil } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

export default function PromptManagement({}: PageProps) {
  const allBadges = reqs.PromptManagement.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);
  const [list, setList] = useState(promptVersions);
  const [selected, setSelected] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalNew, setModalNew] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<PromptVersion | null>(null);
  const [form, setForm] = useState({ name: "", type: "系统提示词", version: "v1.0", content: "" });
  const [editForm, setEditForm] = useState({ name: "", type: "系统提示词", version: "v1.0", content: "" });

  function handleGray(id: string) {
    setList((prev) => prev.map((p) => p.id === id ? { ...p, status: "灰度中" as const } : p));
  }

  function handleRollback(id: string) {
    setList((prev) => prev.map((p) => p.id === id ? { ...p, status: "已回滚" as const } : p));
  }

  function handleCreate() {
    if (!form.name.trim()) return;
    setList((prev) => [
      ...prev,
      {
        id: `prompt-new-${Date.now()}`,
        name: form.name,
        type: form.type as PromptVersion["type"],
        version: form.version,
        status: "已发布",
        owner: "当前用户",
        updatedAt: new Date().toISOString().slice(0, 10),
        content: form.content,
      },
    ]);
    setModalNew(false);
    setForm({ name: "", type: "系统提示词", version: "v1.0", content: "" });
  }

  function openEdit(prompt: PromptVersion) {
    setEditingPrompt(prompt);
    setEditForm({
      name: prompt.name,
      type: prompt.type,
      version: prompt.version,
      content: prompt.content || "",
    });
    setModalEdit(true);
  }

  function handleEdit() {
    if (!editingPrompt || !editForm.name.trim()) return;
    setList((prev) =>
      prev.map((p) =>
        p.id === editingPrompt.id
          ? {
              ...p,
              name: editForm.name,
              type: editForm.type as PromptVersion["type"],
              version: editForm.version,
              content: editForm.content,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : p,
      ),
    );
    setModalEdit(false);
    setEditingPrompt(null);
  }

  const detail = list.find((p) => p.id === selected);

  return (
    <div className="relative">
      {allBadges}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">全局Prompt管理</h2>
        <button
          type="button"
          onClick={() => setModalNew(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700"
        >
          <Plus size={14} />新建版本
        </button>
      </div>

      <DataTable
        data={list}
        rowKey={(r) => r.id}
        onRowClick={(p) => { setSelected(p.id); setDrawerOpen(true); }}
        columns={[
          { key: "name", header: "名称", render: (r) => <span className="font-medium text-base">{r.name}</span> },
          { key: "type", header: "类型", render: (r) => <span className="text-base">{r.type}</span> },
          { key: "version", header: "版本", render: (r) => <span className="text-base font-mono">{r.version}</span> },
          { key: "status", header: "状态", render: (r) => <StatusBadge status={r.status} /> },
          { key: "owner", header: "负责人", render: (r) => <span className="text-base">{r.owner}</span> },
          { key: "updatedAt", header: "更新时间", render: (r) => <span className="text-base">{r.updatedAt}</span> },
          {
            key: "actions",
            header: "操作",
            render: (r) => (
              <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                {r.status !== "灰度中" && r.status !== "已回滚" && (
                  <button
                    type="button"
                    onClick={() => handleGray(r.id)}
                    className="flex items-center gap-0.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-base text-amber-600 hover:bg-amber-100"
                  >
                    <Play size={12} />灰度
                  </button>
                )}
                {r.status === "灰度中" && (
                  <button
                    type="button"
                    onClick={() => handleRollback(r.id)}
                    className="flex items-center gap-0.5 rounded-md border border-red-200 bg-red-50 px-2 py-1 text-base text-red-600 hover:bg-red-100"
                  >
                    <RotateCcw size={12} />回滚
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => openEdit(r)}
                  className="flex items-center gap-0.5 rounded-md border border-slate-200 px-2 py-1 text-base text-slate-500 hover:bg-slate-50"
                >
                  <Pencil size={12} />编辑
                </button>
                <button
                  type="button"
                  onClick={() => { setSelected(r.id); setDrawerOpen(true); }}
                  className="flex items-center gap-0.5 rounded-md border border-slate-200 px-2 py-1 text-base text-slate-500 hover:bg-slate-50"
                >
                  <Eye size={12} />查看
                </button>
              </div>
            ),
          },
        ]}
      />

      <Drawer open={drawerOpen} title="Prompt详情" onClose={() => setDrawerOpen(false)}>
        {detail && (
          <div className="space-y-4 text-base">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-base text-slate-400">名称</span><p className="font-medium">{detail.name}</p></div>
              <div><span className="text-base text-slate-400">类型</span><p>{detail.type}</p></div>
              <div><span className="text-base text-slate-400">版本</span><p className="font-mono">{detail.version}</p></div>
              <div><span className="text-base text-slate-400">状态</span><StatusBadge status={detail.status} /></div>
              <div><span className="text-base text-slate-400">负责人</span><p>{detail.owner}</p></div>
              <div><span className="text-base text-slate-400">更新时间</span><p>{detail.updatedAt}</p></div>
            </div>
            <div>
              <span className="text-base text-slate-400">Prompt内容</span>
              <div className="mt-1 rounded-xl bg-slate-900 p-4 text-base text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                {detail.content ?? "暂无内容"}
              </div>
            </div>
            {detail.grayRange && (
              <div><span className="text-base text-slate-400">灰度范围</span><p className="text-amber-600">{detail.grayRange}</p></div>
            )}
          </div>
        )}
      </Drawer>

      {/* Create Modal */}
      <Modal open={modalNew} title="新建Prompt版本" onClose={() => setModalNew(false)} size="lg">
        <div className="space-y-3 text-base">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-base font-medium text-slate-500 mb-1">名称</label>
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="输入名称"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-500 mb-1">类型</label>
              <select
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
              >
                {["系统提示词","检索增强提示词","工具调用提示词","安全提示词","输出提示词"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">版本号</label>
            <input
              value={form.version}
              onChange={(e) => setForm((f) => ({ ...f, version: e.target.value }))}
              placeholder="v1.0"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">Prompt内容</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="输入Prompt内容..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none font-mono"
              rows={6}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setModalNew(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleCreate} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">创建</button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal open={modalEdit} title="编辑Prompt" onClose={() => setModalEdit(false)} size="lg">
        <div className="space-y-3 text-base">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-base font-medium text-slate-500 mb-1">名称</label>
              <input
                value={editForm.name}
                onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="输入名称"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-500 mb-1">类型</label>
              <select
                value={editForm.type}
                onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
              >
                {["系统提示词","检索增强提示词","工具调用提示词","安全提示词","输出提示词"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">版本号</label>
            <input
              value={editForm.version}
              onChange={(e) => setEditForm((f) => ({ ...f, version: e.target.value }))}
              placeholder="v1.0"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none font-mono"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">Prompt内容</label>
            <textarea
              value={editForm.content}
              onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="输入Prompt内容..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none font-mono"
              rows={10}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setModalEdit(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleEdit} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">保存</button>
        </div>
      </Modal>
    </div>
  );
}
