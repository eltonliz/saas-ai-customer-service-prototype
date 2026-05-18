import { useState } from "react";
import type { PageProps } from "../../types";
import { healthRiskSamples, tenants } from "../../data/mockData";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { Shield, AlertTriangle, Send, Eye, Plus, Pencil, Trash2 } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

type Tab = "words" | "health" | "aftersale" | "templates";

interface SensitiveWord {
  word: string;
  category: string;
  level: string;
  action: string;
  scope: string;
}

interface ForbiddenPhrase {
  phrase: string;
  reason: string;
  level: string;
}

interface RiskTemplate {
  id: string;
  name: string;
  type: string;
  rules: string[];
  scope: string;
}

export default function GlobalRiskControl({}: PageProps) {
  const grcReqs = reqs.GlobalRiskControl.find(r => r.badgeLabel === "global-risk")?.reqs;
  const [tab, setTab] = useState<Tab>("words");
  const [dispatchModal, setDispatchModal] = useState(false);
  const [selectedTpl, setSelectedTpl] = useState<string | null>(null);
  const [viewSample, setViewSample] = useState<string | null>(null);

  // Sensitive words state
  const [sensitiveWords, setSensitiveWords] = useState<SensitiveWord[]>([
    { word: "治疗", category: "疾病诊断", level: "高风险", action: "拦截+转人工", scope: "全平台" },
    { word: "治愈", category: "治疗效果承诺", level: "高风险", action: "拦截+转人工", scope: "大健康" },
    { word: "根治", category: "治疗效果承诺", level: "高风险", action: "拦截+转人工", scope: "大健康" },
    { word: "处方药", category: "药品推荐", level: "高风险", action: "拦截+转人工", scope: "大健康" },
    { word: "退款", category: "交易纠纷", level: "中风险", action: "AI说明规则+建议转人工", scope: "全平台" },
    { word: "假货", category: "投诉敏感词", level: "高风险", action: "立即转人工+通知主管", scope: "全平台" },
    { word: "消费者协会", category: "投诉升级", level: "高风险", action: "立即转人工+通知法务", scope: "全平台" },
    { word: "过敏", category: "健康安全", level: "高风险", action: "立即转人工+建议就医", scope: "大健康" },
  ]);

  // Forbidden phrases state
  const [forbiddenPhrases, setForbiddenPhrases] = useState<ForbiddenPhrase[]>([
    { phrase: "保证治疗好", reason: "疗效承诺", level: "高风险" },
    { phrase: "百分百有效", reason: "夸大宣传", level: "高风险" },
    { phrase: "吃了就好", reason: "疗效承诺", level: "高风险" },
    { phrase: "不用看医生", reason: "引导放弃就医", level: "高风险" },
    { phrase: "绝对安全", reason: "绝对化宣传", level: "中风险" },
  ]);

  // Risk templates state
  const [riskTemplates, setRiskTemplates] = useState<RiskTemplate[]>([
    { id: "tpl-1", name: "大健康默认风控策略", type: "健康合规", rules: ["疾病诊断拦截", "治疗效果拦截", "药品推荐拦截", "安全回复模板替换"], scope: "大健康业务线" },
    { id: "tpl-2", name: "售后高风险升级策略", type: "交易风控", rules: ["大额退款标记", "多次售后标记", "投诉关键词升级", "自动通知主管"], scope: "售后场景" },
    { id: "tpl-3", name: "直播合规风控策略", type: "内容合规", rules: ["虚假宣传检测", "价格误导检测", "竞品攻击检测"], scope: "直播业务线" },
  ]);

  // Sensitive word CRUD
  const [wordModal, setWordModal] = useState(false);
  const [editingWord, setEditingWord] = useState<SensitiveWord | null>(null);
  const [wordForm, setWordForm] = useState({ word: "", category: "", level: "中风险", action: "", scope: "全平台" });

  // Forbidden phrase CRUD
  const [phraseModal, setPhraseModal] = useState(false);
  const [editingPhrase, setEditingPhrase] = useState<ForbiddenPhrase | null>(null);
  const [phraseForm, setPhraseForm] = useState({ phrase: "", reason: "", level: "中风险" });

  // Template CRUD
  const [tplModal, setTplModal] = useState(false);
  const [editingTpl, setEditingTpl] = useState<RiskTemplate | null>(null);
  const [tplForm, setTplForm] = useState({ name: "", type: "", rules: "", scope: "" });

  // ---- Sensitive word handlers ----
  function openWordCreate() {
    setEditingWord(null);
    setWordForm({ word: "", category: "", level: "中风险", action: "", scope: "全平台" });
    setWordModal(true);
  }

  function openWordEdit(w: SensitiveWord) {
    setEditingWord(w);
    setWordForm({ word: w.word, category: w.category, level: w.level, action: w.action, scope: w.scope });
    setWordModal(true);
  }

  function handleWordSave() {
    if (!wordForm.word.trim()) return;
    if (editingWord) {
      setSensitiveWords((prev) =>
        prev.map((w) => (w.word === editingWord.word ? { ...wordForm } : w)),
      );
    } else {
      setSensitiveWords((prev) => [...prev, { ...wordForm }]);
    }
    setWordModal(false);
    setEditingWord(null);
  }

  function handleWordDelete(word: string) {
    setSensitiveWords((prev) => prev.filter((w) => w.word !== word));
  }

  // ---- Forbidden phrase handlers ----
  function openPhraseCreate() {
    setEditingPhrase(null);
    setPhraseForm({ phrase: "", reason: "", level: "中风险" });
    setPhraseModal(true);
  }

  function openPhraseEdit(p: ForbiddenPhrase) {
    setEditingPhrase(p);
    setPhraseForm({ phrase: p.phrase, reason: p.reason, level: p.level });
    setPhraseModal(true);
  }

  function handlePhraseSave() {
    if (!phraseForm.phrase.trim()) return;
    if (editingPhrase) {
      setForbiddenPhrases((prev) =>
        prev.map((p) => (p.phrase === editingPhrase.phrase ? { ...phraseForm } : p)),
      );
    } else {
      setForbiddenPhrases((prev) => [...prev, { ...phraseForm }]);
    }
    setPhraseModal(false);
    setEditingPhrase(null);
  }

  function handlePhraseDelete(phrase: string) {
    setForbiddenPhrases((prev) => prev.filter((p) => p.phrase !== phrase));
  }

  // ---- Template handlers ----
  function openTplCreate() {
    setEditingTpl(null);
    setTplForm({ name: "", type: "", rules: "", scope: "" });
    setTplModal(true);
  }

  function openTplEdit(tpl: RiskTemplate) {
    setEditingTpl(tpl);
    setTplForm({ name: tpl.name, type: tpl.type, rules: tpl.rules.join("\n"), scope: tpl.scope });
    setTplModal(true);
  }

  function handleTplSave() {
    if (!tplForm.name.trim()) return;
    if (editingTpl) {
      setRiskTemplates((prev) =>
        prev.map((t) =>
          t.id === editingTpl.id
            ? { ...t, name: tplForm.name, type: tplForm.type, rules: tplForm.rules.split("\n").filter(Boolean), scope: tplForm.scope }
            : t,
        ),
      );
    } else {
      setRiskTemplates((prev) => [
        ...prev,
        {
          id: `tpl-new-${Date.now()}`,
          name: tplForm.name,
          type: tplForm.type,
          rules: tplForm.rules.split("\n").filter(Boolean),
          scope: tplForm.scope,
        },
      ]);
    }
    setTplModal(false);
    setEditingTpl(null);
  }

  function handleTplDelete(id: string) {
    setRiskTemplates((prev) => prev.filter((t) => t.id !== id));
  }

  const sample = healthRiskSamples.find((s) => s.id === viewSample);

  return (
    <div className="relative">
      {grcReqs?.map(req => (<RequirementBadge key={req.id} req={req} />))}
      <h2 className="text-2xl font-bold text-slate-900 mb-4">全局风控中心</h2>

      <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {([
          { id: "words" as Tab, label: "敏感词与禁用话术" },
          { id: "health" as Tab, label: "大健康风控规则" },
          { id: "aftersale" as Tab, label: "售后高风险规则" },
          { id: "templates" as Tab, label: "风控策略模板" },
        ]).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-base font-medium transition-colors ${tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "words" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <Shield size={16} className="text-rose-500" />敏感词列表
              </h3>
              <button
                type="button"
                onClick={openWordCreate}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-base font-medium text-white hover:bg-blue-700"
              >
                <Plus size={14} />新增规则
              </button>
            </div>
            <DataTable
              data={sensitiveWords}
              rowKey={(r) => r.word}
              columns={[
                { key: "word", header: "敏感词", render: (r) => <span className="text-base font-medium text-rose-600">{r.word}</span> },
                { key: "category", header: "分类", render: (r) => <span className="text-base">{r.category}</span> },
                { key: "level", header: "风险等级", render: (r) => <StatusBadge status={r.level} /> },
                { key: "action", header: "处置动作", render: (r) => <span className="text-base">{r.action}</span> },
                { key: "scope", header: "适用范围", render: (r) => <span className="text-base">{r.scope}</span> },
                {
                  key: "actions",
                  header: "操作",
                  render: (r) => (
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => openWordEdit(r)}
                        className="flex items-center gap-0.5 rounded-md border border-slate-200 px-2 py-1 text-base text-slate-500 hover:bg-slate-50"
                      >
                        <Pencil size={12} />编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => handleWordDelete(r.word)}
                        className="flex items-center gap-0.5 rounded-md border border-red-200 px-2 py-1 text-base text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={12} />删除
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-8">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-slate-700 flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />禁用话术列表
              </h3>
              <button
                type="button"
                onClick={openPhraseCreate}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-base font-medium text-white hover:bg-blue-700"
              >
                <Plus size={14} />新增规则
              </button>
            </div>
            <DataTable
              data={forbiddenPhrases}
              rowKey={(r) => r.phrase}
              columns={[
                { key: "phrase", header: "禁用话术", render: (r) => <span className="text-base font-medium text-amber-600">{r.phrase}</span> },
                { key: "reason", header: "禁用原因", render: (r) => <span className="text-base">{r.reason}</span> },
                { key: "level", header: "风险等级", render: (r) => <StatusBadge status={r.level} /> },
                {
                  key: "actions",
                  header: "操作",
                  render: (r) => (
                    <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => openPhraseEdit(r)}
                        className="flex items-center gap-0.5 rounded-md border border-slate-200 px-2 py-1 text-base text-slate-500 hover:bg-slate-50"
                      >
                        <Pencil size={12} />编辑
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePhraseDelete(r.phrase)}
                        className="flex items-center gap-0.5 rounded-md border border-red-200 px-2 py-1 text-base text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={12} />删除
                      </button>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        </div>
      )}

      {tab === "health" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-200 bg-white p-8">
            <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Shield size={16} className="text-rose-500" />大健康风控样本
            </h3>
            <DataTable
              data={healthRiskSamples}
              rowKey={(r) => r.id}
              onRowClick={(r) => setViewSample(r.id)}
              columns={[
                { key: "question", header: "用户问题", render: (r) => <span className="text-base">{r.question}</span> },
                { key: "riskType", header: "风险类型", render: (r) => <span className="text-base">{r.riskType}</span> },
                { key: "level", header: "风险等级", render: (r) => <StatusBadge status={r.level} /> },
                { key: "disposition", header: "处置", render: (r) => <span className="text-base">{r.disposition}</span> },
                {
                  key: "actions",
                  header: "操作",
                  render: (r) => (
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setViewSample(r.id); }}
                      className="flex items-center gap-0.5 rounded-md border border-slate-200 px-2 py-1 text-base text-slate-500 hover:bg-slate-50"
                    >
                      <Eye size={12} />查看
                    </button>
                  ),
                },
              ]}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-8">
            <h3 className="text-base font-semibold text-slate-700 mb-3">大健康风控规则说明</h3>
            <div className="space-y-2 text-base text-slate-600">
              <p className="rounded-lg bg-rose-50 border border-rose-100 p-3">
                <span className="font-medium text-rose-700">拦截规则：</span>疾病诊断、治疗效果承诺、药品推荐、引导放弃就医
              </p>
              <p className="rounded-lg bg-amber-50 border border-amber-100 p-3">
                <span className="font-medium text-amber-700">安全替换：</span>命中高风险规则时，自动替换为"不能进行疾病诊断或承诺治疗效果，建议咨询专业医生" + 可选科普内容
              </p>
              <p className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
                <span className="font-medium text-emerald-700">可回答范围：</span>经审核的健康科普知识、生活方式建议（需标注"不能替代医学建议"）
              </p>
            </div>
          </div>
        </div>
      )}

      {tab === "aftersale" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3">售后高风险规则</h3>
          <div className="space-y-2 text-base text-slate-600">
            <p className="rounded-lg bg-amber-50 border border-amber-100 p-3">
              <span className="font-medium text-amber-700">大额退款标记：</span>退款金额超过500元，AI说明规则后自动建议转人工处理，不可直接承诺退款
            </p>
            <p className="rounded-lg bg-amber-50 border border-amber-100 p-3">
              <span className="font-medium text-amber-700">多次售后标记：</span>同一用户30天内发起超过3次售后，自动升级为高风险会话，转人工处理
            </p>
            <p className="rounded-lg bg-rose-50 border border-rose-100 p-3">
              <span className="font-medium text-rose-700">投诉关键词升级：</span>命中"假货""消费者协会""12315""工商"等词，立即转人工+通知主管
            </p>
            <p className="rounded-lg bg-slate-50 border border-slate-100 p-3">
              <span className="font-medium text-slate-700">AI退款限制：</span>AI不可在无人工审核的情况下执行退款操作，仅可说明退款规则和申请路径
            </p>
          </div>
        </div>
      )}

      {tab === "templates" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-base text-slate-400">{riskTemplates.length} 个策略模板</span>
            <button
              type="button"
              onClick={openTplCreate}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700"
            >
              <Plus size={14} />新增规则
            </button>
          </div>
          {riskTemplates.map((tpl) => (
            <div key={tpl.id} className="rounded-xl border border-slate-200 bg-white p-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Shield size={16} className="text-indigo-500" />
                  <h3 className="text-base font-semibold text-slate-700">{tpl.name}</h3>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => openTplEdit(tpl)}
                    className="flex items-center gap-0.5 rounded-md border border-slate-200 px-2 py-1 text-base text-slate-500 hover:bg-slate-50"
                  >
                    <Pencil size={12} />编辑
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTplDelete(tpl.id)}
                    className="flex items-center gap-0.5 rounded-md border border-red-200 px-2 py-1 text-base text-red-500 hover:bg-red-50"
                  >
                    <Trash2 size={12} />删除
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedTpl(tpl.id); setDispatchModal(true); }}
                    className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-base text-blue-600 hover:bg-blue-100"
                  >
                    <Send size={12} />下发至租户
                  </button>
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <span className="text-base text-slate-400">类型：{tpl.type}</span>
                <span className="text-base text-slate-400">范围：{tpl.scope}</span>
              </div>
              <div className="space-y-1">
                {tpl.rules.map((rule) => (
                  <div key={rule} className="flex items-center gap-2 text-base text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Sample Modal */}
      <Modal open={viewSample !== null} title="风控样本详情" onClose={() => setViewSample(null)} size="md">
        {sample && (
          <div className="space-y-3 text-base">
            <div>
              <span className="text-base text-slate-400">用户问题</span>
              <p className="font-medium">{sample.question}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-base text-slate-400">风险类型</span><p>{sample.riskType}</p></div>
              <div><span className="text-base text-slate-400">风险等级</span><StatusBadge status={sample.level} /></div>
            </div>
            <div>
              <span className="text-base text-slate-400">安全回复</span>
              <div className="mt-1 rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-base text-emerald-800">
                {sample.safeReply}
              </div>
            </div>
            <div>
              <span className="text-base text-slate-400">处置方式</span>
              <p className="text-amber-600">{sample.disposition}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Dispatch Modal */}
      <Modal open={dispatchModal} title="下发策略至租户" onClose={() => setDispatchModal(false)} size="md">
        <div className="space-y-3 text-base">
          <p className="text-base text-slate-500">选择要下发此风控策略的租户：</p>
          {tenants.map((t) => (
            <label key={t.id} className="flex items-center gap-2 rounded-lg border border-slate-100 p-3 cursor-pointer hover:bg-slate-50">
              <input type="checkbox" className="rounded" />
              <div>
                <p className="text-base font-medium">{t.name}</p>
                <p className="text-base text-slate-400">{t.industry}</p>
              </div>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setDispatchModal(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={() => setDispatchModal(false)} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">确认下发</button>
        </div>
      </Modal>

      {/* Sensitive Word Create/Edit Modal */}
      <Modal open={wordModal} title={editingWord ? "编辑敏感词" : "新增敏感词"} onClose={() => setWordModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">敏感词</label>
            <input
              value={wordForm.word}
              onChange={(e) => setWordForm((f) => ({ ...f, word: e.target.value }))}
              placeholder="输入敏感词"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-base font-medium text-slate-500 mb-1">分类</label>
              <select
                value={wordForm.category}
                onChange={(e) => setWordForm((f) => ({ ...f, category: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
              >
                {["疾病诊断", "治疗效果承诺", "药品推荐", "交易纠纷", "投诉敏感词", "投诉升级", "健康安全"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-base font-medium text-slate-500 mb-1">风险等级</label>
              <select
                value={wordForm.level}
                onChange={(e) => setWordForm((f) => ({ ...f, level: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
              >
                {["低风险", "中风险", "高风险"].map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">处置动作</label>
            <input
              value={wordForm.action}
              onChange={(e) => setWordForm((f) => ({ ...f, action: e.target.value }))}
              placeholder="如：拦截+转人工"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">适用范围</label>
            <select
              value={wordForm.scope}
              onChange={(e) => setWordForm((f) => ({ ...f, scope: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            >
              {["全平台", "大健康", "售后"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setWordModal(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleWordSave} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">
            {editingWord ? "保存" : "创建"}
          </button>
        </div>
      </Modal>

      {/* Forbidden Phrase Create/Edit Modal */}
      <Modal open={phraseModal} title={editingPhrase ? "编辑禁用话术" : "新增禁用话术"} onClose={() => setPhraseModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">禁用话术</label>
            <input
              value={phraseForm.phrase}
              onChange={(e) => setPhraseForm((f) => ({ ...f, phrase: e.target.value }))}
              placeholder="输入禁用话术"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">禁用原因</label>
            <input
              value={phraseForm.reason}
              onChange={(e) => setPhraseForm((f) => ({ ...f, reason: e.target.value }))}
              placeholder="如：疗效承诺"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">风险等级</label>
            <select
              value={phraseForm.level}
              onChange={(e) => setPhraseForm((f) => ({ ...f, level: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            >
              {["低风险", "中风险", "高风险"].map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setPhraseModal(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handlePhraseSave} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">
            {editingPhrase ? "保存" : "创建"}
          </button>
        </div>
      </Modal>

      {/* Template Create/Edit Modal */}
      <Modal open={tplModal} title={editingTpl ? "编辑风控策略" : "新增风控策略"} onClose={() => setTplModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">策略名称</label>
            <input
              value={tplForm.name}
              onChange={(e) => setTplForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="输入策略名称"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-base font-medium text-slate-500 mb-1">类型</label>
              <input
                value={tplForm.type}
                onChange={(e) => setTplForm((f) => ({ ...f, type: e.target.value }))}
                placeholder="如：健康合规"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-500 mb-1">适用范围</label>
              <input
                value={tplForm.scope}
                onChange={(e) => setTplForm((f) => ({ ...f, scope: e.target.value }))}
                placeholder="如：大健康业务线"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">规则列表（每行一条）</label>
            <textarea
              value={tplForm.rules}
              onChange={(e) => setTplForm((f) => ({ ...f, rules: e.target.value }))}
              placeholder="疾病诊断拦截&#10;治疗效果拦截&#10;药品推荐拦截"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none font-mono"
              rows={8}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setTplModal(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleTplSave} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">
            {editingTpl ? "保存" : "创建"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
