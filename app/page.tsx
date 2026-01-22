"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Users,
  Target,
  BarChart3,
  TrendingUp,
  Clock,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts"

// Demo data
const evolutionData = [
  { day: "Seg", ind: 2.8, col: 3.2 },
  { day: "Ter", ind: 2.6, col: 3.4 },
  { day: "Qua", ind: 2.9, col: 3.1 },
  { day: "Qui", ind: 2.7, col: 3.5 },
  { day: "Sex", ind: 2.8, col: 3.4 },
]

const hourlyData = [
  { hour: "08h", count: 4, fill: "#94a3b8" },
  { hour: "10h", count: 8, fill: "#64748b" },
  { hour: "12h", count: 12, fill: "#2dd4bf" },
  { hour: "14h", count: 15, fill: "#14b8a6" },
  { hour: "16h", count: 10, fill: "#0d9488" },
  { hour: "18h", count: 6, fill: "#64748b" },
]

const factorData = [
  { name: "Individualista", value: 45, color: "#1e3a5f" },
  { name: "Coletivista", value: 55, color: "#14b8a6" },
]

const distributionData = [
  { range: "1.0-2.0", count: 5, color: "#ef4444" },
  { range: "2.0-3.0", count: 18, color: "#f59e0b" },
  { range: "3.0-4.0", count: 20, color: "#eab308" },
  { range: "4.0-5.0", count: 4, color: "#22c55e" },
]

const radarData = [
  { dim: "Hierarquia", value: 3.2, fullMark: 5 },
  { dim: "Controle", value: 2.8, fullMark: 5 },
  { dim: "Autonomia", value: 3.5, fullMark: 5 },
  { dim: "Colaboração", value: 3.8, fullMark: 5 },
  { dim: "Inovação", value: 3.1, fullMark: 5 },
  { dim: "Regras", value: 2.9, fullMark: 5 },
]

const recentResponses = [
  { id: 1, participant: "Participante #42", score: 3.12, time: "14:32", risk: "Moderado" },
  { id: 2, participant: "Participante #41", score: 2.78, time: "14:28", risk: "Moderado" },
  { id: 3, participant: "Participante #40", score: 3.85, time: "14:15", risk: "Baixo" },
  { id: 4, participant: "Participante #39", score: 2.15, time: "13:58", risk: "Alto" },
  { id: 5, participant: "Participante #38", score: 3.42, time: "13:45", risk: "Baixo" },
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
  { pergunta: "As pessoas são comprometidas com a organização mesmo quando não há retorno adequado", fator: "Estilo Coletivista", escala: "Escala dos Estilos de Gestão", media: 3.0, respostas: 2 },
  { pergunta: "O mérito das conquistas na empresa é de todos", fator: "Estilo Coletivista", escala: "Escala dos Estilos de Gestão", media: 2.5, respostas: 2 },
  { pergunta: "O trabalho coletivo é valorizado pelos gestores", fator: "Estilo Coletivista", escala: "Escala dos Estilos de Gestão", media: 2.5, respostas: 2 },
  { pergunta: "Para esta organização, o resultado do trabalho é visto como uma realização do grupo", fator: "Estilo Coletivista", escala: "Escala dos Estilos de Gestão", media: 3.0, respostas: 2 },
]

function getMediaColor(value: number) {
  if (value >= 4) return "bg-green-500"
  if (value >= 3) return "bg-yellow-500"
  if (value >= 2) return "bg-orange-500"
  return "bg-red-500"
}

function getRiskBadge(risk: string) {
  const colors: Record<string, string> = {
    Baixo: "bg-green-100 text-green-700",
    Moderado: "bg-yellow-100 text-yellow-700",
    Alto: "bg-red-100 text-red-700",
  }
  return colors[risk] || "bg-muted text-muted-foreground"
}

