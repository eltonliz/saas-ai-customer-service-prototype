import { useState } from "react";
import type { PageProps } from "../../types";
import { healthRiskSamples } from "../../data/mockData";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { Shield, AlertTriangle, FileText, MessageSquare, Plus, X, Megaphone, DollarSign, EyeOff, ThumbsDown } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

type Tab = "words" | "templates" | "records" | "compliance" | "ads" | "refund" | "privacy" | "abuse";

const initialSensitiveWords = ["治疗", "治愈", "根除", "特效药", "保证有效", "100%有效", "彻底康复"];
const initialBannedPhrases = ["能治好你的病", "这个药比医院好", "我家产品保证效果", "绝对没有副作用", "不用去医院"];
const initialSafeTemplates = [
  "不能进行疾病诊断，建议您咨询专业医生。",
  "本产品为营养补充食品，不能替代药品。",
  "可以提供健康科普和生活方式建议，但不能承诺治疗效果。",
  "如持续不适，请及时就医。",
];

// 新增风险类型数据
const initialAbsoluteClaims = ["百分百有效", "永久根治", "彻底治愈", "永不复发", "绝对安全", "保证效果", "包治百病"];
const initialRefundPromises = ["一定给你退款", "保证全额退", "赔你双倍", "肯定能退", "我承诺退款", "你放心，一定赔"];
const initialFakeStockPrice = ["库存充足得很不用查", "价格比官网低一半", "限时秒杀仅此一次", "全网最低价", "库存无限不用担心"];
const initialPrivacyRules = [
  { field: "手机号", rule: "中间四位脱敏，显示如 138****1234" },
  { field: "身份证号", rule: "仅显示前3后4位，如 320****1234" },
  { field: "详细地址", rule: "仅显示到区/县级别" },
  { field: "银行卡号", rule: "仅显示后四位" },
];
const initialAbusePatterns = ["垃圾", "骗子", "黑心商家", "投诉死你", "曝光你们"];

const tabItems: { id: Tab; label: string; icon: typeof Shield }[] = [
  { id: "words", label: "敏感词与禁用话术", icon: AlertTriangle },
  { id: "ads", label: "绝对化宣传拦截", icon: Megaphone },
  { id: "refund", label: "退款赔偿承诺拦截", icon: DollarSign },
  { id: "privacy", label: "隐私泄露脱敏", icon: EyeOff },
  { id: "abuse", label: "辱骂攻击检测", icon: ThumbsDown },
  { id: "templates", label: "安全回复模板", icon: MessageSquare },
  { id: "records", label: "高风险会话记录", icon: FileText },
  { id: "compliance", label: "合规审核记录", icon: Shield },
];

