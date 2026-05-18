import type {
  AfterSale,
  BusinessLine,
  Channel,
  Conversation,
  CustomerServiceAgent,
  Faq,
  HealthRiskSample,
  KnowledgeDocument,
  KnowledgeGap,
  Merchant,
  Message,
  ModelCallLog,
  Order,
  PromptVersion,
  RagChunk,
  RagTrace,
  RiskLevel,
  RobotConfig,
  ServiceRecord,
  Store,
  Tenant,
  Ticket,
  User,
  WeComNotification,
} from "../types";

const businessLines: BusinessLine[] = ["直播", "商城", "门店", "课程/知识付费", "大健康"];
const channels: Channel[] = ["APP", "小程序", "H5", "商家后台", "企业微信", "公众号/微信客服"];

// ============ 租户 ============
export const tenants: Tenant[] = [
  {
    id: "tenant-1",
    name: "星选私域零售",
    industry: "私域直播电商",
    status: "启用",
    packageName: "专业版",
    expiresAt: "2026-12-31",
    channels: ["APP", "小程序", "H5", "企业微信"],
    tokenUsed: 628000,
    tokenLimit: 1200000,
    seatLimit: 15,
    knowledgeCapacity: 5000,
  },
  {
    id: "tenant-2",
    name: "同城门店联盟",
    industry: "门店服务",
    status: "启用",
    packageName: "行业版",
    expiresAt: "2026-10-18",
    channels: ["小程序", "公众号/微信客服", "商家后台"],
    tokenUsed: 389000,
    tokenLimit: 900000,
    seatLimit: 10,
    knowledgeCapacity: 3000,
  },
  {
    id: "tenant-3",
    name: "知养健康课堂",
    industry: "知识付费与大健康",
    status: "启用",
    packageName: "旗舰版",
    expiresAt: "2027-02-28",
    channels: ["APP", "H5", "企业微信"],
    tokenUsed: 812000,
    tokenLimit: 1500000,
    seatLimit: 20,
    knowledgeCapacity: 8000,
  },
];

// ============ 商家 ============
export const merchants: Merchant[] = [
  { id: "merchant-1", tenantId: "tenant-1", name: "星选直播旗舰店", industry: "私域直播电商", status: "营业中", storeCount: 2, consultationCount: 4280, ticketCount: 78 },
  { id: "merchant-2", tenantId: "tenant-1", name: "星选商城优品店", industry: "商城", status: "营业中", storeCount: 2, consultationCount: 3170, ticketCount: 52 },
  { id: "merchant-3", tenantId: "tenant-2", name: "同城生活服务店", industry: "门店服务", status: "营业中", storeCount: 2, consultationCount: 2100, ticketCount: 34 },
  { id: "merchant-4", tenantId: "tenant-2", name: "城市体验中心", industry: "门店服务", status: "营业中", storeCount: 2, consultationCount: 1860, ticketCount: 29 },
  { id: "merchant-5", tenantId: "tenant-3", name: "知养课程旗舰店", industry: "知识付费", status: "营业中", storeCount: 2, consultationCount: 2580, ticketCount: 41 },
  { id: "merchant-6", tenantId: "tenant-3", name: "青禾健康服务店", industry: "大健康", status: "营业中", storeCount: 2, consultationCount: 3920, ticketCount: 88 },
];

// ============ 门店 ============
export const stores: Store[] = merchants.flatMap((merchant, merchantIndex) =>
  [1, 2].map((item) => ({
    id: `store-${merchantIndex * 2 + item}`,
    tenantId: merchant.tenantId,
    merchantId: merchant.id,
    name: `${merchant.name}${item === 1 ? "中心店" : "社区店"}`,
    city: ["杭州", "上海", "广州", "深圳", "成都", "南京"][merchantIndex],
    address: `${["西湖", "浦东", "天河", "南山", "高新", "秦淮"][merchantIndex]}区服务中心 ${item} 号`,
    hours: "周一至周日 10:00-21:00",
    phone: `400-800-${merchantIndex + 1}${item}88`,
    inventory: item === 1 ? "核心商品库存充足" : "热门套餐少量库存",
    serviceTags: item === 1 ? ["到店核销", "售后接待", "体验咨询"] : ["预约体验", "门店自提", "会员服务"],
  })),
);

// ============ 用户 ============
export const users: User[] = Array.from({ length: 10 }, (_, index) => {
  const merchant = merchants[index % merchants.length];
  const store = stores.find((s) => s.merchantId === merchant.id);
  return {
    id: `user-${index + 1}`,
    tenantId: merchant.tenantId,
    merchantId: merchant.id,
    storeId: store?.id,
    name: `用户${index + 1}`,
    maskedPhone: `138****${String(6200 + index).slice(-4)}`,
    level: ["普通会员", "银卡会员", "金卡会员", "黑金会员"][index % 4],
    points: 580 + index * 126,
    coupons: 1 + (index % 4),
    tags: [businessLines[index % businessLines.length], index % 2 === 0 ? "复购用户" : "新客"],
  };
});

// ============ 订单 ============
export const orders: Order[] = Array.from({ length: 10 }, (_, index) => {
  const user = users[index];
  const productNames = ["直播专享营养套装", "商城精选家清组合", "门店体验服务券", "课程年度学习卡", "健康科普会员包"];
  const specs = ["组合装 30天", "家庭清洁三件套", "到店体验 1次", "年度学习权益", "科普会员 90天"];
  const amounts = [199, 88, 129, 699, 299];
  const statuses = ["待发货", "已发货", "运输中", "已完成", "售后处理中", "已发货", "运输中", "已完成", "已完成", "待发货"];
  const logisticsStatuses = ["仓库已拣货", "顺丰已揽收", "已到达深圳转运中心", "用户已签收", "等待商家处理售后", "中通已揽收", "已到达广州转运中心", "已签收", "用户已签收", "仓库已拣货"];
  return {
    id: `order-${index + 1}`,
    tenantId: user.tenantId,
    merchantId: user.merchantId,
    storeId: user.storeId,
    userId: user.id,
    imageTone: ["bg-blue-500", "bg-emerald-500", "bg-orange-500", "bg-violet-500", "bg-rose-500"][index % 5],
    productName: productNames[index % 5],
    spec: specs[index % 5],
    amount: amounts[index % 5],
    status: statuses[index],
    logistics: logisticsStatuses[index],
    afterSaleStatus: index === 4 ? "售后处理中" : index < 4 ? "可申请" : "售后期内",
    paymentInfo: `微信支付 ￥${amounts[index % 5]}`,
    receiverInfo: `${user.name} ${user.maskedPhone} · 广东省深圳市南山区示例路 ${index + 1} 号`,
    logisticsTimeline: [
      `2026-05-${String(8 + index).padStart(2, "0")} 10:12 商家已接单`,
      `2026-05-${String(8 + index).padStart(2, "0")} 16:35 仓库已拣货`,
      `2026-05-${String(9 + index).padStart(2, "0")} 09:20 ${logisticsStatuses[index]}`,
    ],
    businessLine: businessLines[index % businessLines.length],
    channel: channels[index % channels.length],
    createdAt: `2026-05-${String(7 + index).padStart(2, "0")} 14:${String(10 + index).padStart(2, "0")}`,
  };
});

