import { useMemo, useState } from "react";
import type { Conversation, ConversationStatus, Message, PageProps, Priority, Ticket } from "../../types";
import { useAppStore } from "../../data/AppStore";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { Drawer } from "../../components/Drawer";
import { ChatWindow } from "../../components/ChatWindow";
import { users, orders, customerServiceAgents, weComNotifications } from "../../data/mockData";
import { Send, UserPlus, FilePlus, XCircle, Tag, BookOpen, MessageSquare, ChevronRight, Bot, Search, FileText, Shield, Clock, User, ShoppingBag, Star, AlertTriangle, Info, Database, type LucideIcon } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

type QueueGroup = "待接入" | "AI接待中" | "人工接待中" | "等待用户补充" | "已关联工单" | "已关闭";
type RightTab = "user" | "orders" | "aiSuggestion" | "knowledge" | "records" | "trace";

const groups: QueueGroup[] = ["待接入", "AI接待中", "人工接待中", "等待用户补充", "已关联工单", "已关闭"];
const quickReplies = ["您好，我来帮您核实。", "请提供订单号，我帮您查询。", "为您创建工单进一步处理。", "问题已记录，会尽快处理。", "大健康问题建议咨询专业医生。"];
const skillGroups = ["售前客服", "售后客服", "门店客服", "课程客服", "大健康顾问"];
const rightTabs: { key: RightTab; label: string; icon: LucideIcon }[] = [
  { key: "user", label: "用户信息", icon: User },
  { key: "orders", label: "订单/售后", icon: ShoppingBag },
  { key: "aiSuggestion", label: "AI建议", icon: Bot },
  { key: "knowledge", label: "知识推荐", icon: BookOpen },
  { key: "records", label: "处理记录", icon: FileText },
  { key: "trace", label: "AI链路", icon: Search },
];

function groupOf(status: ConversationStatus): QueueGroup {
  if (status === "等待人工接入" || status === "已创建") return "待接入";
  if (status === "AI接待中") return "AI接待中";
  if (status === "人工接待中") return "人工接待中";
  if (status === "等待用户补充") return "等待用户补充";
  if (status === "已关联工单") return "已关联工单";
  return "已关闭";
}

let tempId = 10000;
function makeMsg(convId: string, sender: Message["sender"], content: string, cardType?: Message["cardType"], cardData?: Record<string, string>): Message {
  return { id: `msg-${tempId++}`, conversationId: convId, sender, content, time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }), status: "已读", cardType, cardData };
}

