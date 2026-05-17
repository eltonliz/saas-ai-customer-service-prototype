import { useState } from "react";
import type { PageProps } from "../../types";
import { Modal } from "../../components/Modal";
import { Info, ShoppingBag, BookOpen, MapPin, Wrench, Megaphone, FileText, Plus, Edit3, Trash2 } from "lucide-react";

type MaterialTab = "product" | "course" | "store" | "afterSale" | "live" | "faq";

interface MaterialItem {
  name: string;
  desc: string;
}

const initialMaterials: Record<MaterialTab, { title: string; items: MaterialItem[] }> = {
  product: { title: "商品客服知识", items: [
    { name: "直播专享营养套装", desc: "30天组合装，含多种维生素和矿物质，售价199元。直播间专属价格，不与其它优惠叠加。" },
    { name: "商城精选家清组合", desc: "家庭清洁三件套，含洗洁精、洗衣液、厨房清洁剂，售价88元。" },
  ]},
  course: { title: "课程客服知识", items: [
    { name: "课程权益说明", desc: "已购课程有效期365天，支持回放、倍速播放和下载。课程社群权益以课程详情页为准。" },
    { name: "课程退款规则", desc: "购买后7日内未学习可全额退款，已学习课程不予退款。" },
  ]},
  store: { title: "门店服务规则", items: [
    { name: "到店核销规则", desc: "到店需出示订单二维码，门店扫码验证。核销失败常见原因：未到预约时间、订单已核销、系统故障。" },
    { name: "门店预约说明", desc: "建议提前24小时预约。预约后如需取消，请在预约时间前2小时操作。" },
  ]},
  afterSale: { title: "售后政策", items: [
    { name: "7天无理由退货", desc: "商品保持原始包装完好，不影响二次销售，可在7天内申请无理由退货。" },
    { name: "售后处理时效", desc: "商家需在24小时内处理售后申请。平台介入时效为48小时。" },
  ]},
  live: { title: "直播活动客服话术", items: [
    { name: "直播商品咨询", desc: "直播间商品库存实时更新。优惠以直播间实时价格为准，建议关注主播讲解。" },
    { name: "直播下单指导", desc: "点击直播间购物袋选择商品，确认规格和数量后直接下单。支持微信支付。" },
  ]},
  faq: { title: "商品常见问答", items: [
    { name: "商品发货时间", desc: "现货商品下单后24小时内发货，预售商品以页面标注发货时间为准。" },
    { name: "物流查询方式", desc: "在订单详情页可查看实时物流信息，也可联系AI客服查询。" },
  ]},
};

const tabs: { id: MaterialTab; label: string; icon: typeof Info }[] = [
  { id: "product", label: "商品知识", icon: ShoppingBag },
  { id: "course", label: "课程知识", icon: BookOpen },
  { id: "store", label: "门店规则", icon: MapPin },
  { id: "afterSale", label: "售后政策", icon: Wrench },
  { id: "live", label: "直播话术", icon: Megaphone },
  { id: "faq", label: "常见问答", icon: FileText },
];

export default function ServiceMaterials({}: PageProps) {
  const [tab, setTab] = useState<MaterialTab>("product");
  const [materials, setMaterials] = useState(initialMaterials);
  const [materialModal, setMaterialModal] = useState<{ open: boolean; editingIndex: number | null }>({ open: false, editingIndex: null });
  const [materialForm, setMaterialForm] = useState({ name: "", desc: "" });

  function openAddModal() {
    setMaterialForm({ name: "", desc: "" });
    setMaterialModal({ open: true, editingIndex: null });
  }

  function openEditModal(index: number) {
    const item = materials[tab].items[index];
    setMaterialForm({ name: item.name, desc: item.desc });
    setMaterialModal({ open: true, editingIndex: index });
  }

  function handleMaterialSave() {
    if (!materialForm.name.trim()) return;
    const newItem: MaterialItem = { name: materialForm.name.trim(), desc: materialForm.desc.trim() };

    setMaterials((prev) => {
      const currentItems = [...prev[tab].items];
      if (materialModal.editingIndex !== null) {
        currentItems[materialModal.editingIndex] = newItem;
      } else {
        currentItems.push(newItem);
      }
      return { ...prev, [tab]: { ...prev[tab], items: currentItems } };
    });
    setMaterialModal({ open: false, editingIndex: null });
  }

  function handleDelete(index: number) {
    const item = materials[tab].items[index];
    if (window.confirm(`确定要删除"${item.name}"吗？`)) {
      setMaterials((prev) => {
        const currentItems = prev[tab].items.filter((_, i) => i !== index);
        return { ...prev, [tab]: { ...prev[tab], items: currentItems } };
      });
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">商品/课程/门店客服资料</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-base font-medium transition-colors ${
              tab === t.id ? "bg-blue-600 text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <t.icon size={14} />{t.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-slate-800">{materials[tab].title}</h3>
        <button type="button" onClick={openAddModal} className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-base font-medium text-white hover:bg-blue-700">
          <Plus size={14} />新增
        </button>
      </div>

      <div className="space-y-3">
        {materials[tab].items.map((item, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base font-semibold text-slate-800 mb-2">{item.name}</h3>
                <p className="text-base text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
              <div className="flex gap-1.5 ml-3 flex-shrink-0">
                <button type="button" onClick={() => openEditModal(i)} className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50">
                  <Edit3 size={14} />
                </button>
                <button type="button" onClick={() => handleDelete(i)} className="rounded-lg border border-slate-200 p-1.5 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={materialModal.open}
        title={materialModal.editingIndex !== null ? "编辑资料" : "新增资料"}
        onClose={() => setMaterialModal({ open: false, editingIndex: null })}
        size="md"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">名称</label>
            <input
              value={materialForm.name}
              onChange={(e) => setMaterialForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="输入名称"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">描述</label>
            <textarea
              value={materialForm.desc}
              onChange={(e) => setMaterialForm((f) => ({ ...f, desc: e.target.value }))}
              placeholder="输入描述"
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400 resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setMaterialModal({ open: false, editingIndex: null })} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleMaterialSave} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">保存</button>
        </div>
      </Modal>
    </div>
  );
}
