import { useState } from "react";
import type { PageProps, Faq } from "../../types";
import { faqs } from "../../data/mockData";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { BookOpen, FileText, Shield, Send, Plus, Pencil, Trash2 } from "lucide-react";

type Tab = "faq" | "help" | "sop" | "template" | "health";

interface TemplateItem {
  name: string;
  desc: string;
  industry: string;
}

export default function PlatformKnowledgeBase({}: PageProps) {
  const [tab, setTab] = useState<Tab>("faq");
  const [faqList, setFaqList] = useState<Faq[]>(faqs.filter((f) => f.scope === "平台"));
  const [templateList, setTemplateList] = useState<TemplateItem[]>([
    { name: "直播电商知识模板", desc: "直播商品管理、库存同步、售后规则等标准知识条目", industry: "直播电商" },
    { name: "门店服务知识模板", desc: "门店核销、预约、库存管理等标准知识条目", industry: "门店服务" },
    { name: "大健康合规模板", desc: "健康科普边界、禁用话术、安全回复模板", industry: "大健康" },
  ]);

  // FAQ CRUD state
  const [faqModal, setFaqModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [faqForm, setFaqForm] = useState({ question: "", category: "", answer: "" });

  // Template CRUD state
  const [tplModal, setTplModal] = useState(false);
  const [editingTpl, setEditingTpl] = useState<TemplateItem | null>(null);
  const [tplForm, setTplForm] = useState({ name: "", desc: "", industry: "" });

  function openFaqCreate() {
    setEditingFaq(null);
    setFaqForm({ question: "", category: "", answer: "" });
    setFaqModal(true);
  }

  function openFaqEdit(faq: Faq) {
    setEditingFaq(faq);
    setFaqForm({ question: faq.question, category: faq.category, answer: faq.answer });
    setFaqModal(true);
  }

  function handleFaqSave() {
    if (!faqForm.question.trim()) return;
    if (editingFaq) {
      setFaqList((prev) =>
        prev.map((f) =>
          f.id === editingFaq.id
            ? { ...f, question: faqForm.question, category: faqForm.category, answer: faqForm.answer }
            : f,
        ),
      );
    } else {
      setFaqList((prev) => [
        ...prev,
        {
          id: `faq-new-${Date.now()}`,
          scope: "平台",
          question: faqForm.question,
          category: faqForm.category || "通用",
          answer: faqForm.answer,
          hitRate: 0,
          references: 0,
          businessLine: "直播",
        },
      ]);
    }
    setFaqModal(false);
    setEditingFaq(null);
  }

  function handleFaqDelete(id: string) {
    setFaqList((prev) => prev.filter((f) => f.id !== id));
  }

  function openTplCreate() {
    setEditingTpl(null);
    setTplForm({ name: "", desc: "", industry: "" });
    setTplModal(true);
  }

  function openTplEdit(tpl: TemplateItem) {
    setEditingTpl(tpl);
    setTplForm({ name: tpl.name, desc: tpl.desc, industry: tpl.industry });
    setTplModal(true);
  }

  function handleTplSave() {
    if (!tplForm.name.trim()) return;
    if (editingTpl) {
      setTemplateList((prev) =>
        prev.map((t) =>
          t.name === editingTpl.name
            ? { ...t, name: tplForm.name, desc: tplForm.desc, industry: tplForm.industry }
            : t,
        ),
      );
    } else {
      setTemplateList((prev) => [
        ...prev,
        { name: tplForm.name, desc: tplForm.desc, industry: tplForm.industry },
      ]);
    }
    setTplModal(false);
    setEditingTpl(null);
  }

  function handleTplDelete(name: string) {
    setTemplateList((prev) => prev.filter((t) => t.name !== name));
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-4">平台知识库</h2>

      <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {([
          { id: "faq" as Tab, label: "平台FAQ" },
          { id: "help" as Tab, label: "帮助文档" },
          { id: "sop" as Tab, label: "平台SOP" },
          { id: "template" as Tab, label: "行业模板知识" },
          { id: "health" as Tab, label: "大健康合规模板" },
        ]).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "faq" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{faqList.length} 条FAQ</span>
            <button
              type="button"
              onClick={openFaqCreate}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={14} />新建FAQ
            </button>
          </div>
          <DataTable
            data={faqList}
            rowKey={(r) => r.id}
            columns={[
              { key: "question", header: "问题", render: (r) => <span className="text-sm font-medium">{r.question}</span> },
              { key: "category", header: "分类", render: (r) => <span className="text-sm">{r.category}</span> },
              { key: "answer", header: "回答", render: (r) => <span className="text-sm text-slate-500 truncate max-w-[300px]">{r.answer}</span> },
              { key: "hitRate", header: "命中率", render: (r) => <span className="text-sm">{r.hitRate}%</span> },
              {
                key: "actions",
                header: "操作",
                render: (r) => (
                  <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => openFaqEdit(r)}
                      className="flex items-center gap-0.5 rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-500 hover:bg-slate-50"
                    >
                      <Pencil size={12} />编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFaqDelete(r.id)}
                      className="flex items-center gap-0.5 rounded-md border border-red-200 px-2 py-1 text-sm text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={12} />删除
                    </button>
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}

      {tab === "template" && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{templateList.length} 个模板</span>
            <button
              type="button"
              onClick={openTplCreate}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={14} />新建模板
            </button>
          </div>
          <div className="space-y-3">
            {templateList.map((t) => (
              <div key={t.name} className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-slate-800">{t.name}</h3>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => openTplEdit(t)}
                      className="flex items-center gap-0.5 rounded-md border border-slate-200 px-2 py-1 text-sm text-slate-500 hover:bg-slate-50"
                    >
                      <Pencil size={12} />编辑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTplDelete(t.name)}
                      className="flex items-center gap-0.5 rounded-md border border-red-200 px-2 py-1 text-sm text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={12} />删除
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-500 mb-3">{t.desc}</p>
                <div className="flex gap-2">
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-sm text-blue-600">{t.industry}</span>
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-600 hover:bg-blue-100"
                  >
                    <Send size={12} />发布到租户模板
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(tab === "help" || tab === "sop") && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">
            {tab === "help" ? "平台帮助文档" : "平台SOP"}
          </h3>
          <p className="text-sm text-slate-500">
            此页面用于管理{tab === "help" ? "面向商家和消费者的帮助文档" : "内部客服标准操作流程"}。实际内容由运营团队维护。
          </p>
          <div className="mt-3 space-y-2">
            {["系统操作指南", "常见问题排查", "业务规则说明", "接口文档"].map((d) => (
              <div
                key={d}
                className="rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "health" && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Shield size={16} className="text-rose-500" />大健康合规知识模板
          </h3>
          <div className="space-y-3 text-sm text-slate-600">
            <div className="rounded-lg bg-rose-50 border border-rose-100 p-3">
              <p className="font-medium text-rose-700 mb-1">AI能力边界</p>
              <p>只能提供经审核的健康科普和生活方式建议。禁止疾病诊断、治疗承诺、用药建议。</p>
            </div>
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3">
              <p className="font-medium text-emerald-700 mb-1">安全回复模板</p>
              <p>"不能进行疾病诊断，建议咨询专业医生。"本模板可发布至全部租户的大健康业务线。</p>
            </div>
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
            >
              <Send size={12} />发布至全部租户
            </button>
          </div>
        </div>
      )}

      {/* FAQ Create/Edit Modal */}
      <Modal
        open={faqModal}
        title={editingFaq ? "编辑FAQ" : "新建FAQ"}
        onClose={() => setFaqModal(false)}
        size="md"
      >
        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">问题</label>
            <input
              value={faqForm.question}
              onChange={(e) => setFaqForm((f) => ({ ...f, question: e.target.value }))}
              placeholder="输入常见问题"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">分类</label>
            <select
              value={faqForm.category}
              onChange={(e) => setFaqForm((f) => ({ ...f, category: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
            >
              {["平台操作", "商品规则", "售后政策", "门店服务", "课程权益", "健康科普"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">回答</label>
            <textarea
              value={faqForm.answer}
              onChange={(e) => setFaqForm((f) => ({ ...f, answer: e.target.value }))}
              placeholder="输入回答内容..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              rows={4}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setFaqModal(false)} className="rounded-lg border px-4 py-2 text-sm">
            取消
          </button>
          <button type="button" onClick={handleFaqSave} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">
            {editingFaq ? "保存" : "创建"}
          </button>
        </div>
      </Modal>

      {/* Template Create/Edit Modal */}
      <Modal
        open={tplModal}
        title={editingTpl ? "编辑模板" : "新建模板"}
        onClose={() => setTplModal(false)}
        size="md"
      >
        <div className="space-y-3 text-sm">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">模板名称</label>
            <input
              value={tplForm.name}
              onChange={(e) => setTplForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="输入模板名称"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">行业</label>
            <input
              value={tplForm.industry}
              onChange={(e) => setTplForm((f) => ({ ...f, industry: e.target.value }))}
              placeholder="输入行业名称"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">描述</label>
            <textarea
              value={tplForm.desc}
              onChange={(e) => setTplForm((f) => ({ ...f, desc: e.target.value }))}
              placeholder="输入模板描述..."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setTplModal(false)} className="rounded-lg border px-4 py-2 text-sm">
            取消
          </button>
          <button type="button" onClick={handleTplSave} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">
            {editingTpl ? "保存" : "创建"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
