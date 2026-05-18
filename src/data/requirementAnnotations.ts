export interface RequirementAnnotation {
  id: number;
  pageName: string;
  pagePath?: string;
  moduleName: string;
  targetSelector: string;
  markdown: string;
  sourcePrdText?: string;
  status?: "active" | "deleted";
}

export const requirementAnnotations: RequirementAnnotation[] = [
  // ===== APP 端 (C-end) =====
  {
    id: 1,
    pageName: "AI客服对话",
    pagePath: "/app/ai-service",
    moduleName: "会话窗口",
    targetSelector: "[data-annotation-target='app-ai-chat-window']",
    markdown: `## 显示样式
- 客服窗口顶部展示商家名称/客服名称、在线状态
- 首次进入展示欢迎语和3-6个快捷问题入口
- 消息流支持文本、商品卡片、订单卡片、工单卡片、物流卡片
- AI回答引用来源时展示"来源：XXX文档"

## 交互逻辑
- 用户发送消息后，AI按FAQ→RAG→工具调用优先级处理
- 缺少订单号/商品名等信息时AI应主动追问，最多2轮
- AI无法回答时展示转人工入口
- 会话结束后邀请用户评价（有用/无用）
- 用户从商品页/订单页进入时自动携带上下文对象ID

## 业务规则
- 会话创建时绑定tenant_id和channel
- C端会话绑定merchant_id和user_id
- 会话默认有效期2小时，超时进入历史会话
- 2小时内重复进入同一场景继续原会话
- 价格/库存/订单/物流必须调用业务接口，不得由RAG回答
- AI不得直接审批退款、改价、发券

## 异常流程
- 模型调用失败：显示"服务暂时不可用，正在转人工"
- 工具调用超时：提示重试或转人工
- 排队场景：显示等待人数和预计等待时间
- 风控拦截：安全话术+转人工

## 验收标准
- 用户发送消息到AI首条回复 ≤3秒
- FAQ命中响应时间 ≤1秒
- AI自动解决率 ≥50%
- 人工转接成功率 ≥98%`,
    sourcePrdText: "PRD 14.1 C端客服窗口 + 13.4 AI问答引擎",
  },
  {
    id: 2,
    pageName: "AI客服对话",
    pagePath: "/app/ai-service",
    moduleName: "快捷问题入口",
    targetSelector: "[data-annotation-target='app-ai-quick-chips']",
    markdown: `## 显示样式
- 欢迎语下方展示快捷问题入口，网格布局（2列）
- 包含：查订单物流、申请售后、问商品库存、附近门店、课程权益、健康咨询

## 交互逻辑
- 点击快捷问题自动发送用户消息并触发AI回答
- AI处理中快捷入口置灰不可点击
- 用户发送首条消息后快捷入口收起

## 业务规则
- 快捷问题应根据商户配置动态展示
- 大健康商户默认关闭"健康咨询"入口（需在机器人配置中开启）
- 快捷问题标签可在机器人配置中自定义`,
    sourcePrdText: "PRD 14.1.2 基础交互",
  },
  {
    id: 3,
    pageName: "AI客服对话",
    pagePath: "/app/ai-service",
    moduleName: "业务结果卡片",
    targetSelector: "[data-annotation-target='app-ai-business-card']",
    markdown: `## 显示样式
- 商品卡片：商品名+价格高亮（红色）+库存状态+活动标签
- 订单卡片：订单号+StatusBadge+物流进度+售后入口按钮
- 库存查询结果：商品名+规格+库存数+价格+查询方式+查看链路按钮
- 物流查询结果：物流状态+最新位置+时间线+查询时间+查看链路按钮

## 业务规则
- 价格/库存必须以业务接口实时数据为准，不凭知识库生成
- 商品下架或库存为0时应引导预约/到货提醒
- 订单状态影响可执行动作（已签收可申请售后，运输中不可退款）
- 工具调用失败时展示错误提示并提供转人工入口`,
    sourcePrdText: "PRD 13.5 业务工具调用 + 14.1.2",
  },
  {
    id: 4,
    pageName: "AI客服对话",
    pagePath: "/app/ai-service",
    moduleName: "底部输入区",
    targetSelector: "[data-annotation-target='app-ai-input-bar']",
    markdown: `## 显示样式
- 输入框+发送按钮+转人工按钮
- 转人工后显示提示条"已为你转人工，请稍候"

## 交互逻辑
- 支持键盘Enter发送
- AI处理中输入框置灰
- 转人工按钮点击后进入人工队列

## 业务规则
- 用户主动要求人工时不得强行继续AI对话
- 转人工时必须带入会话摘要、用户身份、AI已处理结果
- 无在线客服时必须创建工单`,
    sourcePrdText: "PRD 14.1 + 13.6",
  },
  {
    id: 5,
    pageName: "APP首页",
    pagePath: "/app/home",
    moduleName: "首页功能入口",
    targetSelector: "[data-annotation-target='app-home-entries']",
    markdown: `## 显示样式
- 展示AI客服、订单、服务等功能入口
- 底部导航栏（首页/AI客服/订单/服务/我的）带角标

## 业务规则
- 导航角标数字反映未读消息/待处理数量
- AI客服入口应展示在线状态指示`,
    sourcePrdText: "PRD 13.1 会话入口",
  },
  {
    id: 6,
    pageName: "APP订单页",
    pagePath: "/app/orders",
    moduleName: "订单列表与详情",
    targetSelector: "[data-annotation-target='app-orders-list']",
    markdown: `## 显示样式
- 订单列表展示订单号、状态、金额、商品缩略
- 订单详情展示物流、售后入口

## 交互逻辑
- 点击订单查看详情
- 从订单页进入客服时自动携带订单ID

## 业务规则
- 只能查询当前用户自己的订单
- 订单状态判断可执行动作（运输中/已签收/已完成）
- AI只做规则说明和流程引导，不直接审批退款`,
    sourcePrdText: "PRD 5.3 C端消费者订单与售后咨询",
  },
  {
    id: 7,
    pageName: "APP门店页",
    pagePath: "/app/stores",
    moduleName: "门店查询",
    targetSelector: "[data-annotation-target='app-stores-list']",
    markdown: `## 显示样式
- 门店列表/地图展示门店名称、地址、营业时间、距离
- 支持按定位/城市搜索

## 业务规则
- 门店数据按商家隔离
- 门店库存查询调用门店库存接口
- V1.0只引导预约入口，V1.1可支持预约创建`,
    sourcePrdText: "PRD 5.4 门店咨询",
  },
  {
    id: 8,
    pageName: "APP课程页",
    pagePath: "/app/courses",
    moduleName: "课程列表与权益",
    targetSelector: "[data-annotation-target='app-courses-list']",
    markdown: `## 显示样式
- 课程列表展示课程名、讲师、有效期、权益
- 已购课程展示学习入口

## 业务规则
- 课程权益查询必须调用课程接口
- 涉及退款按课程售后规则说明，不承诺结果
- 健康/理财/法律类课程需追加免责声明`,
    sourcePrdText: "PRD 5.5 知识付费咨询",
  },
  {
    id: 9,
    pageName: "APP大健康页",
    pagePath: "/app/health",
    moduleName: "健康咨询",
    targetSelector: "[data-annotation-target='app-health-chat']",
    markdown: `## 显示样式
- AI可提供健康科普、生活方式建议、产品适用场景说明
- 不得输出疾病诊断、治疗结论、用药建议

## 业务规则
- 大健康知识必须来自已审核知识库
- 舌象/图片类问题仅做客观观察描述，不下诊断
- 用户描述严重/持续不适时优先建议就医
- 高风险问题转健康顾问/人工
- 所有大健康回复必须追加免责声明`,
    sourcePrdText: "PRD 5.6 大健康咨询 + 13.8 风控与合规",
  },
  {
    id: 10,
    pageName: "APP售后页",
    pagePath: "/app/after-sales",
    moduleName: "售后申请",
    targetSelector: "[data-annotation-target='app-aftersales-form']",
    markdown: `## 显示样式
- 售后申请表单：订单选择、售后类型、原因说明、图片上传
- 售后进度展示

## 业务规则
- AI只做规则说明和流程引导，不直接审批退款
- 退款失败/赔偿/投诉/物流丢件 → 创建工单并转人工
- V1.0不允许AI执行退款审批、改价等写操作`,
    sourcePrdText: "PRD 5.3 订单与售后咨询 + 13.7 工单中心",
  },
  {
    id: 11,
    pageName: "H5 SDK预览",
    pagePath: "/app/web-sdk-preview",
    moduleName: "H5客服SDK",
    targetSelector: "[data-annotation-target='app-sdk-preview']",
    markdown: `## 显示样式
- 模拟商品详情页+右下角浮动客服按钮
- 模拟订单详情页+客服入口
- 点击打开半屏AI客服弹窗
- 客服自动识别当前页面上下文

## 业务规则
- 商品页进入时展示当前商品卡片
- 订单页进入时展示订单摘要卡片
- 客服窗口需支持多渠道嵌入（H5/小程序/APP）
- 上下文识别：当前页面/商品ID/订单ID/商家ID`,
    sourcePrdText: "PRD 13.1 会话入口 + 14.1 C端客服窗口",
  },

  // ===== TENANT 端 (B-end) =====
  {
    id: 12,
    pageName: "商家数据看板",
    pagePath: "/tenant/dashboard",
    moduleName: "数据指标卡",
    targetSelector: "[data-annotation-target='tenant-dashboard-metrics']",
    markdown: `## 显示样式
- 指标卡行展示：咨询量、AI解决率、转人工率、满意度
- 每个指标卡含数值+趋势sparkline
- 图表区展示趋势图、分布图

## 显示字段
- 本店咨询量
- 商品咨询TOP排行
- 订单/售后咨询量
- AI自动解决率（按业务线统计）
- 转人工率
- 用户满意度均分（≥4.0/5）
- 知识缺口数量
- FAQ命中率
- RAG回答完成时间
- FAQ命中响应时间
- 工具调用成功率
- Token消耗量
- 幻觉率（≤3%）

## 业务规则
- 商家只能查看本商家数据
- 客服看板仅展示个人接待数据`,
    sourcePrdText: "PRD 13.9.2 商家看板",
  },
  {
    id: 13,
    pageName: "租户数据分析",
    pagePath: "/tenant/analytics",
    moduleName: "趋势分析",
    targetSelector: "[data-annotation-target='tenant-analytics-charts']",
    markdown: `## 显示样式
- 咨询量趋势图（日/周/月）
- 业务线分布饼图
- AI解决率趋势
- 转人工率趋势
- 满意度趋势
- 转人工成功率
- 知识缺口沉淀率（≥90%）

## 业务规则
- 图表下方保留业务解释文案
- 支持时间范围切换
- 数据按业务线/渠道维度下钻`,
    sourcePrdText: "PRD 13.9 数据看板",
  },
  {
    id: 14,
    pageName: "知识库管理",
    pagePath: "/tenant/knowledge-base",
    moduleName: "知识库列表与筛选",
    targetSelector: "[data-annotation-target='tenant-kb-list']",
    markdown: `## 显示样式
- FAQ列表 + 文档列表 Tab切换
- 筛选区：归属层级、业务线、知识类型、审核状态、生效状态、关键词
- 列表字段：标题、类型、归属、业务线、风险等级、命中次数、审核状态、更新时间
- 行操作：查看、编辑、审核、下线、删除

## 交互逻辑
- 新建FAQ弹窗：问题+相似问法+标准答案+归属+业务线+优先级+生效/失效时间
- 上传文档弹窗：文件上传+归属+业务线+标签
- 知识缺口池Tab：展示未解决问题聚类

## 业务规则
- FAQ优先级高于RAG文档
- 已发布知识才允许被AI引用
- 高风险知识必须经过平台审核后发布
- 文档新版本发布后旧版本自动降权或下线
- 活动类知识到期后自动失效
- 大健康知识必须标记风险等级
- 人工回复不能自动入库，必须经过运营审核`,
    sourcePrdText: "PRD 13.3 知识库管理",
  },
  {
    id: 15,
    pageName: "知识库管理",
    pagePath: "/tenant/knowledge-base",
    moduleName: "知识缺口池",
    targetSelector: "[data-annotation-target='tenant-kb-gap-pool']",
    markdown: `## 显示样式
- 知识缺口池列表：按意图/业务线/商品/门店聚类
- 顶部流程状态条：RAG异常 → 缺口池 → 候选生成 → 审核 → 发布 → 追踪
- AI候选FAQ/知识片段预览
- 审核按钮

## 业务规则
- AI未解决/用户差评/人工纠正/高频重复问题 → 进入知识缺口池
- AI可生成候选知识，但不能自动发布
- 知识反哺必须保留来源（原会话、人工回复、审核人）
- 反哺知识上线后追踪命中率与解决率
- 反哺后效果变差的知识应降权/回滚/下线
- 知识缺口沉淀率目标 ≥90%`,
    sourcePrdText: "PRD 7.13 知识反哺 + 13.3 知识库管理",
  },
  {
    id: 16,
    pageName: "机器人配置",
    pagePath: "/tenant/robot-config",
    moduleName: "机器人设置表单",
    targetSelector: "[data-annotation-target='tenant-robot-form']",
    markdown: `## 字段设计
- 机器人名称（文本，必填）
- 归属层级（平台/租户/商家/门店，必填）
- 适用业务线（商城/直播/门店/课程/大健康，多选）
- 适用渠道（H5/小程序/APP/后台/企微，多选）
- 欢迎语（文本，必填）
- 快捷问题（多条，可选）
- 绑定知识库（多选，必填）
- 可调用工具（商品/订单/物流/售后，多选）
- 回答风格（专业/简洁/亲切，必填）
- 最大追问轮次（默认2轮）
- 低置信阈值（默认0.65）
- 转人工规则（主动转/低置信/投诉等）
- 风控策略（通用/大健康/售后/自定义）
- 状态（启用/停用）

## 业务规则
- 平台机器人服务B端商家问题
- 商家机器人服务该商家C端消费者问题
- 大健康机器人必须默认开启健康合规策略
- 同一入口只能绑定一个默认机器人
- 机器人停用后前端入口自动切换为人工`,
    sourcePrdText: "PRD 13.2 AI机器人配置",
  },
  {
    id: 17,
    pageName: "人工客服工作台",
    pagePath: "/tenant/customer-service-workbench",
    moduleName: "会话队列与聊天窗口",
    targetSelector: "[data-annotation-target='tenant-workbench-main']",
    markdown: `## 页面结构
- 左侧会话队列：待接入/接待中/排队中/已转接/已结束/超时会话
- 中间聊天窗口：用户消息+AI历史回复+人工回复+卡片+输入框+快捷回复+结束/转接/建工单
- 右侧上下文：用户资料+会员信息+当前商品/订单/课程/门店+历史会话+工单记录+AI推荐回复

## 会话分配规则
- 技能组分配（售前/售后/门店/课程/大健康/平台支持）
- 只分配给在线客服
- 负载均衡（优先分配给当前接待量少的）
- VIP优先排队
- 投诉/退款纠纷优先处理
- 门店问题优先分配对应门店
- 超时未接入通知主管

## 业务规则
- 人工接入后AI停止主动回复
- 客服可开启AI辅助回复但必须人工确认后发送
- 转人工时系统自动生成会话摘要
- 会话结束时客服需选择结束原因
- 投诉/退款纠纷/健康高风险必须创建工单`,
    sourcePrdText: "PRD 13.6 人工客服工作台",
  },
  {
    id: 18,
    pageName: "工单中心",
    pagePath: "/tenant/ticket-center",
    moduleName: "工单列表与状态",
    targetSelector: "[data-annotation-target='tenant-ticket-list']",
    markdown: `## 工单类型
- 平台支持工单：商家使用SaaS后台遇到问题
- 售后工单：退款/退货/换货/售后进度
- 物流工单：未发货/物流停滞/丢件
- 门店工单：预约/核销/门店投诉
- 课程工单：无法观看/权益异常/退款争议
- 大健康工单：高风险健康咨询/顾问跟进
- 投诉工单：用户不满/赔偿/争议升级
- 技术工单：系统异常/接口失败/支付异常

## 状态流转
待处理 → 处理中 → 待用户确认 → 已解决 → 已关闭
异常：已关闭→已重开→处理中 | 超时→升级提醒

## 业务规则
- 工单必须有责任方（平台/商家/门店/售后/仓储/财务/技术）
- Waiting_User和Waiting_External不计入处理人主动响应超时
- Resolved必须经过用户确认或超时自动关闭
- 高风险投诉/退款纠纷/大健康风险不允许自动关闭`,
    sourcePrdText: "PRD 13.7 工单中心",
  },
  {
    id: 19,
    pageName: "风控策略配置",
    pagePath: "/tenant/risk-control",
    moduleName: "风控规则列表",
    targetSelector: "[data-annotation-target='tenant-risk-rules']",
    markdown: `## 风控范围
| 风控类型 | 示例 | 处理方式 |
| 医疗诊断 | 你这是XX病 | 阻断+安全提示 |
| 治疗承诺 | 一定能治好 | 阻断 |
| 用药建议 | 你应该吃XX药 | 转人工/提示咨询医生 |
| 绝对化宣传 | 百分百有效 | 替换/阻断 |
| 退款赔偿承诺 | 赔多少钱 | 转人工 |
| 虚假库存价格 | 乱报库存 | 必须查接口 |
| 隐私泄露 | 完整手机号/身份证 | 脱敏 |
| 政策争议 | 法律/监管 | 转人工 |

## 业务规则
- 风控至少执行两次（输入初筛+输出审核）
- 大健康/投诉/售后赔偿场景强制执行风控
- 大健康回复必须追加免责声明`,
    sourcePrdText: "PRD 13.8 风控与合规",
  },
  {
    id: 20,
    pageName: "RAG链路追踪",
    pagePath: "/tenant/rag-trace",
    moduleName: "RAG Trace记录",
    targetSelector: "[data-annotation-target='tenant-rag-trace-table']",
    markdown: `## 显示字段
- trace_id、会话ID、用户问题、改写后query
- 召回片段数、重排片段数、Top片段相似度
- 是否命中FAQ、是否进入重排
- 模型名称、Prompt版本、Token消耗
- 是否转人工、用户反馈

## 业务规则
- RAG检索必须先做权限过滤再做召回和重排
- 召回TopK默认20，重排后取Top3-5
- 最小相似度阈值0.65（低于不进入生成）
- 无召回或弱相关 → 记录知识缺口并转人工
- TopK片段无法支撑答案时应转人工
- C端前台引用展示可选，后台必须完整可追溯`,
    sourcePrdText: "PRD 8.6 RAG知识检索与生成",
  },
  {
    id: 21,
    pageName: "租户设置",
    pagePath: "/tenant/settings",
    moduleName: "租户基础设置",
    targetSelector: "[data-annotation-target='tenant-settings-form']",
    markdown: `## 设置项
- 租户名称、行业类型
- AI调用额度配置
- 套餐版本信息
- 到期时间
- 默认风控策略
- 数据留存策略

## 业务规则
- 不同租户之间数据完全隔离
- 同一租户下不同商家数据默认隔离
- 平台管理员跨租户访问必须记录审计日志`,
    sourcePrdText: "PRD 3.2 SaaS多层数据边界",
  },
  {
    id: 22,
    pageName: "会话管理",
    pagePath: "/tenant/conversation-management",
    moduleName: "会话列表",
    targetSelector: "[data-annotation-target='tenant-conversation-list']",
    markdown: `## 显示样式
- 会话列表：会话ID、用户、状态、发起时间、意图
- 筛选：状态、时间范围、业务线、关键词
- 会话详情：完整消息流、AI链路日志、工具调用记录

## 会话状态
Created → AI_Receiving → Waiting_User → Human_Queue → Human_Receiving → Resolved → Rated → Closed
异常路径：Reopened → AI_Receiving | Archived

## 业务规则
- 会话默认有效期2小时
- 转人工时必须带入会话摘要
- 高风险会话必须全量质检`,
    sourcePrdText: "PRD 7.8 会话状态机",
  },
  {
    id: 23,
    pageName: "质检中心",
    pagePath: "/tenant/quality-inspection",
    moduleName: "质检列表",
    targetSelector: "[data-annotation-target='tenant-quality-list']",
    markdown: `## 显示样式
- 质检抽样列表：会话ID、质检结果、评分、质检人
- 质检详情：消息流+AI判断+人工评定

## 业务规则
- 所有转人工会话应进入质检抽样池
- 高风险会话必须全量质检
- 质检结果影响AI回答质量统计和知识反哺`,
    sourcePrdText: "PRD 13.6 人工客服工作台",
  },

  // ===== PLATFORM 端 =====
  {
    id: 24,
    pageName: "平台数据看板",
    pagePath: "/platform/dashboard",
    moduleName: "全平台指标",
    targetSelector: "[data-annotation-target='platform-dashboard-metrics']",
    markdown: `## 显示指标
- 总咨询量（全平台）
- 租户咨询排行
- AI自动解决率（按平台/商家/业务线统计）
- 转人工率
- 平均响应时间（首响+完整回答）
- 知识命中率（FAQ/RAG）
- 风控拦截数
- 模型调用成本（Token/调用次数/成本）
- 租户额度消耗
- 幻觉率（≤3%）
- 知识缺口沉淀率（≥90%）

## 业务规则
- 平台管理员可查看全平台数据
- 跨租户访问必须记录审计日志
- 图表高度统一≥280px`,
    sourcePrdText: "PRD 13.9.1 平台看板",
  },
  {
    id: 25,
    pageName: "租户管理",
    pagePath: "/platform/tenant-management",
    moduleName: "租户列表",
    targetSelector: "[data-annotation-target='platform-tenant-list']",
    markdown: `## 显示样式
- 筛选区：租户名称、状态、套餐版本、创建时间
- 列表：租户名、行业类型、套餐、AI额度、状态、到期时间
- 行操作：查看/编辑/启停/套餐配置

## 业务规则
- 不同租户之间数据完全隔离
- 平台管理员可管理全平台租户
- 租户到期后AI服务自动降级`,
    sourcePrdText: "PRD 4.2 权限矩阵",
  },
  {
    id: 26,
    pageName: "平台知识库",
    pagePath: "/platform/knowledge-base",
    moduleName: "平台级知识管理",
    targetSelector: "[data-annotation-target='platform-kb-list']",
    markdown: `## 显示样式
- 平台级FAQ和文档管理
- 模板管理：可创建行业知识模板下发到租户
- 审核队列：待审核的高风险知识

## 业务规则
- 平台运营可管理行业模板
- 高风险知识必须平台审核后发布
- 平台可查看所有租户知识库（只读）`,
    sourcePrdText: "PRD 13.3 知识库管理 + 4.2 权限矩阵",
  },
  {
    id: 27,
    pageName: "模型配置",
    pagePath: "/platform/model-config",
    moduleName: "模型与路由配置",
    targetSelector: "[data-annotation-target='platform-model-config']",
    markdown: `## 配置项
- Provider配置：模型名称、API Key、base URL、temperature、top_p、每千Token成本
- 路由策略表：模型、适用业务线、优先级、失败率、调用次数、成本
- 降级策略：最大重试次数、超时阈值、降级模型
- 模型状态：启用/停用

## 业务规则
- 路由策略按业务线/风险等级匹配模型
- 模型调用失败时按降级策略切换
- 所有模型调用记录写入日志`,
    sourcePrdText: "PRD 9 基座模型选型",
  },
  {
    id: 28,
    pageName: "平台客服工作台",
    pagePath: "/platform/service-workbench",
    moduleName: "平台人工客服",
    targetSelector: "[data-annotation-target='platform-workbench-main']",
    markdown: `## 页面结构
- 左侧会话队列（商家咨询+消费者兜底）
- 中间聊天窗口+AI辅助
- 右侧上下文信息

## 业务规则
- 平台客服处理B端商家问题和C端消费者兜底
- 平台客服可跨租户查看（需审计日志）
- 投诉/退款纠纷/高风险 → 创建工单`,
    sourcePrdText: "PRD 13.6 人工客服工作台",
  },
  {
    id: 29,
    pageName: "套餐与计费",
    pagePath: "/platform/package-billing",
    moduleName: "套餐管理",
    targetSelector: "[data-annotation-target='platform-package-list']",
    markdown: `## 显示样式
- 套餐列表：名称、AI调用额度、知识库容量、坐席数、渠道数、价格
- 租户套餐分配

## 业务规则
- AI调用量/Token消耗/知识库容量/坐席/渠道接入归集到租户账单
- 套餐到期后AI服务降级`,
    sourcePrdText: "PRD 20 SaaS商业化设计",
  },
  {
    id: 30,
    pageName: "全局风控",
    pagePath: "/platform/risk-control",
    moduleName: "全局风控策略",
    targetSelector: "[data-annotation-target='platform-risk-config']",
    markdown: `## 配置项
- 敏感词库管理
- 大健康禁答规则
- 退款赔付禁答规则
- 隐私脱敏规则
- 风控策略可下发到租户

## 业务规则
- 全局风控策略对所有租户生效
- 租户可在授权范围内调整部分策略`,
    sourcePrdText: "PRD 13.8 风控与合规",
  },
  {
    id: 31,
    pageName: "Prompt管理",
    pagePath: "/platform/prompt-management",
    moduleName: "Prompt模板",
    targetSelector: "[data-annotation-target='platform-prompt-list']",
    markdown: `## 显示样式
- Prompt类型：system/rag/tool/safety/output
- 适用业务线
- 版本管理（草稿/灰度/已发布/已下线）
- 灰度范围配置

## 业务规则
- Prompt变更需审核
- 支持灰度发布
- 每个版本保留完整历史`,
    sourcePrdText: "PRD 10 Prompt工程规范 + 15.2.2",
  },
  {
    id: 32,
    pageName: "评测中心",
    pagePath: "/platform/evaluation-center",
    moduleName: "AI评测",
    targetSelector: "[data-annotation-target='platform-eval-list']",
    markdown: `## 显示样式
- 评测样本列表：类型（FAQ/RAG/Tool/Health/Safety/Multi-turn）
- 评测执行：用户问题→AI回答→标准答案对比
- 评测指标：准确率、幻觉率、响应时间

## 业务规则
- 每次模型/Prompt变更后需回归评测
- 评测结果作为模型切换依据`,
    sourcePrdText: "PRD 15.2.5 AI评测样本表",
  },
  {
    id: 33,
    pageName: "运维监控",
    pagePath: "/platform/ops-monitor",
    moduleName: "系统监控",
    targetSelector: "[data-annotation-target='platform-ops-monitor']",
    markdown: `## 监控项
- 模型调用成功率
- 接口响应延迟
- 错误率/超时率
- 租户调用量排行
- 成本监控

## 业务规则
- 任一服务调用失败时不得直接报错给用户
- 根据失败类型进入重试/降级/转人工`,
    sourcePrdText: "PRD 16 接口需求 + 26 运维监控",
  },
  {
    id: 34,
    pageName: "限流规则",
    pagePath: "/platform/rate-limit-rules",
    moduleName: "API限流",
    targetSelector: "[data-annotation-target='platform-rate-limit']",
    markdown: `## 配置项
- 按租户/商家/IP维度的调用频率限制
- 按模型/接口的并发限制
- 超限处理策略（排队/拒绝/降级）

## 业务规则
- 租户AI额度耗尽后应提示升级套餐
- 恶意调用应触发风控拦截`,
    sourcePrdText: "PRD 19 非功能需求",
  },
  {
    id: 35,
    pageName: "全局参数",
    pagePath: "/platform/global-params",
    moduleName: "系统参数",
    targetSelector: "[data-annotation-target='platform-global-params']",
    markdown: `## 配置项
- 默认会话有效期（2小时）
- 默认最大追问轮次（2轮）
- 默认置信度阈值（0.65/0.85）
- RAG默认参数（recall_top_k=20, rerank_top_k=5）
- 评价超时自动关闭时间

## 业务规则
- 全局参数可被租户/商家级配置覆盖
- 参数变更需记录审计日志`,
    sourcePrdText: "PRD 8.6 RAG检索策略 + 7.8 会话状态机",
  },
  {
    id: 36,
    pageName: "商家管理",
    pagePath: "/platform/merchant-management",
    moduleName: "商家列表",
    targetSelector: "[data-annotation-target='platform-merchant-list']",
    markdown: `## 显示样式
- 商家列表：商家名称、所属租户、开通业务线、状态
- 行操作：查看/编辑/启停

## 业务规则
- 同一租户下不同商家数据默认隔离
- 商家可配置多个机器人
- 商家只能访问本商家会话/工单/知识库/商品/订单/用户数据`,
    sourcePrdText: "PRD 3.2 SaaS多层数据边界",
  },
  {
    id: 37,
    pageName: "渠道配置",
    pagePath: "/tenant/channel-config",
    moduleName: "渠道接入",
    targetSelector: "[data-annotation-target='tenant-channel-config']",
    markdown: `## 配置项
- 渠道类型：H5/小程序/APP/企微/微信客服
- 每个渠道可绑定不同机器人
- 渠道级欢迎语/快捷问题配置

## 业务规则
- 不同渠道可有不同话术和可见知识
- 直播间可引用活动话术，订单页优先售后政策`,
    sourcePrdText: "PRD 3.2 渠道隔离 + 13.2 机器人配置",
  },
  {
    id: 38,
    pageName: "角色权限",
    pagePath: "/tenant/role-permission",
    moduleName: "角色权限配置",
    targetSelector: "[data-annotation-target='tenant-role-perm']",
    markdown: `## 配置项
- 角色：平台管理员/平台运营/平台客服/商家管理员/商家客服/门店店长/C端用户
- 权限：租户管理/知识库/AI配置/会话接待/工单处理/数据看板/风控/审计

## 业务规则
- 商家只能访问本商家数据
- 门店人员只能访问本门店数据
- 所有跨租户访问必须记录审计日志`,
    sourcePrdText: "PRD 4.2 权限矩阵",
  },
  {
    id: 39,
    pageName: "审计日志",
    pagePath: "/tenant/audit-log",
    moduleName: "操作审计",
    targetSelector: "[data-annotation-target='tenant-audit-log']",
    markdown: `## 记录内容
- 操作人、操作时间、操作类型、操作对象
- 跨租户访问记录
- 敏感操作记录（删除/下线/停用）

## 业务规则
- 平台管理员跨租户访问必须记录
- 敏感操作不可删除日志`,
    sourcePrdText: "PRD 3.2 数据隔离规则",
  },
  {
    id: 40,
    pageName: "直播话术",
    pagePath: "/tenant/live-script",
    moduleName: "直播话术库",
    targetSelector: "[data-annotation-target='tenant-live-script']",
    markdown: `## 显示样式
- 话术列表：场景、话术内容、适用商品、活动规则
- 支持按直播活动关联

## 业务规则
- 直播话术作为知识库的一部分
- 活动类知识到期后自动失效`,
    sourcePrdText: "PRD 8.6.4 知识来源与优先级",
  },
  {
    id: 41,
    pageName: "课程素材",
    pagePath: "/tenant/course-materials",
    moduleName: "课程知识库",
    targetSelector: "[data-annotation-target='tenant-course-materials']",
    markdown: `## 显示样式
- 课程知识列表：课程名、大纲、讲师、权益、有效期
- 支持关联课程接口

## 业务规则
- 课程知识需标记归属商家
- 课程权限需调用工具查询`,
    sourcePrdText: "PRD 8.6.4 知识来源",
  },
  {
    id: 42,
    pageName: "RAG向量监控",
    pagePath: "/platform/rag-vector-monitor",
    moduleName: "向量库监控",
    targetSelector: "[data-annotation-target='platform-rag-monitor']",
    markdown: `## 监控项
- 向量库状态
- 索引数量
- 召回延迟
- 索引更新时间

## 业务规则
- Published但尚未Online的知识不能用于线上回答
- 索引失败时需告警`,
    sourcePrdText: "PRD 7.10 知识文档状态机",
  },
  {
    id: 43,
    pageName: "全局设置",
    pagePath: "/platform/settings",
    moduleName: "平台设置",
    targetSelector: "[data-annotation-target='platform-settings']",
    markdown: `## 配置项
- 平台基础信息
- 默认策略配置
- 系统通知模板

## 业务规则
- 全局设置影响所有租户`,
    sourcePrdText: "PRD 6 总体产品架构",
  },
];
