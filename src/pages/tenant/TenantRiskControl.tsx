import { useState } from "react";
import type { PageProps } from "../../types";
import { healthRiskSamples } from "../../data/mockData";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { Shield, AlertTriangle, FileText, MessageSquare, Plus, X } from "lucide-react";

type Tab = "words" | "templates" | "records" | "compliance";

const initialSensitiveWords = ["治疗", "治愈", "根除", "特效药", "保证有效", "100%有效", "彻底康复"];
const initialBannedPhrases = ["能治好你的病", "这个药比医院好", "我家产品保证效果", "绝对没有副作用", "不用去医院"];
const initialSafeTemplates = [
  "不能进行疾病诊断，建议您咨询专业医生。",
  "本产品为营养补充食品，不能替代药品。",
  "可以提供健康科普和生活方式建议，但不能承诺治疗效果。",
  "如持续不适，请及时就医。",
];

export default function TenantRiskControl({ context }: PageProps) {
  const [tab, setTab] = useState<Tab>("words");
  const [sensitiveWords, setSensitiveWords] = useState<string[]>(initialSensitiveWords);
  const [bannedPhrases, setBannedPhrases] = useState<string[]>(initialBannedPhrases);
  const [safeTemplates, setSafeTemplates] = useState<string[]>(initialSafeTemplates);

  const [addModal, setAddModal] = useState<{ open: boolean; type: "sensitive" | "banned" | "template" | null }>({ open: false, type: null });
  const [addInput, setAddInput] = useState("");

  const mySamples = healthRiskSamples.filter((s) => s.tenantId === context.currentTenantId);

  function openAddModal(type: "sensitive" | "banned" | "template") {
    setAddInput("");
    setAddModal({ open: true, type });
  }

  function handleAdd() {
    if (!addInput.trim()) return;
    if (addModal.type === "sensitive") {
      setSensitiveWords((prev) => [...prev, addInput.trim()]);
    } else if (addModal.type === "banned") {
      setBannedPhrases((prev) => [...prev, addInput.trim()]);
    } else if (addModal.type === "template") {
      setSafeTemplates((prev) => [...prev, addInput.trim()]);
    }
    setAddModal({ open: false, type: null });
  }

  function handleDeleteWord(word: string) {
    setSensitiveWords((prev) => prev.filter((w) => w !== word));
  }

  function handleDeletePhrase(phrase: string) {
    setBannedPhrases((prev) => prev.filter((p) => p !== phrase));
  }

  function handleDeleteTemplate(index: number) {
    setSafeTemplates((prev) => prev.filter((_, i) => i !== index));
  }

  const addModalTitle =
    addModal.type === "sensitive" ? "添加敏感词" :
    addModal.type === "banned" ? "添加禁用话术" :
    "添加安全回复模板";

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-4">风控与大健康合规</h2>
      <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {([
          { id: "words" as Tab, label: "敏感词与禁用话术" },
          { id: "templates" as Tab, label: "安全回复模板" },
          { id: "records" as Tab, label: "高风险会话记录" },
          { id: "compliance" as Tab, label: "合规审核记录" },
        ]).map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "words" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-red-600 flex items-center gap-2"><AlertTriangle size={16} />敏感词列表</h3>
              <button type="button" onClick={() => openAddModal("sensitive")} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                <Plus size={14} />添加敏感词
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sensitiveWords.map((w) => (
                <span key={w} className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1 text-sm text-red-600 border border-red-100">
                  {w}
                  <button type="button" onClick={() => handleDeleteWord(w)} className="hover:text-red-800"><X size={12} /></button>
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-red-600 flex items-center gap-2"><AlertTriangle size={16} />大健康禁用话术</h3>
              <button type="button" onClick={() => openAddModal("banned")} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
                <Plus size={14} />添加禁用话术
              </button>
            </div>
            <div className="space-y-2">
              {bannedPhrases.map((p) => (
                <div key={p} className="flex items-center justify-between text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                  <span>"{p}"</span>
                  <button type="button" onClick={() => handleDeletePhrase(p)} className="hover:text-red-800"><X size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "templates" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><MessageSquare size={16} className="text-emerald-500" />安全回复模板</h3>
            <button type="button" onClick={() => openAddModal("template")} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
              <Plus size={14} />添加安全模板
            </button>
          </div>
          <div className="space-y-2">
            {safeTemplates.map((t, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700 border border-emerald-100">
                <span>{t}</span>
                <button type="button" onClick={() => handleDeleteTemplate(i)} className="flex-shrink-0 ml-2 hover:text-red-600"><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "records" && (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">高风险会话记录（本租户大健康风控样本）</p>
          {mySamples.map((s) => (
            <div key={s.id} className="rounded-xl border border-red-100 bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 truncate max-w-[400px]">{s.question}</span>
                <StatusBadge status={s.level} />
              </div>
              <div className="text-sm space-y-1">
                <p className="text-slate-500">风险类型: {s.riskType}</p>
                <p className="text-emerald-600">安全回复: {s.safeReply}</p>
                <p className="text-amber-600">处置: {s.disposition}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "compliance" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><FileText size={16} className="text-violet-500" />合规审核记录</h3>
          <p className="text-sm text-slate-500">所有大健康相关会话将在风控审核后留痕。高风险会话自动转人工并记录合规审核结果。</p>
          <div className="mt-3 space-y-2">
            {mySamples.filter((s) => s.level === "高风险").map((s) => (
              <div key={s.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-sm">
                <StatusBadge status="高风险" /> <span className="ml-2">{s.question}</span>
                <p className="text-slate-400 mt-1">处理: {s.disposition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={addModal.open} title={addModalTitle} onClose={() => setAddModal({ open: false, type: null })} size="md">
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-1">{addModal.type === "template" ? "模板内容" : "内容"}</label>
          <input
            value={addInput}
            onChange={(e) => setAddInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder={addModal.type === "template" ? "输入安全回复模板内容" : "输入内容"}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setAddModal({ open: false, type: null })} className="rounded-lg border px-4 py-2 text-sm">取消</button>
          <button type="button" onClick={handleAdd} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">添加</button>
        </div>
      </Modal>
    </div>
  );
}
