import { useState } from "react";
import type { PageProps } from "../../types";
import { Mic } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";
import { Modal } from "../../components/Modal";

const defaultScripts = [
  { id: "l-1", title: "营养套装直播话术", businessLine: "直播", product: "直播营养套装", status: "已启用", words: 1200, content: "欢迎各位宝宝进入直播间！今天给大家带来的是我们的明星产品——直播专享营养套装……" },
  { id: "l-2", title: "养生茶直播话术", businessLine: "直播", product: "养生茶礼盒", status: "已启用", words: 980, content: "家人们看过来！这款养生茶礼盒采用传统配方，精选多种天然草本……" },
  { id: "l-3", title: "家清三件套话术", businessLine: "商城", product: "家清三件套", status: "草稿", words: 650, content: "健康生活从家居清洁开始！今天推荐这款家清三件套……" },
  { id: "l-4", title: "健康会员推广话术", businessLine: "大健康", product: "健康会员", status: "已启用", words: 1100, content: "健康是最大的财富！加入我们的健康会员，享受一对一健康顾问服务……" },
];

export default function LiveScript({}: PageProps) {
  const [scripts, setScripts] = useState(defaultScripts);
  const [detailOpen, setDetailOpen] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState<string | null>(null);
  const allBadges = reqs.LiveScript.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);
  const selectedScript = scripts.find((s) => s.id === detailOpen);
  const previewScript = scripts.find((s) => s.id === previewOpen);

  function toggleStatus(id: string) {
    setScripts((prev) => prev.map((s) => s.id === id ? { ...s, status: s.status === "已启用" ? "草稿" : "已启用" } : s));
  }

  return (
    <div className="live-script-page">
      <div className="flex items-center justify-between mb-6">
      {allBadges}
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
            {scripts.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 56 }}>
                <td className="px-5 py-3 text-base font-medium text-slate-800">{s.title}</td>
                <td className="px-5 py-3 text-base text-slate-600">{s.businessLine}</td>
                <td className="px-5 py-3 text-base text-slate-600">{s.product}</td>
                <td className="px-5 py-3 text-base text-slate-600">{s.words}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${s.status === "已启用" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{s.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => setDetailOpen(s.id)} className="text-base text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button onClick={() => setPreviewOpen(s.id)} className="text-base text-slate-400 hover:text-slate-600 mr-3">预览</button>
                  <button onClick={() => toggleStatus(s.id)} className={`text-base ${s.status === "已启用" ? "text-amber-600 hover:text-amber-800" : "text-emerald-600 hover:text-emerald-800"}`}>{s.status === "已启用" ? "停用" : "启用"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!detailOpen} title="编辑话术" onClose={() => setDetailOpen(null)}>
        {selectedScript && (
          <div className="space-y-3 text-base">
            <div><label className="text-base font-medium text-slate-700">标题</label><input defaultValue={selectedScript.title} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div><label className="text-base font-medium text-slate-700">关联商品</label><input defaultValue={selectedScript.product} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400" /></div>
            <div><label className="text-base font-medium text-slate-700">话术内容</label><textarea defaultValue={selectedScript.content} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400 h-32 resize-none" /></div>
            <div className="flex justify-end gap-3"><button onClick={() => setDetailOpen(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600">取消</button><button onClick={() => setDetailOpen(null)} className="rounded-lg bg-blue-600 px-4 py-2 text-white">保存</button></div>
          </div>
        )}
      </Modal>

      <Modal open={!!previewOpen} title="话术预览" onClose={() => setPreviewOpen(null)} size="lg">
        {previewScript && (
          <div className="space-y-3 text-base">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-slate-400">标题：</span><span className="font-semibold text-slate-800">{previewScript.title}</span>
              <span className="text-slate-400">字数：</span><span>{previewScript.words}</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-base leading-relaxed text-slate-700 whitespace-pre-wrap">{previewScript.content}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
