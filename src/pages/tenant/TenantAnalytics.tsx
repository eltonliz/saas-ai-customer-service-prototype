import type { PageProps } from "../../types";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";
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
    <div className="rounded-xl border border-slate-200 bg-white p-8">
      <h3 className="text-base font-semibold text-slate-700 mb-3">{title}</h3>
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

const transferSuccessTrend: DayRate[] = [
  { day: "5/11", rate: 72 }, { day: "5/12", rate: 75 }, { day: "5/13", rate: 74 },
  { day: "5/14", rate: 78 }, { day: "5/15", rate: 80 }, { day: "5/16", rate: 82 }, { day: "5/17", rate: 85 },
];

const gapDepositData: DayGap[] = [
  { day: "5/11", gap: 12 }, { day: "5/12", gap: 10 }, { day: "5/13", gap: 11 },
  { day: "5/14", gap: 9 }, { day: "5/15", gap: 8 }, { day: "5/16", gap: 7 }, { day: "5/17", gap: 5 },
];

const satisfactionTrendData: DayRate[] = [
  { day: "5/11", rate: 4.1 }, { day: "5/12", rate: 4.2 }, { day: "5/13", rate: 4.1 },
  { day: "5/14", rate: 4.3 }, { day: "5/15", rate: 4.4 }, { day: "5/16", rate: 4.3 }, { day: "5/17", rate: 4.5 },
];

/* ──── Page ──── */
export default function TenantAnalytics({}: PageProps) {
  const allBadges = reqs.TenantAnalytics.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);
  return (
    <div className="relative">
      {allBadges}
      <h2 className="text-2xl font-bold text-slate-900 mb-5">数据分析</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

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
          <p className="text-base text-emerald-600 mt-2">
            当前 62% <span className="text-slate-400">较上周 +4%</span>
          </p>
          <p className="mt-2 text-base text-slate-500">AI解决率=AI独立解决会话数/总会话数，是衡量机器人能力的关键指标。低于50%需排查知识库覆盖度和意图识别准确率，持续下降将增加人工成本。</p>
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
          <p className="mt-2 text-base text-slate-500">回答来源反映AI获取答案的路径结构。FAQ匹配占比下降可能表明标准问题覆盖不足；工具调用占比过高可能增加延迟和成本，建议优化FAQ和知识库。</p>
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
          <p className="mt-2 text-base text-slate-500">热门话题反映用户核心关注点。新话题快速上升预示业务变化；某话题持续高位说明相关FAQ和知识库需优先维护。</p>
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
          <p className="text-base text-amber-600 mt-2">
            缺口持续收窄 <span className="text-slate-400">较上周 -75%</span>
          </p>
          <p className="mt-2 text-base text-slate-500">知识缺口=AI无法回答且用户未解决的问题。缺口收窄说明知识库持续完善；缺口回升需排查近期业务变更或新上线的商品/活动。</p>
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
          <p className="mt-2 text-base text-slate-500">坐席工作量反映人工客服负载分布。个别坐席会话数远超均值可能导致服务质量下降；需关注负载均衡和排班优化。</p>
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
          <p className="mt-2 text-base text-slate-500">渠道分布反映用户触点偏好。某渠道占比突增可能为营销引流效果；渠道异常下降需排查接入服务可用性。</p>
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
          <p className="text-base text-violet-600 mt-2">
            当前 6.8 min <span className="text-slate-400">较上周 -20%</span>
          </p>
          <p className="mt-2 text-base text-slate-500">平均处理时长(AHT)反映客服效率。持续上升可能因知识库不足或系统延迟；骤降需确认是否跳过了必要的服务步骤。</p>
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
          <p className="mt-2 text-base text-slate-500">满意度是用户对服务的综合评价。4-5星占比低于75%需关注差评原因；1-2星占比突增可能为系统性服务问题，建议结合差评标签分析。</p>
        </ChartCard>

        {/* 9. 转人工成功率 */}
        <ChartCard title="转人工成功率">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={transferSuccessTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[60, 100]} unit="%" />
                <Tooltip formatter={(v) => [`${v}%`, ""]} />
                <Line type="monotone" dataKey="rate" stroke={EMERALD} strokeWidth={2.5} dot={{ r: 4, fill: EMERALD }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-base text-emerald-600 mt-2">
            当前 85% <span className="text-slate-400">较上周 +13%</span>
          </p>
          <p className="mt-2 text-base text-slate-500">转人工成功率反映AI将用户流畅转接至人工坐席的能力。低于70%需检查转接逻辑、坐席分派策略和用户等待体验。</p>
        </ChartCard>

        {/* 10. 知识缺口沉淀率 */}
        <ChartCard title="知识缺口沉淀率">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={gapDepositData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[0, 20]} />
                <Tooltip formatter={(v) => [`${v} 条`, ""]} />
                <Line type="monotone" dataKey="gap" stroke={AMBER} strokeWidth={2.5} dot={{ r: 4, fill: AMBER }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-base text-amber-600 mt-2">
            缺口持续收窄 <span className="text-slate-400">较上周 -58%</span>
          </p>
          <p className="mt-2 text-base text-slate-500">知识缺口沉淀率反映未解决问题进入知识缺口池的比例。沉淀率降低说明知识发现和知识补充流程运转良好；沉淀率升高需优化知识回流机制。</p>
        </ChartCard>

        {/* 11. 满意度趋势 */}
        <ChartCard title="满意度趋势">
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={satisfactionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[3.5, 5]} />
                <Tooltip formatter={(v) => [`${v}`, ""]} />
                <Line type="monotone" dataKey="rate" stroke={BLUE} strokeWidth={2.5} dot={{ r: 4, fill: BLUE }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="text-base text-blue-600 mt-2">
            当前 4.5 <span className="text-slate-400">较上周 +0.1</span>
          </p>
          <p className="mt-2 text-base text-slate-500">满意度趋势反映用户对服务质量的长期感知变化。持续上升说明服务优化有效；波动较大或下降需结合差评原因分析并制定改进措施。</p>
        </ChartCard>

      </div>
    </div>
  );
}
