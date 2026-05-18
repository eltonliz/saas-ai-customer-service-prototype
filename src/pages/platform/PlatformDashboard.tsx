import type { PageProps } from "../../types";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Building2, Store, MessageCircle, Zap, Database, TrendingUp, AlertTriangle, Activity, Shield, Users, CreditCard, BookOpen, Clock } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

const callTrend = [
  { day: "5/11", calls: 4200 }, { day: "5/12", calls: 4800 }, { day: "5/13", calls: 5100 },
  { day: "5/14", calls: 5600 }, { day: "5/15", calls: 5300 }, { day: "5/16", calls: 6100 }, { day: "5/17", calls: 5800 },
];

const tenantTokens = [
  { name: "星选私域零售", tokens: 628000 }, { name: "同城门店联盟", tokens: 389000 }, { name: "知养健康课堂", tokens: 812000 },
];

const packageDist = [
  { name: "专业版", value: 1 }, { name: "行业版", value: 1 }, { name: "旗舰版", value: 1 },
];

const successRateTrend = [
  { day: "5/11", rate: 98.5 }, { day: "5/12", rate: 98.8 }, { day: "5/13", rate: 97.2 },
  { day: "5/14", rate: 99.1 }, { day: "5/15", rate: 98.6 }, { day: "5/16", rate: 99.3 }, { day: "5/17", rate: 99.5 },
];

const riskTypes = [
  { name: "疾病诊断", value: 35 }, { name: "疗效承诺", value: 28 }, { name: "药品推荐", value: 18 },
  { name: "交易投诉", value: 12 }, { name: "其他", value: 7 },
];

const tenantActivity = [
  { name: "知养健康课堂", consults: 2280, tickets: 88 }, { name: "星选私域零售", consults: 1850, tickets: 78 },
  { name: "同城门店联盟", consults: 1520, tickets: 34 },
];

const PIE_COLORS = ["#2563EB", "#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981"];

interface MetricCardData {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
  trendColor: string;
}

export default function PlatformDashboard({}: PageProps) {
  const metrics: MetricCardData[] = [
    {
      icon: <Building2 size={18} className="text-blue-600" />,
      label: "总租户数",
      value: "3",
      trend: "全部启用",
      trendColor: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: <Store size={18} className="text-indigo-600" />,
      label: "活跃商家数",
      value: "6",
      trend: "营业中",
      trendColor: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: <MessageCircle size={18} className="text-violet-600" />,
      label: "今日咨询量",
      value: "528",
      trend: "+12% vs 昨日",
      trendColor: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: <Zap size={18} className="text-amber-600" />,
      label: "AI 调用量",
      value: "12,800",
      trend: "本月累计",
      trendColor: "text-blue-600 bg-blue-50",
    },
    {
      icon: <Database size={18} className="text-cyan-600" />,
      label: "Token 消耗",
      value: "2.4M",
      trend: "本月累计",
      trendColor: "text-blue-600 bg-blue-50",
    },
    {
      icon: <CreditCard size={18} className="text-emerald-600" />,
      label: "平台收入",
      value: "¥24,800",
      trend: "本月累计",
      trendColor: "text-blue-600 bg-blue-50",
    },
    {
      icon: <AlertTriangle size={18} className="text-rose-600" />,
      label: "高风险会话",
      value: "12",
      trend: "待处理",
      trendColor: "text-rose-600 bg-rose-50",
    },
    {
      icon: <TrendingUp size={18} className="text-emerald-600" />,
      label: "AI 成功率",
      value: "88.5%",
      trend: "+2.1% vs 上月",
      trendColor: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: <Shield size={18} className="text-emerald-600" />,
      label: "系统健康",
      value: "正常",
      trend: "所有服务正常",
      trendColor: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: <Zap size={18} className="text-purple-600" />,
      label: "幻觉率",
      value: "2.1%",
      trend: "-0.3% vs 上月",
      trendColor: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: <BookOpen size={18} className="text-orange-600" />,
      label: "知识缺口沉淀率",
      value: "18%",
      trend: "-5% vs 上月",
      trendColor: "text-emerald-600 bg-emerald-50",
    },
    {
      icon: <Clock size={18} className="text-cyan-600" />,
      label: "FAQ响应时间",
      value: "0.9s",
      trend: "+0.1s vs 上月",
      trendColor: "text-amber-600 bg-amber-50",
    },
  ];

  const formatTokens = (val: number | string): string => {
    const n = typeof val === "string" ? parseInt(val, 10) : val;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
    return String(n);
  };

  const renderPieLabel = (props: { name?: string }): string => props.name ?? "";

  const allBadges = reqs.PlatformDashboard.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);

  return (
    <div className="relative platform-dashboard">
      {allBadges}
      <h2 className="text-2xl font-bold text-slate-900 mb-6">平台总览</h2>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-slate-200 bg-white p-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-base font-semibold text-slate-600">{m.label}</span>
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100">
                {m.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-2">{m.value}</div>
            <span className={`inline-block text-base font-medium px-2 py-0.5 rounded-full ${m.trendColor}`}>
              {m.trend}
            </span>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-4">
        {/* Platform AI Call Trend */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Activity size={16} className="text-blue-600" />
            平台 AI 调用趋势
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={callTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="calls" stroke="#2563EB" strokeWidth={2} dot={{ fill: "#2563EB", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-3 text-base text-slate-500">平台API调用量反映所有租户的总活跃度。骤降需排查服务可用性或渠道切换；骤升可能为营销活动或异常流量，建议结合限流策略分析。</p>
        </div>

        {/* Token Consumption by Tenant */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Database size={16} className="text-indigo-600" />
            Token 消耗 (按租户)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tenantTokens}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={formatTokens} />
              <Tooltip formatter={(value) => [formatTokens(value as number), "Token"]} />
              <Bar dataKey="tokens" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <p className="mt-3 text-base text-slate-500">Token消耗反映各租户AI使用量。快速增长需关注是否有低效调用或滥用；单个租户占比{'>'}50%需评估资源分配合理性。</p>
        </div>

        {/* Tenant Package Distribution */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <Users size={16} className="text-violet-600" />
            租户套餐分布
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={packageDist}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                label={renderPieLabel}
                labelLine={false}
              >
                {packageDist.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Model Success Rate */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-600" />
            模型调用成功率
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={successRateTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis domain={[96, 100]} tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value) => [`${value}%`, "成功率"]} />
              <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-3 text-base text-slate-500">AI回答成功率是平台核心质量指标。低于95%需排查知识库覆盖度、模型调用质量和Prompt版本变更影响。持续下降将直接影响租户续费意愿。</p>
        </div>

        {/* Risk Interception Types */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="text-rose-600" />
            风险拦截类型
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskTypes}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                label={renderPieLabel}
                labelLine={false}
              >
                {riskTypes.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tenant Activity Ranking */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-amber-600" />
            租户活跃排名
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tenantActivity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={90} />
              <Tooltip />
              <Legend />
              <Bar dataKey="consults" fill="#2563EB" name="咨询量" radius={[0, 4, 4, 0]} />
              <Bar dataKey="tickets" fill="#F59E0B" name="工单数" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