// ============ 售后 ============
export const afterSales: AfterSale[] = [
  ...orders.slice(0, 10).map((order, index) => ({
    id: `after-${index + 1}`,
    orderId: order.id,
    tenantId: order.tenantId,
    merchantId: order.merchantId,
    userId: order.userId,
    type: (["退款申请", "退货申请", "换货申请"] as AfterSale["type"][])[index % 3],
    status: ["已提交", "商家处理中", "等待用户补充", "等待平台介入", "已给出结果", "待用户确认", "已完成", "已关闭", "已提交", "商家处理中"][index % 10],
    progress: ["用户提交申请", "AI说明规则", "商家处理中", "人工客服复核", "商家给出处理结果", "等待用户确认"].slice(0, 3 + (index % 4)),
    result: index === 2 ? "商家需要用户补充商品照片和物流凭证。" : index % 5 === 0 ? "建议转人工核实物流异常，不由AI直接承诺退款" : "按商家售后规则继续处理中",
    records: ["用户发起售后申请", "AI解释售后规则", "商家客服开始处理"].slice(0, 2 + (index % 2)),
    needUserConfirm: index % 4 === 1 || index === 5,
    userConfirmed: index === 6 ? "用户认可处理结果" : undefined,
  })),
  {
    id: "after-11",
    orderId: "order-1",
    tenantId: "tenant-1",
    merchantId: "merchant-1",
    userId: "user-1",
    type: "退货申请",
    status: "待用户确认",
    progress: ["用户提交申请", "商家已核实", "已给出处理结果", "待用户确认"],
    result: "商家已给出处理结果：同意退货，请在3天内寄回商品。",
    records: ["用户发起退货申请", "商家客服已核实物流情况", "商家已给出处理结果"],
    needUserConfirm: true,
  },
];

// ============ 会话 ============
const conversationStatuses: Conversation["status"][] = [
  "已创建", "AI接待中", "等待用户补充", "等待人工接入",
  "人工接待中", "已关联工单", "已解决", "已评价",
  "已关闭", "已重开", "已归档",
];

export const conversations: Conversation[] = Array.from({ length: 15 }, (_, index) => {
  const user = users[index % users.length];
  const line = businessLines[index % businessLines.length];
  const titles = ["直播商品库存咨询", "订单物流进度咨询", "售后退款规则咨询", "门店核销预约咨询", "课程回放权益咨询", "健康睡眠改善咨询"];
  const intents = ["商品咨询", "订单咨询", "售后咨询", "门店咨询", "课程咨询", "大健康咨询"];
  return {
    id: `conv-${index + 1}`,
    tenantId: user.tenantId,
    merchantId: user.merchantId,
    storeId: user.storeId,
    userId: user.id,
    title: titles[index % 6],
    status: conversationStatuses[index % conversationStatuses.length],
    channel: channels[index % channels.length],
    businessLine: line,
    intent: intents[index % 6],
    riskLevel: (index % 5 === 0 ? "高风险" : index % 3 === 0 ? "中风险" : "低风险") as Conversation["riskLevel"],
    transferredToHuman: index % 4 === 0,
    satisfaction: index % 3 === 0 ? 4 : index % 7 === 0 ? 5 : undefined,
    tags: [line, index % 4 === 0 ? "需人工关注" : "AI可处理"],
    createdAt: `2026-05-${String(1 + index).padStart(2, "0")} 09:${String(20 + index).padStart(2, "0")}`,
    summary: "已识别租户、商家、渠道和用户身份，AI完成知识检索与风控审核。",
  };
});

// ============ 消息 ============
export const conversationMessages: Message[] = [
  { id: "msg-1", conversationId: "conv-1", sender: "用户", content: "直播间那款营养套装还有库存吗？", time: "09:20", status: "已读" },
  { id: "msg-2", conversationId: "conv-1", sender: "AI客服", content: "正在识别商品和活动信息，查询当前库存。", time: "09:20", status: "已读", cardType: "商品卡片", cardData: { name: "直播专享营养套装", price: "199", stock: "库存充足" } },
  { id: "msg-3", conversationId: "conv-1", sender: "系统", content: "已完成工具调用：商品库存查询，结果为库存充足。", time: "09:21", status: "已读" },
  { id: "msg-4", conversationId: "conv-1", sender: "AI客服", content: "当前直播专享套装仍有库存，优惠以直播间页面为准。如需售后规则，我可以继续说明。", time: "09:21", status: "已读" },
  { id: "msg-5", conversationId: "conv-2", sender: "用户", content: "我的订单为什么物流不动？", time: "10:04", status: "已读" },
  { id: "msg-6", conversationId: "conv-2", sender: "AI客服", content: "只查询你本人订单，正在调用订单和物流接口。", time: "10:04", status: "已读", cardType: "订单卡片", cardData: { orderId: "order-2", status: "运输中", logistics: "已到达深圳转运中心" } },
  { id: "msg-7", conversationId: "conv-2", sender: "人工客服", content: "我已为你核实物流节点，如超过承诺时效会创建售后工单跟进。", time: "10:08", status: "已送达" },
  { id: "msg-8", conversationId: "conv-5", sender: "用户", content: "这个课程买完能看多久？", time: "11:18", status: "已读" },
  { id: "msg-9", conversationId: "conv-5", sender: "AI客服", content: "课程回放有效期为购买后365天，社群权益以课程详情页展示为准。", time: "11:18", status: "已读" },
  { id: "msg-10", conversationId: "conv-6", sender: "用户", content: "我最近睡不好，这个产品能治疗失眠吗？", time: "12:30", status: "已读" },
  { id: "msg-11", conversationId: "conv-6", sender: "AI客服", content: "不能进行疾病诊断或承诺治疗效果。可以提供一般睡眠科普与生活方式建议，如持续不适建议咨询医生。", time: "12:31", status: "已读" },
];

