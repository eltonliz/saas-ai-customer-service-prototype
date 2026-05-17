import type { PageProps } from "../../types";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

/* ──── Colors ──── */
const BLUE    = "#2563EB";
const INDIGO  = "#6366F1";
const VIOLET  = "#8B5CF6";
const EMERALD = "#10B981";
const AMBER   = "#F59E0B";
const ROSE    = "#EC4899";
const CYAN    = "#06B6D4";

const PIE_COLORS = [BLUE, EMERALD, AMBER, VIOLET, ROSE, CYAN, INDIGO];

/* ──── Shared card wrapper ──── */
function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">{title}</h3>
      {children}
    </div>
  );
}

/* ──── Data ──── */
interface DayRate   { day: string; rate: number }
interface DayGap    { day: string; gap: number  }
interface DayAHT    { day: string; aht: number  }
interface PieSlice  { name: string; value: number }
interface TopicRow  { topic: string; count: number }
interface AgentRow  { name: string; sessions: number; tickets: number }
interface StarRow   { star: string; pct: number }

const aiRateTrend: DayRate[] = [
  { day: "5/11", rate: 48 }, { day: "5/12", rate: 52 }, { day: "5/13", rate: 55 },
  { day: "5/14", rate: 54 }, { day: "5/15", rate: 58 }, { day: "5/16", rate: 60 }, { day: "5/17", rate: 62 },
];

const answerSourceData: PieSlice[] = [
  { name: "FAQ匹配", value: 42 }, { name: "RAG检索", value: 35 }, { name: "工具调用", value: 23 },
];

const hotTopics: TopicRow[] = [
  { topic: "物流进度查询", count: 85 }, { topic: "退款规则说明", count: 72 }, { topic: "核销流程指引", count: 58 },
  { topic: "课程有效期", count: 48 },  { topic: "商品库存咨询", count: 45 }, { topic: "直播间优惠", count: 38 },
  { topic: "售后申请入口", count: 35 }, { topic: "门店预约", count: 32 },     { topic: "会员权益", count: 28 },
  { topic: "健康科普咨询", count: 22 },
];

const gapTrend: DayGap[] = [
  { day: "5/11", gap: 8 }, { day: "5/12", gap: 7 }, { day: "5/13", gap: 6 },
  { day: "5/14", gap: 5 }, { day: "5/15", gap: 4 }, { day: "5/16", gap: 3 }, { day: "5/17", gap: 2 },
];

const agentWorkload: AgentRow[] = [
  { name: "林客服", sessions: 45, tickets: 12 }, { name: "陈客服", sessions: 38, tickets: 8 },
  { name: "赵店长", sessions: 22, tickets: 5 },  { name: "吴运营", sessions: 18, tickets: 3 },
  { name: "周老师", sessions: 15, tickets: 2 },
];

const channelData: PieSlice[] = [
  { name: "APP", value: 38 },     { name: "小程序", value: 28 },
  { name: "H5", value: 16 },      { name: "企业微信", value: 12 },
  { name: "公众号", value: 6 },
];

const ahtTrend: DayAHT[] = [
  { day: "5/11", aht: 8.5 }, { day: "5/12", aht: 8.2 }, { day: "5/13", aht: 7.8 },
  { day: "5/14", aht: 7.5 }, { day: "5/15", aht: 7.3 }, { day: "5/16", aht: 7.0 }, { day: "5/17", aht: 6.8 },
];

const satisfactionDist: StarRow[] = [
  { star: "5星", pct: 45 }, { star: "4星", pct: 32 }, { star: "3星", pct: 14 },
  { star: "2星", pct: 6 },  { star: "1星", pct: 3 },
];

/* ──── Page ──── */
export default function TenantAnalytics({}: PageProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-5">数据分析</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

        {/* 1. AI Resolution Rate Trend */}
        <ChartCard title="AI 解决率趋势">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aiRateTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[40, 70]} unit="%" />
                <Tooltip formatter={(v) => [`${v}%`, ""]} />
                <Line type="monotone" dataKey="rate" stroke={EMERALD} strokeWidth={2.5} dot={{ r: 4, fill: EMERALD }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-emerald-600 mt-2">
            当前 62% <span className="text-slate-400">较上周 +4%</span>
          </p>
        </ChartCard>

        {/* 2. Answer Source Ratio Pie */}
        <ChartCard title="回答来源分布">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={answerSourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                >
                  {answerSourceData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, ""]} />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 3. Hot Topics Top 10 */}
        <ChartCard title="热门话题 Top 10">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hotTopics} layout="vertical" margin={{ left: 10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="topic"
                  type="category"
                  tick={{ fontSize: 12, fill: "#475569" }}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <Tooltip formatter={(v) => [`${v} 次`, ""]} />
                <Bar dataKey="count" fill={BLUE} radius={[0, 4, 4, 0]} barSize={14} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 4. Knowledge Gap Trend */}
        <ChartCard title="知识缺口趋势">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gapTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[0, 10]} />
                <Tooltip formatter={(v) => [`${v} 条`, ""]} />
                <Line type="monotone" dataKey="gap" stroke={AMBER} strokeWidth={2.5} dot={{ r: 4, fill: AMBER }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-amber-600 mt-2">
            缺口持续收窄 <span className="text-slate-400">较上周 -75%</span>
          </p>
        </ChartCard>

        {/* 5. Agent Workload */}
        <ChartCard title="坐席工作量">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentWorkload} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} iconType="rect" iconSize={10} />
                <Bar dataKey="sessions" name="会话数" fill={INDIGO} radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="tickets" name="工单数" fill={CYAN} radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 6. Channel Source Pie */}
        <ChartCard title="渠道来源分布">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {channelData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v}%`, ""]} />
                <Legend
                  wrapperStyle={{ fontSize: 12 }}
                  iconType="circle"
                  iconSize={8}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* 7. Average Handling Time Trend */}
        <ChartCard title="平均处理时长趋势">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ahtTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[6, 9]} unit="min" />
                <Tooltip formatter={(v) => [`${v} min`, ""]} />
                <Line type="monotone" dataKey="aht" stroke={VIOLET} strokeWidth={2.5} dot={{ r: 4, fill: VIOLET }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-violet-600 mt-2">
            当前 6.8 min <span className="text-slate-400">较上周 -20%</span>
          </p>
        </ChartCard>

        {/* 8. Satisfaction Distribution */}
        <ChartCard title="满意度分布">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={satisfactionDist} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                <XAxis dataKey="star" tick={{ fontSize: 12, fill: "#475569" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} unit="%" />
                <Tooltip formatter={(v) => [`${v}%`, ""]} />
                <Bar dataKey="pct" fill={AMBER} radius={[4, 4, 0, 0]} barSize={32}>
                  {satisfactionDist.map((_, i) => (
                    <Cell key={i} fill={[EMERALD, BLUE, INDIGO, AMBER, ROSE][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

      </div>
    </div>
  );
}
