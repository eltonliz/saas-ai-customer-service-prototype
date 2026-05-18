import { useState } from "react";
import type { PageProps } from "../../types";
import { GraduationCap } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";
import { Modal } from "../../components/Modal";

const defaultCourses = [
  { id: "c-1", title: "直播带货实战", instructor: "李老师", duration: "12课时", enrolled: 342, status: "已上线", description: "从零开始掌握直播带货核心技巧，包含选品策略、话术设计、流量运营等实操内容。" },
  { id: "c-2", title: "私域运营入门", instructor: "王老师", duration: "8课时", enrolled: 218, status: "已上线", description: "系统学习私域流量搭建和社群运营，掌握朋友圈营销和裂变增长方法。" },
  { id: "c-3", title: "门店服务标准化", instructor: "张老师", duration: "6课时", enrolled: 156, status: "已上线", description: "门店服务流程标准化培训，涵盖接待礼仪、售后服务、投诉处理等核心模块。" },
  { id: "c-4", title: "大健康科普课程", instructor: "陈医生", duration: "10课时", enrolled: 89, status: "草稿", description: "专业健康科普知识讲解，涵盖营养学基础、运动健康和日常保健常识。" },
];

export default function CourseMaterials({}: PageProps) {
  const [courses] = useState(defaultCourses);
  const [detailOpen, setDetailOpen] = useState<string | null>(null);
  const allBadges = reqs.CourseMaterials.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);
  const selected = courses.find((c) => c.id === detailOpen);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
      {allBadges}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50">
            <GraduationCap size={20} className="text-violet-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">课程客服资料</h2>
            <p className="text-base text-slate-500 mt-1">管理课程相关的AI客服话术、FAQ及知识文档</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 h-10">
          + 新增课程资料
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">课程名称</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">讲师</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">课时</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">报名人数</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">状态</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 56 }}>
                <td className="px-5 py-3 text-base font-medium text-slate-800">{c.title}</td>
                <td className="px-5 py-3 text-base text-slate-600">{c.instructor}</td>
                <td className="px-5 py-3 text-base text-slate-600">{c.duration}</td>
                <td className="px-5 py-3 text-base text-slate-600">{c.enrolled}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${c.status === "已上线" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{c.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="text-base text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button onClick={() => setDetailOpen(c.id)} className="text-base text-slate-400 hover:text-slate-600">详情</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!detailOpen} title="课程详情" onClose={() => setDetailOpen(null)}>
        {selected && (
          <div className="space-y-3 text-base">
            <div><span className="text-slate-400">课程名称：</span><span className="font-medium">{selected.title}</span></div>
            <div><span className="text-slate-400">讲师：</span>{selected.instructor}</div>
            <div><span className="text-slate-400">课时：</span>{selected.duration}</div>
            <div><span className="text-slate-400">报名人数：</span>{selected.enrolled}</div>
            <div><span className="text-slate-400">状态：</span>{selected.status}</div>
            <div><span className="text-slate-400">课程描述：</span><p className="mt-1 text-slate-600">{selected.description}</p></div>
          </div>
        )}
      </Modal>
    </div>
  );
}
