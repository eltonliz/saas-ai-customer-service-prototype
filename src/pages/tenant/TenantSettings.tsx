import { useState } from "react";
import type { PageProps, Channel } from "../../types";
import { tenants } from "../../data/mockData";
import { Modal } from "../../components/Modal";
import { Settings, Shield, Zap, Key, FileText, Edit3 } from "lucide-react";

const allChannels: Channel[] = ["APP", "小程序", "H5", "商家后台", "企业微信", "公众号/微信客服"];

export default function TenantSettings({ context }: PageProps) {
  const initialTenant = tenants.find((t) => t.id === context.currentTenantId);
  const [tenant, setTenant] = useState(initialTenant);

  const [editModal, setEditModal] = useState<"basic" | "channels" | "roles" | null>(null);
  const [editForm, setEditForm] = useState({ name: "", industry: "" });
  const [editChannels, setEditChannels] = useState<Channel[]>([]);
  const [editRoles, setEditRoles] = useState<{ role: string; desc: string }[]>([]);

  const defaultRoles = [
    { role: "租户管理员", desc: "完全访问" },
    { role: "客服主管", desc: "管理客服、查看数据" },
    { role: "客服人员", desc: "工作台、会话、工单" },
    { role: "门店人员", desc: "本门店会话、核销" },
  ];

  function openBasicEdit() {
    if (!tenant) return;
    setEditForm({ name: tenant.name, industry: tenant.industry });
    setEditModal("basic");
  }

  function openChannelsEdit() {
    if (!tenant) return;
    setEditChannels([...tenant.channels]);
    setEditModal("channels");
  }

  function openRolesEdit() {
    setEditRoles([...defaultRoles]);
    setEditModal("roles");
  }

  function handleBasicSave() {
    if (!editForm.name.trim() || !tenant) return;
    setTenant({ ...tenant, name: editForm.name.trim(), industry: editForm.industry });
    setEditModal(null);
  }

  function handleChannelsSave() {
    if (!tenant) return;
    setTenant({ ...tenant, channels: editChannels });
    setEditModal(null);
  }

  function handleRolesSave() {
    setEditModal(null);
  }

  function toggleChannel(ch: Channel) {
    setEditChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch],
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">租户设置</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-700 flex items-center gap-2"><Settings size={16} className="text-blue-500" />基础信息</h3>
            <button type="button" onClick={openBasicEdit} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-base font-medium text-slate-600 hover:bg-slate-50">
              <Edit3 size={12} />编辑
            </button>
          </div>
          <div className="space-y-3 text-base">
            <div className="flex justify-between"><span className="text-slate-500">租户名称</span><span className="font-medium">{tenant?.name}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">行业</span><span>{tenant?.industry}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">状态</span><span className="text-emerald-600">{tenant?.status}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">到期时间</span><span>{tenant?.expiresAt}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">套餐版本</span><span className="font-medium text-blue-600">{tenant?.packageName}</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2"><Zap size={16} className="text-amber-500" />套餐额度</h3>
          <div className="space-y-3 text-base">
            <div>
              <div className="flex justify-between mb-1"><span className="text-slate-500">Token额度</span><span className="text-base text-slate-400">{tenant?.tokenUsed?.toLocaleString()} / {tenant?.tokenLimit?.toLocaleString()}</span></div>
              <div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-blue-500" style={{ width: `${((tenant?.tokenUsed ?? 0) / (tenant?.tokenLimit ?? 1)) * 100}%` }} /></div>
            </div>
            <div className="flex justify-between"><span className="text-slate-500">坐席数量</span><span>{tenant?.seatLimit}个</span></div>
            <div className="flex justify-between"><span className="text-slate-500">知识库容量</span><span>{tenant?.knowledgeCapacity}条</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-700 flex items-center gap-2"><Key size={16} className="text-violet-500" />渠道配置</h3>
            <button type="button" onClick={openChannelsEdit} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-base font-medium text-slate-600 hover:bg-slate-50">
              <Edit3 size={12} />编辑
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tenant?.channels.map((c) => (
              <span key={c} className="rounded-lg bg-violet-50 px-3 py-1.5 text-base font-medium text-violet-700 border border-violet-100">{c}</span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-slate-700 flex items-center gap-2"><Shield size={16} className="text-indigo-500" />角色权限</h3>
            <button type="button" onClick={openRolesEdit} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-base font-medium text-slate-600 hover:bg-slate-50">
              <Edit3 size={12} />编辑
            </button>
          </div>
          <div className="space-y-2 text-base">
            <div className="flex justify-between"><span className="text-slate-500">租户管理员</span><span className="text-base text-slate-400">完全访问</span></div>
            <div className="flex justify-between"><span className="text-slate-500">客服主管</span><span className="text-base text-slate-400">管理客服、查看数据</span></div>
            <div className="flex justify-between"><span className="text-slate-500">客服人员</span><span className="text-base text-slate-400">工作台、会话、工单</span></div>
            <div className="flex justify-between"><span className="text-slate-500">门店人员</span><span className="text-base text-slate-400">本门店会话、核销</span></div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-8 col-span-1 lg:col-span-2">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2"><FileText size={16} className="text-slate-500" />操作日志</h3>
          <div className="text-base text-slate-500 space-y-1">
            {[
              "2026-05-17 10:12 管理员修改了机器人配置",
              "2026-05-17 09:45 客服林客服接入会话 conv-1",
              "2026-05-17 09:30 知识文档「直播活动客服手册」审核通过",
              "2026-05-16 18:20 工单 ticket-8 已关闭",
              "2026-05-16 16:10 知识缺口 gap-3 生成候选知识",
            ].map((log, i) => (
              <p key={i} className="py-1">{log}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Basic Info Edit Modal */}
      <Modal open={editModal === "basic"} title="编辑基础信息" onClose={() => setEditModal(null)} size="md">
        <div className="space-y-3">
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
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setEditModal(null)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleBasicSave} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">保存</button>
        </div>
      </Modal>

      {/* Channel Edit Modal */}
      <Modal open={editModal === "channels"} title="编辑渠道配置" onClose={() => setEditModal(null)} size="md">
        <p className="text-base text-slate-500 mb-3">选择已开通的渠道</p>
        <div className="flex flex-wrap gap-2">
          {allChannels.map((ch) => (
            <label
              key={ch}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-base cursor-pointer transition-colors ${
                editChannels.includes(ch)
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <input
                type="checkbox"
                checked={editChannels.includes(ch)}
                onChange={() => toggleChannel(ch)}
                className="rounded"
              />
              {ch}
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setEditModal(null)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleChannelsSave} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">保存</button>
        </div>
      </Modal>

      {/* Role Permissions Edit Modal */}
      <Modal open={editModal === "roles"} title="编辑角色权限" onClose={() => setEditModal(null)} size="md">
        <div className="space-y-3">
          {editRoles.map((role, idx) => (
            <div key={role.role}>
              <label className="block text-base font-medium text-slate-500 mb-1">{role.role}</label>
              <input
                value={role.desc}
                onChange={(e) => {
                  const updated = [...editRoles];
                  updated[idx] = { ...role, desc: e.target.value };
                  setEditRoles(updated);
                }}
                placeholder="权限描述"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setEditModal(null)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleRolesSave} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">保存</button>
        </div>
      </Modal>
    </div>
  );
}
