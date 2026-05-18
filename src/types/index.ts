export type Portal = "app" | "tenant" | "platform";

export type BusinessLine = "直播" | "商城" | "门店" | "课程/知识付费" | "大健康";
export type Channel = "APP" | "小程序" | "H5" | "商家后台" | "企业微信" | "公众号/微信客服";

export type ConversationStatus =
  | "已创建"
  | "AI接待中"
  | "等待用户补充"
  | "等待人工接入"
  | "人工接待中"
  | "已关联工单"
  | "已解决"
  | "已评价"
  | "已关闭"
  | "已重开"
  | "已归档";

export type TicketStatus =
  | "草稿"
  | "已提交"
  | "已分配"
  | "处理中"
  | "等待用户补充"
  | "等待外部反馈"
  | "已给出结果"
  | "待用户确认"
  | "已关闭"
  | "已重开"
  | "已升级";

export type KnowledgeStatus =
  | "草稿"
  | "解析中"
  | "解析失败"
  | "切片中"
  | "待审核"
  | "已驳回"
  | "已发布"
  | "索引中"
  | "已上线"
  | "索引失败"
  | "已降权"
  | "已过期"
  | "已停用"
  | "已归档";

export type AiAnswerStatus =
  | "已接收问题"
  | "已完成分类"
  | "需要补充信息"
  | "正在调用工具"
  | "正在匹配FAQ"
  | "正在检索知识"
  | "正在生成答案"
  | "正在风控审核"
  | "已回复"
  | "需要人工处理"
  | "已转人工"
  | "已关闭";

export type AgentStatus = "在线" | "忙碌" | "离线" | "小休" | "会议中";
export type RiskLevel = "低风险" | "中风险" | "高风险";
export type Priority = "低" | "中" | "高" | "紧急";
export type TenantStatus = "启用" | "停用";
export type MerchantStatus = "营业中" | "暂停服务";

export interface Tenant {
  id: string;
  name: string;
  industry: string;
  status: TenantStatus;
  packageName: string;
  expiresAt: string;
  channels: Channel[];
  tokenUsed: number;
  tokenLimit: number;
  seatLimit: number;
  knowledgeCapacity: number;
}

export interface Merchant {
  id: string;
  tenantId: string;
  name: string;
  industry: string;
  status: MerchantStatus;
  storeCount: number;
  consultationCount: number;
  ticketCount: number;
}

export interface Store {
  id: string;
  tenantId: string;
  merchantId: string;
  name: string;
  city: string;
  address: string;
  hours: string;
  phone: string;
  inventory: string;
  serviceTags: string[];
}

export interface User {
  id: string;
  tenantId: string;
  merchantId: string;
  storeId?: string;
  name: string;
  maskedPhone: string;
  level: string;
  points: number;
  coupons: number;
  tags: string[];
}

export interface Order {
  id: string;
  tenantId: string;
  merchantId: string;
  storeId?: string;
  userId: string;
  imageTone: string;
  productName: string;
  spec: string;
  amount: number;
  status: string;
  logistics: string;
  afterSaleStatus: string;
  paymentInfo: string;
  receiverInfo: string;
  logisticsTimeline: string[];
  businessLine: BusinessLine;
  channel: Channel;
  createdAt: string;
}

export interface AfterSale {
  id: string;
  orderId: string;
  tenantId: string;
  merchantId: string;
  userId: string;
  type: "退款申请" | "退货申请" | "换货申请";
  status: string;
  progress: string[];
  result: string;
  records: string[];
  needUserConfirm: boolean;
  userConfirmed?: string;
}

export interface Conversation {
  id: string;
  tenantId: string;
  merchantId: string;
  storeId?: string;
  userId: string;
  title: string;
  status: ConversationStatus;
  channel: Channel;
  businessLine: BusinessLine;
  intent: string;
  riskLevel: RiskLevel;
  transferredToHuman: boolean;
  satisfaction?: number;
  tags: string[];
  createdAt: string;
  summary: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: "用户" | "AI客服" | "人工客服" | "系统";
  content: string;
  time: string;
  status: "发送中" | "已送达" | "已读";
  cardType?: "商品卡片" | "订单卡片" | "工单卡片" | "库存查询" | "库存查询结果" | "物流查询" | "物流查询结果";
  cardData?: Record<string, string>;
}

export interface Ticket {
  id: string;
  tenantId: string;
  merchantId: string;
  storeId?: string;
  conversationId: string;
  userId: string;
  title: string;
  type: string;
  status: TicketStatus;
  priority: Priority;
  owner: string;
  responsibleParty: string;
  sla: string;
  records: string[];
  userConfirm: string;
  orderId?: string;
  description: string;
  aiSummary: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  reopenReason?: string;
  escalationReason?: string;
}

export interface Faq {
  id: string;
  tenantId?: string;
  merchantId?: string;
  scope: "平台" | "租户" | "商家" | "门店";
  category: string;
  question: string;
  similarQuestions: string[];
  answer: string;
  priority: number;
  riskLevel: RiskLevel;
  auditStatus: "草稿" | "待审核" | "已发布" | "已驳回" | "已下线";
  effectiveFrom?: string;
  effectiveTo?: string;
  businessLine: BusinessLine;
  channels: Channel[];
  hitRate: number;
  references: number;
}

export interface KnowledgeDocument {
  id: string;
  tenantId?: string;
  merchantId?: string;
  title: string;
  type: string;
  status: KnowledgeStatus;
  businessLine: BusinessLine;
  tags: string[];
  version: string;
  isLatestVersion: boolean;
  effectiveFrom?: string;
  effectiveTo?: string;
  references: number;
  hitRate: number;
  chunks: number;
  updatedAt: string;
  content?: string;
  reviewComment?: string;
  chunksData?: { id: string; content: string; index: number }[];
}

