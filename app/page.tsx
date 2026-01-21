"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { MonitorNavbar } from "@/components/monitor/MonitorNavbar"
import { APP_LOCALE, APP_TIMEZONE } from "@/lib/utils/formatters"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Legend,
  LabelList,
} from "recharts"

type MonitorResponse = {
  surveyId: string
  surveyTitle?: string
  companyId: string
  companyName?: string
  timezone?: string | null
  tokenHash: string
  linkCreatedAt?: string
  expiresAt?: string
  usage: { count: number; max: number | null }
  totalResponses: number
  riskDistribution: { risk_level: string; count: number }[]
  recentResponses: { id: string; created_at: string; score: number | null; risk_level: string | null; receipt_code?: string }[]
  questionStats?: { id: string; label: string; factor: string; scale: string; average: number; count: number }[]
}

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"]

const FALLBACK_TIMEZONE = APP_TIMEZONE

function resolveTimeZone(timeZone?: string | null): string {
  if (!timeZone) return FALLBACK_TIMEZONE
  try {
    Intl.DateTimeFormat(APP_LOCALE, { timeZone }).format()
    return timeZone
  } catch {
    return FALLBACK_TIMEZONE
  }
}

function formatInTimeZone(
  value: string | Date | null | undefined,
  timeZone: string,
  options: Intl.DateTimeFormatOptions,
): string {
  if (!value) return "—"
  const date = typeof value === "string" ? new Date(value) : value
  if (Number.isNaN(date.getTime())) return "—"
  return date.toLocaleString(APP_LOCALE, { timeZone, ...options })
}

