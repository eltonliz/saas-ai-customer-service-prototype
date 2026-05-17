import { useState } from "react";
import type { PageProps, RobotConfig as RobotConfigType } from "../../types";
import { robotConfigs } from "../../data/mockData";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { Bot, Plus, Power, PowerOff, MessageSquare, Play, Edit3, Eye } from "lucide-react";

export default function RobotConfig({ context }: PageProps) {
  const [robots, setRobots] = useState<RobotConfigType[]>(robotConfigs.filter((r) => r.tenantId === context.currentTenantId));
  const [modal, setModal] = useState<"new" | "test" | "edit" | "view" | null>(null);
  const [editingRobotId, setEditingRobotId] = useState<string | null>(null);
  const [viewingRobotId, setViewingRobotId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", channels: "APP", welcome: "您好！欢迎咨询。", style: "专业友好", humanRule: "AI置信度低于70%转人工", riskPolicy: "标准风控", model: "Claude Opus 4.7", promptVersion: "v2.3" });
  const [testMessages, setTestMessages] = useState<string[]>([]);
  const [testInput, setTestInput] = useState("");

  function openNewModal() {
    setEditingRobotId(null);
    setForm({ name: "", channels: "APP", welcome: "您好！欢迎咨询。", style: "专业友好", humanRule: "AI置信度低于70%转人工", riskPolicy: "标准风控", model: "Claude Opus 4.7", promptVersion: "v2.3" });
    setModal("new");
  }

  function openEditModal(robot: RobotConfigType) {
    setEditingRobotId(robot.id);
    setForm({
      name: robot.name,
      channels: robot.channels[0] || "APP",
      welcome: robot.welcome,
      style: robot.style,
      humanRule: robot.humanRule,
      riskPolicy: robot.riskPolicy,
      model: robot.model,
      promptVersion: robot.promptVersion,
    });
    setModal("edit");
  }

  function openViewModal(robotId: string) {
    setViewingRobotId(robotId);
    setModal("view");
  }

  function toggleRobot(id: string) {
    setRobots((prev) => prev.map((r) => r.id === id ? { ...r, status: r.status === "启用" ? ("停用" as const) : ("启用" as const) } : r));
  }

  function handleCreate() {
    if (!form.name.trim()) return;
    const newRobot: RobotConfigType = {
      id: `robot-new-${Date.now()}`,
      tenantId: context.currentTenantId,
      name: form.name,
      status: "停用",
      channels: [form.channels as RobotConfigType["channels"][number]],
      knowledgeBases: ["通用知识库"],
      welcome: form.welcome,
      style: form.style,
      humanRule: form.humanRule,
      riskPolicy: form.riskPolicy,
      model: form.model,
      promptVersion: form.promptVersion,
    };
    setRobots((prev) => [...prev, newRobot]);
    setModal(null);
  }

  function handleEdit() {
    if (!form.name.trim() || !editingRobotId) return;
    setRobots((prev) => prev.map((r) => r.id === editingRobotId ? {
      ...r,
      name: form.name,
      channels: [form.channels as RobotConfigType["channels"][number]],
      welcome: form.welcome,
      style: form.style,
      humanRule: form.humanRule,
      riskPolicy: form.riskPolicy,
      model: form.model,
      promptVersion: form.promptVersion,
    } : r));
    setEditingRobotId(null);
    setModal(null);
  }

  function handleTest() {
    setTestMessages([]);
    setModal("test");
  }

  function sendTestMsg() {
    if (!testInput.trim()) return;
    setTestMessages((prev) => [...prev, `用户: ${testInput.trim()}`]);
    const input = testInput.trim();
    setTestInput("");
    setTimeout(() => {
      setTestMessages((prev) => [...prev, `AI客服: 您好！关于"${input}"的问题，我正在为您查询。当前为测试模式，机器人将按配置的知识库和模型参数回答。`]);
    }, 800);
  }

  const viewingRobot = viewingRobotId ? robots.find((r) => r.id === viewingRobotId) : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">AI机器人配置</h2>
        <button type="button" onClick={openNewModal} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700"><Plus size={14} />新增机器人</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {robots.map((r) => (
          <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-8">
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={() => openViewModal(r.id)} className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                <Bot size={18} className="text-blue-500" />
                <h3 className="text-base font-semibold text-slate-800">{r.name}</h3>
              </button>
              <StatusBadge status={r.status} />
            </div>
            <div className="space-y-2 text-base text-slate-600">
              <div className="flex justify-between"><span>绑定渠道</span><span>{r.channels.join("、")}</span></div>
              <div className="flex justify-between"><span>知识库</span><span>{r.knowledgeBases.join("、")}</span></div>
              <div className="flex justify-between"><span>欢迎语</span><span className="text-slate-400 truncate max-w-[200px]">{r.welcome}</span></div>
              <div className="flex justify-between"><span>回答风格</span><span>{r.style}</span></div>
              <div className="flex justify-between"><span>转人工规则</span><span className="text-slate-400">{r.humanRule}</span></div>
              <div className="flex justify-between"><span>风控策略</span><span>{r.riskPolicy}</span></div>
              <div className="flex justify-between"><span>模型</span><span>{r.model}</span></div>
              <div className="flex justify-between"><span>Prompt版本</span><span>{r.promptVersion}</span></div>
            </div>
            <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100">
              <button type="button" onClick={() => toggleRobot(r.id)} className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-base font-medium ${
                r.status === "启用" ? "border border-red-200 bg-red-50 text-red-600" : "border border-emerald-200 bg-emerald-50 text-emerald-600"
              }`}>
                {r.status === "启用" ? <><PowerOff size={12} />停用</> : <><Power size={12} />启用</>}
              </button>
              <button type="button" onClick={handleTest} className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-base font-medium text-blue-600"><Play size={12} />测试</button>
              <button type="button" onClick={() => openEditModal(r)} className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-base font-medium text-amber-600"><Edit3 size={12} />编辑</button>
              <button type="button" onClick={() => openViewModal(r.id)} className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-base font-medium text-slate-600"><Eye size={12} />详情</button>
            </div>
          </div>
        ))}
      </div>

      {/* New Robot Modal */}
      <Modal open={modal === "new"} title="新增机器人" onClose={() => setModal(null)} size="lg">
        <div className="grid grid-cols-2 gap-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">机器人名称</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="输入名称" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">绑定渠道</label>
            <select value={form.channels} onChange={(e) => setForm((f) => ({ ...f, channels: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none">
              {["APP","小程序","H5","商家后台","企业微信","公众号/微信客服"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-base font-medium text-slate-500 mb-1">欢迎语</label>
            <input value={form.welcome} onChange={(e) => setForm((f) => ({ ...f, welcome: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none" />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">回答风格</label>
            <select value={form.style} onChange={(e) => setForm((f) => ({ ...f, style: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none">
              {["专业友好","简洁高效","亲切温和","专业严谨"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">模型</label>
            <select value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none">
              {["Claude Opus 4.7","Claude Sonnet 4.6"].map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setModal(null)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleCreate} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">创建</button>
        </div>
      </Modal>

      {/* Edit Robot Modal */}
      <Modal open={modal === "edit"} title="编辑机器人" onClose={() => { setModal(null); setEditingRobotId(null); }} size="lg">
        <div className="grid grid-cols-2 gap-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">机器人名称</label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="输入名称" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">绑定渠道</label>
            <select value={form.channels} onChange={(e) => setForm((f) => ({ ...f, channels: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none">
              {["APP","小程序","H5","商家后台","企业微信","公众号/微信客服"].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-base font-medium text-slate-500 mb-1">欢迎语</label>
            <input value={form.welcome} onChange={(e) => setForm((f) => ({ ...f, welcome: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none" />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">回答风格</label>
            <select value={form.style} onChange={(e) => setForm((f) => ({ ...f, style: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none">
              {["专业友好","简洁高效","亲切温和","专业严谨"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">模型</label>
            <select value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none">
              {["Claude Opus 4.7","Claude Sonnet 4.6"].map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => { setModal(null); setEditingRobotId(null); }} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleEdit} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">保存</button>
        </div>
      </Modal>

      {/* View Detail Modal */}
      <Modal open={modal === "view"} title="机器人详情" onClose={() => { setModal(null); setViewingRobotId(null); }} size="lg">
        {viewingRobot && (
          <div className="space-y-3 text-base">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-slate-400">机器人名称</span><p className="font-medium text-slate-800">{viewingRobot.name}</p></div>
              <div><span className="text-slate-400">状态</span><StatusBadge status={viewingRobot.status} /></div>
              <div><span className="text-slate-400">绑定渠道</span><p>{viewingRobot.channels.join("、")}</p></div>
              <div><span className="text-slate-400">知识库</span><p>{viewingRobot.knowledgeBases.join("、")}</p></div>
              <div className="col-span-2"><span className="text-slate-400">欢迎语</span><p>{viewingRobot.welcome}</p></div>
              <div><span className="text-slate-400">回答风格</span><p>{viewingRobot.style}</p></div>
              <div><span className="text-slate-400">转人工规则</span><p>{viewingRobot.humanRule}</p></div>
              <div><span className="text-slate-400">风控策略</span><p>{viewingRobot.riskPolicy}</p></div>
              <div><span className="text-slate-400">模型</span><p>{viewingRobot.model}</p></div>
              <div><span className="text-slate-400">Prompt版本</span><p>{viewingRobot.promptVersion}</p></div>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => { setModal(null); setViewingRobotId(null); }} className="rounded-lg border px-4 py-2 text-base">关闭</button>
        </div>
      </Modal>

      {/* Test Modal */}
      <Modal open={modal === "test"} title="测试机器人" onClose={() => setModal(null)} size="md">
        <div className="h-64 overflow-y-auto rounded-xl bg-slate-50 p-3 mb-3">
          {testMessages.map((m, i) => (
            <p key={i} className={`text-base mb-2 ${m.startsWith("用户:") ? "text-blue-600" : "text-slate-600"}`}>{m}</p>
          ))}
          {testMessages.length === 0 && <p className="text-base text-slate-400 text-center pt-20">输入测试消息</p>}
        </div>
        <div className="flex gap-2">
          <input value={testInput} onChange={(e) => setTestInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendTestMsg()} placeholder="输入测试问题..." className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-base outline-none" />
          <button type="button" onClick={sendTestMsg} className="rounded-xl bg-blue-600 px-4 py-2 text-base text-white">发送</button>
        </div>
      </Modal>
    </div>
  );
}
