import { Shield, RefreshCw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function MonitorNavbar() {
  return (
    <header className="border-b bg-background">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-sm text-emerald-600">IvexiaDMS</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Monitor de Respostas
          </span>
          <Badge variant="secondary" className="text-[10px] gap-1 h-5">
            <RefreshCw className="h-3 w-3" />
            Auto 5s
          </Badge>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="h-3.5 w-3.5 text-amber-500" />
          <span>Cloudflare</span>
        </div>
      </div>
    </header>
  )
}