// ============ 工单 ============
export const tickets: Ticket[] = Array.from({ length: 10 }, (_, index) => {
  const conversation = conversations[index];
  const order = orders.find((o) => o.userId === conversation.userId);
  const titles = ["物流异常跟进", "退款争议复核", "门店核销异常", "课程权益补发", "健康咨询人工兜底"];
  const types = ["售后工单", "投诉工单", "门店工单", "课程工单", "大健康合规工单"];
  const owners = ["林客服", "陈客服", "赵店长", "吴运营", "健康顾问周老师"];
  const parties = ["商家客服", "门店", "售后", "仓储", "健康顾问"];
  const ticketStatuses: Ticket["status"][] = ["已提交", "已分配", "处理中", "等待用户补充", "等待外部反馈", "已给出结果", "待用户确认", "已关闭", "已重开", "已升级"];
  return {
    id: `ticket-${index + 1}`,
    tenantId: conversation.tenantId,
    merchantId: conversation.merchantId,
    storeId: conversation.storeId,
    conversationId: conversation.id,
    userId: conversation.userId,
    title: titles[index % 5],
    type: types[index % 5],
    status: ticketStatuses[index],
    priority: (["低", "中", "高", "紧急"] as Ticket["priority"][])[index % 4],
    owner: owners[index % 5],
    responsibleParty: parties[index % 5],
    sla: `${2 + index}小时`,
    records: ["已从会话创建工单", "已分配责任人", "正在核实业务数据"].slice(0, 1 + (index % 3)),
    userConfirm: index % 3 === 0 ? "用户未确认" : "用户认可处理结果",
    orderId: order?.id,
    description: "用户反馈问题需要人工跟进，AI已完成身份、租户、商家、渠道和风险等级识别。",
    aiSummary: conversation.summary,
    createdAt: `2026-05-${String(10 + index).padStart(2, "0")} 11:${String(10 + index).padStart(2, "0")}`,
    updatedAt: `2026-05-${String(10 + index).padStart(2, "0")} 12:${String(15 + index).padStart(2, "0")}`,
    closedAt: index === 7 ? "2026-05-16 18:20" : undefined,
    reopenReason: index === 8 ? "用户不认可处理结果，要求继续核实" : undefined,
    escalationReason: index === 9 ? "超过SLA且涉及高风险投诉，升级给主管处理" : undefined,
  };
});

// ============ FAQ ============
export const faqs: Faq[] = Array.from({ length: 20 }, (_, index) => {
  const tenant = tenants[index % tenants.length];
  const merchant = merchants.find((m) => m.tenantId === tenant.id);
  const line = businessLines[index % businessLines.length];
  const categories = ["平台操作", "商品规则", "售后政策", "门店服务", "课程权益", "健康科普"];
  const questions = ["优惠券如何配置？", "直播商品库存怎么查？", "退款申请如何处理？", "到店核销需要什么？", "课程回放在哪里看？", "睡眠问题可以如何改善？"];
  const answers = [
    "在商家后台-营销中心-优惠券管理中选择新建优惠券，设置面额、门槛、适用范围和有效期后发布即可。",
    "通过AI客服或商家后台-直播管理-商品列表可实时查询库存数量，系统每5分钟自动同步一次库存数据。",
    "消费者在订单详情页点击申请售后，选择退款原因并提交。商家客服需在24小时内处理，平台规则参考《售后服务管理规范》。",
    "到店核销需要用户出示订单二维码，门店工作人员扫码验证后即可核销。部分服务需提前预约，请查看具体商品说明。",
    "已购课程可在APP-我的-我的课程中查看，支持回放、倍速播放和下载。课程有效期和权益以购买时页面展示为准。",
    "建议保持规律作息，睡前避免使用电子设备，适当运动有助于改善睡眠质量。如长期失眠建议咨询睡眠专科医生。",
  ];
  return {
    id: `faq-${index + 1}`,
    tenantId: index % 4 === 0 ? undefined : tenant.id,
    merchantId: index % 4 === 0 ? undefined : merchant?.id,
    scope: (index % 4 === 0 ? "平台" : index % 3 === 0 ? "租户" : "商家") as Faq["scope"],
    category: categories[index % 6],
    question: questions[index % 6],
    similarQuestions: [questions[(index + 1) % 6], questions[(index + 2) % 6]].filter((q, i, arr) => arr.indexOf(q) === i),
    answer: answers[index % 6],
    priority: 50 + (index % 5) * 10,
    riskLevel: (index % 7 === 0 ? "高风险" : index % 3 === 0 ? "中风险" : "低风险") as RiskLevel,
    auditStatus: (["已发布", "已发布", "已发布", "已发布", "待审核", "草稿"] as const)[index % 6],
    effectiveFrom: index % 3 === 0 ? "2026-05-01" : undefined,
    effectiveTo: index % 5 === 0 ? "2026-12-31" : undefined,
    channels: [channels[index % channels.length]],
    hitRate: 62 + (index % 8) * 4,
    references: 18 + index * 7,
    businessLine: line,
  };
});

// ============ 知识文档 ============
export const knowledgeDocuments: KnowledgeDocument[] = Array.from({ length: 10 }, (_, index) => {
  const merchant = merchants[index % merchants.length];
  const statuses: KnowledgeDocument["status"][] = [
    "草稿", "解析中", "待审核", "已发布", "索引中", "已上线", "索引失败", "已降权", "已停用", "已归档",
  ];
  const titles = ["直播活动客服手册", "商城售后政策V2", "门店核销规则", "课程权益说明", "大健康科普边界规范"];
  const types = ["FAQ文档", "政策文档", "商品资料", "课程资料", "大健康科普"];
  const tagsList = [["直播", "客服"], ["售后", "退款"], ["门店", "核销"], ["课程", "权益"], ["健康", "科普"]];
  return {
    id: `doc-${index + 1}`,
    tenantId: merchant.tenantId,
    merchantId: merchant.id,
    title: titles[index % 5],
    type: types[index % 5],
    status: statuses[index],
    businessLine: businessLines[index % businessLines.length],
    tags: tagsList[index % 5],
    version: `v1.${index}`,
    isLatestVersion: index > 7,
    effectiveFrom: index % 3 === 0 ? "2026-05-01" : undefined,
    effectiveTo: index % 4 === 0 ? "2026-12-31" : undefined,
    references: 30 + index * 11,
    hitRate: 55 + index * 3,
    chunks: 12 + index * 4,
    updatedAt: `2026-05-${String(3 + index).padStart(2, "0")}`,
    content: "本文档规定了该业务场景下的客服标准话术、常见问题解答和业务规则边界。",
    chunksData: Array.from({ length: 4 }, (_, ci) => ({
      id: `chunk-doc${index + 1}-${ci}`,
      content: `知识片段 ${ci + 1}: 关于${titles[index % 5]}的第${ci + 1}部分内容。`,
      index: ci,
    })),
  };
});

