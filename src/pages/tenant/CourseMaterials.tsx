import type { PageProps } from "../../types";
import { GraduationCap } from "lucide-react";

const mockCourses = [
  { id: "c-1", title: "直播带货实战", instructor: "李老师", duration: "12课时", enrolled: 342, status: "已上线" },
  { id: "c-2", title: "私域运营入门", instructor: "王老师", duration: "8课时", enrolled: 218, status: "已上线" },
  { id: "c-3", title: "门店服务标准化", instructor: "张老师", duration: "6课时", enrolled: 156, status: "已上线" },
  { id: "c-4", title: "大健康科普课程", instructor: "陈医生", duration: "10课时", enrolled: 89, status: "草稿" },
];

export default function CourseMaterials({ goPage }: PageProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
            <GraduationCap size={20} className="text-violet-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">课程客服资料</h2>
            <p className="text-sm text-slate-500 mt-1">管理课程相关的AI客服话术、FAQ及知识文档</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 h-10">
          + 新增课程资料
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">课程名称</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">讲师</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">课时</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">报名人数</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">状态</th>
              <th className="text-left px-5 py-3 text-sm font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {mockCourses.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 48 }}>
                <td className="px-5 py-3 text-sm font-medium text-slate-800">{c.title}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{c.instructor}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{c.duration}</td>
                <td className="px-5 py-3 text-sm text-slate-600">{c.enrolled}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${c.status === "已上线" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{c.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="text-sm text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button className="text-sm text-slate-400 hover:text-slate-600">详情</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
