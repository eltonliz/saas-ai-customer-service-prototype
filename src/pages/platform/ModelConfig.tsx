import { useState } from "react";
import type { PageProps } from "../../types";
import { modelCallLogs } from "../../data/mockData";
import { DataTable } from "../../components/DataTable";
import { StatusBadge } from "../../components/StatusBadge";
import { Modal } from "../../components/Modal";
import { Settings, Route, BarChart3, Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

interface Provider {
  id: string;
  name: string;
  models: string[];
  status: string;
  temp: number;
  topP: number;
  maxTokens: number;
  costPer1kTokens: number;
  timeout: number;
  fallback: string;
  apiEndpoint: string;
  apiKey: string;
}

interface RouteItem {
  scene: string;
  model: string;
  priority: string;
}

export default function ModelConfig({}: PageProps) {
  const [providers, setProviders] = useState<Provider[]>([
    {
      id: "p1", name: "Anthropic", models: ["Claude Opus 4.7", "Claude Sonnet 4.6"], status: "启用",
      temp: 0.7, topP: 0.9, maxTokens: 4096, costPer1kTokens: 0.015, timeout: 10000, fallback: "Claude Sonnet 4.6",
      apiEndpoint: "https://api.anthropic.com", apiKey: "sk-ant-***",
    },
  ]);
  const [routes, setRoutes] = useState<RouteItem[]>([
    { scene: "FAQ匹配", model: "Claude Opus 4.7", priority: "优先" },
    { scene: "RAG检索增强", model: "Claude Opus 4.7", priority: "优先" },
    { scene: "工具调用", model: "Claude Sonnet 4.6", priority: "优先" },
    { scene: "大健康风控", model: "Claude Opus 4.7", priority: "优先" },
  ]);

  // Provider modals
  const [editModal, setEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ temp: 0.7, topP: 0.9, maxTokens: 4096, costPer1kTokens: 0.015, timeout: 10000, fallback: "Claude Sonnet 4.6" });
  const [createProviderModal, setCreateProviderModal] = useState(false);
  const [providerForm, setProviderForm] = useState({ name: "", apiEndpoint: "", apiKey: "", models: "" });
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);
  const [editProviderModal, setEditProviderModal] = useState(false);
  const [editProviderForm, setEditProviderForm] = useState({ name: "", apiEndpoint: "", apiKey: "", models: "" });

  // Route modals
  const [createRouteModal, setCreateRouteModal] = useState(false);
  const [routeForm, setRouteForm] = useState({ scene: "", model: "", priority: "优先" });
  const [editingRoute, setEditingRoute] = useState<RouteItem | null>(null);
  const [editRouteModal, setEditRouteModal] = useState(false);
  const [editRouteForm, setEditRouteForm] = useState({ scene: "", model: "", priority: "优先" });

  function handleCreateProvider() {
    if (!providerForm.name.trim()) return;
    setProviders((prev) => [
      ...prev,
      {
        id: `provider-new-${Date.now()}`,
        name: providerForm.name,
        models: providerForm.models ? providerForm.models.split(",").map((s) => s.trim()) : [],
        status: "启用",
        temp: 0.7,
        topP: 0.9,
        maxTokens: 4096,
        costPer1kTokens: 0.015,
        timeout: 10000,
        fallback: "",
        apiEndpoint: providerForm.apiEndpoint,
        apiKey: providerForm.apiKey,
      },
    ]);
    setCreateProviderModal(false);
    setProviderForm({ name: "", apiEndpoint: "", apiKey: "", models: "" });
  }

  function openEditProvider(provider: Provider) {
    setEditingProvider(provider);
    setEditProviderForm({
      name: provider.name,
      apiEndpoint: provider.apiEndpoint,
      apiKey: provider.apiKey,
      models: provider.models.join(", "),
    });
    setEditProviderModal(true);
  }

  function handleEditProvider() {
    if (!editingProvider || !editProviderForm.name.trim()) return;
    setProviders((prev) =>
      prev.map((p) =>
        p.id === editingProvider.id
          ? {
              ...p,
              name: editProviderForm.name,
              apiEndpoint: editProviderForm.apiEndpoint,
              apiKey: editProviderForm.apiKey,
              models: editProviderForm.models ? editProviderForm.models.split(",").map((s) => s.trim()) : p.models,
            }
          : p,
      ),
    );
    setEditProviderModal(false);
    setEditingProvider(null);
  }

  function handleDeleteProvider(id: string) {
    setProviders((prev) => prev.filter((p) => p.id !== id));
  }

  function handleCreateRoute() {
    if (!routeForm.scene.trim()) return;
    setRoutes((prev) => [
      ...prev,
      { scene: routeForm.scene, model: routeForm.model || "Claude Opus 4.7", priority: routeForm.priority },
    ]);
    setCreateRouteModal(false);
    setRouteForm({ scene: "", model: "", priority: "优先" });
  }

  function openEditRoute(route: RouteItem) {
    setEditingRoute(route);
    setEditRouteForm({ scene: route.scene, model: route.model, priority: route.priority });
    setEditRouteModal(true);
  }

  function handleEditRoute() {
    if (!editingRoute || !editRouteForm.scene.trim()) return;
    setRoutes((prev) =>
      prev.map((r) =>
        r.scene === editingRoute.scene
          ? { scene: editRouteForm.scene, model: editRouteForm.model, priority: editRouteForm.priority }
          : r,
      ),
    );
    setEditRouteModal(false);
    setEditingRoute(null);
  }

  function handleDeleteRoute(scene: string) {
    setRoutes((prev) => prev.filter((r) => r.scene !== scene));
  }

  const allReqs = reqs.ModelConfig.flatMap(r => r.reqs);

  return (
    <div className="relative">
      {allReqs.map((req, i) => (<RequirementBadge key={req.id} req={req} index={i} />))}
      <h2 className="text-2xl font-bold text-slate-900 mb-4">模型配置</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Providers */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Settings size={16} className="text-blue-500" />模型供应商
            </h3>
            <button
              type="button"
              onClick={() => setCreateProviderModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-base font-medium text-white hover:bg-blue-700"
            >
              <Plus size={14} />新增供应商
            </button>
          </div>
          {providers.map((p) => (
            <div key={p.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3 mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-base font-medium text-slate-700">{p.name}</span>
                <div className="flex items-center gap-2">
                  <StatusBadge status={p.status} />
                  <button
                    type="button"
                    onClick={() => setProviders(prev => prev.map(pp => pp.id === p.id ? { ...pp, status: pp.status === "启用" ? "已停用" : "启用" } : pp))}
                    className={`rounded-lg px-3 py-1 text-base font-medium ${p.status === "启用" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}
                  >
                    {p.status === "启用" ? "停用" : "启用"}
                  </button>
                </div>
              </div>
              <p className="text-base text-slate-500">模型: {p.models.join("、")}</p>
              <p className="text-base text-slate-500">温度: {p.temp} · top_p: {p.topP} · 最大输出: {p.maxTokens} · 成本: ${p.costPer1kTokens}/1k tokens · 超时: {p.timeout}ms · 降级: {p.fallback}</p>
              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setEditModal(true)}
                  className="rounded-lg border border-blue-200 px-3 py-1 text-base text-blue-600 hover:bg-blue-50"
                >
                  编辑参数
                </button>
                <button
                  type="button"
                  onClick={() => openEditProvider(p)}
                  className="flex items-center gap-0.5 rounded-lg border border-slate-200 px-3 py-1 text-base text-slate-500 hover:bg-slate-100"
                >
                  <Pencil size={12} />编辑
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteProvider(p.id)}
                  className="flex items-center gap-0.5 rounded-lg border border-red-200 px-3 py-1 text-base text-red-500 hover:bg-red-50"
                >
                  <Trash2 size={12} />删除
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Routes */}
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-slate-700 flex items-center gap-2">
              <Route size={16} className="text-indigo-500" />模型路由策略
            </h3>
            <button
              type="button"
              onClick={() => setCreateRouteModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-base font-medium text-white hover:bg-blue-700"
            >
              <Plus size={14} />新增路由
            </button>
          </div>
          <div className="space-y-2">
            {routes.map((r) => (
              <div key={r.scene} className="rounded-lg border border-slate-100 px-3 py-2 text-base">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">{r.scene}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{r.model}</span>
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-blue-600">{r.priority}</span>
                    <button
                      type="button"
                      onClick={() => openEditRoute(r)}
                      className="flex items-center gap-0.5 rounded border border-slate-200 px-1.5 py-0.5 text-base text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    >
                      <Pencil size={10} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteRoute(r.scene)}
                      className="flex items-center gap-0.5 rounded border border-red-200 px-1.5 py-0.5 text-base text-red-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-base text-slate-400 mt-1">
                  <span>失败率: {((Math.random() * 5)).toFixed(1)}%</span>
                  <span>调用: {Math.floor(Math.random() * 500 + 100)}次</span>
                  <span>成本: ${(Math.random() * 0.5 + 0.1).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 降级策略配置 */}
      <div className="rounded-xl border border-slate-200 bg-white p-8 mb-6">
        <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />降级策略配置
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">最大重试次数</label>
            <input type="number" defaultValue={3} min={0} max={5} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none" />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">超时降级阈值 (ms)</label>
            <input type="number" defaultValue={15000} min={1000} step={1000} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none" />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">降级策略</label>
            <select defaultValue="超时降级" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none">
              <option>超时降级</option><option>错误率降级</option><option>手动降级</option><option>按优先级降级</option>
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">降级模型</label>
            <select defaultValue="Claude Sonnet 4.6" className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none">
              <option>Claude Opus 4.7</option><option>Claude Sonnet 4.6</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-8">
        <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <BarChart3 size={16} className="text-slate-500" />模型调用日志
        </h3>
        <DataTable
          data={modelCallLogs}
          rowKey={(r) => r.id}
          columns={[
            { key: "scene", header: "场景", render: (r) => <span className="text-base">{r.scene}</span> },
            { key: "model", header: "模型", render: (r) => <span className="text-base">{r.model}</span> },
            { key: "status", header: "状态", render: (r) => <StatusBadge status={r.status} /> },
            { key: "latency", header: "延迟", render: (r) => <span className="text-base">{r.latency}ms</span> },
            { key: "token", header: "Token", render: (r) => <span className="text-base">{r.tokenCost}</span> },
            { key: "cost", header: "费用", render: (r) => <span className="text-base">${r.cost.toFixed(3)}</span> },
            { key: "time", header: "时间", render: (r) => <span className="text-base text-slate-400">{r.createdAt}</span> },
          ]}
        />
      </div>

      {/* Provider Params Edit Modal */}
      <Modal open={editModal} title="编辑模型参数" onClose={() => setEditModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">温度</label>
            <input
              type="range" min="0" max="1" step="0.1"
              value={editForm.temp}
              onChange={(e) => setEditForm((f) => ({ ...f, temp: +e.target.value }))}
              className="w-full"
            />
            <span className="text-base text-slate-400">{editForm.temp}</span>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">Top P</label>
            <input
              type="range" min="0" max="1" step="0.05"
              value={editForm.topP}
              onChange={(e) => setEditForm((f) => ({ ...f, topP: +e.target.value }))}
              className="w-full"
            />
            <span className="text-base text-slate-400">{editForm.topP}</span>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">最大输出长度</label>
            <input
              type="number"
              value={editForm.maxTokens}
              onChange={(e) => setEditForm((f) => ({ ...f, maxTokens: +e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">成本 ($/1k tokens)</label>
            <input
              type="number"
              step="0.001"
              value={editForm.costPer1kTokens}
              onChange={(e) => setEditForm((f) => ({ ...f, costPer1kTokens: +e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">超时时间 (ms)</label>
            <input
              type="number"
              value={editForm.timeout}
              onChange={(e) => setEditForm((f) => ({ ...f, timeout: +e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">降级模型</label>
            <select
              value={editForm.fallback}
              onChange={(e) => setEditForm((f) => ({ ...f, fallback: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            >
              {["Claude Opus 4.7","Claude Sonnet 4.6"].map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setEditModal(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={() => {
            setProviders(prev => prev.map((p, i) => i === 0 ? { ...p, temp: editForm.temp, topP: editForm.topP, maxTokens: editForm.maxTokens, costPer1kTokens: editForm.costPer1kTokens, timeout: editForm.timeout, fallback: editForm.fallback } : p));
            setEditModal(false);
          }} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">保存</button>
        </div>
      </Modal>

      {/* Create Provider Modal */}
      <Modal open={createProviderModal} title="新增供应商" onClose={() => setCreateProviderModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">供应商名称</label>
            <input
              value={providerForm.name}
              onChange={(e) => setProviderForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="如：OpenAI、Anthropic"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">API Endpoint</label>
            <input
              value={providerForm.apiEndpoint}
              onChange={(e) => setProviderForm((f) => ({ ...f, apiEndpoint: e.target.value }))}
              placeholder="https://api.example.com"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">API Key</label>
            <input
              value={providerForm.apiKey}
              onChange={(e) => setProviderForm((f) => ({ ...f, apiKey: e.target.value }))}
              placeholder="sk-***"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">模型列表（逗号分隔）</label>
            <input
              value={providerForm.models}
              onChange={(e) => setProviderForm((f) => ({ ...f, models: e.target.value }))}
              placeholder="model-a, model-b"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setCreateProviderModal(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleCreateProvider} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">创建</button>
        </div>
      </Modal>

      {/* Edit Provider Modal */}
      <Modal open={editProviderModal} title="编辑供应商" onClose={() => setEditProviderModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">供应商名称</label>
            <input
              value={editProviderForm.name}
              onChange={(e) => setEditProviderForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">API Endpoint</label>
            <input
              value={editProviderForm.apiEndpoint}
              onChange={(e) => setEditProviderForm((f) => ({ ...f, apiEndpoint: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">API Key</label>
            <input
              value={editProviderForm.apiKey}
              onChange={(e) => setEditProviderForm((f) => ({ ...f, apiKey: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">模型列表（逗号分隔）</label>
            <input
              value={editProviderForm.models}
              onChange={(e) => setEditProviderForm((f) => ({ ...f, models: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setEditProviderModal(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleEditProvider} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">保存</button>
        </div>
      </Modal>

      {/* Create Route Modal */}
      <Modal open={createRouteModal} title="新增路由" onClose={() => setCreateRouteModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">业务场景</label>
            <input
              value={routeForm.scene}
              onChange={(e) => setRouteForm((f) => ({ ...f, scene: e.target.value }))}
              placeholder="如：FAQ匹配"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">模型</label>
            <select
              value={routeForm.model}
              onChange={(e) => setRouteForm((f) => ({ ...f, model: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            >
              <option value="">选择模型</option>
              {["Claude Opus 4.7", "Claude Sonnet 4.6"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">优先级</label>
            <select
              value={routeForm.priority}
              onChange={(e) => setRouteForm((f) => ({ ...f, priority: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            >
              {["优先", "备选", "降级"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setCreateRouteModal(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleCreateRoute} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">创建</button>
        </div>
      </Modal>

      {/* Edit Route Modal */}
      <Modal open={editRouteModal} title="编辑路由" onClose={() => setEditRouteModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">业务场景</label>
            <input
              value={editRouteForm.scene}
              onChange={(e) => setEditRouteForm((f) => ({ ...f, scene: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">模型</label>
            <select
              value={editRouteForm.model}
              onChange={(e) => setEditRouteForm((f) => ({ ...f, model: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            >
              <option value="">选择模型</option>
              {["Claude Opus 4.7", "Claude Sonnet 4.6"].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">优先级</label>
            <select
              value={editRouteForm.priority}
              onChange={(e) => setEditRouteForm((f) => ({ ...f, priority: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            >
              {["优先", "备选", "降级"].map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setEditRouteModal(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleEditRoute} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">保存</button>
        </div>
      </Modal>
    </div>
  );
}
