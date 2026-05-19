import type { SidebarCategory } from "../types";

export const appMenus = [
  { id: "app-home", label: "首页" },
  { id: "ai-service", label: "AI客服" },
  { id: "orders", label: "订单" },
  { id: "app-service", label: "服务" },
  { id: "profile", label: "我的" },
];

export const tenantSidebarCategories: SidebarCategory[] = [
  {
    id: "cat-workbench", label: "工作台", iconName: "LayoutDashboard",
    children: [{ id: "tenant-dashboard", label: "经营概览" }],
  },
  {
    id: "cat-service", label: "客服中心", iconName: "Headset",
    children: [
      { id: "service-workbench", label: "人工客服工作台" },
      { id: "conversation-management", label: "会话管理" },
      { id: "ticket-center", label: "工单中心" },
      { id: "customer-service-team", label: "客服团队管理" },
    ],
  },
  {
    id: "cat-ai", label: "AI能力中心", iconName: "Cpu",
    children: [
      { id: "robot-config", label: "AI机器人配置" },
      { id: "tenant-rag-trace", label: "RAG链路追踪" },
      { id: "knowledge-base", label: "知识库管理" },
    ],
  },
  {
    id: "cat-materials", label: "业务资料中心", iconName: "FolderOpen",
    children: [
      { id: "service-materials", label: "商品客服资料" },
      { id: "course-materials", label: "课程客服资料" },
      { id: "store-service-materials", label: "门店客服资料" },
      { id: "service-policy", label: "售后政策" },
      { id: "live-script", label: "直播话术" },
    ],
  },
  {
    id: "cat-risk", label: "风控与质检", iconName: "Shield",
    children: [
      { id: "tenant-risk", label: "风控与大健康合规" },
      { id: "quality-inspection", label: "质检中心" },
    ],
  },
  {
    id: "cat-data", label: "数据中心", iconName: "BarChart3",
    children: [{ id: "tenant-analytics", label: "数据分析" }],
  },
  {
    id: "cat-settings", label: "系统设置", iconName: "Settings",
    children: [
      { id: "tenant-settings", label: "租户设置" },
      { id: "tenant-channel-config", label: "渠道配置" },
      { id: "tenant-role-permission", label: "角色权限" },
      { id: "tenant-audit-log", label: "操作日志" },
    ],
  },
];

export const platformSidebarCategories: SidebarCategory[] = [
  {
    id: "cat-platform-overview", label: "平台总览", iconName: "LayoutDashboard",
    children: [{ id: "platform-dashboard", label: "平台经营概览" }],
  },
  {
    id: "cat-customer-assets", label: "客户资产", iconName: "Building2",
    children: [
      { id: "tenant-management", label: "租户管理" },
      { id: "merchant-management", label: "商家管理" },
      { id: "package-billing", label: "套餐与计费" },
    ],
  },
  {
    id: "cat-ai-platform", label: "AI能力平台", iconName: "Cpu",
    children: [
      { id: "platform-knowledge", label: "平台知识库" },
      { id: "prompt-management", label: "全局Prompt管理" },
      { id: "model-config", label: "模型配置" },
      { id: "rag-vector-monitor", label: "RAG与向量库监控" },
    ],
  },
  {
    id: "cat-risk-eval", label: "风控与评测", iconName: "ClipboardCheck",
    children: [
      { id: "global-risk", label: "全局风控中心" },
      { id: "evaluation-center", label: "质检与评测中心" },
    ],
  },
  {
    id: "cat-platform-service", label: "平台客服", iconName: "Users",
    children: [{ id: "platform-service", label: "平台客服工作台" }],
  },
  {
    id: "cat-ops", label: "运维与安全", iconName: "MonitorCog",
    children: [
      { id: "ops-monitor", label: "运维监控" },
      { id: "platform-audit-log", label: "审计日志" },
      { id: "rate-limit-rules", label: "限流规则" },
      { id: "data-retention", label: "数据保留策略" },
    ],
  },
  {
    id: "cat-platform-settings", label: "系统设置", iconName: "Settings",
    children: [
      { id: "platform-settings", label: "系统设置" },
      { id: "platform-role-permission", label: "平台角色权限" },
      { id: "platform-channel-config", label: "渠道配置" },
      { id: "global-params", label: "全局参数配置" },
    ],
  },
];
