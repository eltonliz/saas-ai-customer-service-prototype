import type { PageProps } from "../../types";
import { useAppStore } from "../../data/AppStore";
import { MetricCard } from "../../components/MetricCard";
import { StatusBadge } from "../../components/StatusBadge";
import { conversations, tickets, customerServiceAgents, knowledgeGaps, tenants, merchants } from "../../data/mockData";
import {
  AlertTriangle, TrendingUp, Users, Clock, Activity, Zap, Star, BookOpen,
  MessageCircle, Bot, Headphones, TicketIcon, Package,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, ComposedChart, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ---------------------------------------------------------------------------
// Chart data types
// ---------------------------------------------------------------------------

interface TrendDataPoint {
  day: string;
  total: number;
  aiSolved: number;
  transferred: number;
}

interface IssueTypeDataPoint {
  name: string;
  value: number;
}

interface TicketStatusDataPoint {
  status: string;
  count: number;
}

interface ProductDataPoint {
  name: string;
  consults: number;
  orders: number;
  rate: string;
}

interface HotTopic {
  topic: string;
  count: number;
}

// ---------------------------------------------------------------------------
// Mock chart data
// ---------------------------------------------------------------------------

const trendData: TrendDataPoint[] = [
  { day: "5/11", total: 120, aiSolved: 62, transferred: 28 },
  { day: "5/12", total: 145, aiSolved: 78, transferred: 32 },
  { day: "5/13", total: 132, aiSolved: 70, transferred: 30 },
  { day: "5/14", total: 168, aiSolved: 95, transferred: 35 },
  { day: "5/15", total: 155, aiSolved: 88, transferred: 33 },
  { day: "5/16", total: 190, aiSolved: 112, transferred: 38 },
  { day: "5/17", total: 175, aiSolved: 105, transferred: 34 },
];

const issueTypeData: IssueTypeDataPoint[] = [
  { name: "订单物流", value: 28 },
  { name: "商品咨询", value: 24 },
  { name: "售后退款", value: 18 },
  { name: "门店咨询", value: 14 },
  { name: "课程咨询", value: 10 },
  { name: "大健康咨询", value: 6 },
];

const ticketStatusData: TicketStatusDataPoint[] = [
  { status: "待处理", count: 12 },
  { status: "处理中", count: 8 },
  { status: "等待用户", count: 5 },
  { status: "待确认", count: 4 },
  { status: "已关闭", count: 22 },
];

const productData: ProductDataPoint[] = [
  { name: "直播营养套装", consults: 120, orders: 38, rate: "31.6%" },
  { name: "养生茶礼盒", consults: 96, orders: 24, rate: "25.0%" },
  { name: "家清三件套", consults: 85, orders: 28, rate: "33.0%" },
  { name: "课程体验包", consults: 72, orders: 18, rate: "25.0%" },
  { name: "健康会员包", consults: 68, orders: 22, rate: "32.4%" },
];

const hotTopicsList: HotTopic[] = [
  { topic: "物流查询进度", count: 92 },
  { topic: "退款到账时间", count: 85 },
  { topic: "核销码使用流程", count: 78 },
  { topic: "课程观看有效期", count: 71 },
  { topic: "商品库存查询", count: 64 },
  { topic: "优惠券使用规则", count: 58 },
  { topic: "订单取消流程", count: 52 },
  { topic: "门店营业时间", count: 47 },
  { topic: "换货申请条件", count: 41 },
  { topic: "会员积分规则", count: 36 },
];

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

const COLORS = {
  blue: "#2563EB",
  green: "#10B981",
  orange: "#F59E0B",
  red: "#EF4444",
  purple: "#8B5CF6",
  slate: "#64748B",
};

const PIE_COLORS = ["#2563EB", "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];

// ---------------------------------------------------------------------------
// Custom tooltip for the trend line chart
// ---------------------------------------------------------------------------

function TrendTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-base font-semibold text-slate-500 mb-1">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-base" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function TenantDashboard({ context }: PageProps) {
  // ---- Data filtering (keep existing logic) ----
  const filteredConvs = conversations.filter(
    (c) => c.tenantId === context.currentTenantId && c.merchantId === context.currentMerchantId,
  );
  const filteredTickets = tickets.filter(
    (t) => t.tenantId === context.currentTenantId && t.merchantId === context.currentMerchantId,
  );
  const filteredGaps = knowledgeGaps.filter(
    (g) => g.tenantId === context.currentTenantId && g.merchantId === context.currentMerchantId,
  );
  const agents = customerServiceAgents.filter(
    (a) => a.tenantId === context.currentTenantId,
  );

  // ---- Computed metrics ----
  const aiSolved = filteredConvs.filter(
    (c) => c.status === "已解决" && !c.transferredToHuman,
  ).length;
  const totalConvs = filteredConvs.length || 1;
  const aiResolutionRate = Math.round((aiSolved / totalConvs) * 100);
  const transferRate = Math.round(
    (filteredConvs.filter((c) => c.transferredToHuman).length / totalConvs) * 100,
  );
  const pendingConvs = filteredConvs.filter(
    (c) => c.status === "等待人工接入" || c.status === "已创建",
  ).length;
  const pendingTickets = filteredTickets.filter((t) => t.status !== "已关闭").length;
  const highRiskConvs = filteredConvs.filter((c) => c.riskLevel === "高风险");
  const highRisk = highRiskConvs.length;

  // Average satisfaction from conversations that have a score
  const satisfactionScores = filteredConvs
    .filter((c) => c.satisfaction != null)
    .map((c) => c.satisfaction as number);
  const avgSatisfaction =
    satisfactionScores.length > 0
      ? (satisfactionScores.reduce((a, b) => a + b, 0) / satisfactionScores.length).toFixed(1)
      : "4.2";

  // Active agent count
  const activeAgents = agents.filter((a) => a.status === "在线" || a.status === "忙碌").length;

  // Knowledge gaps needing attention
  const pendingGaps = filteredGaps.filter(
    (g) => g.status === "待处理" || g.status === "待生成候选" || g.status === "待审核",
  ).length;

  // Tenant / merchant names for context bar
  const tenant = tenants.find((t) => t.id === context.currentTenantId);
  const merchant = merchants.find((m) => m.id === context.currentMerchantId);

  // Token usage
  const tokenUsed = tenant ? tenant.tokenUsed : 0;
  const tokenLimit = tenant ? tenant.tokenLimit : 1;

  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6" data-annotation-target="tenant-dashboard-metrics">
      {/* ================================================================ */}
      {/* Service context bar                                               */}
      {/* ================================================================ */}
      <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl border border-slate-200 bg-white px-5 py-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-slate-400">当前租户</span>
            <span className="text-base font-semibold text-slate-800">
              {tenant?.name ?? context.currentTenantId}
            </span>
            {tenant && (
              <StatusBadge status={tenant.status} />
            )}
          </div>
          <span className="text-slate-200">|</span>
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-slate-400">当前商家</span>
            <span className="text-base font-semibold text-slate-800">
              {merchant?.name ?? context.currentMerchantId}
            </span>
            {merchant && (
              <StatusBadge status={merchant.status} />
            )}
          </div>
          <span className="text-slate-200">|</span>
          <div className="flex items-center gap-2">
            <span className="text-base font-medium text-slate-400">业务线</span>
            <span className="text-base font-medium text-slate-700">
              {context.currentBusinessLine}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-base text-slate-400">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>在线客服 {activeAgents}/{agents.length}</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity size={14} />
            <span>Token {((tokenUsed / tokenLimit) * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* ================================================================ */}
      {/* Metric cards row (5 cards)                                       */}
      {/* ================================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MetricCard
          label="今日咨询量"
          value={filteredConvs.length}
          trend="较昨日 +12%"
          trendUp
          color="blue"
        />
        <MetricCard
          label="AI自动解决率"
          value={`${aiResolutionRate}%`}
          trend="较上周 +5%"
          trendUp
          color="green"
        />
        <MetricCard
          label="转人工率"
          value={`${transferRate}%`}
          trend="较昨日 -2%"
          trendUp={false}
          color="orange"
        />
        <MetricCard
          label="待处理工单"
          value={pendingTickets}
          color={pendingTickets > 5 ? "red" : "slate"}
        />
        <MetricCard
          label="用户满意度"
          value={avgSatisfaction}
          trend="较上周 +0.2"
          trendUp
          color="blue"
        />
      </div>

      {/* ================================================================ */}
      {/* Metric cards row 2 (6 cards)                                     */}
      {/* ================================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard label="FAQ响应时间" value="0.8s" trend="较上周 -0.1s" trendUp color="green" />
        <MetricCard label="RAG完整回答时间" value="2.4s" trend="较上周 -0.3s" trendUp color="blue" />
        <MetricCard label="工具调用成功率" value="96.2%" trend="较上周 +1.5%" trendUp color="green" />
        <MetricCard label="风控拦截率" value="3.8%" trend="较上周 -0.5%" trendUp={false} color="orange" />
        <MetricCard label="Token消耗" value={tokenUsed >= 10000 ? `${(tokenUsed/10000).toFixed(1)}万` : tokenUsed.toLocaleString()} color="slate" />
        <MetricCard label="幻觉率" value="2.1%" trend="较上周 -0.8%" trendUp={false} color="red" />
      </div>

      {/* ================================================================ */}
      {/* Charts grid (2x2)                                                */}
      {/* ================================================================ */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ---------------------------------------------------------------- */}
        {/* Top-left: Consultation trend line chart                          */}
        {/* ---------------------------------------------------------------- */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-blue-500" />
            咨询趋势（近7天）
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip content={<TrendTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                iconType="rect"
              />
              <Line
                type="monotone"
                dataKey="total"
                name="总咨询量"
                stroke={COLORS.blue}
                strokeWidth={2}
                dot={{ r: 3, fill: COLORS.blue }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="aiSolved"
                name="AI解决"
                stroke={COLORS.green}
                strokeWidth={2}
                dot={{ r: 3, fill: COLORS.green }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="transferred"
                name="转人工"
                stroke={COLORS.orange}
                strokeWidth={2}
                dot={{ r: 3, fill: COLORS.orange }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-3 text-base text-slate-500 leading-relaxed">会话趋势反映每日用户咨询量变化。AI解决率=AI独立解决数/总会话数，目标{'>'}60%。转人工率上升可能表明知识库覆盖不足或机器人意图识别准确率下降，建议检查近期未召回Query和差评会话。</p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Top-right: Issue type pie chart                                  */}
        {/* ---------------------------------------------------------------- */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <MessageCircle size={16} className="text-indigo-500" />
            咨询问题类型分布
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={issueTypeData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
              >
                {issueTypeData.map((_entry, idx) => (
                  <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} 次`, name]}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #E2E8F0",
                  fontSize: 12,
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
          <p className="mt-3 text-base text-slate-500 leading-relaxed">问题类型分布反映用户核心诉求结构。某类型占比突增可能反映产品变更、促销活动或外部舆情事件，建议结合时间趋势分析原因并及时补充对应知识库。</p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Bottom-left: Ticket status bar chart                             */}
        {/* ---------------------------------------------------------------- */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <TicketIcon size={16} className="text-amber-500" />
            工单状态分布
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ticketStatusData} margin={{ top: 4, right: 8, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="status" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: "#F1F5F9" }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #E2E8F0",
                  fontSize: 12,
                }}
              />
              <Bar
                dataKey="count"
                name="工单数"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              >
                {ticketStatusData.map((entry, idx) => {
                  const barColors: Record<string, string> = {
                    "待处理": COLORS.red,
                    "处理中": COLORS.orange,
                    "等待用户": COLORS.purple,
                    "待确认": COLORS.blue,
                    "已关闭": COLORS.slate,
                  };
                  return <Cell key={idx} fill={barColors[entry.status] ?? COLORS.slate} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-3 text-base text-slate-500 leading-relaxed">工单状态反映客服团队处理效率。待处理积压{'>'}10个需关注人力配置；已关闭占比高且SLA达标说明团队运转良好。建议关注'等待用户补充'状态的工单，主动触达用户推进处理。</p>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Bottom-right: Product consultation bar chart                     */}
        {/* ---------------------------------------------------------------- */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Package size={16} className="text-emerald-500" />
            商品咨询与转化
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart
              data={productData.map((p) => ({ ...p, rateNum: parseFloat(p.rate) }))}
              margin={{ top: 4, right: 8, left: 0, bottom: 4 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={{ stroke: "#E2E8F0" }} tickLine={false} interval={0} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} unit="%" />
              <Tooltip
                cursor={{ fill: "#F1F5F9" }}
                contentStyle={{
                  borderRadius: 8,
                  border: "1px solid #E2E8F0",
                  fontSize: 12,
                }}
                formatter={(value, name) => {
                  if (name === "转化率") return [`${value}%`, name];
                  return [value, name];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                iconType="rect"
              />
              <Bar
                yAxisId="left"
                dataKey="consults"
                name="咨询量"
                fill={COLORS.blue}
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                yAxisId="left"
                dataKey="orders"
                name="下单量"
                fill={COLORS.green}
                radius={[6, 6, 0, 0]}
                maxBarSize={32}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="rateNum"
                name="转化率"
                stroke={COLORS.red}
                strokeWidth={2}
                dot={{ r: 4, fill: COLORS.red, stroke: "#fff", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <p className="mt-3 text-base text-slate-500 leading-relaxed">动销商品排行用于观察咨询到下单的转化情况。高咨询低转化商品建议优化商品详情页或直播话术；高咨询高转化商品可作为主推爆品。转化率&lt;15%需重点优化。</p>
        </div>
      </div>

      {/* ================================================================ */}
      {/* Bottom row: Hot topics + Knowledge gaps + Risk alerts             */}
      {/* ================================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ---- Hot topics Top 10 ---- */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Star size={16} className="text-amber-500" />
            热门问题 Top 10
          </h3>
          <div className="space-y-2">
            {hotTopicsList.map((item, i) => (
              <div
                key={item.topic}
                className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-slate-50 transition-colors"
              >
                <span className={`
                  flex h-5 w-5 items-center justify-center rounded text-base font-bold
                  ${i < 3
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-400"
                  }
                `}>
                  {i + 1}
                </span>
                <span className="flex-1 text-base text-slate-700 truncate">{item.topic}</span>
                <span className="text-base font-medium text-slate-400 tabular-nums">{item.count}次</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---- Knowledge gap alerts ---- */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <BookOpen size={16} className="text-violet-500" />
            知识缺口提醒
          </h3>

          {/* Gap summary */}
          <div className="flex items-center gap-5 mb-4">
            <div className="flex-1 rounded-lg bg-violet-50 px-3 py-2">
              <p className="text-base text-violet-500 font-medium">待处理缺口</p>
              <p className="text-2xl font-bold text-violet-700">{pendingGaps}</p>
            </div>
            <div className="flex-1 rounded-lg bg-blue-50 px-3 py-2">
              <p className="text-base text-blue-500 font-medium">Token消耗</p>
              <p className="text-2xl font-bold text-blue-700">
                {tokenUsed >= 10000
                  ? `${(tokenUsed / 10000).toFixed(1)}万`
                  : tokenUsed.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Gap list */}
          {pendingGaps > 0 ? (
            <div className="space-y-2">
              {filteredGaps
                .filter((g) => g.status === "待处理" || g.status === "待生成候选" || g.status === "待审核")
                .slice(0, 4)
                .map((gap) => (
                  <div
                    key={gap.id}
                    className="flex items-start gap-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2"
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      <StatusBadge status={gap.status} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base text-slate-700 truncate">{gap.question}</p>
                      <p className="text-base text-slate-400 mt-0.5">
                        {gap.businessLine ?? ""} {gap.channel ?? ""}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-6 text-base text-slate-400">
              暂无待处理的知识缺口
            </div>
          )}
        </div>

        {/* ---- Risk alerts ---- */}
        <div className="rounded-xl border border-red-100 bg-red-50/60 p-8">
          <h3 className="text-base font-semibold text-red-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} />
            风险提醒
          </h3>

          {/* Risk summary */}
          <div className="flex items-center gap-5 mb-4">
            <div className="flex-1 rounded-lg bg-white/80 px-3 py-2">
              <p className="text-base text-red-400 font-medium">高风险会话</p>
              <p className="text-2xl font-bold text-red-600">{highRisk}</p>
            </div>
            <div className="flex-1 rounded-lg bg-white/80 px-3 py-2">
              <p className="text-base text-slate-400 font-medium">中风险会话</p>
              <p className="text-2xl font-bold text-amber-600">
                {filteredConvs.filter((c) => c.riskLevel === "中风险").length}
              </p>
            </div>
          </div>

          {/* High-risk items */}
          {highRisk > 0 ? (
            <div className="space-y-2">
              {highRiskConvs.slice(0, 4).map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-2 rounded-lg border border-red-100 bg-white px-3 py-2"
                >
                  <StatusBadge status="高风险" />
                  <div className="min-w-0 flex-1">
                    <p className="text-base text-slate-700 truncate">{c.title}</p>
                    <p className="text-base text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock size={12} />
                      {c.createdAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-6 text-base text-slate-400">
              暂无风险会话
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
