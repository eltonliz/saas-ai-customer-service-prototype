import { useMemo, useState } from "react";
import type { PageProps } from "../../types";
import { useAppStore } from "../../data/AppStore";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { Drawer } from "../../components/Drawer";
import { faqs } from "../../data/mockData";
import { Eye, Upload, Check, X, Send, PauseCircle, Edit3, Trash2 } from "lucide-react";

type Tab = "faq" | "docs" | "review" | "gap";

export default function KnowledgeBase({ context }: PageProps) {
  const store = useAppStore();
  const [tab, setTab] = useState<Tab>("faq");

  const myFaqs = faqs.filter((f) => !f.tenantId || f.tenantId === context.currentTenantId);
  const storeDocs = store.knowledgeDocs.filter((d) => d.tenantId === context.currentTenantId && d.merchantId === context.currentMerchantId);
  const myGaps = store.knowledgeGaps.filter((g) => g.tenantId === context.currentTenantId && g.merchantId === context.currentMerchantId);

  // review queue
  const pendingDocs = storeDocs.filter((d) => d.status === "待审核");
  const pendingGaps = myGaps.filter((g) => g.status === "待审核");

  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedGap, setSelectedGap] = useState<string | null>(null);
  const [gapDrawerOpen, setGapDrawerOpen] = useState(false);
  const [modalUpload, setModalUpload] = useState(false);
  const [uploadTitle, setUploadTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");

  // Deleted doc IDs (local tracking since store has no delete method)
  const [deletedDocIds, setDeletedDocIds] = useState<Set<string>>(new Set());

  // Edit doc modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", type: "FAQ文档", content: "" });

  const myDocs = useMemo(
    () => storeDocs.filter((d) => !deletedDocIds.has(d.id)),
    [storeDocs, deletedDocIds],
  );

  function handleUpload() {
    if (!uploadTitle.trim()) return;
    const newDoc = {
      id: `doc-new-${Date.now()}`,
      tenantId: context.currentTenantId,
      merchantId: context.currentMerchantId,
      title: uploadTitle,
      type: "文档",
      status: "解析中" as const,
      businessLine: context.currentBusinessLine,
      references: 0,
      hitRate: 0,
      chunks: 0,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    store.updateKnowledgeDoc(newDoc.id, newDoc);
    setModalUpload(false);
    setUploadTitle("");
    // simulate progress
    setTimeout(() => store.updateKnowledgeDoc(newDoc.id, { status: "切片中" }), 1500);
    setTimeout(() => store.updateKnowledgeDoc(newDoc.id, { status: "待审核", chunks: 8 }), 3000);
  }

  function handleApprove(id: string) {
    store.updateKnowledgeDoc(id, { status: "已发布", reviewComment: reviewComment || "审核通过" });
    setReviewComment("");
  }

  function handleReject(id: string) {
    store.updateKnowledgeDoc(id, { status: "已驳回", reviewComment: reviewComment || "内容不符" });
    setReviewComment("");
  }

  function handlePublish(id: string) {
    store.updateKnowledgeDoc(id, { status: "索引中" });
    setTimeout(() => store.updateKnowledgeDoc(id, { status: "已上线" }), 2000);
  }

  function handleDeactivate(id: string) {
    store.updateKnowledgeDoc(id, { status: "已停用" });
  }

  function handleGapGenerateCandidate(id: string) {
    store.updateKnowledgeGap(id, { status: "已生成候选知识", candidate: "AI已生成候选知识，等待人工审核。" });
  }

  function handleGapApprove(id: string) {
    store.updateKnowledgeGap(id, { status: "已发布", candidate: "审核通过，已发布。追踪命中效果。" });
  }

  function handleGapReject(id: string) {
    store.updateKnowledgeGap(id, { status: "已驳回", candidate: `审核驳回原因: ${reviewComment || "内容不符合平台规范"}` });
    setReviewComment("");
  }

  function openEditModal(docId: string) {
    const doc = storeDocs.find((d) => d.id === docId);
    if (!doc) return;
    setEditingDocId(docId);
    setEditForm({
      title: doc.title,
      type: doc.type,
      content: doc.content || "",
    });
    setEditModalOpen(true);
  }

  function handleEditSave() {
    if (!editForm.title.trim() || !editingDocId) return;
    store.updateKnowledgeDoc(editingDocId, {
      title: editForm.title.trim(),
      type: editForm.type,
      content: editForm.content,
    });
    setEditModalOpen(false);
    setEditingDocId(null);
  }

  function handleDeleteDoc(docId: string, docTitle: string) {
    if (window.confirm(`确定要删除文档"${docTitle}"吗？`)) {
      setDeletedDocIds((prev) => {
        const next = new Set(prev);
        next.add(docId);
        return next;
      });
    }
  }

  function handleRowClick(doc: typeof storeDocs[number]) {
    setSelectedDoc(doc.id);
    setDrawerOpen(true);
  }

  const doc = selectedDoc ? storeDocs.find((d) => d.id === selectedDoc) : null;
  const gap = selectedGap ? myGaps.find((g) => g.id === selectedGap) : null;

  const tabItems: { id: Tab; label: string; count?: number }[] = [
    { id: "faq", label: "FAQ管理" },
    { id: "docs", label: "文档知识库" },
    { id: "review", label: "审核队列", count: pendingDocs.length + pendingGaps.filter((g) => g.status === "待审核").length },
    { id: "gap", label: "知识缺口池", count: myGaps.filter((g) => g.status !== "已关闭" && g.status !== "已驳回").length },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">知识库管理</h2>
        <button type="button" onClick={() => setModalUpload(true)} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"><Upload size={14} />上传文档</button>
      </div>

      <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {tabItems.map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {t.label}
            {t.count !== undefined && <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-sm ${t.count > 0 ? "bg-red-100 text-red-600" : "bg-slate-200 text-slate-400"}`}>{t.count}</span>}
          </button>
        ))}
      </div>

      {tab === "faq" && (
        <DataTable
          data={myFaqs}
          rowKey={(r) => r.id}
          columns={[
            { key: "question", header: "问题", render: (r) => <span className="text-sm font-medium">{r.question}</span> },
            { key: "category", header: "分类", render: (r) => <span className="text-sm">{r.category}</span> },
            { key: "scope", header: "范围", render: (r) => <span className="text-sm">{r.scope}</span> },
            { key: "hitRate", header: "命中率", render: (r) => <span className="text-sm">{r.hitRate}%</span> },
            { key: "references", header: "引用次数", render: (r) => <span className="text-sm">{r.references}次</span> },
          ]}
        />
      )}

      {tab === "docs" && (
        <DataTable
          data={myDocs}
          rowKey={(r) => r.id}
          onRowClick={(d) => handleRowClick(d)}
          columns={[
            { key: "title", header: "文档名称", render: (r) => <span className="text-sm font-medium">{r.title}</span> },
            { key: "type", header: "类型", render: (r) => <span className="text-sm">{r.type}</span> },
            { key: "status", header: "状态", render: (r) => <StatusBadge status={r.status} /> },
            { key: "businessLine", header: "业务线", render: (r) => <span className="text-sm">{r.businessLine}</span> },
            { key: "references", header: "引用次数", render: (r) => <span className="text-sm">{r.references}次</span> },
            { key: "hitRate", header: "命中率", render: (r) => <span className="text-sm">{r.hitRate}%</span> },
            { key: "action", header: "操作", render: (r) => (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                <button type="button" onClick={(e) => { e.stopPropagation(); openEditModal(r.id); }} className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50" title="编辑">
                  <Edit3 size={14} />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); handleDeleteDoc(r.id, r.title); }} className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50" title="删除">
                  <Trash2 size={14} />
                </button>
                <Eye size={14} className="text-slate-300 ml-1" />
              </div>
            ) },
          ]}
        />
      )}

      {tab === "review" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">待审核文档 ({pendingDocs.length})</h3>
            {pendingDocs.length === 0 ? <p className="text-sm text-slate-400">暂无待审核文档</p> : (
              <div className="space-y-2">
                {pendingDocs.map((d) => (
                  <div key={d.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                    <div>
                      <p className="text-sm font-medium">{d.title}</p>
                      <p className="text-sm text-slate-400">{d.type} · {d.businessLine} · {d.updatedAt}</p>
                    </div>
                    <div className="flex gap-2">
                      <input value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="审核意见" className="rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none w-32" />
                      <button type="button" onClick={() => handleApprove(d.id)} className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3 py-1.5 text-sm text-white hover:bg-emerald-600"><Check size={12} />通过</button>
                      <button type="button" onClick={() => handleReject(d.id)} className="flex items-center gap-1 rounded-lg bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"><X size={12} />驳回</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">待审核知识缺口 ({pendingGaps.length})</h3>
            {pendingGaps.length === 0 ? <p className="text-sm text-slate-400">暂无</p> : (
              <div className="space-y-2">
                {pendingGaps.map((g) => (
                  <div key={g.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3">
                    <div>
                      <p className="text-sm font-medium">{g.question}</p>
                      <p className="text-sm text-slate-400">{g.source} · {g.intent}</p>
                    </div>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleGapApprove(g.id)} className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm text-white hover:bg-emerald-600">通过并发布</button>
                      <button type="button" onClick={() => handleGapReject(g.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600">驳回</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "gap" && (
        <div>
          <DataTable
            data={myGaps}
            rowKey={(r) => r.id}
            onRowClick={(g) => { setSelectedGap(g.id); setGapDrawerOpen(true); }}
            columns={[
              { key: "question", header: "问题", render: (r) => <span className="text-sm font-medium">{r.question}</span> },
              { key: "source", header: "来源", render: (r) => <span className="text-sm">{r.source}</span> },
              { key: "reason", header: "原因", render: (r) => <span className="text-sm">{r.reason}</span> },
              { key: "status", header: "状态", render: (r) => <StatusBadge status={r.status} /> },
              { key: "count", header: "出现次数", render: (r) => <span className="text-sm">{r.count}次</span> },
              { key: "action", header: "", render: () => <Eye size={14} className="text-slate-300" /> },
            ]}
          />
        </div>
      )}

      {/* Document Drawer */}
      <Drawer open={drawerOpen} title="文档详情" onClose={() => setDrawerOpen(false)}>
        {doc && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-sm text-slate-400">标题</span><p className="font-medium">{doc.title}</p></div>
              <div><span className="text-sm text-slate-400">状态</span><StatusBadge status={doc.status} /></div>
              <div><span className="text-sm text-slate-400">类型</span><p>{doc.type}</p></div>
              <div><span className="text-sm text-slate-400">业务线</span><p>{doc.businessLine}</p></div>
              <div><span className="text-sm text-slate-400">引用次数</span><p>{doc.references}次</p></div>
              <div><span className="text-sm text-slate-400">命中率</span><p>{doc.hitRate}%</p></div>
              <div><span className="text-sm text-slate-400">切片数</span><p>{doc.chunks}</p></div>
            </div>
            {doc.content && <div><span className="text-sm text-slate-400">内容</span><p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3 mt-1">{doc.content}</p></div>}
            {doc.chunksData && (
              <div>
                <span className="text-sm text-slate-400">切片列表</span>
                <div className="mt-1 space-y-1">
                  {doc.chunksData.map((c) => (
                    <div key={c.id} className="rounded-lg border border-slate-200 p-2 text-sm text-slate-600">{c.content}</div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 pt-3 border-t border-slate-200">
              {doc.status === "已发布" && <button type="button" onClick={() => handlePublish(doc.id)} className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"><Send size={12} className="inline mr-1" />发布上线</button>}
              {doc.status === "已上线" && <button type="button" onClick={() => handleDeactivate(doc.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"><PauseCircle size={12} className="inline mr-1" />停用知识</button>}
            </div>
          </div>
        )}
      </Drawer>

      {/* Gap Drawer */}
      <Drawer open={gapDrawerOpen} title="知识缺口详情" onClose={() => setGapDrawerOpen(false)}>
        {gap && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-sm text-slate-400">问题</span><p className="font-medium">{gap.question}</p></div>
              <div><span className="text-sm text-slate-400">状态</span><StatusBadge status={gap.status} /></div>
              <div><span className="text-sm text-slate-400">来源</span><p>{gap.source}</p></div>
              <div><span className="text-sm text-slate-400">原因</span><p>{gap.reason}</p></div>
              <div><span className="text-sm text-slate-400">出现次数</span><p>{gap.count}次</p></div>
              <div><span className="text-sm text-slate-400">业务线</span><p>{gap.businessLine}</p></div>
            </div>
            {gap.candidateFaq && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                <p className="text-sm font-medium text-blue-700 mb-2">候选知识</p>
                <p className="text-sm text-blue-600">Q: {gap.candidateFaq.question}</p>
                <p className="text-sm text-blue-600 mt-1">A: {gap.candidateFaq.answer}</p>
              </div>
            )}
            <div className="flex gap-2 pt-3 border-t border-slate-200">
              {gap.status === "待处理" && (
                <button type="button" onClick={() => handleGapGenerateCandidate(gap.id)} className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700">生成候选知识</button>
              )}
              {gap.status === "已生成候选知识" && (
                <>
                  <button type="button" onClick={() => handleGapApprove(gap.id)} className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm text-white hover:bg-emerald-600"><Check size={12} className="inline mr-1" />审核通过并发布</button>
                  <button type="button" onClick={() => handleGapReject(gap.id)} className="rounded-lg bg-red-500 px-3 py-1.5 text-sm text-white hover:bg-red-600"><X size={12} className="inline mr-1" />驳回</button>
                </>
              )}
            </div>
          </div>
        )}
      </Drawer>

      {/* Upload Modal */}
      <Modal open={modalUpload} title="上传文档" onClose={() => setModalUpload(false)} size="md">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">文档标题</label>
            <input value={uploadTitle} onChange={(e) => setUploadTitle(e.target.value)} placeholder="输入文档标题" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
          </div>
          <div className="rounded-xl border-2 border-dashed border-slate-300 p-6 text-center cursor-pointer hover:border-blue-300">
            <Upload size={24} className="mx-auto text-slate-400 mb-2" />
            <p className="text-sm text-slate-500">点击或拖拽上传文档 (模拟)</p>
            <p className="text-sm text-slate-400 mt-1">支持 PDF、DOCX、MD、TXT 格式</p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setModalUpload(false)} className="rounded-lg border px-4 py-2 text-sm">取消</button>
          <button type="button" onClick={handleUpload} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">确认上传</button>
        </div>
      </Modal>

      {/* Edit Document Modal */}
      <Modal open={editModalOpen} title="编辑文档" onClose={() => { setEditModalOpen(false); setEditingDocId(null); }} size="md">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">文档标题</label>
            <input
              value={editForm.title}
              onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="输入文档标题"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">文档类型</label>
            <select
              value={editForm.type}
              onChange={(e) => setEditForm((f) => ({ ...f, type: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
            >
              {["FAQ文档", "政策文档", "商品资料", "课程资料", "大健康科普"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">内容</label>
            <textarea
              value={editForm.content}
              onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="输入文档内容"
              rows={4}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => { setEditModalOpen(false); setEditingDocId(null); }} className="rounded-lg border px-4 py-2 text-sm">取消</button>
          <button type="button" onClick={handleEditSave} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">保存</button>
        </div>
      </Modal>
    </div>
  );
}