export default function TenantRiskControl({ context }: PageProps) {
  const [tab, setTab] = useState<Tab>("words");
  const [sensitiveWords, setSensitiveWords] = useState<string[]>(initialSensitiveWords);
  const [bannedPhrases, setBannedPhrases] = useState<string[]>(initialBannedPhrases);
  const [safeTemplates, setSafeTemplates] = useState<string[]>(initialSafeTemplates);
  const [absoluteClaims, setAbsoluteClaims] = useState<string[]>(initialAbsoluteClaims);
  const [refundPromises, setRefundPromises] = useState<string[]>(initialRefundPromises);
  const [fakeStockPrice, setFakeStockPrice] = useState<string[]>(initialFakeStockPrice);
  const [abusePatterns, setAbusePatterns] = useState<string[]>(initialAbusePatterns);

  const [addModal, setAddModal] = useState<{ open: boolean; type: string | null }>({ open: false, type: null });
  const [addInput, setAddInput] = useState("");

  const mySamples = healthRiskSamples.filter((s) => s.tenantId === context.currentTenantId);

  function openAddModal(type: string) {
    setAddInput("");
    setAddModal({ open: true, type });
  }

  function handleAdd() {
    if (!addInput.trim()) return;
    const type = addModal.type;
    if (type === "sensitive") setSensitiveWords((prev) => [...prev, addInput.trim()]);
    else if (type === "banned") setBannedPhrases((prev) => [...prev, addInput.trim()]);
    else if (type === "template") setSafeTemplates((prev) => [...prev, addInput.trim()]);
    else if (type === "ads") setAbsoluteClaims((prev) => [...prev, addInput.trim()]);
    else if (type === "refund") setRefundPromises((prev) => [...prev, addInput.trim()]);
    else if (type === "price") setFakeStockPrice((prev) => [...prev, addInput.trim()]);
    else if (type === "abuse") setAbusePatterns((prev) => [...prev, addInput.trim()]);
    setAddModal({ open: false, type: null });
  }

  function openAddForTab() {
    if (tab === "words") openAddModal("sensitive");
    else if (tab === "ads") openAddModal("ads");
    else if (tab === "refund") openAddModal("refund");
    else if (tab === "privacy") return; // privacy uses predefined rules
    else if (tab === "abuse") openAddModal("abuse");
    else if (tab === "templates") openAddModal("template");
  }

  const addModalTitle =
    addModal.type === "sensitive" ? "添加敏感词" :
    addModal.type === "banned" ? "添加禁用话术" :
    addModal.type === "template" ? "添加安全回复模板" :
    addModal.type === "ads" ? "添加绝对化宣传词" :
    addModal.type === "refund" ? "添加退款赔偿承诺关键词" :
    addModal.type === "price" ? "添加虚假库存/价格关键词" :
    addModal.type === "abuse" ? "添加辱骂攻击关键词" : "添加";

  // 共用词条展示组件
  function WordChipList({ words, onDelete, color = "red" }: { words: string[]; onDelete: (w: string) => void; color?: "red" | "orange" | "amber" | "rose" }) {
    const colors = {
      red: "bg-red-50 text-red-600 border-red-100",
      orange: "bg-orange-50 text-orange-600 border-orange-100",
      amber: "bg-amber-50 text-amber-600 border-amber-100",
      rose: "bg-rose-50 text-rose-600 border-rose-100",
    };
    return (
      <div className="flex flex-wrap gap-2">
        {words.map((w) => (
          <span key={w} className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-base ${colors[color]}`}>
            {w}
            <button type="button" onClick={() => onDelete(w)} className="hover:opacity-70"><X size={12} /></button>
          </span>
        ))}
      </div>
    );
  }

  function PhraseList({ phrases, onDelete }: { phrases: string[]; onDelete: (p: string) => void }) {
    return (
      <div className="space-y-2">
        {phrases.map((p) => (
          <div key={p} className="flex items-center justify-between text-base text-red-600 bg-red-50 rounded-lg px-3 py-2 border border-red-100">
            <span>"{p}"</span>
            <button type="button" onClick={() => onDelete(p)} className="hover:text-red-800"><X size={12} /></button>
          </div>
        ))}
      </div>
    );
  }

  const allBadges = reqs.TenantRiskControl.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);

  return (
    <div className="relative risk-page">
      {allBadges}
      <h2 className="text-2xl font-bold text-slate-900 mb-4">风控与大健康合规</h2>

      {/* Tab bar - wrapping for many tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1 flex-wrap">
        {tabItems.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-base font-medium transition-colors ${tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* 敏感词与禁用话术 */}
      {tab === "words" && (
        <div className="grid grid-cols-2 gap-8">
          <div className="rounded-xl border border-slate-200 bg-white p-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-red-600 flex items-center gap-2"><AlertTriangle size={16} />敏感词列表</h3>
              <button type="button" onClick={() => openAddModal("sensitive")} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-base font-medium text-white hover:bg-blue-700"><Plus size={14} />添加敏感词</button>
            </div>
            <WordChipList words={sensitiveWords} onDelete={(w) => setSensitiveWords((prev) => prev.filter((x) => x !== w))} />
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-red-600 flex items-center gap-2"><AlertTriangle size={16} />大健康禁用话术</h3>
              <button type="button" onClick={() => openAddModal("banned")} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-base font-medium text-white hover:bg-blue-700"><Plus size={14} />添加禁用话术</button>
            </div>
            <PhraseList phrases={bannedPhrases} onDelete={(p) => setBannedPhrases((prev) => prev.filter((x) => x !== p))} />
          </div>
        </div>
      )}

      {/* 绝对化宣传拦截 */}
      {tab === "ads" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-orange-600 flex items-center gap-2"><Megaphone size={16} />绝对化宣传词拦截</h3>
              <p className="text-base text-slate-400 mt-1">AI命中以下词汇时自动拦截或替换，防止夸大宣传</p>
            </div>
            <button type="button" onClick={() => openAddModal("ads")} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-base font-medium text-white hover:bg-blue-700"><Plus size={14} />添加</button>
          </div>
          <WordChipList words={absoluteClaims} onDelete={(w) => setAbsoluteClaims((prev) => prev.filter((x) => x !== w))} color="orange" />
        </div>
      )}

      {/* 退款赔偿承诺拦截 */}
      {tab === "refund" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-amber-600 flex items-center gap-2"><DollarSign size={16} />退款赔偿承诺拦截</h3>
              <p className="text-base text-slate-400 mt-1">AI不得对退款金额、赔偿数额作出承诺，命中以下关键词自动转人工</p>
            </div>
            <button type="button" onClick={() => openAddModal("refund")} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-base font-medium text-white hover:bg-blue-700"><Plus size={14} />添加</button>
          </div>
          <WordChipList words={refundPromises} onDelete={(w) => setRefundPromises((prev) => prev.filter((x) => x !== w))} color="amber" />
        </div>
      )}

      {/* 隐私泄露脱敏 */}
      {tab === "privacy" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-rose-600 flex items-center gap-2"><EyeOff size={16} />隐私泄露脱敏规则</h3>
              <p className="text-base text-slate-400 mt-1">AI回答中不得完整展示以下敏感信息，系统自动脱敏处理</p>
            </div>
          </div>
          <div className="space-y-3 mt-4">
            {initialPrivacyRules.map((r) => (
              <div key={r.field} className="flex items-center justify-between rounded-lg bg-rose-50 border border-rose-100 px-4 py-3">
                <div>
                  <span className="text-base font-semibold text-rose-700">{r.field}</span>
                  <span className="text-base text-slate-500 ml-3">{r.rule}</span>
                </div>
                <StatusBadge status="已启用" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 辱骂攻击检测 */}
      {tab === "abuse" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-base font-semibold text-rose-600 flex items-center gap-2"><ThumbsDown size={16} />辱骂攻击检测</h3>
              <p className="text-base text-slate-400 mt-1">命中后记录会话标签，必要时升级为投诉工单并通知主管</p>
            </div>
            <button type="button" onClick={() => openAddModal("abuse")} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-base font-medium text-white hover:bg-blue-700"><Plus size={14} />添加</button>
          </div>
          <WordChipList words={abusePatterns} onDelete={(w) => setAbusePatterns((prev) => prev.filter((x) => x !== w))} color="rose" />
        </div>
      )}

      {/* 安全回复模板 */}
      {tab === "templates" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-700 flex items-center gap-2"><MessageSquare size={16} className="text-emerald-500" />安全回复模板</h3>
            <button type="button" onClick={() => openAddModal("template")} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-base font-medium text-white hover:bg-blue-700"><Plus size={14} />添加安全模板</button>
          </div>
          <div className="space-y-2">
            {safeTemplates.map((t, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-emerald-50 px-4 py-3 text-base text-emerald-700 border border-emerald-100">
                <span>{t}</span>
                <button type="button" onClick={() => setSafeTemplates((prev) => prev.filter((_, j) => j !== i))} className="flex-shrink-0 ml-2 hover:text-red-600"><X size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 高风险会话记录 */}
      {tab === "records" && (
        <div className="space-y-3">
          <p className="text-base text-slate-500">高风险会话记录（本租户风控样本）</p>
          {mySamples.map((s) => (
            <div key={s.id} className="rounded-xl border border-red-100 bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-medium text-slate-700 truncate max-w-[400px]">{s.question}</span>
                <StatusBadge status={s.level} />
              </div>
              <div className="text-base space-y-1">
                <p className="text-slate-500">风险类型: {s.riskType}</p>
                <p className="text-emerald-600">安全回复: {s.safeReply}</p>
                <p className="text-amber-600">处置: {s.disposition}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 合规审核记录 */}
      {tab === "compliance" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2"><FileText size={16} className="text-violet-500" />合规审核记录</h3>
          <p className="text-base text-slate-500">所有高风险会话将在风控审核后留痕。高风险会话自动转人工并记录合规审核结果。</p>
          <div className="mt-3 space-y-2">
            {mySamples.filter((s) => s.level === "高风险").map((s) => (
              <div key={s.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3 text-base">
                <StatusBadge status="高风险" /> <span className="ml-2">{s.question}</span>
                <p className="text-slate-400 mt-1">处理: {s.disposition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={addModal.open} title={addModalTitle} onClose={() => setAddModal({ open: false, type: null })} size="md">
        <div>
          <label className="block text-base font-medium text-slate-500 mb-1">{addModal.type === "template" ? "模板内容" : "内容"}</label>
          <input
            value={addInput}
            onChange={(e) => setAddInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder={addModal.type === "template" ? "输入安全回复模板内容" : "输入内容"}
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
          />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setAddModal({ open: false, type: null })} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleAdd} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">添加</button>
        </div>
      </Modal>
    </div>
  );
}
