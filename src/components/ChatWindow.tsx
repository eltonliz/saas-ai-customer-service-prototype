import type { Message } from "../types";
import { User, Bot, UserCheck, Package, FileText, Ticket } from "lucide-react";

interface ChatWindowProps {
  messages: Message[];
  footer?: React.ReactNode;
}

const cardIcons: Record<string, typeof Package> = {
  "商品卡片": Package,
  "订单卡片": FileText,
  "工单卡片": Ticket,
};

function ChatBubble({ msg }: { msg: Message }) {
  const isUser = msg.sender === "用户";
  const isSystem = msg.sender === "系统";

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <span className="rounded-full bg-amber-50 border border-amber-100 px-4 py-1.5 text-sm text-amber-700">{msg.content}</span>
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
        <p className="text-sm text-slate-400 mb-1 px-1">{isUser ? "我" : msg.sender}</p>
        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${bubbleBg} ${isUser ? "rounded-tr-md" : "rounded-tl-md"}`}>
          {msg.content}
        </div>
        {msg.cardType && msg.cardData && (
          <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
              {cardIcons[msg.cardType] && (() => { const CI = cardIcons[msg.cardType]; return <CI size={16} />; })()}
              {msg.cardType}
            </div>
            <div className="space-y-1">
              {Object.entries(msg.cardData).map(([k, v]) => (
                <div key={k} className="flex items-center gap-2 text-sm">
                  <span className="text-slate-400">{k}</span>
                  <span className="text-slate-700 font-medium">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="text-sm text-slate-400 mt-1 px-1">{msg.time}</p>
      </div>
    </div>
  );
}

export function ChatWindow({ messages, footer }: ChatWindowProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 && (
          <p className="text-center text-sm text-slate-400 py-12">暂无消息，开始对话吧</p>
        )}
        {messages.map((msg) => (
          <ChatBubble key={msg.id} msg={msg} />
        ))}
      </div>
      {footer && <div className="border-t border-slate-200 px-4 py-3">{footer}</div>}
    </div>
  );
}
