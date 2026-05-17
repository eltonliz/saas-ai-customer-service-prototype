const colorMap: Record<string, string> = {
  // conversation status
  "已创建": "bg-slate-100 text-slate-600",
  "AI接待中": "bg-blue-50 text-blue-700",
  "等待用户补充": "bg-amber-50 text-amber-700",
  "等待人工接入": "bg-orange-50 text-orange-700",
  "人工接待中": "bg-emerald-50 text-emerald-700",
  "已关联工单": "bg-violet-50 text-violet-700",
  "已解决": "bg-emerald-50 text-emerald-700",
  "已评价": "bg-emerald-100 text-emerald-800",
  "已关闭": "bg-slate-100 text-slate-500",
  "已重开": "bg-amber-100 text-amber-800",
  "已归档": "bg-slate-100 text-slate-400",
  // ticket status
  "草稿": "bg-slate-100 text-slate-500",
  "已提交": "bg-blue-50 text-blue-700",
  "已分配": "bg-indigo-50 text-indigo-700",
  "处理中": "bg-amber-50 text-amber-700",
  "等待外部反馈": "bg-orange-50 text-orange-700",
  "已给出结果": "bg-cyan-50 text-cyan-700",
  "待用户确认": "bg-purple-50 text-purple-700",
  "已升级": "bg-red-50 text-red-700",
  // knowledge doc status
  "解析中": "bg-blue-50 text-blue-700",
  "解析失败": "bg-red-50 text-red-700",
  "切片中": "bg-blue-50 text-blue-700",
  "待审核": "bg-amber-50 text-amber-700",
  "已驳回": "bg-red-50 text-red-700",
  "已发布": "bg-cyan-50 text-cyan-700",
  "索引中": "bg-indigo-50 text-indigo-700",
  "已上线": "bg-emerald-50 text-emerald-700",
  "索引失败": "bg-red-50 text-red-700",
  "已降权": "bg-orange-50 text-orange-700",
  "已过期": "bg-slate-100 text-slate-400",
  "已停用": "bg-slate-100 text-slate-500",
  // agent status
  "在线": "bg-emerald-50 text-emerald-700",
  "忙碌": "bg-amber-50 text-amber-700",
  "离线": "bg-slate-100 text-slate-400",
  "小休": "bg-orange-50 text-orange-700",
  "会议中": "bg-purple-50 text-purple-700",
  // risk
  "低风险": "bg-emerald-50 text-emerald-700",
  "中风险": "bg-amber-50 text-amber-700",
  "高风险": "bg-red-50 text-red-700",
  // priority
  "低": "bg-slate-100 text-slate-500",
  "中": "bg-blue-50 text-blue-700",
  "高": "bg-amber-50 text-amber-700",
  "紧急": "bg-red-50 text-red-700",
  // tenant/merchant
  "启用": "bg-emerald-50 text-emerald-700",
  "停用": "bg-red-50 text-red-700",
  "营业中": "bg-emerald-50 text-emerald-700",
  "暂停服务": "bg-orange-50 text-orange-700",
  // model call
  "成功": "bg-emerald-50 text-emerald-700",
  "失败": "bg-red-50 text-red-700",
  "已降级": "bg-amber-50 text-amber-700",
  // prompt
  "灰度中": "bg-amber-50 text-amber-700",
  // gap
  "待处理": "bg-slate-100 text-slate-600",
  "待生成候选": "bg-blue-50 text-blue-700",
  "已生成候选知识": "bg-violet-50 text-violet-700",
  "追踪中": "bg-indigo-50 text-indigo-700",
  // fallback
  "已通知": "bg-emerald-50 text-emerald-700",
  "未通知": "bg-amber-50 text-amber-700",
  "通知失败": "bg-red-50 text-red-700",
  "仅查询": "bg-blue-50 text-blue-700",
  "无权限": "bg-red-50 text-red-700",
  "拒绝": "bg-red-50 text-red-700",
};

export function StatusBadge({ status }: { status: string }) {
  const cls = colorMap[status] ?? "bg-slate-100 text-slate-600";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-medium ${cls}`}>
      {status}
    </span>
  );
}
