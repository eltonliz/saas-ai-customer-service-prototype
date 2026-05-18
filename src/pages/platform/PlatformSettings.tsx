import { useState } from "react";
import type { PageProps } from "../../types";
import { DataTable } from "../../components/DataTable";
import { Modal } from "../../components/Modal";
import { Users, Globe, FileText, Shield, Clock, Trash2, Sliders, Pencil } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

type Tab = "roles" | "channels" | "audit" | "ratelimit" | "retention" | "privacy" | "params";

interface RoleItem {
  role: string;
  permissions: string;
  users: number;
}

interface ChannelItem {
  name: string;
  status: string;
}

interface RateLimitRule {
  api: string;
  limit: string;
  burst: string;
  perTenant: string;
}

interface RetentionPolicy {
  label: string;
  period: string;
  desc: string;
}

interface ParamItem {
  label: string;
  value: string;
  desc: string;
}

const auditLogs = [
  { id: "log-1", user: "超级管理员-张总", action: "修改租户套餐", target: "知养健康课堂 升级至旗舰版", time: "2026-05-17 10:30", ip: "192.168.1.100" },
  { id: "log-2", user: "算法工程师-李明", action: "发布Prompt版本", target: "系统提示词 v2.3 发布至全平台", time: "2026-05-17 09:45", ip: "192.168.1.101" },
  { id: "log-3", user: "风控专员-王芳", action: "下发风控策略", target: "大健康默认风控策略 -> tenant-3", time: "2026-05-17 09:20", ip: "192.168.1.102" },
  { id: "log-4", user: "平台运营-陈洁", action: "下架知识条目", target: "FAQ-12 因内容过期下架", time: "2026-05-16 18:10", ip: "192.168.1.103" },
  { id: "log-5", user: "运维工程师-赵强", action: "修改限流规则", target: "API限流从500QPS调整至800QPS", time: "2026-05-16 16:45", ip: "192.168.1.104" },
  { id: "log-6", user: "超级管理员-张总", action: "停用租户", target: "测试租户-test-01 已停用", time: "2026-05-16 14:00", ip: "192.168.1.100" },
];

