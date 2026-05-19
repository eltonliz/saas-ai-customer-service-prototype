import { useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { Layout } from "./components/Layout";
import { AppStoreProvider, useAppStore } from "./data/AppStore";
import type { AppContextValue, NavigationParams, Portal } from "./types";
import { tenantSidebarCategories, platformSidebarCategories } from "./config/sidebar";
import { pageMap, portalDefaults } from "./config/routes";

const sidebarCategoryMap: Record<Portal, typeof tenantSidebarCategories> = {
  app: [],
  tenant: tenantSidebarCategories,
  platform: platformSidebarCategories,
};

function AppInner() {
  const [portal, setPortal] = useState<Portal>("tenant");
  const [pageId, setPageId] = useState(portalDefaults.tenant);
  const [navigationParams, setNavigationParams] = useState<NavigationParams>({});

  const { appContext } = useAppStore();

  const context: AppContextValue = useMemo(
    () => ({ portal, ...appContext }),
    [appContext, portal],
  );

  function handlePortalChange(nextPortal: Portal) {
    setPortal(nextPortal);
    setPageId(portalDefaults[nextPortal]);
    setNavigationParams({});
  }

  function handlePageChange(nextPageId: string, params?: NavigationParams) {
    setPageId(nextPageId);
    setNavigationParams(params ?? {});
  }

  const sidebarCategories = sidebarCategoryMap[portal];
  const PageComponent = pageMap[portal][pageId] ?? pageMap[portal][portalDefaults[portal]];

  if (portal === "app") {
    return (
      <AppShell pageId={pageId} onPageChange={handlePageChange} onPortalChange={handlePortalChange}>
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
