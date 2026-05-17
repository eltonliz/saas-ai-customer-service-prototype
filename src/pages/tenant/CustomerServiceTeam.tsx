import { useState } from "react";
import type { PageProps, AgentStatus, CustomerServiceAgent } from "../../types";
import { customerServiceAgents } from "../../data/mockData";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { Users, Clock, Calendar, Plus, Edit3, Eye } from "lucide-react";

export default function CustomerServiceTeam({ context }: PageProps) {
  const [agents, setAgents] = useState<CustomerServiceAgent[]>(customerServiceAgents.filter((a) => a.tenantId === context.currentTenantId));
  const [agentModal, setAgentModal] = useState<{ open: boolean; editingId: string | null }>({ open: false, editingId: null });
  const [scheduleModal, setScheduleModal] = useState<{ open: boolean; agent: CustomerServiceAgent | null }>({ open: false, agent: null });
  const [agentForm, setAgentForm] = useState({ name: "", skillGroups: "", serviceHours: "09:00-18:00", maxSessions: 5, schedule: "周一至周五" });

  function cycleStatus(id: string) {
    const order: AgentStatus[] = ["在线", "忙碌", "小休", "离线", "会议中"];
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const idx = order.indexOf(a.status);
        return { ...a, status: order[(idx + 1) % order.length] };
      }),
    );
  }

  function openAddModal() {
    setAgentForm({ name: "", skillGroups: "", serviceHours: "09:00-18:00", maxSessions: 5, schedule: "周一至周五" });
    setAgentModal({ open: true, editingId: null });
  }

  function openEditModal(agent: CustomerServiceAgent) {
    setAgentForm({
      name: agent.name,
      skillGroups: agent.skillGroups.join("、"),
      serviceHours: agent.serviceHours,
      maxSessions: agent.maxSessions,
      schedule: agent.schedule || "周一至周五",
    });
    setAgentModal({ open: true, editingId: agent.id });
  }

  function openScheduleModal(agent: CustomerServiceAgent) {
    setScheduleModal({ open: true, agent });
  }

  function handleAgentSave() {
    if (!agentForm.name.trim()) return;

    if (agentModal.editingId) {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === agentModal.editingId
            ? {
                ...a,
                name: agentForm.name.trim(),
                skillGroups: agentForm.skillGroups.split(/[,，、]/).map((s) => s.trim()).filter(Boolean),
                serviceHours: agentForm.serviceHours,
                maxSessions: agentForm.maxSessions,
                schedule: agentForm.schedule,
              }
            : a,
        ),
      );
    } else {
      const newAgent: CustomerServiceAgent = {
        id: `agent-new-${Date.now()}`,
        tenantId: context.currentTenantId,
        name: agentForm.name.trim(),
        status: "离线",
        skillGroups: agentForm.skillGroups.split(/[,，、]/).map((s) => s.trim()).filter(Boolean),
        maxSessions: agentForm.maxSessions,
        currentSessions: 0,
        serviceHours: agentForm.serviceHours,
        schedule: agentForm.schedule,
      };
      setAgents((prev) => [...prev, newAgent]);
    }
    setAgentModal({ open: false, editingId: null });
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">客服团队管理</h2>
        <button type="button" onClick={openAddModal} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          <Plus size={14} />新增客服
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">{agents.filter((a) => a.status === "在线").length}</p>
          <p className="text-sm text-emerald-500">在线</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-center">
          <p className="text-2xl font-bold text-amber-700">{agents.filter((a) => a.status === "忙碌" || a.status === "小休").length}</p>
          <p className="text-sm text-amber-500">忙碌/小休</p>
        </div>
        <div className="rounded-xl bg-slate-100 border border-slate-200 p-4 text-center">
          <p className="text-2xl font-bold text-slate-700">{agents.filter((a) => a.status === "离线").length}</p>
          <p className="text-sm text-slate-500">离线</p>
        </div>
      </div>

      <div className="space-y-3">
        {agents.map((a) => (
          <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                  {a.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{a.name}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span>{a.skillGroups.join("、")}</span>
                    <span>·</span>
                    <span>{a.serviceHours}</span>
                  </div>
                </div>
              </div>
              <button type="button" onClick={() => cycleStatus(a.id)}>
                <StatusBadge status={a.status} />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-slate-100 text-center">
              <div>
                <p className="text-sm text-slate-400">接待上限</p>
                <p className="text-sm font-semibold text-slate-700">{a.maxSessions}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">当前接待</p>
                <p className="text-sm font-semibold text-slate-700">{a.currentSessions}</p>
              </div>
              <div>
                <p className="text-sm text-slate-400">排班</p>
                <button type="button" onClick={() => openScheduleModal(a)} className="text-sm text-blue-600 hover:underline">{a.schedule}</button>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-100">
              <button type="button" onClick={() => openEditModal(a)} className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-600">
                <Edit3 size={12} />编辑
              </button>
              <button type="button" onClick={() => openScheduleModal(a)} className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-600">
                <Eye size={12} />查看排班
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Agent Modal */}
      <Modal
        open={agentModal.open}
        title={agentModal.editingId ? "编辑客服" : "新增客服"}
        onClose={() => setAgentModal({ open: false, editingId: null })}
        size="md"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">姓名</label>
            <input
              value={agentForm.name}
              onChange={(e) => setAgentForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="输入客服姓名"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">技能组（用逗号分隔）</label>
            <input
              value={agentForm.skillGroups}
              onChange={(e) => setAgentForm((f) => ({ ...f, skillGroups: e.target.value }))}
              placeholder="例：售前客服、售后客服"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">服务时段</label>
            <input
              value={agentForm.serviceHours}
              onChange={(e) => setAgentForm((f) => ({ ...f, serviceHours: e.target.value }))}
              placeholder="例：09:00-18:00"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">最大并发会话数</label>
            <input
              type="number"
              min={1}
              max={20}
              value={agentForm.maxSessions}
              onChange={(e) => setAgentForm((f) => ({ ...f, maxSessions: parseInt(e.target.value) || 5 }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">排班</label>
            <input
              value={agentForm.schedule}
              onChange={(e) => setAgentForm((f) => ({ ...f, schedule: e.target.value }))}
              placeholder="例：周一至周五"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setAgentModal({ open: false, editingId: null })} className="rounded-lg border px-4 py-2 text-sm">取消</button>
          <button type="button" onClick={handleAgentSave} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">保存</button>
        </div>
      </Modal>

      {/* Schedule Detail Modal */}
      <Modal
        open={scheduleModal.open}
        title="排班详情"
        onClose={() => setScheduleModal({ open: false, agent: null })}
        size="sm"
      >
        {scheduleModal.agent && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                {scheduleModal.agent.name[0]}
              </div>
              <div>
                <p className="font-semibold text-slate-800">{scheduleModal.agent.name}</p>
                <p className="text-slate-400">{scheduleModal.agent.skillGroups.join("、")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400">排班</span>
                <p className="font-medium">{scheduleModal.agent.schedule}</p>
              </div>
              <div>
                <span className="text-slate-400">服务时段</span>
                <p className="font-medium">{scheduleModal.agent.serviceHours}</p>
              </div>
              <div>
                <span className="text-slate-400">接待上限</span>
                <p className="font-medium">{scheduleModal.agent.maxSessions} 会话</p>
              </div>
              <div>
                <span className="text-slate-400">当前状态</span>
                <StatusBadge status={scheduleModal.agent.status} />
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setScheduleModal({ open: false, agent: null })} className="rounded-lg border px-4 py-2 text-sm">关闭</button>
        </div>
      </Modal>
    </div>
  );
}
