import { useMemo, useState } from "react";
import type { Conversation, PageProps } from "../../types";
import { useAppStore } from "../../data/AppStore";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { Drawer } from "../../components/Drawer";
import { conversations as allConvs, conversationMessages, users } from "../../data/mockData";
import { Filter, RotateCcw, Eye } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

type Filters = {
  status: string;
  channel: string;
  intent: string;
  riskLevel: string;
  transferred: string;
};

export default function ConversationManagement({ context }: PageProps) {
  const [filters, setFilters] = useState<Filters>({ status: "", channel: "", intent: "", riskLevel: "", transferred: "" });
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const myConvs = useMemo(() => allConvs.filter((c) => c.tenantId === context.currentTenantId && c.merchantId === context.currentMerchantId), [context]);

  const filtered = useMemo(() => {
    return myConvs.filter((c) => {
      if (filters.status && c.status !== filters.status) return false;
      if (filters.channel && c.channel !== filters.channel) return false;
      if (filters.intent && c.intent !== filters.intent) return false;
      if (filters.riskLevel && c.riskLevel !== filters.riskLevel) return false;
      if (filters.transferred === "已转人工" && !c.transferredToHuman) return false;
      if (filters.transferred === "未转人工" && c.transferredToHuman) return false;
      return true;
    });
  }, [myConvs, filters]);

  function viewDetail(c: Conversation) {
    setSelected(c);
    setDrawerOpen(true);
  }

  function resetFilters() {
    setFilters({ status: "", channel: "", intent: "", riskLevel: "", transferred: "" });
  }

  const statuses = [...new Set(myConvs.map((c) => c.status))];
  const channels = [...new Set(myConvs.map((c) => c.channel))];
  const intents = [...new Set(myConvs.map((c) => c.intent))];
  const levels: string[] = ["低风险", "中风险", "高风险"];
  const transferredOptions = ["已转人工", "未转人工"];

  const convMessages = selected ? conversationMessages.filter((m) => m.conversationId === selected.id) : [];
  const selectedUser = selected ? users.find((u) => u.id === selected.userId) : null;

  const allBadges = reqs.ConversationManagement.map(group => {
    const merged = { ...group.reqs[0], content: group.reqs.map(r => `## ${r.title}\n\n${r.content}`).join('\n\n---\n\n') };
    return <RequirementBadge key={merged.id} req={merged} sectionSelector={group.selector} index={0} />;
  });

  return (
    <div className="relative conv-page">
      {allBadges}
      <h2 className="text-2xl font-bold text-slate-900 mb-4">会话管理</h2>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <Filter size={14} className="text-slate-400" />
        <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="rounded-lg border border-slate-200 px-2 py-1 text-base text-slate-600 outline-none">
          <option value="">全部状态</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.channel} onChange={(e) => setFilters((f) => ({ ...f, channel: e.target.value }))} className="rounded-lg border border-slate-200 px-2 py-1 text-base text-slate-600 outline-none">
          <option value="">全部渠道</option>
          {channels.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.intent} onChange={(e) => setFilters((f) => ({ ...f, intent: e.target.value }))} className="rounded-lg border border-slate-200 px-2 py-1 text-base text-slate-600 outline-none">
          <option value="">全部意图</option>
          {intents.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
        <select value={filters.riskLevel} onChange={(e) => setFilters((f) => ({ ...f, riskLevel: e.target.value }))} className="rounded-lg border border-slate-200 px-2 py-1 text-base text-slate-600 outline-none">
          <option value="">全部风险等级</option>
          {levels.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={filters.transferred} onChange={(e) => setFilters((f) => ({ ...f, transferred: e.target.value }))} className="rounded-lg border border-slate-200 px-2 py-1 text-base text-slate-600 outline-none">
          <option value="">是否转人工</option>
          {transferredOptions.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button type="button" onClick={resetFilters} className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-base text-slate-500 hover:bg-slate-50">
          <RotateCcw size={12} />重置
        </button>
        <span className="text-base text-slate-400 ml-auto">共 {filtered.length} 条</span>
      </div>

      <DataTable
        data={filtered}
        rowKey={(r) => r.id}
        onRowClick={viewDetail}
        columns={[
          { key: "title", header: "会话标题", render: (r) => <span className="font-medium">{r.title}</span> },
          { key: "status", header: "状态", render: (r) => <StatusBadge status={r.status} /> },
          { key: "channel", header: "渠道", render: (r) => <span className="text-base">{r.channel}</span> },
          { key: "intent", header: "意图", render: (r) => <span className="text-base">{r.intent}</span> },
          { key: "risk", header: "风险", render: (r) => <StatusBadge status={r.riskLevel} /> },
          { key: "transferred", header: "转人工", render: (r) => <span className="text-base">{r.transferredToHuman ? "是" : "否"}</span> },
          { key: "created", header: "创建时间", render: (r) => <span className="text-base text-slate-400">{r.createdAt}</span> },
          { key: "action", header: "", render: () => <Eye size={14} className="text-slate-300" /> },
        ]}
      />

      <Drawer open={drawerOpen} title="会话详情" onClose={() => setDrawerOpen(false)}>
        {selected && (
          <div className="space-y-4 text-base">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-base text-slate-400">标题</span><p className="font-medium">{selected.title}</p></div>
              <div><span className="text-base text-slate-400">状态</span><StatusBadge status={selected.status} /></div>
              <div><span className="text-base text-slate-400">渠道</span><p>{selected.channel}</p></div>
              <div><span className="text-base text-slate-400">业务线</span><p>{selected.businessLine}</p></div>
              <div><span className="text-base text-slate-400">意图</span><p>{selected.intent}</p></div>
              <div><span className="text-base text-slate-400">风险等级</span><StatusBadge status={selected.riskLevel} /></div>
              <div><span className="text-base text-slate-400">转人工</span><p>{selected.transferredToHuman ? "是" : "否"}</p></div>
              <div><span className="text-base text-slate-400">满意度</span><p>{selected.satisfaction ? `${selected.satisfaction}/5` : "未评价"}</p></div>
            </div>
            <div>
              <span className="text-base text-slate-400">用户信息</span>
              <p className="text-base mt-1">{selectedUser?.name} · {selectedUser?.maskedPhone} · {selectedUser?.level}</p>
            </div>
            <div>
              <span className="text-base text-slate-400">标签</span>
              <div className="flex gap-1 mt-1">{selected.tags.map((t) => <span key={t} className="rounded-md bg-blue-50 px-2 py-0.5 text-base text-blue-600">{t}</span>)}</div>
            </div>
            <div>
              <span className="text-base text-slate-400">会话摘要</span>
              <p className="text-base text-slate-600 mt-1 bg-slate-50 rounded-lg p-3">{selected.summary}</p>
            </div>
            <div>
              <span className="text-base text-slate-400">消息记录 ({convMessages.length}条)</span>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {convMessages.map((m) => (
                  <div key={m.id} className={`rounded-lg p-2 text-base ${m.sender === "用户" ? "bg-blue-50" : m.sender === "AI客服" ? "bg-indigo-50" : m.sender === "人工客服" ? "bg-emerald-50" : "bg-slate-50"}`}>
                    <span className="font-medium">{m.sender}</span>: {m.content}
                    <span className="text-slate-400 ml-2">{m.time}</span>
                  </div>
                ))}
              </div>
            </div>
            {selected.transferredToHuman && (
              <div>
                <span className="text-base text-slate-400">转人工记录</span>
                <p className="text-base text-slate-600 mt-1">已转接人工客服处理</p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
