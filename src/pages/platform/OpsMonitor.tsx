import { useState } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import type { PageProps } from "../../types";
import { StatusBadge } from "../../components/StatusBadge";
import { Drawer } from "../../components/Drawer";
import { Server, AlertTriangle, Clock, Zap, BarChart3, Wifi, Activity, AlertCircle, RefreshCw } from "lucide-react";
import { RequirementBadge } from "../../components/RequirementBadge";
import reqs from "../../data/requirementData";

const modelStatuses = [
  { model: "Claude Opus 4.7", status: "正常", latency: "1,850ms", availability: "99.95%", region: "us-east" },
  { model: "Claude Sonnet 4.6", status: "正常", latency: "960ms", availability: "99.92%", region: "us-east" },
  { model: "Claude Haiku 4.5", status: "正常", latency: "380ms", availability: "99.97%", region: "us-east" },
];

const apiMetrics = [
  { endpoint: "/api/chat/completions", errorRate: "0.05%", avgLatency: "2,100ms", qps: 42, status: "正常" },
  { endpoint: "/api/rag/retrieve", errorRate: "0.12%", avgLatency: "520ms", qps: 68, status: "正常" },
  { endpoint: "/api/tools/call", errorRate: "1.8%", avgLatency: "830ms", qps: 15, status: "需关注" },
  { endpoint: "/api/sse/stream", errorRate: "0.03%", avgLatency: "-", qps: 38, status: "正常" },
];

const alerts = [
  { id: "alert-1", level: "warning", title: "工具调用接口错误率上升", detail: "过去15分钟工具调用接口错误率1.8%，超过1%阈值。主要影响门店库存查询接口。", time: "2026-05-17 10:25", acknowledged: false },
  { id: "alert-2", level: "info", title: "SSE连接数接近上限", detail: "当前SSE并发连接1880/2000，接近阈值。建议扩容或开启限流。", time: "2026-05-17 10:20", acknowledged: true },
  { id: "alert-3", level: "critical", levelLabel: "严重", title: "下游库存系统超时", detail: "门店库存系统响应时间超过5秒，已触发降级策略。影响门店核销场景。", time: "2026-05-17 10:15", acknowledged: false },
  { id: "alert-4", level: "info", title: "Token用量接近月度配额80%", detail: "租户「知养健康课堂」本月Token使用已达80%，建议提醒续费或升级套餐。", time: "2026-05-17 09:50", acknowledged: true },
];

const degradationRecords = [
  { id: "deg-1", time: "2026-05-17 10:15", trigger: "下游库存系统超时", model: "Claude Opus 4.7 → Claude Sonnet 4.6", duration: "5分钟", status: "已恢复" },
  { id: "deg-2", time: "2026-05-16 18:30", trigger: "RAG召回超时", model: "Claude Opus 4.7 → FAQ直匹配", duration: "12分钟", status: "已恢复" },
  { id: "deg-3", time: "2026-05-15 14:00", trigger: "模型服务限流", model: "Claude Opus 4.7 → Claude Haiku 4.5", duration: "3分钟", status: "已恢复" },
];

