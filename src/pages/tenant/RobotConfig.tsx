import { useState } from "react";
import type { PageProps, RobotConfig as RobotConfigType, BusinessLine, Channel, OwnershipLevel } from "../../types";
import { robotConfigs } from "../../data/mockData";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { Bot, Plus, Power, PowerOff, MessageSquare, Play, Edit3, Eye, X } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

const allBusinessLines: BusinessLine[] = ["直播", "商城", "门店", "课程/知识付费", "大健康"];
const allChannels: Channel[] = ["APP", "小程序", "H5", "商家后台", "企业微信", "公众号/微信客服"];
const allTools = ["商品查询", "活动查询", "订单查询", "物流查询", "售后查询", "会员查询", "门店查询", "课程查询", "工单创建"];
const allStyles = ["专业友好", "简洁高效", "亲切温和", "专业严谨"];
const allModels = ["Claude Opus 4.7", "Claude Sonnet 4.6"];
const allOwnershipLevels: OwnershipLevel[] = ["平台", "租户", "商家", "门店"];

interface RobotForm {
  name: string;
  ownershipLevel: OwnershipLevel;
  businessLines: BusinessLine[];
  channels: Channel[];
  welcome: string;
  quickQuestions: string[];
  style: string;
  availableTools: string[];
  knowledgeBases: string[];
  maxFollowUpRounds: number;
  lowConfidenceThreshold: number;
  humanRule: string;
  riskPolicy: string;
  model: string;
  promptVersion: string;
}

function defaultForm(): RobotForm {
  return {
    name: "",
    ownershipLevel: "商家",
    businessLines: ["直播"],
    channels: ["APP"],
    welcome: "您好！欢迎咨询。",
    quickQuestions: [],
    style: "专业友好",
    availableTools: ["商品查询"],
    knowledgeBases: ["通用知识库"],
    maxFollowUpRounds: 2,
    lowConfidenceThreshold: 0.65,
    humanRule: "AI置信度低于70%转人工",
    riskPolicy: "标准风控",
    model: "Claude Opus 4.7",
    promptVersion: "v2.3",
  };
}

function robotToForm(r: RobotConfigType): RobotForm {
  return {
    name: r.name,
    ownershipLevel: r.ownershipLevel,
    businessLines: [...r.businessLines],
    channels: [...r.channels],
    welcome: r.welcome,
    quickQuestions: [...(r.quickQuestions ?? [])],
    style: r.style,
    availableTools: [...(r.availableTools ?? [])],
    knowledgeBases: [...r.knowledgeBases],
    maxFollowUpRounds: r.maxFollowUpRounds ?? 2,
    lowConfidenceThreshold: r.lowConfidenceThreshold ?? 0.65,
    humanRule: r.humanRule,
    riskPolicy: r.riskPolicy,
    model: r.model,
    promptVersion: r.promptVersion,
  };
}

