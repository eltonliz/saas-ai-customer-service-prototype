import { useState } from "react";
import type { PageProps } from "../../types";
import { StatusBadge } from "../../components/StatusBadge";
import { Check, X, BookOpen, Shield } from "lucide-react";

const inspections = [
  { id: "ins-1", question: "直播间那款营养套装还有库存吗？", aiAnswer: "当前库存充足，售价199元...", score: 5, correct: true, needGap: false, risk: "低风险" },
  { id: "ins-2", question: "我的订单为什么物流不动？", aiAnswer: "只查询你本人订单，正在调用订单和物流接口...", score: 4, correct: true, needGap: false, risk: "低风险" },
  { id: "ins-3", question: "这个产品能治疗失眠吗？", aiAnswer: "不能进行疾病诊断或承诺治疗效果...", score: 5, correct: true, needGap: false, risk: "高风险" },
  { id: "ins-4", question: "门店核销失败怎么办？", aiAnswer: "核销失败可能有多种原因...", score: 3, correct: false, needGap: true, risk: "中风险" },
  { id: "ins-5", question: "课程回放在哪里看？", aiAnswer: "已购课程有效期365天...", score: 5, correct: true, needGap: false, risk: "低风险" },
];

export default function QualityInspection({}: PageProps) {
  const [items, setItems] = useState(inspections);

  function markCorrect(id: string) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, correct: true, needGap: false } : i));
  }

  function markIncorrect(id: string) {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, correct: false, needGap: true } : i));
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-4">质检中心</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{items.length}</p>
          <p className="text-sm text-blue-500">AI回答抽检样本</p>
        </div>
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">{items.filter((i) => i.correct).length}</p>
          <p className="text-sm text-emerald-500">正确回答</p>
        </div>
        <div className="rounded-xl bg-orange-50 border border-orange-100 p-4 text-center">
          <p className="text-2xl font-bold text-orange-700">{items.filter((i) => i.needGap).length}</p>
          <p className="text-sm text-orange-500">需入知识缺口池</p>
        </div>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800 mb-1">Q: {item.question}</p>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">A: {item.aiAnswer}</p>
              </div>
              <div className="flex flex-col items-end gap-1 ml-4">
                <StatusBadge status={item.risk} />
                <span className={`text-sm font-medium ${item.correct ? "text-emerald-600" : "text-red-500"}`}>
                  评分: {item.score}/5
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <span className="text-sm text-slate-500">质检结果:</span>
              {item.correct ? (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700"><Check size={12} className="inline mr-1" />正确</span>
              ) : (
                <span className="rounded-full bg-red-50 px-3 py-1 text-sm font-medium text-red-700"><X size={12} className="inline mr-1" />需纠正</span>
              )}
              {!item.correct && (
                <button type="button" onClick={() => markCorrect(item.id)} className="rounded-lg border border-emerald-200 px-3 py-1 text-sm text-emerald-600 hover:bg-emerald-50">
                  <Check size={12} className="inline mr-1" />人工纠正为正确
                </button>
              )}
              {item.needGap && (
                <span className="flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-sm font-medium text-orange-700">
                  <BookOpen size={12} />已入知识缺口池
                </span>
              )}
              {!item.needGap && !item.correct && (
                <button type="button" onClick={() => markIncorrect(item.id)} className="rounded-lg border border-orange-200 px-3 py-1 text-sm text-orange-600 hover:bg-orange-50">
                  <BookOpen size={12} className="inline mr-1" />加入知识缺口池
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
