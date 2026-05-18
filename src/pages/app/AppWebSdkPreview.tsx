import { useState, useRef, useEffect } from "react";
import type { Message, PageProps } from "../../types";
import { ChatWindow } from "../../components/ChatWindow";
import { Image, MessageCircle, X, ShoppingCart, Send, Package, Truck, MapPin } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

type SimPage = "product" | "order";

let msgId = 900;
function makeMsg(
  convId: string,
  sender: Message["sender"],
  content: string,
  cardType?: Message["cardType"],
  cardData?: Record<string, string>
): Message {
  return {
    id: `sdk-msg-${msgId++}`,
    conversationId: convId,
    sender,
    content,
    time: new Date().toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    status: "已读",
    cardType,
    cardData,
  };
}

const quickTopicChips = ["商品咨询", "库存查询", "售后政策"];

export default function AppWebSdkPreview({ goPage }: PageProps) {
  const [simPage, setSimPage] = useState<SimPage>("product");
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    makeMsg("sdk-chat", "AI客服", "您好！欢迎来到星选直播，有什么可以帮您？"),
  ]);
  const [input, setInput] = useState("");
  const chatBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg = makeMsg("sdk-chat", "用户", text.trim());
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const lower = text.toLowerCase();
      let reply: Message;
      if (lower.includes("商品") || lower.includes("产品")) {
        reply = makeMsg(
          "sdk-chat",
          "AI客服",
          "直播专享营养套装目前库存充足，售价¥199（原价¥299）。该套装为30天组合装，含多种维生素和矿物质。如需下单可直接点击页面按钮。",
          "商品卡片",
          { name: "直播专享营养套装", price: "199", stock: "库存充足" }
        );
      } else if (lower.includes("库存")) {
        reply = makeMsg(
          "sdk-chat",
          "AI客服",
          "当前商品库存充足，显示为「现货充足」状态。仓库正常发货，一般1-3个工作日送达。",
          "商品卡片",
          { name: "直播专享营养套装", price: "199", stock: "库存充足" }
        );
      } else if (lower.includes("售后") || lower.includes("退款") || lower.includes("退换")) {
        reply = makeMsg(
          "sdk-chat",
          "AI客服",
          "本商品支持7天无理由退货。如需售后，可在订单详情页发起退款/退货/换货申请，商家将在24小时内处理。"
        );
      } else {
        reply = makeMsg(
          "sdk-chat",
          "AI客服",
          "收到您的问题，我会尽快为您解答。您也可以点击下方快捷按钮选择常见问题。"
        );
      }
      setMessages((prev) => [...prev, reply]);
    }, 600);
  }

  function handleChipClick(chip: string) {
    sendMessage(chip);
  }

  const allBadges = reqs.AppWebSdkPreview.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);

  return (
    <div className="flex flex-col h-full bg-slate-100 relative sdk-preview">
      {allBadges}
      {/* ======== Page Switcher ======== */}
      <div className="bg-white border-b border-slate-200 px-4 py-2">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setSimPage("product")}
            className={`flex-1 rounded-md py-2 text-base font-medium transition-colors ${
              simPage === "product"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            商品详情页
          </button>
          <button
            type="button"
            onClick={() => setSimPage("order")}
            className={`flex-1 rounded-md py-2 text-base font-medium transition-colors ${
              simPage === "order"
                ? "bg-white text-slate-800 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            订单详情页
          </button>
        </div>
      </div>

      {/* ======== Scrollable Content ======== */}
      <div className="flex-1 overflow-y-auto">
        {simPage === "product" ? (
          <ProductDetailPage />
        ) : (
          <OrderDetailPage />
        )}
      </div>

      {/* ======== Floating Chat Button ======== */}
      {!chatOpen && (
        <div className="fixed bottom-6 right-6 z-30 flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => setChatOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors animate-pulse"
          >
            <MessageCircle size={24} />
          </button>
          <span className="text-sm font-medium text-slate-500">客服</span>
        </div>
      )}

      {/* ======== Chat Panel ======== */}
      {chatOpen && (
        <div className="fixed bottom-0 left-0 right-0 h-[55vh] z-30 bg-white shadow-2xl flex flex-col rounded-t-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 shrink-0">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">AI客服</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-sm text-blue-700">
                  <Package size={12} />
                  当前页面：商品详情 · SKU: prod-001 · 渠道：H5网页
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Area */}
          <div ref={chatBodyRef} className="flex-1 overflow-y-auto bg-slate-50">
            <ChatWindow messages={messages} />
          </div>

          {/* Quick topic chips */}
          <div className="flex gap-2 px-4 py-2 border-t border-slate-100 shrink-0">
            {quickTopicChips.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-blue-300 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input bar */}
          <div className="border-t border-slate-200 px-4 py-3 shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="输入您的问题..."
                className="flex-1 rounded-xl border border-slate-200 px-4 h-11 text-base outline-none focus:border-blue-400"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Simulated Product Detail Page */
function ProductDetailPage() {
  return (
    <div className="pb-8">
      {/* Product image placeholder */}
      <div className="h-[300px] bg-slate-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-slate-400">
          <Image size={48} />
          <span className="text-base">商品图片</span>
        </div>
      </div>

      {/* Product info */}
      <div className="bg-white px-4 py-4">
        <h2 className="text-xl font-bold text-slate-800">直播专享营养套装</h2>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-2xl font-bold text-red-500">¥199</span>
          <span className="text-base text-slate-400 line-through">¥299</span>
          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-sm font-medium text-emerald-600">
            现货充足
          </span>
        </div>
        <p className="text-base text-slate-600 mt-3 leading-relaxed">
          精选多种维生素与矿物质，科学配比，30天组合装。专为直播渠道定制，含维生素C、维生素D、锌、钙等核心营养素，满足日常营养需求。适合成年人日常营养补充。
        </p>
      </div>

      {/* Action buttons */}
      <div className="px-4 py-4 flex gap-3">
        <button
          type="button"
          className="flex-1 h-11 min-h-[44px] rounded-xl bg-amber-500 text-white font-medium text-base hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
        >
          <ShoppingCart size={18} />
          加入购物车
        </button>
        <button
          type="button"
          className="flex-1 h-11 min-h-[44px] rounded-xl bg-blue-600 text-white font-medium text-base hover:bg-blue-700 transition-colors"
        >
          立即购买
        </button>
      </div>

      {/* Store info */}
      <div className="mx-4 rounded-xl border border-slate-100 bg-white p-4 mt-2">
        <h3 className="text-base font-semibold text-slate-700 mb-2">店铺信息</h3>
        <div className="flex items-center gap-2 text-base text-slate-500">
          <MapPin size={16} />
          <span>星选直播旗舰店 · 杭州西湖区</span>
        </div>
        <p className="text-base text-slate-400 mt-1">周一至周日 10:00-21:00</p>
      </div>
    </div>
  );
}

/** Simulated Order Detail Page */
function OrderDetailPage() {
  return (
    <div className="pb-8">
      {/* Order status banner */}
      <div className="bg-blue-600 px-4 py-6 text-white">
        <div className="flex items-center gap-2 mb-1">
          <Truck size={20} />
          <span className="text-lg font-semibold">运输中</span>
        </div>
        <p className="text-base text-blue-200">预计明天送达</p>
      </div>

      {/* Order info card */}
      <div className="bg-white mx-4 mt-4 rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800">订单号：ORD-20260517001</h3>
          <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-sm font-medium text-blue-700">
            运输中
          </span>
        </div>

        {/* Product in order */}
        <div className="flex gap-3 py-3 border-t border-slate-100">
          <div className="h-16 w-16 rounded-lg bg-slate-200 flex items-center justify-center shrink-0">
            <Image size={24} className="text-slate-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-base font-medium text-slate-800">直播专享营养套装</p>
            <p className="text-sm text-slate-400">规格：组合装 30天</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-base font-semibold text-red-500">¥199</span>
              <span className="text-sm text-slate-400">x1</span>
            </div>
          </div>
        </div>

        {/* Logistics info */}
        <div className="border-t border-slate-100 pt-3 mt-3">
          <div className="flex items-center gap-2 text-base text-slate-600">
            <MapPin size={16} className="text-slate-400" />
            <span>物流信息：顺丰快递 SF1234567890</span>
          </div>
          <p className="text-sm text-slate-400 mt-1 ml-6">已到达深圳转运中心</p>
        </div>

        {/* Totals */}
        <div className="border-t border-slate-100 pt-3 mt-3 space-y-1">
          <div className="flex justify-between text-base">
            <span className="text-slate-500">商品金额</span>
            <span className="text-slate-700">¥199</span>
          </div>
          <div className="flex justify-between text-base">
            <span className="text-slate-500">运费</span>
            <span className="text-slate-700">¥0</span>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <span className="text-slate-700">实付金额</span>
            <span className="text-red-500">¥199</span>
          </div>
        </div>
      </div>

      {/* Receiver info */}
      <div className="bg-white mx-4 mt-3 rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="text-base font-semibold text-slate-700 mb-2">收货信息</h3>
        <p className="text-base text-slate-600">用户1 138****6200</p>
        <p className="text-base text-slate-500 mt-0.5">广东省深圳市南山区示例路 1 号</p>
      </div>
    </div>
  );
}
