import { useState } from "react";
import type { PageProps } from "../../types";
import { BookOpen, Clock, User, RotateCcw, Headphones, Shield } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

const courses = [
  { id: "course-1", title: "私域运营实战课", instructor: "王老师", duration: "12课时", expiry: "365天", desc: "从0到1搭建私域运营体系，覆盖社群运营、朋友圈营销、客户分层等核心模块。", tags: ["已购", "可回放"] },
  { id: "course-2", title: "直播带货技巧", instructor: "李老师", duration: "8课时", expiry: "180天", desc: "直播选品、话术与流量转化，从入门到精通。", tags: ["已购", "可回放"] },
  { id: "course-3", title: "大健康产品知识认证", instructor: "张教授", duration: "16课时", expiry: "365天", desc: "系统学习保健品法规、营养成分、产品功效及合规宣传要点，通过认证考试后可获得平台颁发的健康顾问资格证书。", tags: ["已购", "认证考试"] },
  { id: "course-4", title: "客户服务沟通艺术", instructor: "陈老师", duration: "6课时", expiry: "90天", desc: "掌握高效沟通技巧、投诉处理策略与情绪管理方法，提升客户满意度和复购率。", tags: ["免费", "可回放"] },
  { id: "course-5", title: "AI客服配置实操", instructor: "刘老师", duration: "4课时", expiry: "180天", desc: "手把手教你配置FAQ知识库、RAG召回策略、机器人话术及多渠道分发规则。", tags: ["已购", "实操演练"] },
];

export default function AppCourses({ goPage }: PageProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const course = selected ? courses.find((c) => c.id === selected) : null;

  const courseReqs = reqs.AppCourses.find(r => r.badgeLabel === "course-rules")?.reqs;

  return (
    <div className="p-4 relative">
      {courseReqs?.map(req => (<RequirementBadge key={req.id} req={req} />))}
      <h2 className="text-2xl font-bold text-slate-900 mb-4">课程学习</h2>
      {!course ? (
        <div className="space-y-3">
          {courses.map((c) => (
            <button key={c.id} type="button" onClick={() => setSelected(c.id)} className="w-full rounded-2xl bg-white p-4 shadow-sm border border-slate-100 text-left transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                  <BookOpen size={20} className="text-violet-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-slate-800">{c.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {c.tags.map((t) => (
                      <span key={t} className="rounded-md bg-violet-50 px-2 py-0.5 text-base text-violet-600">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-base text-slate-500">
                <div className="flex items-center gap-1.5"><User size={14} className="text-slate-300" />{c.instructor}</div>
                <div className="flex items-center gap-1.5"><Clock size={14} className="text-slate-300" />{c.duration} · 有效期{c.expiry}</div>
              </div>
              <p className="text-base text-slate-400 mt-2">{c.desc}</p>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button type="button" onClick={() => setSelected(null)} className="mb-4 text-base text-blue-600 hover:text-blue-700">&larr; 返回列表</button>
          <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100">
                <BookOpen size={24} className="text-violet-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
                <p className="text-base text-slate-400">{course.instructor}</p>
              </div>
            </div>
            <div className="space-y-3 text-base text-slate-600 mb-4">
              <div className="flex items-center gap-2"><User size={16} className="text-slate-400" /><span>讲师：{course.instructor}</span></div>
              <div className="flex items-center gap-2"><Clock size={16} className="text-slate-400" /><span>{course.duration} · 有效期{course.expiry}</span></div>
              <div className="flex items-center gap-2"><Shield size={16} className="text-slate-400" /><span>学习权益：支持回放、倍速播放、下载</span></div>
              <div className="flex items-center gap-2"><RotateCcw size={16} className="text-slate-400" /><span>回放入口：我的 → 我的课程</span></div>
            </div>
            <p className="text-base text-slate-500 bg-slate-50 rounded-xl p-3">{course.desc}</p>
            <div className="mt-4 flex gap-3">
              <button type="button" onClick={() => goPage?.("ai-service", { chatPrompt: `咨询课程 ${course.title}` })} className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-base font-medium text-blue-700 hover:bg-blue-100">
                <Headphones size={16} />课程客服
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
