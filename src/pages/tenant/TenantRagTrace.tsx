import { useState } from "react";
import type { PageProps, RagTrace, RagChunk } from "../../types";
import { ragTraces } from "../../data/mockData";
import { useAppStore } from "../../data/AppStore";
import { StatusBadge } from "../../components/StatusBadge";
import { Timeline } from "../../components/Timeline";
import { Search, Zap, Layers, Filter, FileText, BarChart3, AlertTriangle, Wrench, MessageSquare, BookOpen, Plus } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

/* ──── Chunk table with fixed column widths to prevent vertical text ──── */
function ChunkTable({ chunks }: { chunks: RagChunk[] }) {
  if (chunks.length === 0) {
    return <p className="text-base text-slate-400 text-center py-6">暂无数据</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="min-w-[960px] table-fixed w-full text-base">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="w-[48px] text-center px-2 py-2.5 text-base font-semibold text-slate-600">#</th>
            <th className="w-[230px] text-left px-3 py-2.5 text-base font-semibold text-slate-600">文档/标题</th>
            <th className="text-left px-3 py-2.5 text-base font-semibold text-slate-600">摘要</th>
            <th className="w-[110px] text-center px-2 py-2.5 text-base font-semibold text-slate-600">相似度</th>
            <th className="w-[120px] text-center px-2 py-2.5 text-base font-semibold text-slate-600">进入重排</th>
          </tr>
        </thead>
        <tbody>
          {chunks.map((c, i) => (
            <tr key={c.id ?? i} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 56 }}>
              <td className="px-2 py-3 text-base text-slate-400 text-center">{c.rank}</td>
              <td className="px-3 py-3 whitespace-normal break-words leading-7">
                <p className="text-base font-medium text-slate-800">{c.documentName}</p>
                <p className="text-base text-slate-400">{c.title}</p>
              </td>
              <td className="px-3 py-3 whitespace-normal break-words leading-7">
                <p className="text-base text-slate-600">{c.summary}</p>
              </td>
              <td className="px-2 py-3 text-center">
                <span className={`inline-flex rounded-md px-2 py-0.5 text-base font-medium ${
                  c.similarity >= 0.9 ? "bg-emerald-50 text-emerald-700" :
                  c.similarity >= 0.7 ? "bg-amber-50 text-amber-700" :
                  "bg-slate-100 text-slate-600"
                }`}>
                  {(c.similarity * 100).toFixed(0)}%
                </span>
              </td>
              <td className="px-2 py-3 text-center">
                <span className={`inline-flex rounded-md px-2 py-0.5 text-base font-medium ${c.rerank >= 0.65 ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {c.rerank >= 0.65 ? "是" : "否"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ──── Main component ──── */
export default function TenantRagTrace({ context }: PageProps) {
  const store = useAppStore();
  const myTraces = ragTraces.filter((t) => t.tenantId === context.currentTenantId);
  const [selected, setSelected] = useState<RagTrace>(myTraces[0] ?? ragTraces[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [addedToGapPool, setAddedToGapPool] = useState<Set<string>>(new Set());

  const showGapButton =
    selected.enteredKnowledgeGap ||
    selected.confidence < 0.7 ||
    (selected.feedback && selected.feedback.length > 0);

  function handleAddToGapPool() {
    const gap = {
      id: `gap-${Date.now()}`,
      tenantId: context.currentTenantId,
      merchantId: context.currentMerchantId,
      storeId: selected.storeId,
      conversationId: selected.conversationId,
      channel: selected.channel,
      businessLine: selected.businessLine,
      intent: selected.intent,
      count: 1,
      feedback: selected.feedback || "",
      source: "rag-trace",
      question: selected.question,
      reason: selected.confidence < 0.7 ? `置信度过低(${Math.round(selected.confidence * 100)}%)，RAG检索未召回相关知识` : selected.feedback ? `用户负面反馈: ${selected.feedback}` : selected.enteredKnowledgeGap ? "系统检测到知识缺口，需补充知识库" : "知识覆盖不足",
      candidate: "",
      status: "待处理" as const,
    };
    store.addKnowledgeGap(gap);
    alert("已加入知识缺口池");
    setAddedToGapPool((prev) => new Set(prev).add(selected.id));
  }

  const filteredTraces = searchQuery
    ? myTraces.filter(
        (t) =>
          t.question.includes(searchQuery) ||
          t.intent.includes(searchQuery) ||
          t.primaryIntent.includes(searchQuery)
      )
    : myTraces;

  const timelineSteps = [
    { time: selected.timeline[0] ?? "", title: "接收用户问题", detail: selected.question, state: "done" as const },
    { time: selected.timeline[1] ?? "", title: "改写检索问题", detail: selected.rewrittenQuestion, state: "done" as const },
    { time: selected.timeline[2] ?? "", title: "向量化", state: "done" as const },
    { time: selected.timeline[3] ?? "", title: "粗召回", detail: `${selected.retrievalChunks.length} 个片段`, state: "done" as const },
    { time: selected.timeline[4] ?? "", title: "重排", detail: `${selected.rerankChunks.length} 个片段`, state: "done" as const },
    { time: selected.timeline[5] ?? "", title: "拼接Prompt", detail: `Token预算: ${selected.tokenBudget}`, state: "done" as const },
    { time: selected.timeline[6] ?? "", title: "大模型生成", detail: `${selected.modelName} · 耗时${selected.generationLatency}ms · 输出${selected.outputTokens}token`, state: "done" as const },
    { time: selected.timeline[7] ?? "", title: "风控审核", detail: selected.riskPassed ? "通过" : `拦截-${selected.riskLevel}`, state: selected.riskPassed ? "done" as const : "error" as const },
    { time: selected.timeline[8] ?? "", title: "返回用户", state: "done" as const },
    { time: selected.timeline[9] ?? "", title: "日志归档", detail: selected.sampleType, state: "pending" as const },
  ];

  const allBadges = reqs.TenantRagTrace.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);

  return (
    <div className="flex flex-col h-full relative">
      {allBadges}
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-50">
          <Layers size={18} className="text-violet-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">RAG链路追踪</h2>
          <p className="text-base text-slate-500 mt-0.5">
            全链路追踪AI客服处理过程，从用户提问到最终回答
          </p>
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex gap-5 flex-1" style={{ minHeight: "calc(100vh - 200px)", maxHeight: "calc(100vh - 160px)" }}>
        {/* ======== LEFT COLUMN: Trace List ======== */}
        <div className="w-80 flex-shrink-0 flex flex-col">
          <div className="rounded-xl border border-slate-200 bg-white flex flex-col h-full overflow-hidden">
            <div className="p-3 border-b border-slate-100">
              <div className="relative trace-page">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索链路..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-base rounded-lg border border-slate-200 bg-slate-50 placeholder:text-slate-400 focus:outline-none focus:border-blue-300 focus:ring-1 focus:ring-blue-100 focus:bg-white transition-colors"
                />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-base text-slate-500">
                  共 {filteredTraces.length} 条记录
                </span>
                <button type="button" className="flex items-center gap-1 text-base text-slate-400 hover:text-slate-600 transition-colors">
                  <Filter size={12} />
                  <span>筛选</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
              {filteredTraces.map((t) => {
                const isActive = selected.id === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelected(t)}
                    className={`w-full rounded-lg p-3 text-left transition-all ${
                      isActive
                        ? "border-2 border-blue-400 bg-blue-50 shadow-sm"
                        : "border border-slate-100 bg-white hover:border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-base font-medium text-slate-800 line-clamp-2 leading-snug">
                        {t.question}
                      </span>
                      <span className="flex-shrink-0">
                        <StatusBadge status={t.riskLevel} />
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-base text-slate-500">
                      <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-base text-slate-600">
                        {t.intent}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span>{t.businessLine}</span>
                    </div>
                    <p className="text-base text-slate-400 mt-1.5">{t.time}</p>
                  </button>
                );
              })}
              {filteredTraces.length === 0 && (
                <div className="text-center py-8 text-base text-slate-400">
                  没有匹配的链路记录
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ======== CENTER COLUMN: Processing Timeline ======== */}
        <div className="flex-1 min-w-0">
          <div className="rounded-xl border border-slate-200 bg-white p-8 h-full overflow-y-auto">
            <h3 className="text-base font-semibold text-slate-700 mb-5 flex items-center gap-2">
              <div className="flex items-center justify-center w-6 h-6 rounded bg-violet-50">
                <Zap size={13} className="text-violet-500" />
              </div>
              处理链路
            </h3>
            <Timeline items={timelineSteps} />
          </div>
        </div>

        {/* ======== RIGHT COLUMN: 12 Info Cards ======== */}
        <div className="w-[420px] flex-shrink-0 overflow-y-auto space-y-3">

          {showGapButton && !addedToGapPool.has(selected.id) && (
            <div className="rounded-xl border-2 border-amber-300 bg-amber-50 p-4 flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-base font-semibold text-amber-800 mb-1">建议加入知识缺口池</p>
                <p className="text-base text-amber-600 mb-2">
                  {selected.confidence < 0.7 ? `置信度仅${(selected.confidence * 100).toFixed(0)}%，知识覆盖不足` : selected.feedback ? "用户有负面反馈" : "该问题已进入知识缺口流程"}
                </p>
                <button
                  type="button"
                  onClick={handleAddToGapPool}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-base font-medium text-white hover:bg-amber-700 h-10"
                >
                  <Plus size={16} />
                  加入知识缺口池
                </button>
              </div>
            </div>
          )}

          {/* 1. 基础信息 */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <FileText size={14} className="text-blue-500" />
              基础信息
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-base">
              <div><span className="text-slate-400">租户</span><p className="text-slate-700 mt-0.5 font-medium">{selected.tenantName}</p></div>
              <div><span className="text-slate-400">商家</span><p className="text-slate-700 mt-0.5 font-medium">{selected.merchantName}</p></div>
              <div><span className="text-slate-400">业务线</span><p className="text-slate-700 mt-0.5">{selected.businessLine}</p></div>
              <div><span className="text-slate-400">渠道</span><p className="text-slate-700 mt-0.5">{selected.channel}</p></div>
              <div><span className="text-slate-400">用户类型</span><p className="text-slate-700 mt-0.5">{selected.userType}</p></div>
              <div><span className="text-slate-400">置信度</span><p className="text-slate-700 mt-0.5 font-medium">{(selected.confidence * 100).toFixed(0)}%</p></div>
            </div>
          </div>

          {/* 2. 用户问题 */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <MessageSquare size={14} className="text-blue-500" />
              用户问题
            </h3>
            <p className="text-base text-slate-700 bg-slate-50 rounded-lg p-3 leading-relaxed">{selected.question}</p>
          </div>

          {/* 3. 意图与实体 */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <BarChart3 size={14} className="text-indigo-500" />
              意图与实体
            </h3>
            <div className="space-y-3">
              <div>
                <span className="text-base text-slate-400">意图分类</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex rounded-md bg-blue-50 px-2 py-0.5 text-base font-medium text-blue-700">{selected.primaryIntent}</span>
                  <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-base text-slate-500">{selected.secondaryIntent}</span>
                </div>
              </div>
              <div>
                <span className="text-base text-slate-400">实体提取</span>
                <div className="flex gap-1.5 mt-1 flex-wrap">
                  {selected.entities.map((e) => (
                    <span key={e} className="inline-flex rounded-md bg-violet-50 px-2 py-0.5 text-base font-medium text-violet-600">{e}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-base text-slate-400">改写后问题</span>
                <p className="text-base text-slate-600 mt-1 bg-slate-50 rounded-md p-2 leading-relaxed">{selected.rewrittenQuestion}</p>
              </div>
            </div>
          </div>

          {/* 4. 粗召回片段 */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Search size={14} className="text-cyan-500" />
              粗召回片段 ({selected.retrievalChunks.length})
            </h3>
            <ChunkTable chunks={selected.retrievalChunks} />
          </div>

          {/* 5. 重排结果 */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Layers size={14} className="text-violet-500" />
              重排结果 ({selected.rerankChunks.length})
            </h3>
            <ChunkTable chunks={selected.rerankChunks} />
          </div>

          {/* 6. Prompt拼接 */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <FileText size={14} className="text-purple-500" />
              Prompt拼接
            </h3>
            <div className="space-y-2 text-base">
              <div className="rounded-lg bg-purple-50 border border-purple-100 p-2.5">
                <p className="text-base font-medium text-purple-700 mb-1">System Prompt</p>
                <p className="text-base text-slate-600">{selected.systemPromptSummary}</p>
              </div>
              <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-2.5">
                <p className="text-base font-medium text-indigo-700 mb-1">RAG Prompt</p>
                <p className="text-base text-slate-600">{selected.ragPromptSummary}</p>
              </div>
              <div className="flex items-center gap-5 text-base text-slate-500 pt-1">
                <span>Token预算: <strong className="text-slate-700">{selected.tokenBudget.toLocaleString()}</strong></span>
                <span>Prompt版本: <strong className="text-slate-700">{selected.promptVersion}</strong></span>
              </div>
            </div>
          </div>

          {/* 7. 业务工具调用结果 */}
          {selected.toolCallResults && selected.toolCallResults.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Wrench size={14} className="text-amber-500" />
                业务工具调用结果
              </h3>
              <div className="space-y-2">
                {selected.toolCallResults.map((tc, i) => (
                  <div key={i} className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                    <p className="text-base font-medium text-slate-700 mb-1">{tc.name}</p>
                    <p className="text-base text-slate-600">{tc.result}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. 模型生成 */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Zap size={14} className="text-amber-500" />
              模型生成
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-base mb-3">
              <div><span className="text-slate-400">模型</span><p className="text-slate-700 mt-0.5 font-medium">{selected.modelName}</p></div>
              <div><span className="text-slate-400">Prompt版本</span><p className="text-slate-700 mt-0.5">{selected.promptVersion}</p></div>
              <div><span className="text-slate-400">Token预算</span><p className="text-slate-700 mt-0.5 font-medium">{selected.tokenBudget.toLocaleString()}</p></div>
              <div><span className="text-slate-400">输出Token</span><p className="text-slate-700 mt-0.5 font-medium">{selected.outputTokens.toLocaleString()}</p></div>
              <div><span className="text-slate-400">生成耗时</span><p className="text-slate-700 mt-0.5">{selected.generationLatency}ms</p></div>
              <div><span className="text-slate-400">Token费用</span><p className="text-slate-700 mt-0.5 font-medium text-amber-600">${selected.tokenCost.toFixed(3)}</p></div>
            </div>
            {selected.candidateAnswer && (
              <div className="rounded-lg bg-amber-50 border border-amber-100 p-2.5">
                <p className="text-base font-medium text-amber-700 mb-1">候选回答</p>
                <p className="text-base text-slate-600 leading-relaxed">{selected.candidateAnswer}</p>
              </div>
            )}
          </div>

          {/* 9. 风控审核 */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-500" />
              风控审核
            </h3>
            <div className="space-y-2.5 text-base">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">风险等级</span>
                <StatusBadge status={selected.riskLevel} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">审核结果</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-base font-medium ${selected.riskPassed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                  {selected.riskPassed ? "通过" : "拦截"}
                </span>
              </div>
              {selected.riskRules.length > 0 && (
                <div>
                  <span className="text-slate-400">命中规则</span>
                  <div className="mt-1.5 space-y-1">
                    {selected.riskRules.map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-base text-slate-600">
                        <span className="w-1 h-1 rounded-full bg-slate-400 flex-shrink-0" />
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-slate-400">处置动作</span>
                <span className="text-slate-700 font-medium">{selected.safetyAction}</span>
              </div>
            </div>
          </div>

          {/* 10. 最终结果 */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <MessageSquare size={14} className="text-emerald-500" />
              最终结果
            </h3>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
              <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">{selected.finalAnswer}</p>
            </div>
          </div>

          {/* 11. 用户反馈 */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <FileText size={14} className="text-slate-500" />
              用户反馈
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-base">
              <div><span className="text-slate-400">样本类型</span><p className="text-slate-700 mt-0.5 font-medium">{selected.sampleType}</p></div>
              <div><span className="text-slate-400">用户反馈</span><p className="text-slate-700 mt-0.5">{selected.feedback || "暂无"}</p></div>
              <div>
                <span className="text-slate-400">已回复用户</span>
                <p className="mt-0.5">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-base font-medium ${selected.repliedToUser ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {selected.repliedToUser ? "是" : "否"}
                  </span>
                </p>
              </div>
              <div>
                <span className="text-slate-400">转人工</span>
                <p className="mt-0.5">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-base font-medium ${selected.transferredToHuman ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-500"}`}>
                    {selected.transferredToHuman ? "是" : "否"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* 12. 知识缺口状态 */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <BookOpen size={14} className="text-orange-500" />
              知识缺口状态
            </h3>
            <div className="space-y-2.5 text-base">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">是否进入知识缺口</span>
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-base font-medium ${selected.enteredKnowledgeGap ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
                  {selected.enteredKnowledgeGap ? "是 — 需补充知识" : "否 — 知识覆盖充分"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">最终置信度</span>
                <span className={`text-base font-medium ${selected.confidence >= 0.8 ? "text-emerald-600" : selected.confidence >= 0.6 ? "text-amber-600" : "text-red-600"}`}>
                  {(selected.confidence * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">入Prompt片段数</span>
                <span className="text-base font-medium text-slate-700">{selected.finalChunks.length}</span>
              </div>
            </div>
            {addedToGapPool.has(selected.id) && (
              <div className="mt-3 pt-3 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-base font-medium text-emerald-700">
                  <BookOpen size={14} />
                  已加入知识缺口池
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
