import type { PageProps } from "../../types";
import { Mic } from "lucide-react";

const mockScripts = [
  { id: "l-1", title: "营养套装直播话术", businessLine: "直播", product: "直播营养套装", status: "已启用", words: 1200 },
  { id: "l-2", title: "养生茶直播话术", businessLine: "直播", product: "养生茶礼盒", status: "已启用", words: 980 },
  { id: "l-3", title: "家清三件套话术", businessLine: "商城", product: "家清三件套", status: "草稿", words: 650 },
  { id: "l-4", title: "健康会员推广话术", businessLine: "大健康", product: "健康会员", status: "已启用", words: 1100 },
];

export default function LiveScript({ goPage }: PageProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50">
            <Mic size={20} className="text-rose-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">直播话术管理</h2>
            <p className="text-base text-slate-500 mt-1">管理直播带货场景下的AI客服推荐话术和标准应答</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 h-10">
          + 新增话术
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">话术标题</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">业务线</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">关联商品</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">字数</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">状态</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {mockScripts.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 56 }}>
                <td className="px-5 py-3 text-base font-medium text-slate-800">{s.title}</td>
                <td className="px-5 py-3 text-base text-slate-600">{s.businessLine}</td>
                <td className="px-5 py-3 text-base text-slate-600">{s.product}</td>
                <td className="px-5 py-3 text-base text-slate-600">{s.words}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${s.status === "已启用" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{s.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="text-base text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button className="text-base text-slate-400 hover:text-slate-600 mr-3">预览</button>
                  {s.status === "已启用" ? (
                    <button className="text-base text-amber-600 hover:text-amber-800">停用</button>
                  ) : (
                    <button className="text-base text-emerald-600 hover:text-emerald-800">启用</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