// ============ 知识缺口 ============
export const knowledgeGaps: KnowledgeGap[] = Array.from({ length: 10 }, (_, index) => {
  const merchant = merchants[index % merchants.length];
  const store = stores.find((s) => s.merchantId === merchant.id);
  const questions = ["直播间组合套餐差异说明", "门店核销失败处理流程", "课程社群权益详细说明", "物流异常赔付边界规则", "健康产品适用场景说明"];
  const gapStatuses: KnowledgeGap["status"][] = [
    "待处理", "待生成候选", "已生成候选知识", "待审核", "已发布", "已驳回",
    "待处理", "已生成候选知识", "待审核", "已发布",
  ];
  return {
    id: `gap-${index + 1}`,
    tenantId: merchant.tenantId,
    merchantId: merchant.id,
    storeId: store?.id,
    conversationId: conversations[index % conversations.length]?.id,
    channel: channels[index % channels.length],
    businessLine: businessLines[index % businessLines.length],
    intent: ["商品咨询", "售后咨询", "门店咨询", "订单咨询", "大健康咨询"][index % 5],
    count: 2 + index,
    feedback: index % 2 === 0 ? "用户反馈未解决" : "人工纠正后可沉淀",
    source: index % 2 === 0 ? "AI未解决" : "人工纠正",
    question: questions[index % 5],
    reason: index % 3 === 0 ? "召回片段不足" : index % 3 === 1 ? "用户反馈未解决" : "缺少相关知识条目",
    candidate: index >= 2 ? "AI已生成候选知识，需运营审核后才能发布上线。" : "",
    status: gapStatuses[index],
    candidateFaq: index >= 2 ? {
      question: questions[index % 5],
      similarQuestions: [questions[index % 5].replace("说明", "怎么处理"), `关于${questions[index % 5].slice(0, 4)}的常见问题`],
      answer: `这是AI生成的候选回答，关于${questions[index % 5]}，需要人工审核后确认发布。`,
      businessLine: businessLines[index % businessLines.length],
      channel: channels[index % channels.length],
      riskLevel: (index % 5 === 4 ? "高风险" : index % 3 === 0 ? "中风险" : "低风险") as KnowledgeGap["candidateFaq"] extends undefined ? never : "低风险" | "中风险" | "高风险",
      sourceConversation: conversations[index % conversations.length]?.id ?? "",
      reviewer: "",
    } : undefined,
    publishedHits: index >= 6 ? 12 + index : undefined,
    publishedResolutionRate: index >= 6 ? 72 + index : undefined,
  };
});

// ============ 大健康风控样本 ============
export const healthRiskSamples: HealthRiskSample[] = [
  {
    id: "health-1",
    tenantId: "tenant-3",
    question: "我最近总是头疼，吃什么药好？",
    riskType: "疾病诊断与用药建议",
    level: "高风险",
    safeReply: "不能提供用药建议。头痛可能由多种原因引起，建议您及时就医检查，明确病因后在医生指导下用药。如果头痛伴随呕吐、视力模糊等症状，请立即就医。",
    disposition: "拦截回复，转人工登记，建议用户咨询医生",
  },
  {
    id: "health-2",
    tenantId: "tenant-3",
    question: "这个营养品能降血压吗？",
    riskType: "治疗效果承诺",
    level: "高风险",
    safeReply: "不能承诺治疗效果。本产品为营养补充食品，不能替代药品。如有血压相关问题，建议咨询心血管专科医生。",
    disposition: "拦截回复，展示产品说明中的免责条款",
  },
  {
    id: "health-3",
    tenantId: "tenant-3",
    question: "每天运动多长时间比较合适？",
    riskType: "生活方式建议",
    level: "低风险",
    safeReply: "一般建议每周进行150分钟中等强度有氧运动，或75分钟高强度有氧运动。您可以每天运动30分钟左右，根据自身情况调整。",
    disposition: "AI可回答，附健康科普知识来源",
  },
  {
    id: "health-4",
    tenantId: "tenant-3",
    question: "失眠应该怎么调理？",
    riskType: "生活方式建议",
    level: "中风险",
    safeReply: "改善睡眠建议：1.保持规律作息；2.睡前避免咖啡因和酒精；3.营造安静舒适的睡眠环境。如果长期失眠影响生活，建议咨询睡眠专科医生，不建议自行用药。",
    disposition: "AI可回答科普内容，但标注'不能替代医学建议'",
  },
  {
    id: "health-5",
    tenantId: "tenant-3",
    question: "你这个产品能治好我的关节炎吗？",
    riskType: "治疗效果承诺",
    level: "高风险",
    safeReply: "不能承诺任何治疗效果。关节炎的诊治需要专业医生根据检查结果进行判断。本产品为关节营养补充食品，如有持续疼痛请及时就医。",
    disposition: "拦截回复，转人工，建议咨询医生",
  },
];

// ============ RAG链路记录 ============
function makeChunks(docBase: string, startIndex: number, count: number, inRerank: boolean, inPrompt: boolean): RagChunk[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `chunk-${docBase}-${startIndex + i}`,
    documentName: `${docBase}文档`,
    title: `${docBase}第${startIndex + i}章`,
    summary: `${docBase}相关内容片段 ${startIndex + i}: 这是从文档中检索到的相关段落摘要。`,
    similarity: +(0.92 - i * 0.08).toFixed(2),
    rerank: +(0.88 - i * 0.06).toFixed(2),
    source: `来源: ${docBase}知识库`,
    enteredRerank: inRerank,
    rank: i + 1,
    enteredPrompt: inPrompt,
    hitReason: i === 0 ? "高度匹配" : i <= 2 ? "部分匹配" : "弱相关",
  }));
}