export default function PlatformSettings({}: PageProps) {
  const [tab, setTab] = useState<Tab>("roles");
  const allBadges = reqs.PlatformSettings.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);

  // Roles
  const [roles, setRoles] = useState<RoleItem[]>([
    { role: "超级管理员", permissions: "全部权限", users: 2 },
    { role: "平台运营", permissions: "租户管理、商家管理、知识库管理、工单处理", users: 5 },
    { role: "算法工程师", permissions: "模型配置、Prompt管理、RAG监控、质检评测", users: 3 },
    { role: "风控专员", permissions: "全局风控中心、大健康合规、风控策略下发", users: 2 },
    { role: "运维工程师", permissions: "运维监控、系统设置、告警处理", users: 2 },
  ]);
  const [roleModal, setRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleItem | null>(null);
  const [roleForm, setRoleForm] = useState({ role: "", permissions: "", users: 0 });

  // Channels
  const [channels, setChannels] = useState<ChannelItem[]>([
    { name: "APP", status: "启用" },
    { name: "小程序", status: "启用" },
    { name: "H5", status: "启用" },
    { name: "商家后台", status: "启用" },
    { name: "企业微信", status: "启用" },
    { name: "公众号/微信客服", status: "启用" },
  ]);
  const [channelModal, setChannelModal] = useState(false);
  const [editingChannel, setEditingChannel] = useState<ChannelItem | null>(null);

  // Audit detail
  const [auditDetail, setAuditDetail] = useState<(typeof auditLogs)[0] | null>(null);

  // Rate limit
  const [rateLimits, setRateLimits] = useState<RateLimitRule[]>([
    { api: "AI问答接口", limit: "1000 QPS", burst: "1500 QPS", perTenant: "50 QPS" },
    { api: "RAG检索接口", limit: "2000 QPS", burst: "3000 QPS", perTenant: "100 QPS" },
    { api: "工具调用接口", limit: "500 QPS", burst: "800 QPS", perTenant: "20 QPS" },
    { api: "知识库写入接口", limit: "200 QPS", burst: "400 QPS", perTenant: "10 QPS" },
  ]);
  const [rateLimitModal, setRateLimitModal] = useState(false);
  const [editingRate, setEditingRate] = useState<RateLimitRule | null>(null);
  const [rateForm, setRateForm] = useState({ limit: "", burst: "", perTenant: "" });

  // Retention
  const [retentions, setRetentions] = useState<RetentionPolicy[]>([
    { label: "会话记录", period: "90天", desc: "超过90天的已关闭会话自动归档，归档后保留12个月" },
    { label: "工单记录", period: "180天", desc: "超过180天的已关闭工单自动归档，归档后保留24个月" },
    { label: "RAG链路日志", period: "30天", desc: "链路日志保留30天，聚合统计数据保留12个月" },
    { label: "模型调用日志", period: "60天", desc: "调用日志保留60天，计费数据保留36个月" },
    { label: "审计日志", period: "永久", desc: "审计日志永久保留，不可删除" },
  ]);
  const [retentionModal, setRetentionModal] = useState(false);
  const [editingRetention, setEditingRetention] = useState<RetentionPolicy | null>(null);
  const [retentionForm, setRetentionForm] = useState({ period: "", desc: "" });

  // Params
  const [params, setParams] = useState<ParamItem[]>([
    { label: "AI回复最大Token", value: "2048", desc: "单次AI回复的token上限" },
    { label: "默认RAG召回数量", value: "8", desc: "粗召回阶段的文档片段数量" },
    { label: "默认重排返回数量", value: "3", desc: "重排后入Prompt的片段数量" },
    { label: "风控超时时间", value: "3000ms", desc: "风控审核最大等待时间" },
    { label: "SSE心跳间隔", value: "30s", desc: "服务端推送心跳包间隔" },
    { label: "会话自动关闭", value: "24小时", desc: "无活动会话自动关闭时间" },
  ]);
  const [paramModal, setParamModal] = useState(false);
  const [editingParam, setEditingParam] = useState<ParamItem | null>(null);
  const [paramForm, setParamForm] = useState({ value: "", desc: "" });

  // ---- Role handlers ----
  function openRoleEdit(role: RoleItem) {
    setEditingRole(role);
    setRoleForm({ role: role.role, permissions: role.permissions, users: role.users });
    setRoleModal(true);
  }

  function handleRoleSave() {
    if (!editingRole) return;
    setRoles((prev) =>
      prev.map((r) =>
        r.role === editingRole.role ? { ...r, permissions: roleForm.permissions } : r,
      ),
    );
    setRoleModal(false);
    setEditingRole(null);
  }

  // ---- Channel handlers ----
  function openChannelEdit(ch: ChannelItem) {
    setEditingChannel(ch);
    setChannelModal(true);
  }

  function toggleChannelStatus() {
    if (!editingChannel) return;
    setChannels((prev) =>
      prev.map((c) =>
        c.name === editingChannel.name
          ? { ...c, status: c.status === "启用" ? "停用" : "启用" }
          : c,
      ),
    );
    setChannelModal(false);
    setEditingChannel(null);
  }

  // ---- Rate limit handlers ----
  function openRateEdit(rule: RateLimitRule) {
    setEditingRate(rule);
    setRateForm({ limit: rule.limit, burst: rule.burst, perTenant: rule.perTenant });
    setRateLimitModal(true);
  }

  function handleRateSave() {
    if (!editingRate) return;
    setRateLimits((prev) =>
      prev.map((r) =>
        r.api === editingRate.api
          ? { ...r, limit: rateForm.limit, burst: rateForm.burst, perTenant: rateForm.perTenant }
          : r,
      ),
    );
    setRateLimitModal(false);
    setEditingRate(null);
  }

  // ---- Retention handlers ----
  function openRetentionEdit(r: RetentionPolicy) {
    setEditingRetention(r);
    setRetentionForm({ period: r.period, desc: r.desc });
    setRetentionModal(true);
  }

  function handleRetentionSave() {
    if (!editingRetention) return;
    setRetentions((prev) =>
      prev.map((r) =>
        r.label === editingRetention.label
          ? { ...r, period: retentionForm.period, desc: retentionForm.desc }
          : r,
      ),
    );
    setRetentionModal(false);
    setEditingRetention(null);
  }

  // ---- Param handlers ----
  function openParamEdit(p: ParamItem) {
    setEditingParam(p);
    setParamForm({ value: p.value, desc: p.desc });
    setParamModal(true);
  }

  function handleParamSave() {
    if (!editingParam) return;
    setParams((prev) =>
      prev.map((p) =>
        p.label === editingParam.label
          ? { ...p, value: paramForm.value, desc: paramForm.desc }
          : p,
      ),
    );
    setParamModal(false);
    setEditingParam(null);
  }

  return (
    <div className="platform-settings-page">
      <h2 className="text-2xl font-bold text-slate-900 mb-4">系统设置</h2>

      <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1 w-fit overflow-x-auto">
      {allBadges}
        {([
          { id: "roles" as Tab, label: "角色权限", icon: <Users size={12} /> },
          { id: "channels" as Tab, label: "渠道配置", icon: <Globe size={12} /> },
          { id: "audit" as Tab, label: "审计日志", icon: <FileText size={12} /> },
          { id: "ratelimit" as Tab, label: "限流规则", icon: <Shield size={12} /> },
          { id: "retention" as Tab, label: "数据保留", icon: <Clock size={12} /> },
          { id: "privacy" as Tab, label: "隐私与删除", icon: <Trash2 size={12} /> },
          { id: "params" as Tab, label: "全局参数", icon: <Sliders size={12} /> },
        ]).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1 rounded-lg px-4 py-2 text-base font-medium transition-colors whitespace-nowrap ${tab === t.id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* Roles */}
      {tab === "roles" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3">角色与权限管理</h3>
          <DataTable
            data={roles}
            rowKey={(r) => r.role}
            columns={[
              { key: "role", header: "角色名称", render: (r) => <span className="text-base font-medium">{r.role}</span> },
              { key: "permissions", header: "权限范围", render: (r) => <span className="text-base text-slate-500">{r.permissions}</span> },
              { key: "users", header: "用户数", render: (r) => <span className="text-base">{r.users}</span> },
              {
                key: "actions",
                header: "操作",
                render: (r) => (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); openRoleEdit(r); }}
                    className="flex items-center gap-0.5 rounded-md border border-slate-200 px-2 py-1 text-base text-slate-500 hover:bg-slate-50"
                  >
                    <Pencil size={12} />编辑
                  </button>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* Channels */}
      {tab === "channels" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3">渠道配置</h3>
          <div className="space-y-2">
            {channels.map((ch) => (
              <div key={ch.name} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                <div className="flex items-center gap-2">
                  <Globe size={14} className="text-slate-400" />
                  <span className="text-base font-medium text-slate-700">{ch.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base text-slate-400">状态：{ch.status}</span>
                  <button
                    type="button"
                    onClick={() => openChannelEdit(ch)}
                    className="flex items-center gap-0.5 text-base text-blue-600 hover:underline"
                  >
                    <Pencil size={12} />编辑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit */}
      {tab === "audit" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3">审计日志</h3>
          <DataTable
            data={auditLogs}
            rowKey={(r) => r.id}
            onRowClick={(r) => setAuditDetail(r)}
            columns={[
              { key: "user", header: "操作人", render: (r) => <span className="text-base font-medium">{r.user}</span> },
              { key: "action", header: "操作", render: (r) => <span className="text-base">{r.action}</span> },
              { key: "target", header: "操作对象", render: (r) => <span className="text-base text-slate-500">{r.target}</span> },
              { key: "time", header: "时间", render: (r) => <span className="text-base text-slate-400">{r.time}</span> },
              { key: "ip", header: "IP", render: (r) => <span className="text-base font-mono text-slate-400">{r.ip}</span> },
            ]}
          />
        </div>
      )}

      {/* Rate Limit */}
      {tab === "ratelimit" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3">限流规则配置</h3>
          <DataTable
            data={rateLimits}
            rowKey={(r) => r.api}
            columns={[
              { key: "api", header: "接口", render: (r) => <span className="text-base font-medium">{r.api}</span> },
              { key: "limit", header: "全局限流", render: (r) => <span className="text-base">{r.limit}</span> },
              { key: "burst", header: "突发上限", render: (r) => <span className="text-base">{r.burst}</span> },
              { key: "perTenant", header: "单租户限流", render: (r) => <span className="text-base">{r.perTenant}</span> },
              {
                key: "actions",
                header: "操作",
                render: (r) => (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); openRateEdit(r); }}
                    className="flex items-center gap-0.5 rounded-md border border-slate-200 px-2 py-1 text-base text-slate-500 hover:bg-slate-50"
                  >
                    <Pencil size={12} />编辑
                  </button>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* Retention */}
      {tab === "retention" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3">数据保留策略</h3>
          <div className="space-y-2 text-base text-slate-600">
            {retentions.map((r) => (
              <div key={r.label} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                <div>
                  <span className="font-medium">{r.label}</span>
                  <p className="text-slate-400 mt-0.5">{r.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-medium">{r.period}</span>
                  <button
                    type="button"
                    onClick={() => openRetentionEdit(r)}
                    className="flex items-center gap-0.5 text-base text-blue-500 hover:underline"
                  >
                    <Pencil size={12} />编辑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy */}
      {tab === "privacy" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3">隐私与数据删除</h3>
          <div className="space-y-3 text-base text-slate-600">
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
              <p className="font-medium text-blue-700 mb-1">用户数据脱敏规则</p>
              <p>手机号显示为138****1234格式；订单号在非本用户场景下脱敏；用户姓名仅显示姓氏+先生/女士</p>
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-3">
              <p className="font-medium text-amber-700 mb-1">数据删除流程</p>
              <p>用户可申请删除个人数据, 7天冷静期, 人工复核, 删除所有PII, 保留匿名化统计数据</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-100 p-3">
              <p className="font-medium text-slate-700 mb-1">合规要求</p>
              <p>遵守《个人信息保护法》相关规定。用户有权查询、更正、删除其个人信息。数据跨境传输需经安全评估。</p>
            </div>
          </div>
        </div>
      )}

      {/* Params */}
      {tab === "params" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3">全局参数配置</h3>
          <div className="space-y-3 text-base">
            {params.map((p) => (
              <div key={p.label} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                <div>
                  <span className="text-base font-medium text-slate-700">{p.label}</span>
                  <p className="text-base text-slate-400">{p.desc}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-mono text-blue-600">{p.value}</span>
                  <button
                    type="button"
                    onClick={() => openParamEdit(p)}
                    className="flex items-center gap-0.5 text-base text-blue-500 hover:underline"
                  >
                    <Pencil size={12} />编辑
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit Detail Modal */}
      <Modal open={auditDetail !== null} title="审计日志详情" onClose={() => setAuditDetail(null)} size="md">
        {auditDetail && (
          <div className="space-y-3 text-base">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="text-base text-slate-400">操作人</span><p className="font-medium">{auditDetail.user}</p></div>
              <div><span className="text-base text-slate-400">时间</span><p>{auditDetail.time}</p></div>
            </div>
            <div><span className="text-base text-slate-400">操作</span><p>{auditDetail.action}</p></div>
            <div><span className="text-base text-slate-400">操作对象</span><p className="text-slate-500">{auditDetail.target}</p></div>
            <div><span className="text-base text-slate-400">IP地址</span><p className="font-mono">{auditDetail.ip}</p></div>
          </div>
        )}
      </Modal>

      {/* Role Edit Modal */}
      <Modal open={roleModal} title="编辑角色权限" onClose={() => setRoleModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">角色名称</label>
            <input
              value={roleForm.role}
              disabled
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none bg-slate-50 text-slate-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">权限范围</label>
            <textarea
              value={roleForm.permissions}
              onChange={(e) => setRoleForm((f) => ({ ...f, permissions: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">用户数</label>
            <input
              type="number"
              value={roleForm.users}
              onChange={(e) => setRoleForm((f) => ({ ...f, users: +e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setRoleModal(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleRoleSave} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">保存</button>
        </div>
      </Modal>

      {/* Channel Edit Modal */}
      <Modal open={channelModal} title="渠道配置" onClose={() => setChannelModal(false)} size="sm">
        {editingChannel && (
          <div className="space-y-3 text-base">
            <div>
              <label className="block text-base font-medium text-slate-500 mb-1">渠道名称</label>
              <input
                value={editingChannel.name}
                disabled
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none bg-slate-50 text-slate-400"
              />
            </div>
            <div>
              <label className="block text-base font-medium text-slate-500 mb-1">状态</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="chStatus"
                    checked={editingChannel.status === "启用"}
                    onChange={() =>
                      setEditingChannel((prev) => (prev ? { ...prev, status: "启用" } : null))
                    }
                  />
                  <span className="text-base">启用</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="chStatus"
                    checked={editingChannel.status === "停用"}
                    onChange={() =>
                      setEditingChannel((prev) => (prev ? { ...prev, status: "停用" } : null))
                    }
                  />
                  <span className="text-base">停用</span>
                </label>
              </div>
            </div>
          </div>
        )}
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setChannelModal(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={toggleChannelStatus} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">保存</button>
        </div>
      </Modal>

      {/* Rate Limit Edit Modal */}
      <Modal open={rateLimitModal} title="编辑限流规则" onClose={() => setRateLimitModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">接口</label>
            <input
              value={editingRate?.api || ""}
              disabled
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none bg-slate-50 text-slate-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">全局限流</label>
            <input
              value={rateForm.limit}
              onChange={(e) => setRateForm((f) => ({ ...f, limit: e.target.value }))}
              placeholder="如：1000 QPS"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">突发上限</label>
            <input
              value={rateForm.burst}
              onChange={(e) => setRateForm((f) => ({ ...f, burst: e.target.value }))}
              placeholder="如：1500 QPS"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">单租户限流</label>
            <input
              value={rateForm.perTenant}
              onChange={(e) => setRateForm((f) => ({ ...f, perTenant: e.target.value }))}
              placeholder="如：50 QPS"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setRateLimitModal(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleRateSave} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">保存</button>
        </div>
      </Modal>

      {/* Retention Edit Modal */}
      <Modal open={retentionModal} title="编辑数据保留策略" onClose={() => setRetentionModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">数据类别</label>
            <input
              value={editingRetention?.label || ""}
              disabled
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none bg-slate-50 text-slate-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">保留期限</label>
            <input
              value={retentionForm.period}
              onChange={(e) => setRetentionForm((f) => ({ ...f, period: e.target.value }))}
              placeholder="如：90天"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">说明</label>
            <textarea
              value={retentionForm.desc}
              onChange={(e) => setRetentionForm((f) => ({ ...f, desc: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
              rows={2}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setRetentionModal(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleRetentionSave} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">保存</button>
        </div>
      </Modal>

      {/* Param Edit Modal */}
      <Modal open={paramModal} title="编辑全局参数" onClose={() => setParamModal(false)} size="md">
        <div className="space-y-3 text-base">
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">参数名称</label>
            <input
              value={editingParam?.label || ""}
              disabled
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none bg-slate-50 text-slate-400"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">参数值</label>
            <input
              value={paramForm.value}
              onChange={(e) => setParamForm((f) => ({ ...f, value: e.target.value }))}
              placeholder="输入参数值"
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none focus:border-blue-400 font-mono"
            />
          </div>
          <div>
            <label className="block text-base font-medium text-slate-500 mb-1">说明</label>
            <input
              value={paramForm.desc}
              onChange={(e) => setParamForm((f) => ({ ...f, desc: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-base outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={() => setParamModal(false)} className="rounded-lg border px-4 py-2 text-base">取消</button>
          <button type="button" onClick={handleParamSave} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">保存</button>
        </div>
      </Modal>
    </div>
  );
}