function MultiSelectChips({ options, selected, onChange, label }: { options: string[]; selected: string[]; onChange: (v: string[]) => void; label: string }) {
  return (
    <div>
      <label className="block text-base font-medium text-slate-500 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => {
                if (isSelected) onChange(selected.filter((s) => s !== opt));
                else onChange([...selected, opt]);
              }}
              className={`rounded-lg px-3 py-1.5 text-base transition-colors ${
                isSelected ? "bg-blue-100 text-blue-700 border border-blue-300" : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ChipInput({ chips, onChange, label, placeholder }: { chips: string[]; onChange: (v: string[]) => void; label: string; placeholder: string }) {
  const [input, setInput] = useState("");
  return (
    <div>
      <label className="block text-base font-medium text-slate-500 mb-1.5">{label}</label>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {chips.map((c, i) => (
          <span key={i} className="inline-flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-base text-blue-700">
            {c}
            <button type="button" onClick={() => onChange(chips.filter((_, j) => j !== i))}><X size={12} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              e.preventDefault();
              if (!chips.includes(input.trim())) onChange([...chips, input.trim()]);
              setInput("");
            }
          }}
          placeholder={placeholder}
          className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
        />
        <button
          type="button"
          onClick={() => {
            if (input.trim() && !chips.includes(input.trim())) {
              onChange([...chips, input.trim()]);
              setInput("");
            }
          }}
          className="rounded-lg bg-blue-600 px-3 py-2 text-base text-white"
        >添加</button>
      </div>
    </div>
  );
}

export default function RobotConfig({ context }: PageProps) {
  const [robots, setRobots] = useState<RobotConfigType[]>(robotConfigs.filter((r) => r.tenantId === context.currentTenantId));
  const [modal, setModal] = useState<"new" | "test" | "edit" | "view" | null>(null);
  const [editingRobotId, setEditingRobotId] = useState<string | null>(null);
  const [viewingRobotId, setViewingRobotId] = useState<string | null>(null);
  const [form, setForm] = useState<RobotForm>(defaultForm());
  const [testMessages, setTestMessages] = useState<string[]>([]);
  const [testInput, setTestInput] = useState("");

  function openNewModal() {
    setEditingRobotId(null);
    setForm(defaultForm());
    setModal("new");
  }

  function openEditModal(robot: RobotConfigType) {
    setEditingRobotId(robot.id);
    setForm(robotToForm(robot));
    setModal("edit");
  }

  function openViewModal(robotId: string) {
    setViewingRobotId(robotId);
    setModal("view");
  }

  function toggleRobot(id: string) {
    setRobots((prev) => prev.map((r) => r.id === id ? { ...r, status: r.status === "启用" ? ("停用" as const) : ("启用" as const) } : r));
  }

  function buildRobot(id: string): RobotConfigType {
    return {
      id,
      tenantId: context.currentTenantId,
      name: form.name,
      status: "停用",
      ownershipLevel: form.ownershipLevel,
      businessLines: form.businessLines,
      channels: form.channels as Channel[],
      availableTools: form.availableTools,
      knowledgeBases: form.knowledgeBases,
      welcome: form.welcome,
      quickQuestions: form.quickQuestions,
      style: form.style,
      maxFollowUpRounds: form.maxFollowUpRounds,
      lowConfidenceThreshold: form.lowConfidenceThreshold,
      humanRule: form.humanRule,
      riskPolicy: form.riskPolicy,
      model: form.model,
      promptVersion: form.promptVersion,
    };
  }

  function handleCreate() {
    if (!form.name.trim()) return;
    const newRobot = buildRobot(`robot-new-${Date.now()}`);
    setRobots((prev) => [...prev, newRobot]);
    setModal(null);
  }

  function handleEdit() {
    if (!form.name.trim() || !editingRobotId) return;
    setRobots((prev) => prev.map((r) => r.id === editingRobotId ? { ...r,
      name: form.name, ownershipLevel: form.ownershipLevel, businessLines: form.businessLines,
      channels: form.channels as Channel[], availableTools: form.availableTools,
      knowledgeBases: form.knowledgeBases, welcome: form.welcome,
      quickQuestions: form.quickQuestions, style: form.style,
      maxFollowUpRounds: form.maxFollowUpRounds, lowConfidenceThreshold: form.lowConfidenceThreshold,
      humanRule: form.humanRule, riskPolicy: form.riskPolicy,
      model: form.model, promptVersion: form.promptVersion,
    } : r));
    setEditingRobotId(null);
    setModal(null);
  }

  function handleTest() { setTestMessages([]); setModal("test"); }

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

  // 共享的表单内容组件
  function RobotFormFields() {
    return (
      <div className="space-y-4 text-base">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">机器人名称 <span className="text-red-400">*</span></label>
            <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="如：直播客服、商城客服" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">归属层级 <span className="text-red-400">*</span></label>
            <select value={form.ownershipLevel} onChange={(e) => setForm((f) => ({ ...f, ownershipLevel: e.target.value as OwnershipLevel }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none">
              {allOwnershipLevels.map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
        </div>

        <MultiSelectChips options={allBusinessLines} selected={form.businessLines} onChange={(v) => setForm((f) => ({ ...f, businessLines: v as BusinessLine[] }))} label="适用业务线（多选）" />

        <MultiSelectChips options={allChannels} selected={form.channels} onChange={(v) => setForm((f) => ({ ...f, channels: v as Channel[] }))} label="适用渠道（多选）" />

        <MultiSelectChips options={allTools} selected={form.availableTools} onChange={(v) => setForm((f) => ({ ...f, availableTools: v }))} label="可调用工具（多选）" />

        <div>
          <label className="block text-base font-medium text-slate-500 mb-1">欢迎语 <span className="text-red-400">*</span></label>
          <textarea value={form.welcome} onChange={(e) => setForm((f) => ({ ...f, welcome: e.target.value }))} rows={2} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" />
        </div>

        <ChipInput chips={form.quickQuestions} onChange={(v) => setForm((f) => ({ ...f, quickQuestions: v }))} label="快捷问题（输入后按回车添加）" placeholder="如：怎么申请退款？" />

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">回答风格</label>
            <select value={form.style} onChange={(e) => setForm((f) => ({ ...f, style: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none">
              {allStyles.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">最大追问轮次</label>
            <input type="number" min={1} max={5} value={form.maxFollowUpRounds} onChange={(e) => setForm((f) => ({ ...f, maxFollowUpRounds: Number(e.target.value) }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">低置信阈值</label>
            <input type="number" min={0} max={1} step={0.05} value={form.lowConfidenceThreshold} onChange={(e) => setForm((f) => ({ ...f, lowConfidenceThreshold: Number(e.target.value) }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">模型</label>
            <select value={form.model} onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none">
              {allModels.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">Prompt版本</label>
            <input value={form.promptVersion} onChange={(e) => setForm((f) => ({ ...f, promptVersion: e.target.value }))} placeholder="如 v2.3" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" />
          </div>
        </div>

        <div>
          <label className="block text-base font-medium text-slate-500 mb-1">转人工规则</label>
          <input value={form.humanRule} onChange={(e) => setForm((f) => ({ ...f, humanRule: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" />
        </div>

        <div>
          <label className="block text-base font-medium text-slate-500 mb-1">风控策略</label>
          <select value={form.riskPolicy} onChange={(e) => setForm((f) => ({ ...f, riskPolicy: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none">
            {["标准风控策略", "大健康强化风控策略", "大健康最高级风控策略"].map((p) => <option key={p}>{p}</option>)}
          </select>
        </div>
      </div>
    );
  }

  const allBadges = reqs.RobotConfig.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);

  return (
    <div className="relative">
      {allBadges}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">AI机器人配置</h2>
        <button type="button" onClick={openNewModal} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700"><Plus size={14} />新增机器人</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {robots.map((r) => (
          <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <button type="button" onClick={() => openViewModal(r.id)} className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                <Bot size={18} className="text-blue-500" />
                <h3 className="text-base font-semibold text-slate-800">{r.name}</h3>
              </button>
              <StatusBadge status={r.status} />
            </div>
            <div className="space-y-1.5 text-base text-slate-600">
              <div className="flex justify-between"><span>归属</span><span>{r.ownershipLevel}</span></div>
              <div className="flex justify-between"><span>业务线</span><span>{r.businessLines?.join("、") ?? "-"}</span></div>
              <div className="flex justify-between"><span>渠道</span><span>{r.channels.join("、")}</span></div>
              <div className="flex justify-between"><span>可调用工具</span><span className="text-slate-400 truncate max-w-[180px]">{r.availableTools?.join("、") ?? "-"}</span></div>
              <div className="flex justify-between"><span>追问/阈值</span><span>{r.maxFollowUpRounds ?? 2}轮 / {((r.lowConfidenceThreshold ?? 0.65) * 100).toFixed(0)}%</span></div>
              <div className="flex justify-between"><span>模型</span><span>{r.model}</span></div>
              <div className="flex justify-between"><span>风控</span><span className="text-slate-400 truncate max-w-[150px]">{r.riskPolicy}</span></div>
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
        <RobotFormFields />
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={() => setModal(null)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleCreate} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">创建</button>
        </div>
      </Modal>

      {/* Edit Robot Modal */}
      <Modal open={modal === "edit"} title="编辑机器人" onClose={() => { setModal(null); setEditingRobotId(null); }} size="lg">
        <RobotFormFields />
        <div className="flex justify-end gap-3 mt-6">
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
              <div><span className="text-slate-400">归属层级</span><p>{viewingRobot.ownershipLevel}</p></div>
              <div><span className="text-slate-400">业务线</span><p>{viewingRobot.businessLines?.join("、") ?? "-"}</p></div>
              <div><span className="text-slate-400">适用渠道</span><p>{viewingRobot.channels.join("、")}</p></div>
              <div><span className="text-slate-400">可调用工具</span><p>{viewingRobot.availableTools?.join("、") ?? "-"}</p></div>
              <div className="col-span-2"><span className="text-slate-400">欢迎语</span><p>{viewingRobot.welcome}</p></div>
              <div className="col-span-2">
                <span className="text-slate-400">快捷问题</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {(viewingRobot.quickQuestions ?? []).map((q, i) => (
                    <span key={i} className="rounded-md bg-blue-50 px-2 py-0.5 text-base text-blue-700">{q}</span>
                  ))}
                  {(viewingRobot.quickQuestions ?? []).length === 0 && <span className="text-slate-400">未配置</span>}
                </div>
              </div>
              <div><span className="text-slate-400">回答风格</span><p>{viewingRobot.style}</p></div>
              <div><span className="text-slate-400">追问轮次/低置信阈值</span><p>{viewingRobot.maxFollowUpRounds ?? 2}轮 / {((viewingRobot.lowConfidenceThreshold ?? 0.65) * 100).toFixed(0)}%</p></div>
              <div><span className="text-slate-400">转人工规则</span><p className="truncate">{viewingRobot.humanRule}</p></div>
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
