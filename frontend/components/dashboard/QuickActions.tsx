"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, HardHat, Search, LucideIcon } from "lucide-react"

type QuickAction = {
  label: string
  description: string
  href: string
  icon: LucideIcon
}

const quickActions: QuickAction[] = [
  {
    label: "Nouveau devis",
    description: "Créer un devis client",
    href: "/devis",
    icon: FileText,
  },
  {
    label: "Nouveau chantier",
    description: "Planifier une intervention",
    href: "/chantiers/nouveau",
    icon: HardHat,
  },
  {
    label: "Recherche catalogue",
    description: "Parcourir les produits",
    href: "/catalogue",
    icon: Search,
  },
]

export function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {quickActions.map((action) => {
        const Icon = action.icon
        return (
          <Link
            key={action.href}
            href={action.href}
            className="block focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-lg"
          >
            <Card className="border-border/50 transition-all hover:border-primary/30 hover:shadow-md cursor-pointer h-full">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-md bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight">
                    {action.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
