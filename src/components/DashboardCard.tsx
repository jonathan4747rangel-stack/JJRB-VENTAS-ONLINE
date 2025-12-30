'use client'

interface DashboardCardProps {
  title: string
  value: string | number
  icon: string
  trend?: string
}

export default function DashboardCard({ title, value, icon, trend }: DashboardCardProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center">
        <div className="text-2xl mr-4">{icon}</div>
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      {trend && (
        <div className="mt-4">
          <span className="text-sm text-green-600">
            <span className="inline-flex items-center">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              {trend}
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
