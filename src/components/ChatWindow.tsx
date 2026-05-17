import type { Message } from "../types";
import { User, Bot, UserCheck, Package, FileText, Ticket } from "lucide-react";

interface ChatWindowProps {
  messages: Message[];
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const cardIcons: Record<string, typeof Package> = {
  "商品卡片": Package,
  "订单卡片": FileText,
  "工单卡片": Ticket,
  "库存查询": Package,
  "库存查询结果": Package,
  "物流查询": FileText,
  "物流查询结果": FileText,
};

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.sender === "用户";
  const isSystem = msg.sender === "系统";

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="rounded-full bg-amber-50 border border-amber-100 px-4 py-1.5 text-base text-amber-700">{msg.content}</span>
      </div>
    );
  }

  function BusinessResultCard({ cardType, cardData }: { cardType: string; cardData: Record<string, string> }) {
    // Product card: name + price highlighted + stock badge + activity tag
    if (cardType === "商品卡片") {
      return (
        <div className="mt-2 rounded-xl border border-orange-200 bg-orange-50/50 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 text-lg font-bold">商</div>
            <div>
              <p className="text-base font-semibold text-slate-800">{cardData.name ?? "商品"}</p>
              <p className="text-xl font-bold text-red-500 mt-0.5">￥{cardData.price ?? "--"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-base font-medium text-emerald-700">{cardData.stock ?? "--"}</span>
            {cardData.activity && <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-base font-medium text-red-600">{cardData.activity}</span>}
          </div>
        </div>
      );
    }
    // Order card: order number + StatusBadge + logistic progress + after-sale entry
    if (cardType === "订单卡片") {
      return (
        <div className="mt-2 rounded-xl border border-blue-200 bg-blue-50/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-base font-semibold text-slate-700">订单 {cardData.orderId ?? "--"}</p>
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-base font-medium text-amber-700">{cardData.status ?? "--"}</span>
          </div>
          <div className="space-y-1.5 text-base text-slate-600">
            {cardData.logistics && <p>物流: {cardData.logistics}</p>}
            {cardData.amount && <p>金额: <span className="font-semibold text-slate-800">￥{cardData.amount}</span></p>}
          </div>
          <button type="button" className="mt-2 text-base text-blue-600 font-medium hover:text-blue-800">查看售后入口 →</button>
        </div>
      );
    }
    // Inventory card: product + spec + stock count + price + "view chain" button
    if (cardType === "库存查询" || cardType === "库存查询结果") {
      return (
        <div className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-base font-semibold text-slate-700">{cardData.name ?? "商品"}</p>
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-base font-medium text-emerald-700">库存: {cardData.stock ?? "--"}</span>
          </div>
          {cardData.spec && <p className="text-base text-slate-600 mb-1">规格: {cardData.spec}</p>}
          {cardData.price && <p className="text-base text-slate-600 mb-2">价格: ￥{cardData.price}</p>}
          {cardData.queryMethod && <p className="text-base text-slate-400 mb-2">查询方式: {cardData.queryMethod}</p>}
          <button type="button" className="text-base text-emerald-600 font-medium hover:text-emerald-800">查看链路 →</button>
        </div>
      );
    }
    // Logistics card: status + latest location + timeline + query time + "view chain" button
    if (cardType === "物流查询" || cardType === "物流查询结果") {
      return (
        <div className="mt-2 rounded-xl border border-cyan-200 bg-cyan-50/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-base font-semibold text-slate-700">{cardData.orderId ? `订单 ${cardData.orderId}` : "物流"}</p>
            <span className="inline-flex rounded-full bg-cyan-100 px-3 py-1 text-base font-medium text-cyan-700">{cardData.status ?? "运输中"}</span>
          </div>
          {cardData.location && <p className="text-base text-slate-600 mb-1">最新位置: {cardData.location}</p>}
          {cardData.timeline && <p className="text-base text-slate-500 mb-1">时间线: {cardData.timeline}</p>}
          {cardData.queryTime && <p className="text-base text-slate-400 mb-2">查询时间: {cardData.queryTime}</p>}
          <button type="button" className="text-base text-cyan-600 font-medium hover:text-cyan-800">查看链路 →</button>
        </div>
      );
    }
    // Fallback: generic card (keep the original approach for unknown types)
    return (
      <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="flex items-center gap-2 text-base font-semibold text-slate-600 mb-2">
          {cardIcons[cardType] && (() => { const CI = cardIcons[cardType]; return <CI size={16} />; })()}
          {cardType}
        </div>
        <div className="space-y-1">
          {Object.entries(cardData).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2 text-base">
              <span className="text-slate-400">{k}</span>
              <span className="text-slate-700 font-medium">{v}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const isAI = msg.sender === "AI客服";
  const IconComp = isUser ? User : isAI ? Bot : UserCheck;
  const bubbleBg = isUser ? "bg-blue-600 text-white" : "bg-white border border-slate-200 text-slate-800";
  const avatarBg = isUser ? "bg-blue-500" : isAI ? "bg-indigo-500" : "bg-emerald-500";

  return (
    <div className={`flex gap-3 my-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${avatarBg} text-white`}>
        <IconComp size={16} />
      </div>
      <div className={`max-w-[72%] ${isUser ? "items-end" : "items-start"}`}>
        <p className="text-base text-slate-400 mb-1 px-1">{isUser ? "我" : msg.sender}</p>
        <div className={`rounded-2xl px-4 py-2.5 text-base leading-relaxed ${bubbleBg} ${isUser ? "rounded-tr-md" : "rounded-tl-md"}`}>
          {msg.content}
        </div>
        {msg.cardType && msg.cardData && <BusinessResultCard cardType={msg.cardType} cardData={msg.cardData} />}
        <p className="text-base text-slate-400 mt-1 px-1">{msg.time}</p>
      </div>
    </div>
  );
}

export function ChatWindow({ messages, header, footer }: ChatWindowProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {header}
        {messages.length === 0 && !header && (
          <p className="text-center text-base text-slate-400 py-12">暂无消息，开始对话吧</p>
        )}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} msg={msg} />
        ))}
      </div>
      {footer && <div className="border-t border-slate-200 px-4 py-3">{footer}</div>}
    </div>
  );
}
