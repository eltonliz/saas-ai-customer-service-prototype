import { useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { Layout } from "./components/Layout";
import { AppStoreProvider, useAppStore } from "./data/AppStore";
import type { AppContextValue, MenuItem, NavigationParams, PageProps, Portal, SidebarCategory } from "./types";

// APP pages
import AppHome from "./pages/app/AppHome";
import AppAiService from "./pages/app/AppAiService";
import AppOrders from "./pages/app/AppOrders";
import AppAfterSales from "./pages/app/AppAfterSales";
import AppStores from "./pages/app/AppStores";
import AppCourses from "./pages/app/AppCourses";
import AppHealth from "./pages/app/AppHealth";
import AppProfile from "./pages/app/AppProfile";
import AppServiceHub from "./pages/app/AppServiceHub";
import AppWebSdkPreview from "./pages/app/AppWebSdkPreview";

// Tenant pages
import TenantDashboard from "./pages/tenant/TenantDashboard";
import CustomerServiceWorkbench from "./pages/tenant/CustomerServiceWorkbench";
import ConversationManagement from "./pages/tenant/ConversationManagement";
import TicketCenter from "./pages/tenant/TicketCenter";
import KnowledgeBase from "./pages/tenant/KnowledgeBase";
import TenantRagTrace from "./pages/tenant/TenantRagTrace";
import RobotConfig from "./pages/tenant/RobotConfig";
import ServiceMaterials from "./pages/tenant/ServiceMaterials";
import TenantRiskControl from "./pages/tenant/TenantRiskControl";
import QualityInspection from "./pages/tenant/QualityInspection";
import TenantAnalytics from "./pages/tenant/TenantAnalytics";
import CustomerServiceTeam from "./pages/tenant/CustomerServiceTeam";
import TenantSettings from "./pages/tenant/TenantSettings";
import CourseMaterials from "./pages/tenant/CourseMaterials";
import StoreServiceMaterials from "./pages/tenant/StoreServiceMaterials";
import ServicePolicy from "./pages/tenant/ServicePolicy";
import LiveScript from "./pages/tenant/LiveScript";
import TenantChannelConfig from "./pages/tenant/TenantChannelConfig";
import TenantRolePermission from "./pages/tenant/TenantRolePermission";
import TenantAuditLog from "./pages/tenant/TenantAuditLog";

// Platform pages
import PlatformDashboard from "./pages/platform/PlatformDashboard";
import TenantManagement from "./pages/platform/TenantManagement";
import MerchantManagement from "./pages/platform/MerchantManagement";
import PackageBilling from "./pages/platform/PackageBilling";
import PlatformKnowledgeBase from "./pages/platform/PlatformKnowledgeBase";
import PromptManagement from "./pages/platform/PromptManagement";
import ModelConfig from "./pages/platform/ModelConfig";
import RagVectorMonitor from "./pages/platform/RagVectorMonitor";
import GlobalRiskControl from "./pages/platform/GlobalRiskControl";
import PlatformServiceWorkbench from "./pages/platform/PlatformServiceWorkbench";
import EvaluationCenter from "./pages/platform/EvaluationCenter";
import OpsMonitor from "./pages/platform/OpsMonitor";
import PlatformSettings from "./pages/platform/PlatformSettings";
import PlatformAuditLog from "./pages/platform/PlatformAuditLog";
import RateLimitRules from "./pages/platform/RateLimitRules";
import DataRetention from "./pages/platform/DataRetention";
import PlatformRolePermission from "./pages/platform/PlatformRolePermission";
import PlatformChannelConfig from "./pages/platform/PlatformChannelConfig";
import GlobalParams from "./pages/platform/GlobalParams";

const appMenus: MenuItem[] = [
  { id: "app-home", label: "首页" },
  { id: "ai-service", label: "AI客服" },
  { id: "orders", label: "订单" },
  { id: "app-service", label: "服务" },
  { id: "profile", label: "我的" },
];

const tenantSidebarCategories: SidebarCategory[] = [
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

const platformSidebarCategories: SidebarCategory[] = [
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

const defaults: Record<Portal, string> = {
  app: "app-home",
  tenant: "tenant-dashboard",
  platform: "platform-dashboard",
};

const sidebarCategoryMap: Record<Portal, SidebarCategory[]> = {
  app: [],
  tenant: tenantSidebarCategories,
  platform: platformSidebarCategories,
};

const appPages: Record<string, React.ComponentType<PageProps>> = {
  "app-home": AppHome,
  "ai-service": AppAiService,
  "orders": AppOrders,
  "after-sales": AppAfterSales,
  "stores": AppStores,
  "courses": AppCourses,
  "health": AppHealth,
  "profile": AppProfile,
  "app-service": AppServiceHub,
  "web-sdk-preview": AppWebSdkPreview
};

const tenantPages: Record<string, React.ComponentType<PageProps>> = {
  "tenant-dashboard": TenantDashboard,
  "service-workbench": CustomerServiceWorkbench,
  "conversation-management": ConversationManagement,
  "ticket-center": TicketCenter,
  "knowledge-base": KnowledgeBase,
  "tenant-rag-trace": TenantRagTrace,
  "robot-config": RobotConfig,
  "service-materials": ServiceMaterials,
  "tenant-risk": TenantRiskControl,
  "quality-inspection": QualityInspection,
  "tenant-analytics": TenantAnalytics,
  "customer-service-team": CustomerServiceTeam,
  "tenant-settings": TenantSettings,
  "course-materials": CourseMaterials,
  "store-service-materials": StoreServiceMaterials,
  "service-policy": ServicePolicy,
  "live-script": LiveScript,
  "tenant-channel-config": TenantChannelConfig,
  "tenant-role-permission": TenantRolePermission,
  "tenant-audit-log": TenantAuditLog,
};

const platformPages: Record<string, React.ComponentType<PageProps>> = {
  "platform-dashboard": PlatformDashboard,
  "tenant-management": TenantManagement,
  "merchant-management": MerchantManagement,
  "package-billing": PackageBilling,
  "platform-knowledge": PlatformKnowledgeBase,
  "prompt-management": PromptManagement,
  "model-config": ModelConfig,
  "rag-vector-monitor": RagVectorMonitor,
  "global-risk": GlobalRiskControl,
  "platform-service": PlatformServiceWorkbench,
  "evaluation-center": EvaluationCenter,
  "ops-monitor": OpsMonitor,
  "platform-settings": PlatformSettings,
  "platform-audit-log": PlatformAuditLog,
  "rate-limit-rules": RateLimitRules,
  "data-retention": DataRetention,
  "platform-role-permission": PlatformRolePermission,
  "platform-channel-config": PlatformChannelConfig,
  "global-params": GlobalParams,
};

const pageMap: Record<Portal, Record<string, React.ComponentType<PageProps>>> = {
  app: appPages,
  tenant: tenantPages,
  platform: platformPages,
};

function AppInner() {
  const [portal, setPortal] = useState<Portal>("tenant");
  const [pageId, setPageId] = useState(defaults.tenant);
  const [navigationParams, setNavigationParams] = useState<NavigationParams>({});

  const { appContext } = useAppStore();

  const context: AppContextValue = useMemo(
    () => ({
      portal,
      ...appContext,
    }),
    [appContext, portal],
  );

  function handlePortalChange(nextPortal: Portal) {
    setPortal(nextPortal);
    setPageId(defaults[nextPortal]);
    setNavigationParams({});
  }

  function handlePageChange(nextPageId: string, params?: NavigationParams) {
    setPageId(nextPageId);
    setNavigationParams(params ?? {});
  }

  const sidebarCategories = sidebarCategoryMap[portal];
  const PageComponent = pageMap[portal][pageId] ?? pageMap[portal][defaults[portal]];

  if (portal === "app") {
    return (
      <AppShell pageId={pageId} menus={appMenus} onPageChange={handlePageChange} onPortalChange={handlePortalChange}>
        <PageComponent context={context} goPage={handlePageChange} navigationParams={navigationParams} />
      </AppShell>
    );
  }

  return (
    <Layout portal={portal} pageId={pageId} sidebarCategories={sidebarCategories} onPageChange={handlePageChange} onPortalChange={handlePortalChange}>
      <PageComponent context={context} goPage={handlePageChange} navigationParams={navigationParams} />
    </Layout>
  );
}

export default function App() {
  return (
    <AppStoreProvider>
      <AppInner />
    </AppStoreProvider>
  );
}
