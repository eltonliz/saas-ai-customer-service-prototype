import { useState } from "react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { PageProps } from "../../types";
import { ragTraces, tenants, knowledgeDocuments, knowledgeGaps } from "../../data/mockData";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { Drawer } from "../../components/Drawer";
import { BarChart3, Database, Layers, Search, AlertTriangle, TrendingUp } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

export default function RagVectorMonitor({}: PageProps) {
  const rvmReqs = reqs.RagVectorMonitor.find(r => r.badgeLabel === "rag-monitor")?.reqs;
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

  const totalDocs = knowledgeDocuments.length;
  const totalChunks = knowledgeDocuments.reduce((s, d) => s + d.chunks, 0);
  const indexedDocs = knowledgeDocuments.filter((d) => d.status === "已上线" || d.status === "索引中").length;
  const avgRecall = 0.84;
  const avgRerank = 0.79;
  const noRecallCount = 2;
  const gapCount = knowledgeGaps.filter((g) => g.status === "待处理" || g.status === "待生成候选").length;
  const onlineRate = ((indexedDocs / totalDocs) * 100).toFixed(0);

  const recallData = [
    { date: "5/11", value: 0.82 },
    { date: "5/12", value: 0.85 },
    { date: "5/13", value: 0.79 },
    { date: "5/14", value: 0.87 },
    { date: "5/15", value: 0.83 },
    { date: "5/16", value: 0.86 },
    { date: "5/17", value: 0.84 },
  ];

  const rerankData = [
    { name: "高置信(≥0.9)", value: 8, color: "#10B981" },
    { name: "中置信(0.7-0.9)", value: 5, color: "#2563EB" },
    { name: "低置信(<0.7)", value: 2, color: "#F59E0B" },
  ];

  const tenantStats = tenants.map((t) => {
    const docs = knowledgeDocuments.filter((d) => d.tenantId === t.id);
    const gaps = knowledgeGaps.filter((g) => g.tenantId === t.id && (g.status === "待处理" || g.status === "待生成候选"));
    const traces = ragTraces.filter((r) => r.tenantId === t.id);
    const avgConf = traces.length > 0 ? (traces.reduce((s, r) => s + r.confidence, 0) / traces.length * 100).toFixed(0) : "-";
    return {
      id: t.id,
      name: t.name,
      docCount: docs.length,
      onlineCount: docs.filter((d) => d.status === "已上线").length,
      chunkCount: docs.reduce((s, d) => s + d.chunks, 0),
      avgRecall: `${(avgRecall * 100).toFixed(0)}%`,
      gapCount: gaps.length,
      avgConfidence: avgConf === "-" ? "-" : `${avgConf}%`,
      health: gaps.length === 0 ? "健康" : gaps.length <= 2 ? "需关注" : "需优化",
    };
  });

  const tenantDocData = tenantStats.map((t) => ({
    name: t.name,
    count: t.docCount,
  }));

  return (
    <div className="relative">
      {rvmReqs?.map((req, i) => (<RequirementBadge key={req.id} req={req} index={i} />))}
      <h2 className="text-2xl font-bold text-slate-900 mb-4">RAG与向量库监控</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          { icon: <Database size={16} className="text-blue-500" />, label: "文档总量", value: totalDocs, sub: `索引在线率 ${onlineRate}%`, color: "bg-blue-50" },
          { icon: <Layers size={16} className="text-indigo-500" />, label: "切片总量", value: totalChunks, sub: `已索引文档 ${indexedDocs} 篇`, color: "bg-indigo-50" },
          { icon: <Search size={16} className="text-emerald-500" />, label: "平均召回率", value: `${(avgRecall * 100).toFixed(0)}%`, sub: `平均重排分 ${avgRerank.toFixed(2)}`, color: "bg-emerald-50" },
          { icon: <AlertTriangle size={16} className="text-amber-500" />, label: "待处理知识缺口", value: gapCount, sub: `无召回记录 ${noRecallCount} 条`, color: "bg-amber-50" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`rounded-lg ${card.color} p-1.5`}>{card.icon}</div>
              <span className="text-base text-slate-500">{card.label}</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{card.value}</p>
            <p className="text-base text-slate-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-500" />召回率趋势（近7天）
          </h3>
          <div style={{ height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={recallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis domain={[0.7, 0.95]} tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                <Tooltip formatter={(v) => `${((v as number) * 100).toFixed(0)}%`} />
                <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={{ fill: "#2563EB", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <BarChart3 size={16} className="text-indigo-500" />重排分分布
          </h3>
          <div style={{ height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={rerankData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                  {rerankData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 mb-6">
        <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <BarChart3 size={16} className="text-emerald-500" />租户文档数量对比
        </h3>
        <div style={{ height: 230 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tenantDocData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8">
        <h3 className="text-base font-semibold text-slate-700 mb-3">租户级RAG统计</h3>
        <DataTable
          data={tenantStats}
          rowKey={(r) => r.id}
          onRowClick={(r) => setSelectedTenant(r.id)}
          columns={[
            { key: "name", header: "租户", render: (r) => <span className="text-base font-medium">{r.name}</span> },
            { key: "docCount", header: "文档数", render: (r) => <span className="text-base">{r.docCount}</span> },
            { key: "onlineCount", header: "在线", render: (r) => <span className="text-base">{r.onlineCount}</span> },
            { key: "chunkCount", header: "切片", render: (r) => <span className="text-base">{r.chunkCount}</span> },
            { key: "avgRecall", header: "召回率", render: (r) => <span className="text-base">{r.avgRecall}</span> },
            { key: "avgConfidence", header: "置信度", render: (r) => <span className="text-base">{r.avgConfidence}</span> },
            { key: "gapCount", header: "缺口", render: (r) => <span className="text-base text-amber-600">{r.gapCount}</span> },
            { key: "health", header: "健康度", render: (r) => <StatusBadge status={r.health} /> },
          ]}
        />
      </div>

      <Drawer open={!!selectedTenant} title="租户RAG详情" onClose={() => setSelectedTenant(null)}>
        {selectedTenant && (() => {
          const traces = ragTraces.filter((r) => r.tenantId === selectedTenant);
          const tenant = tenants.find((t) => t.id === selectedTenant);
          return (
            <div className="space-y-4 text-base">
              <div className="flex items-center justify-between">
                <span className="font-medium">{tenant?.name}</span>
                <span className="text-base text-slate-400">{traces.length} 条链路记录</span>
              </div>
              <div className="space-y-2">
                {traces.map((t) => (
                  <div key={t.id} className="rounded-lg border border-slate-100 p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base font-medium text-slate-700">{t.question.slice(0, 30)}...</span>
                      <span className="text-base text-slate-400">{t.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-base text-slate-500">
                      <span>置信度 {(t.confidence * 100).toFixed(0)}%</span>
                      <span>最终片段 {t.finalChunks.length} 条</span>
                      <StatusBadge status={t.riskLevel} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}
      </Drawer>
    </div>
  );
}
