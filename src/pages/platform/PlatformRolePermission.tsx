import { useState } from "react";
import type { PageProps } from "../../types";
import { Shield } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";
import { Modal } from "../../components/Modal";

const defaultRoles = [
  { id: "pr-1", name: "平台超级管理员", members: 2, permissions: "全部平台权限", status: "已启用", membersList: ["admin@example.com", "super@example.com"] },
  { id: "pr-2", name: "平台运营", members: 3, permissions: "客户资产管理、AI能力查看", status: "已启用", membersList: ["ops1@example.com", "ops2@example.com", "ops3@example.com"] },
  { id: "pr-3", name: "平台安全审计", members: 1, permissions: "审计日志、风控与评测", status: "已启用", membersList: ["audit@example.com"] },
  { id: "pr-4", name: "平台运维", members: 2, permissions: "运维监控、限流、数据保留", status: "已启用", membersList: ["devops1@example.com", "devops2@example.com"] },
  { id: "pr-5", name: "平台客服主管", members: 1, permissions: "平台客服工作台", status: "已停用", membersList: ["platform-svc@example.com"] },
];

export default function PlatformRolePermission({}: PageProps) {
  const [roles, setRoles] = useState(defaultRoles);
  const [editOpen, setEditOpen] = useState<string | null>(null);
  const [membersOpen, setMembersOpen] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPermissions, setEditPermissions] = useState("");
  const allBadges = reqs.PlatformRolePermission.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);
  const editingRole = roles.find((r) => r.id === editOpen);
  const viewingRole = roles.find((r) => r.id === membersOpen);

  function openEdit(id: string) {
    const r = roles.find((role) => role.id === id);
    if (r) {
      setEditName(r.name);
      setEditPermissions(r.permissions);
    }
    setEditOpen(id);
  }

  function saveEdit() {
    setRoles((prev) => prev.map((r) => r.id === editOpen ? { ...r, name: editName, permissions: editPermissions } : r));
    setEditOpen(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
      {allBadges}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50">
            <Shield size={20} className="text-indigo-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">平台角色权限</h2>
            <p className="text-base text-slate-500 mt-1">管理平台级角色定义、成员分配及跨租户功能权限矩阵</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 h-10">
          + 新增角色
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">角色名称</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">成员数</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">权限范围</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">状态</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => (
              <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 56 }}>
                <td className="px-5 py-3 text-base font-medium text-slate-800">{r.name}</td>
                <td className="px-5 py-3 text-base text-slate-600">{r.members}</td>
                <td className="px-5 py-3 text-base text-slate-600">{r.permissions}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${r.status === "已启用" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{r.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => openEdit(r.id)} className="text-base text-blue-600 hover:text-blue-800 mr-3">编辑权限</button>
                  <button onClick={() => setMembersOpen(r.id)} className="text-base text-slate-400 hover:text-slate-600">查看成员</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!editOpen} title="编辑权限" onClose={() => setEditOpen(null)}>
        {editingRole && (
          <div className="space-y-4">
            <div><label className="text-base font-medium text-slate-700">角色名称</label><input value={editName} onChange={(e) => setEditName(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div><label className="text-base font-medium text-slate-700">权限范围（用逗号分隔）</label><textarea value={editPermissions} onChange={(e) => setEditPermissions(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400 h-24 resize-none" /></div>
            <div className="flex justify-end gap-3"><button onClick={() => setEditOpen(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">取消</button><button onClick={saveEdit} className="rounded-lg bg-blue-600 px-4 py-2 text-white">保存</button></div>
          </div>
        )}
      </Modal>

      <Modal open={!!membersOpen} title="成员列表" onClose={() => setMembersOpen(null)}>
        {viewingRole && (
          <div className="space-y-2 text-base">
            <p className="text-slate-500 mb-2">角色：<span className="font-medium text-slate-800">{viewingRole.name}</span>（共 {viewingRole.members} 人）</p>
            {viewingRole.membersList.map((m, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-slate-600">{m}</div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}
