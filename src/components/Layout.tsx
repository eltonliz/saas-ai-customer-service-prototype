import type { ReactNode } from "react";
import type { Portal, SidebarCategory } from "../types";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { TenantServiceContextBar } from "./TenantServiceContextBar";
import { AdminHelpWidget } from "./AdminHelpWidget";

interface LayoutProps {
  portal: Portal;
  pageId: string;
  sidebarCategories: SidebarCategory[];
  onPageChange: (pageId: string) => void;
  onPortalChange: (portal: Portal) => void;
  children: ReactNode;
}

export function Layout({ portal, pageId, sidebarCategories, onPageChange, onPortalChange, children }: LayoutProps) {
  const sideTitle = portal === "tenant" ? "租户后台" : "平台管理";
  return (
    <div className="min-h-screen bg-slate-50">
      <Header portal={portal} onPortalChange={onPortalChange} />
      <div className="flex">
        <Sidebar categories={sidebarCategories} active={pageId} onChange={onPageChange} title={sideTitle} />
        <main className="min-w-0 flex-1 p-8">
          {portal === "tenant" && <TenantServiceContextBar />}
          {children}
        </main>
      </div>
      {(portal === "tenant" || portal === "platform") && <AdminHelpWidget />}
    </div>
  );
}
