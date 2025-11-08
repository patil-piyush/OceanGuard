"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Waves, Trash2, Droplet, Wind, LogOut } from "lucide-react"

interface DashboardNavProps {
  activeTab: "debris" | "oil-spills" | "wind"
  setActiveTab: (tab: "debris" | "oil-spills" | "wind") => void
}

export default function DashboardNav({ activeTab, setActiveTab }: DashboardNavProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const navItems = [
    { id: "debris", label: "Debris Detection", icon: Trash2 },
    { id: "oil-spills", label: "Oil Spills", icon: Droplet },
    { id: "wind", label: "Wind Analysis", icon: Wind },
  ]

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center">
              <Waves className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="font-bold text-xl hidden sm:inline">OceanGuard</span>
          </Link>

          {/* Navbar Tabs */}
          <div className="flex items-center gap-2 sm:gap-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === (item.id as "debris" | "oil-spills" | "wind")
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as "debris" | "oil-spills" | "wind")}
                  className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition font-medium text-sm sm:text-base ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-card"
                  }`}
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.label.split(" ")[0]}</span>
                </button>
              )
            })}
          </div>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="border-border text-muted-foreground hover:text-foreground bg-transparent"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
