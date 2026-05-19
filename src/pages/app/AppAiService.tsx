import { useState, useRef, useEffect } from "react";
import type { Message, PageProps, NavigationParams } from "../../types";
import { ChatWindow } from "../../components/ChatWindow";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";
import { Send, UserPlus, Package, ShoppingCart, RotateCcw, Store, GraduationCap, Heart, ThumbsUp, ThumbsDown, MapPin, BookOpen, Truck, Bot, Shield, Search, Database, Wrench, FileCheck, Image, Star, type LucideIcon } from "lucide-react";

// ========== 入口类型 ==========
type EntryPoint = "通用" | "商品详情页" | "订单页" | "直播间" | "门店页" | "课程详情页" | "SaaS后台帮助";

const entryLabels: Record<EntryPoint, { label: string; icon: LucideIcon }> = {
  "通用": { label: "通用咨询", icon: Bot },
  "商品详情页": { label: "商品咨询", icon: Package },
  "订单页": { label: "订单咨询", icon: ShoppingCart },
  "直播间": { label: "直播咨询", icon: Bot },
  "门店页": { label: "门店咨询", icon: Store },
  "课程详情页": { label: "课程咨询", icon: GraduationCap },
  "SaaS后台帮助": { label: "平台帮助", icon: Wrench },
};

const quickChips: { label: string; icon: LucideIcon }[] = [
  { label: "查订单物流", icon: Truck },
  { label: "申请售后", icon: RotateCcw },
  { label: "问商品库存", icon: Package },
  { label: "附近门店", icon: MapPin },
  { label: "课程权益", icon: BookOpen },
  { label: "健康咨询", icon: Heart },
];

let msgId = 100;
function makeMsg(convId: string, sender: Message["sender"], content: string, cardType?: Message["cardType"], cardData?: Record<string, string>): Message {
  return { id: `msg-${msgId++}`, conversationId: convId, sender, content, time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }), status: "已读", cardType, cardData };
}

// ========== AI处理链路定义 ==========
interface PipelineStep {
  label: string;
  detail?: string;
  iconType: "intent" | "risk" | "faq" | "rag" | "tool" | "generate" | "review";
}

interface AIPipeline {
  intent: string;
  intentDetail: string;
  confidence: number;
  steps: PipelineStep[];
  reply: string;
  cardType?: Message["cardType"];
  cardData?: Record<string, string>;
  references?: { title: string; source: string; similarity: number }[];
  riskLevel: "低风险" | "中风险" | "高风险";
  riskAction: string;
}

