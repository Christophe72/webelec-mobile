"use client"

import { Info, AlertTriangle, AlertCircle } from "lucide-react"
import type { DashboardEvent } from "@/types/dashboard"

interface ActivityItemProps {
  event: DashboardEvent
  onClick?: (event: DashboardEvent) => void
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return "À l'instant"
  if (diffInSeconds < 300) return "Il y a quelques minutes"
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `Il y a ${minutes} min`
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `Il y a ${hours}h`
  }

  const isToday = date.toDateString() === now.toDateString()
  if (isToday) return "Aujourd'hui"

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()
  if (isYesterday) return "Hier"

  const days = Math.floor(diffInSeconds / 86400)
  if (days <= 7) return `Il y a ${days}j`

  // Format fr-BE pour dates plus anciennes
  return date.toLocaleDateString("fr-BE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

function SeverityIcon({ severity }: { severity: DashboardEvent["severity"] }) {
  const iconProps = { className: "h-5 w-5 shrink-0" }

  switch (severity) {
    case "INFO":
      return <Info {...iconProps} className="h-5 w-5 shrink-0 text-blue-500" />
    case "WARNING":
      return <AlertTriangle {...iconProps} className="h-5 w-5 shrink-0 text-amber-500" />
    case "CRITICAL":
      return <AlertCircle {...iconProps} className="h-5 w-5 shrink-0 text-orange-600" />
  }
}

export function ActivityItem({ event, onClick }: ActivityItemProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(event)}
      className={`
        w-full flex items-start gap-3 p-3 rounded-lg text-left border
        transition-colors
        ${event.severity === "CRITICAL"
          ? "border-orange-500/30 bg-orange-500/5 hover:bg-orange-500/10"
          : event.severity === "WARNING"
            ? "border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10"
            : "border-border/50 bg-background hover:bg-muted/30"
        }
      `}
    >
      <div className="mt-0.5">
        <SeverityIcon severity={event.severity} />
      </div>
      <div className="flex-1 min-w-0 space-y-1">
        <p className="text-sm font-medium leading-snug">
          {event.message}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-xs text-muted-foreground font-medium">
            {getRelativeTime(event.createdAt)}
          </p>
          {event.severity === "CRITICAL" && (
            <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wide">
              Urgent
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