export const ragTraces: RagTrace[] = [
  {
    id: "rag-1",
    tenantId: "tenant-1",
    merchantId: "merchant-1",
    conversationId: "conv-1",
    userType: "C端消费者",
    businessLine: "直播",
    channel: "APP",
    result: "已回答",
    confidence: 0.89,
    time: "2026-05-10 09:21",
    tenantName: "星选私域零售",
    merchantName: "星选直播旗舰店",
    storeName: "星选直播旗舰店中心店",
    question: "直播间那款营养套装还有库存吗？",
    rewrittenQuestion: "直播专享营养套装 当前库存数量",
    intent: "商品咨询",
    primaryIntent: "商品库存查询",
    secondaryIntent: "直播活动咨询",
    entities: ["直播专享营养套装", "库存", "直播间"],
    retrievalChunks: makeChunks("商品知识", 1, 8, true, true),
    rerankChunks: makeChunks("商品知识", 1, 5, true, true),
    finalChunks: [
      { id: "fc-1", documentName: "商品知识", title: "直播专享营养套装", summary: "本品为直播专属组合，30天用量，含多种维生素和矿物质。正常售价199元。", similarity: 0.92, rerank: 0.91, source: "商品知识库", enteredRerank: true, rank: 1, enteredPrompt: true, hitReason: "精确匹配商品名" },
      { id: "fc-2", documentName: "库存规则", title: "直播商品库存规则", summary: "直播商品库存实时与仓库系统同步。库存充足时页面显示'现货'，库存不足10件时显示'少量'。", similarity: 0.85, rerank: 0.83, source: "运营规则库", enteredRerank: true, rank: 2, enteredPrompt: true, hitReason: "匹配库存查询规则" },
      { id: "fc-3", documentName: "售后政策", title: "直播商品售后规则", summary: "直播商品支持7天无理由退货，但需保持原始包装完好。售后请通过APP订单页发起。", similarity: 0.72, rerank: 0.68, source: "售后政策库", enteredRerank: true, rank: 3, enteredPrompt: true, hitReason: "部分匹配直播商品" },
    ],
    promptVersion: "v2.3",
    systemPromptSummary: "你是星选私域零售的AI客服助手，为消费者提供直播电商相关的商品、订单、售后咨询服务。",
    ragPromptSummary: "基于以下检索到的知识片段回答用户问题。如果信息不足以回答，请告知用户并建议转人工。",
    tokenBudget: 2048,
    modelName: "Claude Opus 4.7",
    generationLatency: 2200,
    outputTokens: 186,
    candidateAnswer: "当前「直播专享营养套装」库存充足，售价199元。该套装为30天组合装，含多种维生素和矿物质。价格和库存以直播间实时页面为准。如需售后规则，我可以继续说明。",
    tokenCost: 0.035,
    riskResult: "通过",
    riskLevel: "低风险",
    riskPassed: true,
    riskRules: ["无敏感词命中", "无治疗效果承诺", "无价格虚假信息"],
    safetyAction: "无需干预",
    finalAnswer: "当前「直播专享营养套装」库存充足，售价199元。该套装为30天组合装，含多种维生素和矿物质。价格和库存以直播间实时页面为准。",
    repliedToUser: true,
    transferredToHuman: false,
    enteredKnowledgeGap: false,
    feedback: "用户未反馈",
    sampleType: "正常样例",
    timeline: [
      "接收用户问题 09:20:01",
      "改写检索问题 09:20:03",
      "向量化 09:20:05",
      "粗召回 09:20:08",
      "重排 09:20:10",
      "拼接Prompt 09:20:12",
      "大模型生成 09:20:14",
      "风控审核 09:20:15",
      "返回用户 09:20:16",
      "日志归档 09:20:17",
    ],
    toolCallResults: [
      { name: "库存查询", result: "直播专享营养套装当前库存：充足，仓库可发货" },
      { name: "风控检查", result: "商品咨询类问题，无风险" },
    ],
  },
  {
    id: "rag-2",
    tenantId: "tenant-3",
    merchantId: "merchant-6",
    conversationId: "conv-6",
    userType: "C端消费者",
    businessLine: "大健康",
    channel: "APP",
    result: "已拦截-高风险",
    confidence: 0.95,
    time: "2026-05-12 12:31",
    tenantName: "知养健康课堂",
    merchantName: "青禾健康服务店",
    storeName: "青禾健康服务店中心店",
    question: "这个产品能治疗失眠吗？",
    rewrittenQuestion: "健康产品 失眠 治疗 效果",
    intent: "大健康咨询",
    primaryIntent: "产品功效咨询",
    secondaryIntent: "疾病治疗咨询",
    entities: ["失眠", "治疗效果", "睡眠"],
    retrievalChunks: makeChunks("大健康科普", 1, 6, true, true),
    rerankChunks: [
      { id: "rc-1", documentName: "大健康科普", title: "睡眠科普知识", summary: "失眠是常见的睡眠障碍，可能由压力、作息不规律、环境因素等引起。建议建立规律作息，避免睡前使用电子设备。", similarity: 0.91, rerank: 0.89, source: "大健康科普库", enteredRerank: true, rank: 1, enteredPrompt: true, hitReason: "高度匹配睡眠问题" },
      { id: "rc-2", documentName: "合规边界", title: "大健康风控规范", summary: "AI不得进行疾病诊断、不得承诺治疗效果、不得推荐药品。大健康产品只能提供科普和生活方式建议。", similarity: 0.88, rerank: 0.87, source: "风控规则库", enteredRerank: true, rank: 2, enteredPrompt: true, hitReason: "匹配合规边界规则" },
    ],
    finalChunks: [
      { id: "fc-4", documentName: "大健康科普", title: "睡眠科普知识", summary: "失眠是常见的睡眠障碍，建议建立规律作息，避免睡前使用电子设备。", similarity: 0.91, rerank: 0.89, source: "大健康科普库", enteredRerank: true, rank: 1, enteredPrompt: true, hitReason: "高度匹配睡眠问题" },
      { id: "fc-5", documentName: "合规边界", title: "大健康风控规范", summary: "AI不得进行疾病诊断、不得承诺治疗效果、不得推荐药品。", similarity: 0.88, rerank: 0.87, source: "风控规则库", enteredRerank: true, rank: 2, enteredPrompt: true, hitReason: "匹配合规边界" },
    ],
    promptVersion: "v2.3",
    systemPromptSummary: "你是知养健康课堂的AI健康助手，仅提供健康科普和生活方式建议。遇到诊断、治疗、用药需求时，必须拒绝并建议咨询医生。",
    ragPromptSummary: "基于知识库回答问题。如果用户问题涉及疾病诊断、治疗方案或药品推荐，必须明确拒绝并建议就医。",
    tokenBudget: 2048,
    modelName: "Claude Opus 4.7",
    generationLatency: 2900,
    outputTokens: 220,
    candidateAnswer: "不能进行疾病诊断或承诺治疗效果。本产品为营养补充食品，不能替代药品。可以提供一般睡眠科普与生活方式建议，如持续不适建议咨询医生。",
    tokenCost: 0.042,
    riskResult: "拦截-高风险",
    riskLevel: "高风险",
    riskPassed: false,
    riskRules: ["命中: '治疗'(治疗效果承诺)", "命中: '失眠'(疾病诊断风险)", "命中: 大健康高危场景"],
    safetyAction: "拦截AI直接回答，替换为安全回复模板，建议咨询医生并转人工留痕",
    finalAnswer: "不能进行疾病诊断或承诺治疗效果。可以提供一般睡眠科普与生活方式建议：建议保持规律作息，睡前避免咖啡因和酒精，营造安静舒适的睡眠环境。如果长期失眠影响生活，建议咨询睡眠专科医生。",
    repliedToUser: true,
    transferredToHuman: false,
    enteredKnowledgeGap: false,
    feedback: "用户未反馈",
    sampleType: "风控拦截样例",
    timeline: [
      "接收用户问题 12:30:01",
      "改写检索问题 12:30:03",
      "向量化 12:30:05",
      "粗召回 12:30:08",
      "重排 12:30:10",
      "拼接Prompt 12:30:12",
      "大模型生成 12:30:14",
      "风控审核 12:30:15 — 触发高风险拦截",
      "返回用户 12:30:15 — 替换为安全回复",
      "日志归档 12:30:16",
    ],
    toolCallResults: [
      { name: "风控检查", result: "问题包含疾病治疗意图，触发高风险规则" },
    ],
  },
  {
    id: "rag-3",
    tenantId: "tenant-2",
    merchantId: "merchant-3",
    userType: "C端消费者",
    businessLine: "门店",
    channel: "小程序",
    result: "已回答-需人工关注",
    confidence: 0.62,
    time: "2026-05-11 14:45",
    tenantName: "同城门店联盟",
    merchantName: "同城生活服务店",
    storeName: "同城生活服务店社区店",
    question: "我在你们门店买了服务券但核销失败了",
    rewrittenQuestion: "门店服务券 核销失败 处理方式",
    intent: "门店咨询",
    primaryIntent: "门店核销异常",
    secondaryIntent: "售后处理",
    entities: ["服务券", "核销失败", "门店"],
    retrievalChunks: makeChunks("门店规则", 1, 6, true, true),
    rerankChunks: [
      { id: "rc-3", documentName: "门店规则", title: "核销流程说明", summary: "到店核销需出示订单二维码，门店扫码验证。如核销失败，常见原因包括：1.未到预约时间；2.订单已核销；3.系统故障。", similarity: 0.75, rerank: 0.72, source: "门店规则库", enteredRerank: true, rank: 1, enteredPrompt: true, hitReason: "匹配核销问题" },
    ],
    finalChunks: [
      { id: "fc-6", documentName: "门店规则", title: "核销流程说明", summary: "到店核销需出示订单二维码。核销失败常见原因：未到预约时间、订单已核销、系统故障。建议门店人员检查后重试。", similarity: 0.75, rerank: 0.72, source: "门店规则库", enteredRerank: true, rank: 1, enteredPrompt: true, hitReason: "匹配核销问题" },
    ],
    promptVersion: "v2.2",
    systemPromptSummary: "你是同城门店联盟的AI客服助手。",
    ragPromptSummary: "基于门店规则回答核销相关问题。",
    tokenBudget: 2048,
    modelName: "Claude Opus 4.7",
    generationLatency: 2500,
    outputTokens: 156,
    candidateAnswer: "核销失败可能有多种原因。建议您联系门店工作人员检查二维码和订单状态。如果问题无法解决，可以为您创建工单跟进。",
    tokenCost: 0.028,
    riskResult: "通过",
    riskLevel: "低风险",
    riskPassed: true,
    riskRules: ["无敏感词命中"],
    safetyAction: "无需干预",
    finalAnswer: "核销失败可能有多种原因：1.未到预约时间；2.订单已核销；3.系统故障。建议联系门店工作人员检查后重试。如需进一步帮助，可为您转接人工客服。",
    repliedToUser: true,
    transferredToHuman: false,
    enteredKnowledgeGap: true,
    feedback: "用户差评 - AI未彻底解决",
    sampleType: "知识缺口样例",
    timeline: [
      "接收用户问题 14:45:01",
      "改写检索问题 14:45:03",
      "向量化 14:45:05",
      "粗召回 14:45:08 — 召回片段相关性偏低",
      "重排 14:45:10",
      "拼接Prompt 14:45:12",
      "大模型生成 14:45:14",
      "风控审核 14:45:15 — 通过",
      "返回用户 14:45:15",
      "日志归档 14:45:16 — 标记为知识缺口",
    ],
    toolCallResults: [
      { name: "知识检索", result: "未找到匹配的核销退款规则" },
      { name: "风控检查", result: "低风险，可正常回复" },
    ],
  },
  {
    id: "rag-4",
    tenantId: "tenant-1",
    merchantId: "merchant-2",
    userType: "B端商家",
    businessLine: "商城",
    channel: "商家后台",
    result: "已回答-B端",
    confidence: 0.88,
    time: "2026-05-13 16:20",
    tenantName: "星选私域零售",
    merchantName: "星选商城优品店",
    storeName: "",
    question: "商家后台怎么设置优惠券？",
    rewrittenQuestion: "商家后台 优惠券 配置步骤 操作方法",
    intent: "平台操作咨询",
    primaryIntent: "商家工具使用",
    secondaryIntent: "营销工具配置",
    entities: ["优惠券", "商家后台", "配置"],
    retrievalChunks: makeChunks("平台帮助", 1, 6, true, true),
    rerankChunks: [
      { id: "rc-4", documentName: "平台帮助", title: "优惠券配置指南", summary: "在商家后台-营销中心-优惠券管理中选择新建优惠券，设置面额、门槛、适用范围和有效期后发布。", similarity: 0.94, rerank: 0.93, source: "平台帮助文档库", enteredRerank: true, rank: 1, enteredPrompt: true, hitReason: "精确匹配操作指引" },
    ],
    finalChunks: [
      { id: "fc-7", documentName: "平台帮助", title: "优惠券配置指南", summary: "在商家后台-营销中心-优惠券管理中选择新建优惠券。", similarity: 0.94, rerank: 0.93, source: "平台帮助文档库", enteredRerank: true, rank: 1, enteredPrompt: true, hitReason: "精确匹配操作指引" },
    ],
    promptVersion: "v2.3",
    systemPromptSummary: "你是SaaS平台的AI客服，帮助B端商家解决平台操作问题。",
    ragPromptSummary: "基于平台帮助文档回答商家操作问题，附操作路径。",
    tokenBudget: 2048,
    modelName: "Claude Opus 4.7",
    generationLatency: 1800,
    outputTokens: 142,
    candidateAnswer: "在商家后台-营销中心-优惠券管理中，点击新建优惠券，即可设置面额、使用门槛、适用范围和有效期。发布后生效。",
    tokenCost: 0.022,
    riskResult: "通过",
    riskLevel: "低风险",
    riskPassed: true,
    riskRules: ["无敏感词命中"],
    safetyAction: "无需干预",
    finalAnswer: "操作路径：商家后台 → 营销中心 → 优惠券管理 → 新建优惠券。您可以在该页面设置优惠券面额、使用门槛、适用范围和有效期。发布后即时生效。如有其他问题，可继续咨询。",
    repliedToUser: true,
    transferredToHuman: false,
    enteredKnowledgeGap: false,
    feedback: "用户未反馈",
    sampleType: "正常样例",
    timeline: [
      "接收用户问题 16:20:01",
      "改写检索问题 16:20:03",
      "向量化 16:20:05",
      "粗召回 16:20:08",
      "重排 16:20:10",
      "拼接Prompt 16:20:12",
      "大模型生成 16:20:14",
      "风控审核 16:20:15",
      "返回用户 16:20:16",
      "日志归档 16:20:17",
    ],
    toolCallResults: [
      { name: "课程权益查询", result: "课程体验包有效期365天，支持回放和倍速播放" },
    ],
  },
  {
    id: "rag-5",
    tenantId: "tenant-3",
    merchantId: "merchant-5",
    userType: "C端消费者",
    businessLine: "课程/知识付费",
    channel: "APP",
    result: "已回答",
    confidence: 0.91,
    time: "2026-05-14 11:18",
    tenantName: "知养健康课堂",
    merchantName: "知养课程旗舰店",
    storeName: "",
    question: "课程买完能看多久？回放在哪里看？",
    rewrittenQuestion: "课程有效期 回放入口 观看方式",
    intent: "课程咨询",
    primaryIntent: "课程权益查询",
    secondaryIntent: "回放操作指引",
    entities: ["课程", "有效期", "回放"],
    retrievalChunks: makeChunks("课程知识", 1, 6, true, true),
    rerankChunks: [
      { id: "rc-5", documentName: "课程知识", title: "课程权益说明", summary: "已购课程有效期365天，支持回放、倍速播放和下载。回放入口在APP-我的-我的课程中。", similarity: 0.93, rerank: 0.92, source: "课程知识库", enteredRerank: true, rank: 1, enteredPrompt: true, hitReason: "精确匹配课程权益" },
    ],
    finalChunks: [
      { id: "fc-8", documentName: "课程知识", title: "课程权益说明", summary: "已购课程有效期365天，支持回放、倍速播放和下载。", similarity: 0.93, rerank: 0.92, source: "课程知识库", enteredRerank: true, rank: 1, enteredPrompt: true, hitReason: "精确匹配课程权益" },
    ],
    promptVersion: "v2.3",
    systemPromptSummary: "你是知养健康课堂的AI客服助手。",
    ragPromptSummary: "基于课程知识库回答课程相关问题。",
    tokenBudget: 2048,
    modelName: "Claude Opus 4.7",
    generationLatency: 1950,
    outputTokens: 112,
    candidateAnswer: "已购课程有效期为购买后365天。回放入口在APP-我的-我的课程中，支持在线播放和倍速播放。",
    tokenCost: 0.019,
    riskResult: "通过",
    riskLevel: "低风险",
    riskPassed: true,
    riskRules: ["无敏感词命中"],
    safetyAction: "无需干预",
    finalAnswer: "已购课程有效期为购买后365天，期间可无限次回放。回放入口：APP → 我的 → 我的课程。支持在线播放、倍速播放和下载。社群权益以课程详情页展示为准。",
    repliedToUser: true,
    transferredToHuman: false,
    enteredKnowledgeGap: false,
    feedback: "用户未反馈",
    sampleType: "正常样例",
    timeline: [
      "接收用户问题 11:18:01",
      "改写检索问题 11:18:03",
      "向量化 11:18:05",
      "粗召回 11:18:08",
      "重排 11:18:10",
      "拼接Prompt 11:18:12",
      "大模型生成 11:18:14",
      "风控审核 11:18:15",
      "返回用户 11:18:16",
      "日志归档 11:18:17",
    ],
    toolCallResults: [
      { name: "课程权益查询", result: "健康科普课程有效期365天，可回放" },
      { name: "风控检查", result: "课程咨询类问题，低风险通过" },
    ],
  },
];

