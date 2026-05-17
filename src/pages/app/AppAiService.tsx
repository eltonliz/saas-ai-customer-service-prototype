import { useState, useRef, useEffect } from "react";
import type { Message, PageProps } from "../../types";
import { ChatWindow } from "../../components/ChatWindow";
import { Send, UserPlus, Package, ShoppingCart, RotateCcw, Store, GraduationCap, Heart, ThumbsUp, ThumbsDown, Copy, Download, type LucideIcon } from "lucide-react";

const quickTopics = [
  { label: "商品咨询", icon: Package },
  { label: "订单咨询", icon: ShoppingCart },
  { label: "售后咨询", icon: RotateCcw },
  { label: "门店咨询", icon: Store },
  { label: "课程咨询", icon: GraduationCap },
  { label: "大健康咨询", icon: Heart },
];

let msgId = 100;
function makeMsg(convId: string, sender: Message["sender"], content: string, cardType?: Message["cardType"], cardData?: Record<string, string>): Message {
  return { id: `msg-${msgId++}`, conversationId: convId, sender, content, time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }), status: "已读", cardType, cardData };
}

const responses: Record<string, { systemSteps: string[]; reply: string; cardType?: Message["cardType"]; cardData?: Record<string, string> }> = {
  "商品": {
    systemSteps: ["正在为您查询商品信息", "已查询到库存数据", "已完成风控审核"],
    reply: "该商品目前库存充足。如需查看详情或售后规则，我可以继续为您说明。",
    cardType: "商品卡片",
    cardData: { name: "直播专享营养套装", price: "199", stock: "库存充足" },
  },
  "订单": {
    systemSteps: ["已确认您的身份信息", "正在查询订单和物流状态", "已获取最新物流信息"],
    reply: "您的订单当前状态：已发货，物流显示已到达转运中心。如需售后帮助，可进入售后服务页面。",
    cardType: "订单卡片",
    cardData: { orderId: "order-2", status: "运输中", logistics: "已到达深圳转运中心" },
  },
  "售后": {
    systemSteps: ["正在为您匹配售后规则", "已匹配到适用的售后政策", "已完成风控审核"],
    reply: "您可以在订单详情页申请售后，支持退款、退货和换货。商家将在24小时内处理您的申请。",
  },
  "门店": {
    systemSteps: ["正在查询附近门店信息", "已获取门店营业信息"],
    reply: "您附近有2家门店，营业时间为10:00-21:00。到店前建议提前预约，可享受优先服务。",
  },
  "课程": {
    systemSteps: ["正在检索课程权益信息", "已获取课程详情"],
    reply: "已购课程有效期为365天，支持回放和倍速播放。回放入口在'我的-我的课程'中。",
  },
  "大健康": {
    systemSteps: ["正在进行风控合规检查", "已完成分类：健康科普（低风险）", "已生成安全回复"],
    reply: "作为健康科普建议：保持规律作息、均衡饮食和适量运动有助于改善健康状况。我不能进行疾病诊断或用药建议。如持续不适，建议咨询专业医生。",
  },
  "模型错误": {
    systemSteps: ["正在调用模型...", "模型调用失败"],
    reply: "抱歉，模型服务暂时不可用，正在为您转接人工客服...",
  },
  "工具错误": {
    systemSteps: ["正在查询业务数据...", "查询超时"],
    reply: "查询超时，请点击下方按钮重试或转接人工客服。",
  },
  "排队": {
    systemSteps: ["正在评估队列...", "当前咨询高峰"],
    reply: "当前咨询高峰，前面还有3位用户在等待，预计等待2分钟。您也可以先留言，客服稍后回复您。",
  },
};

