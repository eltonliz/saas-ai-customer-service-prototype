import { useState, useMemo } from "react";
import type { PageProps } from "../../types";
import { conversations, conversationMessages, tickets } from "../../data/mockData";
import { StatusBadge } from "../../components/StatusBadge";
import { ChatWindow } from "../../components/ChatWindow";
import { Modal } from "../../components/Modal";
import { Users, MessageSquare, AlertTriangle, CreditCard, Ban, CheckCircle, XCircle, Send, Ticket } from "lucide-react";

type Tab = "conversations" | "tickets";

const platformConvs = [
  { id: "pconv-1", title: "商家咨询平台操作问题", type: "商家咨询", status: "人工接待中", priority: "中", user: "商家运营-张经理", tenant: "星选私域零售", summary: "商家后台数据导出功能无法使用，需要平台协助排查。" },
  { id: "pconv-2", title: "跨商家物流争议", type: "跨商家争议", status: "已创建", priority: "高", user: "用户李女士", tenant: "星选私域零售 / 同城门店联盟", summary: "用户在两家商家购买商品，涉及物流责任争议。" },
  { id: "pconv-3", title: "平台支付异常投诉", type: "支付异常", status: "已关联工单", priority: "紧急", user: "用户王先生", tenant: "同城门店联盟", summary: "到店支付成功后订单状态未更新，涉及支付和订单系统。" },
  { id: "pconv-4", title: "平台投诉-虚假宣传", type: "平台投诉", status: "已创建", priority: "高", user: "用户赵女士", tenant: "知养健康课堂", summary: "用户投诉商家课程宣传与实际内容不符，要求平台介入。" },
  { id: "pconv-5", title: "商家资质审核咨询", type: "商家咨询", status: "已解决", priority: "低", user: "新入驻商家-刘总", tenant: "新入驻", summary: "新商家咨询入驻审核流程和资质要求。" },
];

const platformTickets = [
  { id: "pt-1", title: "支付订单状态同步异常", type: "系统故障", status: "处理中", priority: "紧急", owner: "平台运维-李工", sla: "2小时", createdAt: "2026-05-17 09:30" },
  { id: "pt-2", title: "跨商家物流争议工单", type: "跨商家争议", status: "已分配", priority: "高", owner: "平台客服-王主管", sla: "4小时", createdAt: "2026-05-17 10:15" },
  { id: "pt-3", title: "商家虚假宣传投诉处理", type: "平台投诉", status: "处理中", priority: "高", owner: "平台客服-陈专员", sla: "8小时", createdAt: "2026-05-16 14:20" },
  { id: "pt-4", title: "商家入驻资质复核", type: "审核工单", status: "等待外部反馈", priority: "中", owner: "资质审核-张专员", sla: "24小时", createdAt: "2026-05-16 11:00" },
];