// ============ 客服人员 ============
export const customerServiceAgents: CustomerServiceAgent[] = [
  { id: "agent-1", tenantId: "tenant-1", name: "林客服", status: "在线", skillGroups: ["售前客服", "售后客服"], maxSessions: 5, currentSessions: 3, serviceHours: "09:00-18:00", schedule: "周一至周五" },
  { id: "agent-2", tenantId: "tenant-1", name: "陈客服", status: "忙碌", skillGroups: ["售后客服", "门店客服"], maxSessions: 5, currentSessions: 5, serviceHours: "10:00-19:00", schedule: "周二至周六" },
  { id: "agent-3", tenantId: "tenant-2", name: "赵店长", status: "在线", skillGroups: ["门店客服", "售前客服"], maxSessions: 3, currentSessions: 1, serviceHours: "09:00-21:00", schedule: "周一至周日" },
  { id: "agent-4", tenantId: "tenant-3", name: "吴运营", status: "小休", skillGroups: ["课程客服", "售前客服"], maxSessions: 5, currentSessions: 0, serviceHours: "09:00-18:00", schedule: "周一至周五" },
  { id: "agent-5", tenantId: "tenant-3", name: "健康顾问周老师", status: "离线", skillGroups: ["大健康顾问"], maxSessions: 3, currentSessions: 0, serviceHours: "10:00-20:00", schedule: "周一至周五" },
];

