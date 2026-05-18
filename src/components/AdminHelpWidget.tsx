import { useState } from "react";
import { HelpCircle, X, MapPin, User, UserPlus } from "lucide-react";

let helpMsgId = 800;
function makeHelpMsg(
  sender: "AI客服" | "用户",
  content: string
) {
  return {
    id: `help-msg-${helpMsgId++}`,
    conversationId: "help-chat",
    sender,
    content,
    time: new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "已读" as const,
  };
}

interface AdminHelpWidgetProps {
  currentPage?: string;
  currentRole?: string;
}

export function AdminHelpWidget({
  currentPage = "优惠券配置",
  currentRole = "商家运营",
}: AdminHelpWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    makeHelpMsg(
      "AI客服",
      `你好！检测到你在${currentPage}页面，有什么需要帮助的吗？`
    ),
  ]);

  function handleQuickAction(action: string) {
    const userMsg = makeHelpMsg("用户", action);
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let reply: string;
      if (action.includes("满减券")) {
        reply =
          "创建满减券的步骤：1. 进入营销中心-优惠券管理；2. 点击「新建优惠券」；3. 选择「满减券」类型；4. 设置满减门槛和优惠金额；5. 设置适用范围和有效期；6. 点击发布。发布后即时生效。";
      } else if (action.includes("发放规则")) {
        reply =
          "优惠券发放规则：1. 可按新客/老客分别发放；2. 可设置每人限领张数；3. 可设置总库存数量；4. 支持手动发放和自动发放（满足条件自动发）。推荐设置合理的发放上限避免超出预算。";
      } else if (action.includes("常见问题")) {
        reply =
          "常见问题：Q: 优惠券可以叠加使用吗？A: 默认不可叠加，可在规则中设置允许叠加。Q: 优惠券发放后可以撤回吗？A: 已领取的不可撤回，未领取的可手动停用。Q: 如何查看优惠券使用数据？A: 在营销中心-数据看板中查看。";
      } else {
        reply =
          "收到您的问题，我会尽快为您解答。如需更多帮助，可点击下方「转人工客服」联系运营支持。";
      }
      setMessages((prev) => [
        ...prev,
        makeHelpMsg("AI客服", reply),
      ]);
    }, 600);
  }

  return (
    <>
      {/* Floating Help Button */}
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors"
        >
          <HelpCircle size={24} />
        </button>
      )}

      {/* Help Panel */}
      {open && (
        <div className="fixed bottom-0 right-0 z-40 w-[400px] h-[500px] bg-white shadow-2xl flex flex-col rounded-t-2xl border border-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 shrink-0">
            <h3 className="text-lg font-semibold text-slate-800">后台帮助</h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Context Card */}
          <div className="bg-blue-50 mx-4 mt-3 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                  <MapPin size={14} className="text-blue-600" />
                </div>
                <div>
                  <span className="text-sm text-blue-400">当前页面</span>
                  <p className="text-base font-medium text-blue-800">
                    {currentPage}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100">
                  <User size={14} className="text-blue-600" />
                </div>
                <div>
                  <span className="text-sm text-blue-400">当前角色</span>
                  <p className="text-base font-medium text-blue-800">
                    {currentRole}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg) => {
              const isAI = msg.sender === "AI客服";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${isAI ? "flex-row" : "flex-row-reverse"}`}
                >
                  <div
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      isAI ? "bg-indigo-500" : "bg-blue-500"
                    } text-white`}
                  >
                    {isAI ? (
                      <HelpCircle size={14} />
                    ) : (
                      <User size={14} />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-3 py-2 text-base leading-relaxed max-w-[80%] ${
                      isAI
                        ? "bg-white border border-slate-200 text-slate-800 rounded-tl-md"
                        : "bg-blue-600 text-white rounded-tr-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Action Buttons */}
          <div className="border-t border-slate-100 px-4 py-3 shrink-0">
            <div className="flex flex-wrap gap-2 mb-3">
              <button
                type="button"
                onClick={() => handleQuickAction("如何创建满减券")}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-blue-300 transition-colors"
              >
                如何创建满减券
              </button>
              <button
                type="button"
                onClick={() => handleQuickAction("优惠券发放规则")}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-blue-300 transition-colors"
              >
                优惠券发放规则
              </button>
              <button
                type="button"
                onClick={() => handleQuickAction("常见问题")}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-blue-300 transition-colors"
              >
                常见问题
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setMessages((prev) => [
                  ...prev,
                  makeHelpMsg("用户", "转人工客服"),
                  makeHelpMsg("AI客服", "已为您转接平台人工客服，请稍候。如遇紧急问题，可拨打客服热线 400-800-8888。"),
                ]);
              }}
              className="flex h-11 min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-amber-300 bg-white text-amber-600 font-medium text-base hover:bg-amber-50 transition-colors"
            >
              <UserPlus size={18} />
              转人工客服
            </button>
          </div>
        </div>
      )}
    </>
  );
}