export interface KnowledgeGap {
  id: string;
  tenantId: string;
  merchantId: string;
  storeId?: string;
  conversationId?: string;
  channel?: Channel;
  businessLine?: BusinessLine;
  intent?: string;
  count?: number;
  feedback?: string;
  source: string;
  question: string;
  reason: string;
  candidate: string;
  status: "待处理" | "待生成候选" | "已生成候选知识" | "待审核" | "已发布" | "已驳回" | "已关闭" | "追踪中";
  candidateFaq?: {
    question: string;
    similarQuestions: string[];
    answer: string;
    businessLine: BusinessLine;
    channel: Channel;
    riskLevel: RiskLevel;
    sourceConversation: string;
    reviewer: string;
  };
  publishedHits?: number;
  publishedResolutionRate?: number;
  satisfaction?: number;
  negativeFeedbackRate?: number;
}

export interface HealthRiskSample {
  id: string;
  tenantId: string;
  question: string;
  riskType: string;
  level: RiskLevel;
  safeReply: string;
  disposition: string;
}

export interface RagChunk {
  id: string;
  documentName: string;
  title: string;
  summary: string;
  similarity: number;
  rerank: number;
  source: string;
  enteredRerank: boolean;
  rank: number;
  enteredPrompt: boolean;
  hitReason: string;
}

export interface RagTrace {
  id: string;
  tenantId: string;
  merchantId: string;
  storeId?: string;
  conversationId?: string;
  userType: string;
  businessLine: BusinessLine;
  channel: Channel;
  result: string;
  confidence: number;
  time: string;
  tenantName: string;
  merchantName: string;
  storeName: string;
  question: string;
  rewrittenQuestion: string;
  intent: string;
  primaryIntent: string;
  secondaryIntent: string;
  entities: string[];
  retrievalChunks: RagChunk[];
  rerankChunks: RagChunk[];
  finalChunks: RagChunk[];
  promptVersion: string;
  systemPromptSummary: string;
  ragPromptSummary: string;
  tokenBudget: number;
  modelName: string;
  generationLatency: number;
  outputTokens: number;
  candidateAnswer: string;
  tokenCost: number;
  riskResult: string;
  riskLevel: RiskLevel;
  riskPassed: boolean;
  riskRules: string[];
  safetyAction: string;
  finalAnswer: string;
  repliedToUser: boolean;
  transferredToHuman: boolean;
  enteredKnowledgeGap: boolean;
  feedback: string;
  sampleType: string;
  timeline: string[];
  toolCallResults?: { name: string; result: string }[];
}

export interface CustomerServiceAgent {
  id: string;
  tenantId: string;
  name: string;
  status: AgentStatus;
  skillGroups: string[];
  maxSessions: number;
  currentSessions: number;
  serviceHours: string;
  schedule?: string;
}

export type OwnershipLevel = "平台" | "租户" | "商家" | "门店";

export interface RobotConfig {
  id: string;
  tenantId: string;
  name: string;
  status: "启用" | "停用";
  ownershipLevel: OwnershipLevel;
  businessLines: BusinessLine[];
  channels: Channel[];
  knowledgeBases: string[];
  availableTools: string[];
  welcome: string;
  quickQuestions: string[];
  style: string;
  maxFollowUpRounds: number;
  lowConfidenceThreshold: number;
  humanRule: string;
  riskPolicy: string;
  model: string;
  promptVersion: string;
}

export interface ModelCallLog {
  id: string;
  tenantId?: string;
  provider: string;
  model: string;
  scene: string;
  status: "成功" | "失败" | "已降级";
  latency: number;
  tokenCost: number;
  cost: number;
  createdAt: string;
}

export interface PromptVersion {
  id: string;
  name: string;
  type: "系统提示词" | "检索增强提示词" | "工具调用提示词" | "安全提示词" | "输出提示词";
  version: string;
  status: "灰度中" | "已发布" | "已回滚";
  owner: string;
  updatedAt: string;
  content?: string;
  grayRange?: string;
}

export interface ServiceRecord {
  id: string;
  tenantId: string;
  merchantId: string;
  storeId?: string;
  conversationId?: string;
  orderId?: string;
  ragTraceId?: string;
  toolName: string;
  callStatus: "成功" | "失败" | "无权限";
  permissionResult: string;
  inputSummary: string;
  outputSummary: string;
  readOnly: boolean;
  riskChecked: boolean;
  latency: string;
  calledAt: string;
  failureReason?: string;
}

export interface WeComNotification {
  id: string;
  conversationId?: string;
  ticketId?: string;
  status: "已通知" | "未通知" | "通知失败";
  target: string;
  time: string;
  summary: string;
  entry: string;
  records: string[];
}

export interface AppContextValue {
  portal: Portal;
  currentUserId: string;
  currentTenantId: string;
  currentMerchantId: string;
  currentStoreId: string;
  currentBusinessLine: BusinessLine;
  currentChannel: Channel;
}

export interface NavigationParams {
  orderId?: string;
  afterSaleOrderId?: string;
  chatPrompt?: string;
}

export interface PageProps {
  context: AppContextValue;
  goPage?: (pageId: string, params?: NavigationParams) => void;
  navigationParams?: NavigationParams;
}

export interface MenuItem {
  id: string;
  label: string;
}

export interface SidebarCategory {
  id: string;
  label: string;
  iconName: string;
  children: MenuItem[];
}