// ============ 机器人配置 ============
export const robotConfigs: RobotConfig[] = [
  { id: "robot-1", tenantId: "tenant-1", name: "星选直播客服机器人", status: "启用", ownershipLevel: "商家", businessLines: ["直播"], channels: ["APP", "小程序", "H5"], knowledgeBases: ["商品知识", "售后政策", "直播规则"], availableTools: ["商品查询", "活动查询", "订单查询"], welcome: "您好，欢迎咨询星选直播！我可以帮您查询商品、订单和售后问题。", quickQuestions: ["今天有什么优惠？", "这个商品怎么买？", "直播间下单多久发货？"], style: "专业友好", maxFollowUpRounds: 3, lowConfidenceThreshold: 0.65, humanRule: "AI置信度低于70%或用户明确要求转人工时自动转接", riskPolicy: "大健康/投诉/退款金额超过500元自动转人工", model: "Claude Opus 4.7", promptVersion: "v2.3" },
  { id: "robot-2", tenantId: "tenant-1", name: "星选商城客服机器人", status: "启用", ownershipLevel: "商家", businessLines: ["商城"], channels: ["H5", "商家后台"], knowledgeBases: ["商城规则", "商品资料", "售后政策"], availableTools: ["商品查询", "订单查询", "物流查询", "售后查询", "会员查询"], welcome: "您好，星选商城为您服务！有什么可以帮助您的？", quickQuestions: ["怎么申请退款？", "优惠券怎么用？", "会员有什么权益？"], style: "简洁高效", maxFollowUpRounds: 2, lowConfidenceThreshold: 0.65, humanRule: "AI未解决问题或用户要求转人工时转接", riskPolicy: "标准风控策略", model: "Claude Sonnet 4.6", promptVersion: "v2.2" },
  { id: "robot-3", tenantId: "tenant-2", name: "同城门店联盟客服机器人", status: "启用", ownershipLevel: "租户", businessLines: ["门店"], channels: ["小程序", "公众号/微信客服"], knowledgeBases: ["门店规则", "核销流程", "预约说明"], availableTools: ["门店查询", "订单查询", "活动查询"], welcome: "您好，欢迎咨询同城门店联盟！可以帮您预约、核销和门店咨询服务。", quickQuestions: ["附近有什么门店？", "怎么预约到店？", "核销码在哪里看？"], style: "亲切温和", maxFollowUpRounds: 3, lowConfidenceThreshold: 0.60, humanRule: "核销失败或预约异常时自动转人工", riskPolicy: "标准风控策略", model: "Claude Opus 4.7", promptVersion: "v2.2" },
  { id: "robot-4", tenantId: "tenant-3", name: "知养课堂客服机器人", status: "启用", ownershipLevel: "商家", businessLines: ["课程/知识付费", "大健康"], channels: ["APP", "H5"], knowledgeBases: ["课程知识", "课程权益", "大健康科普"], availableTools: ["课程查询", "订单查询", "会员查询", "售后查询"], welcome: "您好，知养健康课堂为您服务！课程咨询和健康科普都可以问我。", quickQuestions: ["课程可以退款吗？", "怎么查看课程回放？", "每天吃什么更健康？"], style: "专业严谨", maxFollowUpRounds: 2, lowConfidenceThreshold: 0.70, humanRule: "健康相关高风险问题自动转人工", riskPolicy: "大健康强化风控策略", model: "Claude Opus 4.7", promptVersion: "v2.3" },
  { id: "robot-5", tenantId: "tenant-3", name: "青禾健康服务机器人", status: "停用", ownershipLevel: "商家", businessLines: ["大健康"], channels: ["APP"], knowledgeBases: ["大健康科普", "产品说明"], availableTools: ["商品查询", "订单查询"], welcome: "您好，青禾健康为您服务！", quickQuestions: ["这个产品适合我吗？", "日常怎么调理身体？"], style: "专业温和", maxFollowUpRounds: 2, lowConfidenceThreshold: 0.70, humanRule: "诊断/治疗/用药类问题必须转人工", riskPolicy: "大健康最高级风控策略", model: "Claude Opus 4.7", promptVersion: "v2.1" },
];

