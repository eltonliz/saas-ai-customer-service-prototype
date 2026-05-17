import type { PageProps } from "../../types";
import { useAppStore } from "../../data/AppStore";
import { RotateCcw, Store, GraduationCap, Heart, Wrench, Crown, ChevronRight, Smartphone } from "lucide-react";

export default function AppServiceHub({ context, goPage }: PageProps) {
  const store = useAppStore();
  const myAfterSales = store.afterSales.filter((a) => a.userId === context.currentUserId);
  const activeAfterSales = myAfterSales.filter(
    (a) => !["已完成", "已关闭"].includes(a.status)
  );

  const services = [
    {
      id: "after-sales",
      icon: RotateCcw,
      bgClass: "bg-rose-50",
      iconColor: "text-rose-500",
      label: "售后服务",
      desc: "退款/退货/换货申请，进度查询",
      detail: "支持退款、退货、换货申请，24小时内商家响应",
      count: activeAfterSales.length > 0 ? `${activeAfterSales.length}个进行中` : undefined,
    },
    {
      id: "stores",
      icon: Store,
      bgClass: "bg-blue-50",
      iconColor: "text-blue-500",
      label: "门店服务",
      desc: "附近门店信息查询，到店预约",
      detail: "查询最近门店，预约到店体验与核销服务",
    },
    {
      id: "courses",
      icon: GraduationCap,
      bgClass: "bg-violet-50",
      iconColor: "text-violet-500",
      label: "课程学习",
      desc: "已购课程查看，课件回放学习",
      detail: "支持回放、倍速播放和下载，有效期365天",
    },
    {
      id: "health",
      icon: Heart,
      bgClass: "bg-emerald-50",
      iconColor: "text-emerald-500",
      label: "大健康",
      desc: "健康科普咨询，产品说明查询",
      detail: "AI健康科普和生活方式建议，非医疗诊断",
    },
    {
      id: "after-sales-progress",
      icon: Wrench,
      bgClass: "bg-amber-50",
      iconColor: "text-amber-500",
      label: "售后进度",
      desc: "查看售后申请处理状态",
      detail: myAfterSales.length > 0
        ? `共 ${myAfterSales.length} 条售后记录，${activeAfterSales.length} 个处理中`
        : "暂无售后记录",
      count: myAfterSales.length > 0 ? `${myAfterSales.length}条记录` : undefined,
    },
    {
      id: "profile",
      icon: Crown,
      bgClass: "bg-purple-50",
      iconColor: "text-purple-500",
      label: "会员专属",
      desc: "查看会员等级权益与福利",
      detail: "黄金会员专属优惠、优先客服、积分兑换等多重权益",
    },
    {
      id: "web-sdk-preview",
      icon: Smartphone,
      bgClass: "bg-sky-50",
      iconColor: "text-sky-500",
      label: "H5 SDK预览",
      desc: "模拟网页嵌入AI客服组件",
      detail: "模拟H5网页嵌入AI客服聊天组件，支持商品详情页和订单详情页切换，查看SDK集成效果",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-4">我的服务</h1>
      <div className="grid grid-cols-2 gap-3">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <button
              key={svc.id}
              type="button"
              onClick={() => {
                if (svc.id === "after-sales-progress") {
                  goPage?.("after-sales");
                } else {
                  goPage?.(svc.id);
                }
              }}
              className="rounded-xl bg-white p-8 shadow-sm border border-slate-100 text-left hover:shadow-md transition-shadow"
            >
              <div className={`w-11 h-11 rounded-xl ${svc.bgClass} flex items-center justify-center mb-3`}>
                <Icon size={22} className={svc.iconColor} />
              </div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-semibold text-slate-800">{svc.label}</h3>
                {svc.count && (
                  <span className="inline-flex rounded-full bg-slate-100 px-1.5 py-0.5 text-base font-medium text-slate-500">
                    {svc.count}
                  </span>
                )}
              </div>
              <p className="text-base text-slate-400 mb-2 leading-relaxed">{svc.detail}</p>
              <span className="inline-flex items-center gap-0.5 text-base text-blue-600 font-medium">
                查看详情 <ChevronRight size={14} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