function StatCard({
  title,
  value,
  helper,
  tone = "slate",
}: {
  value: string | number
  helper?: string
  tone?: "slate" | "emerald" | "sky" | "amber"
}) {
  const toneClasses: Record<"slate" | "emerald" | "sky" | "amber", string> = {
    slate: "bg-slate-100 text-slate-900 border-slate-200",
    emerald: "bg-emerald-100 text-emerald-900 border-emerald-200",
    sky: "bg-sky-100 text-sky-900 border-sky-200",
    amber: "bg-amber-100 text-amber-900 border-amber-200",
  }
  return (
    <Card className={`${toneClasses[tone]} shadow-sm`}>
      <CardHeader className="pb-1">
        <CardDescription className="text-sm">{title}</CardDescription>
        <CardTitle className="text-2xl leading-tight">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}

function MonitorClient() {
  const searchParams = useSearchParams()
  const tokenFromUrl = searchParams.get("token") || ""
  const [token, setToken] = useState(tokenFromUrl)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<MonitorResponse | null>(null)

  const averageScore = useMemo(() => {
    if (!data?.recentResponses || data.recentResponses.length === 0) return null
    const sum = data.recentResponses.reduce((s, r) => s + (r.score ?? 0), 0)
    return sum / data.recentResponses.length
  }, [data])

  // Fetch monitor data when token changes
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError(null);
    setData(null);
    fetch(`/api/surveys/monitor?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch((err) => {
        setError(err.message || 'Erro desconhecido');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  return (
    <TooltipProvider>
    <div>
      {/* Top controls: tabs + token area */}
      <div className="mb-4 flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div className="flex items-center gap-4">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="details">Detalhes</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-3">
            <Input value={token} onChange={(e: any) => setToken(e.target.value)} placeholder="Cole o token aqui" />
            <Button onClick={() => setToken((t) => t)} variant={loading ? 'secondary' : 'default'}>{loading ? "Carregando..." : "Carregar"}</Button>
            <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(token) }}>{"Copiar"}</Button>
            <Button variant="ghost" onClick={() => { /* download CSV: TODO */ }}>{"Baixar CSV"}</Button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-600">Fuso: {resolveTimeZone(data?.timezone)}</div>
          <Toggle onClick={() => { /* auto-refresh toggle */ }} className="px-3">Auto 5s</Toggle>
          <Select defaultValue="5s">
            <SelectTrigger className="w-24">
              <SelectValue placeholder="5s" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5s">5s</SelectItem>
              <SelectItem value="10s">10s</SelectItem>
              <SelectItem value="30s">30s</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Filtrar risco</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => { /* filter All */ }}>Todos</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { /* filter Low */ }}>Baixo</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { /* filter Moderate */ }}>Moderado</DropdownMenuItem>
              <DropdownMenuItem onClick={() => { /* filter High */ }}>Alto</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {error && <div className="text-xs text-amber-600">{error}</div>}
      {!token && (
        <div className="text-center text-slate-500 text-sm mt-12">
          Nenhum token informado na URL.<br />
          Adicione <span className="font-mono bg-slate-100 px-2 py-1 rounded">?token=SEU_TOKEN</span> na barra de endereços.
        </div>
      )}
      {token && !data && !loading && !error && (
        <div className="text-center text-slate-500 text-sm mt-12">
          Nenhum dado carregado para este token.<br />
          Verifique se o token está correto ou tente novamente.
        </div>
      )}
      {/* Dashboard rendering when data is available */}
      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {loading ? (
              <>
                <Card className="p-4"><Skeleton className="h-6 w-24 mb-2" /><Skeleton className="h-4 w-32" /></Card>
                <Card className="p-4"><Skeleton className="h-6 w-36 mb-2" /><Skeleton className="h-4 w-40" /></Card>
                <Card className="p-4"><Skeleton className="h-6 w-20 mb-2" /><Skeleton className="h-4 w-28" /></Card>
                <Card className="p-4"><Skeleton className="h-6 w-20 mb-2" /><Skeleton className="h-4 w-28" /></Card>
              </>
            ) : (
              <>
                <StatCard
                  title="Respostas"
                  value={data.totalResponses}
                  helper={`Uso: ${data.usage.count}/${data.usage.max ?? "∞"}`}
                  tone="emerald"
                />
                <StatCard
                  title="Empresa"
                  value={data.companyName ?? '—'}
                  helper={data.surveyTitle ?? ''}
                />
                <StatCard
                  title="Uso do link"
                  value={`${data.usage.count}/${data.usage.max ?? "∞"}`}
                  helper={`Token: ${data.tokenHash.slice(0, 8)}…`}
                  tone="sky"
                />
                <StatCard
                  title="Expira em"
                  value={data.expiresAt ? formatInTimeZone(data.expiresAt, resolveTimeZone(data.timezone), { dateStyle: "medium" }) : '—'}
                  helper={data.expiresAt ? formatInTimeZone(data.expiresAt, resolveTimeZone(data.timezone), { timeStyle: "short" }) : ''}
                  tone="amber"
                />
              </>
            )}
          </div>

          {/* Quick table (compact recent responses) */}
          {data.recentResponses && data.recentResponses.length > 0 && (
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tabela rápida</CardTitle>
                  <CardDescription className="text-sm">Últimas respostas com score e risco.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Horário</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Risco</TableHead>
                          <TableHead>ID</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.recentResponses.map((r) => (
                          <TableRow key={r.id}>
                            <TableCell>{formatInTimeZone(r.created_at, resolveTimeZone(data.timezone), { dateStyle: "short", timeStyle: "medium" })}</TableCell>
                            <TableCell className="font-semibold">{(r.score ?? 0).toFixed(2)}</TableCell>
                            <TableCell>
                              {r.risk_level ? <Badge variant="outline">{r.risk_level}</Badge> : "—"}
                            </TableCell>
                            <TableCell className="text-xs text-slate-500">{(r.receipt_code || r.id).toString().slice(0, 8)}…</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Evolution / Capacity / Scale analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Evolução das respostas</CardTitle>
                <CardDescription className="text-sm">Total acumulado no intervalo monitorado.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>
                  <AreaChart data={(data.recentResponses || []).map(r => ({ time: formatInTimeZone(r.created_at, resolveTimeZone(data.timezone), { timeStyle: 'medium' }), score: r.score }))}>
                    <defs>
                      <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.8} />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.05} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <RechartsTooltip />
                    <Area type="monotone" dataKey="score" stroke="#06b6d4" fill="url(#gradScore)" dot={{ r: 3 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Capacidade vs. Uso</CardTitle>
                <CardDescription className="text-sm">Comparativo rápido de usos e restante.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={[{ name: 'Link', used: data.usage.count, remaining: Math.max(0, (data.usage.max ?? data.usage.count) - data.usage.count) }] }>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="remaining" stackId="a" fill="#0f172a">
                      <LabelList dataKey="remaining" position="center" />
                    </Bar>
                    <Bar dataKey="used" stackId="a" fill="#f97316">
                      <LabelList dataKey="used" position="center" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Scale analytics (horizontal bar) */}
          {data.questionStats && data.questionStats.length > 0 && (
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analítica por escala</CardTitle>
                  <CardDescription className="text-sm">Comparativo visual das médias por escala.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 160 }}>
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart layout="vertical" data={Array.from(data.questionStats.reduce((m, q) => {
                        const e = m.get(q.scale) || { scale: q.scale, sum: 0, count: 0 }
                        e.sum += q.average * q.count
                        e.count += q.count
                        m.set(q.scale, e)
                        return m
                      }, new Map<string, { scale: string; sum: number; count: number }>() ).values()).map(v => ({ scale: v.scale, avg: v.sum / Math.max(1, v.count) }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 5]} />
                        <YAxis dataKey="scale" type="category" width={200} />
                        <RechartsTooltip />
                        <Bar dataKey="avg" fill="#10b981">
                          <LabelList dataKey="avg" position="right" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent responses chart + risk donut */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Respostas recentes</CardTitle>
                <CardDescription className="text-sm">Últimos envios deste token (nota/score por resposta).</CardDescription>
                <div className="ml-auto">
                  <Badge variant="secondary">Média: {averageScore ? averageScore.toFixed(2) : '—'}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={(data.recentResponses || []).map(r => ({ time: formatInTimeZone(r.created_at, resolveTimeZone(data.timezone), { timeStyle: 'medium' }), score: r.score }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar dataKey="score" fill="#f97316">
                      <LabelList dataKey="score" position="top" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de risco</CardTitle>
                <CardDescription className="text-sm">Baseada no campo risk_level.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={data.riskDistribution} dataKey="count" nameKey="risk_level" innerRadius={60} outerRadius={80}>
                      {data.riskDistribution.map((entry, idx) => (
                        <Cell key={`cell2-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* PROART notes */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Notas sobre pontuação PROART</CardTitle>
                <CardDescription className="text-sm">Como o score é calculado e classificado.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none text-sm">
                  <p>- Cada item do PROART é respondido de 1 a 5; cada fator é a média simples dos itens do fator.</p>
                  <p>- Cada escala (Organização do Trabalho, Estilos de Gestão, Sofrimento, Danos) é a média ponderada de seus fatores; o <code>score</code> geral mostrado vem de <code>score_data.score</code> salvo na resposta.</p>
                  <p>- Classificação padrão (lida de <code>score_data.risk_level</code>): Organização do Trabalho &amp; Sofrimento/Danos — Baixo 3,70–5,00; Moderado 2,30–3,69; Alto 1,00–2,29. Estilos de Gestão — &lt;2,50 pouco característico; 2,51–3,50 presença moderada; &gt;3,50 padrão predominante.</p>
                  <p>- Gráficos: barras mostram nota por resposta; pizza mostra distribuição de risco; área mostra trajetória recente; capacidade mostra usos vs. limite.</p>
                  <p>- O monitor usa <code>token_hash</code> e permanece disponível por até 10 dias após a criação do link, mesmo que o link já tenha expirado.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de risco</CardTitle>
                <CardDescription className="text-sm">Contagem por nível de risco</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie data={data.riskDistribution} dataKey="count" nameKey="risk_level" outerRadius={90} label>
                      {data.riskDistribution.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Últimas respostas</CardTitle>
                <CardDescription className="text-sm">Respostas mais recentes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Código</TableHead>
                        <TableHead>Pontuação</TableHead>
                        <TableHead>Risco</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(data.recentResponses || []).map((r) => (
                        <TableRow key={r.id}>
                          <TableCell>{formatInTimeZone(r.created_at, resolveTimeZone(data.timezone), { dateStyle: "short", timeStyle: "short" })}</TableCell>
                          <TableCell>{r.receipt_code ?? "—"}</TableCell>
                          <TableCell>{r.score ?? "—"}</TableCell>
                          <TableCell>
                            {r.risk_level ? <Badge variant="secondary">{r.risk_level}</Badge> : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {data.questionStats && data.questionStats.length > 0 && (
            <div className="mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Média por pergunta</CardTitle>
                  <CardDescription className="text-sm">Média e contagem por pergunta</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={data.questionStats} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <RechartsTooltip />
                      <Legend />
                      <Bar dataKey="average" fill="var(--chart-1)">
                        <LabelList dataKey="average" position="top" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Factor aggregation + full questions list */}
          {data.questionStats && data.questionStats.length > 0 && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Perguntas</CardTitle>
                  <CardDescription className="text-sm">Lista completa de perguntas, fatores e médias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Pergunta</TableHead>
                          <TableHead>Fator</TableHead>
                          <TableHead>Escala</TableHead>
                          <TableHead className="text-center">Média</TableHead>
                          <TableHead>Respostas</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.questionStats.map((q) => {
                          const avg = Number((q.average || 0).toFixed(2))
                          const getColor = (v: number) => {
                            if (v <= 1.75) return "#ef4444"
                            if (v <= 2.5) return "#fb923c"
                            if (v <= 3.5) return "#f59e0b"
                            return "#10b981"
                          }
                          return (
                            <TableRow key={q.id}>
                              <TableCell className="max-w-prose break-words">{q.label}</TableCell>
                              <TableCell>{q.factor}</TableCell>
                              <TableCell>{q.scale}</TableCell>
                              <TableCell className="text-center">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div className="inline-flex items-center justify-center px-3 py-1 rounded-full text-white font-medium" style={{ backgroundColor: getColor(avg) }}>
                                          {avg.toFixed(2)}
                                        </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        Média: {avg.toFixed(2)} • {q.count} respostas
                                      </TooltipContent>
                                    </Tooltip>
                                  </TableCell>
                              <TableCell>{q.count}</TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
    </TooltipProvider>
  )
}

export default function MonitorPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.12),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_26%),radial-gradient(circle_at_40%_80%,rgba(251,191,36,0.12),transparent_30%)] bg-slate-50 text-slate-900">
      <MonitorNavbar />
      <main className="px-4 py-8">
        <Suspense fallback={<div className="text-sm text-slate-600">Carregando monitor...</div>}>
          <MonitorClient />
        </Suspense>
      </main>
    </div>
  )
}