export default function OpsMonitor({}: PageProps) {
  const allBadges = reqs.OpsMonitor.flatMap(group =>
  group.reqs.map((req, i) => (
    <RequirementBadge key={req.id} req={req} sectionSelector={group.selector} index={i} />
  ))
);
  const [alertList, setAlertList] = useState(alerts);
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);

  const alert = alertList.find((a) => a.id === selectedAlert);

  function acknowledgeAlert(id: string) {
    setAlertList((prev) => prev.map((a) => a.id === id ? { ...a, acknowledged: true } : a));
  }

  const latencyData = [
    { date: "5/11", value: 1280 },
    { date: "5/12", value: 1350 },
    { date: "5/13", value: 1190 },
    { date: "5/14", value: 1420 },
    { date: "5/15", value: 1310 },
    { date: "5/16", value: 1250 },
    { date: "5/17", value: 1250 },
  ];

  const qpsData = apiMetrics.map((m) => ({
    name: m.endpoint.replace("/api/", ""),
    qps: m.qps,
  }));

  return (
    <div className="relative ops-page">
      {allBadges}
      <h2 className="text-2xl font-bold text-slate-900 mb-4">运维监控</h2>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {[
          { icon: <Server size={16} className="text-emerald-500" />, label: "模型服务", value: "全部正常", sub: "3/3 模型可用", color: "bg-emerald-50" },
          { icon: <Activity size={16} className="text-blue-500" />, label: "接口成功率", value: "99.5%", sub: "近15分钟", color: "bg-blue-50" },
          { icon: <Clock size={16} className="text-indigo-500" />, label: "平均响应时间", value: "1,250ms", sub: "含模型生成时间", color: "bg-indigo-50" },
          { icon: <Wifi size={16} className="text-emerald-500" />, label: "SSE连接", value: "1,880", sub: "上限 2,000", color: "bg-amber-50" },
          { icon: <Zap size={16} className="text-blue-500" />, label: "工具调用成功率", value: "98.2%", sub: "近1小时", color: "bg-blue-50" },
          { icon: <AlertCircle size={16} className="text-rose-500" />, label: "活跃告警", value: alertList.filter((a) => !a.acknowledged).length, sub: `共${alertList.length}条`, color: "bg-rose-50" },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={`rounded-lg ${card.color} p-1.5`}>{card.icon}</div>
              <span className="text-base text-slate-500">{card.label}</span>
            </div>
            <p className="text-3xl font-bold text-slate-800">{card.value}</p>
            <p className="text-base text-slate-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Clock size={16} className="text-blue-500" />接口响应时间趋势（近7天）
          </h3>
          <div style={{ height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}ms`} />
                <Tooltip formatter={(v) => `${v}ms`} />
                <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} dot={{ fill: "#2563EB", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <BarChart3 size={16} className="text-indigo-500" />API调用QPS
          </h3>
          <div style={{ height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qpsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" />
                <YAxis tick={{ fontSize: 12, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="qps" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2"><Server size={16} className="text-blue-500" />模型服务状态</h3>
          <div className="space-y-2">
            {modelStatuses.map((m) => (
              <div key={m.model} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                <div>
                  <span className="text-base font-medium text-slate-700">{m.model}</span>
                  <div className="flex items-center gap-3 mt-0.5 text-base text-slate-400">
                    <span>延迟 {m.latency}</span>
                    <span>可用率 {m.availability}</span>
                    <span>{m.region}</span>
                  </div>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2"><BarChart3 size={16} className="text-indigo-500" />接口监控</h3>
          <div className="space-y-2">
            {apiMetrics.map((m) => (
              <div key={m.endpoint} className="flex items-center justify-between rounded-lg border border-slate-100 p-3">
                <div>
                  <span className="text-base font-mono text-slate-600">{m.endpoint}</span>
                  <div className="flex items-center gap-3 mt-0.5 text-base text-slate-400">
                    <span>错误率 {m.errorRate}</span>
                    <span>延迟 {m.avgLatency}</span>
                    <span>QPS {m.qps}</span>
                  </div>
                </div>
                <StatusBadge status={m.status} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2"><RefreshCw size={16} className="text-amber-500" />降级记录</h3>
          <div className="space-y-2">
            {degradationRecords.map((r) => (
              <div key={r.id} className="rounded-lg border border-slate-100 p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base font-medium text-slate-700">{r.trigger}</span>
                  <StatusBadge status={r.status} />
                </div>
                <div className="text-base text-slate-400">
                  <span>{r.model}</span>
                  <span className="mx-2">·</span>
                  <span>持续 {r.duration}</span>
                  <span className="mx-2">·</span>
                  <span>{r.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h3 className="text-base font-semibold text-slate-700 mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-rose-500" />告警列表</h3>
          <div className="space-y-2">
            {alertList.map((a) => (
              <div key={a.id} onClick={() => setSelectedAlert(a.id)} className="rounded-lg border border-slate-100 p-3 cursor-pointer hover:bg-slate-50">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${a.level === "critical" ? "bg-rose-500" : a.level === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
                    <span className="text-base font-medium text-slate-700">{a.title}</span>
                  </div>
                  <span className="text-base text-slate-400">{a.time}</span>
                </div>
                <div className="flex items-center gap-2 text-base">
                  <span className={a.acknowledged ? "text-slate-400" : "text-amber-600 font-medium"}>{a.acknowledged ? "已确认" : "待确认"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Drawer open={selectedAlert !== null} title="告警详情" onClose={() => setSelectedAlert(null)}>
        {alert && (
          <div className="space-y-4 text-base">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${alert.level === "critical" ? "bg-rose-500" : alert.level === "warning" ? "bg-amber-500" : "bg-blue-500"}`} />
              <span className="font-medium">{alert.title}</span>
            </div>
            <div>
              <span className="text-base text-slate-400">告警时间</span>
              <p>{alert.time}</p>
            </div>
            <div>
              <span className="text-base text-slate-400">告警详情</span>
              <p className="mt-1">{alert.detail}</p>
            </div>
            <div>
              <span className="text-base text-slate-400">确认状态</span>
              <p className={alert.acknowledged ? "text-emerald-600" : "text-amber-600"}>{alert.acknowledged ? "已确认" : "待确认"}</p>
            </div>
            {!alert.acknowledged && (
              <button type="button" onClick={() => { acknowledgeAlert(alert.id); }} className="rounded-lg bg-blue-600 px-4 py-2 text-base text-white">确认告警</button>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
