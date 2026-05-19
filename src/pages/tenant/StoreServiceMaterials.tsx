import { useState } from "react";
import type { PageProps } from "../../types";
import { Store } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";
import { Modal } from "../../components/Modal";

const defaultStores = [
  { id: "s-1", name: "星选旗舰店", city: "杭州", address: "西湖区文三路 478 号", inventory: 1250, phone: "0571-88001234", hours: "10:00-21:00", status: "营业中" },
  { id: "s-2", name: "会员社区店", city: "杭州", address: "余杭区五常街道", inventory: 430, phone: "0571-89005678", hours: "09:30-20:30", status: "营业中" },
  { id: "s-3", name: "城西体验店", city: "上海", address: "徐汇区漕溪北路", inventory: 680, phone: "021-54001234", hours: "10:00-22:00", status: "装修中" },
];

export default function StoreServiceMaterials({}: PageProps) {
  const [stores] = useState(defaultStores);
  const [detailOpen, setDetailOpen] = useState<string | null>(null);
  const allBadges = reqs.StoreServiceMaterials.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);
  const selectedStore = stores.find((s) => s.id === detailOpen);

  return (
    <div className="store-materials-page">
      {allBadges}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
            <Store size={20} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900">门店客服资料</h2>
            <p className="text-base text-slate-500 mt-1">管理门店相关的服务信息、库存数据及客服话术</p>
          </div>
        </div>
        <button onClick={() => alert("新增门店资料功能开发中")} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 h-10">
          + 新增门店资料
        </button>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-base">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">门店名称</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">城市</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">地址</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">在售商品数</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">状态</th>
              <th className="text-left px-5 py-3 text-base font-semibold text-slate-600">操作</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50" style={{ minHeight: 56 }}>
                <td className="px-5 py-3 text-base font-medium text-slate-800">{s.name}</td>
                <td className="px-5 py-3 text-base text-slate-600">{s.city}</td>
                <td className="px-5 py-3 text-base text-slate-600">{s.address}</td>
                <td className="px-5 py-3 text-base text-slate-600">{s.inventory}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-sm font-medium ${s.status === "营业中" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{s.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="text-base text-blue-600 hover:text-blue-800 mr-3">编辑</button>
                  <button onClick={() => setDetailOpen(s.id)} className="text-base text-slate-400 hover:text-slate-600">详情</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!detailOpen} title="门店详情" onClose={() => setDetailOpen(null)}>
        {selectedStore && (
          <div className="space-y-3 text-base">
            <div><span className="text-slate-400">门店名称：</span><span className="font-medium">{selectedStore.name}</span></div>
            <div><span className="text-slate-400">城市：</span>{selectedStore.city}</div>
            <div><span className="text-slate-400">地址：</span>{selectedStore.address}</div>
            <div><span className="text-slate-400">电话：</span>{selectedStore.phone}</div>
            <div><span className="text-slate-400">营业时间：</span>{selectedStore.hours}</div>
            <div><span className="text-slate-400">在售商品数：</span>{selectedStore.inventory}</div>
            <div><span className="text-slate-400">状态：</span>{selectedStore.status}</div>
          </div>
        )}
      </Modal>
    </div>
  );
}