// 每个问题类型的完整AI流水线
const pipelineMap: Record<string, AIPipeline> = {
  "查订单物流": {
    intent: "订单咨询",
    intentDetail: "物流进度查询",
    confidence: 0.94,
    riskLevel: "低风险",
    riskAction: "未命中风控规则，直接放行",
    steps: [
      { label: "意图识别", detail: "识别为【订单咨询→物流进度查询】，置信度 0.94", iconType: "intent" },
      { label: "风控初筛", detail: "检查敏感词…未命中，低风险", iconType: "risk" },
      { label: "FAQ匹配", detail: "检索FAQ库…未命中精确匹配", iconType: "faq" },
      { label: "调用订单接口", detail: "查询用户最近订单…获取物流单号，调用物流接口…返回轨迹", iconType: "tool" },
      { label: "生成回答", detail: "基于接口返回数据组织自然语言回复", iconType: "generate" },
      { label: "风控复审", detail: "输出审核通过，未包含隐私信息", iconType: "review" },
    ],
    reply: "您的订单当前状态：已发货，物流显示已到达深圳转运中心，预计明天送达。如需售后帮助，可进入售后服务页面。",
    references: [
      { title: "订单查询接口", source: "订单中心", similarity: 0.98 },
      { title: "物流轨迹查询", source: "物流中心", similarity: 0.95 },
    ],
    cardType: "订单卡片",
    cardData: { orderId: "order-2", status: "运输中", logistics: "已到达深圳转运中心" },
  },
  "申请售后": {
    intent: "售后咨询",
    intentDetail: "退款/退货流程咨询",
    confidence: 0.89,
    riskLevel: "低风险",
    riskAction: "未命中风控规则",
    steps: [
      { label: "意图识别", detail: "识别为【售后咨询→退款/退货流程】，置信度 0.89", iconType: "intent" },
      { label: "风控初筛", detail: "检查退款相关话术…不涉及承诺赔偿，低风险", iconType: "risk" },
      { label: "FAQ匹配", detail: "命中FAQ：『如何申请售后』，相似度 0.92", iconType: "faq" },
      { label: "RAG检索", detail: "检索售后政策文档…获取最新退款规则", iconType: "rag" },
      { label: "生成回答", detail: "基于FAQ标准答案+售后政策生成回复", iconType: "generate" },
      { label: "风控复审", detail: "输出审核通过", iconType: "review" },
    ],
    reply: "您可以在订单详情页申请售后，支持退款、退货和换货。商家将在24小时内处理您的申请。如已超过7天，可能需要人工审核。",
    references: [
      { title: "售后政策FAQ", source: "商家知识库", similarity: 0.92 },
      { title: "退换货规则文档", source: "售后政策库", similarity: 0.87 },
    ],
  },
  "问商品库存": {
    intent: "商品咨询",
    intentDetail: "库存与价格查询",
    confidence: 0.91,
    riskLevel: "低风险",
    riskAction: "未命中风控规则",
    steps: [
      { label: "意图识别", detail: "识别为【商品咨询→库存查询】，置信度 0.91", iconType: "intent" },
      { label: "风控初筛", detail: "检查宣传语…未命中绝对化宣传词，低风险", iconType: "risk" },
      { label: "调用商品接口", detail: "查询商品库存接口…返回实时库存数据", iconType: "tool" },
      { label: "调用活动接口", detail: "查询当前活动价格…返回直播专享价", iconType: "tool" },
      { label: "生成回答", detail: "基于接口返回的实时数据组织回复", iconType: "generate" },
      { label: "风控复审", detail: "确认价格数据来源为接口而非模型记忆，通过", iconType: "review" },
    ],
    reply: "直播专享营养套装目前库存充足，直播专享价¥199。价格以直播间实时页面为准，建议尽快下单。",
    cardType: "商品卡片",
    cardData: { name: "直播专享营养套装", price: "199", stock: "库存充足" },
  },
  "附近门店": {
    intent: "门店咨询",
    intentDetail: "门店地址与营业时间查询",
    confidence: 0.93,
    riskLevel: "低风险",
    riskAction: "未命中风控规则",
    steps: [
      { label: "意图识别", detail: "识别为【门店咨询→地址查询】，置信度 0.93", iconType: "intent" },
      { label: "风控初筛", detail: "低风险查询，直接放行", iconType: "risk" },
      { label: "调用门店接口", detail: "获取用户定位…查询附近门店…返回2家门店", iconType: "tool" },
      { label: "生成回答", detail: "基于门店接口数据组织回复", iconType: "generate" },
      { label: "风控复审", detail: "输出审核通过", iconType: "review" },
    ],
    reply: "您附近有2家门店：①星选体验店（1.2km），营业时间 10:00-21:00；②同城生活馆（2.8km），营业时间 09:30-20:30。建议提前预约，可享受优先服务。",
  },
  "课程权益": {
    intent: "课程咨询",
    intentDetail: "课程权益与有效期查询",
    confidence: 0.90,
    riskLevel: "低风险",
    riskAction: "未命中风控规则",
    steps: [
      { label: "意图识别", detail: "识别为【课程咨询→权益查询】，置信度 0.90", iconType: "intent" },
      { label: "风控初筛", detail: "课程咨询低风险，放行", iconType: "risk" },
      { label: "RAG检索", detail: "检索课程知识库…召回5个相关片段", iconType: "rag" },
      { label: "调用课程接口", detail: "查询用户已购课程权益…获取有效期和学习进度", iconType: "tool" },
      { label: "生成回答", detail: "综合课程知识库和用户权益生成回复", iconType: "generate" },
      { label: "风控复审", detail: "输出审核通过", iconType: "review" },
    ],
    reply: "已购课程有效期为365天，支持回放、倍速播放和下载。回放入口在『我的-我的课程』中。部分课程附赠社群权益，购课后可扫码加入。",
  },
  "健康咨询": {
    intent: "大健康咨询",
    intentDetail: "健康科普与生活建议",
    confidence: 0.87,
    riskLevel: "中风险",
    riskAction: "通过，但需追加非诊断声明",
    steps: [
      { label: "意图识别", detail: "识别为【大健康咨询→健康科普】，置信度 0.87", iconType: "intent" },
      { label: "风控初筛", detail: "检测大健康关键词…无诊断/用药/治疗意图，中风险", iconType: "risk" },
      { label: "RAG检索", detail: "检索大健康科普知识库…召回8个片段，重排后取Top3", iconType: "rag" },
      { label: "生成回答", detail: "基于健康科普知识生成回复，追加免责声明", iconType: "generate" },
      { label: "风控复审", detail: "确认无治疗承诺、无诊断结论、无用药建议…通过", iconType: "review" },
    ],
    reply: "作为健康科普建议：保持规律作息、均衡饮食和适量运动有助于改善健康状况。我不能进行疾病诊断或用药建议。如持续不适，建议咨询专业医生。",
    references: [
      { title: "健康生活方式指南", source: "大健康科普知识库", similarity: 0.91 },
      { title: "AI客服大健康合规规则", source: "风控策略库", similarity: 0.99 },
    ],
  },
  "模型错误": {
    intent: "系统异常",
    intentDetail: "模型服务异常",
    confidence: 0,
    riskLevel: "高风险",
    riskAction: "触发降级策略，转人工",
    steps: [
      { label: "意图识别", detail: "系统检测到模型响应异常", iconType: "intent" },
      { label: "风控初筛", detail: "系统异常自动升级为高风险", iconType: "risk" },
      { label: "降级处理", detail: "触发模型降级策略…切换备用模型失败…转人工", iconType: "tool" },
    ],
    reply: "抱歉，服务暂时不可用，正在为您转接人工客服。您也可以稍后重试或拨打客服热线 400-800-8888。",
  },
  "工具错误": {
    intent: "系统异常",
    intentDetail: "工具调用超时",
    confidence: 0,
    riskLevel: "中风险",
    riskAction: "工具调用失败，提示重试",
    steps: [
      { label: "意图识别", detail: "识别用户意图，准备调用业务接口", iconType: "intent" },
      { label: "调用业务接口", detail: "调用超时（3秒）…重试1次…仍然超时", iconType: "tool" },
      { label: "异常处理", detail: "工具调用失败，提示用户重试或转人工", iconType: "generate" },
    ],
    reply: "查询超时，请稍后重试。如果持续失败，可转接人工客服为您处理。",
  },
  "排队": {
    intent: "人工服务",
    intentDetail: "用户等待排队",
    confidence: 1,
    riskLevel: "低风险",
    riskAction: "无",
    steps: [
      { label: "意图识别", detail: "用户请求转人工，检查人工队列状态", iconType: "intent" },
      { label: "队列检查", detail: "当前排队人数：3人，预计等待：2分钟", iconType: "tool" },
    ],
    reply: "当前咨询高峰，前面还有3位用户在等待，预计等待2分钟。您也可以先留言，客服稍后回复您。",
  },
};