// ============ 模型调用记录 ============
export const modelCallLogs: ModelCallLog[] = [
  { id: "log-1", tenantId: "tenant-1", provider: "Anthropic", model: "Claude Opus 4.7", scene: "FAQ匹配", status: "成功", latency: 850, tokenCost: 620, cost: 0.012, createdAt: "2026-05-15 10:12" },
  { id: "log-2", tenantId: "tenant-3", provider: "Anthropic", model: "Claude Opus 4.7", scene: "RAG检索增强", status: "成功", latency: 2200, tokenCost: 2100, cost: 0.042, createdAt: "2026-05-15 10:15" },
  { id: "log-3", tenantId: "tenant-1", provider: "Anthropic", model: "Claude Sonnet 4.6", scene: "工具调用", status: "成功", latency: 1500, tokenCost: 980, cost: 0.008, createdAt: "2026-05-15 10:18" },
  { id: "log-4", tenantId: "tenant-2", provider: "Anthropic", model: "Claude Opus 4.7", scene: "大健康风控", status: "已降级", latency: 4500, tokenCost: 3200, cost: 0.064, createdAt: "2026-05-15 10:22" },
  { id: "log-5", tenantId: "tenant-3", provider: "Anthropic", model: "Claude Opus 4.7", scene: "RAG检索增强", status: "失败", latency: 0, tokenCost: 0, cost: 0, createdAt: "2026-05-15 10:25" },
];

// ============ Prompt版本 ============
export const promptVersions: PromptVersion[] = [
  { id: "prompt-1", name: "客服系统提示词V3", type: "系统提示词", version: "v2.3", status: "已发布", owner: "算法团队", updatedAt: "2026-05-10", content: "你是{{租户名称}}的AI客服助手，为{{用户类型}}提供{{业务线}}相关的咨询服务。你必须：1.基于知识库回答；2.涉及价格/库存/订单时调用只读工具；3.不进行疾病诊断/治疗承诺/用药建议；4.不执行写操作。" },
  { id: "prompt-2", name: "RAG检索提示词V2", type: "检索增强提示词", version: "v2.3", status: "灰度中", owner: "算法团队", updatedAt: "2026-05-12", content: "基于以下检索到的知识片段回答用户问题。如果信息不足以回答问题，请明确告知用户并建议转人工。不要编造知识片段中没有的信息。", grayRange: "tenant-3全部商家" },
  { id: "prompt-3", name: "工具调用提示词V1", type: "工具调用提示词", version: "v2.2", status: "已发布", owner: "算法团队", updatedAt: "2026-05-08", content: "当需要查询实时数据时，调用对应的工具接口。工具调用结果仅用于辅助回答，不直接展示原始数据。涉及用户隐私数据时必须脱敏。" },
  { id: "prompt-4", name: "大健康安全提示词V3", type: "安全提示词", version: "v2.3", status: "已发布", owner: "风控团队", updatedAt: "2026-05-11", content: "你不得进行任何疾病的诊断、治疗建议或药品推荐。对于健康相关问题，仅提供经过审核的科普知识和生活方式建议。遇到任何诊断/治疗/用药相关问题时，必须明确拒绝并建议咨询医生。" },
  { id: "prompt-5", name: "输出格式化提示词V1", type: "输出提示词", version: "v2.1", status: "已回滚", owner: "算法团队", updatedAt: "2026-05-05", content: "回答应简洁、准确、有据可查。涉及操作步骤时使用有序列表。涉及金额、日期、订单号时直接引用工具返回的准确数据。" },
];

// ============ 工具调用记录 ============
export const serviceRecords: ServiceRecord[] = [
  { id: "sr-1", tenantId: "tenant-1", merchantId: "merchant-1", conversationId: "conv-1", toolName: "商品库存查询", callStatus: "成功", permissionResult: "已授权-只读", inputSummary: "查询商品: 直播专享营养套装", outputSummary: "库存充足，实时库存数量已返回", readOnly: true, riskChecked: true, latency: "320ms", calledAt: "2026-05-15 10:12:05" },
  { id: "sr-2", tenantId: "tenant-1", merchantId: "merchant-2", conversationId: "conv-2", toolName: "物流状态查询", callStatus: "成功", permissionResult: "已授权-只读-本用户", inputSummary: "查询订单: order-2 物流信息", outputSummary: "物流节点: 已到达深圳转运中心", readOnly: true, riskChecked: true, latency: "280ms", calledAt: "2026-05-15 10:13:22" },
  { id: "sr-3", tenantId: "tenant-3", merchantId: "merchant-6", conversationId: "conv-6", toolName: "大健康风控检查", callStatus: "成功", permissionResult: "已授权", inputSummary: "风控检查: 用户询问产品治疗失眠", outputSummary: "高风险-命中医嘱/治疗效果规则", readOnly: true, riskChecked: true, latency: "450ms", calledAt: "2026-05-15 10:14:18" },
  { id: "sr-4", tenantId: "tenant-1", merchantId: "merchant-1", toolName: "订单退款金额查询", callStatus: "无权限", permissionResult: "拒绝-AI不可执行写操作", inputSummary: "尝试查询退款金额计算", outputSummary: "写操作被拦截，AI仅可查询退款规则", readOnly: false, riskChecked: true, latency: "50ms", calledAt: "2026-05-15 10:15:01", failureReason: "AI不可执行退款计算等写操作" },
  { id: "sr-5", tenantId: "tenant-2", merchantId: "merchant-3", conversationId: "conv-11", toolName: "门店库存查询", callStatus: "失败", permissionResult: "已授权-只读", inputSummary: "查询门店: store-3 库存", outputSummary: "接口超时，库存系统暂不可用", readOnly: true, riskChecked: true, latency: "5000ms", calledAt: "2026-05-15 10:16:45", failureReason: "下游库存系统超时" },
];

// ============ 企微通知 ============
export const weComNotifications: WeComNotification[] = [
  { id: "notif-1", conversationId: "conv-2", ticketId: "ticket-2", status: "已通知", target: "陈客服(售后)", time: "2026-05-12 10:30", summary: "订单物流异常升级为工单，已通知售后客服处理", entry: "企微工作台-待办提醒", records: ["09:45 用户咨询物流", "10:00 AI识别异常", "10:08 人工接入", "10:30 建工单并企微通知"] },
  { id: "notif-2", ticketId: "ticket-4", status: "未通知", target: "吴运营(课程客服)", time: "2026-05-13 11:15", summary: "课程权益补发工单待处理", entry: "企微工作台-待办提醒", records: [] },
  { id: "notif-3", conversationId: "conv-6", status: "通知失败", target: "健康顾问周老师", time: "2026-05-13 12:35", summary: "大健康高风险咨询需人工关注", entry: "企微工作台-紧急提醒", records: ["12:30 用户咨询产品治疗失眠", "12:31 AI拦截高风险回复", "12:35 企微通知回调失败"] },
];
