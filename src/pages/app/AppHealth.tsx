import type { PageProps } from "../../types";
import { Shield, AlertTriangle, Heart, MessageCircle, ChevronRight } from "lucide-react";

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
];

export default function AppHealth({ goPage }: PageProps) {
  return (
    <div className="p-4">

      {/* ========== 1. 合规警示横幅 ========== */}
      <div className="mb-5 rounded-2xl border-2 border-rose-300 bg-rose-50 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={20} className="text-rose-600" />
          <span className="text-base font-bold text-rose-700">合规提示</span>
        </div>
        <p className="mt-2 text-sm text-rose-600">
          AI客服仅提供健康科普和生活方式建议，不能进行疾病诊断、治疗建议或药品推荐。如有身体不适，请及时就医。
        </p>
      </div>

      {/* ========== 2. 健康科普文章 ========== */}
      <div className="mb-5">
        <h3 className="mb-3 text-base font-semibold text-slate-800">健康科普</h3>
        <div className="space-y-3">
          {articles.map((article, i) => (
            <div
              key={i}
              className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm"
            >
              <h4 className="text-sm font-medium text-slate-700">{article.title}</h4>
              <p className="mt-1 text-sm text-slate-400">{article.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ========== 3. 风险示例 ========== */}
      <div className="mb-5">
        <h3 className="mb-3 text-base font-semibold text-slate-800">咨询示例</h3>
        <div className="space-y-3">
          {/* 低风险 */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-700">
                低风险科普 — 可以回答
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">
              用户："日常如何补充维生素？"
            </p>
            <p className="mt-1 text-sm text-emerald-600">
              AI回复："可提供营养科普建议"
            </p>
          </div>

          {/* 高风险 */}
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-600" />
              <span className="text-sm font-semibold text-rose-700">
                高风险拦截 — 无法回答
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-700">
              用户："我头痛吃什么药？"
            </p>
            <p className="mt-1 text-sm text-rose-600">
              AI回复："建议就医，不提供用药建议"
            </p>
          </div>
        </div>
      </div>

      {/* ========== 4. AI咨询入口 ========== */}
      <button
        type="button"
        onClick={() => goPage?.("ai-service", { chatPrompt: "大健康咨询" })}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-4 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        <Heart size={20} />
        咨询大健康AI客服
      </button>
      <p className="mt-2 text-center text-[13px] text-slate-400">
        AI不替代医生诊断
      </p>
    </div>
  );
}
