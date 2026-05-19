import type { PageProps, Portal } from "../types";

// APP pages
import AppHome from "../pages/app/AppHome";
import AppAiService from "../pages/app/AppAiService";
import AppOrders from "../pages/app/AppOrders";
import AppAfterSales from "../pages/app/AppAfterSales";
import AppStores from "../pages/app/AppStores";
import AppCourses from "../pages/app/AppCourses";
import AppHealth from "../pages/app/AppHealth";
import AppProfile from "../pages/app/AppProfile";
import AppServiceHub from "../pages/app/AppServiceHub";
import AppWebSdkPreview from "../pages/app/AppWebSdkPreview";

// Tenant pages
import TenantDashboard from "../pages/tenant/TenantDashboard";
import CustomerServiceWorkbench from "../pages/tenant/CustomerServiceWorkbench";
import ConversationManagement from "../pages/tenant/ConversationManagement";
import TicketCenter from "../pages/tenant/TicketCenter";
import KnowledgeBase from "../pages/tenant/KnowledgeBase";
import TenantRagTrace from "../pages/tenant/TenantRagTrace";
import RobotConfig from "../pages/tenant/RobotConfig";
import ServiceMaterials from "../pages/tenant/ServiceMaterials";
import TenantRiskControl from "../pages/tenant/TenantRiskControl";
import QualityInspection from "../pages/tenant/QualityInspection";
import TenantAnalytics from "../pages/tenant/TenantAnalytics";
import CustomerServiceTeam from "../pages/tenant/CustomerServiceTeam";
import TenantSettings from "../pages/tenant/TenantSettings";
import CourseMaterials from "../pages/tenant/CourseMaterials";
import StoreServiceMaterials from "../pages/tenant/StoreServiceMaterials";
import ServicePolicy from "../pages/tenant/ServicePolicy";
import LiveScript from "../pages/tenant/LiveScript";
import TenantChannelConfig from "../pages/tenant/TenantChannelConfig";
import TenantRolePermission from "../pages/tenant/TenantRolePermission";
import TenantAuditLog from "../pages/tenant/TenantAuditLog";

// Platform pages
import PlatformDashboard from "../pages/platform/PlatformDashboard";
import TenantManagement from "../pages/platform/TenantManagement";
import MerchantManagement from "../pages/platform/MerchantManagement";
import PackageBilling from "../pages/platform/PackageBilling";
import PlatformKnowledgeBase from "../pages/platform/PlatformKnowledgeBase";
import PromptManagement from "../pages/platform/PromptManagement";
import ModelConfig from "../pages/platform/ModelConfig";
import RagVectorMonitor from "../pages/platform/RagVectorMonitor";
import GlobalRiskControl from "../pages/platform/GlobalRiskControl";
import PlatformServiceWorkbench from "../pages/platform/PlatformServiceWorkbench";
import EvaluationCenter from "../pages/platform/EvaluationCenter";
import OpsMonitor from "../pages/platform/OpsMonitor";
import PlatformSettings from "../pages/platform/PlatformSettings";
import PlatformAuditLog from "../pages/platform/PlatformAuditLog";
import RateLimitRules from "../pages/platform/RateLimitRules";
import DataRetention from "../pages/platform/DataRetention";
import PlatformRolePermission from "../pages/platform/PlatformRolePermission";
import PlatformChannelConfig from "../pages/platform/PlatformChannelConfig";
import GlobalParams from "../pages/platform/GlobalParams";

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
  "web-sdk-preview": AppWebSdkPreview,
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

export const pageMap: Record<Portal, Record<string, React.ComponentType<PageProps>>> = {
  app: appPages,
  tenant: tenantPages,
  platform: platformPages,
};

export const portalDefaults: Record<Portal, string> = {
  app: "app-home",
  tenant: "tenant-dashboard",
  platform: "platform-dashboard",
};

export const sidebarCategoryMap: Record<Portal, import("../types").SidebarCategory[]> = {
  app: [],
  tenant: [],
  platform: [],
};