// ========== 步骤图标映射 ==========
const stepIcons: Record<PipelineStep["iconType"], LucideIcon> = {
  intent: Bot,
  risk: Shield,
  faq: FileCheck,
  rag: Search,
  tool: Wrench,
  generate: Database,
  review: Shield,
};

// ========== 步骤颜色映射 ==========
const stepColors: Record<PipelineStep["iconType"], string> = {
  intent: "text-indigo-600 bg-indigo-50",
  risk: "text-orange-600 bg-orange-50",
  faq: "text-emerald-600 bg-emerald-50",
  rag: "text-violet-600 bg-violet-50",
  tool: "text-blue-600 bg-blue-50",
  generate: "text-slate-600 bg-slate-50",
  review: "text-emerald-600 bg-emerald-50",
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

export default function AppAiService({ goPage, navigationParams }: PageProps) {
  // 从导航参数中获取入口上下文
  const initialEntry: EntryPoint = (navigationParams?.chatPrompt === "商品" ? "商品详情页" :
    navigationParams?.chatPrompt === "大健康咨询" ? "商品详情页" :
    navigationParams?.chatPrompt?.includes("订单") ? "订单页" :
    "通用");

  const [entryPoint] = useState<EntryPoint>(initialEntry);
  const entryMeta = entryLabels[entryPoint];

  const [messages, setMessages] = useState<Message[]>([
    makeMsg("app-chat", "AI客服", `您好！我是AI客服助手，当前在【${entryMeta.label}】为您服务。请问有什么可以帮您？`),
  ]);
  const [input, setInput] = useState("");
  const [processing, setProcessing] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [typingDetail, setTypingDetail] = useState("");
  const [typingIcon, setTypingIcon] = useState<PipelineStep["iconType"]>("intent");
  const [transferred, setTransferred] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [surveyRating, setSurveyRating] = useState(0);
  const [surveyText, setSurveyText] = useState("");
  const [ratings, setRatings] = useState<Record<string, "up" | "down" | undefined>>({});
  const [conversationStage, setConversationStage] = useState<ConversationStage>("idle");
  const [selectedOrder, setSelectedOrder] = useState<string>("");
  const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
  // 记录最后一次处理的链路信息
  const [lastPipeline, setLastPipeline] = useState<{ intent: string; confidence: number; riskLevel: string } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  function simulateProcessing(topic: string) {
    const pipeline = pipelineMap[topic];
    if (!pipeline) {
      setProcessing(true);
      setTypingText("正在处理…");
      setTimeout(() => {
        setMessages((prev) => [...prev, makeMsg("app-chat", "AI客服", "请重新描述您的问题。")]);
        setProcessing(false);
        setTypingText("");
      }, 1500);
      return;
    }

    setProcessing(true);
    const steps = pipeline.steps;
    setTypingIcon(steps[0].iconType);
    setTypingText(steps[0].label);
    setTypingDetail(steps[0].detail ?? "");

    let i = 0;
    const timer = setInterval(() => {
      if (i < steps.length - 1) {
        i++;
        setTypingIcon(steps[i].iconType);
        setTypingText(steps[i].label);
        setTypingDetail(steps[i].detail ?? "");
      } else {
        clearInterval(timer);
        setTypingText("");
        setTypingDetail("");
        // 记录链路信息
        setLastPipeline({ intent: pipeline.intent, confidence: pipeline.confidence, riskLevel: pipeline.riskLevel });
        // 显示流式输出
        const streamId = `msg-${msgId++}`;
        setMessages((prev) => [...prev, { id: streamId, conversationId: "app-chat", sender: "AI客服", content: "▋", time: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }), status: "已读" }]);
        setStreamingMsgId(streamId);
        setTimeout(() => {
          setMessages((prev) => prev.map(m => m.id === streamId ? {
            ...m,
            content: pipeline.reply,
            cardType: pipeline.cardType,
            cardData: pipeline.cardData,
            references: pipeline.references,
            traceId: `trace-${Date.now()}`,
            confidenceScore: pipeline.confidence,
            safetyResult: pipeline.riskAction,
          } : m));
          setProcessing(false);
          setStreamingMsgId(null);
        }, 800);
      }
    }, 650);
  }

  function handleSend() {
    if (!input.trim() || processing) return;
    const text = input.trim();
    setMessages((prev) => [...prev, makeMsg("app-chat", "用户", text)]);
    setInput("");

    // 多轮退款流程
    if (text.includes("退款") && conversationStage === "idle") {
      setConversationStage("asking-order");
      setMessages((prev) => [...prev, makeMsg("app-chat", "AI客服", "请问是哪一个订单？你可以选择最近订单或输入订单号。")]);
      return;
    }

    if (conversationStage === "asking-order") {
      let orderName = text;
      if (text.includes("订单A") || text.includes("营养套装")) orderName = "订单A: 营养套装 ¥199";
      else if (text.includes("订单B") || text.includes("维生素礼盒")) orderName = "订单B: 维生素礼盒 ¥89";
      setSelectedOrder(orderName);
      setConversationStage("confirming-after-sale");
      setMessages((prev) => [...prev, makeMsg("app-chat", "AI客服", `已查询到订单【${orderName}】状态为【已签收】，可申请售后。是否帮你进入售后申请？`)]);
      return;
    }

    if (conversationStage === "confirming-after-sale") {
      if (text.includes("是") || text.includes("申请") || text.includes("确认")) {
        setConversationStage("idle");
        setMessages((prev) => [...prev, makeMsg("app-chat", "AI客服", "已为你创建售后申请，请前往【我的-我的售后】查看进度。商家将在24小时内处理。")]);
        setSelectedOrder("");
      } else {
        setConversationStage("idle");
        setSelectedOrder("");
        setMessages((prev) => [...prev, makeMsg("app-chat", "AI客服", "好的，如有需要随时联系我。")]);
      }
      return;
    }

    // 异常关键词
    if (text.includes("模型错误") || text.includes("系统错误")) { simulateProcessing("模型错误"); return; }
    if (text.includes("工具错误") || text.includes("超时") || text.includes("查询失败")) { simulateProcessing("工具错误"); return; }
    if (text.includes("排队")) { simulateProcessing("排队"); return; }

    // 匹配快捷入口关键词
    const matched = quickChips.find((c) => text.includes(c.label) || text.includes(c.label.replace("查", "").replace("问", "")));
    if (matched) {
      simulateProcessing(matched.label);
    } else if (text.includes("人工")) {
      setMessages((prev) => [...prev, makeMsg("app-chat", "系统", "正在为您转接人工客服…")]);
      setLastPipeline({ intent: "人工服务", confidence: 0, riskLevel: "低风险" });
      setTimeout(() => {
        setTransferred(true);
        setMessages((prev) => [...prev, makeMsg("app-chat", "系统", "已为您转人工，请稍候。人工客服将在工作时间内尽快接入。")]);
        setTimeout(() => { if (!conversationEnded) setShowSurvey(true); }, 2500);
      }, 1500);
    } else {
      simulateProcessing("问商品库存");
    }
  }

  function handleChipClick(chip: typeof quickChips[number]) {
    setMessages((prev) => [...prev, makeMsg("app-chat", "用户", chip.label)]);
    simulateProcessing(chip.label);
  }

  function handleInlineAction(action: string) {
    if (conversationStage === "asking-order") {
      setSelectedOrder(action);
      setConversationStage("confirming-after-sale");
      setMessages((prev) => [
        ...prev,
        makeMsg("app-chat", "用户", action),
        makeMsg("app-chat", "AI客服", `已查询到订单【${action}】状态为【已签收】，可申请售后。是否帮你进入售后申请？`),
      ]);
    } else if (conversationStage === "confirming-after-sale") {
      if (action === "是，申请售后") {
        setConversationStage("idle");
        setMessages((prev) => [...prev, makeMsg("app-chat", "用户", "是，申请售后"), makeMsg("app-chat", "AI客服", "已为你创建售后申请，请前往【我的-我的售后】查看进度。商家将在24小时内处理。")]);
        setSelectedOrder("");
      } else {
        setConversationStage("idle");
        setMessages((prev) => [...prev, makeMsg("app-chat", "用户", "否，我再想想"), makeMsg("app-chat", "AI客服", "好的，如有需要随时联系我。")]);
        setSelectedOrder("");
      }
    }
  }

  const augmentedMessages = messages.map((msg, idx) => {
    const isLastAIReply = msg.sender === "AI客服" && !messages.slice(idx + 1).some((m) => m.sender === "AI客服");
    return { ...msg, showRating: isLastAIReply };
  });

  const showWelcome = messages.length <= 1;
  const StepIconComponent = stepIcons[typingIcon];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="chat-header bg-blue-600 px-4 py-3 shrink-0 relative">
        {reqs.AppAiService.map(group => {
          const merged = { ...group.reqs[0], content: group.reqs.map(r => `## ${r.title}\n\n${r.content}`).join('\n\n---\n\n') };
          return <RequirementBadge key={merged.id} req={merged} sectionSelector={group.selector} index={0} />;
        })}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">星选直播旗舰店</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-sm text-white">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              在线
            </span>
          </div>
          {!conversationEnded && (
            <button
              type="button"
              onClick={() => setShowSurvey(true)}
              className="text-sm text-blue-200 hover:text-white transition-colors"
            >
              结束会话
            </button>
          )}
        </div>
        {/* 入口上下文 */}
        <div className="flex items-center gap-2 mt-1.5">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 text-sm text-blue-100">
            <entryMeta.icon size={12} />
            {entryMeta.label}
          </span>
          {lastPipeline && !processing && (
            <span className="text-sm text-blue-200">
              上次意图：{lastPipeline.intent} · 置信度 {lastPipeline.confidence > 0 ? `${(lastPipeline.confidence * 100).toFixed(0)}%` : "-"} · {lastPipeline.riskLevel}
            </span>
          )}
        </div>
      </div>

      {/* 处理状态指示器 —— 展示完整AI链路步骤 */}
      {processing && typingText && (
        <div className={`ai-pipeline-status border-b shrink-0 px-4 py-2.5 flex items-center gap-2.5 ${stepColors[typingIcon].split(" ")[1] || "bg-blue-50"} ${stepColors[typingIcon].split(" ")[0] || "text-blue-600"}`}>
          <div className="flex items-center gap-1.5">
            <span className="flex gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70 animate-bounce" style={{ animationDelay: "300ms" }} />
            </span>
            <StepIconComponent size={14} className="opacity-70 shrink-0" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-base font-medium">{typingText}</span>
            {typingDetail && <span className="text-sm opacity-70 truncate">{typingDetail}</span>}
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={containerRef} className="chat-messages flex-1 min-h-0 bg-[#F7F9FC]">
        <ChatWindow
          messages={augmentedMessages}
          onCardAction={(action, cardData) => {
            if (action === "after-sales") goPage?.("after-sales", { afterSaleOrderId: cardData?.orderId });
            else if (action === "trace") goPage?.("ai-service");
          }}
          header={
            showWelcome ? (
              <div className="pb-2">
                <p className="text-base text-slate-400 mb-2">您可以这样问我</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickChips.map((chip) => {
                    const Icon = chip.icon;
                    return (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => handleChipClick(chip)}
                        disabled={processing}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-base text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-colors disabled:opacity-50 h-11"
                      >
                        <Icon size={16} className="text-slate-400" />
                        {chip.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : undefined
          }
          footer={
            <div>
              {/* Multi-turn inline actions */}
              {conversationStage === "asking-order" && (
                <div className="px-4 py-3 border-t border-slate-100">
                  <p className="text-base text-slate-400 mb-2">请选择订单：</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => handleInlineAction("订单A: 营养套装 ¥199")} className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-blue-300 hover:shadow-sm transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50"><Package size={14} className="text-orange-500" /></div>
                        <span className="text-base font-semibold text-slate-700">订单A: 营养套装</span>
                      </div>
                      <span className="text-base text-red-500 font-semibold">¥199</span>
                    </button>
                    <button type="button" onClick={() => handleInlineAction("订单B: 维生素礼盒 ¥89")} className="flex-1 rounded-xl border border-slate-200 bg-white p-3 text-left hover:border-blue-300 hover:shadow-sm transition-all">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50"><Package size={14} className="text-violet-500" /></div>
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
                    <button type="button" onClick={() => handleInlineAction("是，申请售后")} className="flex-1 h-11 rounded-xl bg-blue-600 text-white font-medium text-base hover:bg-blue-700 transition-colors">是，申请售后</button>
                    <button type="button" onClick={() => handleInlineAction("否，我再想想")} className="flex-1 h-11 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium text-base hover:bg-slate-50 transition-colors">否，我再想想</button>
                  </div>
                </div>
              )}

              {/* Rating + actions for last AI reply */}
              {augmentedMessages.some((m) => m.showRating) && (
                <div className="flex items-center justify-center gap-3 py-2">
                  <span className="text-base text-slate-400">此回答是否有帮助？</span>
                  <button
                    type="button"
                    onClick={() => {
                      const lastAi = [...augmentedMessages].reverse().find((m) => m.showRating);
                      if (lastAi) setRatings((prev) => ({ ...prev, [lastAi.id]: prev[lastAi.id] === "up" ? undefined : "up" }));
                    }}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-base transition-colors ${[...augmentedMessages].reverse().find((m) => m.showRating && ratings[m.id] === "up") ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                  ><ThumbsUp size={14} /></button>
                  <button
                    type="button"
                    onClick={() => {
                      const lastAi = [...augmentedMessages].reverse().find((m) => m.showRating);
                      if (lastAi) setRatings((prev) => ({ ...prev, [lastAi.id]: prev[lastAi.id] === "down" ? undefined : "down" }));
                    }}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-base transition-colors ${[...augmentedMessages].reverse().find((m) => m.showRating && ratings[m.id] === "down") ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                  ><ThumbsDown size={14} /></button>
                </div>
              )}
            </div>
          }
        />
      </div>

      {/* Input bar */}
      <div className="border-t border-slate-200 px-4 py-4 bg-white shrink-0 relative">
        {transferred && (
          <div className="mb-2 rounded-lg bg-orange-50 border border-orange-100 px-4 py-2.5 text-base text-orange-700">
            已为你转人工，请稍候。如有紧急问题可拨打客服热线 400-800-8888。
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => alert("图片上传功能即将上线")}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:border-slate-300 shrink-0"
            title="图片上传（即将上线）"
          >
            <Image size={20} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="请输入您的问题"
            disabled={processing}
            className="flex-1 rounded-xl border border-slate-200 px-4 h-12 text-base outline-none focus:border-blue-400 disabled:bg-slate-50"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={processing}
            className="flex h-12 w-14 items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 shrink-0"
          >
            <Send size={18} />
          </button>
          <button
            type="button"
            className="transfer-button flex h-12 items-center gap-1.5 rounded-xl bg-orange-500 px-3 text-white hover:bg-orange-600 disabled:opacity-50 shrink-0 text-base font-medium"
            onClick={() => {
              setMessages((prev) => [...prev, makeMsg("app-chat", "系统", "正在为您转接人工客服…")]);
              setTransferred(true);
              setLastPipeline({ intent: "人工服务", confidence: 0, riskLevel: "低风险" });
              setTimeout(() => { if (!conversationEnded) setShowSurvey(true); }, 2000);
            }}
            disabled={processing || transferred}
          >
            <UserPlus size={16} />
            转人工
          </button>
        </div>
      </div>

      {/* End-of-conversation satisfaction survey */}
      {showSurvey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-[360px] mx-4 relative">
            <div className="flex items-center gap-2 mb-4">
              <Star size={20} className="text-amber-500" />
              <h3 className="text-lg font-semibold text-slate-800">会话评价</h3>
            </div>
            <p className="text-base text-slate-500 mb-4">请为本次服务评分，帮助我们做得更好</p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSurveyRating(star)}
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-xl transition-colors ${
                    surveyRating >= star ? "bg-amber-100 text-amber-500" : "bg-slate-100 text-slate-300"
                  }`}
                >
                  <Star size={20} fill={surveyRating >= star ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
            <textarea
              value={surveyText}
              onChange={(e) => setSurveyText(e.target.value)}
              placeholder="补充您的意见（可选）"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400 mb-4 h-20 resize-none"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowSurvey(false);
                  setConversationEnded(true);
                  setMessages((prev) => [...prev, makeMsg("app-chat", "系统", "感谢您的评价！如有其他问题，随时联系我们。")]);
                }}
                className="flex-1 h-11 rounded-xl bg-blue-600 text-white font-medium text-base hover:bg-blue-700"
              >
                提交评价
              </button>
              <button
                type="button"
                onClick={() => { setShowSurvey(false); setConversationEnded(true); }}
                className="flex-1 h-11 rounded-xl border border-slate-200 bg-white text-slate-500 font-medium text-base hover:bg-slate-50"
              >
                跳过
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { BusinessCard };
