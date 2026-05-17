import type { PageProps } from "../../types";
import { RotateCcw, Store, GraduationCap, Heart } from "lucide-react";

const services = [
  {
    id: "after-sales",
    icon: RotateCcw,
    bgClass: "bg-rose-50",
    iconColor: "text-rose-500",
    label: "售后服务",
    desc: "退款/退货/换货申请，进度查询",
  },
  {
    id: "stores",
    icon: Store,
    bgClass: "bg-blue-50",
    iconColor: "text-blue-500",
    label: "门店服务",
    desc: "附近门店信息查询，到店预约",
  },
  {
    id: "courses",
    icon: GraduationCap,
    bgClass: "bg-violet-50",
    iconColor: "text-violet-500",
    label: "课程学习",
    desc: "已购课程查看，课件回放学习",
  },
  {
    id: "health",
    icon: Heart,
    bgClass: "bg-emerald-50",
    iconColor: "text-emerald-500",
    label: "大健康",
    desc: "健康科普咨询，产品说明查询",
  },
];

export default function AppServiceHub({ goPage }: PageProps) {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold text-slate-800 mb-4">我的服务</h1>
      <div className="grid grid-cols-2 gap-4 p-4">
        {services.map((svc) => {
          const Icon = svc.icon;
          return (
            <button
              key={svc.id}
              type="button"
              onClick={() => goPage?.(svc.id)}
              className="rounded-2xl bg-white p-5 shadow-sm border border-slate-100 text-left hover:shadow-md transition-shadow"
            >
              <div className={`w-11 h-11 rounded-xl ${svc.bgClass} flex items-center justify-center mb-3`}>
                <Icon size={22} className={svc.iconColor} />
              </div>
              <h3 className="text-base font-semibold text-slate-800 mb-1">{svc.label}</h3>
              <p className="text-sm text-slate-400">{svc.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
