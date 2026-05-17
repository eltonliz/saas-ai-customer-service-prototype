import { useMemo, useState } from "react";
import type { PageProps, Ticket } from "../../types";
import { useAppStore } from "../../data/AppStore";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { Drawer } from "../../components/Drawer";
import { Timeline } from "../../components/Timeline";
import { Filter, RotateCcw, Eye, Plus, UserPlus, ArrowRight, MessageSquare, XCircle, RefreshCw, ArrowUp } from "lucide-react";

type Filters = { status: string; type: string; priority: string; responsibleParty: string };

export default function TicketCenter({ context }: PageProps) {
  const store = useAppStore();
  const myTickets = useMemo(() => store.tickets.filter((t) => t.tenantId === context.currentTenantId && t.merchantId === context.currentMerchantId), [context, store.tickets]);

  const [filters, setFilters] = useState<Filters>({ status: "", type: "", priority: "", responsibleParty: "" });
  const [selected, setSelected] = useState<Ticket | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modal, setModal] = useState<"分配" | "状态" | "记录" | "关闭" | "重开" | "升级" | null>(null);
  const [assignOwner, setAssignOwner] = useState("");
  const [nextStatus, setNextStatus] = useState("");
  const [recordText, setRecordText] = useState("");

  const filtered = useMemo(() => {
    return myTickets.filter((t) => {
      if (filters.status && t.status !== filters.status) return false;
      if (filters.type && t.type !== filters.type) return false;
      if (filters.priority && t.priority !== filters.priority) return false;
      if (filters.responsibleParty && t.responsibleParty !== filters.responsibleParty) return false;
      return true;
    });
  }, [myTickets, filters]);

  function viewDetail(t: Ticket) { setSelected(t); setDrawerOpen(true); }

  function handleAssign() {
    if (!selected || !assignOwner.trim()) return;
    store.updateTicket(selected.id, { status: "已分配", owner: assignOwner });
    setModal(null);
    setAssignOwner("");
  }

  function handleUpdateStatus() {
    if (!selected || !nextStatus) return;
    store.updateTicket(selected.id, { status: nextStatus as Ticket["status"], updatedAt: new Date().toISOString() });
    setModal(null);
    setNextStatus("");
  }

  function handleAddRecord() {
    if (!selected || !recordText.trim()) return;
    store.updateTicket(selected.id, { records: [...selected.records, recordText.trim()] });
    setModal(null);
    setRecordText("");
  }

  function handleClose() {
    if (!selected) return;
    store.updateTicket(selected.id, { status: "已关闭", closedAt: new Date().toISOString() });
    setModal(null);
  }

  function handleReopen() {
    if (!selected) return;
    store.updateTicket(selected.id, { status: "已重开", reopenReason: "用户不认可处理结果" });
    setModal(null);
  }

  function handleEscalate() {
    if (!selected) return;
    store.updateTicket(selected.id, { status: "已升级", priority: "紧急", escalationReason: "超过SLA，升级处理" });
    setModal(null);
  }

  function resetFilters() { setFilters({ status: "", type: "", priority: "", responsibleParty: "" }); }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">工单中心</h2>
        <button type="button" onClick={() => setModal("分配")} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"><Plus size={14} />新建工单</button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3">
        <Filter size={14} className="text-slate-400" />
        <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="rounded-lg border border-slate-200 px-2 py-1 text-sm text-slate-600 outline-none">
          <option value="">全部状态</option>
          {["草稿","已提交","已分配","处理中","等待用户补充","等待外部反馈","已给出结果","待用户确认","已关闭","已重开","已升级"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))} className="rounded-lg border border-slate-200 px-2 py-1 text-sm text-slate-600 outline-none">
          <option value="">全部类型</option>
          {["售后工单","投诉工单","门店工单","课程工单","大健康合规工单"].map((t) => <option key={t}>{t}</option>)}
        </select>
        <select value={filters.priority} onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value }))} className="rounded-lg border border-slate-200 px-2 py-1 text-sm text-slate-600 outline-none">
          <option value="">全部优先级</option>
          {["低","中","高","紧急"].map((p) => <option key={p}>{p}</option>)}
        </select>
        <button type="button" onClick={resetFilters} className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-sm text-slate-500 hover:bg-slate-50"><RotateCcw size={12} />重置</button>
        <span className="text-sm text-slate-400 ml-auto">共 {filtered.length} 条</span>
      </div>

      <DataTable
        data={filtered}
        rowKey={(r) => r.id}
        onRowClick={viewDetail}
        columns={[
          { key: "title", header: "工单标题", render: (r) => <span className="font-medium text-sm">{r.title}</span> },
          { key: "status", header: "状态", render: (r) => <StatusBadge status={r.status} /> },
          { key: "type", header: "类型", render: (r) => <span className="text-sm">{r.type}</span> },
          { key: "priority", header: "优先级", render: (r) => <StatusBadge status={r.priority} /> },
          { key: "owner", header: "负责人", render: (r) => <span className="text-sm">{r.owner}</span> },
          { key: "party", header: "责任方", render: (r) => <span className="text-sm">{r.responsibleParty}</span> },
          { key: "sla", header: "SLA", render: (r) => <span className={`text-sm ${r.status !== "已关闭" ? "text-amber-600 font-medium" : "text-slate-400"}`}>{r.sla}</span> },
          { key: "action", header: "", render: () => <Eye size={14} className="text-slate-300" /> },
        ]}
      />

      <Drawer open={drawerOpen} title="工单详情" onClose={() => setDrawerOpen(false)}>
        {selected && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-sm text-slate-400">标题</span><p className="font-medium">{selected.title}</p></div>
              <div><span className="text-sm text-slate-400">状态</span><StatusBadge status={selected.status} /></div>
              <div><span className="text-sm text-slate-400">类型</span><p>{selected.type}</p></div>
              <div><span className="text-sm text-slate-400">优先级</span><StatusBadge status={selected.priority} /></div>
              <div><span className="text-sm text-slate-400">负责人</span><p>{selected.owner}</p></div>
              <div><span className="text-sm text-slate-400">责任方</span><p>{selected.responsibleParty}</p></div>
              <div><span className="text-sm text-slate-400">SLA</span><p className="text-amber-600 font-medium">{selected.sla}</p></div>
              <div><span className="text-sm text-slate-400">用户确认</span><p>{selected.userConfirm}</p></div>
            </div>
            <div><span className="text-sm text-slate-400">工单描述</span><p className="text-sm text-slate-600 mt-1 bg-slate-50 rounded-lg p-3">{selected.description}</p></div>
            <div><span className="text-sm text-slate-400">处理记录</span>
              <Timeline items={selected.records.map((r) => ({ time: "", title: r, state: "done" as const }))} />
            </div>
            {selected.closedAt && <p className="text-sm text-slate-400">关闭时间: {selected.closedAt}</p>}
            {selected.reopenReason && <p className="text-sm text-orange-600">重开原因: {selected.reopenReason}</p>}
            {selected.escalationReason && <p className="text-sm text-red-600">升级原因: {selected.escalationReason}</p>}

            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
              <button type="button" onClick={() => { setAssignOwner(selected.owner); setModal("分配"); }} className="flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700 hover:bg-blue-100"><UserPlus size={12} />分配负责人</button>
              <button type="button" onClick={() => setModal("状态")} className="flex items-center gap-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-700 hover:bg-amber-100"><ArrowRight size={12} />更新状态</button>
              <button type="button" onClick={() => setModal("记录")} className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100"><MessageSquare size={12} />添加记录</button>
              {selected.status !== "已关闭" && <button type="button" onClick={() => setModal("关闭")} className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100"><XCircle size={12} />关闭</button>}
              {selected.status === "已关闭" && <button type="button" onClick={() => setModal("重开")} className="flex items-center gap-1 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm text-orange-600 hover:bg-orange-100"><RefreshCw size={12} />重开工单</button>}
              <button type="button" onClick={() => setModal("升级")} className="flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-600 hover:bg-red-100"><ArrowUp size={12} />升级工单</button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Modals for actions */}
      <Modal open={modal === "分配"} title="分配负责人" onClose={() => setModal(null)} size="sm">
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-1">负责人</label>
          <input type="text" value={assignOwner} onChange={(e) => setAssignOwner(e.target.value)} placeholder="输入负责人姓名" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setModal(null)} className="rounded-lg border px-4 py-2 text-sm">取消</button>
          <button type="button" onClick={handleAssign} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">确认分配</button>
        </div>
      </Modal>

      <Modal open={modal === "状态"} title="更新状态" onClose={() => setModal(null)} size="sm">
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-1">新状态</label>
          <select value={nextStatus} onChange={(e) => setNextStatus(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none">
            <option value="">选择状态</option>
            {["处理中","等待用户补充","等待外部反馈","已给出结果","待用户确认"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setModal(null)} className="rounded-lg border px-4 py-2 text-sm">取消</button>
          <button type="button" onClick={handleUpdateStatus} className="rounded-lg bg-amber-500 px-4 py-2 text-sm text-white">确认更新</button>
        </div>
      </Modal>

      <Modal open={modal === "记录"} title="添加处理记录" onClose={() => setModal(null)} size="sm">
        <div>
          <label className="block text-sm font-medium text-slate-500 mb-1">处理记录</label>
          <textarea value={recordText} onChange={(e) => setRecordText(e.target.value)} placeholder="输入处理内容..." className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none" rows={3} />
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setModal(null)} className="rounded-lg border px-4 py-2 text-sm">取消</button>
          <button type="button" onClick={handleAddRecord} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">确认添加</button>
        </div>
      </Modal>

      <Modal open={modal === "关闭"} title="关闭工单" onClose={() => setModal(null)} size="sm">
        <p className="text-sm text-slate-600">确认关闭工单「{selected?.title}」？</p>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setModal(null)} className="rounded-lg border px-4 py-2 text-sm">取消</button>
          <button type="button" onClick={handleClose} className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white">确认关闭</button>
        </div>
      </Modal>

      <Modal open={modal === "重开"} title="重开工单" onClose={() => setModal(null)} size="sm">
        <p className="text-sm text-slate-600">确认重开工单「{selected?.title}」？</p>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setModal(null)} className="rounded-lg border px-4 py-2 text-sm">取消</button>
          <button type="button" onClick={handleReopen} className="rounded-lg bg-orange-500 px-4 py-2 text-sm text-white">确认重开</button>
        </div>
      </Modal>

      <Modal open={modal === "升级"} title="升级工单" onClose={() => setModal(null)} size="sm">
        <p className="text-sm text-slate-600">确认升级工单「{selected?.title}」？升级后优先级将变为「紧急」。</p>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setModal(null)} className="rounded-lg border px-4 py-2 text-sm">取消</button>
          <button type="button" onClick={handleEscalate} className="rounded-lg bg-red-500 px-4 py-2 text-sm text-white">确认升级</button>
        </div>
      </Modal>
    </div>
  );
}