export default function MonitorDashboard() {
  const currentTime = new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="https://pgr.tesfire.com/ivexia_logo.svg" alt="Ivexia" className="h-6" />
              <img src="https://www.sierefire.com/_next/image?url=%2Fimages%2Fpgr-5.png&w=256&q=75" alt="PGR" className="h-6" />
            </div>
            <span className="font-semibold text-sm text-primary">IvexiaDMS Monitor</span>
            <Badge variant="outline" className="gap-1 text-xs h-6">
              <RefreshCw className="h-3 w-3" />
              Auto 5s
            </Badge>
            <Badge variant="secondary" className="text-xs h-6">
              Ivexia - PROART
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="font-mono">{currentTime}</span>
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
              <TrendingUp className="h-4 w-4 text-accent" />
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

        {/* Charts Row */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Evolution */}
          <Card className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">Evolução</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Média diária por fator</p>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={evolutionData}>
                  <XAxis dataKey="day" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                  <Line type="monotone" dataKey="ind" stroke="#1e3a5f" strokeWidth={2} dot={{ fill: "#1e3a5f", r: 2 }} name="Individualista" />
                  <Line type="monotone" dataKey="col" stroke="#14b8a6" strokeWidth={2} dot={{ fill: "#14b8a6", r: 2 }} name="Coletivista" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-3 mt-1 text-[9px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1e3a5f]" />Ind.</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#14b8a6]" />Col.</span>
            </div>
          </Card>

          {/* Hourly */}
          <Card className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">Por Hora</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Respostas recebidas hoje</p>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <XAxis dataKey="hour" tick={{ fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                  <Bar dataKey="count" radius={[2, 2, 0, 0]} name="Respostas">
                    {hourlyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[9px] text-muted-foreground mt-1">Pico: 14h (15 respostas)</p>
          </Card>

          {/* Factors */}
          <Card className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">Fatores</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Distribuição dos estilos</p>
            <div className="h-24 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={factorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={25}
                    outerRadius={40}
                    dataKey="value"
                  >
                    {factorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ fontSize: 10 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-3 mt-1 text-[9px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#1e3a5f]" />Ind. 45%</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#14b8a6]" />Col. 55%</span>
            </div>
          </Card>

          {/* Distribution */}
          <Card className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <BarChart3 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">Distribuição</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Scores por faixa</p>
            <div className="space-y-1.5 mt-2">
              {distributionData.map((item) => (
                <div key={item.range} className="flex items-center gap-2">
                  <span className="text-[9px] w-10 text-muted-foreground">{item.range}</span>
                  <div className="flex-1 h-3 bg-muted rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm"
                      style={{ width: `${(item.count / 24) * 100}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <span className="text-[9px] w-4 text-right text-muted-foreground">{item.count}</span>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-muted-foreground mt-2">Moda: 3.0-4.0 (20 resp.)</p>
          </Card>

          {/* Radar */}
          <Card className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium">Dimensões</span>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2">Perfil organizacional</p>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                  <PolarAngleAxis dataKey="dim" tick={{ fontSize: 7, fill: "#64748b" }} />
                  <Radar dataKey="value" fill="#14b8a6" fillOpacity={0.3} stroke="#0d9488" strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[9px] text-muted-foreground mt-1">Maior: Colaboração (3.8)</p>
          </Card>
        </div>

        {/* Recent Responses Table */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium">Respostas Recentes</h2>
            </div>
            <Badge variant="outline" className="text-[10px]">Últimas 5</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Participante</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground">Score</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground">Hora</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground">Risco</th>
                </tr>
              </thead>
              <tbody>
                {recentResponses.map((resp, idx) => (
                  <tr key={resp.id} className={idx % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                    <td className="py-2 px-2">{resp.participant}</td>
                    <td className="py-2 px-2 text-center font-mono">{resp.score.toFixed(2)}</td>
                    <td className="py-2 px-2 text-center text-muted-foreground">{resp.time}</td>
                    <td className="py-2 px-2 text-center">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${getRiskBadge(resp.risk)}`}>
                        {resp.risk}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Questions Table */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium">Análise por Pergunta</h2>
            </div>
            <Badge variant="outline" className="text-[10px]">{questionsData.length} perguntas</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground uppercase text-[10px]">Pergunta</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground uppercase text-[10px]">Fator</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground uppercase text-[10px]">Escala</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground uppercase text-[10px] bg-muted/50">Média</th>
                  <th className="text-center py-2 px-2 font-medium text-muted-foreground uppercase text-[10px]">Respostas</th>
                </tr>
              </thead>
              <tbody>
                {questionsData.map((q, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                    <td className="py-2 px-2 max-w-md">{q.pergunta}</td>
                    <td className="py-2 px-2 text-muted-foreground whitespace-nowrap">{q.fator}</td>
                    <td className="py-2 px-2 text-muted-foreground whitespace-nowrap">{q.escala}</td>
                    <td className="py-2 px-2 text-center bg-muted/30">
                      <span className={`inline-flex items-center justify-center w-12 py-0.5 rounded-full text-white text-[11px] font-medium ${getMediaColor(q.media)}`}>
                        {q.media.toFixed(2)}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-center text-muted-foreground">{q.respostas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      {/* PROART Footer */}
      <footer className="border-t bg-muted/30 px-4 py-3 mt-auto">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-xs font-semibold">PROART</h3>
              <span className="text-[10px] text-muted-foreground">Protocolo de Avaliação dos Riscos Psicossociais no Trabalho</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              Escala de 1-5 pontos. <span className="text-green-600 font-medium">Baixo: 3,70-5,00</span> · <span className="text-yellow-600 font-medium">Moderado: 2,30-3,69</span> · <span className="text-red-600 font-medium">Alto: 1,00-2,29</span>. Estilos de Gestão: {"<"}2,50 pouco característico · 2,51-3,50 moderado · {">"}3,50 predominante.
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] text-muted-foreground">
              Monitor ativo por <strong>10 dias</strong> via <code className="bg-muted px-1 rounded text-[9px]">token_hash</code>
            </p>
            <a href="#" className="text-[10px] text-accent hover:underline inline-flex items-center gap-1 mt-0.5">
              Referência PROART <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
