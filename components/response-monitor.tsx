"use client"

import React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Building2, Link2, Clock, FileText, Shield } from "lucide-react"

interface MonitorData {
  totalResponses: number
  tokenHash: string
  company: string
  research: string
  linkUsage: number
  linkLimit: number
  createdAt: string
  expiresAt: string
  timezone: string
}

interface ResponseMonitorProps {
  token: string
  setToken: (token: string) => void
  isLoaded: boolean
  onLoad: () => void
  data: MonitorData
}

export function ResponseMonitor({
  token,
  setToken,
  isLoaded,
  onLoad,
  data,
}: ResponseMonitorProps) {
  return (
    <div className="font-sans min-h-screen flex flex-col bg-muted/50">
      {/* Header + Content merged */}
      <div className="border-b p-4 bg-muted">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-sm text-emerald-600">IvexiaDMS</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Monitor de Respostas
            </span>
            <Badge variant="secondary" className="text-[10px] gap-1 h-5">
              <RefreshCw className="h-3 w-3" />
              Auto 5s
            </Badge>
            <Badge variant="outline" className="text-[10px] h-5 text-muted-foreground">
              Válido por 10 dias
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-amber-500" />
            <span>Cloudflare</span>
          </div>
        </div>

        <div className="flex gap-2 mb-1">
          <Input
            placeholder="Cole o token de monitoramento aqui"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="h-9 text-sm font-mono max-w-xs"
          />
          <Button
            onClick={onLoad}
            className="h-9 px-6 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Carregar
          </Button>
        </div>
        <p className="text-[11px] text-muted-foreground">
          Fuso: {data.timezone}
        </p>

        {/* Stats Grid */}
        {isLoaded && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4 pt-4 border-t">
            <StatCard
              icon={<FileText className="h-4 w-4" />}
              label="Respostas"
              value={data.totalResponses.toString()}
              sublabel={`Hash: ${data.tokenHash}`}
            />
            <StatCard
              icon={<Building2 className="h-4 w-4" />}
              label="Empresa"
              value={data.company}
              sublabel={data.research}
              truncate
            />
            <StatCard
              icon={<Link2 className="h-4 w-4" />}
              label="Usos do Link"
              value={`${data.linkUsage}/${data.linkLimit}`}
              sublabel={`Criado: ${data.createdAt}`}
            />
            <StatCard
              icon={<Clock className="h-4 w-4" />}
              label="Expira em"
              value={data.expiresAt.split(",")[0]}
              sublabel={data.expiresAt.split(",")[1]?.trim()}
              highlight
            />
          </div>
        )}
      </div>

      {/* Background fill */}
      <div className="flex-1 bg-muted/50" />
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
  truncate,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sublabel?: string
  truncate?: boolean
  highlight?: boolean
}) {
  return (
    <div className="bg-background border rounded-lg p-3">
      <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className={`text-lg font-semibold ${highlight ? "text-emerald-600" : "text-foreground"}`}>
        {value}
      </p>
      {sublabel && (
        <p className={`text-[10px] text-muted-foreground mt-0.5 ${truncate ? "truncate" : ""}`}>
          {sublabel}
        </p>
      )}
    </div>
  )
}
