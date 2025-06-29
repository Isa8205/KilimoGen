import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"

interface OverviewCardProps {
  title: string
  count: number
  icon: ReactNode
  link: string
  color: string
}

export function OverviewCard({ title, count, icon, link, color }: OverviewCardProps) {
  return (
    <NavLink
      to={link}
      className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
    >
      <div className="p-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-3`}>{icon}</div>
        <h3 className="text-lg font-medium text-primary">{title}</h3>
        <p className="text-2xl font-bold text-primary mt-1">{count}</p>
      </div>
    </NavLink>
  )
}
