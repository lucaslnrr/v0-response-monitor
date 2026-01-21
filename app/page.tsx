"use client"

import { useState, useEffect } from "react"
import {
  BarChart3,
  Users,
  FileText,
  TrendingUp,
  Clock,
  RefreshCw,
  Target,
  Activity,
  PieChart,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// Demo data
const scoreEvolution = [
  { dia: "Seg", individualista: 2.8, coletivista: 3.2 },
  { dia: "Ter", individualista: 2.5, coletivista: 3.5 },
  { dia: "Qua", individualista: 3.0, coletivista: 3.3 },
  { dia: "Qui", individualista: 2.7, coletivista: 3.6 },
  { dia: "Sex", individualista: 2.9, coletivista: 3.4 },
]

const responsesByHour = [
  { hora: "08h", respostas: 3 },
  { hora: "10h", respostas: 8 },
  { hora: "12h", respostas: 5 },
  { hora: "14h", respostas: 12 },
  { hora: "16h", respostas: 9 },
  { hora: "18h", respostas: 4 },
]

const factorDistribution = [
  { name: "Individualista", value: 45, fill: "#0d9488" },
  { name: "Coletivista", value: 55, fill: "#1e3a5f" },
]

const scoreRanges = [
  { range: "1.0-2.0", count: 8, fill: "#ef4444" },
  { range: "2.0-3.0", count: 15, fill: "#f97316" },
  { range: "3.0-4.0", count: 22, fill: "#eab308" },
  { range: "4.0-5.0", count: 12, fill: "#22c55e" },
]

const radarData = [
  { subject: "Hierarquia", A: 3.2, fullMark: 5 },
  { subject: "Controle", A: 2.8, fullMark: 5 },
  { subject: "Autonomia", A: 3.5, fullMark: 5 },
  { subject: "Colaboração", A: 4.1, fullMark: 5 },
  { subject: "Inovação", A: 3.0, fullMark: 5 },
  { subject: "Regras", A: 3.8, fullMark: 5 },
]

const recentResponses = [
  { id: 1, time: "14:32", code: "RCP001", score: 3.2, risk: "Baixo" },
  { id: 2, time: "14:28", code: "RCP002", score: 2.8, risk: "Moderado" },
  { id: 3, time: "14:15", code: "RCP003", score: 3.9, risk: "Baixo" },
  { id: 4, time: "13:58", code: "RCP004", score: 1.8, risk: "Alto" },
  { id: 5, time: "13:42", code: "RCP005", score: 4.1, risk: "Baixo" },
]

const questionsData = [
  { pergunta: "Em meu trabalho, incentiva-se a idolatria dos chefes", fator: "Estilo Individualista", escala: "Escala dos Estilos de Gestão", media: 2.5, respostas: 2 },
  { pergunta: "Os gestores desta organização se consideram insubstituíveis", fator: "Estilo Individualista", escala: "Escala dos Estilos de Gestão", media: 3.5, respostas: 2 },
  { pergunta: "Aqui os gestores preferem trabalhar individualmente", fator: "Estilo Individualista", escala: "Escala dos Estilos de Gestão", media: 2.5, respostas: 2 },
  { pergunta: "Nesta organização os gestores se consideram o centro do mundo", fator: "Estilo Individualista", escala: "Escala dos Estilos de Gestão", media: 2.5, respostas: 2 },
  { pergunta: "Os gestores desta organização fazem qualquer coisa para chamar a atenção", fator: "Estilo Individualista", escala: "Escala dos Estilos de Gestão", media: 2.0, respostas: 2 },
  { pergunta: "É creditada grande importância para as regras nesta organização", fator: "Estilo Individualista", escala: "Escala dos Estilos de Gestão", media: 4.0, respostas: 2 },
  { pergunta: "A hierarquia é valorizada nesta organização", fator: "Estilo Individualista", escala: "Escala dos Estilos de Gestão", media: 1.5, respostas: 2 },
  { pergunta: "Os laços afetivos são fracos entre as pessoas desta organização", fator: "Estilo Individualista", escala: "Escala dos Estilos de Gestão", media: 3.5, respostas: 2 },
  { pergunta: "Há forte controle do trabalho", fator: "Estilo Individualista", escala: "Escala dos Estilos de Gestão", media: 3.0, respostas: 2 },
  { pergunta: "O ambiente de trabalho se desorganiza com mudanças", fator: "Estilo Individualista", escala: "Escala dos Estilos de Gestão", media: 4.5, respostas: 2 },
  { pergunta: "As pessoas são compromissadas com a organização mesmo quando não há retorno adequado", fator: "Estilo Coletivista", escala: "Escala dos Estilos de Gestão", media: 3.0, respostas: 2 },
  { pergunta: "O mérito das conquistas na empresa é de todos", fator: "Estilo Coletivista", escala: "Escala dos Estilos de Gestão", media: 2.5, respostas: 2 },
  { pergunta: "O trabalho coletivo é valorizado pelos gestores", fator: "Estilo Coletivista", escala: "Escala dos Estilos de Gestão", media: 2.5, respostas: 2 },
  { pergunta: "Para esta organização, o resultado do trabalho é visto como uma realização do grupo", fator: "Estilo Coletivista", escala: "Escala dos Estilos de Gestão", media: 3.0, respostas: 2 },
]

function getMediaColor(value: number): string {
  if (value >= 4.0) return "bg-green-500"
  if (value >= 3.0) return "bg-yellow-500"
  if (value >= 2.0) return "bg-orange-500"
  return "bg-red-500"
}

function getRiskBadge(risk: string) {
  const colors: Record<string, string> = {
    "Baixo": "bg-emerald-100 text-emerald-700",
    "Moderado": "bg-amber-100 text-amber-700",
    "Alto": "bg-red-100 text-red-700",
  }
  return colors[risk] || "bg-muted text-muted-foreground"
}

export default function MonitorDashboard() {
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="px-4 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">I</span>
              </div>
              <span className="font-semibold text-sm text-primary">IvexiaDMS Monitor</span>
            </div>
            <Badge variant="outline" className="gap-1 text-xs h-6">
              <RefreshCw className="h-3 w-3" />
              Auto 5s
            </Badge>
            <Badge variant="secondary" className="text-xs h-6">Ivexia - PROART</Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{lastUpdate.toLocaleTimeString("pt-BR")}</span>
            <span className="text-muted-foreground/50">|</span>
            <span>47 respostas</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 space-y-4 flex-1">
        {/* Stats Row */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-accent" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Respostas</p>
                <p className="text-lg font-bold">47</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-accent" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Participantes</p>
                <p className="text-lg font-bold">42</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Média Geral</p>
                <p className="text-lg font-bold">3.12</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Individualista</p>
                <p className="text-lg font-bold">2.78</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Coletivista</p>
                <p className="text-lg font-bold">3.46</p>
              </div>
            </div>
          </Card>
          <Card className="p-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-[10px] text-muted-foreground uppercase">Tempo Médio</p>
                <p className="text-lg font-bold">8:42</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Charts Row - 5 charts with legends */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {/* Score Evolution */}
          <Card className="col-span-2 md:col-span-1">
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                <TrendingUp className="h-3 w-3 text-accent" />
                Evolução
              </CardTitle>
              <CardDescription className="text-[9px] text-muted-foreground">
                Média diária por fator
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-1">
              <ResponsiveContainer width="100%" height={90}>
                <LineChart data={scoreEvolution}>
                  <XAxis dataKey="dia" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="individualista" stroke="#0d9488" strokeWidth={1.5} dot={false} name="Indiv." />
                  <Line type="monotone" dataKey="coletivista" stroke="#1e3a5f" strokeWidth={1.5} dot={false} name="Colet." />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#0d9488]" />
                  <span className="text-[8px] text-muted-foreground">Indiv.</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#1e3a5f]" />
                  <span className="text-[8px] text-muted-foreground">Colet.</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responses by Hour */}
          <Card>
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-accent" />
                Por Hora
              </CardTitle>
              <CardDescription className="text-[9px] text-muted-foreground">
                Respostas por horário
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-1">
              <ResponsiveContainer width="100%" height={90}>
                <BarChart data={responsesByHour}>
                  <XAxis dataKey="hora" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                  <Bar dataKey="respostas" fill="#0d9488" radius={[2, 2, 0, 0]} name="Respostas" />
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[8px] text-muted-foreground text-center mt-1">Pico: 14h (12 resp.)</p>
            </CardContent>
          </Card>

          {/* Factor Distribution */}
          <Card>
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                <PieChart className="h-3 w-3 text-accent" />
                Fatores
              </CardTitle>
              <CardDescription className="text-[9px] text-muted-foreground">
                Distribuição de estilos
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-1">
              <ResponsiveContainer width="100%" height={70}>
                <RechartsPieChart>
                  <Pie
                    data={factorDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={18}
                    outerRadius={30}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {factorDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                </RechartsPieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#0d9488]" />
                  <span className="text-[8px] text-muted-foreground">45%</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-[#1e3a5f]" />
                  <span className="text-[8px] text-muted-foreground">55%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Score Distribution */}
          <Card>
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                <BarChart3 className="h-3 w-3 text-accent" />
                Distribuição
              </CardTitle>
              <CardDescription className="text-[9px] text-muted-foreground">
                Faixas de pontuação
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-1">
              <ResponsiveContainer width="100%" height={90}>
                <BarChart data={scoreRanges} layout="vertical">
                  <XAxis type="number" tick={{ fontSize: 8 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="range" type="category" tick={{ fontSize: 7 }} width={32} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                  <Bar dataKey="count" radius={[0, 2, 2, 0]} name="Qtd.">
                    {scoreRanges.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-[8px] text-muted-foreground text-center mt-1">Moda: 3.0-4.0 (22)</p>
            </CardContent>
          </Card>

          {/* Radar Chart */}
          <Card>
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                <Target className="h-3 w-3 text-accent" />
                Dimensões
              </CardTitle>
              <CardDescription className="text-[9px] text-muted-foreground">
                Perfil organizacional
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-1">
              <ResponsiveContainer width="100%" height={90}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 6 }} />
                  <Radar name="Score" dataKey="A" stroke="#0d9488" fill="#0d9488" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
              <p className="text-[8px] text-muted-foreground text-center mt-1">6 dimensões avaliadas</p>
            </CardContent>
          </Card>
        </div>

        {/* Respostas Recentes */}
        <Card>
          <CardHeader className="p-3 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                  <Activity className="h-3 w-3 text-accent" />
                  Respostas Recentes
                </CardTitle>
                <CardDescription className="text-[9px] text-muted-foreground mt-0.5">
                  Últimas submissões com status de processamento
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] h-5">Últimas 5</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0 px-3 pb-3">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-[10px] h-7 uppercase font-semibold">Hora</TableHead>
                  <TableHead className="text-[10px] h-7 uppercase font-semibold">Código</TableHead>
                  <TableHead className="text-[10px] h-7 uppercase font-semibold text-center">Média</TableHead>
                  <TableHead className="text-[10px] h-7 uppercase font-semibold">Risco</TableHead>
                  <TableHead className="text-[10px] h-7 uppercase font-semibold text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentResponses.map((r, idx) => (
                  <TableRow key={r.id} className={idx % 2 === 0 ? "bg-muted/20" : "bg-background"}>
                    <TableCell className="text-xs py-2 text-muted-foreground">{r.time}</TableCell>
                    <TableCell className="text-xs py-2 font-mono">{r.code}</TableCell>
                    <TableCell className="text-xs py-2 text-center">
                      <span className={`inline-flex w-10 justify-center py-0.5 rounded text-white text-[10px] font-medium ${getMediaColor(r.score)}`}>
                        {r.score.toFixed(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${getRiskBadge(r.risk)}`}>
                        {r.risk}
                      </span>
                    </TableCell>
                    <TableCell className="py-2 text-center">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 mx-auto" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Questions Table */}
        <Card>
          <CardHeader className="p-3 pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xs font-medium flex items-center gap-1.5">
                  <FileText className="h-3 w-3 text-accent" />
                  Análise por Pergunta
                </CardTitle>
                <CardDescription className="text-[9px] text-muted-foreground mt-0.5">
                  Pontuação média por item da escala PROART
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] h-5">
                {questionsData.length} perguntas
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-[10px] uppercase tracking-wide font-semibold py-2">Pergunta</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide font-semibold py-2 text-center w-32">Fator</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide font-semibold py-2 w-48">Escala</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide font-semibold py-2 text-center w-20 bg-primary/10">Média</TableHead>
                    <TableHead className="text-[10px] uppercase tracking-wide font-semibold py-2 text-center w-20">Respostas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionsData.map((item, index) => (
                    <TableRow key={index} className={index % 2 === 0 ? "bg-muted/20" : "bg-background"}>
                      <TableCell className="text-xs py-2.5">{item.pergunta}</TableCell>
                      <TableCell className="text-[10px] py-2.5 text-center text-muted-foreground">{item.fator}</TableCell>
                      <TableCell className="text-[10px] py-2.5 text-muted-foreground">{item.escala}</TableCell>
                      <TableCell className="py-2.5 text-center bg-primary/5">
                        <span className={`inline-flex items-center justify-center w-11 py-0.5 rounded text-white text-xs font-medium ${getMediaColor(item.media)}`}>
                          {item.media.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs py-2.5 text-center">{item.respostas}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* PROART Footer */}
      <footer className="border-t bg-card mt-4">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Notas sobre pontuação PROART</h2>
              <p className="text-[10px] text-muted-foreground">Resumo executivo de cálculo e classificação.</p>
            </div>
            <a 
              href="https://www.scielo.br/j/ptp/a/9K9nNfsP9X4tJYLLPRVqMkM/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[10px] text-accent hover:underline flex items-center gap-1"
            >
              Referência PROART
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-3">
              <h3 className="text-xs font-semibold mb-2">Como calculamos</h3>
              <ul className="text-[10px] text-muted-foreground space-y-1 list-disc list-inside">
                <li>Itens de 1 a 5; cada fator é a média simples dos itens do fator.</li>
                <li>Cada escala (Organização do Trabalho, Estilos de Gestão, Sofrimento, Danos) é média ponderada de seus fatores.</li>
                <li>O <code className="bg-muted px-1 rounded text-[9px]">score</code> exibido vem de <code className="bg-muted px-1 rounded text-[9px]">score_data.score</code> salvo na resposta.</li>
              </ul>
              <div className="mt-3 pt-2 border-t">
                <h4 className="text-[10px] font-semibold mb-1">Leitura visual</h4>
                <p className="text-[9px] text-muted-foreground">
                  Barras: score por resposta · Pizza: distribuição de risco · Área: trajetória recente · Capacidade: usos vs. limite.
                </p>
              </div>
            </Card>
            
            <Card className="p-3">
              <h3 className="text-xs font-semibold mb-2">Classificação</h3>
              <ul className="text-[10px] text-muted-foreground space-y-1 list-disc list-inside">
                <li><strong>Org. do Trabalho & Sofrimento/Danos:</strong> Baixo 3,70–5,00 · Moderado 2,30–3,69 · Alto 1,00–2,29.</li>
                <li><strong>Estilos de Gestão:</strong> {"<"}2,50 pouco característico · 2,51–3,50 presença moderada · {">"}3,50 padrão predominante.</li>
                <li>Risco lido de <code className="bg-muted px-1 rounded text-[9px]">score_data.risk_level</code>.</li>
              </ul>
              <div className="mt-3 pt-2 border-t">
                <h4 className="text-[10px] font-semibold mb-1">Disponibilidade</h4>
                <p className="text-[9px] text-muted-foreground">
                  Monitor usa <code className="bg-muted px-1 rounded text-[9px]">token_hash</code> e fica ativo por até <strong>10 dias</strong> após a criação do link, mesmo se o link já tiver expirado.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </footer>
    </div>
  )
}