function BusinessCard({ cardType, cardData }: { cardType: string; cardData: Record<string, string> }) {
  if (cardType === "商品卡片") {
    return (
      <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50">
            <Package size={16} className="text-orange-500" />
          </div>
          <span className="text-base font-semibold text-slate-700">{cardData.name ?? "商品"}</span>
        </div>
        <div className="flex items-center gap-5 text-base">
          <span className="text-red-500 font-semibold">￥{cardData.price ?? "--"}</span>
          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-base font-medium text-emerald-600">{cardData.stock ?? "--"}</span>
        </div>
      </div>
    );
  }
  if (cardType === "订单卡片") {
    return (
      <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">
            <ShoppingCart size={16} className="text-blue-500" />
          </div>
          <span className="text-base font-semibold text-slate-700">订单 {cardData.orderId ?? "--"}</span>
        </div>
        <div className="flex items-center gap-3 text-base">
          <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-base font-medium text-amber-600">{cardData.status ?? "--"}</span>
          <span className="text-slate-500 text-base">{cardData.logistics ?? "--"}</span>
        </div>
      </div>
    );
  }
  if (cardType === "工单卡片") {
    return (
      <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
            <RotateCcw size={16} className="text-violet-500" />
          </div>
          <span className="text-base font-semibold text-slate-700">工单</span>
        </div>
        <div className="space-y-1 text-base">
          {Object.entries(cardData).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-slate-400">{k}</span>
              <span className="text-slate-700 font-medium">{v}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

type ConversationStage = "idle" | "asking-order" | "confirming-after-sale";

export default function AppAiService({ goPage }: PageProps) {
  const [messages, setMessages] = useState<Message[]>([
    makeMsg("app-chat", "AI客服", "您好！我是AI客服助手，请问有什么可以帮您？"),
  ]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [processSteps, setProcessSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [transferred, setTransferred] = useState(false);
  const [ratings, setRatings] = useState<Record<string, "up" | "down" | undefined>>({});
  const [conversationStage, setConversationStage] = useState<ConversationStage>("idle");
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, processSteps]);

  function simulateProcessing(topic: string) {
    setProcessing(true);
    const steps = responses[topic]?.systemSteps ?? ["正在处理您的请求"];
    setProcessSteps(steps);
    setCurrentStepIndex(0);
    let i = 0;
    const timer = setInterval(() => {
      if (i < steps.length) {
        setCurrentStepIndex(i + 1);
        i++;
      } else {
        clearInterval(timer);
        // Show streaming indicator
        const streamId = `msg-${msgId++}`;
        setMessages((prev) => [...prev, { id: streamId, conversationId: "app-chat", sender: "AI客服", content: "▋", time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }), status: "已读" }]);
        setStreamingMsgId(streamId);
        // After delay, replace with full response
        setTimeout(() => {
          const res = responses[topic];
          setMessages((prev) => prev.map(m => m.id === streamId ? {
            ...m,
            content: res?.reply ?? "请重新描述您的问题。",
            cardType: res?.cardType,
            cardData: res?.cardData,
          } : m));
          setProcessSteps([]);
          setCurrentStepIndex(0);
          setProcessing(false);
          setStreamingMsgId(null);
        }, 800);
      }
    }, 800);
  }

  function handleSend() {
    if (!input.trim() || processing) return;
    const text = input.trim();
    setMessages((prev) => [...prev, makeMsg("app-chat", "用户", text)]);
    setInput("");

    // Multi-turn refund flow
    if (text.includes("退款") && conversationStage === "idle") {
      setConversationStage("asking-order");
      setMessages((prev) => [
        ...prev,
        makeMsg("app-chat", "AI客服", "请问是哪一个订单？你可以选择最近订单或输入订单号。"),
      ]);
      return;
    }

    // Check for order selection during asking-order stage
    if (conversationStage === "asking-order") {
      let orderName = "";
      if (text.includes("订单A") || text.includes("营养套装")) {
        orderName = "订单A: 营养套装 ¥199";
      } else if (text.includes("订单B") || text.includes("维生素礼盒")) {
        orderName = "订单B: 维生素礼盒 ¥89";
      } else {
        // User typed something else, try to match
        orderName = text;
      }
      setSelectedOrder(orderName);
      setConversationStage("confirming-after-sale");
      setMessages((prev) => [
        ...prev,
        makeMsg(
          "app-chat",
          "AI客服",
          `已查询到订单【${orderName}】状态为【已签收】，可申请售后。是否帮你进入售后申请？`
        ),
      ]);
      return;
    }

    // Check for confirmation during confirming-after-sale stage
    if (conversationStage === "confirming-after-sale") {
      if (text.includes("是") || text.includes("申请") || text.includes("确认")) {
        setConversationStage("idle");
        setMessages((prev) => [
          ...prev,
          makeMsg(
            "app-chat",
            "AI客服",
            "已为你创建售后申请，请前往【我的-我的售后】查看进度。"
          ),
        ]);
        setSelectedOrder("");
      } else if (text.includes("否") || text.includes("再想想") || text.includes("不用")) {
        setConversationStage("idle");
        setSelectedOrder("");
        setMessages((prev) => [
          ...prev,
          makeMsg("app-chat", "AI客服", "好的，如有需要随时联系我。"),
        ]);
      } else {
        // User typed something unrelated, reset and handle normally
        setConversationStage("idle");
        setSelectedOrder("");
        simulateProcessing("售后");
      }
      return;
    }

    // Exception keyword checks
    if (text.includes("模型错误") || text.includes("系统错误")) {
      simulateProcessing("模型错误");
      return;
    }
    if (text.includes("工具错误") || text.includes("超时") || text.includes("查询失败")) {
      simulateProcessing("工具错误");
      return;
    }
    if (text.includes("排队")) {
      simulateProcessing("排队");
      return;
    }

    const matched = quickTopics.find((t) => text.includes(t.label.replace("咨询", "")) || text.includes(t.label));
    if (matched) {
      const topic = matched.label.replace("咨询", "");
      simulateProcessing(topic);
    } else if (text.includes("人工")) {
      setMessages((prev) => [...prev, makeMsg("app-chat", "系统", "正在为您转接人工客服...")]);
      setTimeout(() => {
        setTransferred(true);
        setMessages((prev) => [...prev, makeMsg("app-chat", "系统", "已为您转人工，请稍候。人工客服将在工作时间内尽快接入。")]);
      }, 1500);
    } else {
      simulateProcessing("商品");
    }
  }

  /** Handle inline action button clicks in the multi-turn flow */
  function handleInlineAction(action: string) {
    if (conversationStage === "asking-order") {
      // User clicked an order button
      setSelectedOrder(action);
      setConversationStage("confirming-after-sale");
      setMessages((prev) => [
        ...prev,
        makeMsg("app-chat", "用户", action),
        makeMsg(
          "app-chat",
          "AI客服",
          `已查询到订单【${action}】状态为【已签收】，可申请售后。是否帮你进入售后申请？`
        ),
      ]);
    } else if (conversationStage === "confirming-after-sale") {
      if (action === "是，申请售后") {
        setConversationStage("idle");
        setMessages((prev) => [
          ...prev,
          makeMsg("app-chat", "用户", "是，申请售后"),
          makeMsg(
            "app-chat",
            "AI客服",
            "已为你创建售后申请，请前往【我的-我的售后】查看进度。"
          ),
        ]);
        setSelectedOrder("");
      } else if (action === "否，我再想想") {
        setConversationStage("idle");
        setMessages((prev) => [
          ...prev,
          makeMsg("app-chat", "用户", "否，我再想想"),
          makeMsg("app-chat", "AI客服", "好的，如有需要随时联系我。"),
        ]);
        setSelectedOrder("");
      }
    }
  }

  function handleTopic(topic: { label: string; icon: LucideIcon }) {
    setInput(topic.label);
    const t = topic.label.replace("咨询", "");
    setMessages((prev) => [...prev, makeMsg("app-chat", "用户", `我想咨询${t}问题`)]);
    simulateProcessing(t);
  }

  // Augment messages with rating UI for the last AI reply
  const augmentedMessages = messages.map((msg, idx) => {
    const isLastAIReply =
      msg.sender === "AI客服" &&
      !messages.slice(idx + 1).some((m) => m.sender === "AI客服");
    return { ...msg, showRating: isLastAIReply };
  });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-blue-600 px-4 py-3">
        <h2 className="text-lg font-semibold text-white">AI客服</h2>
        <p className="text-base text-blue-200 mt-0.5">智能客服助手，随时为您服务</p>
      </div>

      {/* Quick Topics */}
      <div className="bg-white px-4 py-3 border-b border-slate-100">
        <div className="grid grid-cols-3 gap-2">
          {quickTopics.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.label}
                type="button"
                onClick={() => handleTopic(t)}
                disabled={processing}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2.5 text-base font-medium text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50 h-10"
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Slim Processing Indicator */}
      {processing && processSteps.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-1.5 flex items-center gap-2">
          <div className="h-1 flex-1 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStepIndex / processSteps.length) * 100}%` }}
            />
          </div>
          <span className="text-base text-blue-600 shrink-0 animate-pulse">
            {processSteps[currentStepIndex - 1] ?? processSteps[0]}
          </span>
        </div>
      )}

      {/* Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto bg-slate-50">
        <ChatWindow
          messages={augmentedMessages}
          footer={
            <div>
              {/* Inline action buttons for multi-turn flow */}
              {conversationStage === "asking-order" && (
                <div className="px-4 py-3 border-t border-slate-100">
                  <p className="text-sm text-slate-400 mb-2">请选择订单：</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleInlineAction("订单A: 营养套装 ¥199")}
                      className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50">
                          <Package size={14} className="text-orange-500" />
                        </div>
                        <span className="text-base font-semibold text-slate-700">订单A: 营养套装</span>
                      </div>
                      <span className="text-base text-red-500 font-semibold">¥199</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInlineAction("订单B: 维生素礼盒 ¥89")}
                      className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-blue-300 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50">
                          <Package size={14} className="text-violet-500" />
                        </div>
                        <span className="text-base font-semibold text-slate-700">订单B: 维生素礼盒</span>
                      </div>
                      <span className="text-base text-red-500 font-semibold">¥89</span>
                    </button>
                  </div>
                </div>
              )}
              {conversationStage === "confirming-after-sale" && (
                <div className="px-4 py-3 border-t border-slate-100">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleInlineAction("是，申请售后")}
                      className="flex-1 h-11 min-h-[44px] rounded-xl bg-blue-600 text-white font-medium text-base hover:bg-blue-700 transition-colors"
                    >
                      是，申请售后
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInlineAction("否，我再想想")}
                      className="flex-1 h-11 min-h-[44px] rounded-xl border border-slate-200 bg-white text-slate-600 font-medium text-base hover:bg-slate-50 transition-colors"
                    >
                      否，我再想想
                    </button>
                  </div>
                </div>
              )}
              {/* Rating footer */}
              {augmentedMessages.some((m) => m.showRating) ? (
                <div className="flex items-center justify-center gap-3 py-2">
                  <span className="text-base text-slate-400">此回答是否有帮助？</span>
                  <button
                    type="button"
                    onClick={() => {
                      const lastAi = [...augmentedMessages].reverse().find((m) => m.showRating);
                      if (lastAi) {
                        setRatings((prev) => ({ ...prev, [lastAi.id]: prev[lastAi.id] === "up" ? undefined : "up" }));
                      }
                    }}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-base transition-colors ${
                      [...augmentedMessages].reverse().find((m) => m.showRating && ratings[m.id] === "up")
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const lastAi = [...augmentedMessages].reverse().find((m) => m.showRating);
                      if (lastAi) {
                        setRatings((prev) => ({ ...prev, [lastAi.id]: prev[lastAi.id] === "down" ? undefined : "down" }));
                      }
                    }}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-base transition-colors ${
                      [...augmentedMessages].reverse().find((m) => m.showRating && ratings[m.id] === "down")
                        ? "bg-red-100 text-red-700"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <ThumbsDown size={14} />
                  </button>
                </div>
              ) : undefined}
              {/* Action buttons for last AI reply */}
              {augmentedMessages.some((m) => m.showRating) ? (
                <div className="flex items-center justify-center gap-3 py-1 border-t border-slate-100">
                  <button type="button" onClick={() => {
                    const lastAi = [...augmentedMessages].reverse().find(m => m.sender === "AI客服");
                    if (lastAi) {
                      const lastUser = [...messages].reverse().find(m => m.sender === "用户");
                      if (lastUser) {
                        const topic = quickTopics.find(t => lastUser.content.includes(t.label.replace("咨询","")) || lastUser.content.includes(t.label));
                        if (topic) {
                          setMessages(prev => prev.filter(m => m.id !== lastAi.id));
                          simulateProcessing(topic.label.replace("咨询",""));
                        }
                      }
                    }
                  }} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-base text-slate-500 hover:bg-slate-100"><RotateCcw size={14} />重新生成</button>
                  <button type="button" onClick={() => {
                    const lastAi = [...augmentedMessages].reverse().find(m => m.sender === "AI客服");
                    if (lastAi) {
                      navigator.clipboard.writeText(lastAi.content).then(() => alert("已复制到剪贴板")).catch(() => {});
                    }
                  }} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-base text-slate-500 hover:bg-slate-100"><Copy size={14} />复制</button>
                  <button type="button" onClick={() => {
                    const exportData = messages.map(m => ({ sender: m.sender, content: m.content, time: m.time }));
                    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url; a.download = `chat-export-${Date.now()}.json`;
                    a.click(); URL.revokeObjectURL(url);
                  }} className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-base text-slate-500 hover:bg-slate-100"><Download size={14} />导出</button>
                </div>
              ) : undefined}
            </div>
          }
        />
      </div>

      {/* Input bar */}
      <div className="border-t border-slate-200 px-3 py-3 bg-white">
        {transferred && (
          <div className="mb-2 rounded-lg bg-orange-50 border border-orange-100 px-4 py-2.5 text-base text-orange-700">
            已为你转人工，请稍候。如有紧急问题可拨打客服热线 400-800-8888。
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="输入您的问题..."
            disabled={processing}
            className="flex-1 rounded-xl border border-slate-200 px-4 h-11 text-base outline-none focus:border-blue-400 disabled:bg-slate-50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={processing}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shrink-0"
          >
            <Send size={18} />
          </button>
          <button
            type="button"
            onClick={() => {
              setMessages((prev) => [...prev, makeMsg("app-chat", "系统", "正在为您转接人工客服...")]);
              setTransferred(true);
            }}
            disabled={processing || transferred}
            className="flex h-11 items-center gap-1.5 rounded-xl bg-orange-500 px-3 text-white hover:bg-orange-600 disabled:opacity-50 shrink-0 text-base font-medium"
          >
            <UserPlus size={16} />
            转人工
          </button>
        </div>
      </div>
    </div>
  );
}

export { BusinessCard };