export default function CustomerServiceWorkbench({ context }: PageProps) {
  const store = useAppStore();
  const { conversations: allConvs, messages, tickets } = store;
  const queue = allConvs.filter((c) => c.tenantId === context.currentTenantId && c.merchantId === context.currentMerchantId);

  const [activeGroup, setActiveGroup] = useState<QueueGroup>("待接入");
  const [selectedId, setSelectedId] = useState(queue.find((c) => groupOf(c.status) === "待接入")?.id ?? queue[0]?.id ?? "");
  const [input, setInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [localTags, setLocalTags] = useState<Record<string, string[]>>({});
  const [notes, setNotes] = useState<Record<string, string[]>>({});
  const [noteInput, setNoteInput] = useState("");
  const [modal, setModal] = useState<"工单" | "转接" | "结束" | null>(null);
  const [ticketForm, setTicketForm] = useState({ title: "", type: "售后工单", priority: "中" as Priority, responsibleParty: "商家客服" });
  const [transferForm, setTransferForm] = useState({ skillGroup: "售后客服", agent: "" });
  const [endReason, setEndReason] = useState("人工已解决");
  const [rightTab, setRightTab] = useState<RightTab>("user");
  const [traceOpen, setTraceOpen] = useState(false);

  const filtered = useMemo(() => queue.filter((c) => groupOf(c.status) === activeGroup), [activeGroup, queue]);
  const selected = queue.find((c) => c.id === selectedId) ?? filtered[0] ?? queue[0];
  const user = users.find((u) => u.id === selected?.userId);
  const currentOrder = orders.find((o) => o.userId === user?.id);
  const currentMessages = selected ? messages.filter((m) => m.conversationId === selected.id) : [];
  const linkedTicket = selected ? tickets.find((t) => t.conversationId === selected.id) : undefined;
  const convTags = selected ? (localTags[selected.id] ?? selected.tags) : [];
  const convNotes = selected ? (notes[selected.id] ?? []) : [];
  const convWeCom = selected ? weComNotifications.filter((n) => n.conversationId === selected.id) : [];
  const recordsBadgeCount = convTags.length + convNotes.length + (linkedTicket ? 1 : 0);

  function accessConversation() {
    if (!selected) return;
    store.updateConversation(selected.id, { status: "人工接待中", transferredToHuman: true });
    store.addMessage(makeMsg(selected.id, "系统", `客服已接入本次会话 · ${new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}`));
    setActiveGroup("人工接待中");
  }

  function sendReply() {
    if (!selected || !input.trim()) return;
    store.addMessage(makeMsg(selected.id, "人工客服", input.trim()));
    store.updateConversation(selected.id, { status: "人工接待中" });
    setInput("");
  }

  function useQuickReply(text: string) {
    setInput(text);
  }

  function addTag() {
    if (!selected || !tagInput.trim()) return;
    setLocalTags((prev) => ({ ...prev, [selected.id]: [...(prev[selected.id] ?? selected.tags), tagInput.trim()] }));
    setTagInput("");
  }

  function addNote() {
    if (!selected || !noteInput.trim()) return;
    setNotes((prev) => ({ ...prev, [selected.id]: [...(prev[selected.id] ?? []), noteInput.trim()] }));
    setNoteInput("");
  }

  function createTicket() {
    if (!selected || !ticketForm.title.trim()) return;
    const newTicket: Ticket = {
      id: `ticket-new-${Date.now()}`,
      tenantId: selected.tenantId,
      merchantId: selected.merchantId,
      storeId: selected.storeId,
      conversationId: selected.id,
      userId: selected.userId,
      title: ticketForm.title,
      type: ticketForm.type,
      status: "已提交",
      priority: ticketForm.priority,
      owner: "待分配",
      responsibleParty: ticketForm.responsibleParty,
      sla: "4小时",
      records: ["从会话创建工单"],
      userConfirm: "用户未确认",
      description: `从会话 ${selected.id} 创建的工单`,
      aiSummary: selected.summary,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.addTicket(newTicket);
    store.addMessage(makeMsg(selected.id, "系统", `已为该会话创建工单：${newTicket.title}（${newTicket.id}）`, "工单卡片", { 工单号: newTicket.id, 标题: newTicket.title, 状态: "已提交" }));
    store.updateConversation(selected.id, { status: "已关联工单" });
    setActiveGroup("已关联工单");
    setModal(null);
    setTicketForm({ title: "", type: "售后工单", priority: "中", responsibleParty: "商家客服" });
  }

  function transferConversation() {
    if (!selected) return;
    const target = transferForm.agent || "自动分配";
    store.addMessage(makeMsg(selected.id, "系统", `会话已转接至 ${transferForm.skillGroup} - ${target}`));
    store.updateConversation(selected.id, { status: "等待人工接入" });
    setActiveGroup("待接入");
    setModal(null);
  }

  function endConversation() {
    if (!selected) return;
    store.addMessage(makeMsg(selected.id, "系统", `会话已结束（${endReason}），等待用户评价`));
    store.updateConversation(selected.id, { status: "已解决", satisfaction: undefined });
    setActiveGroup("已关闭");
    setModal(null);
  }

  const allBadges = reqs.CustomerServiceWorkbench.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);

  return (
    <div className="flex h-[calc(100vh-160px)] gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white relative">
      {allBadges}
      {/* Left: Queue Panel */}
      <div className="w-[300px] shrink-0 border-r border-slate-200 flex flex-col bg-slate-50/30">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-700 mb-3">会话队列</h3>
          <div className="space-y-0.5">
            {groups.map((g) => {
              const count = queue.filter((c) => groupOf(c.status) === g).length;
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => setActiveGroup(g)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-base font-medium transition-colors ${
                    activeGroup === g ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {g}
                  <span className="text-base text-slate-400 bg-slate-200 rounded-full px-2 py-0.5 min-w-[24px] text-center">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={`w-full rounded-lg px-3 py-3 text-left mb-1.5 transition-colors ${
                selectedId === c.id ? "bg-blue-50 border-blue-300 border" : "hover:bg-slate-100 border border-transparent"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-base font-medium text-slate-700 truncate">{c.title.slice(0, 16)}</p>
                {c.riskLevel === "高风险" && <AlertTriangle size={14} className="text-red-500 shrink-0" />}
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <StatusBadge status={c.status} />
              </div>
              <div className="flex items-center gap-2 text-base text-slate-400">
                <span>{c.channel}</span>
                <span>·</span>
                <span>{c.createdAt}</span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-base text-slate-400 py-8">暂无会话</p>
          )}
        </div>
      </div>

      {/* Center: Chat Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3 bg-white">
          <div>
            <h3 className="text-base font-semibold text-slate-800">{selected?.title ?? "选择会话"}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-base text-slate-400">{selected?.intent}</span>
              <span className="text-base text-slate-300">·</span>
              <span className="text-base text-slate-400">{selected?.channel}</span>
              {selected?.riskLevel && <StatusBadge status={selected.riskLevel} />}
            </div>
          </div>
          <div className="flex gap-2">
            {activeGroup === "待接入" && (
              <button type="button" onClick={accessConversation} className="rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700">接入会话</button>
            )}
            <button type="button" onClick={() => setModal("工单")} className="rounded-lg border border-slate-200 px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"><FilePlus size={15} />创建工单</button>
            <button type="button" onClick={() => setModal("转接")} className="rounded-lg border border-slate-200 px-3 py-2 text-base font-medium text-slate-600 hover:bg-slate-50 flex items-center gap-1.5"><UserPlus size={15} />转接</button>
            <button type="button" onClick={() => setModal("结束")} className="rounded-lg border border-red-200 px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 flex items-center gap-1.5"><XCircle size={15} />结束</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-slate-50/50">
          <ChatWindow messages={currentMessages} />
        </div>
        <div className="border-t border-slate-200 p-4 bg-white">
          <div className="flex gap-2 mb-3 flex-wrap">
            {quickReplies.map((qr) => (
              <button key={qr} type="button" onClick={() => useQuickReply(qr)} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-base text-slate-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors">{qr}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendReply()} placeholder="输入回复..." className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-base outline-none focus:border-blue-400" />
            <button type="button" onClick={sendReply} className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700"><Send size={18} /></button>
          </div>
        </div>
      </div>

      {/* Right: Info Panel with Tabs */}
      <div className="w-[420px] shrink-0 border-l border-slate-200 bg-white flex flex-col">
        <div className="border-b border-slate-200 px-2 sticky top-0 z-10 bg-white">
          <div className="flex gap-0 overflow-x-auto">
            {rightTabs.map((tab) => {
              const Icon = tab.icon;
              const badgeCount =
                tab.key === "orders" && currentOrder ? 1 :
                tab.key === "records" && recordsBadgeCount > 0 ? recordsBadgeCount :
                null;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setRightTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-base font-medium whitespace-nowrap transition-colors border-b-2 ${
                    rightTab === tab.key ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-700"
                  }`}
                >
                  <Icon size={15} />{tab.label}
                  {badgeCount !== null && (
                    <span className="ml-0.5 rounded-full bg-slate-200 text-sm px-1.5 py-0.5 text-slate-500 min-w-[18px] text-center leading-none">{badgeCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {/* Tab: User Info */}
          {rightTab === "user" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-800">{user?.name ?? "-"}</p>
                  <p className="text-base text-slate-400">{user?.maskedPhone}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-base text-slate-400">会员等级</span>
                  <p className="text-base font-medium text-slate-700">{user?.level}</p>
                </div>
                <div>
                  <span className="text-base text-slate-400">来源渠道</span>
                  <p className="text-base text-slate-700">{selected?.channel}</p>
                </div>
                <div>
                  <span className="text-base text-slate-400">用户标签</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(user?.tags ?? []).map((t) => (
                      <span key={t} className="rounded-md bg-slate-100 px-2 py-0.5 text-base text-slate-600">{t}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-base text-slate-400">会话意图</span>
                  <p className="text-base text-slate-700">{selected?.intent}</p>
                </div>
                <div>
                  <span className="text-base text-slate-400">风险等级</span>
                  <div className="mt-1"><StatusBadge status={selected?.riskLevel ?? "低风险"} /></div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Orders / AfterSale */}
          {rightTab === "orders" && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-slate-700">订单信息</h4>
              {currentOrder ? (
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ShoppingBag size={16} className="text-blue-500" />
                    <span className="text-base font-medium text-slate-700">{currentOrder.productName}</span>
                  </div>
                  <div className="space-y-2 text-base">
                    <div className="flex justify-between"><span className="text-slate-400">金额</span><span className="font-medium">¥{currentOrder.amount}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">状态</span><StatusBadge status={currentOrder.status} /></div>
                    <div className="flex justify-between"><span className="text-slate-400">物流</span><span>{currentOrder.logistics}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">售后状态</span><span className="text-base">{currentOrder.afterSaleStatus}</span></div>
                  </div>
                </div>
              ) : (
                <p className="text-base text-slate-400 py-4 text-center">暂无订单信息</p>
              )}
              {currentOrder?.afterSaleStatus === "可申请" && (
                <button type="button" className="w-full rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-base text-blue-600 hover:bg-blue-100">申请售后</button>
              )}
            </div>
          )}

          {/* Tab: AI Suggestion */}
          {rightTab === "aiSuggestion" && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-slate-700 flex items-center gap-2"><Bot size={16} className="text-indigo-500" />AI处理摘要</h4>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                <div>
                  <span className="text-base text-slate-400">意图识别</span>
                  <p className="text-base text-slate-700">商品库存咨询 · 置信度 0.91</p>
                </div>
                <div>
                  <span className="text-base text-slate-400">工具调用</span>
                  <p className="text-base text-slate-700">商品库存查询 · 调用成功</p>
                </div>
                <div>
                  <span className="text-base text-slate-400">风控审核</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-base text-emerald-700">通过 · 低风险</span>
                  </div>
                </div>
                <div>
                  <span className="text-base text-slate-400">AI推荐回复</span>
                  <div className="mt-1 rounded-lg bg-white border border-slate-100 p-3 text-base text-slate-700">
                    当前直播专享营养套装库存充足，售价199元。价格以直播间实时页面为准。
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100">
                      <Star size={12} className="text-amber-400" />
                      <span className="text-base text-slate-400">置信度 0.91</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => setInput("当前直播专享营养套装库存充足，售价199元。价格以直播间实时页面为准。")} className="mt-2 w-full rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-base text-blue-600 hover:bg-blue-100">一键填入输入框</button>
                </div>
              </div>
              <button type="button" onClick={() => setTraceOpen(true)} className="w-full flex items-center justify-between rounded-lg border border-slate-200 px-4 py-2.5 text-base text-slate-600 hover:bg-slate-50">
                <span className="flex items-center gap-2"><Search size={14} />查看完整AI链路</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Tab: Knowledge Recommendations */}
          {rightTab === "knowledge" && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-slate-700 flex items-center gap-2"><BookOpen size={16} className="text-violet-500" />推荐知识</h4>
              <div className="space-y-2">
                {[
                  { title: "直播商品库存规则", type: "FAQ", match: "92%" },
                  { title: "直播专享营养套装说明", type: "商品资料", match: "88%" },
                  { title: "直播售后政策V2", type: "政策文档", match: "81%" },
                  { title: "直播间价格说明", type: "FAQ", match: "75%" },
                ].map((k) => (
                  <div key={k.title} className="rounded-lg border border-slate-100 p-3 hover:bg-slate-50 cursor-pointer">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-base text-slate-700">{k.title}</span>
                      <span className="text-base text-emerald-600">{k.match}</span>
                    </div>
                    <span className="text-base text-slate-400">{k.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: Processing Records */}
          {rightTab === "records" && (
            <div className="space-y-5">
              <div>
                <h4 className="text-base font-semibold text-slate-700 mb-2 flex items-center gap-2"><Tag size={14} className="text-blue-500" />会话标签</h4>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {convTags.map((t) => (
                    <span key={t} className="rounded-md bg-blue-50 px-2.5 py-1 text-base text-blue-600">{t}</span>
                  ))}
                  {convTags.length === 0 && <span className="text-base text-slate-400">暂无标签</span>}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="添加标签" className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-base outline-none focus:border-blue-400" />
                  <button type="button" onClick={addTag} className="rounded-lg bg-blue-600 px-3 py-1.5 text-base text-white hover:bg-blue-700"><Tag size={14} /></button>
                </div>
              </div>

              <div>
                <h4 className="text-base font-semibold text-slate-700 mb-2 flex items-center gap-2"><MessageSquare size={14} className="text-slate-500" />内部备注</h4>
                <div className="space-y-2 mb-3">
                  {convNotes.map((n, i) => (
                    <div key={i} className="text-base text-slate-600 bg-slate-50 rounded-lg p-3">{n}</div>
                  ))}
                  {convNotes.length === 0 && <span className="text-base text-slate-400">暂无备注</span>}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={noteInput} onChange={(e) => setNoteInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addNote()} placeholder="添加备注..." className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-base outline-none focus:border-blue-400" />
                  <button type="button" onClick={addNote} className="rounded-lg bg-slate-600 px-3 py-1.5 text-base text-white hover:bg-slate-700"><MessageSquare size={14} /></button>
                </div>
              </div>

              {linkedTicket && (
                <div>
                  <h4 className="text-base font-semibold text-slate-700 mb-2 flex items-center gap-2"><FileText size={14} className="text-violet-500" />关联工单</h4>
                  <div className="rounded-lg border border-slate-200 p-3">
                    <p className="text-base font-medium text-slate-700">{linkedTicket.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={linkedTicket.status} />
                      <span className="text-base text-slate-400">{linkedTicket.owner}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* WeCom Notification Section */}
              <div>
                <h4 className="text-base font-semibold text-slate-700 mb-2 flex items-center gap-2"><MessageSquare size={14} className="text-emerald-500" />企微通知</h4>
                {convWeCom.length > 0 ? (
                  <div className="space-y-3">
                    {convWeCom.map((n) => (
                      <div key={n.id} className="rounded-lg border border-slate-200 p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-base font-medium text-slate-700">{n.target}</span>
                          <StatusBadge status={n.status} />
                        </div>
                        <div className="flex items-center gap-2 text-base text-slate-400">
                          <Clock size={12} />
                          <span>{n.time}</span>
                        </div>
                        <p className="text-base text-slate-600 line-clamp-2">{n.summary}</p>
                        <div className="flex items-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => alert("已重新发送企微通知")}
                            className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-base text-amber-600 hover:bg-amber-100"
                          >
                            重新通知
                          </button>
                          <span className="text-base text-blue-500 cursor-pointer hover:underline">{n.entry}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-slate-400 py-2">暂无企微通知</p>
                )}
              </div>
            </div>
          )}

          {/* Tab: AI Trace Summary */}
          {rightTab === "trace" && (
            <div className="space-y-4">
              <h4 className="text-base font-semibold text-slate-700 flex items-center gap-2"><Search size={16} className="text-indigo-500" />AI链路摘要</h4>
              <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-base text-slate-700">意图识别</span>
                  <span className="text-base text-slate-400 ml-auto">商品库存咨询</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-base text-slate-700">工具调用</span>
                  <span className="text-base text-slate-400 ml-auto">商品库存查询 · 成功</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-base text-slate-700">风控审核</span>
                  <StatusBadge status="低风险" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-base text-slate-400">置信度</span>
                  <span className="text-base font-semibold text-slate-700">0.91</span>
                </div>
              </div>
              <p className="text-base text-slate-400 text-center">完整技术详情请点击下方按钮查看</p>
              <button type="button" onClick={() => setTraceOpen(true)} className="w-full flex items-center justify-between rounded-lg bg-indigo-50 border border-indigo-100 px-4 py-2.5 text-base text-indigo-600 hover:bg-indigo-100">
                <span className="flex items-center gap-2"><Search size={14} />查看完整链路与技术细节</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* AI Trace Drawer (detailed technical info) */}
      <Drawer open={traceOpen} title="AI链路详情" onClose={() => setTraceOpen(false)}>
        <div className="space-y-4 text-base">
          <div className="rounded-xl border border-slate-200 p-4">
            <h4 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2"><Bot size={14} className="text-indigo-500" />基础信息</h4>
            <div className="grid grid-cols-2 gap-3 text-base">
              <div><span className="text-base text-slate-400">意图</span><p>商品库存咨询</p></div>
              <div><span className="text-base text-slate-400">置信度</span><p className="font-semibold">0.91</p></div>
              <div><span className="text-base text-slate-400">模型</span><p>Claude Opus 4.7</p></div>
              <div><span className="text-base text-slate-400">Prompt版本</span><p>v2.3</p></div>
              <div><span className="text-base text-slate-400">Token消耗</span><p>620</p></div>
              <div><span className="text-base text-slate-400">生成延迟</span><p>2,200ms</p></div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h4 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2"><Search size={14} className="text-blue-500" />工具调用详情</h4>
            <div className="space-y-2 text-base">
              <div className="flex justify-between"><span className="text-slate-400">工具名称</span><span>商品库存查询</span></div>
              <div className="flex justify-between"><span className="text-slate-400">调用状态</span><span className="text-emerald-600">成功</span></div>
              <div className="flex justify-between"><span className="text-slate-400">权限校验</span><span className="text-emerald-600">已授权-只读</span></div>
              <div className="flex justify-between"><span className="text-slate-400">是否只读</span><span>是</span></div>
              <div className="flex justify-between"><span className="text-slate-400">调用耗时</span><span>320ms</span></div>
              <div>
                <span className="text-base text-slate-400 block mb-1">输入参数</span>
                <div className="rounded bg-slate-50 p-2 text-base font-mono text-slate-600">查询商品: 直播专享营养套装</div>
              </div>
              <div>
                <span className="text-base text-slate-400 block mb-1">返回结果</span>
                <div className="rounded bg-slate-50 p-2 text-base font-mono text-slate-600">库存充足，实时库存数量已返回</div>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h4 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2"><Shield size={14} className="text-emerald-500" />风控审核详情</h4>
            <div className="space-y-2 text-base">
              <div className="flex justify-between"><span className="text-slate-400">审核结果</span><span className="text-emerald-600">通过</span></div>
              <div className="flex justify-between"><span className="text-slate-400">风险等级</span><StatusBadge status="低风险" /></div>
              <div><span className="text-base text-slate-400 block mb-1">命中规则</span><p>无敏感词命中</p></div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 p-4">
            <h4 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2"><Database size={14} className="text-slate-500" />知识库检索信息</h4>
            <div className="space-y-2 text-base">
              <div className="flex justify-between"><span className="text-slate-400">粗召回数量</span><span>8 条</span></div>
              <div className="flex justify-between"><span className="text-slate-400">重排序数量</span><span>5 条</span></div>
              <div className="flex justify-between"><span className="text-slate-400">最高分片相似度</span><span className="text-emerald-600">0.92</span></div>
            </div>
          </div>
        </div>
      </Drawer>

      {/* Modals */}
      <Modal open={modal === "工单"} title="创建工单" onClose={() => setModal(null)} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1.5">工单标题</label>
            <input type="text" value={ticketForm.title} onChange={(e) => setTicketForm((f) => ({ ...f, title: e.target.value }))} placeholder="请输入工单标题" className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base outline-none focus:border-blue-400" />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1.5">工单类型</label>
            <select value={ticketForm.type} onChange={(e) => setTicketForm((f) => ({ ...f, type: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base outline-none">
              {["售后工单", "投诉工单", "门店工单", "课程工单", "大健康合规工单"].map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1.5">优先级</label>
            <select value={ticketForm.priority} onChange={(e) => setTicketForm((f) => ({ ...f, priority: e.target.value as Priority }))} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base outline-none">
              {["低", "中", "高", "紧急"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-base text-slate-600 hover:bg-slate-50">取消</button>
          <button type="button" onClick={createTicket} className="rounded-lg bg-blue-600 px-4 py-2.5 text-base text-white hover:bg-blue-700">创建工单</button>
        </div>
      </Modal>

      <Modal open={modal === "转接"} title="转接会话" onClose={() => setModal(null)} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1.5">技能组</label>
            <select value={transferForm.skillGroup} onChange={(e) => setTransferForm((f) => ({ ...f, skillGroup: e.target.value, agent: "" }))} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base outline-none">
              {skillGroups.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1.5">转接客服</label>
            <select value={transferForm.agent} onChange={(e) => setTransferForm((f) => ({ ...f, agent: e.target.value }))} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base outline-none">
              <option value="">自动分配</option>
              {customerServiceAgents.filter((a) => a.tenantId === context.currentTenantId).map((a) => <option key={a.id} value={a.name}>{a.name} ({a.status})</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-base text-slate-600 hover:bg-slate-50">取消</button>
          <button type="button" onClick={transferConversation} className="rounded-lg bg-orange-500 px-4 py-2.5 text-base text-white hover:bg-orange-600">确认转接</button>
        </div>
      </Modal>

      <Modal open={modal === "结束"} title="结束会话" onClose={() => setModal(null)} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1.5">结束原因</label>
            <select value={endReason} onChange={(e) => setEndReason(e.target.value)} className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-base outline-none">
              {["AI已解决", "人工已解决", "已创建工单", "用户长时间未回复", "重复咨询"].map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={() => setModal(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-base text-slate-600 hover:bg-slate-50">取消</button>
          <button type="button" onClick={endConversation} className="rounded-lg bg-red-500 px-4 py-2.5 text-base text-white hover:bg-red-600">结束会话</button>
        </div>
      </Modal>
    </div>
  );
}