export default function PlatformServiceWorkbench({}: PageProps) {
  const [tab, setTab] = useState<Tab>("conversations");
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [convState, setConvState] = useState(platformConvs);
  const [ticketState, setTicketState] = useState(platformTickets);
  const [createTicketOpen, setCreateTicketOpen] = useState(false);
  const [newTicket, setNewTicket] = useState({ title: "", type: "系统故障", priority: "中", owner: "", sla: "4小时" });

  const activeConv = convState.find((c) => c.id === selectedConv);
  const msgs = useMemo(() => {
    if (!selectedConv) return [];
    return conversationMessages.filter((m) => m.conversationId === "conv-1").slice(0, 4);
  }, [selectedConv]);

  function handleSend() {
    if (!input.trim()) return;
    setInput("");
  }

  function handleAccept(id: string) {
    setConvState((prev) => prev.map((c) => c.id === id ? { ...c, status: "人工接待中" } : c));
  }

  function handleClose(id: string) {
    setConvState((prev) => prev.map((c) => c.id === id ? { ...c, status: "已解决" } : c));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">平台客服工作台</h2>
        <span className="text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-1">仅处理平台责任和兜底场景，不处理商家私有客服会话</span>
      </div>

      <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1 w-fit">
        {([
          { id: "conversations" as Tab, label: "平台会话" },
          { id: "tickets" as Tab, label: "平台工单" },
        ]).map((t) => (
          <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>{t.label}</button>
        ))}
      </div>

      {tab === "conversations" && (
        <div className="flex gap-4 h-[calc(100vh-320px)] min-h-[500px]">
          <div className="w-80 flex-shrink-0 rounded-2xl border border-slate-200 bg-white overflow-y-auto">
            <div className="p-3 border-b border-slate-100">
              <span className="text-sm font-semibold text-slate-500">平台兜底会话队列</span>
            </div>
            {convState.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedConv(c.id)}
                className={`p-3 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedConv === c.id ? "bg-blue-50 border-l-2 border-l-blue-500" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-700">{c.title.slice(0, 18)}</span>
                  <StatusBadge status={c.priority} />
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                  <Users size={10} />{c.user}
                </div>
                <div className="flex items-center gap-1">
                  <StatusBadge status={c.status} />
                  <span className="text-sm text-slate-400">{c.tenant}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex-1 rounded-2xl border border-slate-200 bg-white flex flex-col">
            {activeConv ? (
              <>
                <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-semibold text-slate-700">{activeConv.title}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-slate-400">{activeConv.user}</span>
                      <span className="text-sm text-slate-400">·</span>
                      <span className="text-sm text-slate-400">{activeConv.tenant}</span>
                    </div>
                  </div>
                  <StatusBadge status={activeConv.status} />
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <ChatWindow
                    messages={[
                      ...msgs,
                      ...(activeConv.summary ? [{ id: "summary", conversationId: "", sender: "系统" as const, content: `[摘要] ${activeConv.summary}`, time: "", status: "已读" as const }] : []),
                    ]}
                  />
                </div>

                <div className="p-3 border-t border-slate-100">
                  <div className="flex gap-2 mb-2">
                    {activeConv.status !== "人工接待中" && (
                      <button type="button" onClick={() => handleAccept(activeConv.id)} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"><CheckCircle size={12} />接入</button>
                    )}
                    {activeConv.status === "人工接待中" && (
                      <>
                        <button type="button" onClick={() => setCreateTicketOpen(true)} className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-200"><Ticket size={12} />建工单</button>
                        <button type="button" onClick={() => handleClose(activeConv.id)} className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-50"><XCircle size={12} />结束</button>
                      </>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="输入回复..." className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" />
                    <button type="button" onClick={handleSend} className="rounded-xl bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"><Send size={14} /></button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-sm text-slate-400">
                请从左侧选择一个会话
              </div>
            )}
          </div>

          {activeConv && (
            <div className="w-60 flex-shrink-0 rounded-2xl border border-slate-200 bg-white p-3 overflow-y-auto">
              <h4 className="text-sm font-semibold text-slate-500 mb-2">会话信息</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-slate-400">类型</span><p>{activeConv.type}</p></div>
                <div><span className="text-slate-400">优先级</span><StatusBadge status={activeConv.priority} /></div>
                <div><span className="text-slate-400">用户</span><p>{activeConv.user}</p></div>
                <div><span className="text-slate-400">所属</span><p className="text-slate-500">{activeConv.tenant}</p></div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "tickets" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-700">平台工单列表</h3>
            <button type="button" onClick={() => setCreateTicketOpen(true)} className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"><Ticket size={12} />新建工单</button>
          </div>
          <div className="space-y-2">
            {ticketState.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50 cursor-pointer">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-700">{t.title}</span>
                    <StatusBadge status={t.status} />
                    <StatusBadge status={t.priority} />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span>{t.type}</span>
                    <span>负责人: {t.owner}</span>
                    <span>SLA: {t.sla}</span>
                  </div>
                </div>
                <span className="text-sm text-slate-400">{t.createdAt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 flex items-start gap-2">
        <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-700">
          <p className="font-medium mb-1">平台客服职责边界</p>
          <p>平台客服仅处理：商家咨询平台操作问题、跨商家争议、支付异常、平台投诉、商家资质审核。商家私有的商品/订单/售后/门店咨询由商家自身客服处理。</p>
        </div>
      </div>

      <Modal open={createTicketOpen} title="新建工单" onClose={() => setCreateTicketOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">工单标题</label>
            <input value={newTicket.title} onChange={(e) => setNewTicket((p) => ({ ...p, title: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="输入工单标题" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">类型</label>
              <select value={newTicket.type} onChange={(e) => setNewTicket((p) => ({ ...p, type: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none">
                <option>系统故障</option><option>跨商家争议</option><option>平台投诉</option><option>审核工单</option><option>其他</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">优先级</label>
              <select value={newTicket.priority} onChange={(e) => setNewTicket((p) => ({ ...p, priority: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none">
                <option>低</option><option>中</option><option>高</option><option>紧急</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">负责人</label>
              <input value={newTicket.owner} onChange={(e) => setNewTicket((p) => ({ ...p, owner: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400" placeholder="负责人" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">SLA</label>
              <select value={newTicket.sla} onChange={(e) => setNewTicket((p) => ({ ...p, sla: e.target.value }))} className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm outline-none">
                <option>2小时</option><option>4小时</option><option>8小时</option><option>24小时</option><option>48小时</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setCreateTicketOpen(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">取消</button>
            <button type="button" onClick={() => {
              if (!newTicket.title.trim()) return;
              setTicketState((prev) => [{ id: `pt-${Date.now()}`, ...newTicket, status: "已分配" as const, createdAt: new Date().toISOString().slice(0, 16).replace("T", " ") }, ...prev]);
              setNewTicket({ title: "", type: "系统故障", priority: "中", owner: "", sla: "4小时" });
              setCreateTicketOpen(false);
            }} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">确认创建</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
