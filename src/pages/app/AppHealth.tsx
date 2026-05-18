import type { PageProps } from "../../types";
import { Shield, AlertTriangle, Heart, MessageCircle, ChevronRight, CircleCheck, CircleX } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

const articles = [
  {
    title: "科学睡眠指南",
    desc: "了解睡眠周期，建立健康的睡眠习惯，提升睡眠质量。",
  },
  {
    title: "均衡饮食建议",
    desc: "合理搭配五大营养素，制定适合您的日常饮食计划。",
  },
  {
    title: "运动与健康",
    desc: "适量运动对心血管健康和骨骼健康的长期益处。",
  },
  {
    title: "压力管理与放松技巧",
    desc: "学习呼吸调节、冥想等方法缓解日常压力。",
  },
  {
    title: "营养素摄入指南",
    desc: "认识维生素、矿物质等微量元素的日常摄入建议。",
  },
  {
    title: "慢性病日常管理注意事项",
    desc: "关于日常监测、生活方式干预与定期复查的健康科普。",
  },
];

export default function AppHealth({ goPage }: PageProps) {
  const healthReqs = reqs.AppHealth.find(r => r.badgeLabel === "health-rules")?.reqs;

  return (
    <div className="p-4 relative">
      {healthReqs?.map(req => (<RequirementBadge key={req.id} req={req} />))}

      {/* ========== 1. 合规警示横幅 — MORE PROMINENT ========== */}
      <div className="mb-5 rounded-2xl border-2 border-rose-300 bg-rose-50 p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={24} className="text-rose-600" />
          <span className="text-xl font-bold text-rose-700">合规提示</span>
        </div>
        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-2">
            <CircleX size={16} className="text-rose-500 mt-0.5 shrink-0" />
            <span className="text-base text-rose-700 font-medium">AI不能进行疾病诊断</span>
          </div>
          <div className="flex items-start gap-2">
            <CircleX size={16} className="text-rose-500 mt-0.5 shrink-0" />
            <span className="text-base text-rose-700 font-medium">AI不能替代医生建议</span>
          </div>
          <div className="flex items-start gap-2">
            <CircleX size={16} className="text-rose-500 mt-0.5 shrink-0" />
            <span className="text-base text-rose-700 font-medium">AI不能提供用药指导</span>
          </div>
        </div>
        <p className="text-base text-rose-600 bg-rose-100 rounded-lg px-3 py-2">
          本服务仅提供健康科普信息，如有不适请及时就医
        </p>
      </div>

      {/* ========== 2. 服务范围说明 ========== */}
      <div className="mb-5 rounded-xl border border-slate-100 bg-white p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">服务范围说明</h3>
        <div className="mb-3">
          <p className="text-base font-medium text-emerald-700 mb-2 flex items-center gap-1.5">
            <CircleCheck size={16} className="text-emerald-500" />
            可以提供
          </p>
          <ul className="space-y-1.5 ml-6">
            <li className="text-base text-slate-600">健康知识科普</li>
            <li className="text-base text-slate-600">营养饮食建议</li>
            <li className="text-base text-slate-600">运动健康指导</li>
            <li className="text-base text-slate-600">产品成分说明</li>
          </ul>
        </div>
        <div>
          <p className="text-base font-medium text-rose-700 mb-2 flex items-center gap-1.5">
            <CircleX size={16} className="text-rose-500" />
            不能提供
          </p>
          <ul className="space-y-1.5 ml-6">
            <li className="text-base text-slate-600">疾病诊断</li>
            <li className="text-base text-slate-600">用药建议</li>
            <li className="text-base text-slate-600">治疗方案推荐</li>
            <li className="text-base text-slate-600">急症处理指导</li>
          </ul>
        </div>
      </div>

      {/* ========== 3. 健康科普文章 ========== */}
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-slate-800 mb-3">健康科普</h3>
        <div className="space-y-3">
          {articles.map((article, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 className="text-base font-medium text-slate-700">{article.title}</h4>
              <p className="mt-1 text-base text-slate-400">{article.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========== 4. 风险示例 ========== */}
      <div className="mb-5">
        <h3 className="text-xl font-semibold text-slate-800 mb-3">咨询示例</h3>
        <div className="space-y-3">
          {/* 低风险 */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-600" />
              <span className="text-base font-semibold text-emerald-700">
                低风险科普 — 可以回答
              </span>
            </div>
            <p className="mt-2 text-base text-slate-700">
              用户："日常如何补充维生素？"
            </p>
            <p className="mt-1 text-base text-emerald-600">
              AI回复："可提供营养科普建议"
            </p>
          </div>

          {/* 高风险 */}
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-600" />
              <span className="text-base font-semibold text-rose-700">
                高风险拦截 — 无法回答
              </span>
            </div>
            <p className="mt-2 text-base text-slate-700">
              用户："我头痛吃什么药？"
            </p>
            <p className="mt-1 text-base text-rose-600">
              AI回复："建议就医，不提供用药建议"
            </p>
          </div>
        </div>
      </div>

      {/* ========== 5. AI咨询入口 — LARGE BUTTON ========== */}
      <button
        type="button"
        onClick={() => goPage?.("ai-service", { chatPrompt: "大健康咨询" })}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 min-h-[56px] px-4 py-4 text-lg font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        <Heart size={20} />
        咨询大健康AI顾问
      </button>
      <p className="mt-2 text-center text-base text-slate-400">
        AI不替代医生诊断
      </p>
    </div>
  );
}
